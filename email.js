// send an email to recipient with subject and body
function sendEmail(recipient, subject, body) {
  Email.send({
      SecureToken: "f1335f10-633a-47ab-9976-808dbc7e3813",
      To : recipient,
      From : "remindappnotifications@gmail.com",
      Subject : subject,
      Body : body
  }).then(
    message => alert(message)
  );
}

// example
// sendEmail("dykstrlu@mail.gvsu.edu", "test", "this is the body");