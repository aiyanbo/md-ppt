/**
 * Created by yanbo.ai on 14-9-25.
 */

function AirPlay(options) {
    var onopen = options.onopen;

    var onlineCode = null;
    var airCode = document.querySelector("#air_code");
    var airStatus = document.querySelector("#air_status");
    var __url__ = null;
    var webSocket = null;

    this.connect = function (url) {
        webSocket = new WebSocket(url);
        webSocket.onopen = function (event) {
            __url__ = url;
            console.log("Open connection to " + url);
        };

        webSocket.onmessage = function (event) {
            controller(JSON.parse(event.data));
        };

        webSocket.onclose = function (event) {
            setOffline();
        };

        webSocket.onerror = function (event) {
            setOffline();
        }
    };

    var controller = function (event) {
        switch (event.type) {
            case "new":
                setOnline(event.data);
                event.url = __url__;
                onopen(event);
                break;
            case "send":
                break;
            case "play":
                break;
            case "markdown":
                break;
            default :
                console.warn("Can not handle event: " + event.type)
        }
    };

    var setOnline = function (code) {
        onlineCode = code;
        airCode.innerText = code;
        airStatus.innerText = "Online";
        airStatus.className = airStatus.className.replace("danger", "success");
    };

    var setOffline = function () {
        onlineCode = null;
        airCode.innerText = "^_^";
        airStatus.innerText = "Offline";
        airStatus.className = airStatus.className.replace("success", "danger");
    };

    console.log("Air play init success.");
}