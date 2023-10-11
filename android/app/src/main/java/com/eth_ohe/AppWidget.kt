package com.eth_ohe

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.util.Log
import android.widget.RemoteViews
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.IOException
import java.util.*

class AppWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // There may be multiple widgets active, so update all of them
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // Enter relevant functionality for when the first widget is created
        val views = RemoteViews(context.packageName, R.layout.app_widget)
        views.setTextViewText(R.id.day_textview, DateHelper().getWeekDate())
        views.setTextViewText(R.id.md_textview, DateHelper().getMonth())
        views.setTextViewText(R.id.year_textview, DateHelper().toEt(Date())[0].toString())

        views.setTextViewText(R.id.event1_textview, events(context)[0])
        views.setTextViewText(R.id.event2_textview, events(context)[1])
        views.setTextViewText(R.id.event3_textview, events(context)[2])
        views.setTextViewText(R.id.event4_textview, events(context)[3])
    }

    override fun onDisabled(context: Context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

internal fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    // Construct the RemoteViews object
    val views = RemoteViews(context.packageName, R.layout.app_widget)
    views.setTextViewText(R.id.day_textview, DateHelper().getWeekDate())
    views.setTextViewText(R.id.md_textview, DateHelper().getMonth())
    views.setTextViewText(R.id.year_textview, DateHelper().toEt(Date())[0].toString())

    views.setTextViewText(R.id.event1_textview, events(context)[0])
    views.setTextViewText(R.id.event2_textview, events(context)[1])
    views.setTextViewText(R.id.event3_textview, events(context)[2])
    views.setTextViewText(R.id.event4_textview, events(context)[3])

    appWidgetManager.updateAppWidget(appWidgetId, views)
}

fun events(context: Context): Array<String?> {
    val events = arrayOfNulls<String>(4)

    val jsonFileString1 = getJsonDataFromAsset(context, "MonthlyEvents.json")
    val jsonFileString2 = getJsonDataFromAsset(context, "YearlyEvents.json")

    val gson = Gson()
    val listEventType = object : TypeToken<List<Event>>() {}.type

    var monthly: List<Event> = gson.fromJson(jsonFileString1, listEventType)
    monthly = monthly.filter { it.startDate == DateHelper().getDay().toString() + "/0/0" }
    var yearly: List<Event> = gson.fromJson(jsonFileString2, listEventType)
    yearly.forEachIndexed { idx, event -> Log.i("Yearly Event", "Item $idx : ${event.eventName}")}
    yearly = yearly.filter { it.startDate == DateHelper().getDay().toString() + "/" + DateHelper().getMonthNum().toString() + "/0" }
    (yearly + monthly).forEachIndexed { idx, event -> if (idx < 4) events[idx] = event.eventName + " " + isYearly(event.yearly ?: "0/0/0", event.type == "yearly")}

    return events
}

fun isYearly(yearlyDate: String, yearly: Boolean): String {
    val date = DateHelper().getDay().toString() + "/" + DateHelper().getMonthNum().toString() + "/0"
    return if (yearly) "*" else if (date == yearlyDate) "(የዓመቱ)" else ""
}

fun getJsonDataFromAsset(context: Context, filename: String): String? {
    val jsonString: String
    try {
        jsonString = context.assets.open(filename).bufferedReader().use { it.readText() }
    } catch (ioException: IOException) {
        ioException.printStackTrace()
        return null
    }
    return jsonString
}

data class Event(
    val _id: String,
    val eventName: String,
    val eventDesc: String,
    val eventImage: String,
    val startDate: String,
    val endDate: String,
    val startTime: String,
    val endTime: String,
    val type: String,
    val yearly: String?
) {}

