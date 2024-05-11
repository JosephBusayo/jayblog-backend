import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateTOken from './../utils/generateToken.js';
import bcryptjs from "bcryptjs"; // For password hashing
import { errorHandler } from "../utils/error.js";



//LOGIN
export const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    const token = generateTOken(user._id)

    if (user && (await user.matchPassword(password))) {
        res
            .status(200)
            .cookie("access_token", token, {
                httpOnly: false,
            })
            .json({
                _id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
                token: token,
            })

    } else {
        res.status(401)
        throw new Error('Invalid Email or Pasword')
    }
})

//REGISTER
export const signup = asyncHandler(async (req, res) => {
    const { username, email, password, profilePicture } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }
    const user = await User.create({
        username, email, password, profilePicture
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            isAdmin: true,
            token: generateTOken(user._id),
        })
    } else {
        res.status(400)
        throw new Error("Invalid User Data")
    }
})

export const signout = asyncHandler(async (req, res) => {
    res.cookie("access_token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
});

export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res
                .status(200)
                .cookie("access_token", token, {
                    httpOnly: true,
                })
                .json(rest);
        } else {
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    name.toLowerCase().split(" ").join("") +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res
                .status(200)
                .cookie("access_token", token, {
                    httpOnly: true,
                })
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};
