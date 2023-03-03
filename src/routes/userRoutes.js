import { Router } from "express";
import { getMe } from "../controllers/userController.js";
import sessionValidation from "../middlewares/sessionMiddleware.js";

const userRouter = Router();

userRouter.get("/users/me", sessionValidation, getMe);

export default userRouter;