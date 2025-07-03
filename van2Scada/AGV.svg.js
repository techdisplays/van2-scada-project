/* global myscada,activeRecipeData,activeRecipeDataRows,activeRecipeRow,activeRecipeIndex,activeRecipeIndexes,activeRecipeFilteredData,activeRecipeFilteredDataRows,activeRecipeFilterHash,activeRecipeFilter1,activeRecipeFilter2,activeRecipeFilter3,activeRecipeFilter4,activeRecipeFilter5,activeRecipeFilter6,activeRecipeFilter7,activeRecipeFilter8,activeRecipeFilter9,screenID */

function destroy() {
    // view hide code
}

function init() {
    // initialization code
    myscada.sendObject('BDG0291');
    screenID = 4;
    
    // Auto-scroll code
    const element = myscada.getElementById('Comp48072410');
    if (element) {
        autoScroll(element);
    }
}

function periodic() {
    // periodically triggering code
}

function autoScroll(element) {
    let scrollStep = 1;
    let delay = 50; // delay in milliseconds
    let scrollHeight = element.scrollHeight;

    function scrollContent() {
        if (element.scrollTop < scrollHeight - element.clientHeight) {
            element.scrollTop += scrollStep;
        } else {
            element.scrollTop = 0; // reset to top when reaching the bottom
        }
    }

    setInterval(scrollContent, delay);
}
