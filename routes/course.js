"use strict";

const express = require("express");
const router = express.Router();
const { Course, User } = require("../models");
const { authenticateUser, catchAsync } = require("../middleware");

// route will return a list of all courses including the User that owns each course and a 200 HTTP status code
router.get(
  "/courses",
  catchAsync(async (req, res, next) => {
    const allCourses = await Course.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.status(200).json(allCourses);
  })
);

// VER EL ERROR HANDLING SI DEPRONTO TOCA PASARLO A OTRO LADO

// route will return the corresponding course along with the User that owns that course and a 200 HTTP status code
router.get(
  "/courses/:id",
  catchAsync(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    if (course) {
      res.status(200).json(course);
    } else {
      res
        .status(404)
        .json({ message: "Supplied ID doesn't match any existing course" });
    }
  })
);

// VER EL ERROR HANDLING SI DEPRONTO TOCA PASARLO A OTRO LADO

// route will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content
router.post(
  "/courses",
  authenticateUser,
  catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const newCourse = await Course.create({ ...req.body, userId });
    res.location(`/courses/${newCourse.id}`).status(201).end();
  })
);

// route will update the corresponding course and return a 204 HTTP status code and no content
router.put(
  "/courses/:id",
  authenticateUser,
  catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const course = await Course.findByPk(req.params.id);
    const updatedCourse = await course.update({ ...req.body, userId });
    console.log(updatedCourse.toJSON());
    res.location(`/courses/${updatedCourse.id}`).status(204).end();
  })
);

// route will delete the corresponding course and return a 204 HTTP status code and no content
router.delete(
  "/courses/:id",
  authenticateUser,
  catchAsync(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).end();
  })
);

module.exports = router;
