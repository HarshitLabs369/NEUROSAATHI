const STORAGE_KEY = "neurosaathi_reminders";
const SHOWN_KEY = "neurosaathi_shown_reminders";

function getReminders() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function getShownReminders() {
    try {
        return JSON.parse(localStorage.getItem(SHOWN_KEY)) || {};
    } catch (error) {
        return {};
    }
}

function saveShownReminders(data) {
    localStorage.setItem(SHOWN_KEY, JSON.stringify(data));
}

function getTodayKey() {
    const now = new Date();

    return (
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0")
    );
}

function getCurrentMinutes() {
    const now = new Date();

    return now.getHours() * 60 + now.getMinutes();
}

function getReminderMinutes(time) {
    if (!time || !time.includes(":")) {
        return null;
    }

    const parts = time.split(":");

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
    ) {
        return null;
    }

    return hours * 60 + minutes;
}


/* -----------------------------------
   REMINDER VOICE
----------------------------------- */

function speakReminder(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";
    speech.rate = 0.85;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}


/* -----------------------------------
   SHOW REMINDER
----------------------------------- */

function showReminder(reminder) {

    const existing = document.getElementById(
        "neurosaathiReminderPopup"
    );

    if (existing) {
        existing.remove();
    }

    const popup = document.createElement("div");

    popup.id = "neurosaathiReminderPopup";

    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.width = "min(360px, calc(100vw - 40px))";
    popup.style.padding = "20px";
    popup.style.background = "#ffffff";
    popup.style.border = "2px solid #237c70";
    popup.style.borderRadius = "16px";
    popup.style.boxShadow =
        "0 8px 25px rgba(0,0,0,0.18)";
    popup.style.zIndex = "99999";
    popup.style.fontFamily =
        "Arial, sans-serif";

    popup.innerHTML = `
        <div style="
            font-size:14px;
            font-weight:600;
            color:#237c70;
            margin-bottom:6px;
        ">
            NEUROSAATHI REMINDER
        </div>

        <div style="
            font-size:21px;
            font-weight:700;
            color:#17332f;
            margin-bottom:8px;
        ">
            ${reminder.title}
        </div>

        <div style="
            font-size:15px;
            color:#555;
            margin-bottom:15px;
        ">
            ${reminder.type || "Reminder"} • ${reminder.time}
        </div>

        <button id="dismissNeuroReminder" style="
            width:100%;
            padding:11px;
            border:none;
            border-radius:9px;
            background:#237c70;
            color:white;
            font-size:15px;
            font-weight:600;
            cursor:pointer;
        ">
            Dismiss
        </button>
    `;

    document.body.appendChild(popup);

    document
        .getElementById("dismissNeuroReminder")
        .addEventListener("click", function () {

            window.speechSynthesis.cancel();

            popup.remove();
        });

    speakReminder(
        "Reminder. " +
        reminder.title +
        ". " +
        (reminder.type || "Reminder")
    );
}


/* -----------------------------------
   CHECK REMINDERS
----------------------------------- */

function checkReminders() {

    const reminders = getReminders();

    if (!reminders.length) {
        return;
    }

    const today = getTodayKey();
    const currentMinutes = getCurrentMinutes();

    const shown = getShownReminders();

    if (!shown[today]) {
        shown[today] = [];
    }

    for (const reminder of reminders) {

        const reminderMinutes =
            getReminderMinutes(reminder.time);

        if (reminderMinutes === null) {
            continue;
        }

        const alreadyShown =
            shown[today].includes(String(reminder.id));

        /*
         * Trigger when the scheduled time has arrived
         * or has already passed today.
         */
        if (
            reminderMinutes <= currentMinutes &&
            !alreadyShown
        ) {

            shown[today].push(String(reminder.id));

            saveShownReminders(shown);

            showReminder(reminder);

            break;
        }
    }
}


/* -----------------------------------
   START REMINDER SYSTEM
----------------------------------- */

function initializeReminders() {

    checkReminders();

    setInterval(function () {
        checkReminders();
    }, 30000);

    document.addEventListener(
        "visibilitychange",
        function () {

            if (!document.hidden) {
                checkReminders();
            }
        }
    );

    window.addEventListener(
        "focus",
        function () {
            checkReminders();
        }
    );
}


initializeReminders();