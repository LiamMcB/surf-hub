import React from 'react';
import { View, Modal, Button, Image } from 'react-native';
import styles from '../styles';
import partyWave from '../../assets/partywave.png';

export default function ViewMoreModal(props) {
  // State that toggles whether modal is visible or not
  const { modalVisible, setModalVisible } = props;

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => console.log('closed')}
    >
      <View style={styles.modalContainer}>
        <Button title="Exit Modal" onPress={() => setModalVisible(false)} />
        <Image source={partyWave} />
      </View>
    </Modal>
  );
}
