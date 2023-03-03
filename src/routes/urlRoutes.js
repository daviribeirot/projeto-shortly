import { Router } from "express";
import { createUrl, getUrlById, goToUrl } from "../controllers/urlController.js";
import { linkSchema } from "../schemas/urlSchema.js"
import validateSchema from "../middlewares/validateSchema.js";
import sessionValidation from "../middlewares/sessionMiddleware.js"

const urlRouter = Router();

urlRouter.post("/urls/shorten", sessionValidation, validateSchema(linkSchema), createUrl);
urlRouter.get("/urls/:id", getUrlById);
urlRouter.get("/urls/open/:shortUrl", goToUrl);
export default urlRouter;
