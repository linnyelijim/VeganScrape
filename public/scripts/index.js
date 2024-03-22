const tags = [];
const searchTags = [];

const createTags = () => {
  $("#tags").empty();
  tags.forEach((t) => {
    const tag = `<div class="tag sort">${t}</div>`;
    $("#tags").append(tag);
  });
};

const categorySort = (recipes) => {
  const categories = {};
  recipes.forEach((recipe, i) => {
    const category = recipe.category;
    console.log("Category: ", category);
    if (!categories[category]) {
      categories[category] = [];
      let categoryHTML = `<div id="category-${category}">
                              <h2>${category}</h2>
                              <div class="recipes"></div>
                            </div>`;
      $("#lists").append(categoryHTML);
    }
    categories[category].push(recipe);
  });

  Object.keys(categories).forEach((category) => {
    const categoryRecipes = categories[category];
    categoryRecipes.forEach((recipe, i) => {
      console.log(recipe.images[i]);
      const rec = `
          <div style="background-image:url('${recipe.images[0]}')" class="recipe-block">
              <div class="rm-cont">
                  <div class="rm" id="${recipe._id}">X</div>
              </div>
              <a id="rec-${i}" class="title" href="/recipes/${recipe._id}"><div>${recipe.title}</div></a>
              <div class="tag-cont" id="tags-${i}"></div>
              </div>`;
      $(`#category-${category} .recipes`).append(rec);
      recipe.tags.forEach((g) => {
        console.log(`Tags from db ${g}`);
        g = g.trim();
        tags.indexOf(g) == -1 && tags.push(g);
        const tag = `
              <div class="tag">${g}</div>`;
        $(`#tags-${i}`).append(tag);
      });
      console.log(tags);
    });
  });
};

const loadRecipes = (recipes) => {
  console.log("Loading Recipes: ", recipes);
  $("#lists").empty();
  tags.length = 0;
  categorySort(recipes);
  createTags();
};

/* const loadRecipes = (recipes) => {
  console.log("Loading Recipes: ", recipes);
  $(".recipes").empty();
  tags.length = 0;
  recipes.forEach((recipe, i) => {
    console.log(recipe.images[i]);
    const rec = `
        <div style="background-image:url('${recipe.images[0]}')" class="recipe-block">
            <div class="rm-cont">
                <div class="rm" id="${recipe._id}">X</div>
            </div>
            <a id="rec-${i}" class="title" href="/recipes/${recipe._id}"><div>${recipe.title}</div></a>
            <div class="tag-cont" id="tags-${i}"></div>
            <div class="category">Category: ${recipe.category}></div>
            </div>`;
    $(".recipes").append(rec);
    recipe.tags.forEach((g) => {
      console.log(`Tags from db ${g}`);
      g = g.trim();
      tags.indexOf(g) == -1 && tags.push(g);
      const tag = `
            <div class="tag">${g}</div>`;
      $(`#tags-${i}`).append(tag);
    });
    console.log(tags);
  });
  createTags();
}; */

const refresh = () => {
  $.get("/recipes")
    .done((data) => {
      console.log("Recipes data recieved: ", data);
      searchTags.length = 0;
      loadRecipes(data);
    })
    .fail((xhr, status, error) => {
      console.error("Error fetching recipes: ", error);
    });
};

refresh();

$("#refresh").on("click", function () {
  refresh();
});

$("#recipes").on("mouseover", ".rm-cont", function () {
  console.log("hover");
  const rm = $(this).children();
  rm.css("visibility", "visible");
});

$("#recipes").on("mouseout", ".rm-cont", function () {
  $(this).children().css("visibility", "hidden");
});

$("#tags").on("click", ".sort", function () {
  const tag = $(this).text();
  searchTags.indexOf(tag) == -1 && searchTags.push(tag);
  console.log(searchTags);
  const searchString = searchTags.join(",");
  console.log(searchString);
  $.get(`/search?tag=${searchString}`, (data) => loadRecipes(data));
});

$("body").on("click", ".rm", function () {
  const id = $(this).attr("id");
  $.ajax({
    url: `/remove/${id}`,
    type: "DELETE",
    success: function (result) {
      console.log(result);
      window.location.reload();
    },
  });
});
