import { flatten, fromPairs } from 'lodash';
import { useQuery } from 'react-query';
import { changeCurrentProgram, loadPrograms, loadRelationshipTypes } from './Events';

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
          fields: "id,name,displayName,programType,trackedEntityType[id,name,trackedEntityTypeAttributes[trackedEntityAttribute[id,name]]],programTrackedEntityAttributes[trackedEntityAttribute[id,name]],programStages[id,name,repeatable,programStageDataElements[dataElement[id,name]]]",
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
        fields: "id,name,displayName,programType,trackedEntityType[id,name,trackedEntityTypeAttributes[trackedEntityAttribute[id,name]]],programTrackedEntityAttributes[trackedEntityAttribute[id,name]],programStages[id,name,repeatable,programStageDataElements[dataElement[id,name]]]",
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

export const useTracker = (d2: any, program: string, relations: any) => {
  const api = d2.Api.getApi();
  console.log(relations)
  return useQuery<any, Error>(
    ["tracker", program],
    async () => {
      const { trackedEntityInstances } = await api.get(`trackedEntityInstances.json`, {
        fields: "attributes[attribute,value,displayName],relationships,enrollments[enrollmentDate,relationships,events[eventDate,relationships,dataValues[dataElement,value,displayName]]]",
        ouMode: 'ALL',
        program: program
      });

      const relationships: string[] = flatten(trackedEntityInstances.map((tei: any) => tei.relationships.map((relationship: any) => relationship.relationshipType)));
      console.log(relationships);
      // const data = await Promise.all(relationships.map((r: string) => api.get(`relationships/${r}`)));
      return trackedEntityInstances;
    }
  );
}
