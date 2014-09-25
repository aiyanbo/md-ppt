/**
 * Created by yanbo.ai on 14-9-25.
 */

function AirPlay(options) {
    this.onopen = options.onopen;
    this.onclose = options.onclose;
    this.onerror = options.onerror;

    var onlineCode = null;
    var airCode = document.querySelector("#air_code");
    var airStatus = document.querySelector("#air_status");
    var webSocket = null;

    this.connect = function (url) {
        webSocket = new WebSocket(url);
        webSocket.onopen = function (event) {
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
        airCode.value = code;
        airStatus.value = "Online";
        airStatus.className = airStatus.className.replace("danger", "success");
    };

    var setOffline = function () {
        onlineCode = null;
        airCode.value = "^_^";
        airStatus.value = "Offline";
        airStatus.className = airStatus.className.replace("success", "danger");
    };

    console.log("Air play init success.");
}