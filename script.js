const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealEl = document.getElementById('meals');
const resultHeading = document.getElementsByClassName('resut_heading');
const single_mealEl = document.getElementById('single_meal');

// Search meals Function
function searchMeal(e) {
    e.preventDefault();

    //Clear single Meal
    single_mealEl.innerHTML = "";

    // Get Search Meals
    const term = search.value;

    // Cheack for Empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then((res) => res.json)
            .then((data) => {
                resultHeading.innerHTML = `<h2>Search result for ${term}`
                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>The are no result for ${term}`
                } else {
                    mealEl.innerHTML = data.meals.map(
                        (meal) => `
                    <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                    ${meal.strMeal}
                    </div>
                    </div>
                    `
                    )
                        .join("");
                }
            })

    } else {
        alert('please insart a value in Search')
    }
}

// Fetch meal by id
function getMealById(mealID) {
    fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    ).then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal)
        });
}
// Add meal to DOM

function addMealToDOM(meal) {
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        console.log({ i, ing: `strIngredient${i}` });
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`
            ${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}
            `);
        } else {
            break;
        }
    }
    single_mealEl.innerHTML = `
        <div class="single_meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
        <div class="single_meal_info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredient</h2>
        <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        </div>
        </div>
        `
}

// Even listerners
submit.addEventListener('submit', searchMeal);
mealEl.addEventListener('click', e => {
    const item = e.target;
    let mealInfo;
    if (item.classList && item.classList.contains("meal-info")) {
        mealInfo = item;
    } else {
        mealInfo = false;
        if (mealInfo) {
            const mealID = mealInfo.dataset["mealid"];
            getMealById(mealID)

        }
    }
})