import Realm from "realm";

class Event extends Realm.Object { }
Event.schema = {
    name: "Event",
    properties: {
        _id: "string",
        eventName: "string?",
        eventDesc: "string",
        startDate: "string?",
        endDate: "string",
        startTime: "string",
        endTime: "string",
        type: "string",
        notifId: "string",
    },
    primaryKey: "_id",
};

class Notification extends Realm.Object { }
Notification.schema = {
    name: "Notification",
    properties: {
        _id: "string?",
        title: "string?",
        body: "string",
        color: "string",
        channelId: "string",
        createdAt: "string",
        type: "string",
    },
    primaryKey: "_id",
};

class HiddenNotification extends Realm.Object { }
HiddenNotification.schema = {
    name: "HiddenNotification",
    properties: {
        _id: "string?",
        title: "string?",
        body: "string",
        color: "string",
        channelId: "string",
        createdAt: "string",
        type: "string",
    },
    primaryKey: "_id",
};

export default new Realm({ schema: [Event, Notification, HiddenNotification] });