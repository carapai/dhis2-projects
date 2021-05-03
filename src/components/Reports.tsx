import { useStore } from "effector-react";
import { usePrograms } from "../Queries";
import { reportFilterStore } from "../Store";
import { changeProgram } from '../Events'
import { useD2 } from '../Context';
import { Box, Select } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import ProgramFilter from "./ProgramFilter";

const Reports = () => {
  const d2 = useD2()
  const reportFilters = useStore(reportFilterStore);
  const { isError, isLoading, isSuccess, data, error } = usePrograms(d2);
  return (
    <Box>
      {isLoading && <Box>Loading</Box>}
      {isSuccess && <Box>
        <Select placeholder="Select program" onChange={(e: ChangeEvent<HTMLSelectElement>) => changeProgram(e.target.value)} value={reportFilters.program}>
          {data.map((program: any) => <option key={program.id} value={program.id}>{program.name}</option>)}
        </Select>
        {reportFilters.program && <ProgramFilter />}
      </Box>}
      {isError && <Box>{error.message}</Box>}
    </Box>
  )
}

export default Reports
