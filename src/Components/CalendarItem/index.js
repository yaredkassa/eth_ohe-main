import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { convertToGreg, today } from '../../Helpers/Convertor';
import { months, numberOfDays, weekDays } from '../../Helpers/Others';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import AppContext from '../../Helpers/Context';

export default function Calender({ activeDate, setActiveDate }) {

  const adUnitId = __DEV__ ? TestIds.BANNER : '988377735671833_998104918032448';
  const { color } = useContext(AppContext);

  const generateMatrix = () => {
    var matrix = [];

    matrix[0] = weekDays;

    var year = activeDate.year;
    var month = activeDate.month;

    var g = convertToGreg(year, month, 1);
    var firstDay = new Date(
      g.getFullYear(),
      g.getMonth() - 1,
      g.getDate(),
    ).getDay();

    var maxDays = numberOfDays[month - 1];

    if (month == 13) {
      // ጷግሜ
      if (
        ((year + 1) % 4 == 0 && (year + 1) % 100 != 0) ||
        (year + 1) % 400 == 0
      ) {
        maxDays += 1;
      }
    }

    var counter = 1;
    for (var row = 1; row < 7; row++) {
      matrix[row] = [];
      for (var col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row == 1 && col >= firstDay && counter <= maxDays) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = counter++;
        }
      }
    }

    return matrix;
  };

  var matrix = generateMatrix();

  var rows = [];
  rows = matrix.map((row, rowIndex) => {
    var rowItems = row.map((item, colIndex) => {
      return (
        <View key={item + '_' + rowIndex + '_' + colIndex}
          style={{
            flex: 1,
            // backgroundColor: rowIndex == 0 ? '#ddd' : '#fff'
          }}
        >
          {
            rowIndex == 0 ? (
              <Text
                style={{
                  // flex: 1,
                  height: 15,
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: "bold",
                  color:
                    colIndex == 0
                      ? '#ed1818'
                      : '#fff',
                }}>
                {item != -1 ? item : ''}
              </Text>
              //09011c
            ) : (
              <TouchableOpacity
                key={item + '_' + rowIndex + '_' + colIndex}
                style={{
                  // flex: 1,
                  // height: 26,
                  elevation: item == activeDate.day ? 3 : 0,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.26,
                  shadowRadius: 10,
                  backgroundColor: item == activeDate.day ? "#fff" : color.primary,
                  borderRadius: 10,
                  // borderColor: "#000",
                  // borderWidth: item == activeDate.day ? 1 : 0,
                  margin: 2,
                  padding: 1,
                }}
                onPress={() => onPress(item)}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    // textDecorationLine: item == activeDate.day ? 'underline' : 'none',
                    // Highlight header
                    // backgroundColor: '#ddd',
                    // Highlight Sundays
                    color:
                      colIndex == 0
                        ? '#ed1818'
                        : item == activeDate.day ? "#000" : "#fff",
                    // Highlight current date
                    fontWeight: item == activeDate.day ? 'bold' : 'normal',
                  }}>
                  {item != -1 ? item : ''}
                </Text>
              </TouchableOpacity>
            )
          }
        </View>
      );
    });
    return (
      <View
        key={'row_' + rowIndex}
        style={{
          flexDirection: 'row',
          padding: 5,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        {rowItems}
      </View>
    );
  });

  const onPress = item => {
    if (!item.match && item != -1) {
      setActiveDate({
        ...activeDate,
        day: item,
      });

      return activeDate;
    }
  };

  const changeMonth = n => {
    if (activeDate.month == 1 && n === -1) {
      setActiveDate({
        day: 1,
        month: 13,
        year: activeDate.year - 1,
      });
    } else if (activeDate.month == 13 && n === 1) {
      setActiveDate({
        day: 1,
        month: 1,
        year: activeDate.year + 1,
      });
    } else {
      setActiveDate({
        ...activeDate,
        day: 1,
        month: activeDate.month + n,
      });
    }

    return activeDate;
  };

  const getDate = () => {
    const gr = convertToGreg(activeDate.year, activeDate.month, activeDate.day);
    return new Date(
      gr.getFullYear(),
      gr.getMonth() - 1,
      gr.getDate(),
    ).toDateString();
  };

  return (
    <View style={[styles.elevatedConstainer, {backgroundColor: color.primary}]}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 18,
          color: '#fff',
          textAlign: 'center',
          marginBottom: 6,
        }}>
        {months[activeDate.month - 1]} &nbsp;
        {activeDate.year}
      </Text>
      {rows}

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
      <Text style={{ alignSelf: 'center', margin: 5 }}>{getDate()}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => changeMonth(-1)}
            style={{
              backgroundColor: color.primary,
              padding: 10,
              flexDirection: 'row',
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.26,
              shadowRadius: 10,
              borderRadius: 18,
            }}>
            <Ionicons name="chevron-back-sharp" size={24} color="white" />
            <Text style={{ color: '#fff', fontSize: 18 }}>
              {activeDate.month - 2 < 0
                ? months[12]
                : months[activeDate.month - 2]}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setActiveDate({
                year: today().year,
                month: today().month,
                day: today().date,
              })
            }
            style={{
              backgroundColor: '#fff',
              padding: 12,
              flexDirection: 'row',
              marginEnd: 15,
              marginStart: 15,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.26,
              shadowRadius: 10,
              borderRadius: 18,
            }}>
            <Ionicons name="today-outline" size={20} color={color.primary} />
            <Text style={{ color: color.primary, fontSize: 16 }}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => changeMonth(+1)}
            style={{
              backgroundColor: color.primary,
              padding: 10,
              flexDirection: 'row',
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.26,
              shadowRadius: 10,
              borderRadius: 18,
            }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>
              {activeDate.month > 12 ? months[0] : months[activeDate.month]}
            </Text>
            <Ionicons name="chevron-forward-sharp" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  elevatedConstainer: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 10,
    // marginTop: 15,
    // marginHorizontal: 15
  }
});