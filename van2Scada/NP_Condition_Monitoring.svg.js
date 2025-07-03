/* global myscada */
function destroy() {
    // Cleanup code when the view is closed
}

function init() {
    // Initialization code when the view is opened
    console.log("[YourViewName] Initialization function called");
    myscada.sendObject('REST API Interaction');
    myscada.setItems('CompIDForYourView', "Fetching data...");
    fetchTemperatureAndVibrationData(); // Fetch data immediately
}

function periodic() {
    // Periodically triggered code
    fetchTemperatureAndVibrationData();
}

const camIP = '10.10.13.61';

// Helper function to convert 4 bytes into a float value and format it to 3 decimal places
function getFloat(array) {
    const view = new DataView(new ArrayBuffer(4));
    array.forEach((b, i) => {
        view.setUint8(i, b);
    });
    return view.getFloat32(0);
}

// Helper function to convert temperature from Celsius to Fahrenheit and format it
function formatTemperature(value) {
    const temperatureFahrenheit = value * (9 / 5) + 32;
    return temperatureFahrenheit.toFixed(2) + '°F';
}

// Function to fetch parameter data
async function getParameterData(index, subIndex, formatVibration = false, formatTemperatureValue = false) {
    const deviceAlias = 'master1port7'; // Replace with the correct device alias
    const url = `http://${camIP}/iolink/v1/devices/${deviceAlias}/parameters/${index}/subindices/${subIndex}/value?format=byteArray`;

    try {
        console.log(`Fetching parameter data for index ${index}, subIndex ${subIndex}...`);
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error fetching parameter data: ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();

        if (formatVibration && index === 8462 && subIndex === 0) {
            const allValue = data.value;
            const slicedData = allValue.slice(0, 12);
            const formattedResult = [];
            for (let i = 0; i < slicedData.length; i += 4) {
                const floatVal = getFloat(slicedData.slice(i, i + 4));
                formattedResult.push(parseFloat(floatVal.toFixed(3)));
            }
            data.formattedValue = formattedResult;
            console.log(`Formatted Vibration Data for index ${index}, subIndex ${subIndex}:`, formattedResult);
        }

        if (formatTemperatureValue && index === 82 && subIndex === 1) {
            const temperatureCelsius = data.value[data.value.length - 1];
            const formattedTemperature = formatTemperature(temperatureCelsius);
            data.formattedValue = formattedTemperature;
            console.log(`Formatted Temperature Data for index ${index}, subIndex ${subIndex}:`, formattedTemperature);
        }

        console.log(`Parameter Data for index ${index}, subIndex ${subIndex}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching parameter data for index ${index}, subIndex ${subIndex}:`, error);
    }
}

// Function to fetch both temperature and vibration data
async function fetchTemperatureAndVibrationData() {
    // Fetch temperature data
    const temperatureData = await getParameterData(82, 1, false, true);
    myscada.setItems('CompTemperature', JSON.stringify(temperatureData));

    // Fetch vibration data
    const vibrationData = await getParameterData(8462, 0, true);
    myscada.setItems('CompVibration', JSON.stringify(vibrationData));
}
