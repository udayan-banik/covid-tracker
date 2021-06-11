var urlDist = "https://cdn-api.co-vin.in/api/v2/admin/location/";
var statesSelect = document.getElementById("states");
var districtSelect = document.getElementById("districts");
var container = document.getElementById("pageContainer");
var entriesPerPage = 15;

var getJSONDist = function (urlDist, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', urlDist, true);
    xhr.responseType = "json";
    xhr.onload = function() {
        if (xhr.status === 200) 
            callback(null, xhr.response);
        else
            callback(xhr.status, xhr.reponse);
    };
    xhr.send();
};

function toggleMethod() {
    container.innerHTML = "";

    let pinElements = document.getElementsByClassName("searchByPin");
    for (let i=0; i<pinElements.length; i++) {
        toggleDisplay(pinElements[i]);
    }
    
    let distElements = document.getElementsByClassName("searchByDistrict");
    for (let i=0; i<distElements.length; i++) {
        toggleDisplay(distElements[i]);
    }

    getJSONDist (urlDist + "states", function(err, data) {
        if (err !== null)
            console.log("something went wrong" + err);
        else {
            // console.log(data);
            // console.log(data.states.length);
            listStates(data);
        }
    });

}

// populate the states
function listStates(data) {

    for (let i=0; i<data.states.length; i++) {
        let option = document.createElement("option");
        option.innerHTML = data.states[i].state_name;
        option.value = data.states[i].state_id;
        statesSelect.add(option);
        if (data.states[i].state_name == "Tripura")
            option.selected = true;
    }

    // populate the districts of the selected state
    let state_id = statesSelect.options[statesSelect.selectedIndex].value;
    getJSONDist (urlDist + "districts/" + state_id, function (err, data) {
        if (err != null)
            console.log("Something went wrong" + err);
        else {
            // console.log(data);
            // console.log(data.districts.length);
            listDistricts(data);
        }
    });
}

function listDistricts(data) {
    districtSelect.innerHTML = "";
    for (let i=0; i<data.districts.length; i++) {
        let option = document.createElement("option");
        option.innerHTML = data.districts[i].district_name;
        option.value = data.districts[i].district_id;
        districtSelect.add(option);
        if (data.districts[i].district_name == "Dhalai")
            option.selected = true;
    }
}

function loadDistricts() {
    let state_id = statesSelect.options[statesSelect.selectedIndex].value;
    getJSONDist (urlDist + "districts/" + state_id, function (err, data) {
        if (err != null) {
            console.log ("something went wrong" + err);
        } else {
            // console.log(data);
            // console.log(data.districts.length);
            listDistricts(data);
        }
    });
}

function toggleDisplay(element) {
    if (element.style.display == "none" || null)
        element.style.display = "inline-block";
    else
        element.style.display = "none";
}

function getCenters () {
    let district_id = districtSelect.options[districtSelect.selectedIndex].value;
    let dateStringDist = new Date(document.getElementById("date-input").value).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).replaceAll("/", "-");
    let urlDist = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=" + district_id + "&date=" + dateStringDist;
    let numEntries = 0;
    getJSONDist (urlDist, function (err, data) {
        if (err != null)
            console.log("something went wrong" + err);
        else {
            // console.log(data);
            // console.log(data.sessions.length);

            let op = document.getElementById("form");
            let age = op.elements.age.value;
            let dose = op.elements.dose.value;

            numEntries = availableCenters(data, age, dose);
            // console.log(numEntries);

            createPages(numEntries);
            fillPages(data, age, dose, numEntries);

            let btn = document.createElement("button");
            btn.innerHTML = "<";
            btn.addEventListener("click", previousPage);
            container.appendChild(btn);
            btn = document.createElement("button");
            btn.innerHTML = ">";
            btn.addEventListener("click", nextPage);
            container.appendChild(btn);
        }
    });
}

function createPages(numEntries) {
    clearPages();
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "pageIndex");
    input.setAttribute("onchange", "showSpecificPage()");
    input.style.float = "right";
    input.style.width = "6rem";
    input.style.marginRight = "3vw";
    let numPages = Math.ceil(numEntries / entriesPerPage);
    if (numPages > 0)
        input.placeholder = "1 to " + numPages.toString();
    else
        input.placeholder = "NA";
    container.innerHTML = "";
    container.appendChild(input);
    

    for (let i=1; i<=numPages; i++) {
        let div = document.createElement('div');
        div.innerHTML = "<br><h2>page " + i.toString() + "</h2>";
        div.setAttribute("class", "page");
        div.classList.add("page");
        div.classList.add("searchByDistrict");
        div.style.display = "none";
        container.appendChild(div);
    }

    document.getElementsByClassName("page")[0].style.display = "block";
}

