module.exports = function (RED) {
  "use strict";

  function TTN (config) {
    RED.nodes.createNode(this, config);

    var node = this

    node.app = config.app;
    node.config = RED.nodes.getNode(node.app);

    var client = node.config.client
    if (!client) {
      node.error('No app set');
      node.status({
        fill:  'red',
        shape: 'dot',
        text:  'error',
      });
      return
    }

    client.on('connect', function () {
      node.log('Connected to TTN application ' + node.appId);
      node.status({
        fill:  'green',
        shape: 'dot',
        text:  'connected',
      });
    });

    // get a message from a device
    client.on('message', function (msg) {
      msg.payload = msg.payload_fields || msg.payload_raw;
      node.send([msg, null]);
    });

    client.on('activation', function (msg) {
      msg.payload = msg.dev_id;
      node.send([null, msg]);
    });

    client.on('error', function (err) {
      node.error('Error on connection for TTN application ' + node.appId + ': ' + err);
      node.status({
        fill:  'red',
        shape: 'dot',
        text:  'error',
      });
    });
  }

   RED.nodes.registerType("ttn", TTN)
}
