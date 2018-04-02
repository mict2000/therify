import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableWithoutFeedback, Text } from 'react-native';
import Grid from 'react-native-grid-component';
import images from './data.json';

const deviceWidth = Dimensions.get('window').width;
const imageWidth = (deviceWidth - 6) / 3;

export default class Feed extends Component {

  state = {
    images: []
  }

  componentDidMount() {
    this.mounted = true;

    var lat, long = '';
    if(this.props.location != '') {
      lat = this.props.location.coords.latitude;
      long = this.props.location.coords.longitude;
    }
    var request = {
      location: `${lat} ${long}`,
      range: 50000
    }
    fetch('http://10.0.1.59:8080/photos/location', {
          method: 'POST',
          body: JSON.stringify(request),
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(response => {          
          //console.log(Object.keys(response));
          //the actual data of the response is stored in its json
          return response.json();
        }).then(photoData => {
          var feedImages = [];
          //get the "image" property of every photo, which is the base64
          photoData.forEach(photo => {
            feedImages.push(photo);
            console.log(photo.title);
            console.log(photo.description);
          });
          if(this.mounted) { //don't set state if the component has unmounted before the promises finish
            this.setState({ images: feedImages });
          }
        }).catch(error => console.log(error));
  }

  //this is here to enforce not updating state when the component is not mounted
  componentWillUnmount() {
    this.mounted = false;
  }

  _renderItem = (data, i) => (

    <TouchableWithoutFeedback key={i} onPress={() => alert(`${data._id} was pressed!`)}>
      <View style={styles.item}>
        <Image 
          source={{ uri: data.image}}
          style={styles.image}
        />

        { 
          data.verified ? 
          <View style={{ position: 'absolute', right: 5, bottom: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#5BBA47', justifyContent: 'center', alignItems: 'center'}} >
            <Text style={{ color: 'white' , backgroundColor: 'transparent'}}>✓</Text> 
          </View> :
          <View />
        }
        
      </View>
    </TouchableWithoutFeedback>
  );

  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        data={this.state.images}
        itemsPerRow={3}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: imageWidth,
    margin: 1,
    borderWidth: 1,
    borderColor: '#cccccc'
  },
  list: {
    flex: 1,
  },
  image: {
    flex: 1,
    height: imageWidth,
  }
});