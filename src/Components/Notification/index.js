import React, { useContext } from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar, IconButton, Text} from 'react-native-paper';
import AppContext from '../../Helpers/Context';

export default function Notification({notification, deleteNotification}) {
  const { color } = useContext(AppContext);
  return (
    <View style={styles.box}>
      <View>
        <Avatar.Icon
          style={{
            backgroundColor: notification.type == 'local' ? color.primary : color.accent,
          }}
          icon="bell"
          size={30}
          color="#fff"
        />
      </View>
      <View style={styles.content}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.contentMain}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.body}>{notification.body}</Text>
          </View>
          {notification.type == 'local' && (
            <View style={{flexDirection: 'column'}}>
              <View
                style={{flex: 1}}>
                <IconButton
                  icon="delete"
                  color="red"
                  onPress={() =>
                    deleteNotification(notification.title, notification._id)
                  }
                />
              </View>
            </View>
          )}
        </View>

        <Text style={styles.createdAt}>
          {new Date(notification.createdAt).toLocaleString()} .{' '}
          {notification.type == 'local' ? 'User' : 'Online'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 5,
    marginTop: 5,
    flexDirection: 'row',
  },
  icon: {
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  contentMain: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 5,
    borderRadius: 10,
  },
  body: {
    fontSize: 14,
  },
  createdAt: {
    fontSize: 11,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    color: '#000',
  },
});
