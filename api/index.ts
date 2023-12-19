import express from "express";
import { monitorRouter } from "./routes/monitor";
const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/monitor", monitorRouter); 

app.listen(PORT, () => console.log(`server running at ${PORT}`));
