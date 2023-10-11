import React, { useState, useCallback, useEffect } from 'react';
import { FlatList, View, RefreshControl, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import axios from 'axios';
import realm from '../../Helpers/DB/realm';
import Notification from '../../Components/Notification';
import PushNotification from 'react-native-push-notification';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const adUnitId = __DEV__ ? TestIds.BANNER : '988377735671833_998104918032448';

  const getNotifications = useCallback(() => {
    // const realmEvents = realm.objects('Notification');

    axios({
      url: 'http://nigs.laladigitalsystems.com/api/',
      method: 'post',
      headers: { 'content-type': 'application/json' },
      data: {
        query: `
          query {
            notifications{
              _id
              title
              body
              color
              type
              createdAt
            }
          }
        `,
      },
    })
      .then(result => {
        const onlineNotifs = result.data.data.notifications;
        const realmNotifs = realm.objects('Notification');

        var allNotifs = [
          ...onlineNotifs,
          ...realmNotifs
        ];

        setNotifications(allNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      })
      .catch(error => {
        console.log(error);
        const realmNotifs = realm.objects('Notification');

        if(realmNotifs) setNotifications([...realmNotifs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      });
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNotifications();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const showAlert = (title, notifId) =>
    Alert.alert(
      'Cancel Notification?',
      "Are you sure you want to cancel '" + title + "'?",
      [
        {
          text: 'No',
          // onPress: () => Alert.alert("Cancel Pressed"),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => deleteNotifications(notifId),
          style: 'default',
        },
      ],
      {
        cancelable: true,
      },
    );

  const deleteNotifications = (notifId) => {
    PushNotification.cancelLocalNotification(notifId);
    realm.write(() => {
      realm.delete(realm.objectForPrimaryKey('Notification', notifId));
    });
    getNotifications();
  };

  const deleteNotification = (title, notifId) => {
    showAlert(title, notifId);
  };

  return (
    <View style={{ flex: 1, paddingVertical: 15 }}>
      <View style={{ marginVertical: 5 }}>
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
      <FlatList
        style={{ marginHorizontal: 15 }}
        data={notifications}
        keyExtractor={({ _id }) => _id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => {
          return <Notification key={item._id} notification={item} deleteNotification={deleteNotification} />;
        }}
      />
      {notifications.length <= 0 && (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>No Notifications!</Text>
          <Text>You can create some!</Text>
        </View>
      )}
    </View>
  );
}