function clearPages() {

    let input = document.getElementById("pageIndex");
    if (input != null)
        input.remove();
    let divs = document.getElementsByClassName("page");
    let numPages = divs.length;
    for (let i=numPages-1; i>=0; i--) {
        divs[i].remove(); // removed backward as remove constantly
                          // updates index of nodelist
    }
}

function fillPages(data, age, dose, numEntries) {
    let divs = document.getElementsByClassName("page");
    let numPages = divs.length;
    let numCenters = data.sessions.length;
    let slno = 0;
    let numRows = 0;
    let pageNo = 0;

    while (numRows < numEntries) {
        // when moving the next page
        if (Math.floor(numRows / entriesPerPage) + 1 > pageNo) {
            pageNo = Math.floor(numRows / entriesPerPage) + 1;
            createTable(divs, pageNo);
        }

        if (dose == 1 && data.sessions[slno].available_capacity_dose1 > 0 && data.sessions[slno].min_age_limit == age) {
            addRow (dose, data, slno, pageNo);
            numRows++;
        } else if (dose == 2 && data.sessions[slno].available_capacity_dose2 > 0 && data.sessions[slno].min_age_limit == age) {
            addRow (dose, data, slno, pageNo);
            numRows++;
        }
        slno++;
    }
}

function showSpecificPage() {
    let input = document.getElementById("pageIndex");
    let divs = document.getElementsByClassName("page");

    if (input.value < 1 || input.value == "")
        pageNo = 1;
    else if (input.value > divs.length)
        pageNo = divs.length;
    else
        pageNo = input.value;

    for (let i=0; i<divs.length; i++) {
        if (divs[i].style.display == "block")
            divs[i].style.display = "none";
    }
    divs[pageNo-1].style.display = "block"; 
}

function previousPage() {
    let divs = document.getElementsByClassName("page");
    let numPages = divs.length;
    let prevIndex;
    for (let i=0; i<numPages; i++)
        if (divs[i].style.display == "block") {
            divs[i].style.display = "none";
            prevIndex = (i+numPages-1)%numPages;
            break;
        }
    divs[prevIndex].style.display = "block";
}

function nextPage() {
    let divs = document.getElementsByClassName("page");
    let numPages = divs.length;
    let nextIndex;
    for (let i=0; i<numPages; i++) 
        if (divs[i].style.display == "block") {
            divs[i].style.display = "none";
            nextIndex = (i+1)%numPages;
            break;
        }
    divs[nextIndex].style.display = "block";
}

function createTable(divs, pageNo) {
	var tbl = document.createElement("table");
	tbl.setAttribute("id", "table_info" + pageNo.toString());
    tbl.classList.add("tablePerPage");
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

	divs[pageNo-1].appendChild(tbl);
}

function addRow(dose, data, slno, pageNo) {
	var tbl = document.getElementById("table_info" + pageNo.toString());
	var tbody = tbl.tBodies[0];
	var trow = tbody.insertRow(-1);

	var cell0 = trow.insertCell(0);
	var cell1 = trow.insertCell(1);
	var cell2 = trow.insertCell(2);
	var cell3 = trow.insertCell(3);
	var cell4 = trow.insertCell(4);

	if(dose == 1)
		cell0.innerHTML = data.sessions[slno].available_capacity_dose1;
	if(dose == 2)
		cell0.innerHTML = data.sessions[slno].available_capacity_dose2;
    cell0.innerHTML += " " + data.sessions[slno].vaccine;
	cell1.innerHTML = data.sessions[slno].date;
	cell2.innerHTML = data.sessions[slno].name;
	cell3.innerHTML = data.sessions[slno].address;
	cell4.innerHTML = data.sessions[slno].block_name;

}

function availableCenters(data, age, dose) {
    let activeCenters = 0;

    for (let i=0; i<data.sessions.length; i++) {
        if (dose == 1 && data.sessions[i].available_capacity_dose1 > 0 && data.sessions[i].min_age_limit == age) {
            activeCenters++;
        } else if (dose == 2 && data.sessions[i].available_capacity_dose2 > 0 && data.sessions[i].min_age_limit == age) {
            activeCenters++;
        }
    }
    return activeCenters;
}
