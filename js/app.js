// =========================================
// NEUROSAATHI — Main JavaScript
// =========================================


// =========================================
// CAREGIVER ACTIVITY SETTINGS
// =========================================

function applyCaregiverActivitySettings() {

    /*
     * If caregiver-settings.js is not available,
     * keep the normal patient home page working.
     */

    if (
        typeof NeuroSaathiCaregiverSettings === "undefined"
    ) {
        return;
    }


    const settings =
        NeuroSaathiCaregiverSettings.getSettings();


    const activitySettings =
        settings.activities || {};


    /*
     * Activity cards in index.html
     *
     * Order:
     * 0 = Memory Match
     * 1 = Sorting & Matching
     * 2 = Relationship Match
     * 3 = Guided Yoga & Focus
     */

    const gameCards =
        document.querySelectorAll(
            ".game-card"
        );


    const enabledActivities = [

        activitySettings.memoryMatch !== false,

        activitySettings.sortingMatching !== false,

        activitySettings.relationshipMatch !== false,

        activitySettings.guidedYogaFocus !== false

    ];


    gameCards.forEach(
        function(card, index) {

            if (
                enabledActivities[index] === false
            ) {

                card.style.display =
                    "none";

            }

            else {

                card.style.display =
                    "";

            }

        }
    );


    /*
     * Update the heading/message if all
     * activities have been disabled.
     */

    const gamesGrid =
        document.querySelector(
            ".games-grid"
        );


    if (
        gamesGrid &&
        !Array.from(gameCards).some(
            function(card) {

                return card.style.display !== "none";

            }
        )
    ) {

        let emptyMessage =
            document.getElementById(
                "noActivitiesMessage"
            );


        if (!emptyMessage) {

            emptyMessage =
                document.createElement(
                    "p"
                );

            emptyMessage.id =
                "noActivitiesMessage";

            emptyMessage.textContent =
                "No activities are currently enabled. Please ask your caregiver to update the activity settings.";

            emptyMessage.style.fontSize =
                "18px";

            emptyMessage.style.padding =
                "20px";

            emptyMessage.style.textAlign =
                "center";

            gamesGrid.appendChild(
                emptyMessage
            );

        }

    }

    else {

        const emptyMessage =
            document.getElementById(
                "noActivitiesMessage"
            );

        if (emptyMessage) {

            emptyMessage.remove();

        }

    }

}


// Apply caregiver settings when the page loads

applyCaregiverActivitySettings();



// =========================================
// MEMORY ANCHOR
// =========================================

const uploadButton =
    document.getElementById(
        "uploadButton"
    );

const memoryUpload =
    document.getElementById(
        "memoryUpload"
    );

const memoryTitle =
    document.getElementById(
        "memoryTitle"
    );

const memoryText =
    document.getElementById(
        "memoryText"
    );


// -----------------------------------------
// Load previously saved Memory Anchor
// -----------------------------------------

function loadMemoryAnchor() {

    const savedImage =
        localStorage.getItem(
            "neurosaathi_memory_image"
        );


    if (!savedImage) {
        return;
    }


    const photoContainer =
        document.querySelector(
            ".memory-photo-container"
        );


    if (!photoContainer) {
        return;
    }


    let memoryImage =
        document.getElementById(
            "memoryImage"
        );


    if (!memoryImage) {

        memoryImage =
            document.createElement(
                "img"
            );


        memoryImage.id =
            "memoryImage";


        memoryImage.alt =
            "Your special memory";


        photoContainer.appendChild(
            memoryImage
        );

    }


    memoryImage.src =
        savedImage;


    // Preserve original image proportions

    memoryImage.style.width =
        "100%";


    memoryImage.style.height =
        "100%";


    memoryImage.style.objectFit =
        "contain";


    // Remove placeholder

    const placeholder =
        photoContainer.querySelector(
            ".memory-placeholder"
        );


    if (placeholder) {

        placeholder.remove();

    }


    // Restore text

    if (memoryTitle) {

        memoryTitle.textContent =
            "Your special memory";

    }


    if (memoryText) {

        memoryText.textContent =
            "This memory will be here whenever you return.";

    }


    // Restore button

    if (uploadButton) {

        uploadButton.textContent =
            "Change Memory";

    }

}



