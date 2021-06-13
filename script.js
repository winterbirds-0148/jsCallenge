bgImgUrls = ['https://i.ibb.co/wMZtGD6/pexels-quintin-gellar-313782.jpg',
  'https://i.ibb.co/4PqDSwJ/pexels-pixabay-326311.jpg', 'https://i.ibb.co/z55nXrf/pexels-tyler-lastovich-997443.jpg',
  'https://i.ibb.co/SwWZ3Vw/pexels-philippe-donn-1169754.jpg',
  'https://i.ibb.co/mN17kZ9/pexels-james-wheeler-1519088.jpg',
  'https://i.ibb.co/Z6hFc9G/pexels-pixabay-268415.jpg']

const backGround = document.querySelector('body');
const bgImg = Math.floor(Math.random() * bgImgUrls.length + 1) - 1;
const greetings = document.querySelector('.greetings');
const inputForm = document.querySelector('.inputFrom');
const input = document.querySelector('.inputUserName');
const clock = document.querySelector('.clock');
const todoDiv = document.querySelector('.todoDiv');
const weather = document.querySelector('.weather');
backGround.style.backgroundImage = `url(${bgImgUrls[bgImg]})`

function getTime() {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds()
  const timeText = `
  ${hour < 10 ? `0${hour}` : hour} : 
  ${minute < 10 ? `0${minute}` : minute} : 
  ${second < 10 ? `0${second}` : second}`
  clock.innerHTML = timeText
}

function getWeather() {
  const api_key = 'ef01247124852f9a71c51d4c2cd469a4'
  navigator.geolocation.getCurrentPosition((position) =>{
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    fetch(url).then(response => response.json()).then(data => {
        console.log(data)
        weather.innerHTML = `${data.weather[0].main} / ${data.main.temp}℃   @${data.name}`
    });
  })
}

function storgeUserName(e){
  localStorage.setItem("userName", e.target.value)
}

const form = document.querySelector(".inputTodoForm"),
  todoInput = form.querySelector("input");
const pendingList = document.querySelector(".pending-ul");
const finList = document.querySelector(".finished-ul");
let toDosPen = [];
let toDosFin = [];

function saveToDosPen() {
  const list = pendingList.getElementsByTagName("li");
  for (let i = 0; i < list.length; i++) {
    list[i].id = i + 1;
    toDosPen[i].id = i + 1;
  }
  localStorage.setItem("toDosPen", JSON.stringify(toDosPen));
}
function saveToDosFin() {
  const list = finList.getElementsByTagName("li");
  for (let i = 0; i < list.length; i++) {
    list[i].id = i + 1;
    toDosFin[i].id = i + 1;
  }
  localStorage.setItem("toDosFin", JSON.stringify(toDosFin));
}
function deletePen(event) {
  const btn = event.target;
  const li = btn.parentNode;
  pendingList.removeChild(li);
  const cleanTodos = toDosPen.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  toDosPen = cleanTodos;
  saveToDosPen();
}
function deleteFin(event) {
  const btn = event.target;
  const li = btn.parentNode;
  finList.removeChild(li);
  const cleanTodos = toDosFin.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  toDosFin = cleanTodos;
  saveToDosFin();
}
function moveToFin(event) {
  const btn = event.target;
  const li = btn.parentNode;
  pendingList.removeChild(li);
  const cleanTodos = toDosPen.filter(function (toDo) {
    if (toDo.id === parseInt(li.id)) addTaskToFinished(toDo.text);
    return toDo.id !== parseInt(li.id);
  });
  toDosPen = cleanTodos;
  saveToDosPen();
}
function moveToPen(event) {
  const btn = event.target;
  const li = btn.parentNode;
  finList.removeChild(li);
  const cleanTodos = toDosFin.filter(function (toDo) {
    if (toDo.id === parseInt(li.id)) addTaskToPending(toDo.text);
    return toDo.id !== parseInt(li.id);
  });
  toDosFin = cleanTodos;
  saveToDosFin();
}
function addTaskToPending(text) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const finBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = toDosPen.length + 1;
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deletePen);
  finBtn.innerText = "✔";
  finBtn.addEventListener("click", moveToFin);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(finBtn);
  li.id = newId;
  pendingList.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId
  };
  toDosPen.push(toDoObj);
  saveToDosPen();
}

function addTaskToFinished(text) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const backBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = toDosFin.length + 1;
  delBtn.innerText = "❌";
  delBtn.addEventListener("click", deleteFin);
  backBtn.innerText = "⏪";
  backBtn.addEventListener("click", moveToPen);
  span.innerText = text;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(backBtn);
  li.id = newId;
  finList.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId
  };
  toDosFin.push(toDoObj);
  saveToDosFin();
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = todoInput.value;
  addTaskToPending(currentValue);
  todoInput.value = "";
}

function loadToDos() {
  const loadedToDosPen = localStorage.getItem("toDosPen");
  if (loadedToDosPen !== null) {
    const parsedToDos = JSON.parse(loadedToDosPen);
    parsedToDos.forEach(function (toDo) {
      addTaskToPending(toDo.text);
    });
  }
  const loadedToDosFin = localStorage.getItem("toDosFin");
  if (loadedToDosFin !== null) {
    const parsedToDos = JSON.parse(loadedToDosFin);
    parsedToDos.forEach(function (toDo) {
      addTaskToFinished(toDo.text);
    });
  }
}



function init() {
  setInterval(getTime, 1000);
  getWeather();
  const userName = localStorage.getItem("userName");
  if (userName === null) {
    greetings.innerHTML = "Hello, Please Enter Your Username"
    inputForm.style.visibility = 'visible';
    input.addEventListener('change', storgeUserName)
    todoDiv.style.visibility = 'hidden';
  } else {
    greetings.innerHTML = `Hello, ${userName}`
    inputForm.style.visibility = 'hidden';
    todoDiv.style.visibility = 'visible';
    loadToDos();
    form.addEventListener("submit", handleSubmit);
  }
}

init();
