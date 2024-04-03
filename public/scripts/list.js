recentlyAdded();
$(function () {
  $("#add").on("click", function () {
    addStatSection();
    recentlyAdded();
    $("#stat-img").attr(
      "src",
      "https://cdn.dribbble.com/users/614270/screenshots/2534654/loader01.gif"
    );
    $("#stat").text("Loading Recipe");
    const body = {
      url: $("#rurl").val(),
    };
    $.post("/addrecipe", body, (data) => {
      if (data.title.length < 1) {
        $("#stat-img").attr(
          "src",
          "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXM2MXNscDBxeGNnNDAzeDB4eXhsY2p5NmlldDh0ZzZsZjBrcm5jciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26ybwvTX4DTkwst6U/giphy.gif" /* "https://i.giphy.com/media/OiC5BKaPVLl60/200w.webp" */
        );
        $("#stat").text(
          "Oops! Something went wrong. Please make sure the link you entered is from minimalistbaker.com"
        );
        return;
      } else {
        $("#stat-img").attr("src", data.images[0]);
        $("#stat").text("Recipe Successfully Added!");
        recentlyAdded();
        addStatSection();
      }
    }).fail(() => {
      $("#stat-img").attr(
        "src",
        /*ORIGINAL "https://i.giphy.com/media/OiC5BKaPVLl60/200w.webp" */ "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXM2MXNscDBxeGNnNDAzeDB4eXhsY2p5NmlldDh0ZzZsZjBrcm5jciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/26ybwvTX4DTkwst6U/giphy.gif"
      );
      $("#stat").text("Oops! Something went wrong.");
      addStatSection();
    });
  });
  $("#rurl").on("dblclick", function () {
    this.select();
  });
});
function recentlyAdded() {
  $.get("/recipes")
    .done((recipes) => {
      const latestRecipes = recipes.slice(0, 5);
      $(".recipes").empty();
      latestRecipes.forEach((recentRecipe, i) => {
        const recipeHTML = `<div style="background-image:url('${recentRecipe.images[0]}')" class="recipe-block">
                <a id="rec-${i}" class="title" href="/recipes/${recentRecipe._id}">
                  <div>${recentRecipe.title}</div>
                </a>
              </div>`;
        $("#recently-added-list .recipes").append(recipeHTML);
        handleScroll();
      });
    })
    .fail((xhr, status, error) => {
      console.error("Error fetching recipes:", error);
    });
}
function handleScroll() {
  const recipesContainer = $(`#recently-added-list .recipes-container`);
  const scrollLeft = $(`#recently-added-list .scroll-button-L`);
  const scrollRight = $(`#recently-added-list .scroll-button-R`);
  const scrollAmount = $(`#recently-added-list .recipe-block`).outerWidth(true);
  scrollLeft.on("click", function () {
    recipesContainer.animate(
      { scrollLeft: "-=" + scrollAmount },
      "fast",
      "easeInOutCubic"
    );
  });

  scrollRight.on("click", function () {
    recipesContainer.animate(
      { scrollLeft: "+=" + scrollAmount },
      "fast",
      "easeInOutCubic"
    );
  });
}

function addStatSection() {
  if ($("#stat").length === 0) {
    const statImg = `<img id="stat-img" src="">`;
    const stat = `<div id="stat"></div>`;
    $("#status").append(stat);
    $("#status").append(statImg);
  }
}
