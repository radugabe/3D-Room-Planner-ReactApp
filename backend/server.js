require("dotenv").config();
const express = require("express");
const cors = require("cors");
const modelsRouter = require("./routes/modelsRouter");
const materialsRouter = require("./routes/materialsRouter");
const floorsRouter = require("./routes/floorsRouter");
const wallRoutes = require("./routes/wallsRouter");
const aiRouter = require("./routes/aiRouter");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/models", modelsRouter);
app.use("/materials", materialsRouter);
app.use("/floors", floorsRouter);
app.use("/walls", wallRoutes);
app.use("/ai", aiRouter);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});