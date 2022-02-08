interface movie {
	name: string;
	runtime: number;
	genres: string[];
}

function hueToHex(hue: number): string {
	return "red";
}

function createSVGArc(arcNum: number, numArcs: number): string {
	let startAngle: number = (Math.PI * 2 / numArcs) * arcNum;
	let endAngle: number = (Math.PI * 2 / numArcs) * (arcNum + 1);
	return `<path d="M50,50 l${Math.cos(startAngle) * 50} ${Math.sin(startAngle) * 50} A50,50 0 0,1 ${(1 + Math.cos(endAngle)) * 50},${(1 + Math.sin(endAngle)) * 50} z"
fill="${hueToHex((startAngle + endAngle) / 2)}" stroke="black" stroke-width="1px"/>`;
}

function createSVGArcs(movies: movie[]): string {
	let arcs: string = '';
	for(let i = 0; i < movies.length; i++) {
		arcs += createSVGArc(i, movies.length);
	}
	return arcs;
}
let numDefaults: number = 5;
let defaultMovies: movie[] = [];
for(let i = 0; i < numDefaults; i++) {
	defaultMovies.push({name: "m" + i, runtime: i, genres: ["g1", "g" + i]})
}

document.getElementById("wheel").innerHTML += createSVGArcs(defaultMovies);
