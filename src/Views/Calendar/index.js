import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import CalendarItem from '../../Components/CalendarItem';
import Events from '../../Components/Events';

import { today, convertToGreg } from '../../Helpers/Convertor';
import AppContext from '../../Helpers/Context';

import MonthlyEvents from '../../../MonthlyEvents.json';
import YearlyEvents from '../../../YearlyEvents.json';

import PushNotification from 'react-native-push-notification';
import realm from '../../Helpers/DB/realm';

export default function Calendar(props) {
  const [activeDate, setActiveDate] = useState({
    year: today().year,
    month: today().month,
    day: today().date,
  });
  const context = useContext(AppContext);

  const chTime = time => {
    if (time == "7:00 AM" || time == "7:00:00") {
      var h = +(time.split(':')[0]) <= 3
        ? 12 + (+(time.split(':')[0]) - 3)
        : +(time.split(':')[0]) - 3;

      var m = time.split(':')[1].split(' ')[0];
      const ap = time.split(':')[1].split(' ')[1];

      if (ap == 'PM' && h != 12) h = h + 12;
      else if (ap == 'AM' && h == 12) h = h + 12;

      if (h < 10) h = '0' + h;

      return h + ':' + m + ':00';
    }
    const d = new Date(Date.parse(time));
    const hx = d.getHours();
    const mx = d.getMinutes();
    const sx = d.getSeconds();

    return hx + ':' + mx + ':' + sx;
  };

  const getDate = (date, time, i) => {
    const d = +date.split('/')[0] + i;
    const m = +date.split('/')[1];
    var y = date.split('/')[2] == 0 ? activeDate.year : date.split('/')[2];

    if (
      m < activeDate.month ||
      (m == activeDate.month && +date.split('/')[0] < activeDate.day)
    ) {
      y = +y + 1;
    }

    const c = convertToGreg(y, m, d);

    // console.log(time);

    const t = time == 'allday' ? '7:00:00' : chTime(time);
    let day = c.getDate();
    let month = c.getMonth();

    day = day <= 9 ? "0" + day : day;
    month = month <= 9 ? "0" + month : month;

    const newdate = Date.parse(
      c.getFullYear() + '-' + month + '-' + day + 'T' + t
    );
    // console.log(new Date(newdate))
    return new Date(newdate);
  };

  const setNotifications = allevents => {
    const realmNotifs = realm.objects('HiddenNotification');
    allevents.map(event => {
      if (event.yearly != null && event.yearly != '') {
        if (event.yearly.split(',').length == 1) {
          const date1 = getDate(event.yearly.split(',')[0], event.startTime, -2);
          const date2 = getDate(event.yearly.split(',')[0], event.startTime, -1);
          const date3 = getDate(event.yearly.split(',')[0], event.startTime, 0);
          const notif1 = event._id + '1' + date1.getMonth() + ('' + date1.getFullYear()).slice(-2);
          const notif2 = event._id + '2' + date2.getMonth() + ('' + date2.getFullYear()).slice(-2);
          const notif3 = event._id + '3' + date3.getMonth() + ('' + date3.getFullYear()).slice(-2);
          const f1 = realmNotifs.filtered("_id == '" + notif1 + "'",);
          const f2 = realmNotifs.filtered("_id == '" + notif2 + "'",);
          const f3 = realmNotifs.filtered("_id == '" + notif3 + "'",);
          var m1 = +event.yearly.split(',')[0].split('/')[1];
          var m2 = +event.yearly.split(',')[0].split('/')[1];
          var m3 = +event.yearly.split(',')[0].split('/')[1];
          if ((m1 > activeDate.month || (m1 == activeDate.month && (+event.yearly.split(',')[0].split('/')[0] - 2) >= activeDate.day)) && (f1.length <= 0)) saveNotification(event, notif1, date1);
          if ((m2 > activeDate.month || (m2 == activeDate.month && (+event.yearly.split(',')[0].split('/')[0] - 1) >= activeDate.day)) && (f2.length <= 0)) saveNotification(event, notif2, date2);
          if ((m3 > activeDate.month || (m3 == activeDate.month && +event.yearly.split(',')[0].split('/')[0] >= activeDate.day)) && (f3.length <= 0)) saveNotification(event, notif3, date3);
        } else {
          event.yearly.split(',').map(yearly => {
            const date1 = getDate(yearly, event.startTime, -2);
            const date2 = getDate(yearly, event.startTime, -1);
            const date3 = getDate(yearly, event.startTime, 0);
            const notif1 = event._id + '1' + date1.getMonth() + ('' + date1.getFullYear()).slice(-2);
            const notif2 = event._id + '2' + date2.getMonth() + ('' + date2.getFullYear()).slice(-2);
            const notif3 = event._id + '3' + date3.getMonth() + ('' + date3.getFullYear()).slice(-2);
            const f1 = realmNotifs.filtered("_id == '" + notif1 + "'",);
            const f2 = realmNotifs.filtered("_id == '" + notif2 + "'",);
            const f3 = realmNotifs.filtered("_id == '" + notif3 + "'",);
            if (f1.length <= 0) saveNotification(event, notif1, date1);
            if (f2.length <= 0) saveNotification(event, notif2, date2);
            if (f3.length <= 0) saveNotification(event, notif3, date3);
            var m1 = +yearly.split(',')[0].split('/')[1];
            var m2 = +yearly.split(',')[0].split('/')[1];
            var m3 = +yearly.split(',')[0].split('/')[1];
            if ((m1 > activeDate.month || (m1 == activeDate.month && (+yearly.split(',')[0].split('/')[0] - 2) >= activeDate.day)) && (f1.length <= 0)) saveNotification(event, notif1, date1);
            if ((m2 > activeDate.month || (m2 == activeDate.month && (+yearly.split(',')[0].split('/')[0] - 1) >= activeDate.day)) && (f2.length <= 0)) saveNotification(event, notif2, date2);
            if ((m3 > activeDate.month || (m3 == activeDate.month && +yearly.split(',')[0].split('/')[0] >= activeDate.day)) && (f3.length <= 0)) saveNotification(event, notif3, date3);
          });
        }
      } else {
        const date1 = getDate(event.startDate, event.startTime, -2);
        const date2 = getDate(event.startDate, event.startTime, -1);
        const date3 = getDate(event.startDate, event.startTime, 0);
        const notif1 = event._id + '1' + date1.getMonth() + ('' + date1.getFullYear()).slice(-2);
        const notif2 = event._id + '2' + date2.getMonth() + ('' + date2.getFullYear()).slice(-2);
        const notif3 = event._id + '3' + date3.getMonth() + ('' + date3.getFullYear()).slice(-2);
        const f1 = realmNotifs.filtered("_id == '" + notif1 + "'",);
        const f2 = realmNotifs.filtered("_id == '" + notif2 + "'",);
        const f3 = realmNotifs.filtered("_id == '" + notif3 + "'",);
        if (f1.length <= 0) saveNotification(event, notif1, date1);
        if (f2.length <= 0) saveNotification(event, notif2, date2);
        if (f3.length <= 0) saveNotification(event, notif3, date3);
        var m1 = +event.startDate.split(',')[0].split('/')[1];
        var m2 = +event.startDate.split(',')[0].split('/')[1];
        var m3 = +event.startDate.split(',')[0].split('/')[1];
        if ((m1 > activeDate.month || (m1 == activeDate.month && (+event.startDate.split(',')[0].split('/')[0] - 2) >= activeDate.day)) && (f1.length <= 0)) saveNotification(event, notif1, date1);
        if ((m2 > activeDate.month || (m2 == activeDate.month && (+event.startDate.split(',')[0].split('/')[0] - 1) >= activeDate.day)) && (f2.length <= 0)) saveNotification(event, notif2, date2);
        if ((m3 > activeDate.month || (m3 == activeDate.month && +event.startDate.split(',')[0].split('/')[0] >= activeDate.day)) && (f3.length <= 0)) saveNotification(event, notif3, date3);
      }
    });
  };

  const saveNotification = (event, notifId, date) => {
    const color = context.color.primary;

    let notification;
    try {
      realm.write(() => {
        notification = realm.create('HiddenNotification', {
          _id: notifId,
          title: event.eventName,
          body:
            event.eventDesc == null || event.eventDesc == ''
              ? 'You have an event'
              : event.eventDesc,
          color: color,
          channelId: 'test-channel',
          createdAt: date + '',
          type: 'hidden',
        });

        setNotification(event, notifId, date);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const setNotification = (event, notifId, date) => {
    const color = context.color.primary;

    PushNotification.localNotificationSchedule({
      channelId: 'test-channel',
      id: notifId,
      title: event.eventName,
      message:
        event.eventDesc == null || event.eventDesc == ''
          ? 'You have an event'
          : event.eventDesc,
      date: date,
      color: color,
      allowWhileIdle: true,
      soundName: 'my_sound.mp3',
    });
  };

  const getEvents = () => {
    let yearly = YearlyEvents;

    let monthly = MonthlyEvents.filter(function (event) {
      return event.yearly != null && event.yearly != '';
    });

    const allevents = [...yearly, ...monthly];
    setNotifications(allevents);
  };

  useEffect(() => {
    getEvents();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CalendarItem activeDate={activeDate} setActiveDate={setActiveDate} />
      <ScrollView>
        <Events navigation={props.navigation} activeDate={activeDate} />
        <View style={{ margin: 35 }} />
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => props.navigation.navigate('Create Event')}
      />
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
});