// -----------------------------------------
// Compress and resize image
// -----------------------------------------

function compressMemoryImage(
    file,
    callback
) {

    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            const image =
                new Image();


            image.onload =
                function() {

                    const MAX_WIDTH =
                        1200;

                    const MAX_HEIGHT =
                        1200;


                    let width =
                        image.width;

                    let height =
                        image.height;


                    // Resize while preserving
                    // original aspect ratio

                    if (
                        width > MAX_WIDTH ||
                        height > MAX_HEIGHT
                    ) {

                        const widthRatio =
                            MAX_WIDTH / width;


                        const heightRatio =
                            MAX_HEIGHT / height;


                        const ratio =
                            Math.min(
                                widthRatio,
                                heightRatio
                            );


                        width =
                            Math.round(
                                width * ratio
                            );


                        height =
                            Math.round(
                                height * ratio
                            );

                    }


                    // Create canvas

                    const canvas =
                        document.createElement(
                            "canvas"
                        );


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const context =
                        canvas.getContext(
                            "2d"
                        );


                    if (!context) {

                        alert(
                            "The selected image could not be processed."
                        );

                        return;

                    }


                    context.drawImage(
                        image,
                        0,
                        0,
                        width,
                        height
                    );


                    // Convert to compressed JPEG

                    const compressedImage =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.75
                        );


                    callback(
                        compressedImage
                    );

                };


            image.onerror =
                function() {

                    alert(
                        "The selected image could not be processed."
                    );

                };


            image.src =
                event.target.result;

        };


    reader.onerror =
        function() {

            alert(
                "The image could not be read."
            );

        };


    reader.readAsDataURL(
        file
    );

}



// -----------------------------------------
// Add / Change Memory
// -----------------------------------------

if (
    uploadButton &&
    memoryUpload
) {

    uploadButton.addEventListener(
        "click",
        function() {

            memoryUpload.click();

        }
    );


    // When an image is selected

    memoryUpload.addEventListener(
        "change",
        function() {

            const file =
                memoryUpload.files[0];


            if (!file) {
                return;
            }


            // Check image type

            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please choose an image."
                );


                memoryUpload.value =
                    "";


                return;

            }


            // Compress image before saving

            compressMemoryImage(
                file,
                function(imageURL) {

                    // ---------------------------------
                    // Save compressed image
                    // ---------------------------------

                    try {

                        localStorage.setItem(
                            "neurosaathi_memory_image",
                            imageURL
                        );

                    }

                    catch (error) {

                        alert(
                            "The image could not be saved. Please try a smaller image."
                        );


                        memoryUpload.value =
                            "";


                        return;

                    }


                    // ---------------------------------
                    // Update Memory Anchor text
                    // ---------------------------------

                    if (memoryTitle) {

                        memoryTitle.textContent =
                            "Your special memory";

                    }


                    if (memoryText) {

                        memoryText.textContent =
                            "This memory will be here whenever you return.";

                    }


                    // ---------------------------------
                    // Find photo container
                    // ---------------------------------

                    const photoContainer =
                        document.querySelector(
                            ".memory-photo-container"
                        );


                    if (!photoContainer) {

                        alert(
                            "Memory photo area could not be found."
                        );


                        memoryUpload.value =
                            "";


                        return;

                    }


                    // ---------------------------------
                    // Find existing image
                    // ---------------------------------

                    let memoryImage =
                        document.getElementById(
                            "memoryImage"
                        );


                    // Create image if necessary

                    if (!memoryImage) {

                        memoryImage =
                            document.createElement(
                                "img"
                            );


                        memoryImage.id =
                            "memoryImage";


                        memoryImage.alt =
                            "Your special memory";


                        photoContainer.appendChild(
                            memoryImage
                        );

                    }


                    // Display image

                    memoryImage.src =
                        imageURL;


                    // Preserve aspect ratio

                    memoryImage.style.width =
                        "100%";


                    memoryImage.style.height =
                        "100%";


                    memoryImage.style.objectFit =
                        "contain";


                    // Remove placeholder

                    const placeholder =
                        photoContainer.querySelector(
                            ".memory-placeholder"
                        );


                    if (placeholder) {

                        placeholder.remove();

                    }


                    // Change button text

                    if (uploadButton) {

                        uploadButton.textContent =
                            "Change Memory";

                    }


                    // Allow selecting same file again

                    memoryUpload.value =
                        "";

                }
            );

        }
    );

}



