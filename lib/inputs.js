/*
	restrict a text input to only digits
	options: `addCommas`, `onKeyDown`, `onKeyUp`, `onBlur`
*/

let limitToDigits = function(selector, opts) {
	opts = opts || {};

	let nodes = document.querySelectorAll(selector);
	for (let c = 0; c < nodes.length; c += 1) {
		let node = nodes[c];
		node.setAttribute("pattern", "\\d*"); // opens the numbers-only keypad on mobile

		node.addEventListener("keydown", function(e) {
			let key = e.keyCode ? e.keyCode : e.which;

			if (!( [8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
				 (key == 65 && ( e.ctrlKey || e.metaKey  ) ) || 
				 (key >= 35 && key <= 40) ||
				 (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) ||
				 (key >= 96 && key <= 105)
			)) e.preventDefault();

			if (opts.onKeyDown) {
				opts.onKeyDown(this);
			}

			if (opts.onEnter && key == 13) {
				let value = +(this.value.replace(/,/gi, ""));
				opts.onEnter(this, value);
			}
		});

		// https://stackoverflow.com/questions/27311714/adding-commas-to-numbers-when-typing
		if (opts.onKeyUp || opts.addCommas) {
			node.addEventListener("keyup", function(e) {
				let value = +(this.value.replace(/,/gi, ""));
				if (opts.addCommas) {
					this.value = value.toLocaleString();
				}
				if (opts.onKeyUp) {
					opts.onKeyUp(this, value);
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

	let label = document.createElement("div");
	label.innerHTML = label_text;
	label.style.cursor = "pointer";
	label.style.display = "inline-block";
	label.style.position = "relative";
	label.style.top = "2px";

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
let createRadioButtons = function(selector, id, ids, labels, checked, callback) {
	let parent = document.querySelector(selector);

	labels.forEach((label_text, l) => {
		let div = document.createElement("div");
		let label = document.createElement("div");
		label.innerHTML = label_text;

		div.style.position = "relative";
		label.style.display = "inline-block";
		label.style.position = "relative";
		label.style.top = "2px";
		label.style.cursor = "pointer";

		let radioButton = document.createElement('input');
		radioButton.type = "radio";
		radioButton.value = ids[l];
		radioButton.id = ids[l];
		radioButton.name = id;
		radioButton.checked = checked == l;

		div.appendChild(radioButton);
		div.appendChild(label);
		parent.appendChild(div);

		radioButton.addEventListener("click", function() {
			if (status !== "disabled") {
				// let radioButton = this.querySelector("input");
				// toggle(this);
				callback(this.id, this.checked);
			}
		});

		label.addEventListener("click", function() {
			if (status !== "disabled") {
				// let radioButton = this.querySelector("input");
				toggle(radioButton);
				callback(ids[l], radioButton.checked);
			}
		});



	});

	let status = "enabled";

	function toggle(radioButton) {
		if (radioButton.checked) {
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

export { limitToDigits, focusOnTabbed, createCheckbox, createRadioButtons };