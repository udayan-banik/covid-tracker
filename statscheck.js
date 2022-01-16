function urlcheck() {
  console.clear();

  var getty = document.getElementById("form");

  //var choice = getty.elements.choice.value;

  var disp = document.getElementById("demo");

  disp.innerHTML = "";

  //var state = getty.elements.state.value;

  var StateCode = getty.elements.state.value;

  var url1 = "https://api.covid19india.org/v4/min/timeseries.min.json";
  var url = "https://data.incovid19.org/v4/min/data.min.json";
  var url3 = "https://api.covid19india.org/v4/min/data-all.min.json";

  //var url = "https://api.covid19india.org/v4/min/"++".json";
  // var url = "https://data.covid19india.org/v4/min/data.min.json"; 2021

  inf = new Intl.NumberFormat("en-IN");
  /*switch(choice) {
  case 1:
    url = url1;
    break;
  case 2:
    url = url2;
    break;
  case 3:
    url = url3;
    break;
  default:
    url = '#';
}*/

  var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "json";
    xhr.onload = function () {
      if (xhr.status === 200) callback(null, xhr.response);
      else callback(xhr.status, xhr.response);
    };

    xhr.send();
  };

  getJSON(url, function (err, data) {
    if (err !== null) console.log("something went wrong" + err);
    else if (err == null) {
      console.log(data);
      console.log(data[StateCode].total); /*start*/

      // myFormat(data, StateCode);

      createTable(data, StateCode);

      addRow(data, StateCode);
    }
  });

  function createTable(data, StateCode) {
    var tbl = document.createElement("table");
    tbl.setAttribute("id", "stats_table");
    var thd = tbl.createTHead();
    var hrow = thd.insertRow(0);
    var hcell0 = hrow.insertCell(0);
    var hcell1 = hrow.insertCell(1);
    var hcell2 = hrow.insertCell(2);
    var hcell3 = hrow.insertCell(3);
    var hcell4 = hrow.insertCell(4);
    var hcell5 = hrow.insertCell(5);
    var hcell6 = hrow.insertCell(6);

    //rgb(232, 26, 63);rgb(97, 131, 141);rgb(26, 232, 133);rgb(241, 130, 82);rgb(241, 82, 232);rgb(241, 82, 188);

    hcell0.innerHTML =
      "<b>Confirmed </b>" +
      "<span style='color:rgb(178 3 34)'><b>" +
      "(&#129145;" +
      myFormat(data[StateCode].delta.confirmed) +
      ")" +
      "</b></span>";
    hcell1.innerHTML = "<b>Active </b>" /*+
      "<span style='color:rgb(110 5 128)'><b>" +
      "(&#129145;" +
      myFormat(
        data[StateCode].delta.confirmed -
          data[StateCode].delta.deceased -
          data[StateCode].delta.recovered
      ) +
      ")" +
      "</b></span>" */;
    hcell2.innerHTML =
      "<b>Deceased </b>" +
      "<span style='color:rgb(2 84 108)'><b>" +
      "(&#129145;" +
      myFormat(data[StateCode].delta.deceased) +
      ")" +
      "</b></span>";
    hcell3.innerHTML =
      "<b>Recovered </b>" +
      "<span style='color:rgb(0 118 61)'><b>" +
      "(&#129145;" +
      myFormat(data[StateCode].delta.recovered) +
      ")" +
      "</b></span>";
    hcell4.innerHTML =
      "<b>Tested </b>" +
      "<span style='color:rgb(212 84 29)'><b>" +
      "(&#129145;" +
      myFormat(data[StateCode].delta.tested) +
      ")" +
      "</b></span>";
    hcell5.innerHTML =
      "<b>Partially Vaccinated </b>" +
      "<span style='color:rgb(106 2 100)'><b>" +
      "(&#129145;" +
      myFormat(data[StateCode].delta.vaccinated1) +
      ")" +
      "</b></span>";
    hcell6.innerHTML =
      "<b>Fully Vaccinated </b>" +
      "<span style='color:rgb(110 5 75)'><b>" +
      "(&#129145;" +
      myFormat(data[StateCode].delta.vaccinated2) +
      ")" +
      "</b></span>";

    tbl.createTBody();
    tbl.setAttribute("cellspacing", "3.5");
    disp.appendChild(tbl);
  }

  function addRow(data, StateCode) {
    var tbl = document.getElementById("stats_table");
    var tbody = tbl.tBodies[0];
    var trow = tbody.insertRow(-1);

    var cell0 = trow.insertCell(0);
    var cell1 = trow.insertCell(1);
    var cell2 = trow.insertCell(2);
    var cell3 = trow.insertCell(3);
    var cell4 = trow.insertCell(4);
    var cell5 = trow.insertCell(5);
    var cell6 = trow.insertCell(6);

    cell0.innerHTML =
      data[StateCode].total.confirmed != undefined
        ? inf.format(data[StateCode].total.confirmed)
        : "";
    cell1.innerHTML =
      data[StateCode].total.confirmed -
        data[StateCode].total.deceased -
        data[StateCode].total.recovered !=
      undefined
        ? inf.format(
            data[StateCode].total.confirmed -
              data[StateCode].total.deceased -
              data[StateCode].total.recovered
          )
        : "";
    cell2.innerHTML =
      data[StateCode].total.deceased != undefined
        ? inf.format(data[StateCode].total.deceased)
        : "";
    cell3.innerHTML =
      data[StateCode].total.recovered != undefined
        ? inf.format(data[StateCode].total.recovered)
        : "";
    cell4.innerHTML =
      data[StateCode].total.tested != undefined
        ? inf.format(data[StateCode].total.tested)
        : "";
    cell5.innerHTML =
      data[StateCode].total.vaccinated1 != undefined
        ? inf.format(data[StateCode].total.vaccinated1)
        : "";
    cell6.innerHTML =
      data[StateCode].total.vaccinated2 != undefined
        ? inf.format(data[StateCode].total.vaccinated2)
        : "";
  }
} /*end*/

function myFormat(str) {
  formatted = "";
  if (str == undefined) return 0;
  str = str.toString();
  // data[StateCode].delta.confirmed.toString();
  // str2 = data[StateCode].total.deceased.toString()
  // str3 = data[StateCode].total.recovered.toString()
  // str4 = data[StateCode].total.tested.toString()
  // str5 = data[StateCode].total.vaccinated2.toString()

  len = str.length;
  if (len > 7)
    formatted =
      str.substring(0, len - 7) + "." + str.substring(len - 7, len - 6) + "Cr";
  else if (len > 5)
    formatted =
      str.substring(0, len - 5) + "." + str.substring(len - 5, len - 4) + "L";
  else if (len > 3)
    formatted =
      str.substring(0, len - 3) + "." + str.substring(len - 3, len - 2) + "k";
  else formatted = str;

  return formatted;
  console.log(formatted);
}

function myFunction() {
  var x = document.getElementById("myTopnav");

  if (x.className === "topnav") x.className += " responsive";
  else x.className = "topnav";
}

/*
 * var formatted = "";
 * confirmed = number of confirmed cases, delta
 * str = confirmed.toString(), string version
 * len = str.length
 * if (len > 5)
 *  formatted = str.substring(0, len-5) + "." + str.substring(len-5, len-4) + "L";
 * else if (len > 3)
 *  formatted = str.substring(0, len-3) + "." + str.substring(len-3, len-2) + "k";
 * else if (len > 7)
 *  similar logic, suffix will be "Cr";
 */
