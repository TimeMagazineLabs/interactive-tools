const styleSelect = require('styleselect');
const Awesomplete = require('awesomplete');
import { select, selectAll } from 'd3-selection'; // Common convenience. Requires `npm install d3 --save`

require("../styles/styleSelect.scss"); // slightly updated from repo
require("../styles/awesomplete.scss"); // slightly updated from repo

// items is an array of values
let makeStyleBox = function(selector, items, opts) {
	let parent = document.querySelector(selector);
	opts = opts || {};

	let selectNode = document.createElement("select");

	if (opts.hasOwnProperty("header")) {
		let optionNode = document.createElement("option");
		optionNode.setAttribute("value", "NA");
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
			if (opts.selected && opts.selected == value) {
				optionNode.selected = "selected";
			}
		}

		selectNode.appendChild(optionNode);
	});

	if (opts.id) {
		selectNode.id = opts.id;
	}

	parent.appendChild(selectNode);

	styleSelect(selectNode);

	const ss = document.querySelector(selector + " .ss-selected-option");

	opts.maxHeight = opts.maxHeight || 300;
	opts.minWidth = opts.minWidth || 200;

	let dropdown = parent.querySelector(".ss-dropdown");

	if (dropdown) {
		parent.querySelector(".ss-dropdown").style.maxHeight = opts.maxHeight + "px";
		// parent.querySelector(".style-select").style.minWidth = opts.minWidth + "px";		
	}

	if (opts.onHover) {
		let optionNodes = document.querySelectorAll(".ss-option");

		optionNodes.forEach(optionNode => {
			optionNode.addEventListener('mouseover', function() {
				opts.onHover(this.getAttribute("data-value"), this.innerHTML)
			});
		})
	}

	ss.addEventListener('click', function(e) {
		let selectedItem = document.querySelector(selector + " .ticked");
		if (dropdown) {
			dropdown.scrollTop = selectedItem.offsetTop;
		}
	});


	selectNode.addEventListener('change', function(e) {
		if (opts.onChange) {
			if (this.selectedIndex === -1) {
				opts.onChange(null, null);
			} else {
				opts.onChange(this.options[this.selectedIndex].value, this.options[this.selectedIndex].innerHTML)
			}
		}
	});

	// manually set the dropdown
	function setValue(value) {
		for (let i = 0; i < selectNode.options.length; i++) {
			if (selectNode.options[i].text == value || selectNode.options[i].value == value) {
				selectNode.options[i].selected = true;
				break;
			}
		}

		select(parent).selectAll(".ss-option").classed("highlighted", false).classed("ticked", false);
		let ssOptions = parent.querySelectorAll(".ss-option");
		for (let i = 0; i < ssOptions.length; i++) {
			let ssOption = ssOptions[i];

			if (ssOption.dataset.value == value) {
				select(ssOption).classed("ticked", true);//.classed("highlighted", true)
				select(parent).select(".ss-selected-option").html(ssOption.innerHTML);
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
}

let makeAutocompleteBox = function(selector, items, opts) {
	const parent = document.querySelector(selector);
	opts = opts || {};

	const input = document.createElement('input');
	input.setAttribute("type", "text");
	input.setAttribute("autocomplete", "new-password");

	parent.appendChild(input);

	new Awesomplete(selector + ' input', {
		list: items
	});

	input.addEventListener("blur", function(e) {
		console.log("Blurring", selector);
		let value = this.value;
		opts.onBlur(value);
	});

	// document.querySelector(selector + " ul").addEventListener("click", function(e) {
	// 	opts.onSelect(input.value);
	// });

}

export { makeStyleBox, makeAutocompleteBox };