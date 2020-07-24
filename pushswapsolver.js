const chunking = require('./chunking.js')
const pushswapstate = require('./pushswapstate')

class PushswapSolver {
    static pushToTop = 0
    static pushToBottom = 1
    static left = 2
    static right = 3

    constructor(originalArray, chunkDivision) {
        this.chunks = new chunking.Chunks(originalArray, chunkDivision)
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
        for (let i = number + 1; i <= Math.max(...state.list2); i++) {
            if (state.list2.includes(i)) {
                return state.list2.indexOf(i)
            }
        }
        process.exit(-1)
    }

    checkClosestToRotateFromLower(number, state) {
        for (let i = number - 1; i >= 0; i--) {
            if (state.list2.includes(i)) {
                return state.list2.indexOf(i)
            }
        }
        process.exit(-1)
    }

    solve() {
        let state = new pushswapstate.PushSwapState(this.chunks.originalArray)
        for (let chunk of this.chunks.chunks) {
            this.solveChunks(chunk, state)
        }
        this.orderAndPushToA(state)
        this.replacePatterns(state)
        return state
    }

    replacePatterns(state) {
        for (let i = 0; i < state.result.length; i++) {
            if (state.result[i] === 'ra') {
                for (let j = i + 1; state.result[j] !== 'pb' && state.result[j] !== 'pa' && j < state.result.length; j++) {
                    if (state.result[j] === 'rb') {
                        state.result.splice(j, 1)
                        state.result[i] = 'rr'
                        break
                    }
                }
            }
            if (state.result[i] === 'rb') {
                for (let j = i + 1; state.result[j] !== 'pb' && state.result[j] !== 'pa' && j < state.result.length; j++) {
                    if (state.result[j] === 'ra') {
                        state.result.splice(j, 1)
                        state.result[i] = 'rr'
                        break
                    }
                }
            }
            if (state.result[i] === 'rra') {
                for (let j = i + 1; state.result[j] !== 'pb' && state.result[j] !== 'pa' && j < state.result.length; j++) {
                    if (state.result[j] === 'rrb') {
                        state.result.splice(j, 1)
                        state.result[i] = 'rrr'
                        break
                    }
                }
            }
            if (state.result[i] === 'rrb') {
                for (let j = i + 1; state.result[j] !== 'pb' && state.result[j] !== 'pa' && j < state.result.length; j++) {
                    if (state.result[j] === 'rra') {
                        state.result.splice(j, 1)
                        state.result[i] = 'rrr'
                        break
                    }
                }
            }
        }
    }

    orderAndPushToA(state) {
        let indexOfBiggestNumber = state.list2.indexOf(this.chunks.sortedArray[0])
        let closestLeftOrRight = { left: indexOfBiggestNumber, right: state.list2.length - indexOfBiggestNumber }
        if (closestLeftOrRight.left < closestLeftOrRight.right) {
            for (let i = 1; i <= closestLeftOrRight.left; i++) {
                state.firstElementToLastRB()
            }
        }
        else {
            for (let i = 1; i <= closestLeftOrRight.right; i++) {
                state.lastElementToFirstRRB()
            }
        }
        for (let i = 0; i < this.chunks.originalArray.length; i++) {
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
                    let closestLessThan = this.checkClosestToRotateFromLower(closest.number, state)
                    let closestLessThanArray = { left: closestLessThan, right: state.list2.length - closestLessThan }
                    closestLessThanArray.left < closestLessThanArray.right ?
                        this.executeOperations(closestLessThanArray.left, PushswapSolver.left, state) :
                        this.executeOperations(closestLessThanArray.right, PushswapSolver.right, state)
                }
                else if (Math.min(...state.list2, closest.number) === closest.number) {
                    let closestMoreThan = this.checkClosestToRotateFromHigher(closest.number, state)
                    let closestMoreThanArray = { left: closestMoreThan, right: state.list2.length - closestMoreThan }
                    closestMoreThanArray.left < closestMoreThanArray.right ?
                        this.executeOperations(closestMoreThanArray.left + 1, PushswapSolver.left, state) :
                        this.executeOperations(closestMoreThanArray.right - 1, PushswapSolver.right, state)
                }
                else {
                    this.executeOperationsIfnotBiggestOrSmallest(closest, state)
                }
            }
        }
    }

    executeOperationsIfnotBiggestOrSmallest(closest, state) {
        let closestLessThan = this.checkClosestToRotateFromLower(closest.number, state)
        let closestMoreThan = this.checkClosestToRotateFromHigher(closest.number, state)

        let closestLessThanArray = { left: closestLessThan, right: state.list2.length - closestLessThan }
        let closestMoreThanArray = { left: closestMoreThan, right: state.list2.length - closestMoreThan }

        switch (Math.min(closestLessThanArray.left, closestLessThanArray.right, closestMoreThanArray.left, closestMoreThanArray.right)) {
            case closestLessThanArray.left:
                this.executeOperations(closestLessThanArray.left, PushswapSolver.left, state)
                break;
            case closestMoreThanArray.left:
                this.executeOperations(closestMoreThanArray.left + 1, PushswapSolver.left, state)
                break;
            case closestLessThanArray.right:
                this.executeOperations(closestLessThanArray.right, PushswapSolver.right, state)
                break;
            case closestMoreThanArray.right:
                this.executeOperations(closestMoreThanArray.right, PushswapSolver.right, state)
                break;
            default:
        }
    }

    executeOperations(number, direction, state) {
        if (direction === PushswapSolver.left) {
            for (let i = 1; i <= number; i++) {
                state.firstElementToLastRB()
            }
        }
        else {
            for (let i = 1; i <= number; i++) {
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

        for (let i = 1; i <= closest.distance; i++) {
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

module.exports.PushswapSolver = PushswapSolver