import {
  Box, Flex, IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput,
  NumberInputField,
  NumberInputStepper, Spacer, Stack, Table, Tbody, Td, Text, Th, Thead, Tr
} from '@chakra-ui/react';
import { DatePicker, Select } from 'antd';
import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaDownload } from 'react-icons/fa'
import { useD2 } from "../Context";
import { useTracker2 } from "../Queries";
import OrgUnitTreeSelect from './OrgUnitTreeSelect';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker

const attributes = [
  {
    id: 'r10igcWrpoH',
    type: 'hh',
    display: 'HH Code'
  },
  {
    id: 'HLKc2AKR9jW',
    type: 'attribute',
    display: 'Beneficiary Code'
  },
  {
    id: 'huFucxA3e5c',
    type: 'attribute',
    display: 'Beneficiary Name'
  },
  {
    id: 'Xkwy5P2JG24',
    type: 'attribute',
    display: 'Village'
  },
  {
    id: 'orgUnitName',
    type: 'attribute',
    display: 'Parish'
  },
  {
    id: 'N1nMqKtYKvI',
    type: 'attribute',
    display: 'Age'
  },
  {
    id: 'CfpoFtRmK1z',
    type: 'attribute',
    display: 'Sex'
  },
  {
    id: 'nDUbdM2FjyP',
    type: 'attribute',
    display: 'Risk Factor'
  },
  {
    id: 'enrollmentDate',
    type: 'attribute',
    display: 'Enrollment Date'
  },
  {
    id: 'c5raACWHjjt',
    type: 'event',
    stage: 'TuLJEpHu0um',
    index: 0,
    display: 'Can Graduate'
  },
  {
    id: 'vBqh2aiuHOV',
    type: 'event',
    stage: 'B9EI27lmQrZ',
    index: 0,
    display: 'Current HIV status (+/-/?)'
  },
]

const findAttribute = (attribute: string, data: { [key: string]: any }) => {
  return data[attribute] || '';
}

const findRelationship = (r: string, attribute: string, data: { [key: string]: any }) => {
  return data[r][attribute] || ''

}

const findStageElement = (stage: string, element: string, index: number, data: { [key: string]: any }) => {
  const s = data[stage];
  if (s) {
    const event = s[index];
    if (event) {
      return event[element] || ''
    }
  }
  return '';
}

const findDisplay = (attribute: any, data: any) => {
  const obj = {
    hh: findRelationship('hly709n51z0', attribute.id, data),
    attribute: findAttribute(attribute.id, data),
    event: findStageElement(attribute.stage, attribute.id, attribute.index, data)
  }

  return obj[attribute.type]
}




const Dashboard = () => {
  const d2 = useD2();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [orgUnit, setOrgUnit] = useState<string[]>(['yGTl6Vb8EF4']);
  const [period, setPeriod] = useState<[any, any]>([moment().subtract(1, 'months'), moment()])
  const [type, setType] = useState('date');
  const {
    isError,
    isLoading,
    isSuccess,
    data,
    refetch,
    isPreviousData,
    isFetching,
    error,
  } = useTracker2(
    d2,
    "RDEklSXCD4C",
    page,
    pageSize,
    orgUnit,
    period.map((p: moment.Moment, index: number) => {
      if (type === 'date') {
        return p.format('YYYY-MM-DD')
      }

      if (type === 'month' && index === 0) {
        return p.startOf('month').format('YYYY-MM-DD')
      }
      if (type === 'month' && index === 1) {
        return p.endOf('month').format('YYYY-MM-DD')
      }

      if (type === 'quarter' && index === 0) {
        return p.startOf('quarter').format('YYYY-MM-DD')
      }
      if (type === 'quarter' && index === 1) {
        return p.endOf('quarter').format('YYYY-MM-DD')
      }
      if (type === 'year' && index === 0) {
        return p.startOf('y').format('YYYY-MM-DD')
      }
      if (type === 'year' && index === 1) {
        return p.endOf('y').format('YYYY-MM-DD')
      }
    })
  );

  function PickerWithType({ type, onChange }) {
    if (type === 'date') return <RangePicker onChange={onChange} size="large" value={period} />;
    return <RangePicker picker={type} onChange={onChange} size="large" value={period} />;
  }
  return (
    <Stack spacing="20px">
      <Flex p="10px">
        <Stack direction="row">
          <OrgUnitTreeSelect selectedOrgUnit={orgUnit} setSelectedOrgUnit={setOrgUnit} />
          <Stack direction="row">
            <Select value={type} onChange={setType} size="large" style={{ width: '200px' }}>
              <Option value="date">Daily</Option>
              <Option value="week">Weekly</Option>
              <Option value="month">Monthly</Option>
              <Option value="quarter">Quarterly</Option>
              <Option value="year">Yearly</Option>
            </Select>
            <PickerWithType type={type} onChange={(value: any) => setPeriod(value)} />
          </Stack>
        </Stack>
        <Spacer />
        <IconButton aria-label="Download" icon={<FaDownload />} />
      </Flex>
      <Flex p="10px" overflow="auto">
        {isLoading && <Flex>Loading</Flex>}
        {isSuccess && data && <Table variant="simple">
          <Thead>
            <Tr>
              {attributes.map((i: any) => <Th key={i.id}>{i.display}</Th>)}
            </Tr>
          </Thead>
          <Tbody>
            {data.trackedEntityInstances.map((d: any) => <Tr key={d.trackedEntityInstance}>
              {attributes.map((i: any) => <Td key={i.id}>{findDisplay(i, d)}</Td>)}
            </Tr>)}
          </Tbody>
        </Table>}
        {isError && <Box>{error.message}</Box>}
      </Flex>
      <Flex h="48px">
        <Spacer />
        <Stack direction="row" alignItems="center" spacing="24px" textAlign="right">
          <Text>{((page - 1) * pageSize) + 1} - {page * pageSize < data?.total ? page * pageSize : data?.total} of {data?.total}</Text>
          <NumberInput value={pageSize} w="100px" textAlign="center" onChange={(v1: string, v2: number) => setPageSize(v2)} size="sm">
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <IconButton
            // colorScheme="blue"
            size="lg"
            variant="ghost"
            aria-label="Previous"
            icon={<FiChevronLeft />}
            onClick={() => setPage(old => Math.max(old - 1, 1))}
            disabled={page === 1 || isFetching || isLoading}
          />
          <IconButton
            // colorScheme="blue"
            size="lg"
            variant="ghost"
            aria-label="Next"
            icon={<FiChevronRight />}
            onClick={() => {
              if (!isPreviousData && data?.pageCount > page) {
                setPage(old => old + 1)
              }
            }}
            disabled={page === data?.pageCount || isFetching || isLoading}
          />
        </Stack>
      </Flex>
    </Stack>
  )
}

export default Dashboard
