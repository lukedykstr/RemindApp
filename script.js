// today's date. will stay the same
var TodaysDate = new Date().toLocaleDateString('en-US');
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

//trying to figure out how to create html objects using javascript
function createNode() {
  var breakLine = document.createElement("br");

  var doc = document.createElement("div");
  doc.setAttribute('class', 'RemindBubble');

  var text = document.createElement("h1");
  text.classList.add("RemindH");
  text.innerHTML = document.getElementById("HEADER").value;
  doc.appendChild(text);

  var bodyText = document.createElement("p");
  bodyText.classList.add("RemindP");
  bodyText.innerHTML = document.getElementById("bodyText").value;
  doc.appendChild(bodyText);

  var dateFormat = document.createElement("time");
  
  // date value from date input is in YYYY-MM-DD form and is one day behind
  // for some reason, idk why
  // this changes it to MM/DD/YYYY and increments it by 1
  var date = new Date(document.getElementById("DATE").value);
  date.setDate(date.getDate() + 1);
  
  dateFormat.innerHTML = date.toLocaleDateString('en-US');
  doc.appendChild(dateFormat);

  doc.appendChild(breakLine);

  var timeFormat = document.createElement("time");
  timeFormat.innerHTML = document.getElementById("TIME").value;
  doc.appendChild(timeFormat);

  document.getElementById("Canvas").append(doc)
  
  // add reminder to list
  createReminder(text.innerHTML, bodyText.innerHTML, dateFormat.innerHTML, timeFormat.innerHTML);
  save();
  //window.setTimeout(CloneNode, 0);
}

function refreshScreen() {
  let get = Array.from(document.getElementsByClassName('RemindBubble'));
  
  get.forEach(element => {
    element.remove();
  });
  
  document.getElementById("DailyView").innerHTML = "Daily View: " + DisplayDate;
  document.getElementById("DisDate").value = new Date(DisplayDate).toISOString().split('T')[0];
  loadReminders(DisplayDate);
}

function incrementDate(dateInput, increment) {
  var dateFormatTotime = new Date(dateInput);
  var increasedDate = new Date(dateFormatTotime.getTime() + (increment * 86400000));
  return increasedDate;
}

function changeDate(amount) {
  DisplayDate = incrementDate(DisplayDate, amount).toLocaleDateString('en-US');
  refreshScreen();
}

function calSubmit(){
  DisplayDate = new Date(incrementDate(document.getElementById("DisDate").value, 1)).toLocaleDateString('en-US');
  refreshScreen();
}

// shows the form. set arg to 'reminder' to show create reminder form
// use 'settings' to show settings
function openForm(mode) {
  if(mode == "reminder") {
    document.getElementById("form-title").innerHTML = "New Reminder";
  } else if(mode == "settings") {
    document.getElementById("form-title").innerHTML = "Settings";
  }

  document.getElementById("myForm").style.display = "block";
  document.getElementById("BackgroundDim").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("BackgroundDim").style.display = "none";
}

//closeForm();

function createReminder(header, body, date, time) {
  reminders.push({
    header: header,
    body: body,
    date: date,
    time: time
  });
}

// load reminders from list given a specific date
// use "all" to just load all
function loadReminders(date) {
  for (var i = 0; i < reminders.length; i++) {
    if (date == "all" || reminders[i].date == date) {
      loadNode(i);
    }
  }
}

// create a single reminder node given index in reminders list
function loadNode(index) {
  var data = reminders[index];
  var breakLine = document.createElement("br");

  var doc = document.createElement("div");
  doc.classList.add("RemindBubble");
  //doc.setAttribute('id', 'remindBubbles');

  var text = document.createElement("h1");
  text.classList.add("RemindH");
  text.innerHTML = data.header;
  doc.appendChild(text);

  var bodyText = document.createElement("p");
  bodyText.classList.add("RemindP");
  bodyText.innerHTML = data.body;
  doc.appendChild(bodyText);

  var dateFormat = document.createElement("time");
  dateFormat.innerHTML = data.date;
  doc.appendChild(dateFormat);

  doc.appendChild(breakLine);

  var timeFormat = document.createElement("time");
  timeFormat.innerHTML = data.time;
  doc.appendChild(timeFormat);

  doc.appendChild(document.createElement("br"));

  var buttonDiv = document.createElement("div");
  buttonDiv.style = "display:inline-block;";

  var editButton = document.createElement("button");
  editButton.innerHTML = "Edit";
  editButton.setAttribute("onclick", "editReminder(" + index + ")");

  var deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  deleteButton.setAttribute("onclick", "deleteReminder(" + index + ")");

  buttonDiv.appendChild(editButton);
  buttonDiv.appendChild(deleteButton);

  doc.appendChild(buttonDiv);

  document.getElementById("Canvas").appendChild(doc);
}

// work in progress. will open form to edit a certain reminder
function editReminder(index) {
  
}

// pops item from reminders list, saves, refreshes
function deleteReminder(index) {
  reminders.pop(index);
  save();
  refreshScreen();
}

// save data from object to JSON file
function save() {
  var remindJSON  = JSON.stringify(reminders);
  var settingJSON = JSON.stringify(settings);
  
  localStorage.setItem("reminders", remindJSON);
  localStorage.setItem("settings", settingJSON);
}

// load data from file input element
function load() {
  reminders = JSON.parse(localStorage.getItem("reminders"));
  settings  = JSON.parse(localStorage.getItem("settings"));

  // if no file exists
  if(reminders == null) {
    // set to default values
    settings = {
      email: "",
      phone: ""
    };

    reminders = [];
  }
}

window.onload = function init() {
  document.getElementById("DailyView").innerHTML = "Daily View: " + TodaysDate;
  document.getElementById("DisDate").value = new Date(TodaysDate).toISOString().split('T')[0];

  document.getElementById("TodaysDate").innerHTML = TodaysDate;

  load();
  refreshScreen();
}