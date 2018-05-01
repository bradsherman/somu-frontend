import axios from 'axios';
import spotifyWebApi from 'spotify-web-api-js';
import Promise from 'bluebird';

const spotifyApi = new spotifyWebApi();
spotifyApi.setPromiseImplementation(Promise);
spotifyApi.setAccessToken(localStorage.spotifyAccessToken);

// brad
//let api_url = "http://35.171.74.240:3000";
// courtney
 let api_url = "http://34.193.174.233:3000";


// Spotify base url
if (process.env.NODE_ENV === "production") {
  api_url = "http://52.4.91.6:3000";
}

export default {
  user: {
    login: credentials =>
      axios.post(api_url+"/auth/login", { credentials }).then(res => res.data.user),

    signup: user =>
      axios.post(api_url+"/auth/signup", { user }).then(res => {
        console.log(res);
        return res.data.user}),

    // returns json object 'user' (private)
    getCurrentProfile: user_id =>
      spotifyApi.getUser(user_id),

    // returns json object 'user' public
    getProfile: spotify_user_id =>
      axios.get(base + "/v1/users/" + spotify_user_id).then(res => {
        console.log(res);
        return res;
      })

  },

  room: {
    createRoom: (data, playlist_id) =>
      axios.post(api_url + "/room", {...data, playlist_id: playlist_id}),

    getRooms: (username) =>
      axios.get(api_url+ "/room?user="+username),

    getRoom: playlist_id =>
      axios.get(api_url + "/room/" + playlist_id),

    joinRoom: data =>
      axios.post(api_url + "/room_member", { data })
        .then(r =>spotifyApi.followPlaylist(r.info.owner_id, r.info.playlist_id))



  },

  playlist: {
    // follow a playlist,  returns the HTTP status code in the response header is 200 OK
    createPlaylist: data =>
      spotifyApi.createPlaylist(data.owner_id, {
        name: "Harmonize."+data.name,
        public: false,
        collaborative: true,
        description: "A playlist made through Harmonize."
      }),

    follow: (owner_id, playlist_id) =>
      axios.put(base + "/v1/users/" + owner_id  + "/playlists/" + playlist_id + "/followers", { public: false }).then(res => {
        console.log(res);
        return res;
      }),

    getPlaylists: spotify_user_id =>
      spotifyApi.getUserPlaylists(spotify_user_id, {
        limit: 50
      }),

    getPlaylist: (spotify_user_id, playlist_id) =>
      spotifyApi.getPlaylist(spotify_user_id, playlist_id),

    addTracksToPlaylist: (spotify_user_id, playlist_id, song_uri) =>
      spotifyApi.addTracksToPlaylist(spotify_user_id, playlist_id, [song_uri]),

  },

  songs: {
    searchSongs: query =>
      spotifyApi.searchTracks(query, {
        limit: 10
      })

  },

  api_url,
  spotifyApi


}
