import axios from './apiAxios';

const face = data => {
    return axios.post('/face', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

const reset = () => {
  return axios.delete('/reset');
}

const solve = () => {
  return axios.get('/solve');
}
  export default {
    face,
    reset
  };