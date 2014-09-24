var ws = require("nodejs-websocket");

var server = ws.createServer(function (conn) {
    var code = getRandomInt(100000, 999999);
    conn.sendText(buildMessage("new", code));
    conn.code = code;
    conn.nodes = [];
    conn.on("text", function (str) {
        console.log(str);
        var message = JSON.parse(str);
        if ("conn" === message.type) {
            for (var index in server.connections) {
                var connection = server.connections[index];
                if (message.data == connection.code) {
                    safeAdd(connection.nodes, code);
                    safeAdd(conn.nodes, connection.code);
                    safeAdd(conn.nodes, connection.nodes);
                    // remove self
                    conn.nodes.splice(conn.nodes.indexOf(code), 1);
                    conn.sendText(buildMessage("conn", "success"));
                    connection.sendText(buildMessage("send", "ppt"));
                    break;
                }
            }
        } else if ("ppt" === message.type || "play" === message.type) {
            console.log("conn code: " + conn.code + ", nodes: " + conn.nodes);
            var nodes = conn.nodes;
            server.connections.forEach(function (connection) {
                for (var index in nodes) {
                    if (nodes[index] == connection.code) {
                        connection.sendText(str)
                    }
                }
            })
        }
    });
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    });
    conn.on("error", function (error) {
        console.log(error)
    })
}).listen(8001);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildMessage(type, object) {
    var message = {};
    message.type = type;
    message.data = object;
    return JSON.stringify(message)
}

function safeAdd(array, eles) {
    if (typeof eles === "number") {
        if (array.indexOf(eles) < 0) {
            array.push(eles);
        }
    } else {
        eles.forEach(function (ele) {
            if (array.indexOf(ele) < 0) {
                array.push(ele);
            }
        });
    }
}

console.log("Server running 8001");