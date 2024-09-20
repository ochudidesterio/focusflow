import axios from 'axios';

const getBaseUrl = () => {
  //return 'http://192.168.0.106/focusflow' //local
  return 'http://ec2-16-171-144-29.eu-north-1.compute.amazonaws.com:8081/focusflow' //production
};
const api = axios.create({
  baseURL: getBaseUrl()
});

export default api;
