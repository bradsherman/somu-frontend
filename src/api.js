import axios from 'axios';

const host = process.env.HOST;

export default {
  user: {
    login: credentials =>
      axios.post(host+"/auth/login", { credentials }).then(res => {
        // console.log(res);
        return res.data.user;
      }),

    signup: user =>
      axios.post(host+"/auth/signup", { user }).then(res => res.data.user),

    getMe: user =>
      axios.get(host+"/me", { user }).then(res => res.data.user)


  }
}
