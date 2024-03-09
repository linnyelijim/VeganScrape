const path = require("path");

module.exports = (app) => {
  app.get("^/$|/index(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "./../public/html/index.html"));
  });
  app.get("/list", (req, res) => {
    res.sendFile(path.join(__dirname, "./../public/html/list.html"));
  });
  app.get("/recipes/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "./../public/html/recipe.html"));
  });
};
