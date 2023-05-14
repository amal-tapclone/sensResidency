const sendMail = require("../services/sendMail");

module.exports = {
  doReservation: async (req, res) => {
    let { name, email, phone, arrivalDate, departureDate, adultsNo, childNo } =
      req.body;
    try {
      await sendMail(
        name,
        email,
        phone,
        arrivalDate,
        departureDate,
        adultsNo,
        childNo
      );
      res.status(200).send("Reservation request sent successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  },
};
