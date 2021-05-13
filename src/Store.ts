import { flatten, uniq, uniqBy } from 'lodash';
import { domain, reportDomain } from './Domains';
import {
  addEnrollmentRelation,
  addProgramRelation,
  addRelationship,
  addStage,
  addToSelectedFields,
  changeCurrentProgram,
  changeFilter,
  changeMessage,
  changeOption,
  changeProgram,
  loadPrograms,
  loadRelationshipTypes,
  removeEnrollmentRelation,
  removeFromSelectedFields,
  removeProgramRelation,
  removeRelationship,
  removeStage
} from "./Events";
import { ReportFilters, Store } from './types';

export const dashboards = domain.createStore<Store>({ message: '' })
  .on(changeMessage, (state, message: string) => {
    return { ...state, message }
  });

export const reportFilterStore = reportDomain.createStore<ReportFilters>({
  program: '',
  orgUnits: [],
  enrollmentRelationships: {},
  periods: [],
  programRelationships: {},
  stages: {},
  filter: '',
  programs: {},
  relationshipTypes: {},
  selectedFields: []
})
  .on(changeProgram, (state, program: string) => {
    return { ...state, program }
  })
  .on(addStage, (state, stage: string) => {
    return { ...state, stages: { ...state.stages, [stage]: { whichEvents: 'first', relationships: {} } } }
  })
  .on(removeStage, (state, stage: string) => {
    const { [stage]: foo, ...stages } = state.stages;
    console.log(stages)
    return { ...state, stages }
  })
  .on(changeOption, (state, [stage, whichEvents]) => {
    const { [stage]: edited, ...stages } = state.stages;
    return { ...state, stages: { ...stages, [stage]: { ...edited, whichEvents } } }
  })
  .on(addRelationship, (state, [stage, relation, relationship]) => {
    const { [stage]: edited, ...stages } = state.stages;
    return { ...state, stages: { ...stages, [stage]: { ...edited, relationships: { ...edited.relationships, [relation]: { relation: relationship.relation, type: relationship.type } } } } }
  })
  .on(removeRelationship, (state, [stage, relationship]) => {
    const { [stage]: edited, ...stages } = state.stages;
    const { [relationship]: currentRelationship, ...remaining } = edited.relationships
    return { ...state, stages: { ...stages, [stage]: { ...edited, relationships: remaining } } }
  })
  .on(addProgramRelation, (state, [relation, relationship]) => {
    return { ...state, programRelationships: { ...state.programRelationships, [relation]: { relation: relationship.relation, type: relationship.type } } }
  })
  .on(addEnrollmentRelation, (state, [relation, relationship]) => {
    return { ...state, enrollmentRelationships: { ...state.enrollmentRelationships, [relation]: { relation: relationship.relation, type: relationship.type } } }
  })
  .on(removeProgramRelation, (state, relationship: string) => {
    const { [relationship]: foo, ...pr } = state.programRelationships;
    return { ...state, programRelationships: pr }
  })
  .on(removeEnrollmentRelation, (state, relationship: string) => {
    const { [relationship]: foo, ...er } = state.enrollmentRelationships;
    return { ...state, er }
  })
  .on(changeCurrentProgram, (state, payload) => {
    return { ...state, currentProgram: payload }
  })
  .on(changeFilter, (state, payload) => {
    return { ...state, filter: payload }
  })
  .on(addToSelectedFields, (state, payload) => {

    return { ...state, selectedFields: [...state.selectedFields, payload] }
  })
  .on(removeFromSelectedFields, (state, payload) => {
    const selectedFields = state.selectedFields.filter((field: any) => field.id !== payload.id)
    return { ...state, selectedFields }
  })
  .on(loadPrograms, (state, payload) => {
    return { ...state, programs: payload }
  })
  .on(loadRelationshipTypes, (state, payload) => {
    return { ...state, relationshipTypes: payload }
  });

export const stagesStore = reportFilterStore.map((state) => {
  return Object.keys(state.stages)
});

