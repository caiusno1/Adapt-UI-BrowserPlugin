// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get('adaptations', function(data) {
    if(!data.adaptations){
      chrome.storage.sync.set({adaptations: adaptationRules}, function() {
        console.log('Adaptations set');
        console.log(adaptationRules);
      });
    }
  });
  chrome.storage.sync.set({contextOfUse: contextOfUse}, function() {
    console.log('ContextSet set');
  });
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
      pageUrl: {},
    })],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){  
  if(!tab.url.includes("http")){
    return;
  }
});
  
