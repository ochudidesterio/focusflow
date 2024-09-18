import axios from 'axios';

const getBaseUrl = () => {
  // Choose the appropriate base URL based on the environment
  //return 'http://192.168.0.106/focusflow' //local
  return 'http://ec2-54-209-62-127.compute-1.amazonaws.com:8080/focusflow' //production
};
const api = axios.create({
  baseURL: getBaseUrl()
});

export default api;
