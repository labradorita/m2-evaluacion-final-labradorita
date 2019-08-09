"use strict";

let series = [];
let favSeries = [];
const inputText = document.querySelector(".js-input");
const buttonSearch = document.querySelector(".js-button");

const defImage = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";

// Escribir (set) y recuperar (get) datos del Local Storage
const getSeriesFromLS = () => {
  // separar el return y la constante
  const data = JSON.parse(localStorage.getItem("favSeries"));
  // si data contiene datos
  if (!!data === true) {
    favSeries = data;
  }
  //return data;
};

const setSeriesIntoLS = () => {
  localStorage.setItem("favSeries", JSON.stringify(favSeries));
};

// Recoger favoritos al refrescar
const startSearch = () => {
  const seriesFromLS = getSeriesFromLS();
  if (seriesFromLS === null) {
    buttonSearch.addEventListener("click", getDataFromServer);
  } else {
    //saveFavsInFav(seriesFromLS);
    paintFavSeries();
    buttonSearch.addEventListener("click", getDataFromServer);
  }
};

// traer datos del servidor/API y devolverlos en formato JSON

const getDataFromServer = () => {
  return fetch(`http://api.tvmaze.com/search/shows?q=${inputText.value}`)
    .then(response => response.json())
    .then(data => {
      data = formatData(data);
      saveDataInSeries(data);
      paintSeries();
      listenSeries();
      getSeriesFromLS();
      setSeriesIntoLS(); //despues de guardar
    });
};

// creamos array de las peliculas buscadas, con los datos necesarios
const formatData = function(data) {
  const searchResult = [];
  for (const serieItem of data) {
    searchResult.push({
      name: serieItem.show.name,
      image: defaultImage(serieItem)
    });
  }

  console.log("Format JSON data and return it as array >>> Return", searchResult);
  return searchResult;
};

// poner imagen para las que no tenga imagen
const defaultImage = function(serieItem) {
  if (serieItem.show.image === null) {
    return "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
  } else {
    return serieItem.show.image.medium;
  }
};

//Guarda los datos en el array
const saveDataInSeries = data => {
  // guardar datos en array creada al inicio
  series = data;
  console.log("Save data in series array >> series", series);
};

const paintSeries = () => {
  // cojo elemento contenedor del DOM
  const mainList = document.querySelector(".js-list");
  // declaramos string vacío para pasarlo por el innerHTML
  let htmlCode = "";
  for (let serieIndex = 0; serieIndex < series.length; serieIndex = serieIndex + 1) {
    htmlCode += `<div class="series__item 
    ${getFavClassName(serieIndex)}
    js-serie" data-index="${serieIndex}">`;
    htmlCode += `<img  class="series__image" src="${series[serieIndex].image}" alt="">`;
    htmlCode += `<p class="series__name
    ${getFavClassName(serieIndex)}">${series[serieIndex].name}</p>`;
    htmlCode += "</div>";
  }
  mainList.innerHTML = htmlCode;
};

const getFavClassName = serieIndex => {
  if (isFavSerie(serieIndex)) {
    return "serie__item--favourite";
  } else {
    return "";
  }
};

// Esuchar si se ha hecho click (fav) y coger esa acción
const listenSeries = () => {
  const serieContainer = document.querySelectorAll(".js-serie");
  for (const serieContainerIndex of serieContainer) {
    serieContainerIndex.addEventListener("click", handleClick);
  }
};

// en el handle vemos si esta o no clickada como fav
const handleClick = ev => {
  // cogemos la serie seleccionada/clickada
  const serieIndex = getClickedSerieIndex(ev);
  if (isFavSerie(serieIndex)) {
    removeFav(serieIndex);
  } else {
    addFav(serieIndex);
  }

  paintFavSeries();
  setSeriesIntoLS();
  getSeriesFromLS();
  paintSeries();
  listenSeries();
  // Actualizar LS con los favoritos
  getSeriesFromLS();
  setSeriesIntoLS();
};

const getClickedSerieIndex = ev => {
  // currentTarget sobre el que escucho el ev
  const currentTarget = ev.currentTarget;
  // index es una propiedad añadida con data-*, la convertimos a nº
  const clickedSerieIndex = parseInt(currentTarget.dataset.index);
  return clickedSerieIndex;
};

const isFavSerie = serieIndex => {
  const found = favSeries.some(item => item.name === series[serieIndex].name);
  return found;
};

const addFav = serieIndex => {
  if (isFavSerie(serieIndex) === false) {
    // Tenemos que pasarle el objeto entero para llamarlo de LS
    favSeries.push(series[serieIndex]);
    console.log("Add serie Index to `favSeries` array >>> Favourites:", favSeries);
  }
};

const removeFav = serieIndex => {
  const favIndex = favSeries.indexOf(series[serieIndex]);
  favSeries.splice(favIndex, 1);
  console.log("Remove from array `favSeries`>>> Favourites:", favSeries);
};

const paintFavSeries = () => {
  //debugger;
  const favUl = document.querySelector(".js-listFav");
  let htmlCodeFav = "";
  for (let favIndexx = 0; favIndexx < favSeries.length; favIndexx = favIndexx + 1) {
    htmlCodeFav += `<li class="fav__item js-fav">`;
    htmlCodeFav += `<img class="fav__image" src="${favSeries[favIndexx].image}">`;
    htmlCodeFav += `<p class="fav__name">${favSeries[favIndexx].name}</p></li>`;
  }
  favUl.innerHTML = htmlCodeFav;
};

buttonSearch.addEventListener("click", getDataFromServer);
startSearch();

//# sourceMappingURL=main.js.map
