// Assumes hue in radians, s=1, v=1
function hueToHex(hue) {
    var cVal = function (hue, offset) {
        return 255 * Math.min(1, Math.max(0, Math.abs(((hue + offset) % 6) - 2) - 1));
    };
    hue *= 3 / Math.PI;
    return "#".concat(ensureLength2(cVal(hue, 5), 16)).concat(ensureLength2(cVal(hue, 3), 16)).concat(ensureLength2(cVal(hue, 1), 16));
}
function ensureLength2(num, radix) {
    if (radix === void 0) { radix = 10; }
    if (typeof num === "string") {
        if (num.length === 1) {
            return "0" + num;
        }
        return num;
    }
    else {
        return ensureLength2(parseInt(num.toString()).toString(radix));
    }
}
function createSVGArc(arcNum, numArcs, name) {
    var arc;
    var startAngle = (Math.PI * 2 / numArcs) * arcNum;
    var endAngle = (Math.PI * 2 / numArcs) * (arcNum + 1);
    if (numArcs === 1) {
        arc = "<circle cx=\"50\" cy=\"50\" r=\"50\" stroke=\"black\" stroke-width=\"1px\" fill=\"red\" />";
    }
    else {
        arc = "<path d=\"M50,50 l".concat(Math.cos(startAngle) * 50, " ").concat(Math.sin(startAngle) * 50, " A50,50 0 0,1 ").concat((1 + Math.cos(endAngle)) * 50, ",").concat((1 + Math.sin(endAngle)) * 50, " z\"\nfill=\"").concat(hueToHex((startAngle + endAngle) / 2), "\" stroke=\"black\" stroke-width=\"1px\"/>");
    }
    arc += "<text x=\"97\" y=\"50\" fill=\"white\" transform=\"rotate(".concat((startAngle + endAngle) * 90 / Math.PI, " 50,50)\" text-anchor=\"end\" dominant-baseline=\"central\" font-size=\"10px\">").concat(name, "</text>");
    return arc;
}
function createSVGArcs(movies) {
    var arcs = '<circle cx="50" cy="50" r="50" stroke="black" stroke-width="1px" fill="black" />';
    for (var i = 0; i < movies.length; i++) {
        arcs += createSVGArc(i, movies.length, movies[i].name);
    }
    return arcs;
}
function updateSliders(event) {
    var thisVal = parseInt(event.target.value);
    if (event.target.id === "minTime") {
        // @ts-ignore
        var otherVal = parseInt(document.getElementById("maxTime").value);
        if (thisVal > otherVal) {
            // @ts-ignore
            document.getElementById("maxTime").value = thisVal;
            // @ts-ignore
            document.getElementById("max").innerText = "".concat(parseInt("" + (thisVal / 4)), "h").concat(ensureLength2(((thisVal % 4) * 15).toString(10)), "m");
        }
        document.getElementById("min").innerText = "".concat(parseInt("" + (thisVal / 4)), "h").concat(ensureLength2(((thisVal % 4) * 15).toString(10)), "m");
    }
    else {
        // @ts-ignore
        var otherVal = parseInt(document.getElementById("minTime").value);
        if (thisVal < otherVal) {
            // @ts-ignore
            document.getElementById("minTime").value = thisVal;
            // @ts-ignore
            document.getElementById("min").innerText = "".concat(parseInt("" + (thisVal / 4)), "h").concat(ensureLength2(((thisVal % 4) * 15).toString(10)), "m");
        }
        document.getElementById("max").innerText = "".concat(parseInt("" + (thisVal / 4)), "h").concat(ensureLength2(((thisVal % 4) * 15).toString(10)), "m");
    }
}
function setGenres() {
    // @ts-ignore
    var genres = new Set();
    for (var _i = 0, defaultMovies_1 = defaultMovies; _i < defaultMovies_1.length; _i++) {
        var movie = defaultMovies_1[_i];
        for (var _a = 0, _b = movie.genres; _a < _b.length; _a++) {
            var genre = _b[_a];
            genres.add(genre);
        }
    }
    var genreText = '';
    genres.forEach(function (genre) {
        genreText += "<input type=\"checkbox\" id=\"".concat(genre, "\"><label for=\"example1\">").concat(genre, "</label><br>");
    });
    document.getElementById("genre").innerHTML = genreText;
}
function setup() {
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
function updateNumMovies(event) {
    defaultMovies = [];
    for (var i = 0; i < event.target.value; i++) {
        defaultMovies.push({ name: "".concat(i), runtime: i, genres: ["1", "".concat(i)], link: "" });
    }
    document.getElementById("wheel").innerHTML = createSVGArcs(defaultMovies);
    setGenres();
}
var defaultMovies = [];
setup();
