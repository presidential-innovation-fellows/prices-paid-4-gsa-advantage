// This is a placeholder file invoked when popup.html is loaded by Chrome
//
// This file lives at: https://github.com/GSA-OCSIT/sam-helper


// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function settingChanged() {
    chrome.storage.local.set( { helperMode: this.value } );
}

document.addEventListener('DOMContentLoaded', function () {

  chrome.storage.local.get( 'helperMode', function ( items ) {
    if (items.helperMode) {
        var dd = document.getElementById('mode');
        for (var i = 0; i < dd.options.length; i++) {
            if (dd.options[i].text === items.helperMode) {
                dd.selectedIndex = i;
                break;
            }
        }
    }
  });

  var selects = document.querySelectorAll('select');
  for (var i = 0; i < selects.length; i++) {
    selects[i].addEventListener('change', settingChanged);
  }
});

