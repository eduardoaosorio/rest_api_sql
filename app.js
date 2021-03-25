"use strict";

// load modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./models/index");

// import routes
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");

// create the Express app
const app = express();

// setup connection to database and sync
db.sequelize
  .authenticate()
  .then(() => console.log("Connection to the database successful!"))
  .catch((err) => console.log("Couldn't connect to the database:\n", err))
  .then(() => db.sequelize.sync())
  .then(() => console.log("Sync successfull!"))
  .catch((err) => console.log("Couldn't sync the database:\n", err));

// setup morgan which gives us http request logging
app.use(morgan("dev"));

// enable CORS
app.use(cors());

// parse json
app.use(express.json());

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!",
  });
});

// user routes
app.use("/api", userRoutes);

// course routes
app.use("/api", courseRoutes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const errors = err.errors.map((error) => error.message);
    res.status(400).json({ errors });
  } else {
    res.status(err.status || 500).json({
      error: err.message || "Something went wrong!",
    });
  }
});

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
