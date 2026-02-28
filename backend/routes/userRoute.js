const express = require("express");
const router = express.Router();
const {
    addAssignment,
    getAllAssignments,
    getAssignment,
    updateAssignment,
    removeAssignment
} = require("../controllers/assignmentController");

const {
    addCourse,
    getAllCourses,
    getCourse,
    updateCourse,
    removeCourse
} = require("../controllers/coursesController");

// --- ASSIGNMENT ROUTES ---
router.post("/assignments/add", addAssignment);
router.get("/assignments/all", getAllAssignments);
router.get("/assignments/:id", getAssignment); // Moved to bottom of group
router.put("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", removeAssignment);

// --- COURSE ROUTES ---
router.post("/courses/add", addCourse);
router.get("/courses/all", getAllCourses);
router.get("/courses/:id", getCourse); // Moved to bottom of group
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", removeCourse);

module.exports = router;