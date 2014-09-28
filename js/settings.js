/**
 * Created by yanbo.ai on 2014/9/26.
 */

function Settings(options) {
    var onok = options.onok;
    var onws = options.onws;
    var onreadonly = options.onreadonly;

    this.set = function () {
        var parameter = getSearchParameters();
        if (parameter.ws && parameter.code) {
            if (!(parameter.ctrl && parameter.ctrl == 1)) {
                onreadonly();
            }
            onok(parameter.ws, parameter.code);
            return;
        }
        if (parameter.ws) {
            onws(parameter.ws);
            return;
        }
        var ws = localStorage.getItem("ws");
        if (ws) {
            onws(ws);
        }
    };

    this.save = function (ws) {
        localStorage.setItem("ws", ws);
    };

    var getSearchParameters = function () {
        var prmstr = window.location.search.substr(1);
        return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
    };

    var transformToAssocArray = function (prmstr) {
        var params = {};
        var prmarr = prmstr.split("&");
        for (var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = decodeURIComponent(tmparr[1]);
        }
        return params;
    }
}