"use strict";
console.log(">> Ready :)");

let series = [];
const favSeries = [];
const inputText = document.querySelector(".js-input");
const buttonSearch = document.querySelector(".js-button");
//const mainList = document.querySelector(".js-list");

const defImage = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";

// traer datos del servidor/API

const getDataFromServer = () => {
  return fetch(`http://api.tvmaze.com/search/shows?q=${inputText.value}`)
    .then(response => response.json())
    .then(data => {
      console.log("Fetch data from server and return it as JSON >>> Return", data);
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
  //for (const palette of data.palettes) {
  // for (let i = 0; i < data.length; i = i + 1) {
  //   searchResult.push({
  //     name: data[i].show.name,
  //     image: data[i].show.image.medium
  // }
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
  console.log("Paint series form `series` array into DOM >>> series:", series, "Favourites:", favSeries);
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
  console.log("Listen click on new serie DOM elements");
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
  console.log("Get clicked palette from event and return the clicked palette index >>> Clicked palette:", clickedSerieIndex);
  return clickedSerieIndex;
};

const isFavSerie = serieIndex => {
  const foundIndex = favSeries.indexOf(series[serieIndex]);
  // acción + operación matemática =0 --> boolean
  if (foundIndex >= 0) {
    console.log(`Check if serieIndex ${serieIndex} it is favourite >>>`, true);
    return true;
  } else {
    console.log(`Check if serieIndex ${serieIndex} it is not favourite >>>`, false);
    return false;
  }
};

const addFav = serieIndex => {
  // Tenemos que pasarle el objeto entero para llamarlo de LS
  favSeries.push(series[serieIndex]);
  //favSeries.push(serieIndex);
  console.log("Add serieIndex to `favSeries` array >>> Favourites:", favSeries);
  paintFavSeries();
  getSeriesFromLS();
  setSeriesIntoLS();
  paintSeries();
  listenSeries();
};

const removeFav = serieIndex => {
  const favIndex = favSeries.indexOf(series[serieIndex]);
  favSeries.splice(favIndex, 1);
  console.log("Remove paletteIndex from `favSeries` array >>> Favourites:", favSeries);
  paintFavSeries();
  listenSeries();
};

// Escribir (set) y recuperar (get) datos del Local Storage
const getSeriesFromLS = () => {
  return JSON.parse(localStorage.getItem("favSeries"));
};

const setSeriesIntoLS = () => {
  localStorage.setItem("favSeries", JSON.stringify(favSeries));
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
