import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRoutes.js";
import urlRouter from "./routes/urlRoutes.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const server = express();
server.use(cors());
server.use(json());

server.use([authRouter, urlRouter, userRouter]);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server is running in port ${PORT}`));