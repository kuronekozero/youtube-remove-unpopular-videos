// ==UserScript==
// @name         YouTube: Remove unpopular videos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove videos with less than a certain number of views
// @author       Timothy (kuronek0zero)
// @namespace    https://github.com/zerodytrash/Simple-YouTube-Age-Restriction-Bypass/
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // If you think that 1000 views is too much or too little
    // you can just change minViews on any other number you like

    var minViews = 1000; // Minimum number of views

    var getVideoRows = function() {
        var contents = document.querySelector(
            'div#contents[class="style-scope ytd-rich-grid-renderer"]'
        );
        return contents.childNodes;
    }

    var processVideoRow = function(row) {
        var videos = row.querySelectorAll('ytd-rich-item-renderer');
        for (var i=0; i<videos.length; i++){
            var video = videos[i];
            var viewCountMatch = video.textContent.match(/(\d+(\.\d+)?(K|M)?) views/);
            if (viewCountMatch) {
                var viewCountText = viewCountMatch[1];
                var viewCount = parseFloat(viewCountText.replace('K', 'e3').replace('M', 'e6'));
                if (viewCount < minViews) {
                    video.remove();
                }
            }
        }
    }

    var run = function() {
        var videoRows = getVideoRows();
        for (var i=0; i<videoRows.length; i++){
            processVideoRow(videoRows[i]);
        }
    }

    // without this line of code script may not work in firefox.
    setTimeout(run, 500);

    setInterval(run, 500);
})();
