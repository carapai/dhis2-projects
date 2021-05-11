import { useStore } from "effector-react";

import { Box } from '@chakra-ui/react'
import { useD2 } from "../Context"
import { useTracker } from "../Queries";
import { reportFilterStore, programRelations } from "../Store";

const TrackerData = () => {
  const reportFilters = useStore(reportFilterStore);
  const relations = useStore(programRelations);

  const d2 = useD2();
  const { isError, isLoading, isSuccess, data, error } = useTracker(d2, reportFilters.program, relations);
  return (
    <Box>
      {isLoading && <Box>Loading</Box>}
      {isSuccess && <Box>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Box>}
      {isError && <Box>{error.message}</Box>}
    </Box>
  )
}

export default TrackerData
