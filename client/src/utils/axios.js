import axios from 'axios';

const dev = true;
// Set dev = true to test the service worker in the build folder
export default (!dev
  ? axios.create({ baseURL: 'http://localhost:5000' })
  : axios.create({}));
