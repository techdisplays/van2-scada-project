
//BCM0001.svg.js

/* global myscada,activeRecipeData,activeRecipeDataRows,activeRecipeRow,activeRecipeIndex,activeRecipeIndexes,activeRecipeFilteredData,activeRecipeFilteredDataRows,activeRecipeFilterHash,activeRecipeFilter1,activeRecipeFilter2,activeRecipeFilter3,activeRecipeFilter4,activeRecipeFilter5,activeRecipeFilter6,activeRecipeFilter7,activeRecipeFilter8,activeRecipeFilter9,h,hh,ht,hht */
var intervalID;


function init() {
// initialization code
    myscada.sendObject('Condition Monitoring Toolkit');
    myscada.setItems('Comp25565870', "Processing data...");
    console.log('init function called'); // Log when init is called
    
    // Call the periodic function every 5 seconds (5000 milliseconds).
    // You can adjust the interval to suit the requirements of your application.
    intervalID = setInterval(periodic, 5000);
}

function destroy() {
// view hide code
  // Clear the interval when the view is destroyed to prevent memory leaks.
    if (intervalID) {
        clearInterval(intervalID);
    }
    console.log('destroy function called'); // Log when destroy is called
}

const syntaxHighlight = (json) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
};
 
function periodic() {
    console.log('periodic function called');
    const obj = { id: 'getDataBCM0001' };

    myscada.sendDataToServerSideScript(obj, function (err, data) { // Rename dataString to data for clarity
        if (err) {
            console.error('Error:', err);
            myscada.setItems('Comp25565870', "Error while receiving data...");
            return;
        }

        // data is expected to be an object here, so no need to parse it
        console.log('Data received:', data);
        
        writeValuesToTags(data); // Directly pass the data object
        displayFormattedData(data); // No changes needed here
    });
    readTagsAndLog(); // Read the current tag values and log them
}

function writeValuesToTags(data) {
    console.log('Incoming data for tag writing:', data);

    // Check if the data object has the necessary fields
    if (!data || typeof data['Contact Temperature Contact Temperature'] === 'undefined' || 
        typeof data['Vibration Velocity RMS v-RMS X'] === 'undefined' || 
        typeof data['Vibration Velocity RMS v-RMS Y'] === 'undefined' || 
        typeof data['Vibration Velocity RMS v-RMS Z'] === 'undefined') {
        console.error('Incomplete data received:', data);
        return;
    }

    // Assign the actual values received to the tags
    var options = {
        name: "BCM0001",
        values: {
            'temperature': data['Contact Temperature Contact Temperature'],
            'vx': data['Vibration Velocity RMS v-RMS X'],
            'vy': data['Vibration Velocity RMS v-RMS Y'],
            'vz': data['Vibration Velocity RMS v-RMS Z'],
            'message': "Actual message here" // Adjust or remove based on actual data or requirements
        }
    };

    // Use the writeTags function to update tag values in the SCADA system
    myscada.writeTags(options, function(err, data) {
        if (err) {
            console.error('Failed to write tags:', err);
        } else {
            console.log('Successfully wrote to tags:', options.values);
        }
    });
}


function readTagsAndLog() {
    myscada.readTagsSymbolic("cmtk", (err, data) => {
        if (err) {
            console.error('Failed to read tags:', err);
        } else {
            console.log('Tag values:', data);
            // Optionally, log individual tag values
            console.log('Temperature:', data['temperature'].value);
            console.log('Vibration Velocity RMS X:', data['vx'].value);
            console.log('Vibration Velocity RMS Y:', data['vy'].value);
            console.log('Vibration Velocity RMS Z:', data['vz'].value);
            // Include 'message' tag if applicable
            // console.log('Message:', data['message'].value);
        }
    });
}


function displayFormattedData(data) {
    // Convert data to a string for display
    let dataString = JSON.stringify(data, null, 2);
    
    // Apply syntax highlighting
    let htmlData = '<style>\n\
                        .string{color:#E63245;}\n\
                        .number{color:green;}\n\
                        .boolean{color:#2D8DAB;}\n\
                        .null{color:magenta;}\n\
                        .key{color:#074763;}\n\
                    </style>';
    htmlData += '<div><pre><code>' + syntaxHighlight(dataString) + '</code></pre></div>';
    
    // Update the component with the formatted data
    myscada.setItems('Comp25565870', htmlData);
    console.log('Data set on Comp25565870'); // Log when data is set on the component
}

//uncomment to receive objects from other views
//function myscadaObjectReceived(data) {}





