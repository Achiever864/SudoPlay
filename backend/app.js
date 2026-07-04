import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import { initializeTemplate } from "./utils/template,js";


const app = express();
app.set("trust proxy", 1); //always remeber for hosting.. render/railway
app.use(express.json());
app.use(cors());
app.use(helmet());



//test to see if the server is running
app.get("/", (req, res) => {
    res.send("Server is up and active");
});

export default app;