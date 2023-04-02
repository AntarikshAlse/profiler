const connect = require("mongoose").connect;

connect(process.env.MONGO_URI)
  .then((res) => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB...", err);
  });
