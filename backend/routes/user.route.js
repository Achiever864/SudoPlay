import express from "express";
import { 
    createGuestUser, 
    registerGuestUser, 
    loginUser, 
    getProfile 
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const userRoute = express.Router();

userRoute.post("/guest/create", createGuestUser);
userRoute.post("/register", protect, registerGuestUser);
userRoute.post("/login", loginUser);
userRoute.get("/me", protect, getProfile);

export default userRoute;