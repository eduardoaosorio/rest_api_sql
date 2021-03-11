"use strict";

const express = require("express");
const router = express.Router();
const { Course, User } = require("../models");
const {
  checkCourseExistance,
  authenticateUser,
  verifyOwner,
  catchAsync,
} = require("../middleware");

// route will return a list of all courses including the User that owns each course and a 200 HTTP status code
router.get(
  "/courses",
  catchAsync(async (req, res, next) => {
    const allCourses = await Course.findAll({
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
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

// route will return the corresponding course along with the User that owns that course and a 200 HTTP status code
router.get(
  "/courses/:id",
  checkCourseExistance,
  catchAsync(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: [
        "id",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded",
        "userId",
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.status(200).json(course);
  })
);

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
  checkCourseExistance,
  authenticateUser,
  verifyOwner,
  catchAsync(async (req, res, next) => {
    const { id: userId } = req.user;
    const { course } = req;
    const updatedCourse = await course.update({ ...req.body, userId });
    res.location(`/courses/${updatedCourse.id}`).status(204).end();
  })
);

// route will delete the corresponding course and return a 204 HTTP status code and no content
router.delete(
  "/courses/:id",
  checkCourseExistance,
  authenticateUser,
  verifyOwner,
  catchAsync(async (req, res, next) => {
    const { course } = req;
    await course.destroy();
    res.status(204).end();
  })
);

module.exports = router;
