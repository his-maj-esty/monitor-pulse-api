import express from "express";
import { monitorRouter } from "./routes/monitor";
import { notificationRouter } from "./routes/notification";
import cors from "cors";

const app = express();
const PORT = 3010;

app.use(express.json());
app.use(cors());

app.use("/monitor", monitorRouter); 
app.use("/notification", notificationRouter);

app.listen(PORT, () => console.log(`server running at ${PORT}`));
