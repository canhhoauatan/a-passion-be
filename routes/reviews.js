const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

const prisma = new PrismaClient();

router.get("/:courseId", async (req, res) => {
    const { courseId } = req.params;
    try {
        const reviews = await prisma.review.findMany({
            where: { courseId: parseInt(courseId) },
            include: { user: { select: { name: true } } },
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bình luận." });
    }
});

router.get("/", async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            include: { user: { select: { name: true } } },
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách bình luận." });
    }
});

router.post("/", authenticate, async (req, res) => {
    const { courseId, rating, comment } = req.body;
    console.log(req.user.userId);

    try {
        const newReview = await prisma.review.create({
            data: {
                userId: req.user.id,
                courseId,
                rating,
                comment,
                // user: req.user,
            },
        });
        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi thêm bình luận." });
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const deleteReview = await prisma.review.delete({
            where: { id: parseInt(id) },
        });
        res.status(201).json(deleteReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi khi del bình luận." });
    }
});

module.exports = router;
