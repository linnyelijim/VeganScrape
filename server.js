require("dotenv").config();
const mongoose = require("mongoose");
const { logger } = require("./middleware/logEvents");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const bodyParser = require("body-parser");
const Recipe = require("./models/recipes");
const connectDB = require("./config/dbConn");
const corsOptions = require("./config/corsOpts");
const views = require("./controllers/views");
const api = require("./controllers/api");
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5500;

connectDB();
app.use(cors(corsOptions));
app.use(logger);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(errorHandler);

injectSpeedInsights();
inject();
views(app);
api(app, Recipe);

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
