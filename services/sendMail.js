const nodemailer = require("nodemailer");
const path = require("path");

function sendMail(
  name,
  email,
  phone,
  arrivalDate,
  departureDate,
  adultsNo,
  childNo
) {
  return new Promise((resolve, reject) => {
    const output = `
        <p>You have a new reservation request</p>
        <img class="email" src="cid:email" alt="email-image" style="height:5rem">
        <h3>Reservation details</h3>
        <ul>
        <li>Name: ${name}</li>
        <li>Email: ${email}</li>
        <li>Phone: ${phone}</li>
        <li>Arrival Date: ${arrivalDate}  =>  Departure Date: ${departureDate}</li>
        <li>Number of Adults: ${adultsNo} | Number of Children: ${childNo}</li>
        </ul>`;

    const smtpTrans = nodemailer.createTransport({
      service: "gmail",
      host: "smpt.gmail.com",
      port: "587",
      secure: false,
      auth: {
        user: process.env.serviceEmail,
        pass: process.env.serviceEmailPW,
      },
    });

    const imagePath = path.join(
      __dirname,
      "..",
      "public",
      "images",
      "mail2.png"
    );

    const mailOpts = {
      from: process.env.serviceEmail,
      to: "sensresidency@gmail.com",
      subject: "New message from Reservation-form",
      html: output,
      attachments: [
        {
          filename: "email.jpg",
          path: __dirname + "/public/images/mail.webp",
          path: imagePath,
          cid: "email", //same cid value as in the html img src
        },
      ],
    };

    smtpTrans.sendMail(mailOpts, (error, res) => {
      if (error) {
        console.log(error);
        reject("some thing went wrong");
      } else {
        console.log("Message sent: " + res.message);
        resolve("mail sent successfully");
      }
    });
  });
}

module.exports = sendMail;
