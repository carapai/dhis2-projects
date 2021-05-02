import {
  Box
} from '@chakra-ui/react';
import {
  HashRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Dashboard from './Dashboard';

const App = () => {

  return (
    <Router>
      <Box>
        <Switch>
          <Route path="/" exact>
            <Dashboard />
          </Route>
        </Switch>
      </Box>
    </Router>
  )
}
export default App
