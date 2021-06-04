var container = document.getElementsByClassName("custom-select")[0];
var selectElement = document.getElementsByTagName("select")[0];
var numOptions = selectElement.length;
// console.log(numOptions);

// create the selected div element
var selectedSelect = document.createElement("div");
selectedSelect.setAttribute("class", "select-selected");
selectedSelect.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML;
container.appendChild(selectedSelect);

var selectItems = document.createElement("div");
selectItems.setAttribute("class", "select-items select-hide");
var option;
// create the option list using divs
for (let i=0; i<numOptions; i++) {
	option = document.createElement("div");
	option.innerHTML = selectElement.options[i].innerHTML;
	option.addEventListener("click", function(event) {
		let selectEle = this.parentNode.parentNode.getElementsByTagName("select")[0];
		let OptionsCount = selectEle.length;
		let selectedDiv = this.parentNode.previousSibling;
		for (let j=0; j<OptionsCount; j++) {
			if (selectEle.options[j].innerHTML == this.innerHTML) {
				selectEle.selectedIndex = j;
                selectedDiv.innerHTML = this.innerHTML;
				let selectedInDiv = this.parentNode.getElementsByClassName("same-as-selected");
                for (let k=0; k<selectedInDiv.length; k++)
                    selectedInDiv[k].removeAttribute("class");
				this.setAttribute("class", "same-as-selected");
				break;
			}
		}
        selectedDiv.click();
	});
	selectItems.appendChild(option);
}
container.appendChild(selectItems);
selectedSelect.addEventListener("click", function(event) {
	event.stopPropagation();
	this.nextSibling.classList.toggle("select-hide");
	this.classList.toggle("select-arrow-active");
});