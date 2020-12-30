/*
	restrict a text input to only digits
	options: `addCommas`, `onKeyDown`, `onKeyUp`, `onBlur`
*/

let limitToDigits = function(selector, opts) {
	opts = opts || {};

	let nodes = document.querySelectorAll(selector);

	for (let c = 0; c < nodes.length; c += 1) {
		let node = nodes[c];

		if (node.tagName.toLowerCase() !== "input") {
			let input = document.createElement("input");
			input.setAttribute("type", "text");
			input.setAttribute("inputmode", "numeric");
			node = node.appendChild(input);
		} else {
			node.setAttribute("type", "text");
			node.setAttribute("inputmode", "numeric");
		}

		node.setAttribute("pattern", "\\d*"); // opens the numbers-only keypad on mobile

		node.addEventListener("keydown", function(e) {
			let numDigits = this.value.match(/\d/g);

			let reachedMax = numDigits && opts.maxDigits && numDigits.length == opts.maxDigits;

			let key = e.keyCode ? e.keyCode : e.which;

			if (!( [8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
				 (key == 65 && ( e.ctrlKey || e.metaKey  ) ) || 
				 (key >= 35 && key <= 40) ||
				 (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey || reachedMax)) ||
				 (key >= 96 && key <= 105)
			)) {
				// console.log("Invalid", key);
				e.preventDefault();
				return false;
			}
			// console.log("Valid", key);

			if (opts.onKeyDown) {
				opts.onKeyDown(this);
			}

			if (opts.onEnter && key == 13) {
				let value = +(this.value.replace(/,/gi, ""));
				opts.onEnter(this, value);
			}
		});

		// https://stackoverflow.com/questions/27311714/adding-commas-to-numbers-when-typing
		if (opts.onKeyUp || opts.addCommas || opts.onMaxDigit) {
			node.addEventListener("keyup", function(e) {
				let value = +(this.value.replace(/,/gi, ""));
				if (opts.addCommas) {
					this.value = value.toLocaleString();
				}
				if (opts.onKeyUp) {
					opts.onKeyUp(this, value);
				}	

				if (opts.onMaxDigit) {
					let numDigits = this.value.match(/\d/g);
					if (numDigits && opts.maxDigits && numDigits.length == opts.maxDigits) {
						opts.onMaxDigit(+this.value.replace(/,/gi, ""));
					}
				}
			});
		}

		if (opts.onBlur) {
			node.addEventListener("blur", function(e) {
				let str = this.value.replace(/,/gi, "");
				let value = +str;
				opts.onBlur(this, value, str);
			});
		}
	}
}

//https://stackoverflow.com/questions/16144611/detect-focus-initiated-by-tab-key/16145062
/*
	Only showed the :focus css if an element was focussed by the TAB key
	Requires `tabindex` in your html
	Also requires [selector].tabbed:focus in your CSS
*/

let focusOnTabbed = function(selector) {
	let nodes = document.querySelectorAll(selector);
	for (let c = 0; c < nodes.length; c += 1) {
		let node = nodes[c];
		node.addEventListener("focus", function(e) {
			node.addEventListener("keyup", function (e) {
				let code = (e.keyCode ? e.keyCode : e.which);
				if (code == 9) {
					node.classList.add("tabbed");
				} else {
					node.classList.remove("tabbed");
				}
			});
		});

		node.addEventListener('blur', function() {
			node.classList.remove("tabbed");
		});

		node.addEventListener('click', function() {
			node.classList.remove("tabbed");
		});

		if (node.nodeName.toLowerCase() == "div") {
			node.addEventListener("keydown", function(e) {
				let key = e.keyCode || e.which;
				// console.log(key);

				// if space or enter key
				if (key === 13 || key === 32) {
					e.preventDefault();
					node.click();
					return false;
				}
			});
		}		
		// node.addEventListener('click', function() {
		// 	node.classList.remove("tabbed");
		// });
	}
}

// create a checkbox with a label which can also be clicked
let createCheckbox = function(selector, id, label_text, isChecked, callback) {
	let parent = document.querySelector(selector);
	parent.classList.add("interactive-tool");

	let label = document.createElement("div");
	label.innerHTML = label_text;
	label.style.cursor = "pointer";
	label.style.display = "inline-block";
	label.style.position = "relative";
	label.style.top = "-1px";
	label.style.left = "3px";

	let checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.value = id;
	checkbox.id = id;
	checkbox.checked = isChecked;

	parent.appendChild(checkbox);
	parent.appendChild(label);

	let status = "enabled";

	function toggle() {
		if (checkbox.checked) {
			checkbox.checked = false;
		} else {
			checkbox.checked = true;
		}
		if (callback) {
			callback(checkbox.checked);
		}
	}

	label.addEventListener("click", function() {
		if (status !== "disabled") {
			toggle();
		}
	});

	checkbox.addEventListener("click", function() {
		if (callback) {
			callback(checkbox.checked);
		}
	});

	function disable() {
		checkbox.checked = false;
		checkbox.disabled = true;
		label.style.color = "#808080";
		status = "disabled";
	}

	function enable() {
		checkbox.disabled = false;
		label.style.color = "#000000";
		status = "enabled";
	}

	return {
		disable: disable,
		enable: enable
	}
}

