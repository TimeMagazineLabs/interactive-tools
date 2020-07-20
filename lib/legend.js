/*
	`legend_data` is an Array with labels colors or src urls like this:

	[
		{
			text: "Nevada",
			color: #FEFE00,
			shape: "square" (default, can be circle)
			src: "./img/person.png" // overrides color and shape and uses and image
		}
	]
*/


require("../styles/legend.scss"); // slightly updated from repo

const makeLegend = function(container_selector, legend_data) {
	let el = document.querySelector(container_selector);
	let legend_div = document.createElement("div");
	legend_div.classList.add("dashboard_legend");

	// we want to intelligently enjamb these. Let's try groups of 3 or 4

	let BLOCK_SIZE = 3;
	if (legend_data.length % BLOCK_SIZE < (BLOCK_SIZE - 1)) {
		BLOCK_SIZE = 4;
	}

	for (let c = 0; c < legend_data.length; c += BLOCK_SIZE) {
		let legend_group = legend_data.slice(c, c + BLOCK_SIZE);

		let group_div = document.createElement("div");
		group_div.classList.add("dashboard_legend_group");

		legend_group.forEach(obj => {
			let div = document.createElement("div");
			div.classList.add("dashboard_legend_item");

			let icon, text;

			if (obj.src) {
				icon = document.createElement("img");
				icon.setAttribute("src", obj.src);
				icon.classList.add("dashboard_legend_icon");			
			} else {
				icon = document.createElement("div");
				icon.style.backgroundColor = obj.color;
				icon.classList.add("dashboard_legend_square");			
				if (obj.shape === "circle" || obj.shape === "round") {
					icon.style.borderRadius = "50%";
				}
			}

			text = document.createElement("div");
			text.innerHTML = obj.label || obj.text;
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