import { Router } from "express";
import { getPermissions, getUser, updatePermissions, updateProfile, banUser, unbanUser } from "@/controllers/user.controller";
const userRouter = Router();


userRouter.get("/:user_id", getUser); // Get user's details

userRouter.get("/:user_id/permissions", getPermissions); // Get user permissions

userRouter.put("/:user_id/permissions", updatePermissions); // Update user's permissions

userRouter.put("/:user_id/profile", updateProfile); // update user's profile

userRouter.put("/:user_id/ban", banUser); // Ban a user (disabled login)

userRouter.put("/:user_id/unban", unbanUser); // unban a user (enable login)







export default userRouter;
