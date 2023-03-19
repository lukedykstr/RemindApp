// today's date. will stay the same
let TodaysDate = new Date();
TodaysDate.setHours(0, 0, 0, 0);
// the date that's currently being viewed. starts as today's date. will change
let DisplayDate = TodaysDate;

// list to hold user settings
let settings = {
  email: "",
  phone: ""
};

// list to hold reminders
// [{header, body, date, time}, {...}, ...]
let reminders = [];

let headerInput = document.getElementById("HEADER");
let bodyInput = document.getElementById("bodyText");
let dateInput = document.getElementById("DATE");
let timeInput = document.getElementById("TIME");

let emailInput = document.getElementById("email");
let phoneInput = document.getElementById("phone");

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
  createReminder(text.innerHTML, bodyText.innerHTML, dateFormat.innerHTML, convertTime(timeFormat.innerHTML));
  save();
  //window.setTimeout(CloneNode, 0);
}

// converts 24hr time to 12hr time
function convertTime(time) {
  var date = new Date();
  var hours;
  var ampm;
  
  time = time.split(":");
  date.setHours(time[0], time[1]);

  if(date.getHours() >= 12) {
    ampm = " PM";
  } else {
    ampm = " AM";
  }
  
  hours = date.getHours() % 12;

  if(hours === 0) {hours = 12;}

  return hours + ":" + time[1] + ampm;
}

function formEnter() {
  if (headerInput.value === "") {
    alert("Header cannot be blank.");
    return 0;
  }

  if (dateInput.value === "") {
    alert("Date cannot be blank.");
    return 0;
  }

  if (timeInput.value === "") {
    alert("Time cannot be blank.");
    return 0;
  }

  var inputDate = incrementDate(dateInput.valueAsDate, 1);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < TodaysDate) {
    alert("Date cannot be in the past.");
    return 0;
  }

  createNode();
  closeForm();
  createDailyView();
}

function dateString(date) {
  return date.toLocaleString("en-US").split(",")[0];
}


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

function incrementDate(dateInput, increment) {
  return new Date(dateInput.getTime() + (86400000 * increment));
}
//module.exports = incrementDate;

function changeDate(amount) {
  DisplayDate =
    incrementDate(DisplayDate, amount);
  createDailyView();
}

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
  const reminder = { body, date, header, time };
  reminders.push(reminder);
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

function downloadData() {
  download(JSON.stringify([reminders, settings]), "reminders.data", "text/plain");
}

function uploadData() {
  var fileInput = document.getElementById("upload");

  if(fileInput.files.length > 0) {
    var reader = new FileReader();

    reader.addEventListener("load", (e) => {
      jsonData = JSON.parse(reader.result);
      
      reminders = jsonData[0];
      settings  = jsonData[1];

      save();
    });
    
    reader.readAsText(fileInput.files[0]);
  }
}

///////////////VIEW CHANGER////////////////
function changeView(which) {
  if (which == 1) {
    document.getElementById("Canvas").style.display = "block";
    document.getElementById("MONTHLYVIEW").style.display = "none";
    createDailyView();
  } else {
    document.getElementById("Canvas").style.display = "none";
    document.getElementById("MONTHLYVIEW").style.display = "grid";
    document.getElementById("MONTHLYVIEW").innerHTML = "";
    createMonthlyView();
  }
}
///////////////////MONTHLY VIEW//////////////////
const calendar = document.querySelector("#MONTHLYVIEW");

function createMonthlyView() {
  var daysOfWeek = ['S', 'M', 'T', 'W', 'TH', 'F', 'SA'];
  for (let numWeekDays = 0; numWeekDays < 7; numWeekDays++) {
    calendar.insertAdjacentHTML("beforeend",
      `<div class="day">
      ${daysOfWeek[numWeekDays]}
    </div>`);
  }
  for (let Empty = 0; Empty < getFirstDayOfMonth(); Empty++) {
    calendar.insertAdjacentHTML("beforeend",
      `<div class="day"></div>`);
  }

  for (let day = 1; day <= getDaysInMonth(); day++) {

    //later for the number of reminders per thing
    const tempDate = DayOfMonth(day);
    var count = 0;
    for (i = 0; i < reminders.length; i += 1) {
      if (tempDate === "all" || reminders[i].date === tempDate) {
        count++;
      }

    }
    // some kind of on hover loadreminders into remindcontainer off hover set remind container to none
    calendar.insertAdjacentHTML("beforeend",
      `<div class="day">
      ${day}
      <div onmouseover="loadReminders(${tempDate}),setDisplayToOn()" onmouseout="setDisplayToOff()" class="DayAmount">${count}</div>
      <div id="RemindContainer"></div>
    </div>`);
  }
}

function log() {
  console.log("hello")

}

function setDisplayToOn() {
  document.getElementById("RemindContainer").style.display = "block";
}

function setDisplayToOff() {
  document.getElementById("RemindContainer").style.display = "none";
}

function getDaysInMonth() {
  const date = new Date(DisplayDate.getTime());
  date.setDate(0);
  return date.getDate();
}

function getFirstDayOfMonth() {
  const date = new Date(DisplayDate.getTime());
  date.setDate(1);
  return date.getDay();
}

function DayOfMonth(current) {
  const date = new Date(DisplayDate.getTime());
  date.setDate(current);
  return date.toLocaleString("en-US").split(",")[0];
}
////////////////////////////////////////////////

window.onload = function init() {
  var date = dateString(DisplayDate);

  document.getElementById("DailyView").innerHTML = "Daily View: " + date;
  document.getElementById("TodaysDate").innerHTML = date;

  load();
  createDailyView();
};


//needs to be commetted out if not testing
//module.exports = {dateString, incrementDate, createReminder};