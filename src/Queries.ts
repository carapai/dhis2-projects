import { useQuery } from 'react-query';
export function useDefaults(d2: any) {
  return useQuery<any, Error>(
    "dashboards",
    async () => {
      const val = await d2.dataStore.has("dash");
      if (!val) {
        const namespace = await d2.dataStore.create("dash");
        namespace.set("folder-123456", [{ id: '123456', name: 'General' }]);
      }
      return {};
    },
    {}
  );
}
