/////////////////////////DONOTTOUCH///////////////////////////////////////

const { JSDOM } = require('jsdom');
const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.window = window;
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
/////////////////////////////////////////////////////////////////////////

/*IMPORTANT MESSAGE FOR SETTING UP TESTS

you must have this for every functino you are trying to test

const functionname = require('./script.js');

test('description goes here', () => {

});



SETUP FOR INSIDE THE MAIN JS FILE
module.exports = functionname;
//////////////////////////////////*/




//TO RUN THE TESTS GO TO THE SHELL PROMPT AND TYPE IN "npm test"
const { dateString, incrementDate, createReminder } = require('./script');
//const dateString = require('./script.js');

test('dateString(date)', () => {
  let TodaysDate = new Date("3/3/2023");
  TodaysDate.setHours(0, 0, 0, 0);
  const string = dateString(TodaysDate);
  expect(string).toBe('3/3/2023');
});


//const incrementDate = require('./script.js');

test('incrementDate()', () => {
  let TodaysDate = new Date("3/3/2023");
  TodaysDate.setHours(0, 0, 0, 0);
  let DifferntDate = TodaysDate;
  
  var string = dateString(incrementDate(TodaysDate, 1));
  expect(string).toBe('3/4/2023');

  var string = dateString(incrementDate(TodaysDate, -1));
  expect(string).toBe('3/2/2023');

  var string = dateString(incrementDate(TodaysDate, 0));
  expect(string).toBe('3/3/2023');
  
  
});


test('createReminder()', () => {
  let TodaysDate = new Date(2023, 2, 3);
  const reminder = createReminder("HEADER","BODY",TodaysDate,TodaysDate);

  expect(reminder.header).toBe('HEADER');
  expect(reminder.body).toBe('BODY');
});
