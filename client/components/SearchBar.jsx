/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import styles from '../styles';

export default function SearchBar(props) {
  // Default search is empty strings for all input boxes
  const defaultSearch = {
    name: '',
    latitude: '',
    longitude: '',
  };
  // searchBar is the value of the text input in the search bar
  const [searchBar, setSearchBar] = useState(defaultSearch);
  // Function that gets invoked after submitting search bar
  const submitSearch = () => {
    // Fetch data about home break from backend
    fetch('http://localhost:3000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: searchBar.latitude,
        lng: searchBar.longitude,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // Set home break to the response object
        props.setHomeBreak({
          name: searchBar.name,
          latitude: searchBar.latitude,
          longitude: searchBar.longitude,
          swellHeight: data.swellHeight,
          h2oTemp: data.waterTemperature,
          weather: '',
          windDirection: data.windDirection,
          highLowTide: data.tide,
        });
        // Reset inputs to empty strings
        setSearchBar(defaultSearch);
        console.log(data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <View style={styles.searchBar}>
      <TextInput
        placeholder="Break Name"
        mode="outlined"
        value={searchBar.name}
        onChangeText={(e) => setSearchBar({ ...searchBar, name: e })}
      />
      <TextInput
        placeholder="Latitude"
        mode="outlined"
        value={searchBar.latitude}
        onChangeText={(e) => setSearchBar({ ...searchBar, latitude: e })}
      />
      <TextInput
        placeholder="Longitude"
        mode="outlined"
        value={searchBar.longitude}
        onChangeText={(e) => setSearchBar({ ...searchBar, longitude: e })}
      />
      {/* <Pressable style={styles.searchButton} onPressIn={submitSearch}>
        <Text style={{ color: 'white' }}>Surfs Up Bra</Text>
      </Pressable> */}
      <Button mode="contained" style={styles.searchButton} onPress={submitSearch}>
        Surf's Up Bra
      </Button>
    </View>
  );
}
