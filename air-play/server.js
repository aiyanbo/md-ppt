var ws = require("nodejs-websocket");
var os = require('os');

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

var server = ws.createServer(function (conn) {
    var code = getRandomInt(100000, 999999);
    conn.sendText(buildMessage("new", code));
    conn.code = code;
    conn.nodes = [];
    conn.master = null;
    conn.on("text", function (str) {
        console.log(str);
        var message = JSON.parse(str);
        if ("conn" === message.type) {
            for (var index in server.connections) {
                var connection = server.connections[index];
                if (message.data == connection.code) {
                    conn.master = connection;
                    safeAdd(connection.nodes, conn.code);
                    conn.sendText(buildMessage("status", {"action": "conn", "code": 200}));
                    connection.sendText(buildMessage("push", ""));
                    break;
                }
            }

        } else if ("pull" === message.type || "play" === message.type) {
            var nodes = [];
            if (conn.master != null) {
                safeAdd(nodes, conn.master.code);
                safeAdd(nodes, conn.master.nodes);
                nodes.splice(nodes.indexOf(conn.code), 1);
            } else {
                safeAdd(nodes, conn.nodes);
            }
            console.log("conn code: " + conn.code + ", nodes: " + nodes);
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
        console.log("Connection has error, it will be closed. The reason maybe browser has refresh, details:");
        console.error(error);
    })
}).listen(8001);

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log("Server running 8001");
console.log("Air play path: ws://" + addresses[0] + ":8001");