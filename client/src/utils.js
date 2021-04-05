function timeDifference(current, previous) {
  const milliSecondsPerMinute = 60 * 1000;
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  const milliSecondsPerYear = milliSecondsPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < milliSecondsPerMinute / 3) {
    return 'Rétt í þessu';
  }

  if (elapsed < milliSecondsPerMinute) {
    return 'Fyrir minna en mínútu síðan';
  } else if (elapsed < milliSecondsPerHour) {
    return (
      'Fyrir ' +
      Math.round(elapsed / milliSecondsPerMinute) +
      ((Math.round(elapsed / milliSecondsPerMinute) > 1) ? ' mínútum síðan' : ' mínútu síðan')
    );
  } else if (elapsed < milliSecondsPerDay) {
    return (
      'Fyrir ' + Math.round(elapsed / milliSecondsPerHour) + ' klst. síðan'
    );
  } else if (elapsed < milliSecondsPerMonth) {
    return (
      'Fyrir ' +
      Math.round(elapsed / milliSecondsPerDay) +
      ((Math.round(elapsed / milliSecondsPerDay) > 1) ? ' dögum síðan' : ' degi síðan')
    );
  } else if (elapsed < milliSecondsPerYear) {
    return (
      'Fyrir ' + Math.round(elapsed / milliSecondsPerMonth) +
      ((Math.round(elapsed / milliSecondsPerMonth) > 1) ? ' mánuðum síðan' : ' mánuði síðan')
    );
  } else {
    return (
      'Fyrir ' + Math.round(elapsed / milliSecondsPerYear) +
      ((Math.round(elapsed / milliSecondsPerYear) > 1) ? ' árum síðan' : ' ári síðan')
    );
  }
}

export function timeDifferenceForDate(date) {
  const dateAsInt = parseInt(date, 10);
  const now = new Date().getTime();
  const updated = new Date(dateAsInt).getTime();
  return timeDifference(now, updated);
}