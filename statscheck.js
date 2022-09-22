const statesObj = [
  {
    code: "1",
    state: "Andaman and Nicobar Islands",
    Abbreviation: "AN"
  },
  {
    code: "2",
    state: "Andhra Pradesh",
    Abbreviation: "AP"
  },
  {
    code: "3",
    state: "Arunachal Pradesh",
    Abbreviation: "AR"
  },
  {
    code: "4",
    state: "Assam",
    Abbreviation: "AS"
  },
  {
    code: "5",
    state: "Bihar",
    Abbreviation: "BR"
  },
  {
    code: "6",
    state: "Chandigarh",
    Abbreviation: "CH"
  },
  {
    code: "7",
    state: "Chhattisgarh",
    Abbreviation: "CT"
  },
  {
    code: "8",
    state: "Dadra and Nagar Haveli and Daman and Diu",
    Abbreviation: "DN"
  },
  {
    code: "9",
    state: "Delhi",
    Abbreviation: "DL"
  },
  {
    code: "10",
    state: "Goa",
    Abbreviation: "GA"
  },
  {
    code: "11",
    state: "Gujarat",
    Abbreviation: "GJ"
  },
  {
    code: "12",
    state: "Haryana",
    Abbreviation: "HR"
  },
  {
    code: "13",
    state: "Himachal Pradesh",
    Abbreviation: "HP"
  },
  {
    code: "14",
    state: "Jammu and Kashmir",
    Abbreviation: "JK"
  },
  {
    code: "15",
    state: "Jharkhand",
    Abbreviation: "JH"
  },
  {
    code: "16",
    state: "Karnataka",
    Abbreviation: "KA"
  },
  {
    code: "17",
    state: "Kerala",
    Abbreviation: "KL"
  },
  {
    code: "18",
    state: "Ladakh",
    Abbreviation: "LA"
  },
  {
    code: "19",
    state: "Lakshadweep",
    Abbreviation: "LD"
  },
  {
    code: "20",
    state: "Madhya Pradesh",
    Abbreviation: "MP"
  },
  {
    code: "21",
    state: "Maharashtra",
    Abbreviation: "MH"
  },
  {
    code: "22",
    state: "Manipur",
    Abbreviation: "MN"
  },
  {
    code: "23",
    state: "Meghalaya",
    Abbreviation: "ML"
  },
  {
    code: "24",
    state: "Mizoram",
    Abbreviation: "MZ"
  },
  {
    code: "25",
    state: "Nagaland",
    Abbreviation: "NL"
  },
  {
    code: "26",
    state: "Odisha",
    Abbreviation: "OR"
  },
  {
    code: "27",
    state: "Puducherry",
    Abbreviation: "PY"
  },
  {
    code: "28",
    state: "Punjab",
    Abbreviation: "PB"
  },
  {
    code: "29",
    state: "Rajasthan",
    Abbreviation: "RJ"
  },
  {
    code: "30",
    state: "Sikkim",
    Abbreviation: "SK"
  },
  {
    code: "31",
    state: "Tamil Nadu",
    Abbreviation: "TN"
  },
  {
    code: "32",
    state: "Telangana",
    Abbreviation: "TG"
  },
  {
    code: "33",
    state: "Tripura",
    Abbreviation: "TR"
  },
  {
    code: "34",
    state: "Uttar Pradesh",
    Abbreviation: "UP"
  },
  {
    code: "35",
    state: "Uttarakhand",
    Abbreviation: "UT"
  },
  {
    code: "36",
    state: "West Bengal",
    Abbreviation: "WB"
  }
];

