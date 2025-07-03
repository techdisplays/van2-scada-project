/* global myscada,activeRecipeData,activeRecipeDataRows,activeRecipeRow,activeRecipeIndex,activeRecipeIndexes,activeRecipeFilteredData,activeRecipeFilteredDataRows,activeRecipeFilterHash,activeRecipeFilter1,activeRecipeFilter2,activeRecipeFilter3,activeRecipeFilter4,activeRecipeFilter5,activeRecipeFilter6,activeRecipeFilter7,activeRecipeFilter8,activeRecipeFilter9,bdgTargetValue,screenID,currentPosition */
// Assume currentPosition is declared outside of the periodic function to maintain its state
let temperatureInterval;

function destroy() {
// view hide code
// Clear the interval when the view is hidden or destroyed
    if (temperatureInterval) {
        clearInterval(temperatureInterval);
    }
}

function init() {
// initialization code

    
}



function periodic() {
    // Ensure we don't stack intervals
    if (temperatureInterval) {
        clearInterval(temperatureInterval);
    }
    
    // Call getDeviceTemperature every 2 seconds
    temperatureInterval = setInterval(getDeviceTemperature, 2000);
}




//get the text box 
var selItem = myscada.getSelectedItem('Comp16267275');
//alert(selItem);

//assign value to the button
function setItem() {
	//debugger;
        //assign textbox value to button press
myscada.setSelectedItem('Comp01396117','Comp16267275');
}

/*
const http = require('http');

const options = {
  hostname: '10.10.13.41',
  path: '/iolink/v1/devices/master1port1/parameters/82/subindices/1/value?format=byteArray',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const getDeviceTemperature = () => {
  let data = '';

  const request = http.request(options, (response) => {
    response.setEncoding('utf8');

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      // Assuming the API returns a JSON object with a 'value' field that is an array
      const result = JSON.parse(data);
      if (result.value && result.value.length >= 2) {
        const temperatureValueCelsius = (result.value[0] << 8) | result.value[1];
        const temperatureValueFahrenheit = (temperatureValueCelsius * 9 / 5) + 32;
        console.log(`Device temperature in Celsius: ${temperatureValueCelsius}°C`);
        console.log(`Device temperature in Fahrenheit: ${temperatureValueFahrenheit.toFixed(2)}°F`);
      } else {
        console.error('Value array does not contain enough elements.');
      }
    });
  });

  request.on('error', (error) => {
    console.error(error);
  });

  request.end();
};

getDeviceTemperature();

*/