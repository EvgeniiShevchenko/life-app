import Vue from 'vue';
import moment from 'moment';
import { get, has } from 'lodash';

Vue.filter('upperFirstLetter', (str) => {
  return str.replace(/^[\wа-я]/u, (match) => match.toUpperCase());
});

Vue.filter('parseDateInFormatDMMMM', (str) => {
  return str.match(/^\d\d? \w+?\b/)[0];
});

Vue.filter('parseDateInFormatHHmm', (str) => {
  return str.match(/\d{2}:\d{2}$/)[0];
});

Vue.filter('parseDateInFormatHH', (str) => {
  return str.match(/\d{2}(?=:\d{2}$)/)[0];
});

Vue.filter('parseDateInFormatmm', (str) => {
  return str.match(/(?<=\d{2}:)\d{2}$/)[0];
});

Vue.filter('parseDateInFormatmmHHDDMMYYYY', (unix) => {
  return moment(unix * 1000).format('mm:HH DD.MM.YYYY');
});

Vue.filter('textBrakeLine', (str) => {
  const pattern = new RegExp('(?<=\\b.{8})(.+?)\\b', 'g');

  return str.replace(pattern, ' -$1');
});

Vue.filter('secondsToFormatMmSs', (number) => {
  const minutes = Math.floor(number / 60);
  const seconds = number % 60;

  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
});

Vue.filter('beforeNowInPastWithUnix', (unixTemplate) => {
  const oldDate = moment(unixTemplate * 1000);

  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s',
      s: 'a few seconds ago',
      ss: '%d seconds ago',
      m: 'a minute ago',
      mm: '%d minutes ago',
      h: 'an hour ago',
      hh: '%d hours ago',
      d: 'yesterday',
      dd: '%d days ago',
      w: 'a week ago',
      ww: '%d weeks ago',
      M: 'a month ago',
      MM: '%d months ago',
      y: 'a year ago',
      yy: '%d years ago',
    },
  });

  return moment(oldDate).fromNow();
});

Vue.filter('get', (obj, path) => get(obj, path));

Vue.filter('has', (obj, path) => has(obj, path));

Vue.filter('escapeHtml', (text) => {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
});

Vue.filter('parseChatSmsOfCommands', (str) => {
  const patternLocation = new RegExp('(?<=#gps:{)(.*?)(?=})', 'g');
  const replaceResult = str.replace(patternLocation, '<a style="cursor: pointer;"  onclick="getLocation({$1})">My location</a>');

  return replaceResult;
});

Vue.filter('inventoryTotalWeight', (list) => {
  const result = list.reduce((prev, cur) => {
    return cur.draggable === true ? prev + cur.weight * cur.amount : prev;
  }, 0);

  return result.toPrecision(3);
});

Vue.filter('defineTotalPurchasePrice', (list) => {
  const result = list.reduce((prev, cur) => {
    return prev + cur.amount * cur.price.purchase;
  }, 0);

  return result;
});

Vue.filter('roundFloatNumber', (number) => {
  const roundResult = Number(
    String(number)
      .replace(/(\d+\.\d\d\d)\d*/g, (s) => {
        return Math.round(parseFloat(s) * 100) / 100;
      })
      .toString()
  );

  return roundResult;
});

Vue.filter('defineAuctionTermMark', (lotParams) => {
  const currentTime = moment().format('X');
  const restTime = (Number(lotParams.date) + lotParams.term * 60 * 60) % Number(currentTime);

  if (restTime > lotParams.term * 60 * 60 && restTime) {
    return 'complete';
  }

  return restTime < lotParams.term * 60 * 60 && restTime >= 3600 ? 'many' : restTime <= 3600 && restTime >= 1800 ? 'middle' : 'little';
});

Vue.filter('defineDifferenceBetweenStartEndDateDDHH', (lotParams) => {
  const currentDate = moment().format('X');
  const lastTimeInMilliseconds = lotParams - currentDate;
  const defineTime = moment().add(lastTimeInMilliseconds, 'seconds');

  return `${defineTime.diff(moment(), 'days')}:${defineTime.diff(moment(), 'hours') % 24}`;
});
