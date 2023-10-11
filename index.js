import { Alert, AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

import { today, convertToGreg } from './src/Helpers/Convertor';
import realm from './src/Helpers/DB/realm';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION: ', notification);
    if (!isEmpty(notification.data)) {
      saveNotification(
        notification.data.startDate,
        notification.data.startTime,
        notification.data.eventName,
        notification.data.eventDesc,
      );
    }
    if (notification.title) {
      Alert.alert(notification.title, notification.message);
    }
  },
  requestPermissions: Platform.OS === 'ios',
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (!isEmpty(remoteMessage.data)) {
    saveNotification(
      remoteMessage.data.startDate,
      remoteMessage.data.startTime,
      remoteMessage.data.eventName,
      remoteMessage.data.eventDesc,
    );
  }
});

messaging().onNotificationOpenedApp(async remoteMessage => {
  console.log('Message opened!', remoteMessage);
  Alert.alert(
    remoteMessage.notification.title,
    remoteMessage.notification.body,
  );
});

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
}

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


const getDate = (date, time) => {
  const d = date.split('/')[0];
  const m = date.split('/')[1] == 0 ? today().month : date.split('/')[1];
  const y = date.split('/')[2] == 0 ? today().year : date.split('/')[2];

  const c = convertToGreg(y, m, d);

  const t = time == 'allday' ? '7:00:00' : chTime(time);
    
  let day = c.getDate();
  let month = c.getMonth();

  day = day <= 9 ? "0" + day : day;
  month = month <= 9 ? "0" + month : month;

  const newdate = Date.parse(
    c.getFullYear() + '-' + month + '-' + day + 'T' + t
  );
  return newdate;
};

const saveNotification = (startDate, startTime, eventName, eventDesc) => {
  const date = new Date(getDate(startDate, startTime));
  const color = '#09011c';

  var notifId = Math.floor(Math.random() * 100) + 1 + '';

  let notification;
  try {
    realm.write(() => {
      notification = realm.create('Notification', {
        _id: notifId,
        title: eventName,
        body: eventDesc,
        color: color,
        channelId: 'test-channel',
        createdAt: date + '',
        type: 'online',
      });

      console.log(`created notification: ${notification.title}`);
      setNotification(notifId, date, color, eventName, eventDesc);
    });
  } catch (error) {
    alert('Error Creating Notification!');
    console.log(error);
  }
};

const setNotification = (notifId, date, color, eventName, eventDesc) => {
  PushNotification.localNotificationSchedule({
    channelId: 'test-channel',
    id: notifId,
    title: eventName,
    message: eventDesc,
    date: date,
    color: color,
    allowWhileIdle: true,
    soundName: 'my_sound.mp3',
  });
};



AppRegistry.registerComponent(appName, () => App);
