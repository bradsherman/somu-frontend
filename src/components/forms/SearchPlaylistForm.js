import React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import PropTypes from "prop-types";
import api from "../../api";
import store from '../../store';

class SearchPlaylistForm extends React.Component {

  state = {
    loading: false,
    options: [],
    playlists: {}
  };

  onClick = (e, data) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.fetchOptions, 1000);
  };

  onChange = (e, data) => {
    this.props.onPlaylistSelect(this.state.playlists[data.value]);
  };

  fetchOptions = () => {
    const s = store.getState();
    this.setState({ loading: true });
    api.playlist.getPlaylists(s.user.spotify_id)
      .then( res => {
        // console.log("Result: ");
        // console.log(res);
        return res.items;
      })
      .then( items => {
        const options = [];
        const playlistsHash = {};
        items.forEach( item => {
          playlistsHash[item.id] = item;
          options.push({
            key: item.id,
            value: item.id,
            text: item.name
          });
        });
        this.setState({ loading: false, options, playlists: playlistsHash });
      })
      .catch( err => {
        console.log(err);
      })
  };


  render() {

    return (
      <Form>
        <Dropdown
          search
          fluid
          placeholder = "select a playlist"
          selection
          upward
          closeOnChange
          options={this.state.options}
          loading={this.state.loading}
          onClick={this.onClick}
          onChange={this.onChange}
        />
      </Form>
    )

  };

}

SearchPlaylistForm.propTypes = {
  onPlaylistSelect: PropTypes.func.isRequired
};

export default SearchPlaylistForm;
