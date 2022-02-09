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
	return `#${ensureLength2(cVal(hue, 5), 16)}${ensureLength2(cVal(hue, 3), 16)}${ensureLength2(cVal(hue, 1), 16)}`;
}

function ensureLength2(num: string | number, radix: number = 10): string {
	if(typeof num === "string") {
		if (num.length === 1) {
			return "0" + num;
		}
		return num;
	} else {
		return ensureLength2(parseInt(num.toString()).toString(radix));
	}
}

function createSVGArc(arcNum: number, numArcs: number, name: string): string {
	let arc: string;
	let startAngle: number = (Math.PI * 2 / numArcs) * arcNum;
	let endAngle: number = (Math.PI * 2 / numArcs) * (arcNum + 1);
	if(numArcs === 1) {
		arc = `<circle cx="50" cy="50" r="50" stroke="black" stroke-width="1px" fill="red" />`;
	} else {
		arc = `<path d="M50,50 l${Math.cos(startAngle) * 50} ${Math.sin(startAngle) * 50} A50,50 0 0,1 ${(1 + Math.cos(endAngle)) * 50},${(1 + Math.sin(endAngle)) * 50} z"
fill="${hueToHex((startAngle + endAngle) / 2)}" stroke="black" stroke-width="1px"/>`;
	}
	arc += `<text x="97" y="50" fill="white" transform="rotate(${(startAngle + endAngle) * 90 / Math.PI} 50,50)" text-anchor="end" dominant-baseline="central" font-size="10px">${name}</text>`
	return arc;
}

function createSVGArcs(movies: movie[]): string {
	let arcs: string = '<circle cx="50" cy="50" r="50" stroke="black" stroke-width="1px" fill="black" />';
	for(let i = 0; i < movies.length; i++) {
		arcs += createSVGArc(i, movies.length, movies[i].name);
	}
	return arcs;
}

function updateSliders(event): void {
	let thisVal: number = parseInt(event.target.value);
	if(event.target.id === "minTime") {
		// @ts-ignore
		let otherVal: number = parseInt(document.getElementById("maxTime").value);
		if(thisVal > otherVal) {
			// @ts-ignore
			document.getElementById("maxTime").value = thisVal;
			// @ts-ignore
			document.getElementById("max").innerText = `${parseInt("" + (thisVal / 4))}h${ensureLength2(((thisVal % 4) * 15).toString(10))}m`;
		}
		document.getElementById("min").innerText = `${parseInt("" + (thisVal / 4))}h${ensureLength2(((thisVal % 4) * 15).toString(10))}m`;
	} else {
		// @ts-ignore
		let otherVal: number = parseInt(document.getElementById("minTime").value);
		if(thisVal < otherVal) {
			// @ts-ignore
			document.getElementById("minTime").value = thisVal;
			// @ts-ignore
			document.getElementById("min").innerText = `${parseInt("" + (thisVal / 4))}h${ensureLength2(((thisVal % 4) * 15).toString(10))}m`;
		}
		document.getElementById("max").innerText = `${parseInt("" + (thisVal / 4))}h${ensureLength2(((thisVal % 4) * 15).toString(10))}m`;
	}
}

function setGenres(): void {
	// @ts-ignore
	let genres = new Set();
	for(let movie of defaultMovies) {
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

	setGenres();

	document.getElementById("numMovies").addEventListener("input", updateNumMovies);
	document.getElementById("wheel").innerHTML = createSVGArcs(defaultMovies);

	document.getElementById("minTime").addEventListener("input", updateSliders);
	document.getElementById("maxTime").addEventListener("input", updateSliders);
}

function updateNumMovies(event): void {
	defaultMovies = [];
	for(let i = 0; i < event.target.value; i++) {
		defaultMovies.push({name:`${i}`,runtime:i,genres:["1", `${i}`],link:""})
	}
	document.getElementById("wheel").innerHTML = createSVGArcs(defaultMovies);
	setGenres();
}

let defaultMovies: movie[] = [];
setup();
