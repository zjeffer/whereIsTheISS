// colors
let color_alpha = "#28307c";
let color_beta = "#98b6fd";
let color_gamma = "#353762";
let color_delta = "#284268";
let color_white = "#ffffff";

// darkmode vars
let darkmode = false;
let rotations = 0;
// to change the colors in the logo's svg when in darkmode
let logo_svg_group1;
let logo_svg_group2;

let mapImage, ISSImage, ISSImageDark;

// for css
let css_maxwidth = 22 * 16; // 22rem * 16px

let latitude = 0,
	longitude = 0;

let html_velocity, html_altitude, html_darkmode_sun, html_darkmode_moon, html_darkmode, html_darkmode_input;

// before loading everything else
function preload() {
	// TODO: better map?
	mapImage = loadImage("img/earth.png");
	ISSImage = loadImage("img/satellite-dark.svg");
	ISSImageDark = loadImage("img/satellite.svg");
}

// setup: loads after preload()
function setup() {
	getDOMElements();
	let canvas = createCanvas(css_maxwidth, css_maxwidth, WEBGL);
	canvas.parent("js-globe");
	angleMode(DEGREES);	

	// get data from api
	getISSData();

	
}

//p5js function that responds to window resizing => resize the canvas
function windowResized() {
	// if the window width is smaller than css_maxwidth (22rem), resize the canvas to the width of the viewport
	let w = css_maxwidth > windowWidth ? windowWidth : css_maxwidth;
	resizeCanvas(w, w);
}

// get the DOM elements
const getDOMElements = function () {
	root = document.querySelector("html");
	html_velocity = document.querySelector(".js-velocity");
	html_altitude = document.querySelector(".js-altitude");
	html_darkmode_sun = document.querySelector(".js-darkmode-sun");
	html_darkmode_moon = document.querySelector(".js-darkmode-moon");
	html_darkmode = document.querySelector(".js-darkmode");
	html_darkmode_input = document.querySelector(".js-darkmode-input");

	logo_svg_group1 = document.querySelector(".svg_g1");
	logo_svg_group2 = document.querySelector(".svg_g2");

	console.log(logo_svg_group1);
	console.log(logo_svg_group2);

	// uncheck checkbox when DOM loaded
	html_darkmode.checked = false;
	// and set it to lightmode by default
	toggleDarkMode(html_darkmode);
	// on changes: call toggleDarkMode()
	html_darkmode.addEventListener("change", () => toggleDarkMode(html_darkmode));
};

// toggle darkmode
function toggleDarkMode(checkbox) {
	// if checkbox checked: darkmode enabled
	if(checkbox.checked){
		root.classList.add("dark-mode");
		logo_svg_group1.style.fill = color_white;
		logo_svg_group2.style.fill = color_delta;
	} else {
		root.classList.remove("dark-mode");
		logo_svg_group1.style.fill = color_alpha;
		logo_svg_group2.style.fill = color_alpha;
	}
	darkmode = checkbox.checked;
	html_darkmode_input.style.transform = `rotate(${180*rotations}deg)`;
	rotations++;
}

function getISSData() {
	fetch("https://api.wheretheiss.at/v1/satellites/25544")
	.then(res => res.json())
	.then(data => {
		//console.log(data);
		latitude = data["latitude"];
		longitude = data["longitude"];
		altitude = data["altitude"] * 1000; // data is in km, set to meters
		velocity = data["velocity"] / 3.6; // data is in km/h, set to m/s

		setAltitude(altitude);
		setVelocity(velocity);
	});
	setTimeout(() => {
		getISSData();
	}, 2000);
}

// set the velocity html element to the current velocity
function setVelocity(velocity) {
	// todo: space between thousands: 7 000 instead of 7000
	html_velocity.innerText = velocity.toFixed(2);
}

// set the altitude html element to the current altitude
function setAltitude(altitude) {
	// todo: space between thousands: 400 000 instead of 400000
	html_altitude.innerText = altitude.toFixed(2);
}

// draw the earth, rotated so the ISS is above the current location
function drawEarth() {
	push();
	// don't draw lines on the sphere
	noStroke();

	// add some ambient light for better graphics
	lights();

	// apply the map texture
	texture(mapImage);

	rotateX(-latitude);
	rotateY(180 - longitude);

	// width and height are builtin p5js variables: they refer to the width and height of the canvas
	// this is dynamically updated using the windowResized() function
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

// show the ISS image above the globe object
function drawISS() {
	// push and pop: https://p5js.org/reference/#/p5/push
	push();
	// translate it along the z axis so its above the earth instead of behind it
	translate(0, 0, width / 2);

	// set the size for the ISS image
	let size = 20;
	// draw the iss image: image(element, posX of top-left corner, posY of top-left corner, sizeX, sizeY)
	image(ISSImage, -size / 2, -size / 2, size, size);
	
	pop();
}

// the draw() function gets called every frame (default framerate = 60)
function draw() {
	// background of the square canvas element: transparent
	clear();
	
	
	
	// create the earth according to the position of the ISS
	drawEarth();
	//drawOrbit();
	// draw the ISS image above the earth
	drawISS();
}

document.addEventListener("DOMContentLoaded", () => {
	//console.log("DOM Loaded");
	
});
