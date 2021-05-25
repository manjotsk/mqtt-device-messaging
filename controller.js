// controller.js
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");

var deviceState = "";
var connected = false;

client.on("connect", () => {
  client.subscribe("device/connected");
  client.subscribe("device/sensorData");
});

client.on("message", (topic, message) => {
  switch (topic) {
    case "device/connected":
      return handleDeviceConnected(message);
    case "device/sensorData":
      return handleDeviceSensorData(message);
  }
  console.log("No handler for topic %s", topic);
});

function handleDeviceConnected(message) {
  console.log("device connected status %s", message);
  connected = message.toString() === "true";
}

function handleDeviceSensorData(message) {
  console.log("Reveiced data:- ", message);
}

function openDeviceDoor() {
  // can only open door if we're connected to mqtt and door isn't already open
  if (connected && deviceState !== "open") {
    // Ask the door to open
    client.publish("device/open", "true");
  }
}

function closeDeviceDoor() {
  // can only close door if we're connected to mqtt and door isn't already closed
  if (connected && deviceState !== "closed") {
    // Ask the door to close
    client.publish("device/close", "true");
  }
}

// --- For Demo Purposes Only ----//

// simulate opening device door
setTimeout(() => {
  openDeviceDoor();
}, 5000);

// simulate closing device door
setTimeout(() => {
  closeDeviceDoor();
}, 20000);
