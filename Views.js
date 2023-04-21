/*global DisplayDate,reminders,dateString, */
var view = 1;

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
  var dropdown = document.createElement("div");
  var dropdownButton = document.createElement("div");
  var dot = document.createElement("div");
  var dot2 = document.createElement("div");
  var dot3 = document.createElement("div");
  var dropdownContent = document.createElement("div");
  doc.classList.add("RemindBubble");
  //doc.setAttribute('id', 'remindBubbles');
  dropdown.classList.add("dropdown");
  dropdownButton.classList.add("dropdown-button");

  dot.classList.add("dot");
  dot2.classList.add("dot");
  dot3.classList.add("dot");
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
  if (view === 1) {
    document.getElementById("RemindContainer").appendChild(doc);
  } else if (view === 2) {
    document.getElementById("WeeklyRemindContainer").appendChild(doc);
  } else if (view === 3) {
    document.getElementById("MonthlyRemindContainer").appendChild(doc);
  }
}
////////////////////Refreshing the page//////////////////////////////
function createView() {
  var date = dateString(DisplayDate);
  var get = Array.from(document.getElementsByClassName("RemindBubble"));
  get.forEach(function(element) {
    element.remove();
  });

  DisplayDate.setHours(0, 0, 0, 0);

  document.getElementById("DailyView").innerHTML = "Daily View: " + date;
  document.getElementById("DisDate").valueAsDate = DisplayDate;
  document.getElementById("DisDateW").valueAsDate = DisplayDate;
  document.getElementById("DisDateM").valueAsDate = DisplayDate;
  loadReminders(date);
}


////////////////////WEEKLY VIEW//////////////////////////////////////

const calendar2 = document.querySelector("#WEEKLYVIEW");
const options = { day: "numeric", month: "short", weekday: "short" };
function createWeeklyView() {

  const weekStart = getWeekStart(DisplayDate);
  const weekEnd = getWeekEnd(DisplayDate);
  var day = 0;
  for (day = 0; day < 7; day += 1) {
    const tempDate = new Date(weekStart);
    tempDate.setDate(weekStart.getDate() + day);
    const count = reminders.filter((reminder) => reminder.date === dateString(tempDate)).length;

    calendar2.insertAdjacentHTML("beforeend",
      `<div class="day">
        ${tempDate.toLocaleDateString(undefined, options)}
        <div onmouseover="switchDay(${tempDate.getDate()}),createView()" onclick="switchDay(${tempDate.getDate()}),changeView(1)" class="DayAmount">${count}</div>
      </div>`);
  }
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getWeekEnd(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 7;
  return new Date(d.setDate(diff));
}

const calendar = document.querySelector("#MONTHLYVIEW");
////////////////////MONTHLY VIEW//////////////////////////////////////
function createMonthlyView() {
  var daysOfWeek = ["S", "M", "T", "W", "TH", "F", "SA"];
  var numWeekDays = 0;
  var Empty = 0;
  var day = 0;
  var i = 0;
  document.getElementById("MonthlyText").innerHTML = getCurrentMonthText(DisplayDate);
  for (numWeekDays = 0; numWeekDays < 7; numWeekDays += 1) {
    calendar.insertAdjacentHTML("beforeend", `<div class="day">${daysOfWeek[numWeekDays]}</div>`);
  }
  for (Empty = 0; Empty < getFirstDayOfMonth(); Empty += 1) {
    calendar.insertAdjacentHTML("beforeend",
      `<div class="day"></div>`);
  }

  for (day = 1; day <= getDaysInMonth(); day += 1) {
    //later for the number of reminders per thing
    const tempDate = DayOfMonth(day);
    var count = 0;
    for (i = 0; i < reminders.length; i += 1) {
      if (tempDate === "all" || reminders[i].date === tempDate) {
        count += 1;
      }
    }
    calendar.insertAdjacentHTML("beforeend",
      `<div class="day">
      ${day}
      <div onmouseover="switchDay(${day}),createView()" onclick="switchDay(${day}),changeView(1),createView()"class="DayAmount">${count}</div>
    </div>`);
  }
}

//////////////////////////HELPER FUNCTIONS///////////////////////////////
function switchDay(day) {
  DisplayDate.setDate(day);

}


function getCurrentMonthText(date) {
  return date.toLocaleString("default", { month: "long" });
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


function changeMonth(amount) {
  DisplayDate.setMonth(DisplayDate.getMonth() + amount);
}

///////////////VIEW CHANGER////////////////
function changeView(which) {
  if (which === 1) {
    document.getElementById("Canvas").style.display = "block";
    document.getElementById("MONTHLYVIEW").style.display = "none";
    document.getElementById("MonthlyCanvas").style.display = "none";
    document.getElementById("WeeklyCanvas").style.display = "none";
    document.getElementById("WEEKLYVIEW").style.display = "none";
    createView();
    view = 1;
  } else if (which === 2) {
    document.getElementById("MONTHLYVIEW").style.display = "none";
    document.getElementById("MonthlyCanvas").style.display = "none";
    document.getElementById("Canvas").style.display = "none";
    document.getElementById("WeeklyCanvas").style.display = "block";
    document.getElementById("WEEKLYVIEW").style.display = "grid";
    document.getElementById("WEEKLYVIEW").innerHTML = "";
    createWeeklyView();
    view = 2;
  } else {
    document.getElementById("WeeklyCanvas").style.display = "none";
    document.getElementById("WEEKLYVIEW").style.display = "none";
    document.getElementById("Canvas").style.display = "none";
    document.getElementById("MonthlyCanvas").style.display = "block";
    document.getElementById("MONTHLYVIEW").style.display = "grid";
    document.getElementById("MONTHLYVIEW").innerHTML = "";
    createMonthlyView();
    view = 3;
  }
}


module.exports = {loadReminders,loadNode,createView,createWeeklyView,getWeekStart,getWeekEnd,createMonthlyView,switchDay,getCurrentMonthText,getDaysInMonth,getFirstDayOfMonth,DayOfMonth,changeMonth,changeView};