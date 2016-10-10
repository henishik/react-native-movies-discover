import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  InteractionManager
} from 'react-native';

import Swiper from 'react-native-swiper';
import NavigationBar from 'react-native-navbar';

import Settings from './setting'
const API_HOST_URL = Settings.API_HOST_URL
const API_KEY = Settings.API_KEY
const IMAGE_HOST_URL = Settings.IMAGE_HOST_URL


module.exports = class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      casts: [],
      details: {}
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.fetchMobieDetails();
      this.fetchCoverImages();
      this.fetchActors();
    });
  }

  fetchMobieDetails() {
    const target_api_url = API_HOST_URL
      + '/3/movie/'
      + this.props.movie.id
      + '?api_key='
      + API_KEY

    fetch(target_api_url)
      .then((response) => JSON.parse(response._bodyInit))
      .then((responseData) => {
        this.setState({ details: responseData });
      }).done();
  }

  fetchActors() {
    const target_api_url = API_HOST_URL
      + '/3/movie/'
      + this.props.movie.id
      + '/credits?api_key='
      + API_KEY

    fetch(target_api_url)
      .then((response) => JSON.parse(response._bodyInit))
      .then((responseData) => {
        this.setState({ casts: responseData.cast });
      }).done();
  }

  fetchCoverImages() {
    const targetUri = API_HOST_URL
      + '/3/movie/'
      + this.props.movie.id
      + '/images?api_key='
      + API_KEY

    fetch(targetUri)
      .then((response) => {
        return JSON.parse(response._bodyInit)
      }).then((responseData) => {
      this.setState({ dataSource: responseData.backdrops });
    }).done();
  }

  render() {
    var movie = this.props.movie;
    var description = movie.overview;

    const leftButtonConfig = {
      title: '< Back',
      tintColor: '#FFF',
      handler: () => this.props.navigator.pop()
    }

    return (
      <View style={styles.container}>
        <NavigationBar
          style={{backgroundColor: '#000'}}
          title={{ title: movie.original_title, tintColor: '#FFF' }}
          statusBar={{style: 'light-content', tintColor: '#000'}}
          leftButton={leftButtonConfig} />
        <ScrollView>
          <Swiper
            style={styles.wrapper}
            height={200} >
            {this.state.dataSource.map((imageData) =>
              <View key={imageData.file_path} style={styles.slide1}>
                <Image
                  style={styles.image}
                  resizeMode='cover'
                  source={{uri: IMAGE_HOST_URL + '/t/p/w500/' + imageData.file_path}} />
              </View>)}
          </Swiper>
          <View style={styles.mainContentBox}>
            <Text style={styles.title}>{movie.original_title}</Text>
            <Text style={styles.description}>{description}</Text>

            <Text style={styles.actorTitle}>Statics</Text>
            <View style={styles.infoListContainer}>
              <Text style={styles.infoListLeftContainer}>
                Runtime
              </Text>
              <Text style={styles.infoListRightContainer}>
                {this.state.details.runtime} mins
              </Text>
            </View>
            <View style={styles.infoListContainer}>
              <Text style={styles.infoListLeftContainer}>
                Release Data
              </Text>
              <Text style={styles.infoListRightContainer}>
                {this.state.details.release_date}
              </Text>
            </View>
            <View style={styles.infoListContainer}>
              <Text style={styles.infoListLeftContainer}>
                Budgets
              </Text>
              <Text style={styles.infoListRightContainer}>
                ${this.state.details.budget} USD
              </Text>
            </View>
            <View style={styles.infoListContainer}>
              <Text style={styles.infoListLeftContainer}>
                Reveneue
              </Text>
              <Text style={styles.infoListRightContainer}>
                ${this.state.details.revenue} USD
              </Text>
            </View>

            <Text style={styles.actorTitle}>Casts</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {this.state.casts.map((cast) =>
                <Image
                  key={cast.cast_id}
                  style={styles.imageActor}
                  borderRadius={28}
                  source={{uri: IMAGE_HOST_URL + '/t/p/w300/' + cast.profile_path}} />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContentBox: {
    padding: 12
  },
  infoListContainer: {
    flexDirection: 'row',
    paddingBottom: 8
  },
  infoListLeftContainer: {
    width: 120,
    fontSize: 15,
    color: '#656565'
  },
  infoListRightContainer: {
    flex: 1,
    textAlign: 'right',
    fontSize: 15,
    color: '#656565'
  },
  image: {
    backgroundColor: '#e0e0e0',
    flex: 1,
    height: 165,
  },
  imageActor: {
    backgroundColor: '#e0e0e0',
    margin: 4,
    width: 56,
    height: 56,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  actorTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 15,
    color: '#656565',
    paddingBottom: 12
  },
  wrapper: {
    height: 80
  },
  slide1: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
});
