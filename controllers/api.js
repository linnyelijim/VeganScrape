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
      const response = await axios.get(url);
      if (response.status !== 200) {
        throw new Error(`Failed to fetch recipe: ${response.status}`);
      }
      const body = response.data;
      const $ = cheerio.load(body);
      /*       console.log("Title:", $("h1.entry-title").text());*/
      const metaCategories = $('meta[property="slick:category"]')
        .map(function () {
          return $(this).attr("content");
        })
        .get();

      let category = "Other"; // Default category
      metaCategories.forEach((content) => {
        if (content.includes("breakfast")) {
          category = "Breakfast";
        } else if (content.includes("lunch")) {
          category = "Lunch";
        } else if (content.includes("entree")) {
          category = "Entree";
        } else if (content.includes("dessert")) {
          category = "Dessert";
        }
      });

      console.log("Recipe Category:", category);

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
        category: category,
      };
      if (recipe.title.length > 1) {
        addToDB(recipe);
      }
      return recipe;
    } catch (error) {
      console.error("Error fetching recipe:", error.message);
      throw error;
    }
  };

  app.post("/addrecipe", (req, res) => {
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
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ error: "Failed to fetch recipes" });
      });
  });

  app.get("/recipe-info/:id", (req, res) => {
    Recipe.findById(req.params.id)
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  });
};
