const nodemailer = require("nodemailer");
// const path = require("path");
// const { google } = require("googleapis");
// const OAuth2 = google.auth.OAuth2;
// const oauth2Client = new OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );

// oauth2Client.setCredentials({ refresh_token: process.env.Refresh_Token });
// const accessToken = oauth2Client.getAccessToken();

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
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
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
      from: process.env.GMAIL_USER,
      to: process.env.RECIPIENT,
      subject: "New message from Reservation-form",
      html: output,
      attachments: [
        {
          filename: "email.jpg",
          // path: __dirname + "/public/images/mail.webp",
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
