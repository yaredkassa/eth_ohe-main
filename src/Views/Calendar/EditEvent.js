import React from 'react';
import {View, ScrollView} from 'react-native';
import EventForm from '../../Components/EventForm';

export default function EditEvent(props) {
  const event = props.route.params.event;

  return (
    <ScrollView>
      <View>
        <EventForm
          formType="editForm"
          navigation={props.navigation}
          event={event}
        />
      </View>
    </ScrollView>
  );
}
