class Chunks {
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
}

module.exports.Chunks = Chunks