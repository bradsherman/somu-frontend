import axios from 'axios';

const host = "http://35.171.74.240:3000";

export default {
  user: {
    login: credentials =>
      axios.post(host+"/auth/login", { credentials }).then(res => res.data.user),

    signup: user =>
      axios.post(host+"/auth/signup", { user }).then(res => res.data.user),

    // spotifyProfile: spotify_id =>
    //   axios.get('spotify_url').then()

  }
}
