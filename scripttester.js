/*global createView,alert,changeView,jsonData,download*/
// today's date. will stay the same

var TodaysDate = new Date();
TodaysDate.setHours(0, 0, 0, 0);
// the date that's currently being viewed. starts as today's date. will change
var DisplayDate = new Date(TodaysDate);

// list to hold user settings
var settings = {
  email: "",
  notifs: "ontime"
};

// list to hold reminders
// [{header, body, date, time}, {...}, ...]
var reminders = [];

var headerInput = document.getElementById("HEADER");
var bodyInput = document.getElementById("bodyText");
var dateInput = document.getElementById("DATE");
var timeInput = document.getElementById("TIME");
var emailInput = document.getElementById("email");
var repeatInput = document.getElementById("repeat-amount");

var repeatMode = "never";
var repeatAmount = 0;

// no longer creates HTML elements. just adds reminder to list
// then calls createView() to refresh screen
function createNode() {
  var i = 0;
  var date = new Date(dateInput.value);
  repeatAmount = repeatInput.value;
  // date value from date input is in YYYY-MM-DD form and is one day behind
  // for some reason, idk why
  // this changes it to MM/DD/YYYY and increments it by 1
  // add reminder to list
  createReminder(headerInput.value, bodyInput.value, dateString(date), convertTime(timeInput.value));
  
  if (repeatMode !== "never") {
    for (i = 0; i < repeatAmount; i += 1) {
      if (repeatMode === "daily") {
        date.setDate(date.getDate() + 1);
      } else {
        date.setDate(date.getDate() + 7);
      }

      if (!reminderExists(headerInput.value, dateString(date), convertTime(timeInput.value))) {
        createReminder(headerInput.value, bodyInput.value, dateString(date), convertTime(timeInput.value));
      }
    }
  }

  save();
}

// converts 24hr time to 12hr time
function convertTime(time) {
  var date = new Date();
  var hours;
  var ampm;

  time = time.split(":");
  date.setHours(time[0], time[1]);

  if (date.getHours() >= 12) {
    ampm = " PM";
  } else {
    ampm = " AM";
  }

  hours = date.getHours() % 12;

  if (hours === 0) { hours = 12; }

  if (parseInt(time[1], 10) < 10 && time[1].length === 1) {
    time[1] = "0" + time[1];
  }

  return hours + ":" + time[1] + ampm;
}

// create date object from date string and 12hr time string
function createDate(dateString, timeString) {
  var time = timeString.split(/[\s\:]+/);
  var date = new Date(dateString);
  var hour = parseInt(time[0], 10);
  var minute = parseInt(time[1], 10);

  if (time[2] === "PM") {
    if (hour < 12) {
      hour += 12;
    } else {
      hour += 1;
    }
  } else if (hour === 12) {
    hour = 0;
  }

  date.setHours(hour, minute, 0, 0);
  return date;
}

// runs when enter is clicked in Create Reminder form
function formEnter() {
  var inputDate;
  if (headerInput.value === "") {
    alert("Header cannot be blank.");
    return -1;
  }

  if (dateInput.value === "") {
    alert("Date cannot be blank.");
    return -1;
  }

  if (timeInput.value === "") {
    alert("Time cannot be blank.");
    return -1;
  }

  inputDate = incrementDate(dateInput.valueAsDate, 1);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < TodaysDate) {
    alert("Date cannot be in the past.");
    return -1;
  }

  if (reminderExists(headerInput.value, dateString(inputDate), convertTime(timeInput.value))) {
    alert("Cannot make a reminder with same header, date, and time as another.");
    return -1;
  }

  createNode();
  
  return 0;
}

// check if reminder exists given a header, date, and time
function reminderExists(header, date, time) {
  var i = 0;
  for (i = 0; i < reminders.length; i += 1) {
    var temp = reminders[i];

    if (header === temp.header && date === temp.date && time === temp.time) {
      return true;
    }
  }

  return false;
}

// what the repeat never/daily/weekly/monthly radio buttons do on change
function setRepeat(value) {
  var type = document.getElementById("repeat-type");

  repeatMode = value;
  repeatAmount = document.getElementById("repeat-amount").value;

  if (document.getElementById(value).checked) {
    document.getElementById("repeat-label").style.visibility = "visible";

    if (value === "daily") {
      type.innerHTML = "day(s)";
    } else if (value === "weekly") {
      type.innerHTML = "week(s)";
    } else if (value === "monthly") {
      type.innerHTML = "month(s)";
    } else {
      document.getElementById("repeat-label").style.visibility = "hidden";
    }
  }
}

// returns MM/DD/YYYY string given date object
function dateString(date) {
  return date.toLocaleString("en-US").split(",")[0];
}

// increment date object by days
function incrementDate(dateInput, increment) {
  return new Date(dateInput.getTime() + (86400000 * increment));
}
//module.exports = incrementDate;

// changes the display date and updates daily view
function changeDate(amount) {
  DisplayDate =
    incrementDate(DisplayDate, amount);
  
}

// sets display date to calendar input value and updates daily view
function calSubmit() {
  DisplayDate = new Date(document.getElementById("DisDate").value + "T00:00:00");
  
}

