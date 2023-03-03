import {signUp, signIn} from "../controllers/userController.js"
import { Router } from 'express'
import validateSchema from "../middlewares/validateSchema.js"
import { signupSchema, loginSchema } from '../schemas/userSchema.js'

const authRouter = Router();

authRouter.post("/signup", validateSchema(signupSchema), signUp);
authRouter.post("/signin", validateSchema(loginSchema), signIn);

export default authRouter;