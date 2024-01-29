$(document).ready(function () {
  $("#btn").click(function () {
    $(".sidebar").toggleClass("open");
    menuBtnChange();
  });

  function menuBtnChange() {
    if ($(".sidebar").hasClass("open")) {
      $("#clos").removeClass("fa-bars");
      $("#btn").removeClass("fa-bars").addClass("fa-xmark");
      $(".nav-footer .footer p").removeClass("none");
      new WOW().init();
    } else {
      $("#clos").addClass("fa-bars");
      $("#btn").removeClass("fa-xmark").addClass("fa-bars");
      $(".nav-footer .footer p").addClass("none");
    }
  }
});

/********  loading  ********/

function load() {
  let loader = `
  <div class="loader"></div>
  `;
  $("#load").html(loader)
  
}

function stopLoading() {
  $("#load").remove()
}

let searchContainer = document.getElementById("searchContainer");
let assign = document.getElementById("assign");
//console.log(assign);
let container = $("#container");

/**************  search  ****************/
function search() {
  searchContainer.innerHTML = `
  <div class="row pt-4 flex-md-row flex-sm-column">
  <div class="col-md-6 inputSearch mb-4">
      <input id="inputsearchbyname" oninput="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
  </div>
  <div class="col-md-6 inputSearch">
      <input id="inputsearchbyletter" oninput="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
  </div>
</div>`;

  container.html("");
}

let byname = $("#inputsearchbyname");
let byletter = $("#inputsearchbyletter");

$(document).ready(function () {
  $("#search").click(function () {
    search();
  });
});

async function searchByName(name) {
  load();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  response = await response.json();

  if (response.meals) {
    displayMeals(response.meals);
  } else {
    displayMeals([]);
  }
  stopLoading();
}

async function searchByFLetter(latter) {
  load();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${latter}`
  );
  response = await response.json();
  if (response.meals) {
    displayMeals(response.meals);
  } else {
    displayMeals([]);
  }
  stopLoading();
}

function displayMeals(data) {
  let cartoona = ``;
  for (let i = 0; i < data.length; i++) {
    cartoona += `
      <div class="col-12 col-sm-12 col-md-4 col-lg-3">
        <div onclick="getMealDetails('${data[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 imageee">
          <img class="w-100" src="${data[i].strMealThumb}" alt="" srcset="">
          <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
            <h3>${data[i].strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  }
  container.html(cartoona);
}

async function getRandomMeals() {
  searchContainer.innerHTML = '';
  load();
  const meals = [];
  for (let i = 0; i < 20; i++) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await response.json();
    meals.push(...data.meals);
  }
  displayMeals(meals);
    stopLoading();
}
async function getInitialMeals() {
  getRandomMeals();
}
window.onload = function () {
  getInitialMeals();
};

/*          get categories         */
async function getCategories() {
  searchContainer.innerHTML = "";
  load();
  
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let response = await api.json();

  //console.log(response);
  displayCategories(response.categories);
  stopLoading();
}

function displayCategories(data) {
  let showCategories = "";
  for (let i = 0; i < data.length; i++) {
    showCategories += `
        <div class="col-12 col-md-4 col-lg-3">
            <div onclick="getCategoryMeals('${
              data[i].strCategory
            }')" class="meal position-relative overflow-hidden rounded-2 imageee ">
                <img class="w-100" src="${
                  data[i].strCategoryThumb
                }" alt="" srcset="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${data[i].strCategory}</h3>
                    <p>${data[i].strCategoryDescription
                      .split(" ")
                      .slice(0, 15)
                      .join(" ")}</p>
                </div>
            </div>
        </div>
        `;
  }
  container.html(showCategories);
}

$(document).ready(function () {
  $("#cate").click(function () {
    getCategories();
  });
});

async function getCategoryMeals(category) {
  searchContainer.innerHTML = "";
  load();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
  stopLoading();
}

/********************* area **********************/
async function getArea() {
  searchContainer.innerHTML = "";
  load();
  let api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let response = await api.json();
  // console.log(response);
  displayArea(response.meals);
 
}

/**************** area  *****************/
function displayArea(data) {
  let showArea = "";
  for (let i = 0; i < data.length; i++) {
    showArea += `
    <div onclick="getAreaMeals('${data[i].strArea}')"  class="col-12 col-md-4 col-lg-3 area-home ">
    <div class="rounded-2 text-center cursor-pointer">
    <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${data[i].strArea}</h3>
    </div>
</div>
    `;
  }
  container.html(showArea);
}

