import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

import { months } from '../../Helpers/Others';

import MonthlyEvents from '../../../MonthlyEvents.json';
import YearlyEvents from '../../../YearlyEvents.json';
import { TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import AppContext from '../../Helpers/Context';

export default function Events(props) {
    const [activeTab, setActiveTab] = useState(0);
    const [monthlyEvents, setMonthlyEvents] = useState([]);
    const [yearlyEvents, setYearlyEvents] = useState([]);
    const adUnitId = __DEV__ ? TestIds.BANNER : '988377735671833_998104918032448';
    const { color } = useContext(AppContext);

    useEffect(() => {
        setMonthlyEvents(MonthlyEvents)
        setYearlyEvents([
            ...YearlyEvents,
            ...MonthlyEvents.filter(function (event) { return event.yearly !== ""; })
        ])
    }, []);

    const Event = ({ event }) => {
        const day = event.startDate.split("/")[0]
        const month = event.type === "monthly" ? event.yearly == "" ? "Monthly" : months[event.yearly.split("/")[1] - 1] : months[event.startDate.split("/")[1] - 1]
        return (
            <View style={styles.eventBox}>
                <View style={{ flexDirection: 'column' }}>
                    <Avatar.Icon
                        style={{
                            flex: 1,
                            alignSelf: 'center',
                            backgroundColor: color.accent,
                        }}
                        icon='bell-circle'
                        size={35}
                        color="#fff"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.eventContent}>
                        <Text style={{ fontSize: 14 }}>{month + ' ፥ ' + day}</Text>
                        <Text style={styles.eventName}>{event.eventName}</Text>
                        {event.eventDesc !== null ||
                            (event.eventDesc !== '' && (
                                <Text style={styles.description}>{event.eventDesc}</Text>
                            ))}
                        <Text style={{ fontSize: 14 }}>
                            {event.startTime === 'allday'
                                ? 'All Day'
                                : event.startTime + ' - ' + event.endTime}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View>
            <View style={{ flexDirection: "row", padding: 25, borderBottomEndRadius: 15, borderBottomStartRadius: 15, backgroundColor: color.primary }}>
                <TouchableOpacity
                    style={[styles.elevatedConstainer, { backgroundColor: activeTab === 0 ? "#fff" : color.primary }]}
                    onPress={() => setActiveTab(0)}>
                    <Text style={{ color: activeTab == 0 ? color.primary : "#fff" }}>Yearly Events</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.elevatedConstainer, { backgroundColor: activeTab === 1 ? "#fff" : color.primary }]}
                    onPress={() => setActiveTab(1)}>
                    <Text style={{ color: activeTab == 1 ? color.primary : "#fff" }}>Monthly Events</Text>
                </TouchableOpacity>
            </View>
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
            {
                activeTab === 0 ? (
                    <ScrollView style={{ paddingHorizontal: 15 }}>
                        {yearlyEvents.map((item, i) => (
                            <Event
                                key={item._id}
                                event={item}
                            />
                        ))}
                    </ScrollView>
                ) : (
                    <ScrollView style={{ paddingHorizontal: 15 }}>
                        <View>
                            {monthlyEvents.map((item, i) => (
                                <Event
                                    key={item._id}
                                    event={item}
                                />
                            ))}
                            <View style={{ margin: 95 }} />
                        </View>
                    </ScrollView>
                )
            }
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
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 5,
        flex: 1,
        alignItems: "center"
    },
    eventBox: {
        padding: 5,
        marginTop: 3,
        flexDirection: 'row',
    },
    eventContent: {
        //   flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10,
    },
    eventName: {
        fontSize: 20,
        color: '#151515',
    },
    description: {
        fontSize: 15,
        color: '#646464',
    },
    userName: {
        fontSize: 16,
        color: '#151515',
    },
});