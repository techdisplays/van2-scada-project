/* global myscada,activeRecipeData,activeRecipeDataRows,activeRecipeRow,activeRecipeIndex,activeRecipeIndexes,activeRecipeFilteredData,activeRecipeFilteredDataRows,activeRecipeFilterHash,activeRecipeFilter1,activeRecipeFilter2,activeRecipeFilter3,activeRecipeFilter4,activeRecipeFilter5,activeRecipeFilter6,activeRecipeFilter7,activeRecipeFilter8,activeRecipeFilter9,h,hh,ht,hht */
var intervalID;

function init() {
    console.log("[BSP00YR.svg.js] BSP00YR init function called");
    myscada.sendObject('Condition Monitoring Toolkit for BSP00YR');
    myscada.setItems('Comp25565870', "Processing BSP00YR data...");
    intervalID = setInterval(periodic, 5000);
}

function destroy() {
    if (intervalID) clearInterval(intervalID);
    console.log("[BSP00YR.svg.js] BSP00YR destroy function called");
}

function periodic() {
    console.log("[BSP00YR.svg.js] BSP00YR periodic function called");
    const obj = { id: 'getDataBSP00YR' };

    myscada.sendDataToServerSideScript(obj, (err, data) => {
        if (err) {
            console.error("[BSP00YR.svg.js] BSP00YR Error:", err);
            myscada.setItems('Comp25565870', "Error while receiving BSP00YR data...");
            return;
        }

        console.log("[BSP00YR.svg.js] BSP00YR Full Data received:", JSON.stringify(data));
        if (data) {
            writeValuesToTags(data);
            displayFormattedData(data);
        } else {
            console.log("[BSP00YR.svg.js] No data received for BSP00YR.");
        }
    });
}

function writeValuesToTags(data) {
    console.log("[BSP00YR.svg.js] BSP00YR Incoming data for tag writing:", JSON.stringify(data));

    if (!data || typeof data['Pressure'] === 'undefined' ||
        typeof data['Switch1 State'] === 'undefined' ||
        typeof data['Switch2 State'] === 'undefined') {
        console.error("[BSP00YR.svg.js] BSP00YR Incomplete data received:", JSON.stringify(data));
        return;
    }

    var tagOptions = {
        name: "BSP00YR",
        values: {
            'Pressure': data['Pressure'],
            'SwitchState1': data['Switch1 State'],
            'SwitchState2': data['Switch2 State'] 
        }
    };

    console.log("[BSP00YR.svg.js] Preparing to write tags with data:", JSON.stringify(tagOptions));
    myscada.writeTags(tagOptions, (err) => {
        if (err) console.error("[BSP00YR.svg.js] Failed to write tags:", err);
        else console.log("[BSP00YR.svg.js] Successfully wrote to tags:", JSON.stringify(tagOptions.values));
    });
}

function displayFormattedData(data) {
    let dataString = JSON.stringify(data, null, 2);
    let htmlData = '<style>.string{color:#E63245;}.number{color:green;}.boolean{color:#2D8DAB;}.null{color:magenta;}.key{color:#074763;}</style>' +
                   '<div><pre><code>' + syntaxHighlight(dataString) + '</code></pre></div>';
    myscada.setItems('Comp25565870', htmlData);
    console.log("[BSP00YR.svg.js] BSP00YR Data set on Comp25565870");
}

function readTagsAndLog() {
    console.log("[BSP00YR.svg.js] Reading BSP00YR tags...");
    myscada.readTags({name: "BSP00YR"}, (err, tagData) => {
        if (err) console.error("[BSP00YR.svg.js] Failed to read tags:", err);
        else {
            console.log("[BSP00YR.svg.js] BSP00YR Tag values:", JSON.stringify(tagData));
            // Optionally, detail each tag value if needed
        }
    });
}




