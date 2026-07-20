import express from "express";
import { 
    registerUser, 
    loginUser, 
    getProfile 
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/me", protect, getProfile);

export default userRoute;