const styleSelect = require('styleSelect');

require("../styles/styleSelect.scss"); // slightly updated from repo

// items is an array of values
let makeStyleBox = function(selector, items, opts) {
	let parent = document.querySelector(selector);
	console.log(parent);
	opts = opts || {};

	let selectNode = document.createElement("select");

	if (opts.hasOwnProperty("header")) {
		let optionNode = document.createElement("option");
		optionNode.innerHTML = opts.header;
		optionNode.disabled = true;
		optionNode.selected = true;
		selectNode.appendChild(optionNode);		
	}

	items.forEach(d => {
		let label = d;
		let value = null;
		if (opts.label_key) {
			label = d[opts.label_key];
		}
		if (opts.value_key) {
			value = d[opts.value_key];
		}

		let optionNode = document.createElement("option");
		optionNode.innerHTML = label;
		if (value) {
			optionNode.value = value;
		}
		selectNode.appendChild(optionNode);		
	});

	if (opts.id) {
		selectNode.id = opts.id;
	}

	parent.appendChild(selectNode);

	let ss = styleSelect(selectNode);

	opts.maxHeight = opts.maxHeight || 300;
	opts.width = opts.width || 200;

	let dropdown = parent.querySelector(".ss-dropdown");

	if (dropdown) {
		parent.querySelector(".ss-dropdown").style.maxHeight = opts.maxHeight + "px";
		parent.querySelector(".style-select").style.width = opts.width + "px";		
	}


	selectNode.addEventListener('change', function() {
		if (opts.onChange) {
			opts.onChange(this.options[this.selectedIndex].value, this.options[this.selectedIndex].innerHTML)
		}
	});

	// el.select("#character_list").on('change', function() {
	// 	let character = characterIndex[this.options[this.selectedIndex].value];
	// 	populateCharacter(character);
	// });

}

export { makeStyleBox };