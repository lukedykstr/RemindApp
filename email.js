/*global DisplayDate,reminders,dateString,save,settings,convertTime,console */
// send an email to recipient with subject and body
function sendEmail(recipient, subject, body) {
  Email.send({
    SecureToken: "f1335f10-633a-47ab-9976-808dbc7e3813",
    To: recipient,
    From: "remindappnotifications@gmail.com",
    Subject: subject,
    Body: body
  }).then(
    (message) => {
      console.log(message);

      if (message !== "OK") {
        alert("Error: could not send email. Please check that you entered a valid email adress.");
      }
    }
  );
}

// example
// sendEmail("dykstrlu@mail.gvsu.edu", "test", "this is the body");

// email reminder given its index in list
function emailReminder(index) {
  var remind = reminders[index];
  var body = (remind.body === "") ? remind.header : remind.body;

  sendEmail(settings.email, remind.header,
    "<b>Reminder at " + remind.time + ":</b><br>" + body
    + "<br><br><i>- Generated by <a href=\"https://termprojectremindapp.shanebailey5.repl.co/\">RemindApp</a></i>");
}

// check for notifications
function checkNotifications() {
  var date = new Date();
  var today = dateString(new Date());
  var time;
  var i = 0;
  switch (settings.notifs) {
    case "dont":
      return 0;
    case "10min":
      date.setTime(date.getTime() + (10 * 60 * 1000)); break;
    case "30min":
      date.setTime(date.getTime() + (30 * 60 * 1000)); break;
  }
  time = convertTime(date.getHours() + ":" + date.getMinutes());
  for (i = 0; i < reminders.length; i+=1) {
    if (reminders[i].date === today && reminders[i].time === time && !reminders[i].notified) {
      emailReminder(i);
      reminders[i].notified = true;
      save();
      console.log("sent email: " + reminders[i].header);
    }
  }
}

// check for notifications every 5 seconds
setInterval(checkNotifications, 5000);