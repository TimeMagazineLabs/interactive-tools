let joinList = function(array) {
	if (array.length == 1) {
		return array[0];
	}
	return array.slice(0, -1).join(", ") + " and " + array.slice(-1)[0];
}

let getOrdinal = function(n) {
	if ((parseFloat(n) == parseInt(n)) && !isNaN(n)) {
		let s = ["th","st","nd","rd"];
		let v = n % 100;
		return n + (s[(v-20) % 10] || s[v] || s[0]);
	}
	return n;     
}

let toTitleCase = function(str) {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

export { joinList, getOrdinal, toTitleCase };