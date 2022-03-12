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
		return ensureLength(Math.floor(num).toString(radix), radix, length);
	}
}

function createSVGArcs(): void {
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
		// TODO: Use `document.createElement()`, and a better formula for the font size
		let fontSize: number = 15 / Math.sqrt(numArcs);
		arc += `<text font-weight="bolder" x="97" y="50" fill="white" stroke="black" stroke-width="0.1px" font-family="monospace" transform="rotate(${(startAngle + endAngle) * 90 / Math.PI} 50,50)" text-anchor="end" dominant-baseline="central" font-size="${Math.min(fontSize, 60 / name.length)}px" id="${name}@@@text">${name}</text>`
		return arc;
	}

	updateCurrentMovies();

	let arcs: string = '<circle cx="50" cy="50" r="50" stroke="black" stroke-width="1px" fill="black" />';
	for(let i = 0; i < currentMovies.length; i++) {
		arcs += createSVGArc(i, currentMovies.length, currentMovies[i].name);
	}
	arcs += `<circle id="spinCirc" cx="50" cy="50" r="10" stroke="black" stroke-width="1px" fill="white"/>
<text id="spinCirc@@@text" x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="8">Spin!</text>`;
	document.getElementById("wheel").innerHTML = arcs;
	for(let i = 0; i < currentMovies.length; i++) {
		document.getElementById(currentMovies[i].name).addEventListener("click", arcClick);
		document.getElementById(currentMovies[i].name + "@@@text").addEventListener("click", arcClick);
	}
	document.getElementById("spinCirc").addEventListener("click", spinClick);
	document.getElementById("spinCirc@@@text").addEventListener("click", spinClick);
}

