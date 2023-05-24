const mongoose = require("mongoose");

// const url = "mongodb://localhost:27017/mydb";
const url = process.env.dbString;

// mongoose.connection.on("connected", () => {
//   console.log("Database connected successfully");
// });

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected");
});

function connectToDatabase() {
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err.message);
    });
}

module.exports = connectToDatabase;
