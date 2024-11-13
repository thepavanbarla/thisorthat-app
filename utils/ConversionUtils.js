import {textPostColors} from '../services/Constants';

const getSimpleTimeFromDateObject = date => {
  var now = new Date();

  var todayStart = new Date();
  todayStart.setHours(0);
  todayStart.setMinutes(0);
  todayStart.setSeconds(0);

  var yesterdayStart = new Date(todayStart.getTime() - 86400000);

  if (
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()
  ) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  } else if (
    date.getTime() < todayStart.getTime() &&
    date.getTime() >= yesterdayStart.getTime()
  ) {
    return 'Yesterday';
  } else {
    let monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];
    return `${day} ${monthName}`;
  }
};

const getOnlyTimeFromDateObject = date => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + 'y';
  }
  interval = seconds / 2592000;
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + 'd';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + 'h';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + 'm';
  }
  var sec = Math.floor(seconds);
  if (sec > 9) {
    return sec + 's';
  } else {
    return 'Just now';
  }
}

function timeSinceExtended(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 86400;

  if (interval > 7) {
    return dateToDMY(date);
  }
  if (interval > 1) {
    return Math.floor(interval) + 'd ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + 'h ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + 'm ago';
  }
  var sec = Math.floor(seconds);
  if (sec > 9) {
    return sec + 's ago';
  } else {
    return 'Just now';
  }
}

function dateToDMY(date) {
  var strArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var d = date.getDate();
  var m = strArray[date.getMonth()];
  var y = date.getFullYear();
  var today = new Date();
  if (y === today.getFullYear()) {
    return '' + d + ' ' + m;
  }
  return '' + d + ' ' + m + ' ' + y;
}

function getTiny(picture) {
  if (picture === null || picture === undefined) {
    return null;
  }
  return picture.replace('pictures/', 'pictures/tiny/');
}

function getSmall(picture) {
  if (picture === null || picture === undefined) {
    return null;
  }
  return picture.replace('pictures/', 'pictures/small/');
}

function getMedium(picture) {
  if (picture === null || picture === undefined) {
    return null;
  }
  return picture.replace('pictures/', 'pictures/medium/');
}

function extractTags(context) {
  return context.match(/#[a-z0-9_]+/g);
}

function categorizeTagCount(count) {
  if (count < 100) {
    return 'Under 100 posts';
  } else if (count < 500) {
    return '100+ posts';
  } else if (count < 1000) {
    return '500+ posts';
  } else if (count < 2000) {
    return '1K+ posts';
  } else if (count < 5000) {
    return '2K+ posts';
  } else if (count < 10000) {
    return '5K+ posts';
  } else if (count < 20000) {
    return '10K+ posts';
  } else if (count < 50000) {
    return '20K+ posts';
  } else if (count < 100000) {
    return '50K+ posts';
  } else {
    return '100K+ posts';
  }
}

const isValidUserName = userName => {
  const result = /^[a-z0-9._]{4,20}$/.test(userName);
  return result;
};

const getTwoRandomColors = postId => {
  const shuffled = textPostColors.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
};

export {
  getSimpleTimeFromDateObject,
  getOnlyTimeFromDateObject,
  timeSince,
  timeSinceExtended,
  getTiny,
  getSmall,
  getMedium,
  extractTags,
  categorizeTagCount,
  isValidUserName,
  getTwoRandomColors,
};
