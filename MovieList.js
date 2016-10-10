import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import MovieDetail from './MovieDetail';

import Settings from './setting'
const API_HOST_URL = Settings.API_HOST_URL
const API_KEY = Settings.API_KEY
const API_TARGET_PATH = Settings.API_PATH_GET_MOVIE_DISCOVER


module.exports = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const target_api_url = API_HOST_URL
      + API_TARGET_PATH
      + '?api_key='
      + API_KEY
      + '&language=en-US'

    fetch(target_api_url)
      .then((response) => {
        return JSON.parse(response._bodyInit)
      })
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.results),
          isLoading: false
        });
      })
      .done();
  }

  render() {
    if (this.state.isLoading) {
      return this.renderLoadingView();
    }

    return (
      <View style={{flex: 1}}>
        <NavigationBar
          style={{backgroundColor: '#000'}}
          statusBar={{style: 'light-content', tintColor: '#000'}}
          title={{ title: this.props.title, tintColor: '#FFF'}} />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderCell.bind(this)}
          style={styles.listView} />
      </View>
    );
  }

  renderCell(movie) {
    return (
      <TouchableHighlight
        onPress={() => this.showMovieDetail(movie)}
        underlayColor='#dddddd'>
        <View>
          <View style={styles.container}>
            <View style={styles.leftContainer}>
              <Image
                source={{uri: 'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}}
                style={styles.thumbnail} />
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.title}>{movie.original_title}</Text>
              <Text style={styles.author}>{movie.overview}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size='large'/>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  }

  showMovieDetail(movie) {
    this.props.navigator.push({
      component: MovieDetail,
      id: 'movieDetail',
      passProps: {movie: movie}
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 10
  },
  thumbnail: {
    width: 53,
    height: 81,
    marginRight: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems:  'flex-start'
  },
  rightContainer: {
    flex: 1
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8
  },
  author: {
    color: '#656565'
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd'
  },
  listView: {
    backgroundColor: '#F5FCFF'
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
