"use strict";

const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { authenticateUser, catchAsync } = require("../middleware");

// route will return the currently authenticated user along with a 200 HTTP status code
router.get(
  "/users",
  authenticateUser,
  catchAsync(async (req, res, next) => {
    const { id, firstName, lastName, emailAddress } = req.user;
    res.status(200).json({ id, firstName, lastName, emailAddress });
  })
);

// route will create a new user, set the Location header to "/", return a 201 HTTP status code and no content
router.post(
  "/users",
  catchAsync(async (req, res, next) => {
    await User.create({ ...req.body, id: null });
    res.location("/").status(201).end();
  })
);

module.exports = router;
