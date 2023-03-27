


function loadMonthlyReminders(date) {
  var i = 0;
  for (i = 0; i < reminders.length; i += 1) {
    if (date === "all" || reminders[i].date === date) {
      loadMonthlyNode(i);
    }
  }
}

// create a single reminder node given index in reminders list
function loadMonthlyNode(index) {
  var data = reminders[index];
  var breakLine = document.createElement("br");
  var doc = document.createElement("div");
  var text = document.createElement("h1");
  var dateFormat = document.createElement("time");
  var timeFormat = document.createElement("time");
  doc.classList.add("RemindBubble");



  //text.classList.add("RemindH");
  text.innerHTML = data.header;
  doc.appendChild(text);

  bodyText.classList.add("RemindP");

  dateFormat.innerHTML = data.date;
  doc.appendChild(dateFormat);

  doc.appendChild(breakLine);

  timeFormat.innerHTML = data.time;
  doc.appendChild(timeFormat);

  doc.appendChild(document.createElement("br"));


  document.getElementById("MonthlyRemindContainer").appendChild(doc);
}

function createMView() {
  var date = dateString(DisplayDate);
  var get = Array.from(document.getElementsByClassName("RemindBubble"));

  get.forEach(function(element) {
    element.remove();
  });

  DisplayDate.setHours(0, 0, 0, 0);

  document.getElementById("DailyView").innerHTML = "Daily View: " + date;
  document.getElementById("DisDate").valueAsDate = DisplayDate;
  loadMonthlyReminders(date);
}


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
      <div onmouseover="switchDay(${day}),createMView()" onmouseout="" onclick="switchDay(${day}),changeView(1)"class="DayAmount">${count}</div>
    </div>`);
  }
  //calendar.insertAdjacentHTML("beforeend", '<div id="MonthlyRemindContainer"></div>');
}



function mouseOff() {
  var element = document.getElementById("MonthlyRemindContainer");
  element.style.display = "none";

}

function switchDay(day) {
  DisplayDate.setDate(day);

}
function getDay(day) {
  const tempDate = new Date(DisplayDate);
  return new Date(tempDate.setDate(day));
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
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  return lastDayOfMonth;
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

