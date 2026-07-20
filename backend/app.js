import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import { initializeTemplate } from "./utils/template.js";
import router from "./routes/leaderboard.routes.js";
import gameRoute from "./routes/game.route.js";
import userRoute from "./routes/user.route.js";


const app = express();
app.set("trust proxy", 1); //always remeber for hosting.. render/railway
app.use(express.json());
app.use(cors());
app.use(helmet());

initializeTemplate();
app.use("/api/user", userRoute);
app.use("/api/game", gameRoute);
app.use("/api/leaderboard", router);

//test to see if the server is running
app.get("/", (req, res) => {
    res.send("Server is up and active");
});

export default app;