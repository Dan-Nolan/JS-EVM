const MAX_UINT256 = 2n ** 256n - 1n;

class Stack {
    constructor(maxDepth = 1024) {
        this.stack = [];
        this.maxDepth = maxDepth;
    }

    push(item) {
        if(item < 0 || BigInt(item) > MAX_UINT256) {
            throw new Error("Invalid Stack Item");
        }

        if(this.stack.length >= this.maxDepth) {
            throw new Error("Stack Overflow");
        }

        this.stack.push(item);
    }

    pop() {
        if(this.stack.length === 0) {
            throw new Error("Stack Underflow");
        }

        return this.stack.pop();
    }

    swap(i) {
        if(this.stack.length < i) {
            throw new Error("Stack Underflow");
        }

        const topIdx = this.stack.length - 1;
        const targetIdx = this.stack.length - i - 1;
        const tmp = this.stack[targetIdx];
        this.stack[targetIdx] = this.stack[topIdx]
        this.stack[topIdx] = tmp;
    }

    peek(idx) {
        return this.stack[this.stack.length - idx - 1];
    }
}

module.exports = Stack;