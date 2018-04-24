import axios from 'axios';

const host = "http://35.171.74.240:3000";

// Spotify base url
const base = "https://api.spotify.com";

export default {
  user: {
    login: credentials =>
      axios.post(host+"/auth/login", { credentials }).then(res => res.data.user),

    signup: user =>
      axios.post(host+"/auth/signup", { user }).then(res => res.data.user),

    // spotifyProfile: spotify_id =>
    //   axios.get('spotify_url').then()

    // returns json object 'user' (private)
    getCurrentProfile: () =>
      axios.get(base + "/v1/me").then(res => {
        console.log(res);
        return res;
      }),

    // returns json object 'user' public
    getProfile: spotify_user_id =>
      axios.get(base + "/v1/users/" + spotify_user_id).then(res => {
        console.log(res);
        return res;
      })

  }

  playlist: {
    // follow a playlist,  returns the HTTP status code in the response header is 200 OK
    follow: (owner_id, playlist_id) =>
      axios.put(base + "/v1/users/" + owner_id  + "/playlists/" + playlist_id + "/followers", { public: false }).then(res => {
        console.log(res);
        return res;
      })
  }

}
