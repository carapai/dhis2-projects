import {
  Box,
  HStack
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
        <HStack >
          <Link to="/">Dashboard</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/cohorts">Cohorts</Link>
        </HStack>
        <Box p="10px">
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
