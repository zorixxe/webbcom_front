console.log("app.js init");

async function dogAPI() {
  console.log("dogAPI() init");
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();
  document.querySelector("#dogApi img").setAttribute("src", `${data.message}`);
}

async function boredAPI() {
  console.log("boredAPI() init");
  const response = await fetch("https://www.boredapi.com/api/activity");
  const data = await response.json();
  document.querySelector("#boredApi #activity").innerHTML = `${data.activity}`;
  document.querySelector("#boredApi #participants").innerHTML = `Participants required: ${data.participants}`;
  document.querySelector("#boredApi #price span").style.width = data.price * 100 + "%";
  document.querySelector("#boredApi #accessibility span").style.width = data.accessibility * 100 + "%";
  document.querySelector("#boredApi #priceText").innerHTML = "Price: " + data.price * 10 + " / 10";
  document.querySelector("#boredApi #accessibilityText").innerHTML = "Accessibility: " + data.accessibility * 10 + " / 10";
}

/* async function dateAPI() {
  const dateObj = new Date();
  let month = dateObj.getUTCMonth() + 1;
  let day = dateObj.getUTCDate();
  const response = await fetch(`http://numbersapi.com/${month}/${day}/date`);
  document.querySelector("#dateApi p").innerHTML = await response.text();
} */

async function weatherAPI() {
  console.log(" good weather init bruv");

  const weatherDesc = document.querySelector(".weatherDesc");
  const weatherImg = document.createElement("img");
  const temperature = document.querySelector(".temperature");
  const wind = document.querySelector(".wind");
  const weatherIcon = document.querySelector(".weatherIcon");

  const getPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  let lat;
  let lon;

  try {
    const position = await getPosition();
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log(lon);
    console.log(lat);
  } catch (error) {
    console.log("user does not allow location");
    weatherDesc.textContent = "Please allow location"
    return;
  }

  const key = localStorage.getItem('OpenWeatherKey');

  if (key == null || key == "") {
    console.log("No Weather API key found");
    weatherDesc.textContent = "No Weather API key found"
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?&lat=${lat}&lon=${lon}&units=metric&appid=${key}`
    );
    const data = await response.json();

    console.log(data);
    console.log("end of me");

    const conditionCode = data.weather[0].id;
    const conditionDesc = data.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;

    const temp = data.main.temp.toFixed(1);
    temperature.textContent = `${temp}°C`;

    const windSpeed = data.wind.speed.toFixed(1);
    wind.textContent = `${windSpeed} m/s`;

    weatherDesc.textContent = conditionDesc;
    weatherImg.src = iconUrl;
    weatherIcon.appendChild(weatherImg);
  } catch (error) {
    weatherDesc.textContent = "Error, check API key."
    console.error(error);
  }
}


async function mealAPI() {
  console.log("meal is good() init");
  try {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await response.json();

    const mealInfo = data.meals[0];

    let ingredientsList = '<ul>';
    for (let i = 1; i <= 20; i++) {
      if (mealInfo[`strIngredient${i}`]) {
        ingredientsList += `<li>${mealInfo[`strIngredient${i}`]} - ${mealInfo[`strMeasure${i}`]}</li>`;
      }
    }
    ingredientsList += '</ul>';

    const mealAPIResult = document.querySelector('#mealAPI');
    const mealAPIResultText = document.querySelector('#mealAPIText');
    const mealAPIThings = document.querySelector('#mealAPIThings');



    mealAPIResult.innerHTML = `
      <h3>${mealInfo.strMeal}</h3>
      <img id="mealIMG" src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}">
      
    `;

    mealAPIResultText.innerHTML = `
      <p id="mealText">${mealInfo.strInstructions}</p>
    `;

    mealAPIThings.innerHTML = `
    ${ingredientsList}
    `;

    if (data) {
      document.querySelector("#mealAPI img").addEventListener("click", function () {
        document.querySelector("#mealAPIText").classList.toggle("hidden");
      })
    }

  } catch (error) {
    console.log(error);
  }
}

async function gptAPI() {
  console.log("gptAPI() init");
  const key = localStorage.getItem('OpenAIKey');
  const prompt = document.querySelector("#gptInput").value;
  const output = document.querySelector("#gptAPI p");
  if (key == null || key == "") { output.innerHTML = "No API key found"; return; }
  output.innerHTML = "Loading..."
  //const response = await fetch(`https://openai-ama-api-fw-teaching.rahtiapp.fi/?api_key=${key}`, {//simulation
  const response = await fetch(`https://openai-ama-api-fw-teaching.rahtiapp.fi/?api_key=${key}`, { //using tokens
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prompt)
  });
  if (response.ok) {
    const data = await response.json();
    output.innerHTML = data.answer;
    document.querySelector("#gptAPI textarea").removeAttribute("disabled");
    document.querySelector("#gptAPI input[type='button']").removeAttribute("disabled");

    console.log(data);
  }
  else {
    output.innerHTML = "Error, check OpenAI API key";
    console.log("gptAPI error");
  }
}

