import axios from 'axios'

/** base url */
export default axios.create({
    baseURL: 'http://XXX.XXX.XX.XXX:XXXX',
    headers: { "Content-type": "application/json" }
});