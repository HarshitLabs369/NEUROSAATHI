/*
 * NEUROSAATHI
 * CAREGIVER SETTINGS
 *
 * Stores caregiver-controlled preferences
 * for the patient experience.
 *
 * IMPORTANT:
 * These settings are preferences only.
 * They are not medical recommendations.
 */

const NeuroSaathiCaregiverSettings = {

    STORAGE_KEY:
        "neurosaathi_caregiver_settings",


    /*
     * Default settings
     */

    DEFAULTS: {

        patientName:
            "Patient",

        patientAge:
            "",

        relationship:
            "",

        dailyActivityMinutes:
            20,


        /*
         * Activities enabled for the patient
         */

        activities: {

            memoryMatch:
                true,

            sortingMatching:
                true,

            relationshipMatch:
                true,

            guidedYogaFocus:
                true

        },


        /*
         * Guided Yoga & Focus settings
         *
         * These are caregiver-controlled
         * preferences only.
         */

        yoga: {

            /*
             * Selected exercises.
             *
             * Empty array means the Yoga activity
             * can use its normal exercise selection.
             */

            selectedExercises: [],


            /*
             * Kept for compatibility with
             * the earlier version of the project.
             */

            exercise:
                "Breathing",


            /*
             * Duration of each exercise in minutes.
             */

            exerciseDuration:
                5,


            /*
             * Break duration between exercises
             * in minutes.
             */

            breakDuration:
                2

        }

    },


    /*
     * Create a completely independent copy
     * of the default settings.
     */

    getDefaultSettings:
        function() {

            return JSON.parse(
                JSON.stringify(
                    this.DEFAULTS
                )
            );

        },


    /*
     * Validate a numeric duration.
     */

    sanitizeDuration:
        function(
            value,
            minimum,
            maximum,
            fallback
        ) {

            const number =
                Number(value);


            if (
                !Number.isFinite(number)
            ) {

                return fallback;

            }


            return Math.min(
                maximum,
                Math.max(
                    minimum,
                    number
                )
            );

        },


    /*
     * Clean settings before returning them.
     */

    normalizeSettings:
        function(settings) {

            const defaults =
                this.getDefaultSettings();


            const source =
                settings || {};


            const normalized = {

                ...defaults,

                ...source,

                activities: {

                    ...defaults.activities,

                    ...(source.activities || {})

                },

                yoga: {

                    ...defaults.yoga,

                    ...(source.yoga || {})

                }

            };


            /*
             * Patient information
             */

            normalized.patientName =
                String(
                    normalized.patientName || "Patient"
                ).trim();


            normalized.patientAge =
                String(
                    normalized.patientAge || ""
                ).trim();


            normalized.relationship =
                String(
                    normalized.relationship || ""
                ).trim();


            /*
             * Daily activity duration
             */

            normalized.dailyActivityMinutes =
                this.sanitizeDuration(
                    normalized.dailyActivityMinutes,
                    5,
                    180,
                    defaults.dailyActivityMinutes
                );


            /*
             * Activity switches
             */

            normalized.activities.memoryMatch =
                Boolean(
                    normalized.activities.memoryMatch
                );


            normalized.activities.sortingMatching =
                Boolean(
                    normalized.activities.sortingMatching
                );


            normalized.activities.relationshipMatch =
                Boolean(
                    normalized.activities.relationshipMatch
                );


            normalized.activities.guidedYogaFocus =
                Boolean(
                    normalized.activities.guidedYogaFocus
                );


            /*
             * Yoga duration settings
             */

            normalized.yoga.exerciseDuration =
                this.sanitizeDuration(
                    normalized.yoga.exerciseDuration,
                    1,
                    60,
                    defaults.yoga.exerciseDuration
                );


            normalized.yoga.breakDuration =
                this.sanitizeDuration(
                    normalized.yoga.breakDuration,
                    0,
                    30,
                    defaults.yoga.breakDuration
                );


            /*
             * Selected Yoga exercises
             */

            if (
                Array.isArray(
                    normalized.yoga.selectedExercises
                )
            ) {

                normalized.yoga.selectedExercises =
                    normalized.yoga.selectedExercises
                        .map(function(exercise) {

                            return String(
                                exercise
                            ).trim();

                        })
                        .filter(function(exercise) {

                            return exercise.length > 0;

                        });

            }

            else {

                normalized.yoga.selectedExercises = [];

            }


            /*
             * Keep the older exercise field
             * usable for compatibility.
             */

            normalized.yoga.exercise =
                String(
                    normalized.yoga.exercise || "Breathing"
                ).trim();


            return normalized;

        },


    /*
     * Get complete settings.
     */

    getSettings:
        function() {

            try {

                const saved =
                    localStorage.getItem(
                        this.STORAGE_KEY
                    );


                /*
                 * Nothing saved yet.
                 */

                if (!saved) {

                    return this.getDefaultSettings();

                }


                const parsed =
                    JSON.parse(
                        saved
                    );


                return this.normalizeSettings(
                    parsed
                );

            }

            catch (
                error
            ) {

                console.log(
                    "Caregiver settings could not be loaded."
                );


                return this.getDefaultSettings();

            }

        },


    /*
     * Save complete settings.
     */

    saveSettings:
        function(settings) {

            try {

                const normalized =
                    this.normalizeSettings(
                        settings
                    );


                localStorage.setItem(

                    this.STORAGE_KEY,

                    JSON.stringify(
                        normalized
                    )

                );


                console.log(
                    "Caregiver settings saved."
                );


                return true;

            }

            catch (
                error
            ) {

                console.log(
                    "Caregiver settings could not be saved."
                );


                return false;

            }

        },


    /*
     * Update selected settings.
     */

    updateSettings:
        function(updates) {

            const current =
                this.getSettings();


            const incoming =
                updates || {};


            const updated = {

                ...current,

                ...incoming

            };


            /*
             * Merge activity settings
             * instead of replacing them.
             */

            if (
                incoming.activities
            ) {

                updated.activities = {

                    ...current.activities,

                    ...incoming.activities

                };

            }


            /*
             * Merge Yoga settings
             * instead of replacing them.
             */

            if (
                incoming.yoga
            ) {

                updated.yoga = {

                    ...current.yoga,

                    ...incoming.yoga

                };

            }


            return this.saveSettings(
                updated
            );

        },


    /*
     * Update only patient information.
     */

    updatePatient:
        function(patientData) {

            const data =
                patientData || {};


            return this.updateSettings({

                patientName:
                    data.patientName,

                patientAge:
                    data.patientAge,

                relationship:
                    data.relationship

            });

        },


    /*
     * Update activity availability.
     */

    updateActivities:
        function(activitySettings) {

            return this.updateSettings({

                activities:
                    activitySettings || {}

            });

        },


    /*
     * Update Yoga preferences.
     */

    updateYoga:
        function(yogaSettings) {

            return this.updateSettings({

                yoga:
                    yogaSettings || {}

            });

        },


    /*
     * Get whether a particular activity
     * is enabled.
     */

    isActivityEnabled:
        function(activityName) {

            const settings =
                this.getSettings();


            if (
                !settings.activities
            ) {

                return true;

            }


            if (
                Object.prototype.hasOwnProperty.call(
                    settings.activities,
                    activityName
                )
            ) {

                return Boolean(
                    settings.activities[activityName]
                );

            }


            return true;

        },


    /*
     * Get Yoga settings.
     */

    getYogaSettings:
        function() {

            const settings =
                this.getSettings();


            return {

                ...this.getDefaultSettings().yoga,

                ...(settings.yoga || {})

            };

        },


    /*
     * Reset everything.
     */

    resetSettings:
        function() {

            return this.saveSettings(
                this.getDefaultSettings()
            );

        }

};