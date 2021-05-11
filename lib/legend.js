/*
	`legend_data` is an Array with labels colors or src urls like this:

	[
		{
			text: "Nevada",
			symbol: "*",
			color: #FEFE00,
			src: "./img/person.png" // overrides color and shape and uses and image
			shape: "square" (default, can be circle)
		}
	]
*/

function rgbToHex(rgb) {
	let re = /(\d+)/g;
	let vals = rgb.match(re)
	return "#" + ((1 << 24) + (+vals[0] << 16) + (+vals[1] << 8) + +vals[0]).toString(16).slice(1);
};

// https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
function getLuma(color) {
	// if CSS shorthand
	if (color.length == 4) {
		color = "#" + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
	}

	if (/rgb/.test(color)) {
		color = rgbToHex(color)
	}

	let c = color.substring(1);      // strip #
	let rgb = parseInt(c, 16);   // convert rrggbb to decimal
	let r = (rgb >> 16) & 0xff;  // extract red
	let g = (rgb >>  8) & 0xff;  // extract green
	let b = (rgb >>  0) & 0xff;  // extract blue

	let luma = 0.299 * r + 0.587 * g + 0.114 * b;

	return luma;
}


const makeLegend = function(container_selector, legend_data) {
	let el = document.querySelector(container_selector);
	el.classList.add("interactive-tool");

	let legend_div = document.createElement("div");
	legend_div.classList.add("dashboard_legend");

	// we want to intelligently enjamb these. Let's try groups of 3 or 4

	let BLOCK_SIZE = 3;

	if (legend_data.length <= 3) {
		BLOCK_SIZE = 1;
	} else if (legend_data.length == 4) {
		BLOCK_SIZE = 2;
	} else if (legend_data.length % BLOCK_SIZE < (BLOCK_SIZE - 1)) {
		BLOCK_SIZE = 4;
	}

	for (let c = 0; c < legend_data.length; c += BLOCK_SIZE) {
		let legend_group = legend_data.slice(c, c + BLOCK_SIZE);

		let group_div = document.createElement("div");
		group_div.classList.add("dashboard_legend_group");

		legend_group.forEach(obj => {
			let div = document.createElement("div");
			div.classList.add("dashboard_legend_item");
			if (obj.id) {
				div.id = obj.id;
			}

			let icon, text;

			if (obj.src) {
				icon = document.createElement("img");
				icon.setAttribute("src", obj.src);
				icon.classList.add("dashboard_legend_icon");			
			} else {
				icon = document.createElement("div");

				if (obj.symbol) {
					icon.innerHTML = obj.symbol;
					icon.style.color = obj.symbol_color || "black";
				}

				icon.classList.add("dashboard_legend_square");							

				if (obj.color) {
					icon.style.backgroundColor = obj.color;

					if (getLuma(obj.color) > 240) {
						icon.classList.add("colorBorder");							
					}
				}

				if (obj.shape === "circle" || obj.shape === "round") {
					icon.style.borderRadius = "50%";
				} else if (obj.shape === "line") {
					icon.style.marginTop = "7px";
					icon.style.marginBottom = "7px";
					icon.style.height = "6px";
				}

			}

			text = document.createElement("div");
			text.innerHTML = obj.hasOwnProperty("label") ? obj.label : ( obj.text ? obj.text : "");			
			text.classList.add("dashboard_legend_text");

			div.appendChild(icon);
			div.appendChild(text);

			// div.style.borderLeft = "16px solid " + legend_data[label];
			group_div.appendChild(div);
		});

		legend_div.appendChild(group_div);
	}

	el.appendChild(legend_div);
}

export { makeLegend };