function updateSliders(event): void {
	let thisVal: number = parseInt(event.target.value);
	let timeString: string;
	// @ts-ignore
	const maxVal = parseInt(document.getElementById(event.target.id).max);
	if(thisVal === maxVal) {
		timeString = "∞h ∞m";
	} else {
		timeString = `${ensureLength(thisVal / (maxVal / maxHourSlider), 10, 1)}h${ensureLength((thisVal % (maxVal / maxHourSlider)) * timeIncrement)}m`;
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
	createSVGArcs();
}

function setGenres(): void {
	// @ts-ignore
	let genres = new Set();
	for(let movie of movies) {
		for(let genre of movie.genres) {
			genres.add(genre);
		}
	}
	let genreText = '';
	genres.forEach(genre => {
		genreText += `<input type="checkbox" id="${genre}" onclick="createSVGArcs()"><label for="example1">${genre}</label><br>`;
	})
	document.getElementById("genre").innerHTML = genreText;
	createSVGArcs();
}

function arcClick(event): void {
	currentMovie = movies.filter(movie => {return movie.name === event.target.id.split("@@@")[0]})[0];
	loadMovieEditor();
}

function bezEaseOut(frac: number): number {
	frac = 1 - frac;
	return frac * (frac + 1 / frac);
}

function spinClick(): void {
	const numDeg: number = (5 + Math.random() * 4) * 360;
	for(let i = 0; i < numDeg; i++) {
		setTimeout(() => {
			let deg = bezEaseOut(i / numDeg) * numDeg;
			//console.log(currentMovies, currentMovies.length * ((630 - i) % 360) / 360);
			document.getElementById("wheel").style.transform = `rotate(${deg}deg)`;
			// @ts-ignore
			currentMovie = currentMovies[parseInt(currentMovies.length * ((630 - (deg % 360)) % 360) / 360)];
			document.getElementById("currentMovie").innerText = currentMovie.name;
			loadMovieEditor();
		}, i * 2);
	}
}

function loadMovieEditor(): void {
	// @ts-ignore
	document.getElementById("movieName").value = currentMovie.name;
	// @ts-ignore
	document.getElementById("runHours").value = Math.floor(currentMovie.runtime / 60);
	// @ts-ignore
	document.getElementById("runMinutes").value = currentMovie.runtime % 60;
	// @ts-ignore
	document.getElementById("genreInput").value = currentMovie.genres.join(" ");
	// @ts-ignore
	document.getElementById("linkInput").value = currentMovie.link;
}

async function getMovies() {
	// @ts-ignore
	if(document.getElementById("loadFromFile").files.length !== 0) {
		// TODO: Allow uploading files
		return [];
	}
	if(document.cookie !== "") {
		return JSON.parse(document.cookie);
	}
	return fetch("defaultMovies.json",
		{
			method: "GET",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		}).then(response => response.json())
		.then(json => {
			return json;
		});
}

function setup(): void {
	getMovies().then(retMovies => {
		movies = retMovies;
		currentMovie = movies[0];
		setGenres();
		loadMovieEditor();
		createSVGArcs();
	});

	// @ts-ignore
	document.getElementById("minTime").value = 0;
	// @ts-ignore
	document.getElementById("minTime").max = maxHourSlider * (60 / timeIncrement);
	// @ts-ignore
	document.getElementById("maxTime").max = maxHourSlider * (60 / timeIncrement);
	// @ts-ignore
	document.getElementById("maxTime").value = maxHourSlider * (60 / timeIncrement);
	// @ts-ignore
	document.getElementById("include").checked = false;
	// @ts-ignore
	document.getElementById("exclude").checked = true;
	// @ts-ignore
	document.getElementById("include").addEventListener("click",createSVGArcs)
	// @ts-ignore
	document.getElementById("exclude").addEventListener("click",createSVGArcs)
	// @ts-ignore
	document.getElementById("numMovies").value = 0;
	document.getElementById("numMovies").addEventListener("input", updateNumMovies);

	// @ts-ignore
	document.getElementById("rotate").value = 0;
	document.getElementById("rotate").addEventListener("input", rotate);

	document.getElementById("minTime").addEventListener("input", updateSliders);
	document.getElementById("maxTime").addEventListener("input", updateSliders);

	document.getElementById("save").addEventListener("click", saveMovie);
	document.getElementById("saveNew").addEventListener("click", saveNewMovie);
	document.getElementById("delete").addEventListener("click", deleteMovie);
}

function rotate(event): void {
	// @ts-ignore
	let val = parseInt(event.target.value);
	document.getElementById("wheel").style.transform = `rotate(${val}deg)`;
	// @ts-ignore
	console.log((630 - val) % 360, parseInt(currentMovies.length * ((630 - val) % 360) / 360));
}

function updateNumMovies(event): void {
	movies = [];
	for(let i = 0; i < event.target.value; i++) {
		movies.push({name:`${i}`,runtime:i,genres:["1", `${i}`],link:""})
	}
	currentMovie = movies[0];
	setGenres();
	createSVGArcs();
	loadMovieEditor();
}

function updateCurrentMovies(): void {
	let inGenre: string[] = [];
	let exGenre: string[] = [];
	document.querySelectorAll("input[type=checkbox]").forEach(genreCheck => {
		// @ts-ignore
		if(!genreCheck.checked) {
			return;
		}
		// @ts-ignore
		if(document.getElementById("exclude").checked) {
			exGenre.push(genreCheck.id);
		}
		// @ts-ignore
		if(document.getElementById("include").checked) {
			inGenre.push(genreCheck.id);
		}
	});
	// @ts-ignore
	let minTime: number = document.getElementById("minTime").value * timeIncrement;
	// @ts-ignore
	if(document.getElementById("minTime").value === document.getElementById("minTime").max) {
		minTime = Number.POSITIVE_INFINITY;
	}
	// @ts-ignore
	let maxTime: number = document.getElementById("maxTime").value * timeIncrement;
	// @ts-ignore
	if(document.getElementById("maxTime").value === document.getElementById("maxTime").max) {
		maxTime = Number.POSITIVE_INFINITY;
	}
	currentMovies = []
	for(let movie of movies) {
		let valid: boolean = inGenre.length === 0;
		for(let genre of inGenre) {
			if(movie.genres.indexOf(genre) !== -1) {
				valid = true;
				break;
			}
		}
		for(let genre of movie.genres) {
			if(exGenre.length != 0 && exGenre.indexOf(genre) !== -1) {
				valid = false;
				break;
			}
		}
		if(minTime > movie.runtime || movie.runtime > maxTime) {
			valid = false;
		}
		if(valid) {
			currentMovies.push(movie);
		}
	}
}

function saveMovie(): void {
	// @ts-ignore
	currentMovie.name = document.getElementById("movieName").value;
	// @ts-ignore
	currentMovie.runtime = parseInt(document.getElementById("runHours").value) * 60 + parseInt(document.getElementById("runMinutes").value);
	// @ts-ignore
	currentMovie.genres = document.getElementById("genreInput").value.split(" ");
	// @ts-ignore
	currentMovie.link = document.getElementById("linkInput").value;
	setGenres();
	createSVGArcs();
}

function saveNewMovie(): void {
	currentMovie = {
		// @ts-ignore
		name: document.getElementById("movieName").value,
		// @ts-ignore
		runtime: parseInt(document.getElementById("runHours").value) * 60 + parseInt(document.getElementById("runMinutes").value),
		// @ts-ignore
		genres: document.getElementById("genreInput").value.split(" "),
		// @ts-ignore
		link: document.getElementById("linkInput").value
	};
	movies.push(currentMovie);
	setGenres();
	createSVGArcs();
}

function deleteMovie(): void {
	movies.splice(movies.indexOf(currentMovie), 1)
	if(movies.length === 0) {
		currentMovie = {
			name: "",
			runtime: 0,
			genres: [],
			link: ""
		};
	} else {
		currentMovie = movies[0];
	}
	setGenres();
	createSVGArcs();
}

let movies: movie[];
let currentMovie: movie;
let currentMovies: movie[];
const maxHourSlider = 5;
const timeIncrement = 5;

window.onload = setup;
