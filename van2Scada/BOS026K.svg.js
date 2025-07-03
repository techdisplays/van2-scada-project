/* global myscada, activeRecipeData, activeRecipeDataRows, activeRecipeRow, activeRecipeIndex, activeRecipeIndexes, activeRecipeFilteredData, activeRecipeFilteredDataRows, activeRecipeFilterHash, activeRecipeFilter1, activeRecipeFilter2, activeRecipeFilter3, activeRecipeFilter4, activeRecipeFilter5, activeRecipeFilter6, activeRecipeFilter7, activeRecipeFilter8, activeRecipeFilter9, screenID */
var intervalID;

function init() {
    console.log("[BOS0285.svg.js] BOS0285 init function called");
    myscada.sendObject('Condition Monitoring Toolkit for BOS0285');
    myscada.setItems('Comp25565871', "Processing BOS0285 data...");
    intervalID = setInterval(periodic, 5000);
}

function destroy() {
    if (intervalID) clearInterval(intervalID);
    console.log("[BOS0285.svg.js] BOS0285 destroy function called");
}

function periodic() {
    console.log("[BOS0285.svg.js] BOS0285 periodic function called");
    const obj = { id: 'getDataBOS0285' };

    myscada.sendDataToServerSideScript(obj, (err, data) => {
        if (err) {
            console.error("[BOS0285.svg.js] BOS0285 Error:", err);
            myscada.setItems('Comp25565871', "Error while receiving BOS0285 data...");
            return;
        }

        console.log("[BOS0285.svg.js] BOS0285 Full Data received:", JSON.stringify(data));
        if (data) {
            writeValuesToTags(data);
            displayFormattedData(data);
        } else {
            console.log("[BOS0285.svg.js] No data received for BOS0285.");
        }
    });
}

function writeValuesToTags(data) {
    console.log("[BOS0285.svg.js] BOS0285 Incoming data for tag writing:", JSON.stringify(data));

    if (!data || typeof data['Inclination Status'] === 'undefined') {
        console.error("[BOS0285.svg.js] BOS0285 Incomplete data received:", JSON.stringify(data));
        return;
    }

    var tagOptions = {
        name: "BOS0285",
        values: {
            'InclinationStatus': data['Inclination Status']
        }
    };

    console.log("[BOS0285.svg.js] Preparing to write tags with data:", JSON.stringify(tagOptions));
    myscada.writeTags(tagOptions, (err) => {
        if (err) console.error("[BOS0285.svg.js] Failed to write tags:", err);
        else console.log("[BOS0285.svg.js] Successfully wrote to tags:", JSON.stringify(tagOptions.values));
    });
}


function readTagsAndLog() {
    console.log("[BOS0285.svg.js] Reading BOS0285 tags...");
    myscada.readTags({name: "BOS0285"}, (err, tagData) => {
        if (err) console.error("[BOS0285.svg.js] Failed to read tags:", err);
        else {
            console.log("[BOS0285.svg.js] BOS0285 Tag values:", JSON.stringify(tagData));
            // Optionally, detail each tag value if needed
        }
    });
}

