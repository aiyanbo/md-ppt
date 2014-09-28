/**
 * Created by yanbo.ai on 14-9-25.
 */

function AirPlay(options) {
    var onopen = options.onopen;
    var onplay = options.onplay;
    var onpush = options.onpush;
    var onpull = options.onpull;

    var onlineCode = null;
    var airCode = document.querySelector("#air_code");
    var airStatus = document.querySelector("#air_status");
    var __url__ = null;
    var webSocket = null;
    var __this__ = this;

    this.connect = function (url, code) {
        if (webSocket && webSocket.readyState === 1) {
            webSocket.close();
        }
        webSocket = new WebSocket(url);
        webSocket.onopen = function (event) {
            __url__ = url;
            if (code) {
                __this__.send(messaging("conn", code));
            }
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

    this.join = function (code) {
        this.send(messaging("conn", code));
    };

    this.send = function (message) {
        console.log(message);
        webSocket.send(JSON.stringify(message));
    };

    this.isOnline = function () {
        return onlineCode != null;
    };

    this.url = function () {
        return __url__;
    };

    this.code = function () {
        return onlineCode;
    };

    var controller = function (event) {
        switch (event.type) {
            case "new":
                setOnline(event.data);
                event.url = __url__;
                onopen(event);
                break;
            case "push":
                onpush(event);
                break;
            case "play":
                onplay(event);
                break;
            case "pull":
                onpull(event);
                break;
            default :
                console.log(event);
        }
    };

    var messaging = function (type, data) {
        var message = {};
        message.type = type;
        message.data = data;
        return message;
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