import fs from 'fs'; // Make sure to import the fs module
import mqtt from 'mqtt';

// MQTT connection options and topic
const mqttIP = 'mqtts://10.10.13.21:8883';
const topic = 'cmtk/cmtkv1/port2/pd';
const options = {
  clientId: 'DIH',
  username: 'user',
  password: 'Balluff#1',
  rejectUnauthorized: false, // Set this to true to enforce certificate validation
  ca: [fs.readFileSync('D:\\Van2_Scada\\Van2Scada_V1\\certifications\\ca.crt')] // Use double backslashes in Windows paths or use forward slashes
};

// Initialize the MQTT client
const client = mqtt.connect(mqttIP, options);

// Connect to the MQTT broker and subscribe to the topic
client.on('connect', () => {
  console.log('Connected to MQTT broker.');
  client.subscribe(topic, { qos: 1 });
});

// Handle errors
client.on('error', (err) => {
  console.error('Connection error:', err);
  client.end();
});

// Process incoming MQTT messages
client.on('message', (topic, message) => {
  // Assuming the message is in a JSON format
  try {
    const messageJSON = JSON.parse(message.toString());

    // Extract the relevant sensor data from the JSON
    const temperature = messageJSON['Contact Temperature Contact Temperature'];
    const vRMSX = messageJSON['Vibration Velocity RMS v-RMS X'];
    const vRMSY = messageJSON['Vibration Velocity RMS v-RMS Y'];
    const vRMSZ = messageJSON['Vibration Velocity RMS v-RMS Z'];

    // Log the sensor data
    console.log('Sensor Data:', {
      temperature,
      vRMSX,
      vRMSY,
      vRMSZ
    });

    // If you need to do something with the sensor data,
    // such as saving to a database or processing further,
    // you can call the appropriate functions here.

  } catch (err) {
    console.error('Error parsing MQTT message:', err);
  }
});

// Export the client if you need to use it elsewhere
export { client };
