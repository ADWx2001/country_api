import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username,firstName, lastName, email, password, mobile } = req.body;
    //console.log(req.body);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+.])[A-Za-z\d!@#$%^&*()_+.]{6,9}$/;


    if (!username || !email || !password || !firstName || !lastName || !mobile || username === "" || email === "" || password === "" || mobile === "" ) {
        return next(errorHandler(400, 'All fields are required'));
    } else if (!emailRegex.test(email)) {
        return next(errorHandler(400, 'Invalid email format'));
    } else if (!mobileRegex.test(mobile)) {
        return next(errorHandler(400, 'Invalid mobile number format'));
    } else if (!passwordRegex.test(password)) {
        return next(errorHandler(400, 'Password should be between 6 and 9 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+.).'));

    }else if (username.length < 7 || req.body.username.length > 20) {
        return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, firstName, lastName, email, password: hashedPassword, mobile });

    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        next(err);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await User.findOne({ email: trimmedEmail });
        if (!validUser) {
            return next(errorHandler(404, "User not found!"));
        }

        const validPassword = bcryptjs.compareSync(trimmedPassword, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid credentials!"));
        }

        const token = jwt.sign(
            { id: validUser._id, isAdmin: validUser.isAdmin },
            process.env.JWT_SECRET
        );

        const { password: hashedPassword, ...rest } = validUser._doc;

        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
            .cookie("access_token", token, {
                httpOnly: true,
                expires: expiryDate,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
            .status(200)
            .json({ ...rest, token }); // Include token in the JSON response
    } catch (error) {
        next(error);
    }
};

export const google = async (req,res,next) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if (user){
            const token = jwt.sign({id:user._id , isAdmin:user.isAdmin},process.env.JWT_SECRET);
            const{password:hashedPassword, ...rest} = user._doc;

            res.cookie('acess_token',token,{httpOnly:true}).status(200).json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
            const newUser = new User({username:req.body.name.split("").join("").toLowerCase()+Math.random().toString(36).slice(-8),
                email:req.body.email, password: hashedPassword, profilePicture:req.body.photo });

            await newUser.save();
            const token = jwt.sign({id:newUser._id , isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
            const{password:hashedPassword2, ...rest} = newUser._doc;
            const expiryDate = new Date(Date.now()+3600000);
            res.cookie('acess_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
        }
    }catch(error){
        next(error);
    }
}