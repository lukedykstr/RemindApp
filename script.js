// today's date. will stay the same
let TodaysDate = new Date();
TodaysDate.setHours(0, 0, 0, 0);
// the date that's currently being viewed. starts as today's date. will change
let DisplayDate = TodaysDate;

// list to hold user settings
let settings = {
  email: ""
};

// list to hold reminders
// [{header, body, date, time}, {...}, ...]
let reminders = [];

let headerInput = document.getElementById("HEADER");
let bodyInput = document.getElementById("bodyText");
let dateInput = document.getElementById("DATE");
let timeInput = document.getElementById("TIME");
let emailInput = document.getElementById("email");

let repeatInput = "never";
let repeatAmount = 0;

// no longer creates HTML elements. just adds reminder to list
// then calls createDailyView() to refresh screen
function createNode() {
  var date = new Date(document.getElementById("DATE").value);
  // date value from date input is in YYYY-MM-DD form and is one day behind
  // for some reason, idk why
  // this changes it to MM/DD/YYYY and increments it by 1
  date.setDate(date.getDate() + 1);
  // add reminder to list
  createReminder(headerInput.value, bodyInput.value, dateString(date), convertTime(timeInput.value));

  if(repeatInput !== "never") {
    for(var i=0;i<repeatAmount;i++) {
      if(repeatInput == "daily") {
        date.setDate(date.getDate() + 1);
      } else {
        date.setDate(date.getDate() + 7);
      }

      if(!reminderExists(headerInput.value, dateString(date), convertTime(timeInput.value))) {
        createReminder(headerInput.value, bodyInput.value, dateString(date), convertTime(timeInput.value));
      }
    }
  }
  
  save();
  createDailyView();
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

  if(parseInt(time[1], 10) < 10 && time[1].length == 1) {
    time[1] = "0" + time[1];
  }

  return hours + ":" + time[1] + ampm;
}

// create date object from date string and 12hr time string
function createDate(dateString, timeString) {
  var time = timeString.split(/[\s\:]+/);
  console.log(time);
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

  var inputDate = incrementDate(dateInput.valueAsDate, 1);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < TodaysDate) {
    alert("Date cannot be in the past.");
    return -1;
  }

  if(reminderExists(headerInput.value, dateString(inputDate), convertTime(timeInput.value))) {
    alert("Cannot make a reminder with same header, date, and time as another.");
      return -1;
  }

  createNode();
  closeForm();
  createDailyView();
  return 0;
}

// check if reminder exists given a header, date, and time
function reminderExists(header, date, time) {
  for (var i = 0; i < reminders.length; i++) {
    var temp = reminders[i];

    if (header == temp.header && date == temp.date && time == temp.time) {
      return true;
    }
  }

  return false;
}

