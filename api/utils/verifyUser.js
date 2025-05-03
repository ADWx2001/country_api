import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: token is expired or missing" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};


export const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: token is expired or missing" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        // Check if the user is an admin
        if (!user.isAdmin) {
            return res.status(403).json({ message: "Forbidden: You do not have admin rights" });
        }

        req.user = user;  // Attach user to request object for further processing
        next();
    });
};




// export const verifyToken = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];
//
//         if (!token) {
//             return res.status(401).json({ message: "Unauthorized: No token provided" });
//         }
//
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select("-password");
//
//         if (!req.user) {
//             return res.status(401).json({ message: "User not found" });
//         }
//
//         next();
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid or expired token" });
//     }
// };
