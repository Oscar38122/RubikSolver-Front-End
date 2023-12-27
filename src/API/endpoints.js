import axios from './apiAxios';

const face = data => {
    return axios.post('/face', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const faceget = () => {
    console.log("AAA")
    return axios.get('/faceget');
  };
  
  export default {
    face,
    faceget
  };