document.querySelector("#gptAPI form input[type='button']").addEventListener("click", () => {
  gptAPI();
  document.querySelector("#gptAPI textarea").setAttribute("disabled", "yes");
  document.querySelector("#gptAPI input[type='button']").setAttribute("disabled", "yes");
})

document.querySelector("#gptAPI form").addEventListener('keydown', (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    gptAPI(e);
    document.querySelector("#gptAPI textarea").setAttribute("disabled", "yes");
    document.querySelector("#gptAPI input[type='button']").setAttribute("disabled", "yes");

  }
})

const API_URL = "http://128.214.253.222:8448";
const API_KEY = localStorage.getItem('api_key');

async function getUser() {

  if (!localStorage.getItem('api_key')) {
    return console.log("getUser() No API key found");
  }
  const resp = await fetch(API_URL + "/users?api_key=" + API_KEY);
  //          http://128.214.253.222:8002/guests/1?api_key=f7e9e8c1-408a-4e43-a11a-5d181aa7a5df
  const respJson = await resp.json();

  console.log(respJson);
  document.querySelector("#user").innerText = respJson.username;

}



//ToDo API start..............................................................................................
async function todoAPI() {

  if (!localStorage.getItem('api_key')) {
    return console.log("todoAPI() No API key found");
  }
  console.log("todoAPI() init");
  const response = await fetch(API_URL + "/todo?api_key=" + API_KEY, {
    method: 'GET'
  });
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    const todoList = document.querySelector("#todoAPI #todoList");
    todoList.innerHTML = " ";
    for (let i = 0; i < data.length; i++) {
      const todoItem = document.createElement("div");
      const rawdate = new Date(data[i].due_date);
      const duedate = rawdate.toLocaleDateString('fi-FI');
      const category = data[i].category_name;
      todoItem.classList.add("todoItem", `${category}`);
      todoItem.innerHTML = `
      <div class="todoItemLeft">
        <p id="${data[i].id}" class="todoTitle">${data[i].title}</p>
        <p class="duedate">Due date: ${duedate}</p>
      </div>
      <div class="todoItemRight"> 
        <p id="category">${category.toUpperCase()}</p>
        <p class="delete">DEL</p>
      </div>
      `;

      todoList.appendChild(todoItem);
      todoItem.querySelector(".todoItemLeft").addEventListener("click", () => {
        console.log("edit" + data[i].id);
        todoAPIopenedit(data[i].id, data[i].title, rawdate.toISOString().substring(0, 10));
      })
    }

    document.querySelectorAll("#todoAPI #todoList .todoItem .delete").forEach(item => {
      item.addEventListener("click", () => {
        console.log("del");
        todoAPIdelete(item.parentElement.parentElement.querySelector(".todoTitle").id);
      })
    })

  }
  else {
    console.log("todoAPI error");
  }
}

