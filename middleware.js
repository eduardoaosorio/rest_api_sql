"use strict";

const auth = require("basic-auth");
const bcrypt = require("bcrypt");
const { User, Course } = require("./models");

// middleware function to check if a course exists
const checkCourseExistance = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      req.course = course;
      next();
    } else {
      const course404 = new Error(
        "Course not found, id doesn't match any existing course"
      );
      course404.status = 404;
      next(course404);
    }
  } catch (err) {
    next(err);
  }
};

// middleware function to authenticate the request using Basic Authentication
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

// middleware function to check if whoever is requesting to update or delete a course is actually the owner
const verifyOwner = async (req, res, next) => {
  try {
    if (req.user.id === req.course.userId) {
      next();
    } else {
      const forbidden403 = new Error(
        "Can't update or delete a course you didn't create"
      );
      forbidden403.status = 403;
      next(forbidden403);
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

module.exports = {
  checkCourseExistance,
  authenticateUser,
  catchAsync,
  verifyOwner,
};
