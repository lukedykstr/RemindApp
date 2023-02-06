// create list to hold reminders
var reminders = [
  {
    header: "Test Reminder",
    body: "this is a test.",
    date: "3/3/2023",
    time: "12:00:00PM"
  },
  {
    header: "Reminder 2",
    body: "another reminder",
    date: "3/4/2023",
    time: "1:30:00AM"
  }
]

// create nodes from reminders list
loadReminders("3/4/2023");

//trying to figure out how to create html objects using javascript
function createNode() {
  var breakLine = document.createElement("br");

  var doc = document.createElement("div");
  doc.classList.add("RemindBubble");

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

  document.getElementById("Canvas").appendChild(doc)

  // add reminder to list
  createReminder(text.innerHTML, bodyText.innerHTML, dateFormat.innerHTML, timeFormat.innerHTML);
  //window.setTimeout(CloneNode, 0);
}

function openForm() {
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
  for(var i=0;i<reminders.length;i++) {
    if(date == "all" || reminders[i].date == date) {
      loadNode(reminders[i]);
    }
  }
}

// create a single reminder node given object data
function loadNode(data) {
  var breakLine = document.createElement("br");

  var doc = document.createElement("div");
  doc.classList.add("RemindBubble");

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
  var text = JSON.stringify(reminders);
  download(text, "data.sav", "text/plain");
}

// work in progress
function load() {
  /*
  var fileInput = document.getElementById("file");

  if(fileInput.files.length > 0) {
    var reader = new FileReader();

    reader.addEventListener("load", (e) => {
      jsonData = JSON.parse(reader.result);
      reminders = jsonData
    });
    
    reader.readAsText(fileInput.files[0]);
  }
  */
}