var HOST = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(HOST);

ws.onmessage = function (event) {
    console.log(typeof(event));
    console.log(event);
    console.log(event.data);
};