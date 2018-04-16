import axios from 'axios';

const host = 'http://35.171.74.240:3000';

export default {
  user: {
    login: (credentials) => axios.post(host+'/auth/login', { credentials }).then(res => res.user)
  }
}
