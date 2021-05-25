const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://broker.hivemq.com");

/**
 * The state of the device, defaults to closed
 * Possible states : closed, opening, open, closing
 */

client.on("connect", () => {
  // Inform controllers that device is connected
  client.publish("device/connected", "true");
});

const generateSensorData = () => ({
  id: 12,
  value: Math.random(),
});
function sendSensorDataUpdate() {
  console.log("Generating Sensor data to be sent");
  client.publish("device/sensorData", JSON.stringify(generateSensorData()));
}

setInterval(() => {
  sendSensorDataUpdate();
}, 2000);
/**
 * Want to notify controller that device is disconnected before shutting down
 */
function handleAppExit(options, err) {
  if (err) {
    console.log(err.stack);
  }

  if (options.cleanup) {
    client.publish("device/connected", "false");
  }

  if (options.exit) {
    process.exit();
  }
}

/**
 * Handle the different ways an application can shutdown
 */
process.on(
  "exit",
  handleAppExit.bind(null, {
    cleanup: true,
  })
);
process.on(
  "SIGINT",
  handleAppExit.bind(null, {
    exit: true,
  })
);
process.on(
  "uncaughtException",
  handleAppExit.bind(null, {
    exit: true,
  })
);
