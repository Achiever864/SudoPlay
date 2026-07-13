// createGuestUser
// registerguestuser
// login (for returning players)
// get Profile
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

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

        const hashedPassword = await bcrypt.hash(password, 10)
    } catch (error) {
        
    }
}