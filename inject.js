var subtitleContainer; //
var refreshInterval = -1;
//Get subtitles state 
var showSubtitlesButton = document.getElementsByClassName('ytp-subtitles-button ytp-button')[0];
var playButton = document.getElementsByClassName('ytp-play-button ytp-button')[0];

initSubtitleArea();
linkActionWithPage();
updateRefreshStrategy();

function linkActionWithPage() {
    showSubtitlesButton.onclick = function () {
        updateRefreshStrategy();
    }

    playButton.onclick = function () {
        setTimeout(() => {
            updateRefreshStrategy();
        }, 100);
    }
}

function initSubtitleArea() {
    subtitleContainer = document.createElement('div');
    subtitleContainer.style.border = '2px solid #ff0000';
    subtitleContainer.style.padding = '6px';
    subtitleContainer.setAttribute('name', 'ysp_subtitles_container');
    // subtitleContainer.innerText = "This is subtitles container";

    var infoContent = document.getElementById('info-contents');
    //If there is one before
    // console.log("infoContent.childNodes[0].name is: ", infoContent.childNodes[0].getAttribute('name'));
    if (infoContent.childNodes[0].getAttribute('name') == 'ysp_subtitles_container') {
        infoContent.removeChild(infoContent.childNodes[0]);
    }
    infoContent.insertBefore(subtitleContainer, infoContent.childNodes[0]);
}

/**
* Update refresh strategy
* 
*/
function updateRefreshStrategy() {
    var subtitlesState = showSubtitlesButton.getAttribute('aria-pressed');
    var playState = playButton.getAttribute('aria-label');
    //play state mean the state display icon 
    //so if playstate is Pause the actually status is playing
    //if playstate is Playing the actually status is pausing
    console.log("playState is: ", playState);
    console.log("ShowSubtitlesState is: ", subtitlesState);

    clearInterval(refreshInterval);
    if (subtitlesState == 'true' && playState == 'Pause') {
        console.log("set interval...");
        refreshInterval = setInterval("refresh()", 1500);
    }
}

/**
 * Update subtitles copy from youtebe player
 */
function refresh() {
    console.log("refresh now!");

    showOtherSubtitles();
}


function showOtherSubtitles() {
    var subtitleContainer = document.createElement('div');
    // subtitleContainer.style.border = '2px solid #ff0000';
    subtitleContainer.style.padding = '6px';
    subtitleContainer.setAttribute('name', 'ysp_subtitles_container');
    // subtitleContainer.innerText = "This is subtitles container";

    var infoContent = document.getElementById('info-contents');

    //If there is one before
    console.log("infoContent.childNodes[0].name is: ", infoContent.childNodes[0].getAttribute('name'));
    if (infoContent.childNodes[0].getAttribute('name') == 'ysp_subtitles_container') {
        infoContent.removeChild(infoContent.childNodes[0]);
    }
    infoContent.insertBefore(subtitleContainer, infoContent.childNodes[0]);

    //Get subtitles string
    var str = document.getElementsByClassName("captions-text")[0].firstChild.innerHTML;
    str = str.replace(/<[^>]+>/g, "");
    str = str.replace(/&nbsp;/g, " ");

    //Filter and validate string
    var sentence = String(str);
    sentence = sentence.trim();
    var originWords = sentence.split(" ");
    var words = [];
    originWords.forEach(word => {
        if (word != "") {
            words.push(word);
        }
    });

    //Draw words into div
    words.forEach(word => {
        var input = document.createElement('input');
        input.setAttribute('value', word);
        input.setAttribute('readonly', 'true');
        input.style['font-size'] = '22px';
        input.style['text-align'] = 'center';
        input.style.margin = '2px';
        input.style.width = 13 * word.length + 'px';
        input.onclick = function (evt) {
            input.select();
            document.execCommand("Copy");
            // hint.innerHTML = '<b>' + input.value + '</b> is copied';
            // delayToClearHint();
        }
        subtitleContainer.appendChild(input);
    });
}