function urlcheck() {
  // console.clear();

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

      createTable(data, StateCode);

        statesObj.forEach(d => data[d["Abbreviation"]].name = d["state"]);
        data["TT"].name = "India";

        if (StateCode === "TT") {
          Object.keys(data).filter(d => d!=="TT").sort()
            .forEach(
              d => addRow(data, d)
            )
          addRow(data, "TT");
        } else
          addRow(data, StateCode);
    }
  });

  // currently depricated since csv files doesn't load in remote repositories
  // so we use stateObj instead
  function csvToJson(url, success) {
    var xht = new XMLHttpRequest();
    xht.open("GET", url, true);
    xht.onload = () => {
      const lines = xht.response.split("\r\n");
      const keys = lines[0].split(",");

      const data = lines.slice(1).filter(line => line!=="").map(line => {
        return line.split(",").reduce((row, data, index) => {
          row[keys[index]] = data;
          return row;
        }, {});
      });

      success(data);
    };

    xht.send();
  }

  function sortColumn(columnIndex) {

    // this piece of code is taken from w3schools
    // for more information visit
    // https://www.w3schools.com/howto/howto_js_sort_table.asp

    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("stats_table");

    rows = table.rows;
    var header = rows[0].childNodes[columnIndex];

    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 2); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].childNodes[columnIndex];
        y = rows[i + 1].childNodes[columnIndex];
        //check if the two rows should switch place:

        // if cells are unsorted or sorted in descending order sort in ascending
        if ((header.sortOrder == 0 || header.sortOrder == 2) && x.sortKey > y.sortKey) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;

        // if cells are sorted in ascending order sorting in decsending order
        } else if (header.sortOrder == 1 && x.sortKey < y.sortKey) {
          shouldSwitch = true;
          break;
        } else if (header.sortOrder > 2 || header.sortOrder < 0)
          break;
      }

      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }

    if (header.sortOrder == 0 || header.sortOrder == 2)
      header.sortOrder = 1;
    else if (header.sortOrder == 1)
      header.sortOrder = 2;
  }

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
    var hcell7 = hrow.insertCell(7);

    /*
     * sortOrder
     * 0: unsorted
     * 1: ascending
     * 2: decending
     */

    //rgb(232, 26, 63);rgb(97, 131, 141);rgb(26, 232, 133);rgb(241, 130, 82);rgb(241, 82, 232);rgb(241, 82, 188);
    hcell0.innerHTML = 
      "<b>State/UT</b>";
    
    hcell0.sortOrder = 0;
    hcell0.addEventListener("click", e => { e.stopPropagation(); sortColumn(0); });  
      
    hcell1.innerHTML =
    "<b>Confirmed </b>";
    hcell1.sortOrder = 0;
    hcell1.addEventListener("click", e => { e.stopPropagation(); sortColumn(1); });

    hcell2.innerHTML = "<b>Active </b>";
    hcell2.sortOrder = 0;
    hcell2.addEventListener("click", e => { e.stopPropagation(); sortColumn(2); });

    hcell3.innerHTML =
      "<b>Deceased </b>";
    hcell3.sortOrder = 0;
    hcell3.addEventListener("click", e => { e.stopPropagation(); sortColumn(3); });
    
    hcell4.innerHTML =
      "<b>Recovered </b>";
    hcell4.sortOrder = 0;
    hcell4.addEventListener("click", e => { e.stopPropagation(); sortColumn(4); });
    
    hcell5.innerHTML =
      "<b>Tested </b>";
    hcell5.sortOrder = 0;
    hcell5.addEventListener("click", e => { e.stopPropagation(); sortColumn(5); });

    hcell6.innerHTML =
      "<b>Partially Vaccinated </b>";
    hcell6.sortOrder = 0;
    hcell6.addEventListener("click", e => { e.stopPropagation(); sortColumn(6); });

    hcell7.innerHTML =
      "<b>Fully Vaccinated </b>";
    hcell7.sortOrder = 0;
    hcell7.addEventListener("click", e => { e.stopPropagation(); sortColumn(7); });

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
    var cell7 = trow.insertCell(7);

    var activeDelta = data[StateCode].delta.confirmed?data[StateCode].delta.confirmed:0;
    activeDelta -= data[StateCode].delta.recovered?data[StateCode].delta.recovered:0;
    activeDelta -= data[StateCode].delta.deceased?data[StateCode].delta.deceased:0;
    activeDelta -= data[StateCode].delta.other?data[StateCode].delta.other:0;

    var active = data[StateCode].total.confirmed?data[StateCode].total.confirmed:0;
    active -= data[StateCode].total.recovered?data[StateCode].total.recovered:0;
    active -= data[StateCode].total.deceased?data[StateCode].total.deceased:0;
    active -= data[StateCode].total.other?data[StateCode].total.other:0;

    cell0.innerHTML = 
      data[StateCode].name;
    cell0.sortKey = data[StateCode].name;

    cell1.innerHTML =
      data[StateCode].total.confirmed != undefined
        ? "<span style='color:rgb(178 3 34)'><b>" +
        myFormat(data[StateCode].delta.confirmed) +
        "</b></span><br />" +
        inf.format(data[StateCode].total.confirmed)
        : "";

    cell1.sortKey = data[StateCode].delta.confirmed?+data[StateCode].delta.confirmed:0;
    
    cell2.innerHTML = 
    active >= 0 ?
    "<span style='color:rgb(110 5 128)'><b>" +
      myFormat(
        activeDelta
      ) +
      "</b></span><br />" + 
      inf.format(active)
      : "";
    cell2.sortKey = activeDelta;
    
    cell3.innerHTML =
      data[StateCode].total.deceased != undefined
        ? "<span style='color:rgb(2 84 108)'><b>" +
        myFormat(data[StateCode].delta.deceased) +
        "</b></span><br />" + 
        inf.format(data[StateCode].total.deceased)
        : "";
    cell3.sortKey = data[StateCode].delta.deceased?+data[StateCode].delta.deceased:0;
      
    cell4.innerHTML =
      data[StateCode].total.recovered != undefined
        ? "<span style='color:rgb(0 118 61)'><b>" +
        myFormat(data[StateCode].delta.recovered) +
        "</b></span><br />" + 
        inf.format(data[StateCode].total.recovered)
        : "";
    cell4.sortKey = data[StateCode].delta.recovered?+data[StateCode].delta.recovered:0;

    cell5.innerHTML =
      data[StateCode].total.tested != undefined
        ? "<span style='color:rgb(212 84 29)'><b>" +
        myFormat(data[StateCode].delta.tested) +
        "</b></span><br />" +
        inf.format(data[StateCode].total.tested)
        : "";
    cell5.sortKey = data[StateCode].delta.tested?+data[StateCode].delta.tested:0;

    cell6.innerHTML =
      data[StateCode].total.vaccinated1 != undefined
        ? "<span style='color:rgb(106 2 100)'><b>" +
        myFormat(data[StateCode].delta.vaccinated1) +
        "</b></span><br />" +
        inf.format(data[StateCode].total.vaccinated1)
        : "";
    cell6.sortKey = data[StateCode].delta.vaccinated1?+data[StateCode].delta.vaccinated1:0;

    cell7.innerHTML =
      data[StateCode].total.vaccinated2 != undefined
        ? "<span style='color:rgb(110 5 75)'><b>" +
        myFormat(data[StateCode].delta.vaccinated2) +
        "</b></span><br />" +
        inf.format(data[StateCode].total.vaccinated2)
        : "";
    cell7.sortKey = data[StateCode].delta.vaccinated2?+data[StateCode].delta.vaccinated2:0;
  }
} /*end*/

function myFormat(str) {
  let negative = false;
  formatted = "";
  if (str === undefined || str === 0) return formatted;

  str = str.toString();
  if (str[0] == '-') {
    str = str.substring(1, str.length);
    negative = true;
  }
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
      str.substring(0, len - 3) + "." + str.substring(len - 3, len - 2) + "K";
  else formatted = str;

  if (negative) {
    formatted = '&darr;' + formatted;
  } else {
    formatted = '&uarr;' + formatted;
  }
  // console.log(formatted);
  return formatted;
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
