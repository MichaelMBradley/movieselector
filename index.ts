interface movie {
	name: string;
	runtime: number;
	genres: string[];
	link: string;
}

// Assumes hue in radians, s=1, v=1
function hueToHex(hue: number): string {
	const cVal = (hue: number, offset: number) => {
		return 255 * Math.min(1, Math.max(0, Math.abs(((hue + offset) % 6) - 2) - 1));
	}
	hue *= 3 / Math.PI;
	return `#${ensureLength(cVal(hue, 5), 16)}${ensureLength(cVal(hue, 3), 16)}${ensureLength(cVal(hue, 1), 16)}`;
}

function ensureLength(num: string | number, radix: number = 10, length: number = 2): string {
	if(typeof num === "string") {
		for(let i = num.length; i < length; i++) {
			num = "0" + num;
		}
		return num;
	} else {
		return ensureLength(parseInt(num.toString()).toString(radix), radix, length);
	}
}

function createSVGArcs(movies: movie[]): void {
	function createSVGArc(arcNum: number, numArcs: number, name: string): string {
		let arc: string;
		let startAngle: number = (Math.PI * 2 / numArcs) * arcNum;
		let endAngle: number = (Math.PI * 2 / numArcs) * (arcNum + 1);
		if(numArcs === 1) {
			arc = `<circle cx="50" cy="50" r="50" stroke="black" stroke-width="1px" fill="red" id="${name}" />`;
		} else {
			arc = `<path d="M50,50 l${Math.cos(startAngle) * 50} ${Math.sin(startAngle) * 50} A50,50 0 0,1 ${(1 + Math.cos(endAngle)) * 50},${(1 + Math.sin(endAngle)) * 50} z"
fill="${hueToHex((startAngle + endAngle) / 2)}" stroke="black" stroke-width="1px" id="${name}" />`;
		}
		arc += `<text x="97" y="50" fill="white" transform="rotate(${(startAngle + endAngle) * 90 / Math.PI} 50,50)" text-anchor="end" dominant-baseline="central" font-size="${20 / numArcs}px" id="${name}@@@text">${name}</text>`
		return arc;
	}

	let arcs: string = '<circle cx="50" cy="50" r="50" stroke="black" stroke-width="1px" fill="black" />';
	for(let i = 0; i < movies.length; i++) {
		arcs += createSVGArc(i, movies.length, movies[i].name);
	}
	arcs += `<circle id="spinCirc" cx="50" cy="50" r="10" stroke="black" stroke-width="1px" fill="white"/>
<text id="spinCirc@@@text" x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="8">Spin!</text>`;
	document.getElementById("wheel").innerHTML = arcs;
	for(let i = 0; i < movies.length; i++) {
		document.getElementById(movies[i].name).addEventListener("click", arcClick);
		document.getElementById(movies[i].name + "@@@text").addEventListener("click", arcClick);
	}
	document.getElementById("spinCirc").addEventListener("click", spinClick);
	document.getElementById("spinCirc@@@text").addEventListener("click", spinClick);
}

function updateSliders(event): void {
	let thisVal: number = parseInt(event.target.value);
	let timeString: string;
	if(thisVal === 16) {
		timeString = "∞h ∞m";
	} else {
		timeString = `${ensureLength(thisVal / 4, 10, 1)}h${ensureLength((thisVal % 4) * 15)}m`;
	}
	if(event.target.id === "minTime") {
		// @ts-ignore
		let otherVal: number = parseInt(document.getElementById("maxTime").value);
		if(thisVal > otherVal) {
			// @ts-ignore
			document.getElementById("maxTime").value = thisVal;
			// @ts-ignore
			document.getElementById("max").innerText = timeString;
		}
		document.getElementById("min").innerText = timeString;
	} else {
		// @ts-ignore
		let otherVal: number = parseInt(document.getElementById("minTime").value);
		if(thisVal < otherVal) {
			// @ts-ignore
			document.getElementById("minTime").value = thisVal;
			// @ts-ignore
			document.getElementById("min").innerText = timeString;
		}
		document.getElementById("max").innerText = timeString;
	}
}

function setGenres(movies: movie[]): void {
	// @ts-ignore
	let genres = new Set();
	for(let movie of movies) {
		for(let genre of movie.genres) {
			genres.add(genre);
		}
	}
	let genreText = '';
	genres.forEach(genre => {
		genreText += `<input type="checkbox" id="${genre}"><label for="example1">${genre}</label><br>`;
	})
	document.getElementById("genre").innerHTML = genreText;
}

function arcClick(event): void {
	document.getElementById("currentMovie").innerText = event.target.id.split("@@@")[0];//eventID;
}

function spinClick(): void {
	document.getElementById("currentMovie").innerText = "Spinning!";
}

function setup(): void {
	// @ts-ignore
	document.getElementById("minTime").value = 0;
	// @ts-ignore
	document.getElementById("maxTime").value = 16;
	// @ts-ignore
	document.getElementById("include").checked = false;
	// @ts-ignore
	document.getElementById("exclude").checked = true;
	// @ts-ignore
	document.getElementById("numMovies").value = 0;

	setGenres(defaultMovies);

	document.getElementById("numMovies").addEventListener("input", updateNumMovies);
	createSVGArcs(defaultMovies);

	document.getElementById("minTime").addEventListener("input", updateSliders);
	document.getElementById("maxTime").addEventListener("input", updateSliders);


}

function updateNumMovies(event): void {
	defaultMovies = [];
	for(let i = 0; i < event.target.value; i++) {
		defaultMovies.push({name:`${i}`,runtime:i,genres:["1", `${i}`],link:""})
	}
	createSVGArcs(defaultMovies);
	setGenres(defaultMovies);
}

let defaultMovies: movie[] = [{
	name: "Iron Man",
	runtime: 126,
	genres: ["Action", "Adventure", "Sci-Fi"],
	link: "https://www.netflix.com"
}, {
	name: "Dune",
	runtime: 155,
	genres: ["Action", "Adventure", "Drama"],
	link: "https://www.netflix.com"
}, {
	name: "The Matrix",
	runtime: 136,
	genres: ["Action", "Sci-Fi"],
	link: "https://www.netflix.com"
}, {
	name: "12 Angry Men",
	runtime: 96,
	genres: ["Crime", "Drama"],
	link: "https://www.netflix.com"
}, {
	name: "Titanic",
	runtime: 194,
	genres: ["Drama","Romance"],
	link: "https://www.netflix.com"
}];
setup();
