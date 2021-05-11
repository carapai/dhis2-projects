import { domain, reportDomain } from './Domains';
import { Relation } from './types';
export const changeMessage = domain.createEvent<string>("change message");
export const changeProgram = reportDomain.createEvent<string>('change program')
export const addStage = reportDomain.createEvent<string>('add stage')
export const removeStage = reportDomain.createEvent<string>('remove stage')
export const changeOption = reportDomain.createEvent<[string, 'any' | 'first' | 'last' | 'all']>('change stage option')
export const addRelationship = reportDomain.createEvent<[string, string, Relation]>('add relationship');
export const removeRelationship = reportDomain.createEvent<[string, string]>('remove relationship');
export const addProgramRelation = reportDomain.createEvent<[string, Relation]>('add program relation');
export const addEnrollmentRelation = reportDomain.createEvent<[string, Relation]>('add enrollment relation');
export const removeProgramRelation = reportDomain.createEvent<string>('remove program relation');
export const removeEnrollmentRelation = reportDomain.createEvent<string>('remove enrollment relation');
export const changeCurrentProgram = reportDomain.createEvent<any>('change current program');
export const changeFilter = reportDomain.createEvent<string>('change filter');
export const addToSelectedFields = reportDomain.createEvent<any>('add to selected fields');
export const removeFromSelectedFields = reportDomain.createEvent<any>('remove from selected fields');
export const loadPrograms = reportDomain.createEvent<{ [key: string]: any }>('load programs');
export const loadRelationshipTypes = reportDomain.createEvent<{ [key: string]: any }>('load relationship types');
