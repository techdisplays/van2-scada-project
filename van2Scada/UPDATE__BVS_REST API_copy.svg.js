function periodic() {
    // periodically triggering code
    console.log("[Imaging.svg.js] Imaging periodic function called");

    // Get the selected index from ComboBox
    var selectedIndex = myscada.getSelectedIndex('Comp17883977');

    if (selectedIndex !== undefined && selectedIndex !== null) {
        console.log("[Imaging.svg.js] Selected index from Comp17883977:", selectedIndex);
        // Check if the selected index has changed
        if (selectedIndex !== lastSelectedIndex) {
            lastSelectedIndex = selectedIndex;

            // Map selectedIndex to inspectionID
            var inspectionID = selectedIndex + 1; // Assuming inspection IDs are 1, 2, 3

            console.log('Updating inspection ID tag to:', inspectionID);

            // Write the new inspection ID to the tag
            var options = {};
            options['name'] = 'bvs01zc';
            options['values'] = {};
            options['values']['inspectionID'] = inspectionID;

            myscada.writeTags(options, (err, result) => {
                if (err) {
                    console.error('Error writing inspectionID tag to mySCADA:', err);
                } else {
                    console.log('inspectionID tag updated successfully:', result);
                }
            });
        }
    } else {
        console.error("[Imaging.svg.js] No index is selected in Comp17883977 or element not found.");
    }
}
