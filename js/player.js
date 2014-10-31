/**
 * Created by yanbo.ai on 2014/9/25.
 * Player scripts
 */
function Player(options) {
    // check jquery APIs
    if (typeof $ === "undefined") {
        console.error("Jquery can't found.")
    }

    // check file APIs support.
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        console.error("The File APIs are not fully supported in this browser.");
    }

    // check stmd
    if (typeof commonmark === "undefined") {
        console.error("Common mark can't found.")
    }

    var markdown = "";
    var pages = [];
    var __index__ = -1;
    var __readOnly__ = false;
    var onplay = options.onplay;
    var onreadend = options.onreadend;
    var writer = new commonmark.HtmlRenderer();
    var reader = new commonmark.DocParser();
    var player = document.querySelector("#player");
    var dropZone = document.querySelector("#drop_zone");
    var playZone = document.querySelector("#play_zone");

    this.play = function (index) {
        __play__(index);
    };

    this.fullScreen = function (selector) {
        var element = document.querySelector(selector);
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    };

    this.setSwipeEvent = function (selector) {
        $(selector).on("swipeleft", handleSwipeLeft).on("swiperight", handleSwipeRight);
    };

    this.setMarkdown = function (md) {
        markdown = md;
        __index__ = -1;
        parseMarkdown(markdown);
        __play__(0);
    };

    this.sync = function (event) {
        markdown = event.data;
        parseMarkdown(markdown);
        __index__ = -1;
        __play__(event.index);
    };

    this.getMarkdown = function () {
        return markdown;
    };

    this.getIndex = function () {
        return __index__;
    };

    this.readOnly = function () {
        __readOnly__ = true;
    };

    this.display = function (message) {
        if ("none" == dropZone.style.display) {
            dropZone.style.display = "block";
        }
        dropZone.querySelector("#drop_zone_header").innerHTML = message.title;
        dropZone.querySelector("#drop_zone_content").innerHTML = message.content;
    };

    var __play__ = function (index) {
        dropZone.style.display = "none";
        if (pages.length == 0 || __index__ === index) {
            return;
        }
        __index__ = index;
        playZone.innerHTML = pages[__index__];
    };

    var swipePlay = function (next) {
        var index = -1;
        if (next) {
            index = __index__ + 1
        } else {
            index = __index__ - 1
        }
        if (index < 0) {
            index = 0;
            return;
        } else if (index > pages.length - 1) {
            index = pages.length == 0 ? 0 : pages.length - 1;
            return;
        }
        __play__(index);
        onplay({"data": index});
    };

    var parseMarkdown = function (markdown) {
        pages = writer.renderBlock(reader.parse(markdown)).split(/<\s*hr\s*\/*\s*>/);
    };

    var handleDragOver = function (event) {
        event.stopPropagation();
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    };

    var handleFileSelect = function (event) {
        event.stopPropagation();
        event.preventDefault();

        var files = event.dataTransfer.files;
        var reader = new FileReader();
        reader.readAsBinaryString(files[0]);

        reader.onloadend = function (event) {
            if (event.target.readyState == FileReader.DONE) {
                markdown = event.target.result;
                parseMarkdown(markdown);
                __play__(0);
                onreadend({"data": markdown});
            }
        };
    };

    var handleKeyUp = function (event) {
        if (__readOnly__) {
            return;
        }
        var keyCode = (typeof event.which === "number") ? event.which : event.keyCode;
        if (27 == keyCode) {
            //esc
        } else if (37 == keyCode) {
            swipePlay(false);
        } else if (39 == keyCode) {
            swipePlay(true);
        }
    };

    var handleSwipeLeft = function () {
        if (!__readOnly__) {
            swipePlay(true);
        }
    };
    var handleSwipeRight = function () {
        if (!__readOnly__) {
            swipePlay(false);
        }
    };

    player.addEventListener('dragover', handleDragOver, false);
    player.addEventListener('drop', handleFileSelect, false);

    window.addEventListener('keyup', handleKeyUp, false);

    console.log("Player init success.");
}
