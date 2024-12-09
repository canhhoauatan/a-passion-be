const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morganLogger = require("morgan");
require("dotenv").config();
const cors = require("cors");

const indexRouter = require("./routes/index");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");
const appLogger = require("./utils/logger");

const app = express();

// Middleware
app.use(
    cors({
        origin: "http://localhost:3000", // Cho phép frontend trên localhost:3000 truy cập
        credentials: true, // Cho phép gửi cookie và thông tin xác thực
        methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức HTTP mà frontend có thể sử dụng
    })
);
app.use(morganLogger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Logging request
app.use((req, res, next) => {
    appLogger.info(`${req.method} ${req.url}`);
    next();
});

// Định tuyến
app.use("/course", courseRoutes);
app.use("/user", userRoutes);
app.use("/lesson", lessonRoutes);
app.use("/review", reviewRoutes);
app.use("/category", categoryRoutes);
app.use("/", authRoutes);
app.use("/", indexRouter);

// Xử lý lỗi 404
// app.use((req, res, next) => {
//     next(createError(404));
// });

// Xử lý lỗi chung
app.use((err, req, res, next) => {
    appLogger.error(`Error: ${err.message}`);
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500).render("error");
});

module.exports = app;
