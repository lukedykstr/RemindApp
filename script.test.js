/////////////////////////DONOTTOUCH///////////////////////////////////////
const { JSDOM } = require('jsdom');
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.window = window;

const dom = new JSDOM('<!DOCTYPE html><html><body> <div class="form-popup" id="myForm">' +
    '<div class="form-container" style="float: left;">' +
      '<h2 id="form-title">New Reminder</h2>' +
      '<label id="header-label"><b>Header: </b></label>' +
      '<input type="text" placeholder="Enter Header" name="header" id="HEADER" required>' +
      '<br>' +
      '<label id="body-label"><b>Body: </b></label>' +
      '<input type="text" placeholder="Enter Body" name="body" id="bodyText" required>' +
      '<br>' +
      '<label><b>Date: </b></label>' +
      '<input type="date" id="DATE" name="date">' +
      '<br>' +
      '<label><b>Time: </b></label>' +
      '<input type="time" id="TIME" name="time">' +
      '<br><br>' +
      '<button type="button" class="btn enter" id="enter" onclick="formEnter()">Enter</button>' +
      '<button type="button" class="btn cancel" onclick="closeForm()">Close</button>' +
    '</div>' +
    '<div class="form-container" id="repeat-container" style="float: left; margin-left:20px;">' +
      '<h2 id="form-title" style="margin-top: 80px;"> </h2>' +
      '<label><b>Repeat:</b></label><br>' +
      '<input type="radio" id="never" name="repeat" value="never" checked onchange="setRepeat(\'never\')">' +
      '<label for="never">Never</label>' +
      '<input type="radio" id="daily" name="repeat" value="daily" onchange="setRepeat(\'daily\')">' +
      '<label for="daily">Daily</label>' +
      '<input type="radio" id="weekly" name="repeat" value="weekly" onchange="setRepeat(\'weekly\')">' +
      '<label for="weekly">Weekly</label><br>' +
      '<label id="repeat-label" style="visibility: hidden;">For <input id="repeat-amount" type="number" min=1 step=1' +
          ' value=1 style="width: 60px;"> <span id="repeat-type">day(s)</span></label>' +
    '</div>' +
  '</div></body></html>',{url: "http://localhost"});
global.document = dom.window.document;
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

/////////////////////////////////////////////////////////////////////////

/*IMPORTANT MESSAGE FOR SETTING UP TESTS

you must have this for every functino you are trying to test

const functionname = require('./script.js');

test('description goes here', () => {

});



SETUP FOR INSIDE THE MAIN JS FILE
module.exports = functionname;
//////////////////////////////////*/

//TO RUN THE TESTS GO TO THE SHELL PROMPT AND TYPE IN 'npm test'

const { reminders,createNode,convertTime,createDate,formEnter,reminderExists,setRepeat,dateString,incrementDate,changeDate,calSubmit,openForm,closeForm,openSettings,closeSettings,settingsEnter,createReminder,editReminder,deleteOnEnter,deleteReminder,save,load,downloadData,uploadData} = require('./scripttester.js');

// Replace the original function with the mock function

//const dateString = require('./script.js');
var headerInput = document.getElementById("HEADER");
var bodyInput = document.getElementById("bodyText");
var dateInput = document.getElementById("DATE");
var timeInput = document.getElementById("TIME");
var emailInput = document.getElementById("email");
var repeatInput = document.getElementById("repeat-amount");

var repeatAmount = 0;
var repeatMode = "never";

test('dateString(date)', () => {
  let TodaysDate = new Date('3/3/2023');
  TodaysDate.setHours(0, 0, 0, 0);
  const string = dateString(TodaysDate);
  expect(string).toBe('3/3/2023');
});


//const incrementDate = require('./script.js');

test('incrementDate()', () => {
  let TodaysDate = new Date('3/3/2023');
  TodaysDate.setHours(0, 0, 0, 0);
  
  var string = dateString(incrementDate(TodaysDate, 1));
  expect(string).toBe('3/4/2023');

  var string = dateString(incrementDate(TodaysDate, -1));
  expect(string).toBe('3/2/2023');

  var string = dateString(incrementDate(TodaysDate, 0));
  expect(string).toBe('3/3/2023');
  
  
});


