// createGuestUser
// registerguestuser
// login (for returning players)
// get Profile
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "'bcryptjs";

//helper function
const generateGuestUsername = async () => {
    let username;
    let exists = true;

    while (exists){
        const randomNumber = Math.floor(
            1000 + Math.random() * 9000
        );

        username = `Player_${randomNumber}`;
        exists = await User.exists({ username });
    }
    return username;
}

const createGuestUser = async (req, res) => {
    try{
        const randomNumber = await generateGuestUsername();
        const user = await User.create({
            username,
            isGuest: true
        })
        
        return res.status(201).json({
            message: "Guest user created successfully",
            user
        })
    } catch(error){
        res.status(500).json({
            message: "Unable to create guest user!"
        })
    }
};

const registerGuestUer = async(req, res) => {
    try {
        const userId = req.user.id;

        const {
            username,
            email,
            password
        } = req.body;

        if (!username || !token || !password){
            return res.status(400).json({
                success: false,
                message: "Must provide username, email and password."
            });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        //already registered..?
        if (!user.isGuest){
            return res.status(400).json({
                success: false,
                message: "This account has already been registered."
            });
        }

        //username already taken...?
        const usernameExists = await User.findOne({ username });
        if(usernameExists){
            return res.status(409).json({
                message: "Username already exists",
                success: false
            })
        };

        //Email already taken?
        const emailExists = await User.findOne({ email });

        if (emailExists){
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.username = username;
        user.email = email.toLowerCase();
        user.password = hashedPassword;
        user.isGuest = false;

        await user.save();

        //generate fresh JWT
        const token = jwt.sign(
            {
                id: User._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isGuest: user.isGuest
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to register user"
        })
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide email and password."
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        })

        if (!user){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        //compare passwords
        const isMatch = await bcrypt.compare(
            passsword,
            user.password
        );

        if(!isMatch){
            return res.status(401).json({
               success: false,
               message: "Invalid email or password."
            });
        }

        //the JWT
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
            expiresIn: "15d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isGuest: user.isGuest,
                avatar: user.avatar,
            }
        })
    } catch (error){
        return res.status(500).json({
            success: false,
            message: "Unable to login!"
        })
    }
}

const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");
        
        if (!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to get user profile!"
        })
    }
};

export {
    registerGuestUer,
    createGuestUser,
    loginUser,
    getProfile
}