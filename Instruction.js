class Instruction {
    constructor(opcode, name) {
        this.opcode = opcode;
        this.name = name;
    }
    execute() {
        throw new Error("not implemented!");
    }
}

module.exports = Instruction;