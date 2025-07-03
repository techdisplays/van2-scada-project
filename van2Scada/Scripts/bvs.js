const mqtt = require('mqtt');
//const fs = require('fs');

const mqttIP = 'mqtt://192.168.10.150:1883';    //LAN is mqtts://192.168.0.121:8883
const camSerialNr = 'B00005548600412'; //it's a little different than in webserver, check it with mqttexplorer
const topics = [
    `balluff/${camSerialNr}/vision/status`,
    `balluff/${camSerialNr}/diagnostics`,
    `balluff/${camSerialNr}/identification`,
    `balluff/${camSerialNr}/vision/inspection/results`
];

const messageJSON = {
    identification: {},
    visionStatus: {},
    diagnosticsData: {},
    visionResultsData: {}
};

const init = () => {
    //Connecting mqtt broker
    const client = mqtt.connect(mqttIP);

    client.on('connect', function () {
        console.log(`Connected, subscribed to: ${topics}`);
        client.subscribe((topics));
    });

    client.on('error', (err) => {
        //console.log('Connection error: ', err);
    });

    client.on('message', function (topic, message, packet) {
        message = JSON.parse(message);

        switch (topic) {
            case topics[0]:
                messageJSON.visionStatus = message;
                break;
            case topics[1]:
                messageJSON.diagnosticsData = message;
                break;
            case topics[2]:
                messageJSON.identification = message;
                break;
            case topics[3]:
                messageJSON.visionResultsData = message;
                break;
            default:
                break;
        }
        exports.message = messageJSON;
    });
};
exports.init = init;