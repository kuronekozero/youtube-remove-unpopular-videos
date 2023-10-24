// ==UserScript==
// @name         YouTube Video Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove videos with less than a certain number of views
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var minViews = 10000; // Минимальное количество просмотров

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
                // Заменить K на 000 (тысячи) и M на 000000 (миллионы)
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

    // Запустить функцию run сразу после загрузки страницы
    run();

    setInterval(run, 500);
})();
