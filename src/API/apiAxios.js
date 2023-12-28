import axios from 'axios'

/** base url */
export default axios.create({
    baseURL: '',
    headers: { "Content-type": "application/json" }
});