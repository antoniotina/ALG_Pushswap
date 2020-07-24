const psSolver = require('./pushswapsolver.js')

// const originalArray = process.argv.slice(2).map(Number)

// const fewerThanTwo = (originalArray) => originalArray.length < 2

// const alreadySorted = (originalArray) => !originalArray.slice(1).some((value, index) => originalArray[index] >= value)

// if (fewerThanTwo(originalArray) || alreadySorted(originalArray)) {
//     console.log("No operations needed")
//     return
// }


let size = 100;
let tries = 100;

let arrays = [];
for (let i = 0; i < tries; i++) {
    startArray = [];
    for (let i = 0; i < size; i++) {
        startArray.push(i);
    }
    startArray.sort(() => Math.random() - 0.5);
    arrays.push(startArray);
}


let recordMin = 100000;
let recordMax = 0;
let total = 0;
for (let i in arrays) {
    let smallest = []
    for (let y = 4; y < 10; y++) {
        let ps = new psSolver.PushswapSolver([...arrays[i]], y)
        let state = ps.solve()
        let res = state.result
        if (res.length < smallest.length || smallest.length === 0) {
            smallest = res
        }
    }
    total += smallest.length;
    if (smallest.length < recordMin)
        recordMin = smallest.length;
    if (smallest.length > recordMax)
        recordMax = smallest.length;
}

console.log("Antonio the memelord\t\t-\tAVG :", total / tries, "\tMIN :", recordMin, "MAX :", recordMax);



// let solver = new psSolver.PushswapSolver(originalArray)
// solver.solve()