function hueToHex(hue) {
    return "red";
}
function createSVGArc(arcNum, numArcs) {
    var startAngle = (Math.PI * 2 / numArcs) * arcNum;
    var endAngle = (Math.PI * 2 / numArcs) * (arcNum + 1);
    return "<path d=\"M50,50 l".concat(Math.cos(startAngle) * 50, " ").concat(Math.sin(startAngle) * 50, " A50,50 0 0,1 ").concat((1 + Math.cos(endAngle)) * 50, ",").concat((1 + Math.sin(endAngle)) * 50, " z\"\nfill=\"").concat(hueToHex((startAngle + endAngle) / 2), "\" stroke=\"black\" stroke-width=\"1px\"/>");
}
function createSVGArcs(movies) {
    var arcs = '';
    for (var i = 0; i < movies.length; i++) {
        arcs += createSVGArc(i, movies.length);
    }
    return arcs;
}
var numDefaults = 5;
var defaultMovies = [];
for (var i = 0; i < numDefaults; i++) {
    defaultMovies.push({ name: "m" + i, runtime: i, genres: ["g1", "g" + i] });
}
document.getElementById("wheel").innerHTML += createSVGArcs(defaultMovies);
