const mongoose = require("mongoose");
const express = require("express");
const bodyparser = require("body-parser");

const app = express();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/recipes";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
