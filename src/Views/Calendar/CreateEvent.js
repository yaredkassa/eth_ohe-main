import React from 'react';
import {View, ScrollView} from 'react-native';
import EventForm from '../../Components/EventForm';

export default function CreateEvent(props) {
  return (
    <ScrollView>
      <View>
        <EventForm formType="createFrom" navigation={props.navigation} />
      </View>
    </ScrollView>
  );
}
