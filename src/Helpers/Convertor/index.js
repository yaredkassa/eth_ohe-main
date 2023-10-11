function getEthiopicFromJDN(jdn) {
  var ethiopicOffset = 1723856;
  var r = (jdn - ethiopicOffset) % 1461;
  var n = (r % 365) + 365 * Math.floor(r / 1460);
  var year =
    4 * Math.floor((jdn - ethiopicOffset) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  var month = Math.floor(n / 30) + 1;
  var day = (n % 30) + 1;
  return [year, month, day];
}

function getJDNFromGregorian(date) {
  var year = date[0];
  var month = date[1];
  var day = date[2];
  var a = Math.floor((14 - month) / 12);
  var y = Math.floor(year + 4800 - a);
  var m = month + 12 * a - 3;
  var JDN =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  return JDN;
}

function getJDNFromEthiopic(date) {
  var ethiopicOffset = 1723856;
  var year = date[0],
    month = date[1],
    day = date[2];
  var JDN =
    ethiopicOffset +
    365 +
    365 * (year - 1) +
    30 * month +
    (day - 31) +
    Math.floor(year / 4);
  return JDN;
}

function getGregorianFromJDN(jdn) {
  var julDate = jdn;
  var z = Math.floor(julDate);
  var f = julDate - z;
  if (z < 2299161) {
    var A = z;
  } else {
    var omega = Math.floor((z - 1867216.25) / 36524.25);
    var A = z + 1 + omega - Math.floor(omega / 4);
  }
  var B = A + 1524;
  var C = Math.floor((B - 122.1) / 365.25);
  var D = Math.floor(365.25 * C);
  var Epsilon = Math.floor((B - D) / 30.6001);
  var dayGreg = B - D - Math.floor(30.6001 * Epsilon) + f;
  var monthGreg;
  var yearGreg;
  if (Epsilon < 14) {
    monthGreg = Epsilon - 1;
  } else {
    monthGreg = Epsilon - 13;
  }
  if (monthGreg > 2) {
    yearGreg = C - 4716;
  } else {
    yearGreg = C - 4715;
  }

  return [yearGreg, monthGreg, dayGreg];
}

exports.convertToGreg = (yr, m, d) => {
  var jdn = getJDNFromEthiopic([yr, m, d]);
  var date = getGregorianFromJDN(jdn);
  var isLeapYear = function (year) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return true;
    } else return false;
  };

  return {
    parsed: date.parsed,
    date: date,
    isLeapYear: function () {
      return isLeapYear(this.date[0]);
    },
    getDate: function () {
      return parseInt(this.date[2]);
    },
    getMonth: function () {
      return parseInt(this.date[1]);
    },
    getFullYear: function () {
      return parseInt(this.date[0]);
    },
    toString: function () {
      return (
        this.date[0] +
        '-' +
        (this.date[1] / 10 >= 1 ? this.date[1] : '0' + this.date[1]) +
        '-' +
        (this.date[2] / 10 >= 1 ? this.date[2] : '0' + this.date[2])
      );
    },
    getDateInstance: function () {
      return new Date(this.date.toString());
    },
    getMonthDate: function () {
      var tempInstance = this.getDateInstance();
      tempInstance.setMonth(tempInstance.getMonth() + 1);
      tempInstance.setDate(0);
      return tempInstance.getDate();
    },
  };
};

exports.convertToEt = date => {
  var jdn = getJDNFromGregorian([
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ]);
  var date = getEthiopicFromJDN(jdn);
  //calculates leapyear for eth calendar

  var isLeapYear = function (year) {
    year = year + 1;
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return true;
    } else return false;
  };

  return {
    parsed: date.parsed,
    date: date,
    isLeapYear: function () {
      return isLeapYear(this.date[0]);
    },
    getDate: function () {
      return parseInt(this.date[2]);
    },
    getMonth: function () {
      return parseInt(this.date[1]);
    },
    getFullYear: function () {
      return parseInt(this.date[0]);
    },
    toString: function () {
      return (
        this.date[0] +
        '-' +
        (this.date[1] / 10 >= 1 ? this.date[1] : '0' + this.date[1]) +
        '-' +
        (this.date[2] / 10 >= 1 ? this.date[2] : '0' + this.date[2])
      );
    },
    getMonthDate: function () {
      if (this.date[1] == 13) {
        if (this.isLeapYear()) {
          return 6;
        } else {
          return 5;
        }
      } else {
        return 30;
      }
    },
  };
};

const toEt = date => {
  var jdn = getJDNFromGregorian([
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ]);
  var date = getEthiopicFromJDN(jdn);
  //calculates leapyear for eth calendar

  var isLeapYear = function (year) {
    year = year + 1;
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
      return true;
    } else return false;
  };

  return {
    parsed: date.parsed,
    date: date,
    isLeapYear: function () {
      return isLeapYear(this.date[0]);
    },
    getDate: function () {
      return parseInt(this.date[2]);
    },
    getMonth: function () {
      return parseInt(this.date[1]);
    },
    getFullYear: function () {
      return parseInt(this.date[0]);
    },
    toString: function () {
      return (
        this.date[0] +
        '-' +
        (this.date[1] / 10 >= 1 ? this.date[1] : '0' + this.date[1]) +
        '-' +
        (this.date[2] / 10 >= 1 ? this.date[2] : '0' + this.date[2])
      );
    },
    getMonthDate: function () {
      if (this.date[1] == 13) {
        if (this.isLeapYear()) {
          return 6;
        } else {
          return 5;
        }
      } else {
        return 30;
      }
    },
  };
};

exports.today = () => {
  const et = toEt(new Date());
  return {year: et.getFullYear(), month: et.getMonth(), date: et.getDate()};
};
