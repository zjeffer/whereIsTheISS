let mapImage, ISSImage;

//
const provider = "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
const copyright =
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';
let map, layergroup, iss, data;

let latitude = 0,
	longitude = 0;

// before loading everything else
function preload() {
    mapImage = loadImage("img/earth.png");
    ISSImage = loadImage("img/iss.png");
}

// setup canvas
function setup() {
	let canvas = createCanvas(800, 800, WEBGL);
    canvas.parent("js-globe");
    angleMode(DEGREES)

    // TODO: fix image
    image(ISSImage, 0, 0);
	loadMap();
    getISSData();
    
}

function loadMap() {
	map = L.map("mapid").setView([0, 0], 1);

	let ISSIcon = L.icon({
		iconUrl: "/img/iss.png",
		iconSize: [50, 30],
		iconAnchor: [25, 15],
		popupAnchor: [50, 25],
		shadowUrl: "/img/iss.png",
		shadowSize: [60, 40],
		shadowAnchor: [30, 15],
	});

	iss = L.marker([0, 0], { icon: ISSIcon }).addTo(map);
	L.tileLayer(provider, { attribution: copyright }).addTo(map);
}

function getISSData() {
	$.getJSON("https://api.wheretheiss.at/v1/satellites/25544", function (data) {
		console.log(data);
		latitude = data["latitude"];
		longitude = data["longitude"];
		moveISS();
	});
}

function moveISS() {
	// The update to the map
	iss.setLatLng([latitude, longitude]);
	map.panTo([latitude, longitude], (animate = true));
	setTimeout(() => {
		getISSData();
	}, 2000);
}

function drawEarth() {
	push();
	// don't draw lines
	noStroke();

	// add some ambient light for better graphics
	lights();

	// apply the map texture
	texture(mapImage);

	let circEquator = 40075;
	let circMeridonial = 40007;
	let ratio = circEquator / circMeridonial;

    rotateX(-latitude);
	rotateY(180 - longitude);

	width = 300;
	height = width;
	ellipsoid(width, height);

	pop();
}

function drawOrbit() {
	push();
    noStroke();
    fill(255);
    lights(255);    

	rotateX(-90);
	// orbital inclination of the ISS orbit = 51.6437 degrees
    rotateY(51.6437);
	// use a torus to display the ISS's orbit
	torus(350, 2, 50, 50);

    pop();
    
}

function drawISS() {
	push();
	fill(0, 0, 200);
	strokeWeight(1);
	stroke(255);

	translate(0, 0, 400);

	size = 10;
	box(size, size, size);
	pop();
}

// loop
function draw() {
    background(25);
	drawEarth();
    drawOrbit();
	drawISS();
}

const getDOMElements = function () {};

document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM Loaded");
	getDOMElements();
});
