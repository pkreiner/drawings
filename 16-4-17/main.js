// Makes a grid, checkerboarded orange-red and green but also randomly
// interspersed with lavender. Not super pretty or complex. But I find
// this checkerboard pattern pretty trippy, and then the way the
// purple breaks it up is interesting.

// And also, it's interesting how the lavender looks more pink when
// surrounded by oranges and more purple when surrounded by greens.

// color variables
var mainColor1 = '#ff9502'
var mainColor2 = '#3eba25';
var randomColor = '#ed9adb';
var lineColor = '#d8d8d8';

// parameters to play with that change the visual character
var randomColorProb = 0.1;
var lineWidth = 1;
var sideLength = 30;

var squareSize = new Size(sideLength, sideLength);
var cols = Math.ceil(view.size.width / sideLength);
var rows = Math.ceil(view.size.height / sideLength);

// draw squares
var squares = new Group();
for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
	var topLeft = new Point(j * sideLength, i * sideLength);
	var square = new Path.Rectangle(topLeft, squareSize);
	var color = Math.random() < randomColorProb ? randomColor :
	    (i + j) % 2 == 0 ? mainColor1 : mainColor2;
	square.fillColor = color;
	squares.addChild(square);
    }
}

// draw lines
var lines = new Group();
var lineStyle = {
    strokeColor : lineColor,
    strokeWidth : lineWidth
};

// horizontal lines
for (var i = 0; i < rows; i++) {
    var start = new Point(0, i * sideLength);
    var end = new Point(view.size.width, i * sideLength);
    var line = new Path.Line(start, end);
    line.style = lineStyle;
    lines.addChild(line);
}

// vertical lines
for (var j = 0; j < cols; j++) {
    var start = new Point(j * sideLength, 0);
    var end = new Point(j * sideLength, view.size.height);
    var line = new Path.Line(start, end);
    line.style = lineStyle;
    lines.addChild(line);
}

// render squares, then lines
project.activeLayer.addChildren([squares, lines]);
