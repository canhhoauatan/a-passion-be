const authService = require("../services/authService");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken, expiresAt } = await authService.login(
            email,
            password
        );

        res.status(200).json({
            message: "Đăng nhập thành công",
            user,
            accessToken,
            refreshToken,
            expiresAt,
        });
    } catch (error) {
        res.status(error.status || 500).json({
            message: error.message || "Đã xảy ra lỗi trong quá trình đăng nhập",
        });
    }
};

const logout = async (req, res) => {
    try {
        await authService.logout(req, res);
    } catch (error) {
        console.log(error);
    }
};

const signup = async (req, res) => {
    try {
        const newUser = await authService.signup(req.body);
        res.status(201).json({
            message: "Tạo tài khoản thành công",
            user: newUser,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Đã xảy ra lỗi khi tạo tài khoản",
            error: error.message,
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;
        await authService.changePassword(currentPassword, newPassword, userId);
        res.status(200).json({
            message: "Đổi mật khẩu thành công",
        });
    } catch (error) {
        console.log(error);
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ message: "Thiếu refresh token" });
        }

        const accessToken = await authService.refresh(refreshToken);

        res.status(200).json({
            message: "Cấp lại access token thành công",
            accessToken,
        });
    } catch (error) {
        res.status(401).json({
            message: error.message || "Refresh token không hợp lệ hoặc đã hết hạn",
        });
    }
};

module.exports = { login, logout, signup, changePassword, refresh };