test('createReminder()', () => {
  let TodaysDate = new Date(2023, 2, 3);
  let time = '10:00 AM';
  const reminder = 
 createReminder('HEADER','BODY',dateString(TodaysDate),time);

  expect(reminder.header).toBe('HEADER');
  expect(reminder.body).toBe('BODY');
  expect(reminder.date).toBe(dateString(TodaysDate));
  expect(reminder.time).toBe(time);
});

test('deleteReminder()',() => {
var TodaysDate = new Date(2023, 2, 3);
var time = '10:00 AM';
var numReminders = reminders.length;
createReminder('HEADER','BODY',dateString(TodaysDate),time);
expect(reminders.length).toBe(numReminders+1);
deleteReminder(numReminders-1);
expect(reminders.length).toBe(numReminders);
});



test('convertTime() with 12hr format', () => {
const time = '18:30';
const convertedTime = convertTime(time);

expect(convertedTime).toBe('6:30 PM');
});

test('createDate() from date string and 12hr time string', () => {
const dateString = '2023-04-19';
const timeString = '10:30 PM';
const date = createDate(dateString, timeString);

expect(date.getFullYear()).toBe(2023);
expect(date.getMonth()).toBe(3);
expect(date.getDate()).toBe(19);
expect(date.getHours()).toBe(22);
expect(date.getMinutes()).toBe(30);
});



test('reminderExists() when reminder exists', () => {
// Set up the reminders array with some reminders
let TodaysDate = new Date(2023, 2, 3);
  let time = '10:00 AM';
  const reminder = 
 createReminder('HEADER','BODY',dateString(TodaysDate),time);

// Call the function with an existing reminder
var exists = reminderExists('HEADER', dateString(TodaysDate), '10:00 AM');
expect(exists).toBe(true);
  
exists = reminderExists('HEADER', dateString(TodaysDate), '12:00 AM');
expect(exists).toBe(false);
});

test('save() and load()', () => {
  
  var settings = {email: "test@test.com", notifs: "none"};

  createReminder("header", "", "3/3/2023", "3:00 PM");

  save();
  load();

  expect(settings.email).toBe("test@test.com");
  expect(settings.notifs).toBe("none");
  expect(reminderExists("header", "3/3/2023", "3:00 PM")).toBe(true);
});








test('createNode()', () => {
  // Set up the inputs for the function
  headerInput.value = "test header #1";
  bodyInput.value = "Test Body";
  dateInput.value = "2023-04-21";
  timeInput.value = "14:30:00";
  repeatInput.value = 1;
  setRepeat("daily");
  
  var initialLength = reminders.length;
  createNode();
  // expected length should be initialLength + repeatInput.value + 1
  expect(reminders.length).toBe(initialLength + 2);

  headerInput.value = "test header #2";
  repeatMode = "daily";
  repeatInput.value = 5;
  initialLength = reminders.length;
  createNode();
  expect(reminders.length).toBe(initialLength + 6);

  headerInput.value = "test header #3";
  repeatMode = "weekly";
  repeatInput.value = 2;
  initialLength = reminders.length;
  createNode();
  expect(reminders.length).toBe(initialLength + 3);

});

test("formEnter() creates reminder and refreshes view if input is valid", () => {
  
  // arrange
headerInput.value = "Test Reminder";
bodyInput.value = "Test reminder body text.";
dateInput.value = "2023-04-24";
timeInput.value = "10:00:00";

setRepeat("never");
var repeatAmount = 0;
const initialLength = reminders.length;
global.alert = jest.fn();

// act
formEnter();

// assert
expect(global.alert).not.toHaveBeenCalled();
expect(reminders.length).toBe(initialLength + 1);
expect(reminderExists("Test Reminder", "4/24/2023", "10:00 AM")).toBe(true);
});


