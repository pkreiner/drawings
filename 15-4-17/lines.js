var shineSpread = 0.1;
var lineColor = '#011404';
var lampColor = '#ffc300';
var shineColorDull = lineColor;
var shineColorBright = '#ffeeba';
var backgroundColor = '#a3a59f';

var background = new Shape.Rectangle({
    rectangle: view.bounds,
    fillColor: backgroundColor
});

var randomLineGroup = new Group();
var numLines = 150;
var randomLines = [];
for (var i = 0; i < numLines; i++) {
    var startPoint = randomPoint();
    var angle = Math.random() * 360;
    var length = randInt(100, 400);
    var endPoint = startPoint + new Point(length, 0);
    var line = new Path.Line(startPoint, endPoint);
    line.rotate(angle, startPoint);
    line.strokeColor = lineColor;
    line.strokeWidth = 2;
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

    for (var i = 0; i < randomLines.length; i++) {
	var line = randomLines[i];
	var p = line.firstSegment.point;
	var q = line.lastSegment.point;
	var reflectionT = projectOnto(lamp.position, p, q);
	if (0 < reflectionT && reflectionT < 1) {
	    // var point = p + (q - p) * reflectionT;
	    
	    var startPoint = p + (q - p) * Math.max(0, reflectionT - shineSpread);
	    var endPoint = p + (q - p) * Math.min(1, reflectionT + shineSpread);
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

function putItemsInActiveLayer(items) {
    for (var i = 0; i < items.length; i++) {
	project.activeLayer.insertChild(i, items[i]);
    }
}
