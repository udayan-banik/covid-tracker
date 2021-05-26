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

/*-------Table Header-----------*/

	
var header = table.createTHead();
	
var row1 = header.insertRow(0);
	
var hcell1 = row1.insertCell(0);

var hcell2 = row1.insertCell(1);
	
var hcell3 = row1.insertCell(2);
	
var hcell4 = row1.insertCell(3);
	
var hcell5 = row1.insertCell(4);
	
	
  hcell1.innerHTML = "<b>Available Capacity</b>";
  hcell2.innerHTML = "<b>Date</b>";
  hcell3.innerHTML = "<b>Name of Center</b>";
  hcell4.innerHTML = "<b>Address</b>";
  hcell5.innerHTML = "<b>Block Name</b>";
	
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
		
		


		for(var iter1 = 0; iter1<data.centers.length; iter1++)
			for(var iter2 = 0; iter2<data.centers[iter1].sessions.length; iter2++){
				/*var iter3 = data.centers[iter1].sessions[iter2].available_capacity+" available on "+data.centers[iter1].sessions[iter2].date+" at "+data.centers[iter1].name+", "+data.centers[iter1].address+", "+data.centers[iter1].block_name;
				var iter3 = data.centers[iter1].sessions[iter2].available_capacity_dose1+" available on "+data.centers[iter1].sessions[iter2].date+" at "+data.centers[iter1].name+", "+data.centers[iter1].address+", "+data.centers[iter1].block_name;
				var iter4 = data.centers[iter1].sessions[iter2].available_capacity_dose2+" available on "+data.centers[iter1].sessions[iter2].date+" at "+data.centers[iter1].name+", "+data.centers[iter1].address+", "+data.centers[iter1].block_name;*/
				
				var row = table.insertRow(-1);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var cell4 = row.insertCell(3);
				var cell5 = row.insertCell(4);
				
				
				
				if(data.centers[iter1].sessions[iter2].available_capacity >= 0 /*>>0*/ && data.centers[iter1].sessions[iter2].min_age_limit == age){
					/*console.log(iter3);*/
					if(dose == 1){
						cell1.innerHTML = data.centers[iter1].sessions[iter2].available_capacity_dose1;}
					else if(dose == 2){
						cell1.innerHTML = data.centers[iter1].sessions[iter2].available_capacity_dose2;}
					
					cell2.innerHTML = data.centers[iter1].sessions[iter2].date;
				  	cell3.innerHTML = data.centers[iter1].name;
				  	cell4.innerHTML = data.centers[iter1].address;
					cell5.innerHTML = data.centers[iter1].block_name;}

				else{
					disp.innerHTML = "<center>" + "No vaccination center available" + "</center>";}
				
				

				/*dont remove used for indent maintenance*/}
			
		
					
	
    }


/*end*/});



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
