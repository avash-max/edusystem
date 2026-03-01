const express = require("express");
const router = express.Router();
const {
    addAssignment,
    getAllAssignments,
    getAssignment,
    updateAssignment,
    removeAssignment,
    downloadFile
} = require("../controllers/assignmentController");

const {
    addCourse,
    getAllCourses,
    getCourse,
    updateCourse,
    removeCourse
} = require("../controllers/coursesController");

const {
    getSubmissionsByAssignment,
    getAllSubmissions,
    reviewSubmission,
    downloadSubmission,
    submitAssignment,
    resubmitAssignment
} = require("../controllers/assignmentSubmissionController");


const { addResource, getAllResources, updateResource, removeResource } = require("../controllers/resourceController");
const upload = require("../helpers/multer");

// --- ASSIGNMENT ROUTES ---
router.post(  "/assignments/add",          upload.single("file"), addAssignment);
router.get(   "/assignments/all",          getAllAssignments);
router.get(   "/assignments/:id",      getAssignment);
router.put(   "/assignments/:id",   upload.single("file"), updateAssignment);
router.delete("/assignments/:id",   removeAssignment);
router.get(   "/assignments/download/:id", downloadFile);

// --- COURSE ROUTES ---
router.post("/courses/add", addCourse);
router.get("/courses/all", getAllCourses);
router.get("/courses/:id", getCourse); // Moved to bottom of group
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", removeCourse);


router.post("/resources/add",         addResource);
router.get("/resources/all",         getAllResources);
router.put("/resources/update/:id",   updateResource);
router.delete("/resources/delete/:id", removeResource);

//submission routes
router.get( "/assignment/submission/all",                          getAllSubmissions);
router.get( "/assignment/submission/:assignment_id",    getSubmissionsByAssignment);
router.put( "/assignment/submission/review/:id",                   reviewSubmission);
router.get( "/assignment/submission/download/:id",                 downloadSubmission);

// Student routes
router.post("/assignment/submission/submit",          upload.single("file"), submitAssignment);
router.put( "/assignment/submission/resubmit/:id",   upload.single("file"), resubmitAssignment);


module.exports = router;