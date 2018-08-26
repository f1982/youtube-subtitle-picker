// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function textSize(fontSize, text) {
  var span = document.createElement("span");
  var result = {};
  result.width = span.offsetWidth;
  result.height = span.offsetWidth; 
  span.style.visibility = "hidden";
  document.body.appendChild(span);
  if (typeof span.textContent != "undefined")
      span.textContent = text;
  else span.innerText = text;
  result.width = span.offsetWidth - result.width;
  result.height = span.offsetHeight - result.height;
  span.parentNode.removeChild(span);
  return result;
}

// var size = textSize("9px", "test you aredffffffff");
// alert("width: " + size.width + " height:" + size.height);

chrome.storage.sync.get('color', function (data) {
  changeColor.style.backgroundColor = data.color;
  // changeColor.setAttribute('value', data.color);
});



// changeColor.onclick = function (element) {
//   let color = element.target.value;
//   alert(color);
// };

let inputTest = document.getElementById('subtitle-test');
let hint = document.getElementById('hint');
let wordsContainer = document.getElementById('subtitle-container');

chrome.tabs.query({
  active: true,
  currentWindow: true
}, function (tabs) {
  chrome.tabs.executeScript(
    tabs[0].id, {
      file:'inject.js'
      // code: 'var str = document.getElementsByClassName("captions-text")[0].firstChild.innerHTML; \
      //   str = str.replace(/<[^>]+>/g,"");\
      //   str = str.replace(/&nbsp;/g, " ");'
    });
});

var hintTimeout = -1;

function delayToClearHint() {
  clearTimeout(hintTimeout);
  hintTimeout = setTimeout(() => {
    hint.innerHTML = '';
  }, 1500);
}