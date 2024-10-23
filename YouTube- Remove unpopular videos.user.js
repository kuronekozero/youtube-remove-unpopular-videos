// ==UserScript==
// @name         YouTube: Remove unpopular videos
// @namespace    http://tampermonkey.net/
// @version      0.3
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

    const minViews = 500; // Minimum number of views

    const getVideoRows = function() {
        return document.querySelectorAll('ytd-rich-item-renderer');
    };

    const processVideoRow = function(video) {
        // Updated selector for view count element
        const viewCountElement = video.querySelector('span.inline-metadata-item.style-scope.ytd-video-meta-block');

        if (viewCountElement) {
            const viewCountText = viewCountElement.textContent.trim();

            if (viewCountText.includes("No views")) {
                video.remove();
            } else {
                // Updated regex to match the view count number, considering 'K', 'M', or no suffix
                const viewCountMatch = viewCountText.match(/([\d,.]+)(K|M)? views/);

                if (viewCountMatch) {
                    let viewCount = parseFloat(viewCountMatch[1].replace(/,/g, '')); // Remove commas

                    if (viewCountMatch[2] === 'K') {
                        viewCount *= 1000; // Convert 'K' to thousands
                    } else if (viewCountMatch[2] === 'M') {
                        viewCount *= 1000000; // Convert 'M' to millions
                    }

                    if (viewCount < minViews) {
                        video.remove();
                    }
                }
            }
        }
    };

    const run = function() {
        const videoRows = getVideoRows();
        videoRows.forEach(processVideoRow);
    };

    setTimeout(run, 500);
    setInterval(run, 500);
})();
