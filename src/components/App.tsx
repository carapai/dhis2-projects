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
        <HStack h="48px" background="blackAlpha.100" p="10px" spacing="20px">
          <Link to="/"><Text fontSize="lg" textTransform="uppercase">OVC SERVICE Layering Report</Text></Link>
          <Link to="/reports"><Text fontSize="lg" textTransform="uppercase">OVC SERVICE Tracker</Text></Link>
          <Link to="/cohorts"><Text fontSize="lg" textTransform="uppercase">Indicator Report</Text></Link>
          <Link to="/cohorts"><Text fontSize="lg" textTransform="uppercase">OVC MIS Form 100 Report</Text></Link>
          {/* <Link to="/cohorts"><Text fontSize="lg" textTransform="uppercase">OVC MIS API Data offset</Text></Link> */}
          <Link to="/cohorts"><Text fontSize="lg" textTransform="uppercase">Know Your Child Campaign</Text></Link>
          <Link to="/cohorts"><Text fontSize="lg" textTransform="uppercase">Viral load Tracker</Text></Link>
        </HStack>
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
