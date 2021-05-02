import { changeMessage } from './Events';
import axios, { AxiosInstance } from 'axios';

const insertMetadata = async (api: AxiosInstance, d2: any, endPoint: string[], additionalParam: any = {}) => {
  const dhis2Api = d2.Api.getApi();
  let endPoints = {};
  endPoint.forEach((e: string) => {
    endPoints = { ...endPoints, [e]: true }
  })
  changeMessage(`Importing ${endPoint.join(',')}`)
  try {
    const { data } = await api.get('metadata.json', { params: { ...endPoints, skipSharing: true, ...additionalParam } });
    const { system, ...rest } = data;
    const response = await dhis2Api.post('metadata', rest);
    const { stats } = response;
    changeMessage(`Finished importing ${endPoint}, Created: ${stats.created}, Updated: ${stats.updated}, Deleted: ${stats.deleted}, Ignored: ${stats.ignored} , Total: ${stats.total}`);
  } catch (error) {
    changeMessage(`Failed to import ${endPoint} with error ${error.message}`);
  }
}

async function fetchAndInsertMetaData(data: any) {
  const { d2, url, username, password } = data;
  const api = axios.create({
    baseURL: url,
    withCredentials: true,
    auth: {
      username,
      password,
    }
  });
  await insertMetadata(api, d2, ['organisationUnitLevels']);
  await insertMetadata(api, d2, ['organisationUnits'], { filter: 'level:eq:1', fields: ':owner,!geometry' });
  await insertMetadata(api, d2, ['organisationUnits'], { filter: 'level:eq:2', fields: ':owner,!geometry' });
  await insertMetadata(api, d2, ['organisationUnits'], { filter: 'level:eq:3', fields: ':owner,!geometry' });
  await insertMetadata(api, d2, ['organisationUnits'], { filter: 'level:eq:4', fields: ':owner,!geometry' });
  await insertMetadata(api, d2, ['organisationUnits'], { filter: 'level:eq:5', fields: ':owner,!geometry' });
  await insertMetadata(api, d2, ['organisationUnitGroups', 'organisationUnitGroupSets']);
  await insertMetadata(api, d2, ['categoryOptions', 'categories', 'categoryCombos', 'categoryOptionCombos', 'categoryOptionGroups', 'categoryOptionGroupSets']);
  await insertMetadata(api, d2, ['options', 'optionSets', 'optionGroups', 'optionGroupSets']);
  await insertMetadata(api, d2, ['dataElements', 'dataElementGroups', 'dataElementGroupSets']);
  await insertMetadata(api, d2, ['trackedEntityAttributes', 'trackedEntityTypes']);
  await insertMetadata(api, d2, ['programTrackedEntityAttributeGroups', 'programStageSections', 'programStages', 'programs', 'programSections', 'programIndicators', 'programIndicatorGroups', 'dataEntryForms']);
  await insertMetadata(api, d2, ['programRules', 'programRuleVariables', 'programRuleActions']);
  await insertMetadata(api, d2, ['indicatorTypes', 'indicators', 'indicatorGroups', 'indicatorGroupSets']);
  await insertMetadata(api, d2, ['maps', 'mapViews', 'externalLayers']);

  return "finished"
}


export { fetchAndInsertMetaData }