// create a checkbox with a label which can also be clicked
let createRadioButtons = function(selector, name, ids, labels, checked, callback) {
	let parent = document.querySelector(selector);

	labels.forEach((label_text, l) => {
		let div = document.createElement("div");
		let label = document.createElement("div");
		label.innerHTML = label_text;

		div.style.position = "relative";
		div.className = "radioButton";
		label.style.display = "inline-block";
		label.style.position = "relative";
		label.style.top = "-1px";
		label.style.left = "2px";
		label.style.marginRight = "10px";
		label.style.cursor = "pointer";

		let radioButton = document.createElement('input');
		radioButton.type = "radio";
		radioButton.value = ids[l];
		radioButton.id = ids[l];
		radioButton.name = name;
		radioButton.checked = checked == ids[l];

		div.appendChild(radioButton);
		div.appendChild(label);
		parent.appendChild(div);

		radioButton.addEventListener("click", function(e) {
			if (status !== "disabled") {
				callback(radioButton.id, radioButton.checked);
			}
		});

		label.addEventListener("click", function(e) {
			if (status !== "disabled") {
				toggle(radioButton, false);
			}
		});
	});

	let status = "enabled";

	function toggle(radioButton, toggleMe) {
		if (radioButton.checked && toggleMe) {
			radioButton.checked = false;
		} else {
			radioButton.checked = true;
		}
		if (callback) {
			callback(radioButton.id, radioButton.checked);
		}
	}

	function disable() {
		document.querySelectorAll(selector + " input").checked = false;
		document.querySelectorAll(selector + " input").disabled = true;
		document.querySelectorAll(selector + " span").style.color = "#808080";
		status = "disabled";
	}

	function enable() {
		document.querySelectorAll(selector + " input").disabled = false;
		document.querySelectorAll(selector + " span").style.color = "#000000";
		status = "enabled";
	}

	return {
		disable: disable,
		enable: enable
	}
}

let createButtonGroup = function(selector, ids, labels, options, callback) {
	if (typeof options === 'string') {
		options = {
			checked: options
		};
	}

	options.color = options.color || "#FFFFCC";

	let parent = document.querySelector(selector);
	parent.classList.add("interactive-tool");

	let buttonGroup = document.createElement("div");
	buttonGroup.classList.add("buttonGroup");

	let status = "enabled";

	let buttons = [];

	labels.forEach((label_text, l) => {
		let button = document.createElement("button");
		button.innerHTML = label_text;
		button.id = ids[l];

		if (button.id === options.checked || button.innerHTML === options.checked) {
			button.classList.add("active");
			button.style.backgroundColor = options.color;
		}

		buttonGroup.appendChild(button);

		button.addEventListener("click", function(e) {
			if (status !== "disabled" && !button.classList.contains('active')) {
				toggle(button);
				callback(button.id, button.innerHTML);
			}
		});

		buttons.push(button);
	});

	parent.appendChild(buttonGroup);

	function toggle(radioButton) {
		buttons.forEach(button => {
			if (button.id === radioButton.id || button.innerHTML === radioButton.innerHTML) {
				button.classList.add('active');
				button.style.backgroundColor = options.color;
			} else {
				button.classList.remove('active');
				button.style.backgroundColor = "#FFFFFF";
			}
		});
	}

	// function disable() {
	// 	document.querySelectorAll(selector + " input").checked = false;
	// 	document.querySelectorAll(selector + " input").disabled = true;
	// 	document.querySelectorAll(selector + " span").style.color = "#808080";
	// 	status = "disabled";
	// }

	// function enable() {
	// 	document.querySelectorAll(selector + " input").disabled = false;
	// 	document.querySelectorAll(selector + " span").style.color = "#000000";
	// 	status = "enabled";
	// }

	// return {
	// 	disable: disable,
	// 	enable: enable
	// }


}


export { limitToDigits, focusOnTabbed, createCheckbox, createRadioButtons, createButtonGroup };