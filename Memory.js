const MAX_UINT256 = 2n ** 256n - 1n;

class Memory {
    constructor() {
        this.memory = [];
    }

    store(offset, value) {
        if(offset < 0 || BigInt(offset) > MAX_UINT256) {
            throw new Error("Invalid Memory Access", { offset, value });
        }

        if(value < 0 || value > 255) {
            throw new Error("Invalid Memory Value", { offset, value });
        }

        this.memory[offset] = value;
    }

    load(offset) {
        if(offset < 0) {
            throw new Error("Invalid Memory Access", { offset });
        }

        if(offset >= this.memory.length) {
            return 0;
        }

        return this.memory[offset];
    }

    loadRange(offset, length) {
        if(offset < 0) {
            throw new Error("Invalid Memory Access", { offset, length });
        }

        const arr = [];
        for(let i = offset; i < offset + length; i++) {
            arr.push(this.load(i));
        }
        const buffer = Buffer.from(arr);

        return buffer;
    }
}

module.exports = Memory;