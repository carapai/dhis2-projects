import { useStore } from "effector-react";
import { Box } from '@chakra-ui/react'
import { useD2 } from "../Context"
import { useProgram } from "../Queries";
import { reportFilterStore } from "../Store";

const ProgramFilter = () => {
  const d2 = useD2();
  const reportFilters = useStore(reportFilterStore);
  const { isError, isLoading, isSuccess, data, error } = useProgram(d2, reportFilters.program)
  return (
    <Box>
      {isLoading && <Box>Loading</Box>}
      {isSuccess && <Box><pre>{JSON.stringify(data, null, 2)}</pre></Box>}
      {isError && <Box>{error.message}</Box>}
    </Box>
  )
}

export default ProgramFilter
