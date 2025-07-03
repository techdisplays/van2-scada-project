/* global myscada,activeRecipeData,activeRecipeDataRows,activeRecipeRow,activeRecipeIndex,activeRecipeIndexes,activeRecipeFilteredData,activeRecipeFilteredDataRows,activeRecipeFilterHash,activeRecipeFilter1,activeRecipeFilter2,activeRecipeFilter3,activeRecipeFilter4,activeRecipeFilter5,activeRecipeFilter6,activeRecipeFilter7,activeRecipeFilter8,activeRecipeFilter9,h,hh,ht,hht */
var intervalID;

function init() {
    myscada.sendObject('Condition Monitoring Toolkit for BCM0002');
    myscada.setItems('Comp25565870', "Processing BCM0002 data...");
    console.log('BCM0002 init function called');
    
    intervalID = setInterval(periodic, 5000);
}

function destroy() {
    if (intervalID) {
        clearInterval(intervalID);
    }
    console.log('BCM0002 destroy function called');
}

function periodic() {
    console.log('BCM0002 periodic function called');
    const obj = { id: 'getDataBCM0002' };

    myscada.sendDataToServerSideScript(obj, function (err, data) {
        if (err) {
            console.error('BCM0002 Error:', err);
            myscada.setItems('Comp25565870', "Error while receiving BCM0002 data...");
            return;
        }

        console.log('BCM0002 Data received:', data);
        writeValuesToTags(data);
        displayFormattedData(data);
    });
    readTagsAndLog(); // This function needs to be defined to read the current tag values for BCM0002 and log them.
}

function writeValuesToTags(data) {
    console.log('BCM0002 Incoming data for tag writing:', data);

    if (!data || typeof data['Contact Temperature Contact Temperature'] === 'undefined' || 
        typeof data['Humidity Humidity'] === 'undefined' || 
        typeof data['Ambient Pressure Ambient Pressure'] === 'undefined') {
        console.error('BCM0002 Incomplete data received:', data);
        return;
    }

    var options = {
        name: "BCM0002",
        values: {
            'temperature': data['Contact Temperature Contact Temperature'],
            'humidity': data['Humidity Humidity'],
            'ambientPressure': data['Ambient Pressure Ambient Pressure'],
        }
    };

    myscada.writeTags(options, function(err) {
        if (err) {
            console.error('BCM0002 Failed to write tags:', err);
        } else {
            console.log('BCM0002 Successfully wrote to tags:', options.values);
        }
    });
}

function displayFormattedData(data) {
    let dataString = JSON.stringify(data, null, 2);
    let htmlData = '<style>.string{color:#E63245;}.number{color:green;}.boolean{color:#2D8DAB;}.null{color:magenta;}.key{color:#074763;}</style>';
    htmlData += '<div><pre><code>' + syntaxHighlight(dataString) + '</code></pre></div>';
    myscada.setItems('Comp25565870', htmlData);
    console.log('BCM0002 Data set on Comp25565870');
}

// The readTagsAndLog function should be similar to the one previously discussed, but tailored for BCM0002's tags.