export const programRelations = reportFilterStore.map((state) => {
  const psEntityRelation = flatten(Object.values(state.stages).map((d) => Object.values(d.relationships).filter((x) => x.type === 'entity').map((x) => x.relation)));
  const psEnrollmentRelation = flatten(Object.values(state.stages).map((d) => Object.values(d.relationships).filter((x) => x.type === 'program').map((x) => x.relation)));
  const psStageRelation = flatten(Object.values(state.stages).map((d) => Object.values(d.relationships).filter((x) => x.type === 'stage').map((x) => x.relation)));
  const psAllElementsRelation = flatten(Object.values(state.stages).map((d) => Object.values(d.relationships).filter((x) => x.type === 'all').map((x) => x.relation)));

  const enrollEntityRelation = Object.values(state.enrollmentRelationships).filter((relation) => relation.type === 'entity').map((x) => x.relation);
  const enrollEnrollmentRelation = Object.values(state.enrollmentRelationships).filter((relation) => relation.type === 'program').map((x) => x.relation);
  const enrollStageRelation = Object.values(state.enrollmentRelationships).filter((relation) => relation.type === 'stage').map((x) => x.relation);
  const enrollAllElementsRelation = Object.values(state.enrollmentRelationships).filter((relation) => relation.type === 'all').map((x) => x.relation);

  const pEntityRelation = Object.values(state.programRelationships).filter((relation) => relation.type === 'entity').map((x) => x.relation);
  const pEnrollmentRelation = Object.values(state.programRelationships).filter((relation) => relation.type === 'program').map((x) => x.relation);
  const pStageRelation = Object.values(state.programRelationships).filter((relation) => relation.type === 'stage').map((x) => x.relation);
  const pAllElementsRelation = Object.values(state.programRelationships).filter((relation) => relation.type === 'all').map((x) => x.relation);
  return {
    trackedEntities: [...psEntityRelation, ...enrollEntityRelation, ...pEntityRelation],
    programs: [...psEnrollmentRelation, ...enrollEnrollmentRelation, ...pEnrollmentRelation],
    programsElement: [...psAllElementsRelation, ...enrollAllElementsRelation, ...pAllElementsRelation],
    stages: [...psStageRelation, ...enrollStageRelation, ...pStageRelation]
  }
});

