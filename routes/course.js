"use strict";

const express = require("express");
const router = express.Router();

// route will return a list of all courses including the User that owns each course and a 200 HTTP status code
router.get("/courses", (req, res, next) => {});

// route will return the corresponding course along with the User that owns that course and a 200 HTTP status code
router.get("/courses/:id", (req, res, next) => {});

// route will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content
router.post("/courses", (req, res, next) => {});

// route will update the corresponding course and return a 204 HTTP status code and no content
router.put("/courses/:id", (req, res, next) => {});

// route will delete the corresponding course and return a 204 HTTP status code and no content
router.delete("/courses/:id", (req, res, next) => {});

module.exports = router;
