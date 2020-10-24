let mapImage;

let latitude = 0,
	longitude = 0,
	altitude = 0;

// before loading everything else
function preload() {
	// TODO: better map?
    mapImage = loadImage("img/earth.png");
    ISSImage = loadImage("img/iss.png");
}

// setup canvas
function setup() {
	let canvas = createCanvas(22*16, 22*16, WEBGL);
    canvas.parent("js-globe");
    angleMode(DEGREES);

	// get data from api
    getISSData();
}


//p5js function that responds to window resizing
function windowResized(){
	resizeCanvas(22*16, 22*16);
}

function getISSData() {
	$.getJSON("https://api.wheretheiss.at/v1/satellites/25544", function (data) {
		//console.log(data);
		latitude = data["latitude"];
		longitude = data["longitude"];
		altitude = data["altitude"];
	});
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
    let offset = sin(longitude)*45;
    // console.log(longitude, offset);
    rotateY(offset + 51.6437);
	// use a torus to display the ISS's orbit
	torus(width / 3 + width / 20, 2, 50, 50);

    pop();
    
}

function drawISS() {
	push();
	fill(0, 0, 200);
	strokeWeight(1);
	stroke(255);

	translate(0, 0, width/2);

	size = 10;
	//TODO
	box(size, size, size);
	pop();
}

// the draw() function gets called every frame (default framerate = 60)
function draw() {
    background("#3A3880");
	drawEarth();
    //drawOrbit();
	drawISS();
}

const getDOMElements = function () {};

document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM Loaded");
	getDOMElements();
});
