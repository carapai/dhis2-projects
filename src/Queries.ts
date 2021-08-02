import {
  sortedUniqBy,
  groupBy,
  fromPairs,
  uniq
} from 'lodash';
import { useQuery } from 'react-query';
import { changeCurrentProgram, loadPrograms, loadRelationshipTypes } from './Events';
import { Relation, Options } from './types';

const processRelations = (data: { [key: string]: any[] }, relationshipType: string, what: string) => {
  const current = data[relationshipType];
  if (!!current && current.length > 0 && what === 'entity') {
    return fromPairs(current[0].from.trackedEntityType.attributes.map((a: any) => [a.attribute, a.value]));
  }
  if (!!current && current.length > 0 && what === 'program') {
    return fromPairs(current[0].from.trackedEntityInstance.attributes.map((a: any) => [a.attribute, a.value]));
  }
  return {};
}

async function getEventRelationships(event: string, options: Options, api: any) {
  let results = {};
  const relationshipTypes = Object.keys(options.relationships);
  if (relationshipTypes.length > 0) {
    const relationships = await api.get('relationships', { event });
    const trackerRelationObjects = groupBy(relationships, 'relationshipType');
    relationshipTypes.forEach((p: string) => {
      const currentRelationship = options.relationships[p];
      results = { ...results, ...processRelations(trackerRelationObjects, p, currentRelationship.type) }
    });
  }
  return results;
}

function availableEvents(events: any[], stageId: string, options: Options, api: any) {
  const foundEvents = events.filter((ev: any) => ev.programStage === stageId);
  if (foundEvents.length > 0) {

    const available = {
      any: async () => {
        const { eventDate, dataValues, event } = foundEvents[0];
        const relationships = await getEventRelationships(event, options, api);
        return { ...relationships, [`eventDate-${stageId}`]: eventDate, ...fromPairs(dataValues.map(({ dataElement, value }) => [`${dataElement}-${stageId}`, value])) }
      },
      first: async () => {
        const { eventDate, dataValues, event } = sortedUniqBy(foundEvents, 'eventDate')[0];
        const relationships = await getEventRelationships(event, options, api);
        return { ...relationships, [`eventDate-${stageId}`]: eventDate, ...fromPairs(dataValues.map(({ dataElement, value }) => [`${dataElement}-${stageId}`, value])) }
      },
      last: async () => {
        const { eventDate, dataValues, event } = sortedUniqBy(foundEvents, 'eventDate')[foundEvents.length - 1];
        const relationships = await getEventRelationships(event, options, api);
        return { ...relationships, [`eventDate-${stageId}`]: eventDate, ...fromPairs(dataValues.map(({ dataElement, value }) => [`${dataElement}-${stageId}`, value])) }
      },
      all: async () => {
        let allEvents = [];
        for (const { eventDate, dataValues, event } of foundEvents) {
          const relationships = await getEventRelationships(event, options, api);
          const processedEvent = { ...relationships, [`eventDate-${stageId}`]: eventDate, ...fromPairs(dataValues.map(({ dataElement, value }) => [`${dataElement}-${stageId}`, value])) };
          allEvents = [...allEvents, processedEvent]
        }
        return allEvents;
      }
    }
    return available[options.whichEvents];
  }
  return async () => { };
}

export function useReports(d2: any, program: string, orgUnit: string) {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    ["reports", program, orgUnit],
    async () => {
      const { options } = await api.get(`optionSets/${program}`, {
        fields: "options[id,code,name]",
      });
      return options;
    },
    { retryDelay: 1000 }
  );
}

export function usePrograms(d2: any) {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    ["programs"],
    async () => {
      const [{ programs }, { relationshipTypes }] = await Promise.all([
        api.get(`programs`, {
          fields: "id,code,name,displayName,programType,trackedEntityType[id,code,name,trackedEntityTypeAttributes[trackedEntityAttribute[id,code,name]]],programTrackedEntityAttributes[trackedEntityAttribute[id,code,name]],programStages[id,code,name,repeatable,programStageDataElements[dataElement[id,code,name]]]",
          paging: false
        }),
        api.get(`relationshipTypes`, {
          fields: "fromToName,id,toConstraint,fromConstraint",
          paging: false
        })]);
      loadPrograms(fromPairs(programs.map((p: any) => [p.id, p])));
      loadRelationshipTypes(relationshipTypes);
      return { programs, relationshipTypes };
    },
    { retryDelay: 1000 }
  );
}