$(document).ready(function () {
  $("#area").click(function () {
    getArea();
  });
});

async function getAreaMeals(area) {
  searchContainer.innerHTML = "";
  load();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
  stopLoading();
}

/************  Ingredients  ***********/

async function getIngredients() {
  searchContainer.innerHTML = "";
  load();
  let abi = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let response = await abi.json();
  //console.log(response);
  displayIngredients(response.meals);
  stopLoading();
}

function displayIngredients(data) {
  let showIngredients = "";
  for (let i = 0; i < data.length; i++) {
    showIngredients += `
      <div onclick="getIngredientsMeals('${
        data[i].strIngredient
      }')" class="col-12 col-md-4 col-lg-3 ingerdientss">
      <div class="rounded-2 text-center cursor-pointer">
      <i class="fa-solid fa-utensils fa-3x"></i>
              <h3 class="fs-5">${data[i].strIngredient}</h3>
              <p class="fs-6">${
                data[i].strDescription
                  ? data[i].strDescription.split(" ").slice(0, 17).join(" ")
                  : ""
              }</p>
      </div>
  </div>
      `;
  }
  container.html(showIngredients);
}
$(document).ready(function () {
  $("#Ingredients").click(function () {
    getIngredients();
  });
});

async function getIngredientsMeals(ingredients) {
  searchContainer.innerHTML = "";
  load();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  response = await response.json();
  displayMeals(response.meals.slice(0, 20));
  stopLoading();
}

/********************  detailes  ********************/

function displayMealDetails(meal) {
  searchContainer.innerHTML = "";
  let ingredientsHtml = ``;
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredientsHtml += `
      <div class="ingredient-item">
        <span class="measure">${meal[`strMeasure${i}`]}</span>
        <span class="ingredient">${meal[`strIngredient${i}`]}</span>
      </div>`;
    }
  }

  let tagsHtml = "";
  if (meal.strTags) {
    const tags = meal.strTags.split(",");
    tagsHtml = tags
      .map(
        (tag) => `
    <div class="tag-item">
      ${tag}
    </div>`
      )
      .join("");
  }
  let assign = `
  <div class="col-md-4  ">
              <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                  alt="">
                  <h2>${meal.strMeal}</h2>
          </div>
          <div class="col-md-8">
              <h2>Instructions</h2>
              <p>${meal.strInstructions.split(" ").slice(0, 70).join(" ")}</p>
              <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
              <h3><span class="fw-bolder">Category : </span>${
                meal.strCategory
              }</h3>
              <h3>Recipes :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${ingredientsHtml}
              </ul>

              <h3>Tags :</h3>
              <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsHtml}
              </ul>
              <a target="_blank" href="${
                meal.strSource
              }" class="btn btn-success">Source</a>
              <a target="_blank" href="${
                meal.strYoutube
              }" class="btn btn-danger">Youtube</a>
          </div>`;

  container.html(assign);
}

async function getMealDetails(mealID) {
  searchContainer.innerHTML = "";
  load();
  searchContainer.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  respone = await respone.json();
  displayMealDetails(respone.meals[0]);
}

/******************* Contact Us *********************/

let validName = false;
let validEmail = false;
let validPhone = false;
let validAge = false;
let validPassword = false;
let validRePassword = false;
let submitBtn;

