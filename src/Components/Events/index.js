import React, { useState, useCallback, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import axios from 'axios';

import { months, weekDays } from '../../Helpers/Others';
import { convertToGreg } from '../../Helpers/Convertor';
import Event from './Event';

import MonthlyEvents from '../../../MonthlyEvents.json';
import YearlyEvents from '../../../YearlyEvents.json';

import realm from '../../Helpers/DB/realm';
import PushNotification from 'react-native-push-notification';

export default function Events({ navigation, activeDate }) {
  const [todaysEvents, setTodaysEvents] = useState([]);

  const getEvents = useCallback(() => {
    let yearly = YearlyEvents.filter(function (event) {
      return (
        activeDate.day === +event.startDate.split('/')[0] &&
        activeDate.month === +event.startDate.split('/')[1]
      );
    });

    let monthly = MonthlyEvents.filter(function (event) {
      return event.startDate.split('/')[0] == activeDate.day;
    });

    const realmEvents = realm.objects('Event');
    const filterDate1 =
      activeDate.day + '/' + activeDate.month + '/' + activeDate.year;
    const filterDate2 = activeDate.day + '/0/0';
    const filterDate3 = activeDate.day + '/' + activeDate.month + '/0';
    const localEvents1 = realmEvents.filtered(
      "startDate == '" + filterDate1 + "'",
    );
    const localEvents2 = realmEvents.filtered(
      "startDate == '" + filterDate2 + "'",
    );
    const localEvents3 = realmEvents.filtered(
      "startDate == '" + filterDate3 + "'",
    );

    const localEvents = [
      ...yearly,
      ...monthly,
      ...localEvents1,
      ...localEvents2,
      ...localEvents3
    ];

    axios({
      url: 'http://nigs.laladigitalsystems.com/api/',
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: `
          query EventsToday($startDate: String!){
            eventsToday(startDate: $startDate){
              _id
              eventName
              eventDesc
              eventImage
              startDate
              endDate
              startTime
              endTime
              type
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          startDate: filterDate1,
        },
      },
    })
      .then(result => {
        setTodaysEvents([]);
        let e = [
          ...localEvents,
          ...result.data.data.eventsToday
        ];
        setTodaysEvents(e);
      })
      .catch(error => {
        console.log(error);
        setTodaysEvents([]);
        setTodaysEvents(localEvents);
      });

    setTodaysEvents([]);
    setTodaysEvents(localEvents);
  }, [activeDate.day, activeDate.month]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const getWeekDay = () => {
    var g = convertToGreg(activeDate.year, activeDate.month, activeDate.day);
    return weekDays[
      new Date(g.getFullYear(), g.getMonth() - 1, g.getDate()).getDay()
    ];
  };

  const showAlert = (eventID, eventName, notifId) =>
    Alert.alert(
      'Delete Event?',
      "Are you sure you want to delete '" + eventName + "'?",
      [
        {
          text: 'No',
          // onPress: () => Alert.alert("Cancel Pressed"),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => deleteEvents(eventID, notifId),
          style: 'default',
        },
      ],
      {
        cancelable: true,
      },
    );

  const deleteEvents = (eventID, notifId) => {
    console.log(notifId)
    realm.write(() => {
      realm.delete(realm.objectForPrimaryKey('Event', eventID));
    });
    PushNotification.cancelLocalNotification(notifId);
    if (realm.objectForPrimaryKey('Notification', notifId)) {
      realm.write(() => {
        realm.delete(realm.objectForPrimaryKey('Notification', notifId));
      });
    }
    getEvents();
  };

  const deleteEvent = (eventID, eventName, notifId) => {
    showAlert(eventID, eventName, notifId);
  };

  return (
    <View>
      <Text
        style={{
          fontWeight: '500',
          fontSize: 14,
          textAlign: 'center',
          margin: 10,
        }}>
        {getWeekDay() + ' ፥ '}
        {months[activeDate.month - 1]} &nbsp;
        {activeDate.day + ' ፥ '}
        {activeDate.year}
      </Text>
      <View
        style={{
          marginHorizontal: 5
        }}
      >
        {todaysEvents.length <= 0 ? (
          <Text style={{ padding: 10 }}>No events today</Text>
        ) : (
          <>
            {todaysEvents.map((item, i) => (
              <Event
                key={item._id}
                event={item}
                navigation={navigation}
                deleteEvent={deleteEvent}
                activeDate={activeDate}
              />
            ))}
          </>
        )}
      </View>
    </View>
  );
}
