import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.css";
import Navigation from "./components/navigation";
import Searchbar from "./components/searchbar";
import asemat from "./asemat";
import Datatable from "./components/datatable";
// Alkuperäinen datankäsittelijäfunktio jota kutsutaan searchbar-komponentista.
// Palauttaa datan luettavaan muotoon datatablen table-elementtiin
// Tämän kutsuu searchbar-komnponentin handleOptionClick-funktio
export function showData(d) {
  var timevaluepairshot = d.locations[0].data.tmax.timeValuePairs;
  var timevaluepairscold = d.locations[0].data.tmin.timeValuePairs;
  // Koko vuoden max- ja mintemp erillisiksi funktioiksi
  var maxtemp = timevaluepairshot.reduce((init, currentvalue, currentindex) => {
    return init.value < currentvalue.value ? currentvalue : init;
  });
  var mintemp = timevaluepairscold.reduce(
    (init, currentvalue, currentindex) => {
      return init.value > currentvalue.value ? currentvalue : init;
    }
  );
  var lastmonthmax = lastMonthMax(timevaluepairshot);
  var lastmonthmin = lastMonthMin(timevaluepairscold);
  var lastweekmax = lastWeekMax(timevaluepairshot);
  var lastweekmin = lastWeekMin(timevaluepairscold);

  // Tämä oli kokeilu
  /*
  var text = `Ajan ${new Date(d.info.begin).getDate()}.${new Date(
    d.info.begin
  ).getMonth()}.${new Date(d.info.begin).getFullYear()} - ${new Date(
    d.info.end
  ).getDate()}.${new Date(d.info.end).getMonth()}.${new Date(
    d.info.end
  ).getFullYear()}
     max-lämpötila asemalla ${d.locations[0].info.name} oli ${
    maxtemp.value
  } astetta (${new Date(maxtemp.time).getDate()}.${
    new Date(maxtemp.time).getMonth() + 1
  }.${new Date(maxtemp.time).getFullYear()})`;
  var node = document.createElement("h3");
  var textnode = document.createTextNode(text);
  node.appendChild(textnode);
  document.getElementById("datatable").appendChild(node);
  */

  document.getElementById(
    "last-365-days-hot"
  ).textContent = `${maxtemp.value.toFixed(1)} (${new Date(
    maxtemp.time
  ).getDate()}.${new Date(maxtemp.time).getMonth() + 1}.${new Date(
    maxtemp.time
  ).getFullYear()})`;
  document.getElementById(
    "last-365-days-cold"
  ).textContent = `${mintemp.value.toFixed(1)} (${new Date(
    mintemp.time
  ).getDate()}.${new Date(mintemp.time).getMonth() + 1}.${new Date(
    mintemp.time
  ).getFullYear()})`;
  document.getElementById(
    "last-30-days-hot"
  ).textContent = `${lastmonthmax.value.toFixed(1)} (${new Date(
    lastmonthmax.time
  ).getDate()}.${new Date(lastmonthmax.time).getMonth() + 1}.${new Date(
    lastmonthmax.time
  ).getFullYear()})`;
  document.getElementById(
    "last-30-days-cold"
  ).textContent = `${lastmonthmin.value.toFixed(1)} (${new Date(
    lastmonthmin.time
  ).getDate()}.${new Date(lastmonthmin.time).getMonth() + 1}.${new Date(
    lastmonthmin.time
  ).getFullYear()})`;
  document.getElementById(
    "last-7-days-hot"
  ).textContent = `${lastweekmax.value.toFixed(1)} (${new Date(
    lastweekmax.time
  ).getDate()}.${new Date(lastweekmax.time).getMonth() + 1}.${new Date(
    lastweekmax.time
  ).getFullYear()})`;
  document.getElementById(
    "last-7-days-cold"
  ).textContent = `${lastweekmin.value.toFixed(1)} (${new Date(
    lastweekmin.time
  ).getDate()}.${new Date(lastweekmin.time).getMonth() + 1}.${new Date(
    lastweekmin.time
  ).getFullYear()})`;
  document.getElementById("last-day-hot").textContent = `${timevaluepairshot[
    timevaluepairshot.length - 1
  ].value.toFixed(1)} (${new Date(
    timevaluepairshot[timevaluepairshot.length - 1].time
  ).getDate()}.${
    new Date(timevaluepairshot[timevaluepairshot.length - 1].time).getMonth() +
    1
  }.${new Date(
    timevaluepairshot[timevaluepairshot.length - 1].time
  ).getFullYear()})`;
  document.getElementById("last-day-cold").textContent = `${timevaluepairscold[
    timevaluepairscold.length - 1
  ].value.toFixed(1)} (${new Date(
    timevaluepairscold[timevaluepairscold.length - 1].time
  ).getDate()}.${
    new Date(
      timevaluepairscold[timevaluepairscold.length - 1].time
    ).getMonth() + 1
  }.${new Date(
    timevaluepairscold[timevaluepairscold.length - 1].time
  ).getFullYear()})`;
}
// Tätä funktiota kutsutaan searchbar-komponentista. Funktio hakee str-parametria (käyttäjän syöttämä)
// vastaavat tulokset asemat-muuttujasta (asemat.js) ja palauttaaa tulokset kutsuvan funktion käyttöön
export function returnStations(str) {
  var matchList = [];
  var searchRegex = new RegExp(str, "i");
  if (str.length > 1) {
    asemat.forEach((value, index) => {
      if (searchRegex.test(value[0])) {
        matchList.push(value);
      }
    });
    return matchList;
  } else {
    asemat.forEach((value, index) => {
      matchList.push(value);
    });
    return matchList;
  }
}
function lastMonthMax(arr) {
  return arr
    .slice(
      arr.length -
        new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(),
      arr.length
    )
    .reduce((init, currentvalue, currentindex) => {
      return init.value < currentvalue.value ? currentvalue : init;
    });
}
function lastMonthMin(arr) {
  return arr
    .slice(
      arr.length -
        new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate(),
      arr.length
    )
    .reduce((init, currentvalue, currentindex) => {
      return init.value > currentvalue.value ? currentvalue : init;
    });
}
function lastWeekMax(arr) {
  return arr
    .slice(arr.length - 7, arr.length)
    .reduce((init, currentvalue, currentindex) => {
      return init.value < currentvalue.value ? currentvalue : init;
    });
}
function lastWeekMin(arr) {
  return arr
    .slice(arr.length - 7, arr.length)
    .reduce((init, currentvalue, currentindex) => {
      return init.value > currentvalue.value ? currentvalue : init;
    });
}

ReactDOM.render(
  <React.StrictMode>
    <Navigation />
    <Searchbar />
    <Datatable elements={Datatable.elements} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
