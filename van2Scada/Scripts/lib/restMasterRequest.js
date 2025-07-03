const axios = require('axios');

/**
 * Check communication with Balluff master.
 * @todo more headers?
 * @param {string} ipAddress Master IP address.
 * @returns {Promise<boolean>} Connection status.
 */
const checkComm = function (ipAddress) {
    const connection = axios
        .get(`http://${ipAddress}/api/balluff/v1/diagnostics/network`)
        .then(function (res) {
            if (res.status === 200) {
                console.log(`Connection with master established. IP: ${ipAddress}`);
                return true;
            } else {
                console.warn(`Wrong status code while checking connection: ${res.status}`);
                return false;
            }
        })
        .catch(function (error) {
            console.error(`Master not responding - check network connection and master IP address: ${ipAddress}; ${error}`);
            return false;
        });
    return connection;
};

/**
 * Login to Balluff master for POST requests access.
 * Creation of a new admin/expert user only for the script is strongly advised.
 * @param {object} settings Object with master data in form below.
 * @example const master = {
 IP: '192.168.1.10',
 login: 'nodejs',
 password: 'Balluff#1921'
 }
 * @returns {Promise<string>} Session token or 'couldNotLog' if no success.
 */
const login = (settings) => {
    const token = axios
        .post(`http://${settings.ip}/api/balluff/v1/users/login`, {
            "username": settings.login,
            "password": settings.password
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (res.status === 200) {
                console.log('Logged as admin');
                return res.data.JSESSIONID;
            } else {
                console.warn(`Wrong status code while logging: ${res.status}`);
                return 'couldNotLog';
            }
        })
        .catch(error => {
            console.error(`Could not log as an admin. ${error}`);
            return 'couldNotLog';
        });
    return token;
};

/**
 * Set time of Balluff master.
 * @param {string} ipAddress Master IP address.
 * @param {string} token Session token received from login.
 * @returns {Promise<boolean>} Success or failure.
 */
const setTime = (ipAddress, token) => {
    let time = new Date();
    time.setHours(time.getHours() + 1); //UTC+1
    const timeISO = (time.toISOString());

    const funcState = axios
        .post(`http://${ipAddress}/api/balluff/v1/time`, {
            "time": timeISO
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.status === 204) {
                console.log(`Time is set: ${timeISO}`);
                return true;
            } else {
                console.warn(`Wrong status code while setting time: ${res.status}`);
                return false;
            }
        })
        .catch(error => {
            console.error(`Could not set time. ${error}`);
            return false;
        });
    return funcState;
};

/**
 * Configure port as IO-Link, mode autostart.
 * @param {string} ipAddress Master IP address.
 * @param {number} portNumber Port number [1, 8] (or more).
 * @param {string} token Session token received from login.
 * @returns {Promise<boolean>} Success or failure.
 * @async
 */
const configGivenPortAsIOLink = (ipAddress, portNumber, token) => {
    const funcState = axios
        .post(`http://${ipAddress}/iolink/v1/masters/1/ports/${portNumber}/configuration`, {
            "mode": "IOLINK_AUTOSTART",
            "iqConfiguration": "DIGITAL_INPUT"
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.status === 204) {
                return true;
            } else {
                console.warn(`Wrong status code while configuring ports as IO-Link: ${res.status}`);
                return false;
            }
        })
        .catch(error => {
            console.error(`Could not set port ${portNumber} as IO-Link; ${error}`);
            return false;
        });
    return funcState;
};

/**
 * Send IO-Link process data.
 * @param {string} ipAddress Master IP address.
 * @param {number} deviceAlias Alias of device written in master.
 * @param {Array.<number>} data Process data in form of array of bytes.
 * @param {string} token Session token received from login.
 * @returns {Promise<boolean>} Success or failure.
 */
const sendProcessDataIOLink = async (ipAddress, deviceAlias, data, token) => {
    const funcState = axios
        .post(`http://${ipAddress}/iolink/v1/devices/${deviceAlias}/processdata/value`, {
            "ioLink": {
                "valid": true,
                "value": data
            },
            "iqValue": true
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => {
            if (res.status === 204) {
                return true;
            } else {
                console.warn(`Wrong status code while sending data to: ${deviceAlias}; ${res.status}`);
                return false;
            }
        })
        .catch(error => {
            console.error(error);
            console.error(`Could not send data to  ${deviceAlias}; ${error}`);
            return false;
        });
    return funcState;
};

/**
 * Read IO-Link process data from all ports of Balluff master at the same time.
 * Doesn't work with IOLW master!
 * @param {string} ipAddress Master IP address.
 * @returns {Promise<Array<object> | null>} Array of JSONs with process data for each port; null if request failed.
 */
const readAllPortsProcessData = (ipAddress) => {
    const processData = axios
        .get(`http://${ipAddress}/api/balluff/v1/ports/processdata/value`)
        .then(function (res) {
            if (res.status === 200) {
                const /** @type {Array<object>} */data = res.data;
                if (res.data === undefined)
                    console.error("IO-Link process data value not found (check if port is set).");
                //throw "IO-Link process data value not found (check if port is set).";
                return data;
            } else {
                console.warn(`Wrong status code while reading IO-Link data from all ports: ${res.status}`);
                return null;
            }
        })
        .catch(function (error) {
            console.error(`Could not read data from IO-Link ports. ${error}`);
            return null;
        });
    return processData;
};

/**
 * Read process data from specified port.
 * @param {string} ipAddress Master IP address.
 * @param {number} deviceAlias Alias of device written in master.
 * @returns {Promise<Buffer | null>} Process data as Buffer; null if request failed.
 */
const readProcessData = (ipAddress, deviceAlias) => {
    const processData = axios
        .get(`http://${ipAddress}/iolink/v1/devices/${deviceAlias}/processdata/getdata/value/`)
        .then(function (res) {
            if (res.status === 200) {
                if (res.data.value === undefined)
                    console.error("IO-Link process data value not found (check if port is set).");
                //throw "IO-Link process data value not found (check if port is set).";
                return Buffer.from(res.data.value);
            } else {
                console.warn(`Wrong status code while reading process data from ${deviceAlias}; ${res.status}`);
                return null;
            }
        })
        .catch(function (error) {
            console.error(`Could not read process data from ${deviceAlias}; ${error}`);
            return null;
        });
    return processData;
};

/**
 * Read parameter data from specified port.
 * @param {string} ipAddress Master IP address.
 * @param {string} deviceAlias Alias of device written in master.
 * @param {number} index Index of wanted parameter.
 * @param {number} subindex Subindex of wanted parameter.
 * @returns {Promise<Buffer | null>} Param value as Buffer; null if request failed.
 */
const readParameterData = (ipAddress, deviceAlias, index, subindex) => {
    const parameterData = axios
        .get(`http://${ipAddress}/iolink/v1/devices/${deviceAlias}/parameters/${index}/subindices/${subindex}/value`)
        .then(function (res) {
            if (res.status === 200) {
                if (res.data.value === undefined)
                    console.error("IO-Link process data value not found (check if port is set).");
                //throw "IO-Link parameter data value not found (check if port is set).";
                return Buffer.from(res.data.value);
            } else {
                console.warn(`Wrong status code while reading parameter data from ${deviceAlias}; ${res.status}`);
                return null;
            }
        })
        .catch(function (error) {
            console.error(`Could not read parameter data from ${deviceAlias}; ${error}`);
            return null;
        });
    return parameterData;
};

module.exports = {
    checkComm,
    login,
    setTime,
    configGivenPortAsIOLink,
    sendProcessDataIOLink,
    readAllPortsProcessData,
    readProcessData,
    readParameterData
};