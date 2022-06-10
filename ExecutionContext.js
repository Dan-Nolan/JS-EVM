const Memory = require('./Memory');
const Stack = require('./Stack');
const { INSTRUCTIONS_BY_NAME } =  require('./instructions');

function validJumpDestinations(code) {
    const dests = [];
    for(let i = 0; i < code.length; i+=2) {
        const op = parseInt(code.slice(i, i + 2), 16);
        if(op === INSTRUCTIONS_BY_NAME.JUMPDEST.opcode) {
            dests.push(i / 2);
        }
        else if((INSTRUCTIONS_BY_NAME.PUSH1 <= op) && (op <= INSTRUCTIONS_BY_NAME.PUSH32)) {
            i += op - PUSHES[0] + 1;
        }
    } 
    return dests;
}

class ExecutionContext {
    constructor(code, pc = 0, stack = new Stack(), memory = new Memory()) {
        this.code = code;
        this.stack = stack;
        this.memory = memory;
        this.pc = pc;
        this.stopped = false;
        this.returndata = null;
        this.jumpdests = validJumpDestinations(code);
    }

    stop() {
        this.stopped = true;
    }
    
    setReturnData(offset, length) {
        this.stopped = true;
        this.returndata = this.memory.loadRange(offset, length);
    }

    setProgramCounter(pc) {
        this.pc = pc;
    }

    readCodeAtPC(numBytes = 1) {
        const value = Buffer.from(this.code, "hex").readUIntBE(this.pc, numBytes);
        this.pc += numBytes;
        return value;
    }
}

module.exports = ExecutionContext;