function contact() {
  searchContainer.innerHTML = "";
  let cartoona = `
    <section id="contact">
      <div class="container px-1 px-lg-5">
        <h2 class="fs-1 text-center text-light mb-5">Contact Us</h2>
        <form>
          <div class="row g-4 justify-content-center">
            <div class="col-lg-6 position-relative">
              <i class="fa fa-check bg-green"></i>
              <i class="fa fa-close bg-red"></i>
              <input id="yourName" class="w-100" type="text" name="name" placeholder="Enter Your Name" oninput="validNameInput()" required>
              <div class="validation-card">"Your name should have at least 3 characters."</div>
            </div>
            <div class="col-lg-6 position-relative">
              <i class="fa fa-check bg-green"></i>
              <i class="fa fa-close bg-red"></i>
              <input id="yourEmail" class="w-100" type="email" name="email" placeholder="Enter Your Email" oninput="validEmailInput()" required>
              <div class="validation-card">"You should enter a valid email."</div>
            </div>
            <div class="col-lg-6 position-relative">
              <i class="fa fa-check bg-green"></i>
              <i class="fa fa-close bg-red"></i>
              <input id="yourPhone" class="w-100" type="tel" name="phone" placeholder="Enter Your Phone" oninput="validPhoneInput()" required>
              <div class="validation-card">"You should enter a valid number ex:0105 0961 200."</div>
            </div>
            <div class="col-lg-6 position-relative">
              <i class="fa fa-check bg-green"></i>
              <i class="fa fa-close bg-red"></i>
              <input id="yourAge" class="w-100" type="number" name="age" placeholder="Enter Your Age" oninput="validAgeInput()" required>
              <div class="validation-card">"You should enter a valid age."</div>
            </div>
            <div class="col-lg-6 position-relative">
              <i class="fa fa-check bg-green"></i>
              <i class="fa fa-close bg-red"></i>
              <input id="yourPassword" class="password w-100" type="password" name="password" placeholder="Enter Your Password" oninput="validPasswordInput()" required>
              <div class="validation-card">"Your password should have at least 8 characters, 1 UPPERCASE, 1 lowercase, 1 number, 1 $peci@l ch@r@cter."</div>
            </div>
            <div class="col-lg-6 position-relative">
            <i class="fa fa-check bg-green"></i>
            <i class="fa fa-close bg-red"></i>
            <input id="yourRePassword"  class="w-100" type="password" name="repassword" placeholder="Re-enter Your Password" oninput="validRePasswordInput()" required>
            <div class="validation-card">"You should have matched passwords."</div>
          </div>
            <button id="submitBtn" disabled class="btn btn-outline-warning mt-5" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </section>
  `;

  container.html(cartoona);

  submitBtn = document.getElementById("submitBtn");
}

function validHandler(elem) {
  $(elem).removeClass("non-valid");
  $(elem).addClass("valid");
  $(elem).next().slideUp();

  updateSubmitButton();
}

function nonValidHandler(elem) {
  $(elem).removeClass("valid");
  $(elem).addClass("non-valid");
  $(elem).next().slideDown();

  updateSubmitButton();
}

function updateSubmitButton() {
  const isFormValid =
    validName &&
    validEmail &&
    validPhone &&
    validAge &&
    validPassword &&
    validRePassword;
  submitBtn.disabled = !isFormValid;
}

function isValidName(name) {
  var validName = /^\w{3,}(\s+\w+)*$/;
  return validName.test(name);
}

function validNameInput() {
  validName = isValidName(yourName.value);
  if (validName) {
    validHandler(yourName);
  } else {
    nonValidHandler(yourName);
  }
}

function isValidEmail(email) {
  var validEmail = /^.+@[a-zA-Z]+(\.[a-zA-Z]+)+$/;
  return validEmail.test(email);
}

function validEmailInput() {
  validEmail = isValidEmail(yourEmail.value);
  if (validEmail) {
    validHandler(yourEmail);
  } else {
    nonValidHandler(yourEmail);
  }
}

function isValidPhone(phone) {
  var validPhone = /^(\+2)*01(1|0|2|5){1}[0-9]{8}$/;
  return validPhone.test(phone);
}

function validPhoneInput() {
  validPhone = isValidPhone(yourPhone.value);
  if (validPhone) {
    validHandler(yourPhone);
  } else {
    nonValidHandler(yourPhone);
  }
}

function isValidAge(age) {
  var validAge = /^[1-9]{1}[0-9]{0,1}$/;
  return validAge.test(age);
}

function validAgeInput() {
  validAge = isValidAge(yourAge.value);
  if (validAge) {
    validHandler(yourAge);
  } else {
    nonValidHandler(yourAge);
  }
}

function isValidPassword(password) {
  var validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/;
  return validPassword.test(password);
}

function validPasswordInput() {
  validPassword = isValidPassword(yourPassword.value);
  if (validPassword) {
    validHandler(yourPassword);
  } else {
    nonValidHandler(yourPassword);
  }
}

function isValidRePassword(repassword) {
  var validRePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).{8,}$/;
  return validRePassword.test(repassword);
}

function validRePasswordInput() {
  validRePassword = isValidRePassword(yourRePassword.value);
  if (validRePassword) {
    validHandler(yourRePassword);
  } else {
    nonValidHandler(yourRePassword);
  }
}

$("#contactUs").click(function () {
  contact();
});
