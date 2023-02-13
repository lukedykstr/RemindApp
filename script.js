// list to hold user settings
var settings = {
  email: "user@gmail.com",
  phone: "6167778888"
}

// create list to hold reminders
var reminders = [
  {
    header: "Test Reminder",
    body: "this is a test.",
    date: "2/8/2023",
    time: "12:00:00PM"
  },
  {
    header: "Reminder 2",
    body: "another reminder",
    date: "2/9/2023",
    time: "1:30:00AM"
  }
]

// load reminders with date 3/4/2023
//loadReminders("3/4/2023");

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
  dateFormat.innerHTML = document.getElementById("DATE").value;
  doc.appendChild(dateFormat);

  doc.appendChild(breakLine);

  var timeFormat = document.createElement("time");
  timeFormat.innerHTML = document.getElementById("TIME").value;
  doc.appendChild(timeFormat);

  document.getElementById("Canvas").append(doc)

  // add reminder to list
  createReminder(text.innerHTML, bodyText.innerHTML, dateFormat.innerHTML, timeFormat.innerHTML);
  clearScreen();
  //window.setTimeout(CloneNode, 0);
}


var DisplayDate = new Date();

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
  DisplayDate = new Date(incrementDate(document.getElementById("DisDate").value,1)).toLocaleDateString('en-US');
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
      loadNode(reminders[i]);
    }
  }
}

// create a single reminder node given object data
function loadNode(data) {
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

  document.getElementById("Canvas").appendChild(doc);
}

// save data from object to JSON file
function save() {
  var text = JSON.stringify([reminders, settings]);
  download(text, "data.remind", "text/plain");
}

// load data from file input element
function load() {
  var fileInput = document.getElementById("file");

  if(fileInput.files.length > 0) {
    var reader = new FileReader();

    reader.addEventListener("load", (e) => {
      data = JSON.parse(reader.result);
      reminders = data[0];
      settings  = data[1];
    });
    
    reader.readAsText(fileInput.files[0]);
  }
}

window.onload = function init() {
  var TodaysDate = new Date().toLocaleDateString('en-US');
  DisplayDate = TodaysDate;
  document.getElementById("DailyView").innerHTML = "Daily View: " + DisplayDate;
  document.getElementById("DisDate").value = new Date(DisplayDate).toISOString().split('T')[0];

  document.getElementById("TodaysDate").innerHTML = TodaysDate;

  refreshScreen();

}