export function useProgram(d2: any, program: string) {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    ["programs", program],
    async () => {
      const currentProgram = await api.get(`programs/${program}.json`, {
        fields: "id,name,displayName,programType,trackedEntityType[id,code,name,trackedEntityTypeAttributes[trackedEntityAttribute[id,name]]],programTrackedEntityAttributes[trackedEntityAttribute[id,name]],programStages[id,name,code,repeatable,programStageDataElements[dataElement[id,name]]]",
      });
      changeCurrentProgram(currentProgram);
      return currentProgram;
    },
    { retryDelay: 1000 }
  );
}

export function useOtherPrograms(d2: any, trackedEntities: any[], programs: any[], programsElement: any[], stages: any[]) {
  const api = d2.Api.getApi();
  let trackedEntityQuery = new Promise((resolve) => { resolve({ trackedEntityTypes: [{ trackedEntityTypeAttributes: [] }] }); });
  let programsQuery = new Promise((resolve) => { resolve({ programs: [{ programTrackedEntityAttributes: [] }] }); });
  let elementsQuery = new Promise((resolve) => { resolve({ programs: [{ programStages: [{ programStageDataElements: [] }] }] }); });
  let stagesQuery = new Promise((resolve) => { resolve({ programStages: [{ programStageDataElements: [] }] }); });

  if (trackedEntities.length > 0) {
    trackedEntityQuery = api.get(`trackedEntityTypes.json`, {
      filter: `id:in:[${trackedEntities.join(',')}]`,
      fields: "trackedEntityTypeAttributes[trackedEntityAttribute[id,code,name]]",
      paging: false
    });
  }

  if (programs.length > 0) {
    programsQuery = api.get(`programs.json`, {
      filter: `id:in:[${programs.join(',')}]`,
      fields: "programTrackedEntityAttributes[trackedEntityAttribute[id,code,name]]",
      paging: false
    })
  }

  if (programsElement.length > 0) {
    elementsQuery = api.get(`programs.json`, {
      filter: `id:in:[${programsElement.join(',')}]`,
      fields: "programStages[id,name,programStageDataElements[dataElement[id,code,name]]]",
      paging: false
    })
  }

  if (stages.length > 0) {
    stagesQuery = api.get(`programStages.json`, {
      filter: `id:in:[${stages.join(',')}]`,
      fields: "programStageDataElements[dataElement[id,code,name]]",
      paging: false
    })
  }
  return useQuery<any, Error>(
    ["otherPrograms", ...trackedEntities, ...programs, ...programsElement, ...stages],
    async () => {
      const [result1, result2, result3, result4] = await Promise.all([trackedEntityQuery, programsQuery, elementsQuery, stagesQuery]);
      return [result1, result2, result3, result4]
    }
  );
}

