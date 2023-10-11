import React, { useState, useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import AppContext from '../../Helpers/Context';

export default function Settings(props) {
  const adUnitId = __DEV__ ? TestIds.BANNER : '988377735671833_998104918032448';
  const { color, changeColor } = useContext(AppContext);

  const colors = [
    { primary: "#09011c", accent: "#f1400f" },
    { primary: "#004209", accent: "#c45800" },
    { primary: "#244c6b", accent: "#8f102d" },
    { primary: "#2f0036", accent: "#f10f0f" },
  ]

  const [selectedColor, setSelectedColor] = useState(color.primary);

  const ColorBall = ({ primary, accent, selected = false, onPress }) => (
    <TouchableOpacity
      style={{
        width: 45,
        height: 45,
        marginHorizontal: 10,
        flexDirection: "row",
        borderColor: "#000",
        padding: 3,
        borderWidth: selected ? 2 : 0,
        borderRadius: 30
      }}
      onPress={onPress}
    >
      <View
        style={{
          backgroundColor: primary,
          borderBottomStartRadius: 20,
          borderTopStartRadius: 20,
          flex: 1
        }}
      />
      <View
        style={{
          backgroundColor: accent,
          borderBottomEndRadius: 20,
          borderTopEndRadius: 20,
          flex: 1
        }}
      />
    </TouchableOpacity>
  )

  const changeAppColor = (primary, accent) => {
    setSelectedColor(primary);
    changeColor(primary, accent);
  }

  return (
    <View style={{ margin: 10 }}>
      <View
        style={{
          marginHorizontal: 10,
          marginVertical: 20
        }}
      >
        <View
        style={{
          padding: 15,
          backgroundColor: color.primary,
          borderRadius: 10
        }}
      >
        <Text style={{ textAlign: "center", color: "#fff", fontSize: 18 }}>App Colors</Text>
      </View>
        
        <View
          style={{
            marginTop: 15,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center"
          }}>
          {
            colors.map((ccolor, index) => (
              <ColorBall key={index} primary={ccolor.primary} accent={ccolor.accent} selected={selectedColor == ccolor.primary} onPress={() => changeAppColor(ccolor.primary, ccolor.accent)} />  
            ))
          }
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: "grey", margin: 10 }} />
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
      <TouchableOpacity
        style={{
          margin: 10,
          padding: 15,
          backgroundColor: color.primary,
          borderRadius: 10
        }}
        onPress={() => props.navigation.navigate('About')}
      >
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Ionicons name="information-circle-outline" size={24} color="white" />
          <Text style={{ color: "#fff", marginLeft: 5, fontSize: 18 }}>About the app</Text>
        </View>
      </TouchableOpacity>
      <View style={{ marginTop: 10 }} >
        <Text style={{ textAlign: "center", fontSize: 13 }}>. Version 8 (V1.7) .</Text>
      </View>
    </View>
  );
};