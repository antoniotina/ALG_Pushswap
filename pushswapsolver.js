const pushswapstate = require('./pushswapstate')
const Operations = pushswapstate.Operations

class PushswapSolver {
    static pushToTop = 0
    static pushToBottom = 1

    constructor(originalArray, chunkDivision) {
        this.originalArray = [...originalArray]
        this.sortedArray = [...originalArray].sort((a, b) => b - a)
        this.chunks = this.chunkItUp(this.sortedArray, this.sortedArray.length / chunkDivision)
    }

    chunkItUp(arr, len) {
        let chunks = [],
            i = 0,
            n = arr.length;
        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }
        return chunks
    }

    checkBottomFromChunk(chunk, state) {
        for (let i = state.list1.length - 1; i >= 0; i--) {
            if (chunk.includes(state.list1[i])) {
                return state.list1[i]
            }
        }
    }

    checkTopFromChunk(chunk, state) {
        for (const i of state.list1.keys()) {
            if (chunk.includes(state.list1[i])) {
                return state.list1[i]
            }
        }
    }

    checkClosestToRotateFromHigher(number, state) {
        let nextFromHigher = state.list2.filter((x) => x > number)
        let smallest = Math.min(...nextFromHigher)
        return state.list2.indexOf(smallest)
    }

    checkClosestToRotateFromLower(number, state) {
        let nextFromLower = state.list2.filter((x) => x < number)
        let biggest = Math.max(...nextFromLower)
        return state.list2.indexOf(biggest)
    }

    solve() {
        let state = new pushswapstate.PushSwapState(this.originalArray)
        for (let chunk of this.chunks) {
            this.solveChunks(chunk, state)
        }
        this.orderAndPushToA(state)
        this.replacePatterns(state)
        // console.log(state.calculateResult().join())
        return state
    }

    collapseSymetricOperations(symetric, replaceWith, startIndex, result) {
        for (let j = startIndex + 1; result[j] !== Operations.pb && result[j] !== Operations.pa && j < result.length; j++) {
            if (result[j] === symetric) {
                result.splice(j, 1)
                result[startIndex] = replaceWith
                break
            }
        }
    }

    replacePatterns(state) {
        for (let i = 0; i < state.result.length; i++) {
            switch (state.result[i]) {
                case Operations.ra:
                    this.collapseSymetricOperations(Operations.rb, Operations.rr, i, state.result)
                    break
                case Operations.rb:
                    this.collapseSymetricOperations(Operations.ra, Operations.rr, i, state.result)
                    break
                case Operations.rra:
                    this.collapseSymetricOperations(Operations.rrb, Operations.rrr, i, state.result)
                    break
                case Operations.rrb:
                    this.collapseSymetricOperations(Operations.rra, Operations.rrr, i, state.result)
                    break
                default:
                    break;
            }
        }
    }

    orderAndPushToA(state) {
        let indexOfBiggestNumber = state.list2.indexOf(this.sortedArray[0])
        let closestLeftOrRight = { left: indexOfBiggestNumber, right: state.list2.length - indexOfBiggestNumber }
        if (closestLeftOrRight.left < closestLeftOrRight.right) {
            for (let i = 0; i < closestLeftOrRight.left; i++) {
                state.firstElementToLastRB()
            }
        }
        else {
            for (let i = 0; i < closestLeftOrRight.right; i++) {
                state.lastElementToFirstRRB()
            }
        }
        for (let i = 0; i < this.originalArray.length; i++) {
            state.pushFirstBtoAPA()
        }
    }

    solveChunks(chunk, state) {
        while (state.list1.some(v => chunk.indexOf(v) !== -1)) {
            // index = number of ra
            let topFromChunk = this.checkTopFromChunk(chunk, state)

            // max index - bottomfromchunk index = number of rra
            let bottomFromChunk = this.checkBottomFromChunk(chunk, state)
            let topDistanceFromTop = state.list1.indexOf(topFromChunk)
            let bottomDistanceFromTop = Math.abs(state.list1.indexOf(bottomFromChunk) - state.list1.length)

            let closest = this.pushClosestToFrontOfStack(topDistanceFromTop, bottomDistanceFromTop, topFromChunk, bottomFromChunk, state)

            if (state.list2.length === 0 || state.list2.length === 1) {
                state.pushFirstAtoBPB()
            }
            else {
                // if the number is the smallest or the biggest, i have to find the biggest number and put it in front, then push the smallest
                // determine which is closest AGAIN, bigger numbers have a +1 by default because they have to be pushed to the back
                if (Math.max(...state.list2, closest.number) === closest.number) {
                    let closestThan = this.findClosestThan(closest.number, state, this.checkClosestToRotateFromLower)
                    this.executeMaxOperations(closestThan, state)
                }
                else if (Math.min(...state.list2, closest.number) === closest.number) {
                    let closestThan = this.findClosestThan(closest.number, state, this.checkClosestToRotateFromHigher)
                    this.executeMinOperations(closestThan, state)
                }
                else {
                    this.executeOperationsIfnotBiggestOrSmallest(closest, state)
                }
            }
        }
    }

    findClosestThan(number, state, checkClosest) {
        let closestToNumber = checkClosest(number, state)
        return new ClosestThan(closestToNumber, state.list2.length - closestToNumber)
    }

    executeMinOperations(closestThan, state) {
        closestThan.left < closestThan.right ?
            this.executeOperations(closestThan.left + 1, ClosestThan.Left, state) :
            this.executeOperations(closestThan.right - 1, ClosestThan.Right, state)
    }

    executeMaxOperations(closestThan, state) {
        closestThan.left < closestThan.right ?
            this.executeOperations(closestThan.left, ClosestThan.Left, state) :
            this.executeOperations(closestThan.right, ClosestThan.Right, state)
    }

    executeOperationsIfnotBiggestOrSmallest(closest, state) {
        let closestLessThanArray = this.findClosestThan(closest.number, state, this.checkClosestToRotateFromLower)
        let closestMoreThanArray = this.findClosestThan(closest.number, state, this.checkClosestToRotateFromHigher)
        let smallestDistanceToTop = Math.min(closestLessThanArray.left, closestLessThanArray.right, closestMoreThanArray.left, closestMoreThanArray.right)

        switch (smallestDistanceToTop) {
            case closestMoreThanArray.left:
                smallestDistanceToTop++
            case closestLessThanArray.left:
                this.executeOperations(smallestDistanceToTop, ClosestThan.Left, state)
                break;
            case closestLessThanArray.right:
            case closestMoreThanArray.right:
                this.executeOperations(smallestDistanceToTop, ClosestThan.Right, state)
                break;
            default:
        }
    }

    executeOperations(number, direction, state) {
        if (direction === ClosestThan.Left) {
            for (let i = 0; i < number; i++) {
                state.firstElementToLastRB()
            }
        }
        else {
            for (let i = 0; i < number; i++) {
                state.lastElementToFirstRRB()
            }
        }
        state.pushFirstAtoBPB()
    }

    pushClosestToFrontOfStack(topDistanceFromTop, bottomDistanceFromTop, topFromChunk, bottomFromChunk, state) {
        // determine which is closest to the front of the stack
        let closest = topDistanceFromTop <= bottomDistanceFromTop ?
            new Closest(Closest.topElement, topFromChunk, topDistanceFromTop) :
            new Closest(Closest.bottomElement, bottomFromChunk, bottomDistanceFromTop)

        // determine which operation to use
        let operation = closest.position === Closest.topElement ? PushswapSolver.pushToBottom : PushswapSolver.pushToTop

        for (let i = 0; i < closest.distance; i++) {
            operation == PushswapSolver.pushToBottom ? state.firstElementToLastRA() : state.lastElementToFirstRRA()
        }
        return closest
    }
}

class Closest {
    static topElement = 0
    static bottomElement = 1
    constructor(position, number, distance) {
        this.position = position
        this.number = number
        this.distance = distance
    }
}

class ClosestThan {
    static Right = 0
    static Left = 1
    constructor(left, right) {
        this.left = left
        this.right = right
    }
}

module.exports.PushswapSolver = PushswapSolver
