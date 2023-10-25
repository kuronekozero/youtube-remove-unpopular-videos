// ==UserScript==
// @name         YouTube remove unpopular videos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove videos with less than a certain number of views
// @author       Timothy
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
            var viewCountMatch = video.textContent.match(/(\d+([.,]\d+)?([KkМмMm]|тыс\.|Mio\.| Mrd\.)?) (просмотров|views|Aufrufe|visualizaciones)/);
            if (viewCountMatch) {
                var viewCountText = viewCountMatch[1].replace(',', '.').replace('тыс.', 'e3').replace('K', 'e3').replace('k', 'e3').replace('M', 'e6').replace('m', 'e6').replace('М', 'e6').replace('м', 'e6').replace('Mio.', 'e6').replace(' Mrd.', 'e9');
                // Для немецкого языка, заменить точку на пустую строку перед преобразованием в число
                if (viewCountText.includes('.') && video.textContent.includes('Aufrufe')) {
                    viewCountText = viewCountText.replace('.', '');
                }
                var viewCount = parseFloat(viewCountText);
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

    // Запустить функцию run каждые 5 секунд, чтобы обрабатывать новые видео
    setInterval(run, 500);
})();
