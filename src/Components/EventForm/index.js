import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'react-native-paper';
import PushNotification from 'react-native-push-notification';
import { convertToGreg, today } from '../../Helpers/Convertor';
import realm from '../../Helpers/DB/realm';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { months, isLeapYear } from '../../Helpers/Others';
import AppContext from '../../Helpers/Context';

const days1 = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
];
const days2 = ['1', '2', '3', '4', '5'];
const days3 = ['1', '2', '3', '4', '5', '6'];

export default function EventForm(props) {
  const adUnitId = __DEV__ ? TestIds.BANNER : '988377735671833_998104918032448';
  const context = useContext(AppContext);
  const [activeDate, setActiveDate] = useState({
    year: today().year,
    month: today().month,
    day: today().date,
  });

  const [eventName, setEventName] = useState();
  const [eventDesc, setEventDesc] = useState();
  const [startDay, setStartDay] = useState({
    day: activeDate.day,
    month: activeDate.month,
    year: activeDate.year,
  });
  const [endDay, setEndDay] = useState({
    day: activeDate.day + 1,
    month: activeDate.month,
    year: activeDate.year,
  });
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().setHours(startTime.getHours() + 1)),
  );

  const [isAllDay, setIsAllDay] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isOneDay, setIsOneDay] = useState(true);
  const [isYearly, setIsYearly] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);

  const changeStartDay = (day, month, year) => {
    if ((month === 13 && day < 1) || day > 6) {
      setStartDay({
        ...startDay,
        day: 1,
      });
    }

    setStartDay({
      day: day,
      month: month,
      year: year,
    });
  };
  const changeEndDay = (day, month, year) => {
    if ((month === 13 && day < 1) || day > 6) {
      setEndDay({
        ...endDay,
        day: 1,
      });
    }

    setEndDay({
      day: day,
      month: month,
      year: year,
    });
  };

  const changeStartTime = (event, selectedDate) => {
    setShowStartPicker(false);
    console.log(selectedDate)
    setStartTime(selectedDate ? new Date(selectedDate) : new Date());
    setEndTime(
      new Date(
        new Date().setHours(
          (selectedDate
            ? new Date(selectedDate).getHours()
            : new Date().getHours()) + 1,
        ),
      ),
    );
  };
  const changeEndTime = (event, selectedDate) => {
    setShowEndPicker(false);
    setEndTime(selectedDate ? new Date(selectedDate) : new Date());
  };
  const getTime = (h, m) => {
    var hr = h;

    var ampm = hr >= 12 ? 'PM' : 'AM';
    hr = hr % 12;
    hr = hr ? hr : 12;

    if (h > 12) hr = h - 12;

    var hour = '' + hr;
    var min = '' + m;

    // the hour '0' should be '12'

    if (hr < 10) hour = '0' + hr;
    if (m < 10) min = '0' + m;

    return hour + ':' + min + ' ' + ampm;
  };

  const chTime = time => {
    const ampm = (time+"").split(':')[1].split(' ')[1];
    if (ampm == "AM" || ampm == "PM") {
    console.log(time)
      // var h = +(time.split(':')[0]) <= 3
      //   ? 12 + (+(time.split(':')[0]) - 3)
      //   : +(time.split(':')[0]) - 3;
      var h = time.split(":")[0];

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

  const updateForm = useCallback(() => {
    if (props.formType == 'editForm') {
      setEventName(props.event.eventName);
      setEventDesc(props.event.eventDesc);

      if (props.event.endDate == '') setIsOneDay(true);
      else setIsOneDay(false);

      if (props.event.startTime == 'allday') setIsAllDay(true);
      else setIsAllDay(false);

      if (props.event.startDate) {
        if (props.event.startDate.split('/')[1] == '0') setIsMonthly(true);
        else setIsMonthly(false);

        if (
          props.event.startDate.split('/')[1] != '0' &&
          props.event.startDate.split('/')[2] == '0'
        ) {
          setIsYearly(true);
          setIsMonthly(false);
        } else setIsYearly(false);

        changeStartDay(
          +props.event.startDate.split('/')[0],
          +props.event.startDate.split('/')[1],
          +props.event.startDate.split('/')[2],
        );

        if (props.event.startTime != 'allday') {
          const newdate = new Date(
            convertToGreg(
              +props.event.startDate.split('/')[2],
              +props.event.startDate.split('/')[1],
              +props.event.startDate.split('/')[0],
            ) +
            'T' +
            chTime(props.event.startTime ? props.event.startTime : "7:00 AM"),
          );
          setStartTime(newdate);
        }

        if (props.event.endTime != 'allday') {
          const newdate = new Date(
            convertToGreg(
              +props.event.startDate.split('/')[2],
              +props.event.startDate.split('/')[1],
              +props.event.startDate.split('/')[0],
            ) +
            'T' +
            chTime(props.event.endTime ? props.event.endTime : "7:00 PM"),
          );
          setEndTime(newdate);
        }
      }

      if (props.event.endDate) {
        changeStartDay(
          +props.event.endDate.split('/')[0],
          +props.event.endDate.split('/')[1],
          +props.event.endDate.split('/')[2],
        );
      }
    }
  }, []);

  useEffect(() => {
    updateForm();
  }, [updateForm]);

  const getDate = (date, time) => {
    const d = date.day;
    const m = date.month == 0 ? activeDate.month : date.month;
    const y = date.year == 0 ? activeDate.year : date.year;

    const c = convertToGreg(y, m, d);

    const t = time == isAllDay ? '7:00:00' : chTime(time ? time : "7:00 AM");

    let day = c.getDate();
    let month = c.getMonth();

    day = day <= 9 ? "0" + day : day;
    month = month <= 9 ? "0" + month : month;

    const newdate = Date.parse(
      c.getFullYear() + '-' + month + '-' + day + 'T' + t
    );
    return newdate;
  };

  const handleSubmit = () => {
    if (eventName) {
      const event = {
        eventName: eventName,
        eventDesc: eventDesc == null ? '' : eventDesc,
        startDate: isYearly
          ? startDay.day + '/' + startDay.month + '/0'
          : isMonthly
            ? startDay.day + '/0/0'
            : startDay.day + '/' + startDay.month + '/' + startDay.year,
        endDate: isOneDay
          ? ''
          : isYearly
            ? endDay.day + '/' + endDay.month + '/0'
            : isMonthly
              ? endDay.day + '/0/0'
              : endDay.day + '/' + endDay.month + '/' + endDay.year,
        startTime: isAllDay
          ? 'allday'
          : getTime(startTime.getHours(), startTime.getMinutes()),
        endTime: isAllDay
          ? 'allday'
          : getTime(endTime.getHours(), endTime.getMinutes()),
        type: 'user',
      };

      if (props.formType == 'editForm') {
        const notifId = Math.floor(Math.random() * 100) + 1 + '';
        PushNotification.cancelLocalNotification(props.event.notifId);
        realm.write(() => {
          realm.delete(realm.objectForPrimaryKey('Notification', props.event.notifId));
        });
        realm.write(() => {
          const oldEvent = realm.objectForPrimaryKey('Event', props.event._id);
          oldEvent.eventName = event.eventName;
          oldEvent.eventDesc = event.eventDesc;
          oldEvent.startDate = event.startDate;
          oldEvent.endDate = event.endDate;
          oldEvent.startTime = event.startTime;
          oldEvent.endTime = event.endTime;
          oldEvent.notifId = notifId;

          console.log(`updated event: ${oldEvent.eventName}`);
        });

        setNotifications(notifId);
        props.navigation.replace('Calendar');
      } else {
        const notifId = Math.floor(Math.random() * 100) + 1 + '';
        let newEvent;
        realm.write(() => {
          newEvent = realm.create('Event', {
            _id: 'event_' + Math.floor(Math.random() * 1e16),
            eventName: event.eventName,
            eventDesc: event.eventDesc,
            startDate: event.startDate,
            endDate: event.endDate,
            startTime: event.startTime,
            endTime: event.endTime,
            notifId: notifId,
            type: 'user',
          });
          console.log(`created event: ${newEvent.eventName}`);
        });

        setNotifications(notifId);
        props.navigation.replace('Calendar');
      }
    }
  };

  const setNotifications = notifId => {
    const date = new Date(getDate(startDay, startTime));
    const color = context.color.primary;

    PushNotification.localNotificationSchedule({
      channelId: 'test-channel',
      id: notifId,
      title: eventName,
      message:
        eventDesc == null || eventDesc == '' ? 'You have an event' : eventDesc,
      date: date,
      color: color,
      allowWhileIdle: true,
      soundName: 'my_sound.mp3',
    });

    saveNotifications(notifId, date, color);
  };

  const saveNotifications = (id, date, color) => {
    let notification;
    realm.write(() => {
      notification = realm.create('Notification', {
        _id: id,
        title: eventName,
        body:
          eventDesc == null || eventDesc == ''
            ? 'You have an event'
            : eventDesc,
        color: color,
        channelId: 'test-channel',
        createdAt: date + '',
        type: 'local',
      });
      console.log(`created notification: ${notification.title}`);
    });
  };

  return (
    <ScrollView>
      <View>
        <View style={{ backgroundColor: context.color.primary, padding: 12 }}>
          {/* <Text style={styles.label}>Event Name</Text> */}

          <TextInput
            style={[styles.input, { borderColor: context.color.primary }]}
            onChangeText={text => setEventName(text)}
            value={eventName}
            autoFocus={true}
            placeholder='Event Name'
            autoCapitalize="none"
            maxLength={50}
          />
          {/* <Text style={styles.label}>Description</Text> */}
          <TextInput
            style={[styles.input, { borderColor: context.color.primary }]}
            onChangeText={text => setEventDesc(text)}
            placeholder='Description'
            value={eventDesc}
            numberOfLines={2}
            multiline
          />
        </View>

        <View style={[styles.elevatedConstainer, { marginHorizontal: 15, marginTop: 25, backgroundColor: context.color.primary }]}>
          <Checkbox.Item
            label="This is a one day event"
            color='#fff'
            status={isOneDay ? 'checked' : 'unchecked'}
            onPress={() => {
              setIsOneDay(!isOneDay);
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <View style={[styles.elevatedConstainer, { flex: 1, marginHorizontal: 15, backgroundColor: context.color.primary }]}>
            <Checkbox.Item
              label="Yearly"
              color='#fff'
              status={isYearly ? 'checked' : 'unchecked'}
              onPress={() => {
                setIsYearly(!isYearly);
                setIsMonthly(false);
              }}
            />
          </View>

          {!isYearly && (
            <View style={[styles.elevatedConstainer, { flex: 1, marginHorizontal: 15, backgroundColor: context.color.primary }]}>
              <Checkbox.Item
                label="Monthly"
                color='#fff'
                status={isMonthly ? 'checked' : 'unchecked'}
                onPress={() => {
                  setIsMonthly(!isMonthly);
                }}
              />
            </View>
          )}
        </View>

        <View style={{ margin: 10 }} />

        {!isOneDay && <Text style={{ marginHorizontal: 18 }}>From</Text>}
        <View style={[styles.elevatedConstainer, {
          flexDirection: 'row',
          // borderColor: '#09011c',
          // borderWidth: 1,
          marginTop: 5,
          marginHorizontal: 15,
          backgroundColor: context.color.primary
        }]}>
          <Picker
            selectedValue={startDay.day}
            style={{ flex: 1, marginLeft: 5, color: '#fff' }}
            dropdownIconColor="#808080"
            onValueChange={(itemValue, itemIndex) =>
              changeStartDay(itemValue, startDay.month, startDay.year)
            }>
            {startDay.month == 13
              ? isLeapYear(startDay.year)
                ? days3.map((item, i) => (
                  <Picker.Item key={i} label={item} value={i + 1} />
                ))
                : days2.map((item, i) => (
                  <Picker.Item key={i} label={item} value={i + 1} />
                ))
              : days1.map((item, i) => (
                <Picker.Item key={i} label={item} value={i + 1} />
              ))}
          </Picker>

          {!isMonthly && (
            <>
              <Picker
                selectedValue={startDay.month}
                style={{ flex: 1, marginLeft: 5, color: '#fff' }}
                dropdownIconColor="#808080"
                onValueChange={(itemValue, itemIndex) =>
                  changeStartDay(startDay.day, itemValue, startDay.year)
                }>
                {months.map((item, i) => (
                  <Picker.Item key={i} label={item} value={i + 1} />
                ))}
              </Picker>

              {!isYearly && (
                <TextInput
                  label="Year"
                  keyboardType="numeric"
                  value={startDay.year.toString()}
                  style={{ flex: 0.6, marginLeft: 5, color: '#fff' }}
                  onChangeText={text =>
                    changeStartDay(startDay.day, startDay.month, +text)
                  }
                  maxLength={4}
                />
              )}
            </>
          )}
        </View>

        {!isOneDay && (
          <>
            <Text style={{ marginHorizontal: 18, marginTop: 15 }}>To</Text>
            <View
              style={[styles.elevatedConstainer, {
                flexDirection: 'row',
                // borderColor: '#09011c',
                // borderWidth: 1,
                marginTop: 5,
                marginHorizontal: 15,
                backgroundColor: context.color.primary
              }]}>
              <Picker
                selectedValue={endDay.day}
                style={{ flex: 1, marginLeft: 5, color: '#fff' }}
                dropdownIconColor="#808080"
                onValueChange={(itemValue, itemIndex) =>
                  changeEndDay(itemValue, endDay.month, endDay.year)
                }>
                {endDay.month == 13
                  ? isLeapYear(endDay.year)
                    ? days3.map((item, i) => (
                      <Picker.Item key={i} label={item} value={i + 1} />
                    ))
                    : days2.map((item, i) => (
                      <Picker.Item key={i} label={item} value={i + 1} />
                    ))
                  : days1.map((item, i) => (
                    <Picker.Item key={i} label={item} value={i + 1} />
                  ))}
              </Picker>

              {!isMonthly && (
                <>
                  <Picker
                    selectedValue={endDay.month}
                    style={{ flex: 1, marginLeft: 5, color: '#fff' }}
                    dropdownIconColor="#808080"
                    onValueChange={(itemValue, itemIndex) =>
                      changeEndDay(endDay.day, itemValue, endDay.year)
                    }>
                    {months.map((item, i) => (
                      <Picker.Item key={i} label={item} value={i + 1} />
                    ))}
                  </Picker>

                  {!isYearly && (
                    <TextInput
                      label="Year"
                      keyboardType="numeric"
                      value={endDay.year.toString()}
                      style={{ flex: 0.6, marginLeft: 5, color: '#fff' }}
                      onChangeText={text =>
                        changeStartDay(endDay.day, endDay.month, +text)
                      }
                      maxLength={4}
                    />
                  )}
                </>
              )}
            </View>
          </>
        )}

        <View style={[styles.elevatedConstainer, { marginHorizontal: 15, marginTop: 30, backgroundColor: context.color.primary }]}>
          <Checkbox.Item
            position="leading"
            color='#fff'
            label="All Day"
            status={isAllDay ? 'checked' : 'unchecked'}
            onPress={() => {
              setIsAllDay(!isAllDay);
            }}
            style={{ width: 150 }}
          />
        </View>

        {!isAllDay && (
          <>
            <View style={{ flexDirection: 'row', marginTop: 25 }}>
              <TouchableOpacity
                style={[styles.setTime, { backgroundColor: context.color.primary }]}
                onPress={() => setShowStartPicker(true)}>
                <Text style={styles.setTimeText}>
                  {getTime(startTime.getHours(), startTime.getMinutes())}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.setTime, { backgroundColor: context.color.primary }]}
                onPress={() => setShowEndPicker(true)}>
                <Text style={styles.setTimeText}>
                  {getTime(endTime.getHours(), endTime.getMinutes())}
                </Text>
              </TouchableOpacity>
            </View>
            {showStartPicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={startTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={changeStartTime}
              />
            )}
            {showEndPicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={endTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={changeEndTime}
              />
            )}
          </>
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: context.color.accent }]} onPress={handleSubmit}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>

        <View style={{ margin: 10 }}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    // padding: 10,
  },
  input: {
    borderWidth: 1,
    // borderColor: '#09011c',
    fontSize: 18,
    padding: 12,
    marginBottom: 15,
    color: '#000',
    backgroundColor: "#fff",
    borderRadius: 10
  },
  elevatedConstainer: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    // backgroundColor: "#09011c",
    borderRadius: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  setTime: {
    flex: 1,
    padding: 15,
    marginHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    // backgroundColor: "#09011c",
    borderRadius: 20,
  },
  setTimeText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ad0519',
    flex: 1,
    padding: 10,
    marginLeft: 5,
    marginRight: 10,
    marginTop: 25,
    marginBottom: 25,
  },
  button: {
    // backgroundColor: '#f1400f',
    flex: 1,
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 35,
    borderRadius: 10
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: '#0077cc',
    fontWeight: 'bold',
  },
});
