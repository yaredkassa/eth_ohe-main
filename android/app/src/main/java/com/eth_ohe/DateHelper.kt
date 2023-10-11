package com.eth_ohe

import java.util.*
import kotlin.math.floor

class DateHelper {
    private fun getJDNFromGregorian(date: Array<Int>): Double {
        val year = date[0]
        val month = date[1]
        val day = date[2]
        val a = floor(((14 - month) / 12).toDouble())
        val y = floor(year + 4800 - a)
        val m = month + 12 * a - 3
        val JDN =
            day +
                    floor((153 * m + 2) / 5) +
                    365 * y +
                    floor(y / 4) -
                    floor(y / 100) +
                    floor(y / 400) -
                    32045
        return JDN
    }

    fun getEthiopicFromJDN(jdn: Double): Array<Int> {
        val ethiopicOffset = 1723856
        val r = (jdn - ethiopicOffset) % 1461
        val n = (r % 365) + 365 * Math.floor(r / 1460)
        val year =
            (4 * floor((jdn - ethiopicOffset) / 1461) +
                    floor(r / 365) -
                    floor(r / 1460)).toInt()
        val month = (floor(n / 30) + 1).toInt()
        val day = ((n % 30) + 1).toInt()
        return arrayOf(year, month, day)
    }

    fun toEt(date: Date): Array<Int> {
        val cal = Calendar.getInstance()
        cal.time = date
        val jdn = getJDNFromGregorian(
            arrayOf(
                cal.get(Calendar.YEAR),
                cal.get(Calendar.MONTH) + 1,
                cal.get(Calendar.DATE)
            )
        )
        val etdate = getEthiopicFromJDN(jdn)

//        var isLeapYear = fun(year: Int): Boolean {
//            return ((year + 1) % 4 == 0 && (year + 1) % 100 != 0) || (year + 1) % 400 == 0
//        }

        return arrayOf(etdate[0], etdate[1], etdate[2])
    }


    fun getWeekDate(): String {
        val weekday = arrayOf("እሁድ", "ሰኞ", "ማክሰኞ", "ረቡእ", "ሃሙስ", "አርብ", "ቅዳሜ")
        val cal = Calendar.getInstance()
        return weekday[cal.get(Calendar.DAY_OF_WEEK) - 1]
    }

    fun getDay(): Int {
        val et = toEt(Date())
        return et[2]
    }

    fun getMonthNum(): Int {
        val et = toEt(Date())
        return et[1]
    }

    fun getMonth(): String {
        val et = toEt(Date())

        val months = arrayOf(
            "መስክረም",
            "ጥቅምት",
            "ህዳር",
            "ታህሳስ",
            "ጥር",
            "የካቲት",
            "መጋቢት",
            "ሚያዝያ",
            "ግንቦት",
            "ሰኔ",
            "ሐምሌ",
            "ነሃሴ",
            "ጷግሜ"
        )

        return months[et[1] - 1] + " ፡ " + et[2].toString()
    }
}