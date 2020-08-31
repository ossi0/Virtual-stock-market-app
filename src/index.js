import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import Navigation from "./components/navigation";
import Searchbar from "./components/searchbar";
import asemat from "./asemat";
import Datatable from "./components/datatable";
import Tempgraph from "./components/tempgraph";
import * as d3 from "d3";
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

  // Lopuksi kutsutaan kuvaajanpiirtäjäfunktio
  drawGraph(
    timevaluepairshot.slice(
      timevaluepairshot.length - 30,
      timevaluepairshot.length
    ),
    timevaluepairscold.slice(
      timevaluepairscold.length - 30,
      timevaluepairscold.length
    )
  );
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

// Piirtää lämpötilakuvaajan kun käyttäjä valitsee mittausaseman
function drawGraph(hot, cold) {
  // Tarkistetaan onko kuvaaja jo ennestään olemassa
  if (document.getElementById("tempgraph").children.length > 0) {
    d3.select("svg").remove();
  }
  // set the dimensions and margins of the graph
  var margin = { top: 30, right: 30, bottom: 30, left: 30 },
    width = window.innerWidth * 0.65 - 60,
    height = width * 0.6;

  // append the svg object to the body of the page
  var svg = d3
    .select("#tempgraph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3
    .scaleTime()
    .domain(
      d3.extent(hot, function (d) {
        return d.time;
      })
    )
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var y = d3
    .scaleLinear()
    .domain([
      d3.min(cold, function (d) {
        return +d.value;
      }),
      d3.max(hot, function (d) {
        return +d.value;
      }),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add the line
  svg
    .append("path")
    .datum(hot)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.time);
        })
        .y(function (d) {
          return y(d.value);
        })
    );

  svg
    .append("path")
    .datum(cold)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.time);
        })
        .y(function (d) {
          return y(d.value);
        })
    );
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
    <Tempgraph />
  </React.StrictMode>,
  document.getElementById("root")
);
