import React, { useContext } from 'react';
import { View, Image, ScrollView, StyleSheet, Button } from 'react-native';
import { Text } from 'react-native-paper';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import AppContext from '../../Helpers/Context';

export default function About() {
  const adUnitId = __DEV__ ? TestIds.BANNER : '988377735671833_998104918032448';
  const { color } = useContext(AppContext);
  return (
    <ScrollView
      style={{ backgroundColor: color.primary }}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}>
        <View>
          <View style={styles.elevatedConstainer}>
            <Image
              source={require('../../../assets/nigs_logo.webp')}
              style={{ width: 200, height: 200, alignSelf: 'center' }}
            />
            <Text style={{ fontSize: 24, marginTop: 15, textAlign: 'center' }}>
              Ethiopia Orthodox በዓላትና ቀን ማውጫ
            </Text>
            <Text style={{ fontSize: 12, textAlign: 'center' }}>Version 1.7</Text>

          </View>
          <View style={{ margin: 10 }} />
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
          <View style={{ margin: 10 }} />
          <ScrollView horizontal style={{ flex: 1 }}>
            <View style={[styles.elevatedConstainer, { width: 320 }]}>
              <Text
                style={{
                  fontSize: 30,
                  textAlign: 'center',
                  color: '#f1c40f',
                  fontWeight: 'bold',
                }}>
                አላማ
              </Text>
              <Text style={{ fontSize: 16, textAlign: 'center' }}>
                ይህ አፕሊኬሽን የተሰራበት አላማ እኔንና በዙሪያዬ የማውቃቸውን እንዲሁም በስራ አጋጣሚ የማገኛቸው የኢትዮጵያ
                ኦርቶዶክስ ተዋሕዶ አማኝ የሆኑ ክርስቲያኖችን አቋም በመገምገም ካለንበት ወደ ቤተክርስቲያን የመሄድ ፍላጎት
                መቀዛቀዝ አንፃር ይሄንን አፕሊኬሽን ለመስራት እንድነሳሳ አድርጎኛል።
              </Text>
              <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10 }}>
                በተጨማሪም የማናውቃቸውን ወይም የማናስተውላቸውን ወርሀዊና አመታዊ በዓላትን በልባችን ወስጥ ለማስረፅ ይህ
                አፕሊኬሽን እጅግ በጣም አስታዋሽ በሆነ መንገድ ለመስራት ችያለው።
              </Text>
            </View>
            <View style={[styles.elevatedConstainer, { width: 320 }]}>
              <Text
                style={{
                  fontSize: 30,
                  marginTop: 15,
                  textAlign: 'center',
                  color: '#f1c40f',
                  fontWeight: 'bold',
                }}>
                ይጠቅማል ብዬ የማስበው
              </Text>
              <Text style={{ fontSize: 16, textAlign: 'center' }}>
                1. አፕሊኬሽኑ ወርሐዊና አመታዊ በአላትዓ በመለየት ወርሐዊውን በዓል በዋዜማው ማታ 1:30 ላይ የማስታወሻ
                መልክት በመላክ እንዲሁም ማልዶ ጠዋት 12:00 ላይ በድጋሚ የማስታወሻ መልክት በመላክ ምዕመናን በጠዋት ወደ
                ቤተክርስቲያን እንዲሄዱ አስታዋሽ በመሆን ያግዛል
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 10,
                  marginLeft: 15,
                }}>
                1.2 አመታዊ በዓል በሚኖርበት ጊዜም አፕሊኬሽኑ ከ3ተኛ ቀን ጀምሮ በዋዜማው እንዲሁም በጠዋት በማስታውስ
                ምዕመናን ዝግጁ እንዲሆኑና ንቁ ኦርቶዶክሳውያንን ለመፍጠር ይረዳል።
              </Text>
            </View>
            <View style={[styles.elevatedConstainer, { width: 320 }]}>
              <Text style={{ fontSize: 16, textAlign: 'center' }}>
                2. ለየቀናቱ አና አመታቱ የሚሆኑ የየበአላቱን ገድላት በአጭሩ በማስታወሻ መልክ እንዲሁም ሙሉውን ደሞ ወደ
                አፕሊኬሽኑ በመግባት አንብቦ የቅዱሳንና የፃድቃን ሠማእታትን ረድዔትና በረከት ለማግኘት ይረዳል
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 10,
                  marginLeft: 15,
                }}>
                2.2 በተጨማሪም ሰአቱን፤ቀኑን፤ወሩን፤ዐመቱን ያማከለ የመፅሐፍ ቅዱስ ጥቅሶችን ለምዕመናን በማድረስ የወንጌል
                ተደራሽነት በመፍጠርና ምዕመናንን አፅናኝ በሆነው ቃሉ ለማፅናት ይረዳል
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 10,
                  marginLeft: 15,
                }}>
                2.3 የቀን መቁጠሪያ ስላለው ምዕመናን ቀኑን ከበዓላት ጋር አዛምደው ለማወቅ እጅግ በጣም አስፈላጊ
                አፕሊኬሽን ነው።
              </Text>
            </View>
          </ScrollView><View style={{ margin: 10 }} />
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
          <View style={{ margin: 10 }} />
          <View style={styles.elevatedConstainer}>
            <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: "bold" }}>
              አስተያየት ለመስጠት:-
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10 }}>
              ስልክ: +251915402326
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>
              ኢሜይል: direwbitua@gmail.com
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>
              Owner:- Zekeyos Yosef
            </Text>
            <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: "bold", marginTop: 25 }}>
              Development Team:
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 5 }}>
              Leul Woldegabriel Tewolde
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>
              leulwoldegabriel@gmail.com
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10 }}>
              Yared Kassa
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>
              yaredoffice@gmail.com
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 10 }}>
              To order your own app call: +251901276367
            </Text>
            <Text
              style={{
                fontSize: 13,
                marginTop: 25,
                marginBottom: 25,
                textAlign: 'center',
                color: color.primary,
              }}>
              {'\u00A9'} Copyright Reserved. 2023 G.C. / 2015 E.C.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  elevatedConstainer: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10
  }
});