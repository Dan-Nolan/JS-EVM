class Calldata {
    constructor(data) {
        this.data = Buffer.from(data, "hex");
    }

    length() {
        return this.data.length;
    }

    readBytes(offset, numBytes) {
        if(offset < 0) {
            throw new Error("Invalid Calldata Access");
        }

        const size = this.length();
        return this.data.readUIntBE(offset, size < numBytes ? size : numBytes);
    }

    readByte(offset) {
        return this.readBytes(offset, 1);
    }
    
    readWord(offset) {
        return this.readBytes(offset, 32);
    }
}

module.exports = Calldata;