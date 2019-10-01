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
	}
}

// create a checkbox with a label which can also be clicked
let createCheckbox = function(selector, id, label_text, isChecked, callback) {
	let parent = document.querySelector(selector);

	let label = document.createElement("span");
	label.innerHTML = label_text;

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

export { limitToDigits, focusOnTabbed, createCheckbox };