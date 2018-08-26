// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function isYoutubeUrl(url) {
  return url.indexOf('https://www.youtube.com/watch?v=') == 0;
}
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    color: '#3aa757'
  }, function () {
    console.log('The color is green.');
  });

  //注册规则，好知道什么时候显示插件可用的按钮
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostEquals: 'www.youtube.com'
          },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          css: ["ytp-play-button"]
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }], function (detail) {
      // console.log("add rules callback detail:", detail);
    });
  });
});


var filters = {
  url: [{
    hostSuffix: "youtube.com",
    pathContains: "watch"
  }]
};

if (chrome.webNavigation && chrome.webNavigation.onDOMContentLoaded &&
  chrome.webNavigation.onReferenceFragmentUpdated) {
  // chrome.webNavigation.onDOMContentLoaded.addListener(onNavigate, filters);
  // chrome.webNavigation.onReferenceFragmentUpdated.addListener(onNavigate, filters);
} else {
  chrome.tabs.onUpdated.addListener(function (_, details) {
    onNavigate(details);
  });
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
  });
}

function onNavigate(detail) {
  if (detail.url && isYoutubeUrl(detail.url)) {
    // console.log('detail', detail);
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.executeScript(
        tabs[0].id, {
          file: 'inject.js'
        });
    });
  }

}

chrome.pageAction.onClicked.addListener(function (tab) {
  console.log('tab', tab);
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id, {
        file: 'inject.js'
      });
  });


});
