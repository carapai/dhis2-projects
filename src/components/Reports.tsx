import { useStore } from "effector-react";
import { usePrograms } from "../Queries";
import { reportFilterStore } from "../Store";
import { changeProgram } from '../Events'
import { useD2 } from '../Context';
import { Box, Select, Flex, Stack } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import ProgramFilter from "./ProgramFilter";
import TrackerData from "./TrackerData";

const Reports = () => {
  const d2 = useD2()
  const reportFilters = useStore(reportFilterStore);
  const { isError, isLoading, isSuccess, data, error } = usePrograms(d2);
  return (
    <Box>
      {isLoading && <Box>Loading</Box>}
      {isSuccess && <Flex>
        <Stack w="25%">
          <Select mb="10px" placeholder="Select program" onChange={(e: ChangeEvent<HTMLSelectElement>) => changeProgram(e.target.value)} value={reportFilters.program}>
            {Object.values(reportFilters.programs).map((program: any) => <option key={program.id} value={program.id}>{program.name}</option>)}
          </Select>
          {reportFilters.program && <ProgramFilter relationshipTypes={data.relationshipTypes} />}
        </Stack>
        <Box flex={1} px="10px" overflow="auto">
          {reportFilters.program && <TrackerData />}
        </Box>
      </Flex>}
      {isError && <Box>{error.message}</Box>}
    </Box>
  )
}

export default Reports
