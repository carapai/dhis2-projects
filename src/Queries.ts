import { useQuery } from 'react-query';

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
      const { programs } = await api.get(`programs`, {
        fields: "id,name",
      });
      return programs;
    },
    { retryDelay: 1000 }
  );
}

export function useProgram(d2: any, program: string) {
  const api = d2.Api.getApi();
  return useQuery<any, Error>(
    ["programs", program],
    async () => {
      return await api.get(`programs/${program}.json`, {
        fields: "id,name,displayName,programType,trackedEntityType,trackedEntity,programTrackedEntityAttributes[trackedEntityAttribute[id,code,name,displayName,unique,optionSetValue,optionSet[options[name,code]]]],programStages[id,name,displayName,repeatable,programStageDataElements[compulsory,dataElement[id,code,valueType,name,displayName,optionSetValue,optionSet[options[name,code]]]]]",
      });
    },
    { retryDelay: 1000 }
  );
}
