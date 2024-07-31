// ==UserScript==
// @name         YouTube: Remove unpopular videos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove videos with less than a certain number of views
// @icon         https://raw.githubusercontent.com/kuronekozero/youtube-remove-unpopular-videos/master/icon.png
// @author       Timothy (kuronek0zero)
// @namespace    https://github.com/kuronekozero/youtube-remove-unpopular-videos/tree/master
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478273/YouTube%3A%20Remove%20unpopular%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/478273/YouTube%3A%20Remove%20unpopular%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var minViews = 1000; // Minimum number of views

    var getVideoRows = function() {
        return document.querySelectorAll('ytd-rich-item-renderer');
    };

    var processVideoRow = function(video) {
        var viewCountElement = video.querySelector('span.inline-metadata-item');
        if (viewCountElement) {
            var viewCountText = viewCountElement.textContent.trim();
            if (viewCountText === "No views") {
                video.remove();
            } else {
                var viewCountMatch = viewCountText.match(/(\d+(\.\d+)?(K|M)?) views/);
                if (viewCountMatch) {
                    var viewCount = parseFloat(viewCountMatch[1].replace('K', 'e3').replace('M', 'e6'));
                    if (viewCount < minViews) {
                        video.remove();
                    }
                }
            }
        }
    };

    var run = function() {
        var videoRows = getVideoRows();
        videoRows.forEach(processVideoRow);
    };

    setTimeout(run, 500);
    setInterval(run, 500);
})();


