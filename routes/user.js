"use strict";

const express = require("express");
const router = express.Router();

// route will return the currently authenticated user along with a 200 HTTP status code
router.get("/users", (req, res, next) => {});

// route will create a new user, set the Location header to "/", return a 201 HTTP status code and no content
router.post("/users", (req, res, next) => {});

module.exports = router;
