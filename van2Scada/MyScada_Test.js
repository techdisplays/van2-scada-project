async function getSensorValue(parameterIndex, subindex) {
  const baseUrl = 'http://10.10.13.52/api/balluff/v1/iolink/v1/devices/master1port4/parameters';
  const url = `${baseUrl}/${parameterIndex}/subindices/${subindex}/value?format=byteArray`;

  console.log(`Fetching data from URL: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Fetched data for parameterIndex ${parameterIndex}, subindex ${subindex}:`, data);
    return data.value;
  } catch (error) {
    console.error('Fetch error:', error.message);
    return [];
  }
}

async function init() {
  try {
    const inclinationStatus = await getSensorValue(8532, 0);
    console.log('Inclination Status:', inclinationStatus);

    window.messageBOS0285 = {
      inclinationStatus
    };
  } catch (error) {
    console.error('Initialization error:', error.message);
  }
}

init();
