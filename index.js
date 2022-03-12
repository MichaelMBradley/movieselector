var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Assumes hue in radians, s=1, v=1
function hueToHex(hue) {
    var cVal = function (hue, offset) {
        return 255 * Math.min(1, Math.max(0, Math.abs(((hue + offset) % 6) - 2) - 1));
    };
    hue *= 3 / Math.PI;
    return "#".concat(ensureLength(cVal(hue, 5), 16)).concat(ensureLength(cVal(hue, 3), 16)).concat(ensureLength(cVal(hue, 1), 16));
}
function ensureLength(num, radix, length) {
    if (radix === void 0) { radix = 10; }
    if (length === void 0) { length = 2; }
    if (typeof num === "string") {
        for (var i = num.length; i < length; i++) {
            num = "0" + num;
        }
        return num;
    }
    else {
        return ensureLength(Math.floor(num).toString(radix), radix, length);
    }
}
function createSVGArcs() {
    function createSVGArc(arcNum, numArcs, name) {
        var arc;
        var startAngle = (Math.PI * 2 / numArcs) * arcNum;
        var endAngle = (Math.PI * 2 / numArcs) * (arcNum + 1);
        if (numArcs === 1) {
            arc = "<circle cx=\"50\" cy=\"50\" r=\"50\" stroke=\"black\" stroke-width=\"1px\" fill=\"red\" id=\"".concat(name, "\" />");
        }
        else {
            arc = "<path d=\"M50,50 l".concat(Math.cos(startAngle) * 50, " ").concat(Math.sin(startAngle) * 50, " A50,50 0 0,1 ").concat((1 + Math.cos(endAngle)) * 50, ",").concat((1 + Math.sin(endAngle)) * 50, " z\"\nfill=\"").concat(hueToHex((startAngle + endAngle) / 2), "\" stroke=\"black\" stroke-width=\"1px\" id=\"").concat(name, "\" />");
        }
        // TODO: Use `document.createElement()`, and a better formula for the font size
        var fontSize = 15 / Math.sqrt(numArcs);
        arc += "<text font-weight=\"bolder\" x=\"97\" y=\"50\" fill=\"white\" stroke=\"black\" stroke-width=\"0.1px\" font-family=\"monospace\" transform=\"rotate(".concat((startAngle + endAngle) * 90 / Math.PI, " 50,50)\" text-anchor=\"end\" dominant-baseline=\"central\" font-size=\"").concat(Math.min(fontSize, 60 / name.length), "px\" id=\"").concat(name, "@@@text\">").concat(name, "</text>");
        return arc;
    }
    updateCurrentMovies();
    var arcs = '<circle cx="50" cy="50" r="50" stroke="black" stroke-width="1px" fill="black" />';
    for (var i = 0; i < currentMovies.length; i++) {
        arcs += createSVGArc(i, currentMovies.length, currentMovies[i].name);
    }
    arcs += "<circle id=\"spinCirc\" cx=\"50\" cy=\"50\" r=\"10\" stroke=\"black\" stroke-width=\"1px\" fill=\"white\"/>\n<text id=\"spinCirc@@@text\" x=\"50\" y=\"50\" text-anchor=\"middle\" dominant-baseline=\"central\" font-size=\"8\">Spin!</text>";
    document.getElementById("wheel").innerHTML = arcs;
    for (var i = 0; i < currentMovies.length; i++) {
        document.getElementById(currentMovies[i].name).addEventListener("click", arcClick);
        document.getElementById(currentMovies[i].name + "@@@text").addEventListener("click", arcClick);
    }
    document.getElementById("spinCirc").addEventListener("click", spinClick);
    document.getElementById("spinCirc@@@text").addEventListener("click", spinClick);
}
function updateSliders(event) {
    var thisVal = parseInt(event.target.value);
    var timeString;
    // @ts-ignore
    var maxVal = parseInt(document.getElementById(event.target.id).max);
    if (thisVal === maxVal) {
        timeString = "∞h ∞m";
    }
    else {
        timeString = "".concat(ensureLength(thisVal / (maxVal / maxHourSlider), 10, 1), "h").concat(ensureLength((thisVal % (maxVal / maxHourSlider)) * timeIncrement), "m");
    }
    if (event.target.id === "minTime") {
        // @ts-ignore
        var otherVal = parseInt(document.getElementById("maxTime").value);
        if (thisVal > otherVal) {
            // @ts-ignore
            document.getElementById("maxTime").value = thisVal;
            // @ts-ignore
            document.getElementById("max").innerText = timeString;
        }
        document.getElementById("min").innerText = timeString;
    }
    else {
        // @ts-ignore
        var otherVal = parseInt(document.getElementById("minTime").value);
        if (thisVal < otherVal) {
            // @ts-ignore
            document.getElementById("minTime").value = thisVal;
            // @ts-ignore
            document.getElementById("min").innerText = timeString;
        }
        document.getElementById("max").innerText = timeString;
    }
    createSVGArcs();
}
function setGenres() {
    // @ts-ignore
    var genres = new Set();
    for (var _i = 0, movies_1 = movies; _i < movies_1.length; _i++) {
        var movie = movies_1[_i];
        for (var _a = 0, _b = movie.genres; _a < _b.length; _a++) {
            var genre = _b[_a];
            genres.add(genre);
        }
    }
    var genreText = '';
    genres.forEach(function (genre) {
        genreText += "<input type=\"checkbox\" id=\"".concat(genre, "\" onclick=\"createSVGArcs()\"><label for=\"example1\">").concat(genre, "</label><br>");
    });
    document.getElementById("genre").innerHTML = genreText;
    createSVGArcs();
}
function arcClick(event) {
    currentMovie = movies.filter(function (movie) { return movie.name === event.target.id.split("@@@")[0]; })[0];
    loadMovieEditor();
}
function bezEaseOut(frac) {
    frac = 1 - frac;
    return frac * (frac + 1 / frac);
}
function spinClick() {
    var numDeg = (5 + Math.random() * 4) * 360;
    var _loop_1 = function (i) {
        setTimeout(function () {
            var deg = bezEaseOut(i / numDeg) * numDeg;
            //console.log(currentMovies, currentMovies.length * ((630 - i) % 360) / 360);
            document.getElementById("wheel").style.transform = "rotate(".concat(deg, "deg)");
            // @ts-ignore
            currentMovie = currentMovies[parseInt(currentMovies.length * ((630 - (deg % 360)) % 360) / 360)];
            document.getElementById("currentMovie").innerText = currentMovie.name;
            loadMovieEditor();
        }, i * 2);
    };
    for (var i = 0; i < numDeg; i++) {
        _loop_1(i);
    }
}
function loadMovieEditor() {
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
function getMovies() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // @ts-ignore
            if (document.getElementById("loadFromFile").files.length !== 0) {
                // TODO: Allow uploading files
                return [2 /*return*/, []];
            }
            if (document.cookie !== "") {
                return [2 /*return*/, JSON.parse(document.cookie)];
            }
            return [2 /*return*/, fetch("defaultMovies.json", {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(function (response) { return response.json(); })
                    .then(function (json) {
                    return json;
                })];
        });
    });
}
function setup() {
    getMovies().then(function (retMovies) {
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
    document.getElementById("include").addEventListener("click", createSVGArcs);
    // @ts-ignore
    document.getElementById("exclude").addEventListener("click", createSVGArcs);
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
function rotate(event) {
    // @ts-ignore
    var val = parseInt(event.target.value);
    document.getElementById("wheel").style.transform = "rotate(".concat(val, "deg)");
    // @ts-ignore
    console.log((630 - val) % 360, parseInt(currentMovies.length * ((630 - val) % 360) / 360));
}
function updateNumMovies(event) {
    movies = [];
    for (var i = 0; i < event.target.value; i++) {
        movies.push({ name: "".concat(i), runtime: i, genres: ["1", "".concat(i)], link: "" });
    }
    currentMovie = movies[0];
    setGenres();
    createSVGArcs();
    loadMovieEditor();
}
function updateCurrentMovies() {
    var inGenre = [];
    var exGenre = [];
    document.querySelectorAll("input[type=checkbox]").forEach(function (genreCheck) {
        // @ts-ignore
        if (!genreCheck.checked) {
            return;
        }
        // @ts-ignore
        if (document.getElementById("exclude").checked) {
            exGenre.push(genreCheck.id);
        }
        // @ts-ignore
        if (document.getElementById("include").checked) {
            inGenre.push(genreCheck.id);
        }
    });
    // @ts-ignore
    var minTime = document.getElementById("minTime").value * timeIncrement;
    // @ts-ignore
    if (document.getElementById("minTime").value === document.getElementById("minTime").max) {
        minTime = Number.POSITIVE_INFINITY;
    }
    // @ts-ignore
    var maxTime = document.getElementById("maxTime").value * timeIncrement;
    // @ts-ignore
    if (document.getElementById("maxTime").value === document.getElementById("maxTime").max) {
        maxTime = Number.POSITIVE_INFINITY;
    }
    currentMovies = [];
    for (var _i = 0, movies_2 = movies; _i < movies_2.length; _i++) {
        var movie = movies_2[_i];
        var valid = inGenre.length === 0;
        for (var _a = 0, inGenre_1 = inGenre; _a < inGenre_1.length; _a++) {
            var genre = inGenre_1[_a];
            if (movie.genres.indexOf(genre) !== -1) {
                valid = true;
                break;
            }
        }
        for (var _b = 0, _c = movie.genres; _b < _c.length; _b++) {
            var genre = _c[_b];
            if (exGenre.length != 0 && exGenre.indexOf(genre) !== -1) {
                valid = false;
                break;
            }
        }
        if (minTime > movie.runtime || movie.runtime > maxTime) {
            valid = false;
        }
        if (valid) {
            currentMovies.push(movie);
        }
    }
}
function saveMovie() {
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
function saveNewMovie() {
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
function deleteMovie() {
    movies.splice(movies.indexOf(currentMovie), 1);
    if (movies.length === 0) {
        currentMovie = {
            name: "",
            runtime: 0,
            genres: [],
            link: ""
        };
    }
    else {
        currentMovie = movies[0];
    }
    setGenres();
    createSVGArcs();
}
var movies;
var currentMovie;
var currentMovies;
var maxHourSlider = 5;
var timeIncrement = 5;
window.onload = setup;
