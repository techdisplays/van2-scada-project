/* global myscada,activeRecipeData,activeRecipeDataRows,activeRecipeRow,activeRecipeIndex,activeRecipeIndexes,activeRecipeFilteredData,activeRecipeFilteredDataRows,activeRecipeFilterHash,activeRecipeFilter1,activeRecipeFilter2,activeRecipeFilter3,activeRecipeFilter4,activeRecipeFilter5,activeRecipeFilter6,activeRecipeFilter7,activeRecipeFilter8,activeRecipeFilter9,restbutton */
function destroy() {
// view hide code
}

function init() {
// initialization code
    myscada.sendObject('REST API');
    myscada.setItems('Comp16935157', "Processing data...");
}

function periodic() {
// periodically triggering code

}

const camIP = `10.10.13.50`;

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

setJSONField = async (request) => {
    const response = await fetch(`http://${camIP}${request}`);
    const jsonData = await response.json();

    data = JSON.stringify(jsonData, null, 2);
    let htmlData = '<style>\n\
                        .string{color:#E63245;}\n\
                        .number{color:green;}\n\
                        .boolean{color:#2D8DAB;}\n\
                        .null{color:magenta;}\n\
                        .key{color:#074763;}\n\
                        </style>';

    htmlData += '<div><pre><code>' + syntaxHighlight(data) + '</code></pre></div>';

    myscada.setItems('Comp16935157', htmlData);
    console.log(jsonData);
};

myscada.getElementById('g0001').onclick = function () {
    setJSONField('/api/balluff/versions');
};
myscada.getElementById('g0002').onclick = function () {
    setJSONField('/api/balluff/v1/identification');
};

myscada.getElementById('g0004').onclick = function () {
    setJSONField('/api/balluff/v1/time');
};

myscada.getElementById('g0005').onclick = function () {
    setJSONField('/api/balluff/v1/vision/status');
};

myscada.getElementById('g0006').onclick = function () {
    setJSONField('/api/balluff/v1/diagnostics');
};

myscada.getElementById('g0007').onclick = function () {
    setJSONField('/api/balluff/v1/vision/inspection/id');
};

myscada.getElementById('g0008').onclick = function () {
    setJSONField('/api/balluff/v1/vision/inspection/data/fromdevice');
};