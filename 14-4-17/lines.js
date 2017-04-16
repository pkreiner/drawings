// var mainPath = new Path();
// mainPath.strokeColor = 'black';
// var start = new Point(100, 100);
// mainPath.moveTo(start);

var background = new Shape.Rectangle({
    rectangle: view.bounds,
    fillColor: 'black'
});

var t = 0;
var spacing = 30;
var numLines = Math.floor(view.size.width / spacing);
var maxHorizontalJump = 5;
var horizontalJumpProb = 0.03;
var maxVerticalJump = 5;


var startingPoints = []
for (var i = 0; i < numLines; i++) {
    var x = (i + 1) * spacing;
    startingPoints.push(new Point(x, 0));
}

var paths = [];
for (var i = 0; i < numLines; i++) {
    var path = new Path({
	strokeColor: '#69aebf',
	strokeWidth: 1
    });
    path.add(startingPoints[i]);
    paths.push(path);
}

function onFrame() {
    t += 1;
    for (i = 0; i < numLines; i++) {
	if (i < view.size.height) {
	
	    var path = paths[i];
	    var lastPoint = path.lastSegment.point;
	    var horizontalOffset =
		Math.random() > horizontalJumpProb
		? 0
	    // : randInt(-1 * maxHorizontalJump, maxHorizontalJump + 1);
		: maxHorizontalJump * randInt(-1, 2);
	    var verticalOffset = maxVerticalJump;
	    var newPoint = lastPoint + new Point(horizontalOffset, verticalOffset)
	    path.add(newPoint);
	}
    }
    // console.log(paths);
}

// generate a random int between lower and upper, inclusive below
function randInt(lower, upper) {
    return Math.floor(Math.random() * (upper - lower)) + lower;
}
