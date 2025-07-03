/* global myscada,activeRecipeData,activeRecipeDataRows,activeRecipeRow,activeRecipeIndex,activeRecipeIndexes,activeRecipeFilteredData,activeRecipeFilteredDataRows,activeRecipeFilterHash,activeRecipeFilter1,activeRecipeFilter2,activeRecipeFilter3,activeRecipeFilter4,activeRecipeFilter5,activeRecipeFilter6,activeRecipeFilter7,activeRecipeFilter8,activeRecipeFilter9,screenID */
function destroy() {
// view hide code

}

function init() {
// initialization code

}


function periodic() {
// periodically triggering code
//updateSensorValue(); // Call the function to read and write PLC tags

}

/*
// Define a function to read and write tags at regular intervals
function updateSensorValue() {
  // Read tags for tag group Test_PLC_Table
  myscada.readTagsSymbolic("Test_PLC_Table", (err, data) => {
    if (!err) {
      var bmp_Measurement_Value = data['bmp_Measurment_Value'].value;
      var bmp_Measurement_Value_err = data['bmp_Measurment_Value'].err;

      console.log("Sensor value:", bmp_Measurement_Value); // Output sensor value to console
      console.log("Error:", bmp_Measurement_Value_err); // Output error status to console

      // Check if sensor value exceeds 1000
      if (bmp_Measurement_Value > 100) {
        console.log("Sensor value exceeds 1000. Setting to zero."); // Output message to console
        bmp_Measurement_Value = 0; // Set sensor value to zero
      }

      // Write tags for tag group Test_PLC_Table
      var options = {};
      options['name'] = "Test_PLC_Table";
      options['values'] = {};
      options['values']['bmp_Measurment_Value'] = bmp_Measurement_Value;

      myscada.writeTags(options, (err, data) => {
        if (err) {
          console.error("Error writing tags:", err); // Output write error to console
        } else {
          console.log("Tags written successfully:", data); // Output success message to console
        }
      });
    } else {
      console.error("Error reading tags:", err); // Output read error to console
    }
  });
}

// Call the function to start updating the sensor value at regular intervals
setInterval(updateSensorValue, 100); // Update every 1 second (adjust interval as needed)
*/