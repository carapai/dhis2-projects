import { Flex, HStack, Icon, Select, Spacer, VStack, Box, Center } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineSync } from "react-icons/ai";
import { BsFillGridFill, BsSearch } from "react-icons/bs";
import { FaDesktop } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { TiPointOfInterestOutline } from 'react-icons/ti';
import { useD2 } from '../Context';
import { useDefaults } from '../Queries';
import './App.css';
import Dropdown from './Dropdown';
import Dashboard from './Dashboard';
import Folder from './Folder';

const App = () => {
  const d2 = useD2();
  const [showSider, setShowSider] = useState<boolean>(true);
  const { isLoading, isError, error, isSuccess, data } = useDefaults(d2);
  const onNewFolder = () => {

  }

  const onNewDashboard = () => {

  }
  return (
    <>
      {isLoading && <Center>Loading</Center>}
      {isSuccess &&

        <Router>
          <Box>
            <Flex className="main-container" >
              {showSider && <Flex w="48px" direction="column">
                <Flex w="48px" h="48px" p="12px">
                  <Icon as={TiPointOfInterestOutline} fontSize="24px" />
                </Flex>
                <VStack spacing="20px" mt="20px">
                  <Icon as={BsSearch} fontSize="24px" />
                  <Dropdown Icon={IoMdAdd} items={[{ id: 'dashboard', label: 'Dashboard', onClick: onNewDashboard }, { id: 'folder', label: 'Folder', onClick: onNewFolder }]} />
                  <Icon as={BsFillGridFill} fontSize="24px" />
                  <Dropdown Icon={BsFillGridFill} items={[{ id: 'xxx', label: 'www' }, { id: 'aaa', label: 'aaaa' }, { id: 'bbb', label: 'bbb' }]} />
                </VStack>
              </Flex>}
              <Flex flex={1} direction="column" >
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
                <Flex>
                  <Switch>
                    <Route path="/folders">
                      <Folder />
                    </Route>
                    <Route path="/">
                      <Dashboard />
                    </Route>
                  </Switch>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </Router>
      }

      {isError && <Center>{error.message}</Center>}
    </>
  )
}
export default App