async function todoAPIopenedit(id, title, date) {
  editWindow.classList.remove("hidden");
  document.querySelector("#editWindow input[type='text']").value = title;
  document.querySelector("#editWindow input[type='date']").value = date;
  document.querySelector("#editWindow select").value = null;
  document.querySelector("#editX").addEventListener("click", () => {
    location.reload();
  });
  document.querySelector("#editWindow form").addEventListener("submit", (e) => {
    e.preventDefault();
    todoAPIedit(id);
  })
}

async function todoAPIpost() {
  console.log("todoAPIpost()");
  const category_id = document.querySelector("#todoAPI select").value;
  const title = document.querySelector("#todoAPI input[type='text']").value;
  const due_date = document.querySelector("#todoAPI input[type='date']").value;
  const response = await fetch(API_URL + "/todo?api_key=" + API_KEY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ category_id: category_id, title: title, due_date: due_date }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    todoAPI();
  }
}

async function todoAPIdelete(id) {
  const response = await fetch(API_URL + "/todo/" + id + "?api_key=" + API_KEY, {
    method: 'DELETE',
  });
  if (response.ok) {
    console.log("todoAPIdelete() on " + id + " success");
    todoAPI();
  }
}

async function todoAPIedit(id) {

  const category_id = document.querySelector("#editWindow select").value;
  const title = document.querySelector("#editWindow input[type='text']").value;
  const due_date = document.querySelector("#editWindow input[type='date']").value;

  const response = await fetch(API_URL + "/todo/" + id + "?api_key=" + API_KEY, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ category_id: category_id, title: title, due_date: due_date }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    location.reload();
  }
}


document.querySelector("#todoAPI form").addEventListener("submit", (e) => {
  e.preventDefault();
  todoAPIpost();
})

document.querySelector("#todoAPI form select").addEventListener("change", () => {
  console.log("change");
  const sel = document.querySelector("#todoAPI form select");
  const button = document.querySelector("#todoAPI form input[type='submit']");
  button.className = "";
  button.className = sel.options[sel.selectedIndex].text.toLowerCase();
});

// const response = await fetch `https://api.openweathermap.org/data/2.5/weather?&lat=${lat}&lon=${lon}&appid=${key}`;
// const data = await response.json();
// const description = data.weather[0].description;
// const temperature = data.main.temp;
// const feelsLike = data.main.feels_like;

weatherAPI();
dogAPI();
boredAPI();
// dateAPI();
mealAPI();
getUser();
todoAPI();



document.querySelector("#cogwheel").addEventListener("click", () => {
  if (localStorage.getItem("OpenAIKey") != null) {
    document.querySelector("#settingsBox #OpenAIKey").value = localStorage.getItem("OpenAIKey");
  }
  if (localStorage.getItem("OpenWeatherKey") != null) {
    document.querySelector("#settingsBox #OpenWeatherKey").value = localStorage.getItem("OpenWeatherKey");
  }
  if (localStorage.getItem("api_key") != null) {
    document.querySelector("#settingsBox #ToDoKey").value = localStorage.getItem("api_key");
  }
  document.querySelector("#settings").classList.toggle("hidden");
  document.querySelector("#cogwheel").classList.toggle("active");
});

document.querySelector("#X").addEventListener("click", () => {
  document.querySelector("#settings").classList.toggle("hidden");
  document.querySelector("#cogwheel").classList.toggle("active");
});

document.querySelector("#settingsBox input[type='button']").addEventListener("click", () => {
  localStorage.setItem("OpenAIKey", document.querySelector("#settingsBox #OpenAIKey").value);
  localStorage.setItem("OpenWeatherKey", document.querySelector("#settingsBox #OpenWeatherKey").value);
  localStorage.setItem("api_key", document.querySelector("#settingsBox #ToDoKey").value);

  location.reload();
});

