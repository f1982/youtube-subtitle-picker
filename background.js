// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

var isOff = true; //plugin is off by default

function isYoutubeUrl(url) {
  return url.indexOf('https://www.youtube.com/watch?v=') == 0;
}
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    color: '#3aa757'
  }, function () {
    console.log('The color is green.');
  });

  chrome.storage.sync.set({
    'testkey': 'testvalue'
  }, function () {
    console.log('set testkey is testvalue');
  })

  chrome.storage.sync.get('color', function (value) {
    console.log('set testkey is:', value);
  })

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

//当网页内容加载完毕之后调用
if (chrome.webNavigation && chrome.webNavigation.onDOMContentLoaded &&
  chrome.webNavigation.onReferenceFragmentUpdated) {
  chrome.webNavigation.onDOMContentLoaded.addListener(onNavigate, filters);
  // chrome.webNavigation.onReferenceFragmentUpdated.addListener(onNavigate, filters);
} else {
  // chrome.tabs.onUpdated.addListener(function (_, details) {
  //   onNavigate(details);
  // });
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log('changeInfo', changeInfo);
    console.log('tabId', tabId);
    //code in here will run every time a user goes onto a new tab, so you can insert your scripts into every new tab
    
    updateState(tabId);
  });
}

function onNavigate(detail) {
  if (detail.url && isYoutubeUrl(detail.url)) {
    console.log('detail', detail);
    // chrome.tabs.query({
    //   active: true,
    //   currentWindow: true
    // }, function (tabs) {
    //   chrome.tabs.executeScript(
    //     tabs[0].id, {
    //       file: 'inject.js'
    //     });
    // });
  }
}


function updateState(tabId) {
  if (isOff) {
    //Off state
    chrome.pageAction.setIcon({
      tabId: tabId,
      path: 'images/icon19.png'
    }, function () {
      chrome.storage.sync.set({
        'yspState': 'off'
      }, function () {
        console.log('set yspState is off');
      })
    });
  } else {
    //On state
    chrome.pageAction.setIcon({
      tabId: tabId,
      path: 'images/icon19-on.png'
    }, function () {
      chrome.storage.sync.set({
        'yspState': 'on'
      }, function () {
        console.log('set yspState is on');
      });
    });
  }
}

chrome.pageAction.onClicked.addListener(function (tab) {
  isOff = !isOff;
  console.log('isOff', isOff);

  updateState(tab.id);

  if(isOff == false){

  }else{

  }
});

function refresh(){
  console.log('refresh', refresh);
  // chrome.tabs.query({
  //   active: true,
  //   currentWindow: true
  // }, function (tabs) {
  //   chrome.tabs.executeScript(
  //     tabs[0].id, {
  //       file: 'inject.js'
  //     });
  // });
}