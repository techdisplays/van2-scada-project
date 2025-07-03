// Import the async MQTT client package
import mqtt from 'async-mqtt';

// Constants for the MQTT broker connection
const mqttBrokerUrl = 'mqtt://10.10.13.22:1883';

// Main asynchronous function to connect to the MQTT broker and handle messages
async function main() {
    try {
        console.log('Connecting to MQTT broker at', mqttBrokerUrl);

        // Connect to the MQTT broker with the given URL
        const client = await mqtt.connect(mqttBrokerUrl, {
            clientId: "mqttClientExample",
        });

        console.log('Successfully connected to the MQTT broker.');

        // Event handler for incoming MQTT messages
        client.on('message', function(topic, message) {
            console.log(`Message received on topic ${topic}:`, message.toString());

            // Here, you can add your logic to process the incoming message
            try {
                const data = JSON.parse(message.toString());
                console.log('Parsed message data:', data);

                // Handle data from 'cmtk/cmtkv1/port2/pd' topic
                if (topic === 'cmtk/cmtkv1/port2/pd') {
                    const pressure = data.Pressure;
                    const switch1State = data['Switch1 State'];
                    const switch2State = data['Switch2 State'];
                    console.log(`Sensor Data from Port 2: Pressure = ${pressure}, Switch1 State = ${switch1State}, Switch2 State = ${switch2State}`);
                }

                /* // Handle data from 'cmtk/cmtkv1/port3/pd' topic
                else if (topic === 'cmtk/cmtkv1/port3/pd') {
                    const errorCode = data['Error code'];
                    console.log(`Sensor Data from Port 3: Error Code = ${errorCode}`);
                } */
            } catch (error) {
                console.error('Error parsing MQTT message:', error);
            }
        });

        // Subscribe to the desired MQTT topic(s)
        await client.subscribe('cmtk/cmtkv1/port2/pd');
        //await client.subscribe('cmtk/cmtkv1/port3/pd');
        console.log('Subscribed to topics.');

    } catch (error) {
        // Handle errors that may occur during connection or subscription
        console.error('An error occurred:', error);
    }
}

// Execute the main function to start the MQTT client
main();

//node MyScada_Test1.mjs