// Load saved Memory Anchor
// when the main page opens

loadMemoryAnchor();



// =========================================
// VOICE — TAP TO LISTEN
// =========================================

const voiceButton =
    document.getElementById(
        "voiceButton"
    );


const helpButton =
    document.getElementById(
        "helpButton"
    );



// -----------------------------------------
// Speak text
// -----------------------------------------

function speakText(text) {

    if (
        !(
            "speechSynthesis"
            in window
        )
    ) {

        alert(
            "Voice support is not available in this browser."
        );


        return;

    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(
            text
        );


    speech.lang =
        "en-IN";


    speech.rate =
        0.85;


    speech.pitch =
        1;


    window.speechSynthesis.speak(
        speech
    );

}



// -----------------------------------------
// Main Listen button
// -----------------------------------------

if (voiceButton) {

    voiceButton.addEventListener(
        "click",
        function() {

            speakText(
                "Welcome to NeuroSaathi. " +
                "Your cognitive companion. " +
                "You can choose an activity, " +
                "add a special memory, " +
                "or listen to instructions."
            );

        }
    );

}



// -----------------------------------------
// Activities Listen button
// -----------------------------------------

if (helpButton) {

    helpButton.addEventListener(
        "click",
        function() {

            speakText(
                "Choose an activity. " +
                "Memory Match helps you find matching pairs. " +
                "Sorting and Matching helps you organize everyday objects. " +
                "Relationship Match helps you match people with their relationships. " +
                "Guided Yoga and Focus is a gentle activity to support attention and relaxation."
            );

        }
    );

}



// =========================================
// START TODAY'S ACTIVITY
// =========================================

const startButton =
    document.getElementById(
        "startButton"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        function() {

            const gamesSection =
                document.querySelector(
                    ".games-section"
                );


            if (gamesSection) {

                gamesSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}



// =========================================
// GAME BUTTONS
// =========================================

const gameButtons =
    document.querySelectorAll(
        ".game-button"
    );


// Actual game locations

const gameLinks = [

    "games/memory-match.html",

    "games/sorting-matching.html",

    "games/relationship-match.html",

    "games/guided-yoga-focus.html"

];



gameButtons.forEach(
    function(button, index) {

        button.addEventListener(
            "click",
            function() {

                /*
                 * Safety check:
                 *
                 * Do not allow navigation to an
                 * activity that the caregiver has
                 * disabled.
                 */

                if (
                    typeof NeuroSaathiCaregiverSettings !==
                    "undefined"
                ) {

                    const activityKeys = [

                        "memoryMatch",

                        "sortingMatching",

                        "relationshipMatch",

                        "guidedYogaFocus"

                    ];


                    const key =
                        activityKeys[index];


                    if (
                        key &&
                        !NeuroSaathiCaregiverSettings
                            .isActivityEnabled(
                                key
                            )
                    ) {

                        return;

                    }

                }


                if (
                    gameLinks[index]
                ) {

                    window.location.href =
                        gameLinks[index];

                }

            }
        );

    }
);



// =========================================
// END OF MAIN JAVASCRIPT
// =========================================
// =========================================
// =========================================
// CAREGIVER ACCESS
// =========================================

const caregiverAccessButton =
    document.getElementById(
        "caregiverAccessButton"
    );


const DEFAULT_CAREGIVER_PIN =
    "2468";


const CAREGIVER_PIN_KEY =
    "neurosaathi_caregiver_pin";


// -----------------------------------------
// Get saved caregiver PIN
// -----------------------------------------

function getCaregiverPIN() {

    const savedPIN =
        localStorage.getItem(
            CAREGIVER_PIN_KEY
        );


    if (
        savedPIN &&
        /^\d{4}$/.test(savedPIN)
    ) {

        return savedPIN;

    }


    // First-time default PIN

    localStorage.setItem(
        CAREGIVER_PIN_KEY,
        DEFAULT_CAREGIVER_PIN
    );


    return DEFAULT_CAREGIVER_PIN;

}



// -----------------------------------------
// Caregiver Access
// -----------------------------------------

if (caregiverAccessButton) {

    caregiverAccessButton.addEventListener(
        "click",
        function() {

            const enteredPin =
                window.prompt(
                    "Enter caregiver PIN:"
                );


            if (enteredPin === null) {
                return;
            }


            const savedPIN =
                getCaregiverPIN();


            if (
                enteredPin === savedPIN
            ) {

                window.location.href =
                    "games/caregiver-dashboard.html";

            }

            else {

                window.alert(
                    "Incorrect caregiver PIN."
                );

            }

        }
    );

}

// =========================================
// TODAY'S ACTIVITY PROGRESS
// =========================================

function updateDailyProgress() {

    const progressFill =
        document.getElementById(
            "dailyProgressFill"
        );

    const progressText =
        document.getElementById(
            "dailyProgressText"
        );


    if (
        !progressFill ||
        !progressText
    ) {
        return;
    }


    // Start from zero every time

    progressFill.style.width =
        "0%";


    /*
     * These are the exact game names
     * used by performance.js and the
     * four activity files.
     */

    const activityNames = [

        "Memory Match",

        "sorting-matching",

        "relationship-match",

        "guided-yoga-focus"

    ];


    let enabledActivities =
        activityNames.slice();


    /*
     * Respect caregiver settings.
     */

    if (
        typeof NeuroSaathiCaregiverSettings !==
        "undefined"
    ) {

        const settings =
            NeuroSaathiCaregiverSettings
                .getSettings();


        const activities =
            settings.activities || {};


        enabledActivities = [];


        if (
            activities.memoryMatch !== false
        ) {

            enabledActivities.push(
                "Memory Match"
            );

        }


        if (
            activities.sortingMatching !== false
        ) {

            enabledActivities.push(
                "sorting-matching"
            );

        }


        if (
            activities.relationshipMatch !== false
        ) {

            enabledActivities.push(
                "relationship-match"
            );

        }


        if (
            activities.guidedYogaFocus !== false
        ) {

            enabledActivities.push(
                "guided-yoga-focus"
            );

        }

    }


    const totalActivities =
        enabledActivities.length;


    if (totalActivities === 0) {

        progressText.textContent =
            "No activities are currently enabled.";

        return;

    }


    let completedActivities = 0;


    /*
     * Read existing performance data.
     */

    if (
        typeof NeuroSaathiPerformance !==
        "undefined"
    ) {

        const allData =
            NeuroSaathiPerformance
                .getAllData();


        /*
         * Use the user's local date instead
         * of UTC date.
         */

        const today =
            new Date();


        const todayYear =
            today.getFullYear();


        const todayMonth =
            today.getMonth();


        const todayDay =
            today.getDate();


        enabledActivities.forEach(
            function(activityName) {

                const completedToday =
                    allData.some(
                        function(session) {

                            if (
                                session.game !==
                                activityName
                            ) {

                                return false;

                            }


                            if (
                                session.completed !==
                                true
                            ) {

                                return false;

                            }


                            if (
                                !session.timestamp
                            ) {

                                return false;

                            }


                            const sessionDate =
                                new Date(
                                    session.timestamp
                                );


                            return (
                                sessionDate
                                    .getFullYear() ===
                                todayYear &&

                                sessionDate
                                    .getMonth() ===
                                todayMonth &&

                                sessionDate
                                    .getDate() ===
                                todayDay
                            );

                        }
                    );


                if (completedToday) {

                    completedActivities++;

                }

            }
        );

    }


    const percentage =
        Math.round(
            (
                completedActivities /
                totalActivities
            ) * 100
        );


    progressFill.style.width =
        percentage + "%";


    progressText.textContent =
        completedActivities +
        " of " +
        totalActivities +
        " activities completed today.";

}


// Update progress when home page loads

updateDailyProgress();