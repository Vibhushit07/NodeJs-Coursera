// var rect = require('./rectangle');

// function solveRec(l, b) {
//     console.log("Solving for rectangle with l = " + l + " and b = " + b);

//     if(l <= 0 || b <= 0) {
//         console.log("Rectangle dimensions should be greater than zero:  l = " + l + ",  and b = " + b);
//     } else {
// 	    console.log("The area of the rectangle is " + rect.area(l,b) );
// 	    console.log("The perimeter of the rectangle is " + rect.perimeter(l,b) );
//     }
// }

// solveRec(2, 4);
// solveRec(3, 5);
// solveRec(0, 5);
// solveRec(-3, 5);

var rect = require('./rectangle1');

function solveRec(l, b) {
    console.log("Solving for rectangle with l = " + l + " and b = " + b);

    rect(l, b, (err, rectangle) => {
        if(err) {
            console.log("Error: " + err.message);
        } else {
            console.log("The area of the rectangle of dimensions l = " + l + " and b = " + b + " is " + rectangle.area());
            console.log("The perimeter of the rectangle of dimensions l = " + l + " and b = " + b + " is " + rectangle.perimeter());
        }
    });

    console.log("This statement is after the call to rect()");
}

solveRec(2, 4);
solveRec(3, 5);
solveRec(0, 5);
solveRec(-3, 5);