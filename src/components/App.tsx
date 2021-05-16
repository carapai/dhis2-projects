import { Flex, HStack, Icon, Box, Center, Spacer, Select, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { BsFillGridFill } from "react-icons/bs"
import { FaDesktop } from "react-icons/fa"
import { AiOutlineSync } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { TiPointOfInterestOutline } from 'react-icons/ti'
import { useD2 } from '../Context';

import './App.css'
import Dropdown from './Dropdown';
const App = () => {
  const d2 = useD2();
  const [showSider, setShowSider] = useState<boolean>(true);
  return (
    <Flex className="main-container" >
      {showSider && <Flex w="48px" direction="column">
        <Flex w="48px" h="48px" >
          <Icon as={TiPointOfInterestOutline} fontSize="48px" />
        </Flex>
        <VStack spacing="20px" mt="20px">
          <Icon as={BsSearch} fontSize="24px" />
          <Icon as={IoMdAdd} fontSize="36px" />
          <Icon as={BsFillGridFill} fontSize="24px" />
          <Dropdown Icon={BsFillGridFill} items={[{ id: 'xxx', label: 'www' }]} />
        </VStack>
      </Flex>}
      <Flex flex={1} bg="green.200" direction="column" >
        <Flex h="48px" alignItems="center" px="10px" bg="white">
          <HStack>
            <Icon as={BsFillGridFill} fontSize="24px" />
          </HStack>
          <Spacer />
          <HStack>
            <Icon as={AiOutlineSync} fontSize="20px" />
            <Select variant="unstyled">
              <option value="off">off</option>
              <option value="5">5s</option>
              <option value="10">10s</option>
            </Select>
            <Icon as={FaDesktop} fontSize="20px" onClick={() => setShowSider(!showSider)} />
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  )
}
export default App
