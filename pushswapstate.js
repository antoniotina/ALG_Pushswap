const Operations = {
    sa: 0,
    sb: 1,
    pa: 2,
    pb: 3,
    ra: 4,
    rb: 5,
    rr: 6,
    rra: 7,
    rrb: 8,
    rrr: 9,
    strings: ['sa', 'sb', 'pa', 'pb', 'ra', 'rb', 'rr', 'rra', 'rrb', 'rrr']
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
        this.result.push(Operations.sa)
        this.swapElements(this.list1, 0, 1)
    }

    swapFirstTwoElementsSB() {
        this.result.push(Operations.sb)
        this.swapElements(this.list2, 0, 1)
    }

    swapFirstTwoElementsSC() {
        this.result.push(Operations.sc)
        this.swapElements(this.list2, 0, 1)
        this.swapElements(this.list1, 0, 1)
    }

    pushFirstBtoAPA() {
        this.result.push(Operations.pa)
        this.list1.unshift(this.list2.shift())
    }

    pushFirstAtoBPB() {
        this.result.push(Operations.pb)
        this.list2.unshift(this.list1.shift())
    }

    firstElementToLastRA() {
        this.result.push(Operations.ra)
        let firstElement = this.list1.shift()
        this.list1.push(firstElement)
    }

    firstElementToLastRB() {
        this.result.push(Operations.rb)
        let firstElement = this.list2.shift()
        this.list2.push(firstElement)
    }

    simultaneousRR() {
        this.result.push(Operations.rr)
        this.firstElementToLastRB()
        this.firstElementToLastRA()
    }

    lastElementToFirstRRA() {
        this.result.push(Operations.rra)
        let lastElement = this.list1.pop()
        this.list1.unshift(lastElement)
    }

    lastElementToFirstRRB() {
        this.result.push(Operations.rrb)
        let lastElement = this.list2.pop()
        this.list2.unshift(lastElement)
    }

    simultaneousRR() {
        this.result.push(Operations.rrr)
        this.lastElementToFirstRRA()
        this.lastElementToFirstRRB()
    }

    calculateResult() {
        return this.result.map(x => Operations.strings[x]);
    }
}

module.exports.Operations = Operations
module.exports.PushSwapState = PushSwapState