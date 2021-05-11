import {
  Box,
  Input,
  Table,
  Tbody,
  Td, Th, Thead,
  Tr
} from '@chakra-ui/react';
import { useStore } from "effector-react";
import { FC } from "react";
import { addToSelectedFields, changeFilter, removeFromSelectedFields } from "../Events";
import { defaultFields, reportFilterStore } from "../Store";

interface SelectionProps {
}

const Selection: FC<SelectionProps> = () => {
  const $defaultFields = useStore(defaultFields);
  const reportFilters = useStore(reportFilterStore);
  return (
    <Box>
      <Input value={reportFilters.filter} placeholder="filter" size="sm" mb="15px" onChange={(event) => changeFilter(event.target.value)} />
      <Box maxH="200px" overflow="auto">
        <Table>
          <Thead>
            <Tr>
              <Th>Available</Th>
            </Tr>
          </Thead>
          <Tbody>
            {$defaultFields.map((a: any) => <Tr key={a.id}>
              <Td cursor="pointer" onClick={() => addToSelectedFields(a)}>{a.name}</Td>
            </Tr>)}
          </Tbody>
        </Table>
      </Box>

      <Box maxH="200px" overflow="auto" mt="20px">
        <Table>
          <Thead>
            <Tr>
              <Th>Selected</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reportFilters.selectedFields.map((a: any) => <Tr key={a.id}>
              <Td cursor="pointer" onClick={() => removeFromSelectedFields(a)}>{a.name}</Td>
            </Tr>)}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default Selection
