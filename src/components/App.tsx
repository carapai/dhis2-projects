import {
  Box,
  HStack,
  Text
} from '@chakra-ui/react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Link
} from "react-router-dom";
import Cohorts from './Cohorts';
import Dashboard from './Dashboard';
import Reports from './Reports';

const App = () => {
  return (
    <Router>
      <Box>
        {/* <HStack h="48px" background="blackAlpha.400" p="10px">
          <Link to="/"><Text fontSize="lg" textTransform="uppercase">Dashboard</Text></Link>
          <Link to="/reports"><Text fontSize="lg" textTransform="uppercase">Reports</Text></Link>
          <Link to="/cohorts"><Text fontSize="lg" textTransform="uppercase">Cohorts</Text></Link>
        </HStack> */}
        <Box>
          <Switch>
            <Route path="/reports">
              <Reports />
            </Route>
            <Route path="/cohorts">
              <Cohorts />
            </Route>
            <Route path="/" exact>
              <Dashboard />
            </Route>
          </Switch>
        </Box>
      </Box>
    </Router>
  )
}
export default App
