/* global myscada,activeRecipeData,activeRecipeDataRows,activeRecipeRow,activeRecipeIndex,activeRecipeIndexes,activeRecipeFilteredData,activeRecipeFilteredDataRows,activeRecipeFilterHash,activeRecipeFilter1,activeRecipeFilter2,activeRecipeFilter3,activeRecipeFilter4,activeRecipeFilter5,activeRecipeFilter6,activeRecipeFilter7,activeRecipeFilter8,activeRecipeFilter9,screenID */

let errorLog = []; // Array to store log entries
let flags = {}; // Object to store flags for each value

// Mapping of variable keys to display strings
const displayStrings = {
    hw_ID: "Hardware ID",
    error: "Error",
    cn_voltage_sc_port_1: "Connection Voltage SC Port 1",
    sc_port1_pin4: "SC Port 1 Pin 4",
    sc_port1_pin2: "SC Port 1 Pin 2",
    act_pot1_pin4: "Actuator Port 1 Pin 4",
    act_port1_pin2: "Actuator Port 1 Pin 2",
    // Add more mappings as needed
};

// Specific mappings for hw_ID and error values
const hwIDMappings = {
    "297": "BNI00CN",
    "302": "BNI00CN",
    "default": "BNI00HL"
};

const errorMappings = {
    6148: "IO-Link Short",
    6144: "Disconnected IO-Link",
    6150: "Port Short Circuit",
    6160: "Output Overload",
    20754: "Low Actuator Power"
};

function destroy() {
    // view hide code
}

function init() {
    // initialization code
}

function displayValues(data) {
    myscada.setItems('Comp32675924', data.join('<br>'));
    console.log("[NP_Diagnostics(2).js] Data set on Comp27210651: " + data);
}

function getDisplayString(key, value) {
    if (key === 'hw_ID') {
        return hwIDMappings[value] || hwIDMappings["default"];
    } else if (key === 'error') {
        return errorMappings[value] || value;
    } else {
        return displayStrings[key] || key;
    }
}

function periodic() {
    // periodically triggering code

    // Read tags from PLC
    myscada.readTagsSymbolic("Network_Panel_Diagnostic_Logs", (err, data) => {
        if (err) {
            // Read error
            console.log("Error reading tags:", err);
            myscada.setItems('Comp32675924', ["Error while receiving data..."]);
        } else {
            let newErrors = [];
            let hwIDString = getDisplayString('hw_ID', data['hw_ID'].value);

            // Initialize flags if they don't exist
            if (flags['hw_ID'] === undefined) flags['hw_ID'] = false;
            if (flags['error'] === undefined) flags['error'] = false;

            let entry = hwIDString;

            if (data['error'].value !== 0 && !flags['error']) {
                let errorString = getDisplayString('error', data['error'].value);
                entry += `: ${errorString}`;
                flags['error'] = true;
            } else if (data['error'].value === 0) {
                flags['error'] = false;
            }

            const specificKeys = [
                'cn_voltage_sc_port_1',
                'sc_port1_pin4',
                'sc_port1_pin2',
                'act_pot1_pin4',
                'act_port1_pin2'
            ];

            specificKeys.forEach(key => {
                if (flags[key] === undefined) flags[key] = false;

                if (data[key].value !== 0 && !flags[key]) {
                    let displayString = getDisplayString(key, data[key].value);
                    entry += `, ${displayString}`;
                    flags[key] = true;
                } else if (data[key].value === 0) {
                    flags[key] = false;
                }
            });

            if (entry !== hwIDString) {
                newErrors.push(entry);
            }

            if (newErrors.length > 0) {
                // Append new errors to the log
                errorLog = errorLog.concat(newErrors);

                // Display the log
                displayValues(errorLog);
            }
        }
    });
}

// Initialize and start periodic function
init();
setInterval(periodic, 1000);
