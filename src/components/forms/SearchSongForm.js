import React from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import PropTypes from "prop-types";
import api from "../../api";

class SearchSongForm extends React.Component {

  state = {
    query: "",
    loading: false,
    options: [],
    songs: {}
  };

  onSearchChange = (e, data) => {
    clearTimeout(this.timer);
    this.setState({
      query: data.searchQuery
    });
    this.timer = setTimeout(this.fetchOptions, 1000);
  };

  onChange = (e, data) => {
    this.setState({ query: data.value });
    this.props.onSongSelect(this.state.songs[data.value]);
  };

  fetchOptions = () => {
    if (!this.state.query) return;
    this.setState({ loading: true });
    api.songs.searchSongs(this.state.query)
      .then( res => {
        console.log("Result: ");
        console.log(res);
        return res.tracks.items;
      })
      .then( items => {
        const options = [];
        const songsHash = {};
        items.forEach( item => {
          songsHash[item.id] = item;
          options.push({
            key: item.id,
            value: item.id,
            text: item.name + " by " + item.artists["0"].name
          });
        });
        this.setState({ loading: false, options, songs: songsHash });
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
          placeholder = "search for song by title or artist"
          onSearchChange={this.onSearchChange}
          value={this.state.query}
          options={this.state.options}
          loading={this.state.loading}
          onChange={this.onChange}
        />

      </Form>
    );

  }

}

SearchSongForm.propTypes = {
  onSongSelect: PropTypes.func.isRequired
};

export default SearchSongForm;
