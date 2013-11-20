// This is a placeholder file invoked when popup.html is loaded by Chrome
//
// This file lives at: https://github.com/GSA-OCSIT/sam-helper


// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var samHelperExtId = 'edjkgghfdhoigijgofhpdblffonglmda';

function settingChanged() {
    localStorage.helperMode = this.value;
    chrome.runtime.sendMessage(samHelperExtId, this.value);
}

document.addEventListener('DOMContentLoaded', function () {

  
    var helperMode = (localStorage.helperMode) ?
           localStorage.helperMode :  "help";

    alert('retrieved ' + helperMode);
    var dd = document.getElementById('mode');
    alert('dd = ' + dd);
    for (var i = 0; i < dd.options.length; i++) {
        if (dd.options[i].text === helperMode) {
            dd.selectedIndex = i;
            break;
        }
    }

    var select = document.querySelector('select#mode');
    select.addEventListener('change', settingChanged);
  });
