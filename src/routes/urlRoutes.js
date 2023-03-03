import { Router } from "express";
import { createUrl } from "../controllers/urlController.js";
import { linkSchema } from "../schemas/urlSchema.js"
import validateSchema from "../middlewares/validateSchema.js";
import sessionValidation from "../middlewares/sessionMiddleware.js"

const urlRouter = Router();

urlRouter.post("/urls/shorten", sessionValidation, validateSchema(linkSchema), createUrl);

export default urlRouter;
