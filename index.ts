interface movie {
	name: string;
	runtime: number;
	genres: string[];
}

// Assumes hue in radians, s=1, v=1
function hueToHex(hue: number): string {
	// number.toString(16);
	hue = hue * 3 / Math.PI;
	let f = hue % 1;
	let r,g,b;
	switch(Math.floor(hue) % 6) {
		case 0:
			r = 1; g = f; b = 0;
			break;
		case 1:
			r = 1-f; g = 1; b = 0;
			break;
		case 2:
			r = 0; g = 1; b = f;
			break;
		case 3:
			r = 0; g = 1-f; b = 1;
			break;
		case 4:
			r = f; g = 0; b = 1;
			break;
		case 5:
			r = 1; g = 0; b = 1-f;
			break;
	}
	r *= 255; g *= 255; b *= 255;
	return `#${ehf(parseInt(r).toString(16))}${ehf(parseInt(g).toString(16))}${ehf(parseInt(b).toString(16))}`;
}

function ehf(hex: string): string {
	if(hex.length === 1) {
		return "0" + hex;
	}
	return hex;
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

function updateNumMovies(event): void {
	defaultMovies = [];
	for(let i = 0; i < event.target.value; i++) {
		defaultMovies.push({name:`${i}`,runtime:i,genres:[]})
	}
	document.getElementById("wheel").innerHTML = createSVGArcs(defaultMovies);
}

let defaultMovies: movie[] = [];

document.getElementById("numMovies").addEventListener("input", updateNumMovies)
document.getElementById("wheel").innerHTML = createSVGArcs(defaultMovies);
