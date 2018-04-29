import React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import PropTypes from "prop-types";
import api from "../../api";
import store from '../../store';

class SearchPlaylistForm extends React.Component {

  state = {
    loading: false,
    options: [],
    songs: {}
  };

  onClick = (e, data) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.fetchOptions, 1000);
  }

  fetchOptions = () => {
    const s = store.getState();
    this.setState({ loading: true });
    api.playlist.getPlaylists(s.user.spotify_id)
      .then( res => {
        console.log("Result: ");
        console.log(res);
      })
      .catch( err => {
        console.log("Error: ");
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
          options={this.state.options}
          loading={this.state.loading}
          onClick={this.onClick}
        />
      </Form>
    )

  };

}

SearchPlaylistForm.propTypes = {
  onPlaylistSelect: PropTypes.func.isRequired
};

export default SearchPlaylistForm;
