// today's date. will stay the same
var TodaysDate = new Date();
// the date that's currently being viewed. starts as today's date. will change
var DisplayDate = TodaysDate;

// list to hold user settings
var settings = {
  email: "",
  phone: ""
};

// list to hold reminders
// [{header, body, date, time}, {...}, ...]
var reminders = [];

var headerInput = document.getElementById("HEADER");
var bodyInput = document.getElementById("bodyText");
var dateInput = document.getElementById("DATE");
var timeInput = document.getElementById("TIME");

var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");

//trying to figure out how to create html objects using javascript
function createNode() {
  var breakLine = document.createElement("br");
  var doc = document.createElement("div");
  var text = document.createElement("h1");
  var bodyText = document.createElement("p");
  var dateFormat = document.createElement("time");
  var date = new Date(document.getElementById("DATE").value);
  var timeFormat = document.createElement("time");
  doc.setAttribute("class", "RemindBubble");


  text.classList.add("RemindH");
  text.innerHTML = document.getElementById("HEADER").value;
  doc.appendChild(text);

  bodyText.classList.add("RemindP");
  bodyText.innerHTML = document.getElementById("bodyText").value;
  doc.appendChild(bodyText);


  // date value from date input is in YYYY-MM-DD form and is one day behind
  // for some reason, idk why
  // this changes it to MM/DD/YYYY and increments it by 1
  date.setDate(date.getDate() + 1);
  dateFormat.innerHTML = date.toLocaleDateString("en-US");
  doc.appendChild(dateFormat);

  doc.appendChild(breakLine);
  timeFormat.innerHTML = document.getElementById("TIME").value;
  doc.appendChild(timeFormat);
  document.getElementById("Canvas").append(doc);

  // add reminder to list
  createReminder(text.innerHTML, bodyText.innerHTML, dateFormat.innerHTML, timeFormat.innerHTML);
  save();
  //window.setTimeout(CloneNode, 0);
}

function formEnter() {
  if(headerInput.value == "") {
    alert("Header cannot be blank.");
    return 0;
  }

  if(dateInput.value == "") {
    alert("Date cannot be blank.");
    return 0;
  }

  if(timeInput.value == "") {
    alert("Time cannot be blank.");
    return 0;
  }

  TodaysDate = new Date();

  if(new Date(dateInput.value).getTime() + 86400000 < TodaysDate.getTime()) {
    alert("Date cannot be in the past.");
    return 0;
  }
  
  createNode();
  closeForm();
  refreshScreen();
}

function dateString(date) {
  return date.toLocaleString("en-US").split(",")[0];
}

function refreshScreen() {
  var date = dateString(DisplayDate);
  var get = Array.from(document.getElementsByClassName("RemindBubble"));

  get.forEach(function(element) {
    element.remove();
  });

  document.getElementById("DailyView").innerHTML = "Daily View: " + date;
  document.getElementById("DisDate").valueAsDate = DisplayDate;
  loadReminders(date);
}

function incrementDate(dateInput, increment) {
  return new Date(dateInput.getTime() + (86400000 * increment));
}

function changeDate(amount) {
  DisplayDate =
    incrementDate(DisplayDate, amount);
  refreshScreen();
}

function calSubmit() {
  DisplayDate = new Date(document.getElementById("DisDate").value + "T00:00:00");
  refreshScreen();
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

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("BackgroundDim").style.display = "none";
}

function openSettings() {
  emailInput.value = settings.email;
  phoneInput.value = settings.phone;
  
  document.getElementById("settingsForm").style.display = "block";
  document.getElementById("BackgroundDim").style.display = "block";
}

function closeSettings() {
  document.getElementById("settingsForm").style.display = "none";
  document.getElementById("BackgroundDim").style.display = "none";
}

function settingsEnter() {
  settings.email = emailInput.value;
  settings.phone = phoneInput.value;
  
  save();
  closeSettings();
}

//closeForm();

function createReminder(header, body, date, time) {
  reminders.push({ body, date, header, time });
  /*
  reminders.push({
    header: header,
    body: body,
    date: date,
    time: time
  });
  */
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


  text.classList.add("RemindH");
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

  doc.appendChild(buttonDiv);

  document.getElementById("RemindContainer").appendChild(doc);
}

// opens form to edit reminder information at a certain index in reminders list
function editReminder(index) {
  headerInput.value = reminders[index].header;
  bodyInput.value = reminders[index].body;
  dateInput.valueAsDate = new Date(reminders[index].date);
  timeInput.value = reminders[index].time;

  document.getElementById("enter").setAttribute("onclick", "deleteReminder(" + index + "); formEnter();");
  openForm("edit");
}

// pops item from reminders list, saves, refreshes
function deleteReminder(index) {
  reminders.pop(index);
  save();
  refreshScreen();
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

window.onload = function init() {
  var date = dateString(TodaysDate);
  
  document.getElementById("DailyView").innerHTML = "Daily View: " + date;
  document.getElementById("DisDate").valueAsDate = TodaysDate;
  document.getElementById("TodaysDate").innerHTML = date;

  load();
  refreshScreen();
};