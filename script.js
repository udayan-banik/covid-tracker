function gJ(){

console.clear();

var op = document.getElementById('form');

var pin = op.elements.pin.value;

var dd = op.elements.dd.value;

var mm = op.elements.mm.value;

var yy = op.elements.yy.value;

var age = op.elements.age.value;

var dose = op.elements.dose.value;

var center_id = "79199";

var disp = document.getElementById('demo');
	
var table = document.getElementById('table_info');
	
disp.innerHTML = "";

//centers[0].sessions[0].min_age_limit

/*//////////////////////////////////
*******Console Output Header********
//////////////////////////////////*/

console.log("For pin-"+pin+" 7 Days from "+dd+"/"+mm+"/"+yy+" Age: "+age+" Dose: "+dose);


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


var url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pin+"&date="+dd+"-"+mm+"-"+yy;

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
		//console.log(data);/*start*/
		
		createTable();



		for(var iter1 = 0; iter1<data.centers.length; iter1++)
			for(var iter2 = 0; iter2<data.centers[iter1].sessions.length; iter2++){
				/*var iter3 = data.centers[iter1].sessions[iter2].available_capacity+" available on "+data.centers[iter1].sessions[iter2].date+" at "+data.centers[iter1].name+", "+data.centers[iter1].address+", "+data.centers[iter1].block_name;
				var iter3 = data.centers[iter1].sessions[iter2].available_capacity_dose1+" available on "+data.centers[iter1].sessions[iter2].date+" at "+data.centers[iter1].name+", "+data.centers[iter1].address+", "+data.centers[iter1].block_name;
				var iter4 = data.centers[iter1].sessions[iter2].available_capacity_dose2+" available on "+data.centers[iter1].sessions[iter2].date+" at "+data.centers[iter1].name+", "+data.centers[iter1].address+", "+data.centers[iter1].block_name;*/
				
				
				
				
				
				if(data.centers[iter1].sessions[iter2].available_capacity >= 0 /*>>0*/ && data.centers[iter1].sessions[iter2].min_age_limit == age){
					/*console.log(iter3);*/
					if(dose == 1){
						addRow(dose, data, iter1, iter2);
					}
					else if(dose == 2){
						addRow(dose, data, iter1, iter2);
					}
					
				}

				else{
					disp.innerHTML = "<center>" + "No vaccination center available" + "</center>";
				}
				
				

				/*dont remove used for indent maintenance*/}
			
		
					
	
    }


/*end*/});

/*####################################################
#################||T A B L E||######################
####################################################*/



function createTable() {
	var tbl = document.createElement("table");
	tbl.setAttribute("id", "table_info")
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
	hcell4.innerHTML = "<b>Address</b>";
	hcell3.innerHTML = "<b>Block name</b>";

	disp.appendChild(tbl);
}

function addRow(dose, data, iter1, iter2) {
	var tbl = document.getElementById("table_info");
	var trow = tbl.insertRow(-1);

	var cell0 = trow.insertCell(0);
	var cell1 = trow.insertCell(1);
	var cell2 = trow.insertCell(2);
	var cell3 = trow.insertCell(3);
	var cell4 = trow.insertCell(4);

	if(dose == 1)
		cell0.innerHTML = data.centers[iter1].sessions[iter2].available_capacity_dose1;
	if(dose == 2)
		cell0.innerHTML = data.centers[iter1].sessions[iter2].available_capacity_dose2;
	cell1.innerHTML = data.centers[iter1].sessions[iter2].date;
	cell2.innerHTML = data.centers[iter1].name;
	cell3.innerHTML = data.centers[iter1].address;
	cell4.innerHTML = data.centers[iter1].block_name;

}

/*####################################################
#################||S E A R C H||######################
####################################################*/





 };



/*if dose == 1 
if dose == 2


if(data.centers[iter1].sessions[iter2].available_capacity_dose1
data.centers[iter1].sessions[iter2].available_capacity_dose2




data.centers[iter1].sessionsdose1
dose2*/
