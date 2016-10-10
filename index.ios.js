import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator
} from 'react-native';

import MovieList from './MovieList';
import MovieDetail from './MovieDetail';


class Main extends Component {
  navigatorRenderScene(route, navigator) {
    switch (route.id) {
      case 'movieList':
        return (
          <MovieList
            navigator={navigator}
            title="Movie List" />);
      case 'movieDetail':
        return (
          <MovieDetail
            navigator={navigator}
            movie={route.passProps.movie}
            title={route.passProps.title} />);
    }
  }

  render() {
    return (
      <Navigator
        style={styles.container}
        renderScene={this.navigatorRenderScene}
        initialRoute={{id: 'movieList'}} />);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('MovieLists', () => Main);
