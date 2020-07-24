const Operations = {
    sa = 0,
    sb = 1,
    pa = 2,
    pb = 3,
    ra = 4,
    rb = 5,
    rr = 6,
    rra = 7,
    rrb = 8,
    rrr = 9
}

class PushSwapState {
    constructor(originalArray) {
        this.list1 = [...originalArray]
        this.list2 = []
        this.result = []
    }

    swapElements(array, indexA, indexB) {
        let temporary = array[indexA]
        array[indexA] = array[indexB]
        array[indexB] = temporary
    }

    swapFirstTwoElementsSA() {
        this.result.push('sa')
        this.swapElements(this.list1, 0, 1)
    }

    swapFirstTwoElementsSB() {
        this.result.push('sb')
        this.swapElements(this.list2, 0, 1)
    }

    swapFirstTwoElementsSC() {
        this.result.push('sc')
        this.swapElements(this.list2, 0, 1)
        this.swapElements(this.list1, 0, 1)
    }

    pushFirstBtoAPA() {
        this.result.push('pa')
        this.list1.unshift(this.list2.shift())
    }

    pushFirstAtoBPB() {
        this.result.push('pb')
        this.list2.unshift(this.list1.shift())
    }

    firstElementToLastRA() {
        this.result.push('ra')
        let firstElement = this.list1.shift()
        this.list1.push(firstElement)
    }

    firstElementToLastRB() {
        this.result.push('rb')
        let firstElement = this.list2.shift()
        this.list2.push(firstElement)
    }

    simultaneousRR() {
        this.result.push('rr')
        this.firstElementToLastRB()
        this.firstElementToLastRA()
    }

    lastElementToFirstRRA() {
        this.result.push('rra')
        let lastElement = this.list1.pop()
        this.list1.unshift(lastElement)
    }

    lastElementToFirstRRB() {
        this.result.push('rrb')
        let lastElement = this.list2.pop()
        this.list2.unshift(lastElement)
    }

    simultaneousRR() {
        this.result.push('rrr')
        this.lastElementToFirstRRA()
        this.lastElementToFirstRRB()
    }
}

module.exports.Operations = Operations
module.exports.PushSwapState = PushSwapState