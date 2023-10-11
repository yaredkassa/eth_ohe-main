import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FAB, Text, Snackbar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import images from '../../../assets/images';

import { months } from '../../Helpers/Others';
import { convertToGreg } from '../../Helpers/Convertor';
import realm from '../../Helpers/DB/realm';
import PushNotification from 'react-native-push-notification';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import AppContext from '../../Helpers/Context';

export default function EventDetail(props) {
  const event = props.route.params.event;
  const activeDate = props.route.params.activeDate;
  const adUnitId = __DEV__ ? TestIds.BANNER : '988377735671833_998104918032448';
  const context = useContext(AppContext);

  const turnDateReadable = date => {
    const strD = date.split('/');
    const y = strD[2];
    const m = strD[1];
    const d = strD[0];

    if ((y == 0 && m != 0) || (y == null && m != null))
      return 'Yearly on ' + months[m - 1] + ' ' + d;
    else if ((y == 0 && m == 0) || (y == null && m == null))
      return 'Monthly, on day ' + d;
    else return 'On ' + date;
  };

  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const checkYearly = () => {
    if (event.yearly != null && event.yearly != '') {
      const v = event.yearly.split(',');
      const d = activeDate.day + '/' + activeDate.month + '/0';
      return v.includes(d);
    }
    return false;
  };

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
    const m = date.split('/')[1] == 0 ? activeDate.month : date.split('/')[1];
    const y = date.split('/')[2] == 0 ? activeDate.year : date.split('/')[2];

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

  const saveNotification = () => {
    const date = new Date(getDate(event.startDate, event.startTime));
    const color = context.color.primary;

    var notifId =
      event.type == 'default'
        ? Math.floor(Math.random() * 100) + 1 + ''
        : event._id + '' + activeDate.month + ('' + activeDate.year).slice(-2);

    let notification;
    try {
      realm.write(() => {
        notification = realm.create('Notification', {
          _id: notifId,
          title: event.eventName,
          body:
            event.eventDesc == null || event.eventDesc == ''
              ? 'You have an event'
              : event.eventDesc,
          color: color,
          channelId: 'test-channel',
          createdAt: date + '',
          type: 'local',
        });

        onToggleSnackBar();
        console.log(`created notification: ${notification.title}`);
        setNotification(notifId, date, color);
      });
    } catch (error) {
      alert('Error Creating Notification!');
      console.log(error);
    }
  };

  const setNotification = (notifId, date, color) => {
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ flexDirection: 'column', flex: 1, padding: 10 }}>
          {event.type != 'user' && (
            <>
              {event.type == 'monthly' || event.type == 'yearly' ? (
                <Image
                  source={images['image' + event._id]}
                  style={[styles.elevatedImageConstainer, {
                    borderWidth: checkYearly() ? 3 : 0,
                  }]}
                />
              ) : (
                <Image
                  source={{
                    uri: event.eventImage != null ? event.eventImage : "https://nigs.laladigitalsystems.com/no_image.webp",
                  }}
                  style={[styles.elevatedImageConstainer, {
                    borderWidth: checkYearly() ? 3 : 0,
                  }]}
                />
              )}
            </>
          )}
          <View style={styles.elevatedConstainer}>
            <Text
              style={{
                fontSize: 30,
                marginBottom: 10,
                marginTop: 20,
                color: 'black',
                textDecorationLine: checkYearly() ? 'underline' : 'none',
                textAlign: 'center',
              }}>
              {event.eventName} {checkYearly() && '(የአመቱ)'}
            </Text>
            <Text style={{ fontSize: 14, marginTop: 10, textAlign: "center" }}>
              {event.endDate == ''
                ? turnDateReadable(event.startDate)
                : 'From ' + event.startDate + ' to ' + event.endDate}
            </Text>
            <Text style={{ fontSize: 14, textAlign: "center" }}>
              {event.startTime == 'allday'
                ? 'All Day'
                : event.startTime + ' to ' + event.endTime}
            </Text>
            {event.type != 'user' && event.type != 'default' && (
              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#f1400f',
                    padding: 12,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    borderRadius: 15,
                  }}
                  onPress={() => saveNotification()}>
                  <Ionicons name="alarm-outline" size={20} color="#fff" />
                  <Text style={{ marginLeft: 5, fontSize: 14, color: '#fff' }}>
                    Notify Me
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 10 }}>
              {event.type == 'user' ? 'Created by the user' : 'System Event'}
            </Text>
          </View>

          <View style={{ marginVertical: 15 }}>
            <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.FULL_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
              onAdLoaded={() => {
                console.log('Advert loaded');
              }}
              onAdFailedToLoad={error => {
                console.error('Advert failed to load: ', error);
              }}
            />
          </View>

          {event.eventDesc != '' && (
            <View style={styles.elevatedConstainer}>
              <Text style={{ fontSize: 16, textAlign: "justify", margin: 5 }}>
                {event.eventDesc}
              </Text>
            </View>
          )}

        </View>
      </ScrollView>

      {event.type == 'user' && (
        <FAB
          style={styles.fab}
          icon="pencil"
          onPress={() =>
            props.navigation.navigate('Edit Event', {
              event: event,
            })
          }
        />
      )}
      <Snackbar visible={visible} onDismiss={onDismissSnackBar} duration={5000}>
        You'll be notified!
      </Snackbar>
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
  elevatedConstainer: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    marginHorizontal: 8
  },
  elevatedImageConstainer: {
    // elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: '100%',
    height: 350,
    borderColor: '#f1400f'
  }
});
