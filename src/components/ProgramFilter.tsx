import {
  Accordion,
  AccordionButton,
  AccordionIcon, AccordionItem,
  AccordionPanel, Box,
  Checkbox,
  Select,
  Stack, Table,
  Tbody,
  Td,
  Text, Tr
} from '@chakra-ui/react';
import { useStore } from "effector-react";
import { ChangeEvent, FC } from "react";
import {
  addEnrollmentRelation,
  addProgramRelation,
  addRelationship,
  addStage,
  changeOption,
  removeEnrollmentRelation,
  removeProgramRelation,
  removeRelationship,
  removeStage
} from "../Events";
import { reportFilterStore } from "../Store";
import { Relation } from "../types";
import Selection from "./Selection";
interface ProgramFilterProps {
  relationshipTypes: any[]
}

const ProgramFilter: FC<ProgramFilterProps> = () => {
  const reportFilters = useStore(reportFilterStore);
  const currentRelationships = Object.values(reportFilters.relationshipTypes).filter((r: any) => r.toConstraint && r.toConstraint.program && r.toConstraint.program.id === reportFilters.program && r.toConstraint.relationshipEntity === 'TRACKED_ENTITY_INSTANCE');
  const currentEnrollmentRelationships = Object.values(reportFilters.relationshipTypes).filter((r: any) => r.toConstraint && r.toConstraint.program && r.toConstraint.program.id === reportFilters.program && r.toConstraint.relationshipEntity === 'PROGRAM_INSTANCE');

  const extractFromRelationship = (fromRelationship: any): Relation => {
    return ['TRACKED_ENTITY_INSTANCE', 'PROGRAM_INSTANCE'].indexOf(fromRelationship.relationshipEntity) !== -1 ? {
      type: !!fromRelationship.program ? 'program' : 'entity',
      relation: fromRelationship.program ? fromRelationship.program.id : fromRelationship.trackedEntityType.id
    } : {
      type: !!fromRelationship.programStage ? 'stage' : 'all',
      relation: fromRelationship.programStage ? fromRelationship.programStage.id : fromRelationship.program.id
    };
  }

  const addingStage = (stage: string) => (e: any) => {
    if (e.target.checked) {
      addStage(stage)
    } else {
      removeStage(stage)
    }
  }

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Program Stages</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} maxH="500px" overflow="auto">
          <Table>
            {/* <Thead>
                  <Tr>
                    <Th w="5px"><Checkbox /></Th>
                    <Th>Stage</Th>
                  </Tr>
                </Thead> */}
            <Tbody>
              {reportFilters.programs[reportFilters.program].programStages.map((stage: any) => <Tr key={stage.id}>
                <Td>
                  <Checkbox isChecked={reportFilters.stages[stage.id] !== undefined} onChange={addingStage(stage.id)} />
                </Td>
                <Td>
                  <Stack>
                    <Text>{stage.name}</Text>
                    {
                      reportFilters.stages[stage.id] && stage.repeatable &&
                      <Select value={reportFilters.stages[stage.id].whichEvents} placeholder="Strategy" onChange={(e: ChangeEvent<HTMLSelectElement>) => changeOption([stage.id, e.target.value as any])}>
                        <option value="last">Last Event</option>
                        <option value="first">First Event</option>
                        <option value="any">Any Event</option>
                        <option value="all">All Events</option>
                      </Select>
                    }
                    {
                      reportFilters.stages[stage.id] && Object.values(reportFilters.relationshipTypes).filter((r: any) => r.toConstraint && r.toConstraint.programStage && r.toConstraint.programStage.id === stage.id && r.toConstraint.relationshipEntity === 'PROGRAM_STAGE_INSTANCE').length > 0 &&
                      <Table>
                        {/* <Thead>
                              <Tr>
                                <Th><Checkbox /></Th>
                                <Th>Relationship</Th>
                              </Tr>
                            </Thead> */}
                        <Tbody>
                          {Object.values(reportFilters.relationshipTypes).filter((r: any) => r.toConstraint && r.toConstraint.programStage && r.toConstraint.programStage.id === stage.id && r.toConstraint.relationshipEntity === 'PROGRAM_STAGE_INSTANCE').map((cr: any) => <Tr key={cr.id}>
                            <Td><Checkbox isChecked={!!reportFilters.stages[stage.id].relationships[cr.id]} onChange={(e) => { e.target.checked ? addRelationship([stage.id, cr.id, extractFromRelationship(cr.fromConstraint)]) : removeRelationship([stage.id, cr.id]) }} /></Td>
                            <Td>{cr.fromToName}</Td>
                          </Tr>)}
                        </Tbody>
                      </Table>
                    }
                  </Stack>
                </Td>
              </Tr>)}
            </Tbody>
          </Table>
        </AccordionPanel>
      </AccordionItem>
      {currentRelationships.length > 0 && <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Program Relationships</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} maxH="500px" overflow="auto">
          <Table>
            {/* <Thead>
                  <Tr>
                    <Th><Checkbox /></Th>
                    <Th>Relationship</Th>
                  </Tr>
                </Thead> */}
            <Tbody>
              {currentRelationships.map((cr: any) => <Tr key={cr.id}>
                <Td><Checkbox isChecked={!!reportFilters.programRelationships[cr.id]} onChange={(e) => { e.target.checked ? addProgramRelation([cr.id, extractFromRelationship(cr.fromConstraint)]) : removeProgramRelation(cr.id) }} /></Td>
                <Td>{cr.fromToName}</Td>
              </Tr>)}
            </Tbody>
          </Table>
        </AccordionPanel>
      </AccordionItem>}

      {currentEnrollmentRelationships.length > 0 && <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Enrollment Relationships</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} maxH="500px" overflow="auto">
          <Table>
            {/* <Thead>
                  <Tr>
                    <Th><Checkbox /></Th>
                    <Th>Relationship</Th>
                  </Tr>
                </Thead> */}
            <Tbody>
              {currentEnrollmentRelationships.map((cr: any) => <Tr key={cr.id}>
                <Td><Checkbox isChecked={!!reportFilters.enrollmentRelationships[cr.id]} onChange={(e) => { e.target.checked ? addEnrollmentRelation([cr.id, extractFromRelationship(cr.fromConstraint)]) : removeEnrollmentRelation(cr.id) }} /></Td>
                <Td>{cr.fromToName}</Td>
              </Tr>)}
            </Tbody>
          </Table>
        </AccordionPanel>
      </AccordionItem>}
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">Available Fields</Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Selection />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default ProgramFilter
