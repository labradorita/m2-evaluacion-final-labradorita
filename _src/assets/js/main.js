"use strict";
console.log(">> Ready :)");

let series = [];
const favSeries = [];
const inputText = document.querySelector(".js-input");
const buttonSearch = document.querySelector(".js-button");
//const mainList = document.querySelector(".js-list");

const defImage = "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";

// methods to fetch data from server

const getDataFromServer = () => {
  return fetch(`http://api.tvmaze.com/search/shows?q=${inputText.value}`)
    .then(response => response.json())
    .then(data => {
      console.log("Fetch data from server and return it as JSON >>> Return", data);
      data = formatData(data);
      saveDataInSeries(data);
      paintSeries();
      listenSeries();
      // setPalettesIntoLocalStorage();
    });
};

// creamos array de las peliculas buscadas, con los datos necesarios
const formatData = data => {
  const searchResult = [];
  //for (const palette of data.palettes) {
  for (let i = 0; i < data.length; i = i + 1) {
    searchResult.push({
      image: data[i].show.image.medium,
      name: data[i].show.name
    });
  }
  console.log("Format JSON data and return it as array >>> Return", searchResult);
  return searchResult;
};

//Guarda los datos en el array
const saveDataInSeries = data => {
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
    ${getFavoriteClassName(serieIndex)}
    js-serie" data-index="${serieIndex}">`;
    htmlCode += `<img  class="series__image" src="${series[serieIndex].image}" alt="">`;
    htmlCode += `<p class="series__name">${series[serieIndex].name}</p>`;
    htmlCode += "</div>";
  }
  mainList.innerHTML = htmlCode;
  console.log("Paint series form `series` array into DOM >>> series:", series, "Favorites:", favSeries);
};

const getFavoriteClassName = serieIndex => {
  if (isFavoriteSerie(serieIndex)) {
    return "serie__item--favorite";
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

const handleClick = ev => {
  console.log("Handle click on a palette DOM element");
  const serieIndex = getClickedSerieIndex(ev);
  if (isFavoriteSerie(serieIndex)) {
    removeFavorite(serieIndex);
  } else {
    addFav(serieIndex);
  }
  paintSeries();
  listenSeries();
};

const getClickedSerieIndex = ev => {
  const currentTarget = ev.currentTarget;
  const clickedSerieIndex = parseInt(currentTarget.dataset.index);
  console.log("Get clicked palette from event and return the clicked palette index >>> Clicked palette:", clickedSerieIndex);
  return clickedSerieIndex;
};

const isFavoriteSerie = serieIndex => {
  const foundIndex = favSeries.indexOf(series[serieIndex]);
  // acción + operación matemática =0 --> boolean, no tiene logica
  if (foundIndex >= 0) {
    console.log(`Check if serieIndex ${serieIndex} it is favorite >>>`, true);
    return true;
  } else {
    console.log(`Check if serieIndex ${serieIndex} it is not favorite >>>`, false);
    return false;
  }
};

const addFav = serieIndex => {
  // Tenemos que pasarle el objeto entero para llamarlo de LS
  favSeries.push(series[serieIndex]);
  //favSeries.push(serieIndex);
  console.log("Add serieIndex to `favSeries` array >>> Favorites:", favSeries);
};

const removeFavorite = serieIndex => {
  const favoriteIndex = favSeries.indexOf(series[serieIndex]);
  favSeries.splice(favoriteIndex, 1);
  console.log("Remove paletteIndex from `favSeries` array >>> Favourites:", favSeries);
};

buttonSearch.addEventListener("click", getDataFromServer);
