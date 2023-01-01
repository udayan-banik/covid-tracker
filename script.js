function gJ() {
  console.clear();

  // added indian time locale and replaced all slashes by hyphens
  var dateString = new Date(document.getElementById("date-input").value)
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replaceAll("/", "-");

  var op = document.getElementById("form");

  var pin = op.elements.pin.value;

  // var dd = dateObj.getDate();

  // var mm = dateObj.getMonth() + 01;

  // var yy = dateObj.getFullYear();

  var age = op.elements.age.value;

  var dose = op.elements.dose.value;

  var center_id = "79199";

  var disp = document.getElementById("demo");

  var table = document.getElementById("table_info");

  disp.innerHTML = "";

  //centers[0].sessions[0].min_age_limit

  /*//////////////////////////////////
*******Console Output Header********
//////////////////////////////////*/

  // console.log("For pin-"+pin+" 7 Days from "+ dateString +" Age: "+age+" Dose: "+dose);

  /******************Test Parts**********************/
  /*$.getJSON("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pin+"&date="+dd+"-"+mm+"-"+yy, function(data)
	{//var elem = document.getElementById('demo');
	 console.log(data.centers);
	 
	 
	// for(j = 0; data.centers[j]='\0';j++){for(i = 0; data.centers[j]='\0' ; i++){
	  // elem.innerHTML = data.centers[j].sessions;}}
	var show});*/

  /****************************************************/

  /*****************************************************
   ******************************************************
   *********J S O N - A L T E R N A T I V E**************
   ******************************************************
   ******************************************************/

  var url =
    "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" +
    pin +
    "&date=" +
    dateString;

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
      // console.log(data); /*start*/

      // boolean to check vaccine availability
      var isAvailable = false;
      if (dose == 1) {
        for (let i = 0; i < data.centers.length; i++) {
          for (let j = 0; j < data.centers[i].sessions.length; j++) {
            if (
              data.centers[i].sessions[j].min_age_limit == age &&
              data.centers[i].sessions[j].available_capacity_dose1 > 0
            ) {
              isAvailable = true;
              break;
            }
          }
          if (isAvailable == true) break;
        }
      }

      if (dose == 2) {
        for (let i = 0; i < data.centers.length; i++) {
          for (let j = 0; j < data.centers[i].sessions.length; j++) {
            if (
              data.centers[i].sessions[j].min_age_limit == age &&
              data.centers[i].sessions[j].available_capacity_dose2 > 0
            ) {
              isAvailable = true;
              break;
            }
          }
          if (isAvailable == true) break;
        }
      }

      if (isAvailable == true) {
        createTable();

        for (var iter1 = 0; iter1 < data.centers.length; iter1++)
          for (
            var iter2 = 0;
            iter2 < data.centers[iter1].sessions.length;
            iter2++
          ) {
            /*var iter3 = data.centers[iter1].sessions[iter2].available_capacity+" available on "+data.centers[iter1].sessions[iter2].date+" at "+data.centers[iter1].name+", "+data.centers[iter1].address+", "+data.centers[iter1].block_name;*/

            if (
              data.centers[iter1].sessions[iter2].available_capacity > 0 &&
              data.centers[iter1].sessions[iter2].min_age_limit == age
            ) {
              /*console.log(iter3);*/
              if (dose == 1) {
                addRow(dose, data, iter1, iter2);
              } else if (dose == 2) {
                addRow(dose, data, iter1, iter2);
              }
            }
            /*dont remove used for indent maintenance*/
          }
      } else {
        disp.innerHTML = "<h3>No vaccination center available</h3>";
      }
    }

    /*end*/
  });

  /*####################################################
#################||T A B L E||######################
####################################################*/

  function createTable() {
    var tbl = document.createElement("table");
    tbl.setAttribute("id", "table_info");
    var thd = tbl.createTHead();
    var hrow = thd.insertRow(0);
    var hcell0 = hrow.insertCell(0);
    var hcell1 = hrow.insertCell(1);
    var hcell2 = hrow.insertCell(2);
    var hcell3 = hrow.insertCell(3);
    var hcell4 = hrow.insertCell(4);

    hcell0.innerHTML = "<b>Available Capacity</b>";
    hcell1.innerHTML = "<b>Date</b>";
    hcell2.innerHTML = "<b>Center</b>";
    hcell3.innerHTML = "<b>Address</b>";
    hcell4.innerHTML = "<b>Block name</b>";

    tbl.createTBody();
    tbl.setAttribute("cellspacing", "5");

    disp.appendChild(tbl);
  }

  function addRow(dose, data, iter1, iter2) {
    var tbl = document.getElementById("table_info");
    var tbody = tbl.tBodies[0];
    var trow = tbody.insertRow(-1);

    var cell0 = trow.insertCell(0);
    var cell1 = trow.insertCell(1);
    var cell2 = trow.insertCell(2);
    var cell3 = trow.insertCell(3);
    var cell4 = trow.insertCell(4);

    if (dose == 1)
      cell0.innerHTML =
        data.centers[iter1].sessions[iter2].available_capacity_dose1;
    if (dose == 2)
      cell0.innerHTML =
        data.centers[iter1].sessions[iter2].available_capacity_dose2;
    cell0.innerHTML += " " + data.centers[iter1].sessions[iter2].vaccine;
    if (data.centers[iter1].fee_type == "Paid")
      cell0.innerHTML +=
        " (Rs." +
        feeOfVaccine(
          data.centers[iter1].sessions[iter2].vaccine,
          data.centers[iter1].vaccine_fees
        ) +
        ")";
    cell1.innerHTML = data.centers[iter1].sessions[iter2].date;
    cell2.innerHTML = data.centers[iter1].name;
    cell3.innerHTML = data.centers[iter1].address;
    cell4.innerHTML = data.centers[iter1].block_name;
  }

  function feeOfVaccine(vaccine, vaccine_fees) {
    for (let i = 0; i < vaccine_fees.length; i++) {
      if (vaccine == vaccine_fees[i].vaccine) return vaccine_fees[i].fee;
    }
  }

  /*####################################################
#################||S E A R C H||######################
####################################################*/
}

function darkMode() {
  var eleme = document.body;
  //    var checkClick = true;

  var writing = document.getElementById("mode");
  if (writing.innerHTML === "Dark Mode") {
    writing.innerHTML = "Light Mode";
  } else {
    writing.innerHTML = "Dark Mode";
    // checkClick = false;
  }

  // if(checkClick)
  eleme.classList.toggle("dark-mode");
}

/*if dose == 1 
if dose == 2


if(data.centers[iter1].sessions[iter2].available_capacity_dose1
data.centers[iter1].sessions[iter2].available_capacity_dose2




data.centers[iter1].sessionsdose1
dose2*/
