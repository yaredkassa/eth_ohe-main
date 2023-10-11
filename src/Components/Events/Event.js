import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, IconButton, Text} from 'react-native-paper';

export default function Event({navigation, event, deleteEvent, activeDate}) {
 
  const checkYearly = () => {
    if (event.yearly != null && event.yearly != '') {
      const v = event.yearly.split(',');
      const d = activeDate.day + '/' + activeDate.month + '/0';
      return v.includes(d);
    }
    return false;
  };

  return (
    <View style={styles.eventBox}>
      <View style={styles.eventDate}>
        <Avatar.Icon
          style={{
            flex: 1,
            alignSelf: 'center',
            backgroundColor:
              event.type == 'yearly'
                ? 'gold'
                : event.type == 'monthly'
                ? checkYearly()
                  ? 'red'
                  : 'silver'
                : event.type == 'default'
                ? 'blue'
                : '#120809',
          }}
          icon={
            event.type == 'monthly'
              ? 'bell-circle'
              : event.type == 'default'
              ? 'web'
              : 'calendar-today'
          }
          size={35}
        />
      </View>
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Event', {
              event: event,
              activeDate: activeDate,
            })
          }>
          <View style={styles.eventContent}>
            {checkYearly() && <Text style={{fontSize: 10}}>የአመቱ</Text>}
            <Text style={styles.eventName}>{event.eventName}</Text>
            {event.eventDesc !== null ||
              (event.eventDesc !== '' && (
                <Text style={styles.description}>{event.eventDesc}</Text>
              ))}
            <Text style={styles.eventTime}>
              {event.startTime === 'allday'
                ? 'All Day'
                : event.startTime + ' - ' + event.endTime}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {event.type == 'user' && (
        <View style={styles.eventDate}>
          <View style={{flex: 1}} />
          <IconButton
            icon="delete"
            color="red"
            onPress={() =>
              deleteEvent(event._id, event.eventName, event.notifId)
            }
          />
          <View style={{flex: 1}} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 14,
    right: 0,
    bottom: 0,
  },
  txtinput: {
    margin: 10,
  },
  container: {
    backgroundColor: '#DCDCDC',
  },
  eventList: {},
  eventBox: {
    padding: 5,
    marginTop: 3,
    flexDirection: 'row',
  },
  eventBox1: {
    padding: 5,
    marginTop: 5,
    flexDirection: 'row',
  },
  eventDate: {
    flexDirection: 'column',
  },
  eventDay: {
    fontSize: 50,
    color: '#0099FF',
    fontWeight: '600',
  },
  eventMonth: {
    fontSize: 16,
    color: '#0099FF',
    fontWeight: '600',
  },
  eventContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
  },
  description: {
    fontSize: 15,
    color: '#646464',
  },
  eventTime: {
    fontSize: 14,
  },
  userName: {
    fontSize: 16,
    color: '#151515',
  },
  eventName: {
    fontSize: 20,
    color: '#151515',
  },
});