// what the repeat never/daily/weekly/monthly radio buttons do on change
function setRepeat(value) {
  var type = document.getElementById("repeat-type");
  
  repeatInput = value;
  repeatAmount = document.getElementById("repeat-amount").value;
  
  if(document.getElementById(value).checked) {
    document.getElementById("repeat-label").style.visibility = "visible";
    
    if(value === "daily") {
      type.innerHTML = "day(s)";
    } else if(value === "weekly") {
      type.innerHTML = "week(s)";
    } else if(value === "monthly") {
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

// creates daily view based on DisplayDate
function createDailyView() {
  var date = dateString(DisplayDate);
  var get = Array.from(document.getElementsByClassName("RemindBubble"));

  get.forEach(function(element) {
    element.remove();
  });

  DisplayDate.setHours(0, 0, 0, 0);

  document.getElementById("DailyView").innerHTML = "Daily View: " + date;
  document.getElementById("DisDate").valueAsDate = DisplayDate;
  loadReminders(date);
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
  createDailyView();
}

// sets display date to calendar input value and updates daily view
function calSubmit() {
  DisplayDate = new Date(document.getElementById("DisDate").value + "T00:00:00");
  createDailyView();
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
  settings.email = emailInput.value;

  save();
  closeSettings();
}

// adds reminder to list
function createReminder(header, body, date, time) {
  const reminder = { body, date, header, time, notified: false };

  var thisDate = createDate(date, time);
  var match = false;

  // sort reminder into list based on date / time
  // this will make them show in order
  for (var i = 0; i < reminders.length; i++) {
    var otherDate = createDate(reminders[i].date, reminders[i].time);
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

// load reminders from list given a specific date
// use "all" to just load all
function loadReminders(date) {
  var i = 0;
  for (i = 0; i < reminders.length; i += 1) {
    if (date === "all" || reminders[i].date === date) {
      loadNode(i);
    }
  }
}

// create a single reminder node given index in reminders list
function loadNode(index) {
  var data = reminders[index];
  var breakLine = document.createElement("br");
  var doc = document.createElement("div");
  var text = document.createElement("h1");
  var bodyText = document.createElement("p");
  var dateFormat = document.createElement("time");
  var timeFormat = document.createElement("time");
  var buttonDiv = document.createElement("div");
  var editButton = document.createElement("button");
  var deleteButton = document.createElement("button");
  doc.classList.add("RemindBubble");
  //doc.setAttribute('id', 'remindBubbles');
  var dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");
  var dropdownButton = document.createElement("div");
  dropdownButton.classList.add("dropdown-button");

  var dot = document.createElement("div");
  dot.classList.add("dot");
  var dot2 = document.createElement("div");
  dot2.classList.add("dot");
  var dot3 = document.createElement("div");
  dot3.classList.add("dot");
  var dropdownContent = document.createElement("div");
  dropdownContent.classList.add("dropdown-content");

  text.innerHTML = data.header;
  doc.appendChild(text);

  bodyText.classList.add("RemindP");
  bodyText.innerHTML = data.body;
  doc.appendChild(bodyText);

  dateFormat.innerHTML = data.date;
  doc.appendChild(dateFormat);

  doc.appendChild(breakLine);

  timeFormat.innerHTML = data.time;
  doc.appendChild(timeFormat);

  doc.appendChild(document.createElement("br"));

  buttonDiv.style = "display:inline-block;";

  editButton.innerHTML = "Edit";
  editButton.setAttribute("onclick", "editReminder(" + index + ")");

  deleteButton.innerHTML = "Delete";
  deleteButton.setAttribute("onclick", "deleteReminder(" + index + ")");


  buttonDiv.appendChild(editButton);
  buttonDiv.appendChild(deleteButton);


  dropdownButton.appendChild(dot);
  dropdownButton.appendChild(dot2);
  dropdownButton.appendChild(dot3);
  dropdown.appendChild(dropdownButton);
  dropdownContent.appendChild(buttonDiv);
  dropdown.appendChild(dropdownContent);
  doc.appendChild(dropdown);

  document.getElementById("RemindContainer").appendChild(doc);
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
  if (formEnter() != -1) { deleteReminder(index); }
}

// deletes item from reminders list, saves, refreshes daily view
function deleteReminder(index) {
  reminders.splice(index, 1);
  save();
  createDailyView();
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
  reminders = JSON.parse(localStorage.getItem("reminders"));
  settings = JSON.parse(localStorage.getItem("settings"));

  // if no file exists
  if (reminders === null) {
    // set to default values
    settings = {
      email: "",
      phone: ""
    };

    reminders = [];
  }
}

// downloads user data to user's device
function downloadData() {
  download(JSON.stringify([reminders, settings]), "reminders.data", "text/plain");
}

// uploads user data from file input in settings
function uploadData() {
  var fileInput = document.getElementById("upload");

  if (fileInput.files.length > 0) {
    var reader = new FileReader();

    reader.addEventListener("load", (e) => {
      jsonData = JSON.parse(reader.result);

      reminders = jsonData[0];
      settings = jsonData[1];

      save();
      location.reload();
    });

    reader.readAsText(fileInput.files[0]);
  }
}

///////////////VIEW CHANGER////////////////
function changeView(which) {
  if (which == 1) {
    document.getElementById("Canvas").style.display = "block";
    document.getElementById("MONTHLYVIEW").style.display = "none";
    document.getElementById("MonthlyCanvas").style.display = "none";
    createDailyView();
  } else {
    document.getElementById("Canvas").style.display = "none";
    document.getElementById("MonthlyCanvas").style.display = "block";
    document.getElementById("MONTHLYVIEW").style.display = "grid";
    document.getElementById("MONTHLYVIEW").innerHTML = "";
    createMonthlyView();
  }
}
///////////////////MONTHLY VIEW//////////////////

////////////////////////////////////////////////

window.onload = function init() {
  var date = dateString(DisplayDate);

  document.getElementById("DailyView").innerHTML = "Daily View: " + date;
  document.getElementById("TodaysDate").innerHTML = date;
  changeView(1);
  load();
  createDailyView();
};


//needs to be commetted out if not testing
//module.exports = {dateString, incrementDate, createReminder};