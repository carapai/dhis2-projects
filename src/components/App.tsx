import { Box } from '@chakra-ui/react'
import { useD2 } from '../Context'
const App = () => {
  const d2 = useD2();
  console.log(d2)

  return (
    <Box>
      Home
    </Box>
  )
}
export default App
