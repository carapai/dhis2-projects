import axios from 'axios';

const endPoints = [
  'organisationUnits'
]

async function fetchAndInsertMetaData(data: any) {
  const { d2, url, username, password } = data;
  const api = axios.create({
    baseURL: url,
    timeout: 10000,
    withCredentials: true,
    auth: {
      username,
      password,
    }
  });

  for (const endPoint of endPoints) {
    const response = await api.get(endPoint);
    console.log(response);
  }

  return []
  // return await d2.post('index');
}


export { fetchAndInsertMetaData }
