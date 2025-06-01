// Bless Up Daily – Background Service Worker (Manifest V3)
const DAILY_ALARM_NAME = 'blessup_daily_alarm';
const NOTIFICATION_ID = 'blessup_daily_notification';
const NOTIFICATION_TITLE = '📿 Bless Up Daily';

// Initialize on extension install
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(DAILY_ALARM_NAME, {
    when: getNextTriggerTime(),
    periodInMinutes: 1440 // 24 hours
  });
  chrome.storage.local.set({ startTime: Date.now() });
});

// Reset alarm on browser restart
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create(DAILY_ALARM_NAME, {
    when: getNextTriggerTime(),
    periodInMinutes: 1440
  });
});

// Handle daily alarm trigger
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === DAILY_ALARM_NAME) {
    showDailyNotification();
  }
});

// Notification logic
async function showDailyNotification() {
  const { startTime, paid } = await chrome.storage.local.get(['startTime', 'paid']);
  const dayIndex = Math.floor((Date.now() - startTime) / 86400000);
  
  if (dayIndex < 5 || paid) {
    chrome.notifications.create(NOTIFICATION_ID, {
      type: 'basic',
      iconUrl: 'images/quran_icon.png',
      title: NOTIFICATION_TITLE,
      message: 'Open Bless Up Daily for your verse of the day 📖',
      priority: 2
    });
  } else {
    chrome.notifications.create(NOTIFICATION_ID, {
      type: 'basic',
      iconUrl: 'images/quran_icon.png',
      title: NOTIFICATION_TITLE,
      message: 'Subscribe to continue receiving daily verses 🔔',
      priority: 2
    });
  }
}

// Helper function for 9AM trigger time
function getNextTriggerTime() {
  const now = new Date();
  const next = new Date();
  next.setHours(9, 0, 0, 0);
  return now > next ? next.setDate(next.getDate() + 1) : next.getTime();
}