export const defaultFields = reportFilterStore.map((state) => {
  const psEntityRelation = flatten(Object.values(state.stages).map((d) => Object.values(d.relationships).filter((x) => x.type === 'entity').map((x) => x.relation)));
  const psEnrollmentRelation = flatten(Object.values(state.stages).map((d) => Object.values(d.relationships).filter((x) => x.type === 'program').map((x) => x.relation)));
  const psStageRelation = flatten(Object.values(state.stages).map((d) => Object.values(d.relationships).filter((x) => x.type === 'stage').map((x) => x.relation)));
  const psAllElementsRelation = flatten(Object.values(state.stages).map((d) => Object.values(d.relationships).filter((x) => x.type === 'all').map((x) => x.relation)));

  const enrollEntityRelation = Object.values(state.enrollmentRelationships).filter((relation) => relation.type === 'entity').map((x) => x.relation);
  const enrollEnrollmentRelation = Object.values(state.enrollmentRelationships).filter((relation) => relation.type === 'program').map((x) => x.relation);
  const enrollStageRelation = Object.values(state.enrollmentRelationships).filter((relation) => relation.type === 'stage').map((x) => x.relation);
  const enrollAllElementsRelation = Object.values(state.enrollmentRelationships).filter((relation) => relation.type === 'all').map((x) => x.relation);

  const pEntityRelation = Object.values(state.programRelationships).filter((relation) => relation.type === 'entity').map((x) => x.relation);
  const pEnrollmentRelation = Object.values(state.programRelationships).filter((relation) => relation.type === 'program').map((x) => x.relation);
  const pStageRelation = Object.values(state.programRelationships).filter((relation) => relation.type === 'stage').map((x) => x.relation);
  const pAllElementsRelation = Object.values(state.programRelationships).filter((relation) => relation.type === 'all').map((x) => x.relation);

  const trackedEntities = uniq([...psEntityRelation, ...enrollEntityRelation, ...pEntityRelation]);
  const programs = uniq([...psEnrollmentRelation, ...enrollEnrollmentRelation, ...pEnrollmentRelation]);
  const programsElement = uniq([...psAllElementsRelation, ...enrollAllElementsRelation, ...pAllElementsRelation]);
  const stages = uniq([...psStageRelation, ...enrollStageRelation, ...pStageRelation]);

  const a = flatten(Object.values(state.programs)
    .filter((program: any) => trackedEntities.indexOf(program.trackedEntityType.id) !== -1)
    .map((tt: any) => tt.trackedEntityType.trackedEntityTypeAttributes.map((a: any) => {
      return {
        ...a.trackedEntityAttribute,
        display: a.trackedEntityAttribute.name,
        key: a.trackedEntityAttribute.id,
        name: `[PA] ${a.trackedEntityAttribute.name}`
      }
    })));

  const b = flatten(Object.values(state.programs)
    .filter((program: any) => programs.indexOf(program.id) !== -1)
    .map((tt: any) => tt.programTrackedEntityAttributes.map((a: any) => {
      return {
        ...a.trackedEntityAttribute,
        display: a.trackedEntityAttribute.name,
        key: a.trackedEntityAttribute.id,
        name: `[PA] ${a.trackedEntityAttribute.name}`
      }
    })));

  const c = flatten(Object.values(state.programs).filter((p: any) => programsElement.indexOf(p.id) !== -1)
    .map((p: any) => p.programStages
      .map((ps: any) => {
        return ps.programStageDataElements.map((psde: any) => {
          return { ...psde.dataElement, key: `${psde.dataElement.id}-${ps.id}`, display: psde.dataElement.name, name: `[DE-${ps.code}] ${psde.dataElement.name}` }
        })
      })));

  const d = flatten(flatten(Object.values(state.programs)
    .map((p: any) => p.programStages))
    .filter((ps: any) => stages.indexOf(ps.id) !== -1))
    .map((ps: any) => {
      return ps.programStageDataElements.map((psde: any) => {
        return { ...psde.dataElement, key: `${psde.dataElement.id}-${ps.id}`, display: psde.dataElement.name, name: `[DE-${ps.code}] ${psde.dataElement.name}` }
      })
    });

  if (!!state.program) {
    const selectedStages = Object.keys(state.stages);
    const attributes = state.programs[state.program]?.programTrackedEntityAttributes.map((x: any) => {
      return {
        name: `[PA] ${x.trackedEntityAttribute.name}`,
        display: x.trackedEntityAttribute.name,
        key: x.trackedEntityAttribute.id,
        id: x.trackedEntityAttribute.id,
      }
    });
    const elements = state.programs[state.program]?.programStages.filter((ps: any) => selectedStages.indexOf(ps.id) !== -1).map((ps: any) => {
      const elements = ps.programStageDataElements.map((psde: any) => {
        return {
          key: `${psde.dataElement.id}-${ps.id}`,
          display: psde.dataElement.name,
          name: `[DE-${ps.code || ps.name}] ${psde.dataElement.name}`,
          id: psde.dataElement.id
        }
      });

      return [
        {
          key: `eventDate-${ps.id}`,
          display: `${ps.code || ps.name} Date`,
          name: `${ps.code || ps.name} Date`,
          id: `eventDate-${ps.id}`
        },
        ...elements
      ]
    });

    const defaultFields = [
      {
        key: 'orgUnitName',
        display: 'Organisation',
        name: `[OU] Organisation`,
        id: 'orgUnitName'
      },
      {
        key: 'enrollmentDate',
        display: 'Enrollment Date',
        name: `[PE] Enrollment Date`,
        id: 'enrollmentDate'
      }
    ]

    const allFields = uniqBy([...defaultFields, ...attributes, ...a, ...b, ...flatten(elements), ...flatten(c), ...flatten(d)], 'id');
    return allFields.filter((field: any) => {
      return (String(field.name).toLowerCase().includes(state.filter.toLowerCase()) || String(field.id).includes(state.filter)) && state.selectedFields.map((f: any) => f.id).indexOf(field.id) === -1
    });
  }
  return []
})
