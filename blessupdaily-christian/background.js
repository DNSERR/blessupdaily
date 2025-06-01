// background.js – Bless Up Daily: daily alarm and notification

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('dailyVerseAlarm', {
      delayInMinutes: 1,
      periodInMinutes: 1440 // Every 24 hours
    });
  });
  
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dailyVerseAlarm') {
      chrome.storage.local.set({ 'blessup_triggered': Date.now() });
  
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/bible_icon.png',
        title: 'Bless Up Daily',
        message: 'Your verse of the day is ready.',
        priority: 1
      });
    }
  });
  
  