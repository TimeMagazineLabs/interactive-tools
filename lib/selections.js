const styleSelect = require('styleselect');
import { select, selectAll } from 'd3-selection'; // Common convenience. Requires `npm install d3 --save`

require("../styles/styleSelect.scss"); // slightly updated from repo

// items is an array of values
let makeStyleBox = function(selector, items, opts) {
	let parent = document.querySelector(selector);
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
		let value = d;
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

	if (opts.onHover) {
		let optionNodes = document.querySelectorAll(".ss-option");

		optionNodes.forEach(optionNode => {
			optionNode.addEventListener('mouseover', function() {
				opts.onHover(this.getAttribute("data-value"), this.innerHTML)
			});
		})
	}

	selectNode.addEventListener('change', function() {
		if (opts.onChange) {
			opts.onChange(this.options[this.selectedIndex].value, this.options[this.selectedIndex].innerHTML)
		}
	});

	function setValue(value) {
		for (let i = 0; i < selectNode.options.length; i++) {
			if (selectNode.options[i].text== value) {
				selectNode.options[i].selected = true;
				break;
			}
		}

		// manually set the dropdown

		select(parent).selectAll(".ss-option").classed("highlighted", false).classed("ticked", false);
		let ssOptions = parent.querySelectorAll(".ss-option");
		for (let i = 0; i < ssOptions.length; i++) {
			let ssOption = ssOptions[i];

			if (ssOption.dataset.value == value) {
				select(ssOption).classed("ticked", true);//.classed("highlighted", true)
				select(parent).select(".ss-selected-option").html(value);


				select(parent).select(".style-select").classed("open", true);
				let position = select(ssOption).node().offsetTop;
				select(parent).select(".ss-dropdown").node().scrollTop = Math.max(0, position - 50);
				select(parent).select(".style-select").classed("open", false);
				break;
			}
		}
	}

	return {
		setValue: setValue
	}

	// el.select("#character_list").on('change', function() {
	// 	let character = characterIndex[this.options[this.selectedIndex].value];
	// 	populateCharacter(character);
	// });

}

export { makeStyleBox };