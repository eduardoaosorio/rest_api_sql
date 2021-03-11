"use strict";

const auth = require("basic-auth");
const bcrypt = require("bcrypt");
const { User } = require("./models");

// Middleware to authenticate the request using Basic Authentication
const authenticateUser = async (req, res, next) => {
  try {
    let message; // store the message to display in case of failure

    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req); // if success returns { name: 'something', pass: 'whatever' }, else returns undefined
    if (credentials) {
      const user = await User.findOne({
        where: { emailAddress: credentials.name },
      });
      if (user) {
        const authenticated = bcrypt.compareSync(
          credentials.pass,
          user.password
        );
        if (authenticated) {
          console.log(
            `Authentication successful for email: ${user.emailAddress}`
          );
          req.user = user;
        } else {
          message = `Authentication failure for username: ${user.username}`;
        }
      } else {
        message = `User not found for username: ${credentials.name}`;
      }
    } else {
      message = "Auth header not found";
    }

    if (message) {
      console.warn(message);
      res.status(401).json({ message: "Access Denied" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

// function to wrap async callbacks in routes and handle async errors
function catchAsync(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
}

module.exports = { authenticateUser, catchAsync };
