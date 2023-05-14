const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/mydb";

function connectToDatabase() {
  const connectionPromise = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on("connected", () => {
    console.log("Database connected Successfully");
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected");
  });

  connectionPromise.catch((err) =>
    console.error("error connecting to database: ", err.message)
  );
  //   return mongoose.connection;
  return connectionPromise;
}

module.exports = connectToDatabase;
