function gJ(){

console.clear();

var op = document.getElementById('form');

var pin = op.elements.pin.value;

var dd = op.elements.dd.value;

var mm = op.elements.mm.value;

var yy = op.elements.yy.value;

var age = op.elements.age.value;

var center_id = "79199";

var disp = document.getElementById('demo');

disp.innerHTML = "";

//centers[0].sessions[0].min_age_limit

/*//////////////////////////////////
*******Console Output Header********
//////////////////////////////////*/

console.log("For pin-"+pin+" 7 Days from "+dd+"/"+mm+"/"+yy+" Age: "+age);


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
				var iter3 = data.centers[iter1].sessions[iter2].available_capacity+" available on "+data.centers[iter1].sessions[iter2].date+" at "+data.centers[iter1].name+", "+data.centers[iter1].address+", "+data.centers[iter1].block_name;
				
				if(data.centers[iter1].sessions[iter2].available_capacity <= 1 /*>>0*/ && data.centers[iter1].sessions[iter2].min_age_limit == age){
					/*console.log(iter3);*/
					disp.innerHTML += "<center>" + iter3 + "<br>" + "</center>";}

				else{
					disp.innerHTML = "<center>" + "No vaccination center available" + "</center>";}
				
				

				/*dont remove used for indent maintenance*/}
			
		
					
	
    }


/*end*/});



/*####################################################
#################||S E A R C H||######################
####################################################*/





 };