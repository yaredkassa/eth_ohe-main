import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

import AppContext from './src/Helpers/Context';

import Main from './src/Views';

const App = () => {

  const [color, setColor] = useState({
    primary: '#09011c',
    accent: '#f1400f'
  });

  const changeColor = (primary, accent) => {
    const primaryData = ["primary", primary];
    const accentData = ["accent", accent];
    AsyncStorage.multiSet([primaryData, accentData]).then(() => {
      setColor({
        primary: primary,
        accent: accent
      });

      // console.log("Color changed to Primary: " + color.primary + " Accent: " + color.accent);
      RNRestart.Restart();
    }
    );
  }

  const value = useMemo(
    () => ({ color, changeColor }),
    [color]
  );

  const getColorData = useCallback(() => {
    AsyncStorage.multiGet(['primary', 'accent']).then(value => {
      if (value !== null) {
        if (value[0][1] !== null && value[1][1] !== null) {
          setColor({
            primary: value[0][1],
            accent: value[1][1],
          })
        }
      }
    });
  }, []);

  let theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: color.primary,
      accent: color.accent,
      text: '#808080',
      // background: "rgb(255, 251, 255)",
      // onBackground: "rgb(29, 27, 30)",
      // surface: "rgb(255, 251, 255)",
      onSurface: "#808080",
      // surfaceVariant: "rgb(232, 224, 235)",
      // onSurfaceVariant: "rgb(73, 69, 78)",
      // outline: "rgb(122, 117, 127)",
      // outlineVariant: "rgb(203, 196, 207)",
      // shadow: "rgb(0, 0, 0)",
      // scrim: "rgb(0, 0, 0)",
      // inverseSurface: "rgb(50, 48, 51)",
      // inverseOnSurface: "rgb(245, 239, 244)",
      // inversePrimary: "rgb(212, 187, 255)",
    },
  };

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
      playSound: true,
      soundName: 'my_sound.mp3',
    });
  };

  const subscribeToTopic = useCallback(async () => {
    try {
      await messaging().subscribeToTopic('all');
    } catch (err) {
      //Do nothing
      console.log(err.response.data);
      return;
    }
  }, []);

  useEffect(() => {
    subscribeToTopic();
    createChannels();
    getColorData();
    theme = {
      ...DefaultTheme,
      dark: false,
      roundness: 2,
      colors: {
        ...DefaultTheme.colors,
        primary: color.primary,
        accent: color.accent,
        text: '#808080',
      },
    };
  }, [getColorData]);

  return (
    <PaperProvider theme={theme}>
      <AppContext.Provider value={value}>
        <StatusBar translucent backgroundColor="transparent" />
        <Main />
      </AppContext.Provider>
    </PaperProvider>
  );
};

export default App;
