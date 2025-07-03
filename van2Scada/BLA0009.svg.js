/* global myscada,activeRecipeData,activeRecipeDataRows,activeRecipeRow,activeRecipeIndex,activeRecipeIndexes,activeRecipeFilteredData,activeRecipeFilteredDataRows,activeRecipeFilterHash,activeRecipeFilter1,activeRecipeFilter2,activeRecipeFilter3,activeRecipeFilter4,activeRecipeFilter5,activeRecipeFilter6,activeRecipeFilter7,activeRecipeFilter8,activeRecipeFilter9,screenID */
function destroy() {
  // view hide code
}

function init() {
  // initialization code
}

function periodic() {
  // periodically triggering code
  
  // Read tags for tag group Automated_Assembly
  myscada.readTagsSymbolic("Automated_Assembly", (err, data) => {
    if (!err) {
      var bla_1 = data['bla_1'].value;
      var bla_1_err = data['bla_1'].err;
      var bla_2 = data['bla_2'].value;
      var bla_2_err = data['bla_2'].err;
      
      // Ensure there are no errors in reading the values
      if (!bla_1_err && !bla_2_err) {
        // Subtract bla_1 from bla_2
        var bla_Diff = 32.152 - (bla_2 + bla_1);
        
        // Prepare options for writing to BLA tag group
        var options = {};
        options['name'] = "BLA";
        options['values'] = {
          'bla_Diff': bla_Diff
        };

        // Write the calculated difference to bla_Diff tag
        myscada.writeTags(options, (err, data) => {
          if (err) {
            // Handle write error with detailed logging
            console.error("Error writing bla_Diff:", err);
          } else {
            console.log("Successfully wrote bla_Diff:", bla_Diff);
          }
        });
      } else {
        console.error("Error in reading bla_1 or bla_2");
      }
    } else {
      console.error("Error in reading tags from Automated_Assembly:", err);
    }
  });
}
