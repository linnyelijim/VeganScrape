$(function () {
  $("#add").on("click", function () {
    $("#stat-img").attr(
      "src",
      "https://cdn.dribbble.com/users/614270/screenshots/2534654/loader01.gif"
    );
    $("#stat").text("Loading Recipe");
    const body = {
      url: $("#rurl").val(),
    };
    console.log(body);
    $.post("/addrecipe", body, (data) => {
      if (data.title.length < 1) {
        $("#stat-img").attr(
          "src",
          "https://i.giphy.com/media/OiC5BKaPVLl60/200w.webp"
        );
        $("#stat").text(
          "Oops! Something went wrong. Please make sure the link you entered is from minimalistbaker.com"
        );
        return;
      } else {
        $("#stat-img").attr("src", data.images[0]);
        $("#stat").text("Recipe Successfully Added!");
        recentlyAdded(data);
      }
    }).fail(() => {
      // Handle request failure
      $("#stat-img").attr(
        "src",
        "https://i.giphy.com/media/OiC5BKaPVLl60/200w.webp"
      );
      $("#stat").text("Oops! Something went wrong.");
    });
  });
  $("#rurl").on("dblclick", function () {
    this.select();
  });
});
function recentlyAdded(recipe) {
  console.log(recipe);
  $.get("/recipes")
    .done((recipes) => {
      console.log(recipes);

      // Find the recently added recipe in the list of recipes
      const recentlyAddedRecipe = recipes.find((r) => r.title === recipe.title);
      console.log("recipe: ", recipe.title);
      console.log("r_id: ", recentlyAddedRecipe._id);
      if (recentlyAddedRecipe) {
        $("#recipe-link").attr("href", `/recipes/${recentlyAddedRecipe._id}`);
        // If the recently added recipe is found, create a link to it
        const recipeLink = `<a href="/recipes/${recentlyAddedRecipe._id}" class="link">${recentlyAddedRecipe.title}</a><br>`;
        // Append the link to the recently added list
        $("#recently-added-list").append(recipeLink);
      }
    })
    .fail((xhr, status, error) => {
      console.error("Error fetching recipes:", error);
    });
}
