const Course = require("../models/courseModel");

const addCourse = async (req, res) => {
    try {
        const { title, code, students, color } = req.body;

        if (!title || !code) {
            return res.status(400).json({ message: "Title and code are required" });
        }

        const existing = await Course.findOne({ where: { code } });
        if (existing) {
            return res.status(409).json({ message: "Course code already exists" });
        }

        const course = await Course.create({ title, code, students, color });

        return res.status(201).json({
            message: "Course created successfully",
            course
        });
    } catch (error) {
        console.error("addCourse error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            order: [["created_at", "DESC"]]
        });

        return res.status(200).json({ courses });
    } catch (error) {
        console.error("getAllCourses error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        return res.status(200).json({ course });
    } catch (error) {
        console.error("getCourse error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, code, students, color, assignments } = req.body;

        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (code && code !== course.code) {
            const existing = await Course.findOne({ where: { code } });
            if (existing) {
                return res.status(409).json({ message: "Course code already exists" });
            }
        }

        await course.update({
            title: title ?? course.title,
            code: code ?? course.code,
            students: students ?? course.students,
            color: color ?? course.color,
            assignments: assignments ?? course.assignments
        });

        return res.status(200).json({
            message: "Course updated successfully",
            course
        });
    } catch (error) {
        console.error("updateCourse error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const removeCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        await course.destroy();

        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("removeCourse error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    addCourse,
    getAllCourses,
    getCourse,
    updateCourse,
    removeCourse
};