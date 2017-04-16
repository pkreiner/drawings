// var lineColor = '#011404';
var lineColor = '#8c8e89';
var lampColor = '#ffc300';
var shineColorDull = lineColor;
var shineColorBright = '#d8eeff';
var backgroundColor = '#a3a59f';

var background = new Shape.Rectangle({
    rectangle: view.bounds,
    fillColor: backgroundColor
});

var randomLineGroup = new Group();
var numLines = 200;
var randomLines = [];
for (var i = 0; i < numLines; i++) {
    var startPoint = randomPoint();
    // var angle = Math.random() * 360;
    var angle = 0;
    var length = randInt(50, 150);
    var endPoint = startPoint + new Point(length, 0);
    var line = new Path.Line(startPoint, endPoint);
    line.rotate(angle, startPoint);
    line.strokeColor = lineColor;
    line.strokeWidth = 1;
    randomLines.push(line);
    randomLineGroup.addChild(line);
}

var lampRadius = 50;
var lamp = new Path.Circle({
    center: new Point(100, 100),
    radius: lampRadius,
    fillColor: lampColor
});
var lampGroup = new Group([lamp]);

var shiningLineGroup = new Group();		       

putItemsInActiveLayer([background, randomLineGroup, shiningLineGroup, lampGroup]);

function onMouseMove(event) {
    lampGroup.position = event.point;
    updateShines();
}

function onFrame() {
    for (var i = 0; i < randomLines.length; i++) {
	randomLines[i].rotate(1);
    }
    updateShines();
}

function updateShines() {
    shiningLineGroup.removeChildren();
    for (var i = 0; i < randomLines.length; i++) {
	var line = randomLines[i];
	var p = line.firstSegment.point;
	var q = line.lastSegment.point;
	var shineCenterT = projectOnto(lamp.position, p, q);
	if (0 < shineCenterT && shineCenterT < 1) {
	    // can adjust 1 in the formula below to make this fall off faster or slower
	    var shineLength = calculateShineLength(distanceToLine(lamp.position, p, q));
	    // var shineLength = maxShineLength / Math.sqrt(1 + square(distanceToLine(lamp.position, p, q)));
	    var shineLengthT = shineLength / (p - q).length;
	    var shineStartT = Math.max(0, shineCenterT - shineLengthT / 2);
	    var shineEndT   = Math.min(1, shineCenterT + shineLengthT / 2);
	    var startPoint = p + (q - p) * shineStartT;
	    var endPoint   = p + (q - p) * shineEndT;
	    
	    var line = new Path.Line(startPoint, endPoint).removeOnMove();
	    line.strokeWidth = 2;
	    line.strokeColor = {
		gradient: {
		    stops: [shineColorDull, shineColorBright, shineColorBright, shineColorDull]
		},
		origin: startPoint,
		destination: endPoint
	    };
	    shiningLineGroup.addChild(line);
	}
    }
}

// generate a random int between lower and upper, inclusive below
function randInt(lower, upper) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}

// return a random point somewhere on the screen
function randomPoint() {
    return new Point(randInt(0, view.size.width), randInt(0, view.size.height));
}

// assume m is 2x2, a length-two list of length-two lists of numbers
function invertMatrix(m) {
    var a = m[0][0];
    var b = m[0][1];
    var c = m[1][0];
    var d = m[1][1];
    var det = a*d - b*c;
    if (det == 0) {
	console.log("Error: tried to invert singular matrix " + String(m));
	return;
    }
    return [[d/det, -b/det], [-c/det, a/det]];
}

// dot product of two length-2 vectors (actually Points)
function dot(u, v) {
    return u.x * v.x + u.y * v.y;
}

var invDotDict = {};
// returns the projection of c onto the line from p to q
// as a real number t, where 0 is p, 1 is q, etc.
function projectOnto(c, p, q) {
    var relC = c - p;
    var v = q - p;
    if (invDotDict[[p, q]] == undefined) {
	invDotDict[[p, q]] = 1 / dot(v, v);
    }
    var t = dot(relC, v) * invDotDict[[p, q]];
    // var t = dot(relC, v) / dot(v, v);
    return t;
}

var sqrtInvDotDict = {};
// returns the distance from c to the line that passes through p and q
function distanceToLine(c, p, q) {
    var relC = c - p;
    var v = q - p;
    var w = v.clone().rotate(90); // note dot(v, v) = dot(w, w);
    
    var distance = Math.abs(dot(relC, w) * Math.sqrt(1 / dot(v, v)));
    return distance;
}

// console.log(distanceToLine(new Point(2, 2), new Point(1, 0), new Point(0, 1)));

function putItemsInActiveLayer(items) {
    for (var i = 0; i < items.length; i++) {
	project.activeLayer.insertChild(i, items[i]);
    }
}

function square(x) {
    return x * x;
}

// height of the viewer above the screen
var h = 10;
// the apparent size of the lamp, as reflected in the 'random line'.
// Involves some sloppy geometry that I hope still works out okay.
// function calculateShineLength(centerDistToLine) {
//     var outerDistToLine = Math.max(1, centerDistToLine - lampRadius);
//     var shrinkFactor = Math.sqrt(1 + square(outerDistToLine / h));
//     return lampRadius / shrinkFactor;
// }

var falloffScalar = 100;
// throwing geometry out the window here
function calculateShineLength(centerDistToLine) {
    var outerDistToLine = Math.max(1, centerDistToLine - lampRadius);
    var shrinkFactor = Math.max(1, outerDistToLine / falloffScalar);
    var modifiedShrinkFactor = shrinkFactor;
    return lampRadius / modifiedShrinkFactor;
}