// shows the form. set arg to 'reminder' to show create reminder form
// use 'edit' to show edit reminder form
function openForm(mode) {
  if (mode === "reminder") {
    document.getElementById("enter").setAttribute("onclick", "formEnter()");
    document.getElementById("form-title").innerHTML = "New Reminder";
  } else if (mode === "edit") {
    document.getElementById("form-title").innerHTML = "Edit Reminder";
  }

  document.getElementById("myForm").style.display = "block";
  document.getElementById("BackgroundDim").style.display = "block";
}

// closes Create Reminder form
function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("BackgroundDim").style.display = "none";
}

// opens settings form
function openSettings() {
  emailInput.value = settings.email;

  switch (settings.notifs) {
    case "dont":
      document.getElementById("notif-dont").checked = true; break;
    case "ontime":
      document.getElementById("notif-ontime").checked = true; break;
    case "10min":
      document.getElementById("notif-10min").checked = true; break;
    case "30min":
      document.getElementById("notif-30min").checked = true; break;
  }

  document.getElementById("settingsForm").style.display = "block";
  document.getElementById("BackgroundDim").style.display = "block";
}

// closes settings form
function closeSettings() {
  document.getElementById("settingsForm").style.display = "none";
  document.getElementById("BackgroundDim").style.display = "none";
}

// runs when enter is clicked in settings
function settingsEnter() {
  var i = 0;
  var radio = document.getElementsByName("email-notif");
  settings.email = emailInput.value;

  for (i = 0; i < radio.length; i += 1) {
    if (radio[i].checked) {
      settings.notifs = radio[i].value;
    }
  }

  save();
  closeSettings();
}

// adds reminder to list
function createReminder(header, body, date, time) {
  const reminder = { body, date, header, time, notified: false };
  var otherDate;
  var thisDate = createDate(date, time);
  var match = false;
  var i = 0;

  // sort reminder into list based on date / time
  // this will make them show in order
  for (i = 0; i < reminders.length; i += 1) {
    otherDate = createDate(reminders[i].date, reminders[i].time);
    if (thisDate <= otherDate) {
      reminders.splice(i, 0, reminder);
      match = true;
      break;
    }
  }

  if (!match) {
    reminders.push(reminder);
  }

  return reminder;
}

// opens form to edit reminder information at a certain index in reminders list
function editReminder(index) {
  headerInput.value = reminders[index].header;
  bodyInput.value = reminders[index].body;
  dateInput.valueAsDate = new Date(reminders[index].date);
  timeInput.value = reminders[index].time;

  document.getElementById("enter").setAttribute("onclick", "deleteOnEnter(" + index + ")");
  openForm("edit");
}

// use in place of formEnter() when editing reminders
// deletes old reminder if new data is OK
function deleteOnEnter(index) {
  if (formEnter() !== -1) { deleteReminder(index); }
}

// deletes item from reminders list, saves, refreshes daily view
function deleteReminder(index) {
  reminders.splice(index, 1);
  save();
  
}

// save data from object to JSON file
function save() {
  var remindJSON = JSON.stringify(reminders);
  var settingJSON = JSON.stringify(settings);

  localStorage.setItem("reminders", remindJSON);
  localStorage.setItem("settings", settingJSON);
}

// load data from localStorage
function load() {
  if (localStorage.getItem("settings") !== null) {
    const remindersString = localStorage.getItem("reminders");
    if (remindersString !== null && remindersString !== undefined) {
      reminders = JSON.parse(remindersString);
    }
    const settingsJSON = localStorage.getItem("settings");
    if (settingsJSON !== null && settingsJSON !== undefined) {
      const parsedSettings = JSON.parse(settingsJSON);
      settings.email = parsedSettings.email !== null ? parsedSettings.email : settings.email;
      settings.notifs = parsedSettings.notifs !== null ? parsedSettings.notifs : settings.notifs;
    }
  }
}

// downloads user data to user's device
function downloadData() {
  download(JSON.stringify([reminders, settings]), "reminders.data", "text/plain");
}

// uploads user data from file input in settings
function uploadData() {
  var fileInput = document.getElementById("upload");
  var reader;
  if (fileInput.files.length > 0) {
    reader = new FileReader();

    reader.addEventListener("load", (e) => {
      jsonData = JSON.parse(reader.result);

      if (Array.isArray(jsonData) && jsonData.length == 2) {
        reminders = jsonData[0];
        settings = jsonData[1];

        save();
        location.reload();
      } else {
        alert("File contains incorrect data. It may have changed or is the wrong file type.");
      }
    });

    reader.readAsText(fileInput.files[0]);
  }
}

///////////////////MONTHLY VIEW//////////////////

////////////////////////////////////////////////

window.onload = function init() {
  //localStorage.clear();
  var date = dateString(DisplayDate);

  document.getElementById("DailyView").innerHTML = "Daily View: " + date;
  document.getElementById("TodaysDate").innerHTML = date;

  changeView(1);
  load();
  
};


//needs to be commetted out if not testing
module.exports = { reminders,createNode,convertTime,createDate,formEnter,reminderExists,setRepeat,dateString,incrementDate,changeDate,calSubmit,openForm,closeForm,openSettings,closeSettings,settingsEnter,createReminder,editReminder,deleteOnEnter,deleteReminder,save,load,downloadData,uploadData,headerInput,bodyInput,dateInput,timeInput,emailInput,repeatAmount,repeatInput,repeatMode};