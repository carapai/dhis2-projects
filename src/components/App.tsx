import { useState } from 'react'
import {
  Box, Input, FormControl,
  FormLabel,
  FormErrorMessage,
  SimpleGrid,
  Button,
  InputGroup,
  InputRightElement,
  Text
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useD2 } from '../Context';
import { useMutation } from 'react-query';
import { fetchAndInsertMetaData } from '../Queries';
import { useStore } from 'effector-react';
import { messageStore } from '../Store';

const TerminologySchema = Yup.object().shape({
  url: Yup.string().required("Required"),
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

const App = () => {
  const d2 = useD2();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const { mutateAsync } = useMutation(fetchAndInsertMetaData);
  const store = useStore(messageStore)

  return (
    <Box pt="10px">
      <Formik
        initialValues={{ url: '', username: '', password: '' }}
        validationSchema={TerminologySchema}
        onSubmit={async (values, actions) => {
          await mutateAsync({ ...values, d2 })
          actions.setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <SimpleGrid columns={1} gap="10px" w="60%" m="auto">

              <Field name="url">
                {({ field }) => (
                  <FormControl isInvalid={errors.url && touched.url}>
                    <FormLabel htmlFor="url">DHIS2 URL</FormLabel>
                    <Input {...field} id="url" placeholder="url" />
                    <FormErrorMessage>{errors.url}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="username">
                {({ field }) => (
                  <FormControl isInvalid={errors.username && touched.username}>
                    <FormLabel htmlFor="username">DHIS2 username</FormLabel>
                    <Input {...field} id="username" placeholder="username" />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field }) => (
                  <FormControl isInvalid={errors.password && touched.password}>
                    <FormLabel htmlFor="password">DHIS2 Password</FormLabel>
                    <InputGroup size="md">
                      <Input
                        {...field} id="password"
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Box mt={4}>
                <Button colorScheme="teal" isLoading={isSubmitting} type="submit">Submit</Button>
              </Box>
            </SimpleGrid>
          </Form>
        )}
      </Formik>
      <Text>{store.message}</Text>
    </Box>
  )
}
export default App
