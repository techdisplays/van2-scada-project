myscada = require('./myscada');

const getRFIDString = () => {
    //Read tags for tag group iolwPLC
    myscada.readTagsSymbolic("iolwPLC", (err, data) => {
        if (!err) {
            // getting three chunks of data from PLC, creating a buffer from it and comparing to expected data
            const rfid4 = data['rfid4'].value;
            const rfid8 = data['rfid8'].value;
            const rfid12 = data['rfid12'].value;

            let readBuffer = Buffer.alloc(12);
            readBuffer.writeUInt32BE(rfid4, 0);
            readBuffer.writeUInt32BE(rfid8, 4);
            readBuffer.writeUInt32BE(rfid12, 8);
            readBuffer = readBuffer.slice(1); //first byte is changing, don't remember why, just don't mind it

            const buf1 = Buffer.from([0x81, 0x76, 0x00, 0x20, 0x05, 0x11, 0x80, 0xE2, 0x00, 0x00, 0x00]);
            const buf2 = Buffer.from([0xDD, 0x78, 0x00, 0x20, 0x05, 0x11, 0x80, 0xE2, 0x00, 0x00, 0x00]);
            const buf3 = Buffer.from([0x9D, 0x79, 0x00, 0x20, 0x05, 0x11, 0x80, 0xE2, 0x00, 0x00, 0x00]);

            let rfidTag = 0;
            if (readBuffer.equals(buf1))
                rfidTag = 1;
            else if (readBuffer.equals(buf2))
                rfidTag = 2;
            else if (readBuffer.equals(buf3))
                rfidTag = 3;

            //Write tags for tag group iolwScript
            var options = {};
            options['name'] = "iolwScript";
            options['values'] = {};
            options['values']['rfidTag'] = rfidTag;
            myscada.writeTags(options, (err, data) => {
                if (err) {
                    //write error
                }
            });
        }
        ;
    });
};

const positions = {
    one: true,
    two: false,
    three: false
};

const detectPosition = () => {
    //Read tags for tag group iolwPLC
    myscada.readTagsSymbolic("iolwPLC", (err, data) => {
        if (!err) {
            var bes021e = data['bes021e'].value;
            var bos01l8 = data['bos01l8'].value;
            var bmf000j = data['bmf000j'].value;

            if (bes021e && !bos01l8 && !bmf000j) {
                positions.one = true;
                positions.two = false;
                positions.three = false;
            } else if (bos01l8 && !bes021e && !bmf000j) {
                positions.one = false;
                positions.two = true;
                positions.three = false;
            } else if (bmf000j && !bes021e && !bos01l8) {
                positions.one = false;
                positions.two = false;
                positions.three = true;
            }

            //Write tags for tag group iolwScript
            var options = {};
            options['name'] = "iolwScript";
            options['values'] = {};
            options['values']['positionOne'] = positions.one;
            options['values']['positionTwo'] = positions.two;
            options['values']['positionThree'] = positions.three;
            myscada.writeTags(options, (err, data) => {
                if (err) {
                    //write error
                }
            });
        }
    });
};

module.exports = {
    getRFIDString,
    detectPosition
};