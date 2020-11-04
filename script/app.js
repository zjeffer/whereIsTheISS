let mapImage, ISSImage;

// for css
let css_maxwidth = 22 * 16; // 22rem * 16px

let latitude = 0,
	longitude = 0,
	altitude = 0,
	velocity = 0;

let html_velocity, html_altitude;

// before loading everything else
function preload() {
	// TODO: better map?
	mapImage = loadImage("img/earth.png");
	ISSImage = loadImage("img/satellite.svg");
}

// setup canvas
function setup() {
	let canvas = createCanvas(css_maxwidth, css_maxwidth, WEBGL);
	canvas.parent("js-globe");
	angleMode(DEGREES);
	image(ISSImage, -25, -25, 50, 50);

	// get data from api
	getISSData();
}

//p5js function that responds to window resizing => resize the canvas
function windowResized() {
	resizeCanvas(css_maxwidth, css_maxwidth);
}

const getDOMElements = function () {
	html_velocity = document.querySelector(".js-velocity");
	html_altitude = document.querySelector(".js-altitude");
};

function getISSData() {
	fetch("https://api.wheretheiss.at/v1/satellites/25544")
	.then(res => res.json())
	.then(data => {
		//console.log(data);
		latitude = data["latitude"];
		longitude = data["longitude"];
		altitude = data["altitude"] * 1000; // data is in km, set to meters
		velocity = data["velocity"] / 3.6; // data is in km/h, set to m/s

		setVelocity();
		setAltitude();
	});
	setTimeout(() => {
		getISSData();
	}, 2000);
}

function setVelocity() {
	// todo: space between thousands: 7 000 instead of 7000
	html_velocity.innerText = velocity.toFixed(2);
}

function setAltitude() {
	// todo: space between thousands: 400 000 instead of 400000
	html_altitude.innerText = altitude.toFixed(2);
	
}

function drawEarth() {
	push();
	// don't draw lines on the sphere
	noStroke();

	// add some ambient light for better graphics
	lights();

	// apply the map texture
	texture(mapImage);

	//calculate the ratio; earth isn't a perfect sphere
	let circEquator = 40075;
	let circMeridonial = 40007;
	let ratio = circEquator / circMeridonial;

	rotateX(-latitude);
	rotateY(180 - longitude);

	// sizeX, sizeY, sizeZ, detailX, detailY
	ellipsoid(width / 2.5, height / 2.5, width / 2.5, 100, 100);

	pop();
}

//TODO
function drawOrbit() {
	push();
	noStroke();
	fill(255);
	lights(255);

	rotateX(-90);
	// orbital inclination of the ISS orbit = 51.6437 degrees
	let offset = sin(longitude) * 45;
	// console.log(longitude, offset);
	rotateY(offset + 51.6437);
	// use a torus to display the ISS's orbit
	torus(width / 3 + width / 20, 2, 50, 50);

	pop();
}

function drawISS() {
	// push and pop: https://p5js.org/reference/#/p5/push
	push();
	// translate it with the z axis so its over the earth instead of behind it
	translate(0, 0, width / 2);

	size = 20;
	image(ISSImage, -size / 2, -size / 2, size, size);
	pop();
}

// the draw() function gets called every frame (default framerate = 60)
function draw() {
	// background of the square canvas: same as the page's background
	background("#3A3880");
	
	// create the earth according to the position of the ISS
	drawEarth();
	//drawOrbit();
	// draw the ISS image above the earth
	drawISS();
}

document.addEventListener("DOMContentLoaded", () => {
	//console.log("DOM Loaded");
	getDOMElements();
});
