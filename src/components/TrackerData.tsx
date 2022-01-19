import { useStore } from "effector-react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { useD2 } from "../Context"
import { useTracker } from "../Queries";
import { reportFilterStore } from "../Store";

const TrackerData = () => {
  const reportFilters = useStore(reportFilterStore);
  const d2 = useD2();
  const {
    isError,
    isLoading,
    isSuccess,
    data,
    refetch,
    isFetching,
    error
  } = useTracker(
    d2,
    reportFilters.program,
    reportFilters.stages,
    reportFilters.programRelationships,
    reportFilters.enrollmentRelationships
  );
  return (
    <Box>
      <Flex>
        <Button disabled={reportFilters.selectedFields.length === 0} onClick={() => refetch()} isLoading={isLoading || isFetching}>Load</Button>
        <Spacer />
        <Button disabled={!isSuccess || !data || data.length === 0}>Download</Button>
      </Flex>
      {isSuccess && <Table variant="simple">
        <Thead>
          <Tr>
            {reportFilters.selectedFields.map((fields: any) => <Th key={fields.id}>{fields.display}</Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((d: any, index: number) => <Tr key={index}>
            {reportFilters.selectedFields.map((fields: any) => <Td key={fields.id}>{d[fields.key]}</Td>)}
          </Tr>)}
        </Tbody>
      </Table>}
      {isError && <Box>{error.message}</Box>}
    </Box>
  )
}

export default TrackerData
