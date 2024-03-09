const cheerio = require("cheerio");
const mongoose = require("mongoose");
const axios = require("axios");

module.exports = (app, Recipe) => {
  const addToDB = (rec) => {
    Recipe.find({ title: rec.title }).then((dbEntry) => {
      if (dbEntry == undefined || dbEntry.length == 0) {
        const data = new Recipe(rec);
        data.save();
      }
    });
  };

  const getRecipe = async (url) => {
    try {
      console.log("Fetching recipe from:", url);
      const response = await axios.get(url);
      console.log("Response status:", response.status);
      if (response.status !== 200) {
        throw new Error(`Failed to fetch recipe: ${response.status}`);
      }
      const body = response.data;
      const $ = cheerio.load(body);
      console.log("Title:", $("h1.entry-title").text());

      const image = [];

      // Minimalist Baker image
      $("figure img").each(function (i, img) {
        const src = $(this).attr("src");
        if (src && src.indexOf("jpg") > -1) {
          image.push(src);
        } else {
          console.log(
            "Failed to retrieve image from: ",
            url,
            " and href: ",
            href,
            " no complete url: ",
            completeURL
          );
        }
      });

      // End Minimalist Baker image ↵
      const tagsText = $("span.wprm-recipe-cuisine").text().trim();
      const tags = tagsText.split(",").map((tag) => tag.trim());
      console.log(tags);

      const recipe = {
        title: $("h1.entry-title").text(),
        source: url,
        images: image,
        ingredients: $("div.wprm-recipe-ingredients-container").html(),
        instructions: $("div.wprm-recipe-instructions-container").html(),
        tags: tags,
        freezer: $("span.wprm-recipe-freezer-friendly").text().trim(),
        fridge: $("span.wprm-recipe-does-it-keep").text().trim(),
        time: $("span.wprm-recipe-total_time-minutes").text(),
        notes: $("div.wprm-recipe-notes-container").html(),
      };
      if (recipe.title.length > 1) {
        addToDB(recipe);
      }
      console.log(image);
      return recipe;
    } catch (error) {
      console.error("Error fetching recipe:", error.message);
      throw error;
    }
  };

  app.post("/addrecipe", (req, res) => {
    console.log("request recieved");
    getRecipe(req.body.url)
      .then((body) => res.send(body))
      .catch((err) => res.status(500).send(err));
  });

  app.get("/search", (req, res) => {
    let query = req.query.tag;
    query = query.split(",").map((tag) => new RegExp(tag.trim(), "i"));
    Recipe.find({ tags: { $all: query } })
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  });

  app.delete("/remove/:id", (req, res) => {
    const id = req.params.id;
    Recipe.deleteOne({ _id: id })
      .then(() => res.json("Document successfully removed"))
      .catch((err) => res.status(500).json(err));
  });

  app.get("/recipes", (req, res) => {
    Recipe.find({})
      .then((data) => {
        console.log("recipes fetched successfully:");
        res.json(data);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        res.status(500).json({ error: "Failed to fetch recipes" });
      });
  });

  app.get("/recipe-info/:id", (req, res) => {
    Recipe.findById(req.params.id)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  });
};
