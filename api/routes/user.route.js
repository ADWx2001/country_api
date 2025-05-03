import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {test, signout, deleteUserAdmin, updateUser} from "../controllers/user.controller.js";


const router = express.Router();

//router.get("/test", test);
router.get('/signout',signout);
router.put("/:id",verifyToken, updateUser);
router.delete("/delete/:id" , verifyToken , deleteUserAdmin);

export default router;