export const useTracker = (
  d2: any,
  program: string,
  stages: { [key: string]: Options },
  programRelationships: { [key: string]: Relation },
  enrollmentRelationships: { [key: string]: Relation },
) => {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    ["tracker",
      program],
    async () => {
      let data = [];
      const { trackedEntityInstances } = await api.get(`trackedEntityInstances.json`, {
        fields: "trackedEntityInstance,attributes[attribute,value],enrollments[enrollment,enrollmentDate,orgUnit,orgUnitName,program,events[event,programStage,eventDate,dataValues[dataElement,value,displayName]]]",
        ouMode: 'ALL',
        program: program
      });
      const pRelationsTypes = Object.keys(programRelationships);
      const eRelationsTypes = Object.keys(enrollmentRelationships);
      for (const { trackedEntityInstance, attributes, enrollments } of trackedEntityInstances) {
        let calculatedFields = fromPairs(attributes.map((a: any) => [a.attribute, a.value]));
        if (pRelationsTypes.length > 0) {
          const trackerRelations = await api.get('relationships', { tei: trackedEntityInstance });
          const trackerRelationObjects = groupBy(trackerRelations, 'relationshipType');
          pRelationsTypes.map((p: string) => {
            const currentRelationship = programRelationships[p];
            calculatedFields = { ...calculatedFields, ...processRelations(trackerRelationObjects, p, currentRelationship.type) }
          })
        }
        const { events, enrollment, orgUnitName, enrollmentDate } = enrollments.find((e: any) => e.program === program);

        calculatedFields = { ...calculatedFields, orgUnitName, enrollmentDate }
        if (eRelationsTypes.length > 0) {
          const enrollmentRelations = await api.get('relationships', { enrollment });
          const enrollmentRelationObjects = groupBy(enrollmentRelations, 'relationshipType');
          eRelationsTypes.map((p: string) => {
            const currentRelationship = enrollmentRelationships[p];
            calculatedFields = { ...calculatedFields, ...processRelations(enrollmentRelationObjects, p, currentRelationship.type) }
          })
        }
        for (const [stageId, info] of Object.entries(stages)) {
          const eventData = await availableEvents(events, stageId, info, api)()
          calculatedFields = { ...calculatedFields, enrollmentDate, ...eventData }
        }
        data = [...data, calculatedFields];
      }
      return data;
    },
    {
      enabled: false
    }
  );
}

export const useTracker2 = (
  d2: any,
  program: string,
  page: number,
  pageSize: number
) => {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    ["tracker", program, page, pageSize],
    async () => {
      let data = [];
      const { trackedEntityInstances, ...others } = await api.get(`trackedEntityInstances.json`, {
        fields: "*",
        ouMode: 'ALL',
        page,
        pageSize,
        program: program,
        totalPages: true
      });

      const relations = trackedEntityInstances.map(({ relationships }: any) => {
        const houseHold = relationships.find(({ relationshipType }: any) => relationshipType === "hly709n51z0");
        if (houseHold) {
          return houseHold.from.trackedEntityInstance.trackedEntityInstance
        }
      }).filter((x: any) => !!x);

      let processedHouseholds = {};


      if (relations.length > 0) {
        const { trackedEntityInstances: households } = await api.get('trackedEntityInstances', { trackedEntityInstance: uniq(relations).join(';') });
        processedHouseholds = fromPairs(households.map(({ attributes, trackedEntityInstance }: any) => {
          return [trackedEntityInstance, fromPairs(attributes.map(({ attribute, value }: any) => [attribute, value]))]
        }))
      }


      for (const { trackedEntityInstance, attributes, enrollments, relationships } of trackedEntityInstances) {
        let calculatedFields: any = { ...fromPairs(attributes.map((a: any) => [a.attribute, a.value])), ['hly709n51z0']: {} };
        const houseHold = relationships.find(({ relationshipType }: any) => relationshipType === "hly709n51z0");
        if (houseHold) {
          calculatedFields = { ...calculatedFields, ['hly709n51z0']: processedHouseholds[houseHold.from.trackedEntityInstance.trackedEntityInstance] }
        }
        const { events, orgUnitName, enrollmentDate } = enrollments.find((e: any) => e.program === program);
        const eventGroups = groupBy(events, 'programStage');
        const stageEvents = Object.entries(eventGroups).map(([stage, foundEvents]) => {
          const processedEvents = foundEvents.map(({ dataValues }: any) => {
            return fromPairs(dataValues.map((dv: any) => [dv.dataElement, dv.value]))
          })
          return [stage, { ...processedEvents }]
        });
        calculatedFields = { trackedEntityInstance, ...calculatedFields, orgUnitName, enrollmentDate: new Intl.DateTimeFormat('fr').format(Date.parse(enrollmentDate)), ...fromPairs(stageEvents) }
        data = [...data, calculatedFields];
      }
      return { trackedEntityInstances: data, ...others.pager };
    },
    { keepPreviousData: true }
  );
}
