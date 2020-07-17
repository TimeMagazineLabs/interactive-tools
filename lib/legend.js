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

	legend_data.forEach(obj => {
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
		legend_div.appendChild(div);
	});

	el.appendChild(legend_div);
}

export { makeLegend };