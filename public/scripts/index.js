const tags = [];
const searchTags = [];

const createTags = () => {
  $("#tags").empty();
  tags.forEach((t) => {
    const tag = `<div class="tag sort">${t}</div>`;
    $("#tags").append(tag);
  });
  if (searchTags.length > 0) {
    const clear = `<button class="tag clear">Clear Filters</button>`;
    $("#tags").append(clear);
  }
};

const categorySort = (recipes) => {
  const categories = {};
  recipes.forEach((recipe, i) => {
    const category = recipe.category;
    console.log("Category: ", category);
    if (!categories[category]) {
      categories[category] = [];
      let categoryHTML = `<div id="category-${category}" class="category">
                            <h1 class="letter-animation">${category}</h1>
                            <div class="scroll-wrapper">
                              <div class="scroll-button-L" id="left-${category}">&lt;</div> 
                              <div class="recipes-container">                         
                                <div class="recipes"></div>
                              </div>
                              <div class="scroll-button-R" id="right-${category}">&gt;</div>
                            </div>  
                          </div>`;
      $("#lists").append(categoryHTML);
    }
    categories[category].push(recipe);
  });

  Object.keys(categories).forEach((category) => {
    const categoryRecipes = categories[category];
    categoryRecipes.forEach((recipe, i) => {
      const rec = `
          <div style="background-image:url('${recipe.images[0]}')" class="recipe-block">
              <div class="rm-cont">
                  <div class="rm" id="${recipe._id}">X</div>
              </div>
              <a id="rec-${i}" class="title" href="/recipes/${recipe._id}"><div>${recipe.title}</div></a>
              <div class="tag-cont" id="tags-${category}-${i}"></div>
          </div>`;
      $(`#category-${category} .recipes`).append(rec);
      recipe.tags.forEach((g) => {
        g = g.trim();
        tags.indexOf(g) == -1 && tags.push(g);
        const tag = `<div class="tag">${g}</div>`;
        $(`#tags-${category}-${i}`).append(tag);
        console.log(`${category}: ${tag}`);
      });
    });
    handleScroll(category);
  });
};
function handleScroll(category) {
  const recipesContainer = $(`#category-${category} .recipes-container`);
  const scrollLeft = $(`#category-${category} .scroll-button-L`);
  const scrollRight = $(`#category-${category} .scroll-button-R`);
  const scrollAmount = $(`#category-${category} .recipe-block`).outerWidth(
    true
  );
  console.log(scrollAmount);
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
  handleTagOverflow(category);
}
function handleTagOverflow(category) {
  const tagContainers = $(`#category-${category} .tag-cont`);
  tagContainers.each(function () {
    const container = $(this);
    const tags = container.children(".tag");
    let totalWidth = 0;
    let visibleWidth = container.width();
    let tagCount = 0;
    let hiddenTags = [];

    tags.each(function () {
      totalWidth += $(this).outerWidth(true);
      if (totalWidth > visibleWidth) {
        $(this).hide();
        tagCount++;
        hiddenTags.push(this);
      }
    });

    if (tagCount > 0) {
      container.append(
        `<div class="tag hidden-placeholder">+${tagCount}</div>`
      );
    }

    container.children(".hidden-placeholder").on("click", function () {
      container.children(".tag:hidden").toggle();
      $(this).hide();
      container.append(`<div class="hide-overflow">less</div>`);
    });

    container.on("click", ".hide-overflow", function () {
      $(hiddenTags).slice(0, tagCount).hide();
      container.children(".hidden-placeholder").show();
      $(this).remove();
    });
  });
}
const loadRecipes = (recipes) => {
  console.log("Loading Recipes: ", recipes);
  $("#lists").empty();
  tags.length = 0;
  categorySort(recipes);
  createTags();
};

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

$("#tags").on("click", ".sort", function () {
  const tag = $(this).text();
  searchTags.indexOf(tag) == -1 && searchTags.push(tag);
  console.log(searchTags);
  const searchString = searchTags.join(",");
  console.log(searchString);
  $.get(`/search?tag=${searchString}`, (data) => loadRecipes(data));
});

$(document).on("click", ".tag.clear", function () {
  searchTags.length = 0;
  $(this).remove();
  refresh();
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
