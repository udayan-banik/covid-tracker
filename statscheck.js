function urlcheck(){

console.clear();

var getty = document.getElementById('form'); 

//var choice = getty.elements.choice.value;

var disp = document.getElementById('demo');

disp.innerHTML = "";

//var state = getty.elements.state.value;

var StateCode = getty.elements.state.value;


var url1 = "https://api.covid19india.org/v4/min/timeseries.min.json";
var url = "https://api.covid19india.org/v4/min/data.min.json";
var url3 = "https://api.covid19india.org/v4/min/data-all.min.json";

//var url = "https://api.covid19india.org/v4/min/"++".json";

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


var getJSON = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function(){
		if (xhr.status === 200)
			callback(null, xhr.response);
		else 
			callback(xhr.status, xhr.response);
	};

	xhr.send();
};

getJSON(url, function(err, data){
	if(err !== null)
		console.log("something went wrong"+err);
	else if(err == null){
		console.log(data);
		console.log(data[StateCode].total);/*start*/
		
		createTable();

		addRow(data, StateCode);}


});







function createTable() {
	var tbl = document.createElement("table");
	tbl.setAttribute("id", "table_info")
	var thd = tbl.createTHead();
	var hrow = thd.insertRow(0);
	var hcell0 = hrow.insertCell(0);
	var hcell1 = hrow.insertCell(1);
	var hcell2 = hrow.insertCell(2);
	var hcell3 = hrow.insertCell(3);
	//var hcell4 = hrow.insertCell(4);

	hcell0.innerHTML = "<b>Confirmed</b>";
	hcell1.innerHTML = "<b>Deceased</b>";	
	hcell2.innerHTML = "<b>Recovered</b>";
	hcell3.innerHTML = "<b>Tested</b>";
	//hcell4.innerHTML = "<b>Block name</b>";

	disp.appendChild(tbl);
}

function addRow(data, StateCode) {
	var tbl = document.getElementById("table_info");
	var trow = tbl.insertRow(-1);

	var cell0 = trow.insertCell(0);
	var cell1 = trow.insertCell(1);
	var cell2 = trow.insertCell(2);
	var cell3 = trow.insertCell(3);
	//var cell4 = trow.insertCell(4);

	cell0.innerHTML = data[StateCode].total.confirmed;
	cell1.innerHTML = data[StateCode].total.deceased;
	cell2.innerHTML = data[StateCode].total.recovered;
	cell3.innerHTML = data[StateCode].total.tested;
	//cell4.innerHTML = data.centers[iter1].block_name;

}

};/*end*/

function myFunction() {
	var x = document.getElementById("myTopnav");

	if (x.className === "topnav")
		x.className += " responsive";
	else 
		x.className = "topnav";
}

	
