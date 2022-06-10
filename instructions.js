const Instruction = require('./Instruction');

const INSTRUCTIONS = [];
const INSTRUCTIONS_BY_OPCODE = {};
const INSTRUCTIONS_BY_NAME = {};

registerInstruction(0x00, "STOP", (ctx) => ctx.stop());

for(let i = 1; i <= 32; i++) {
    registerInstruction(0x60 + i - 1, `PUSH${i}`, (ctx) => {
        ctx.stack.push(ctx.readCodeAtPC(i));
    });
}
for(let i = 1; i <= 16; i++) {
    registerInstruction(0x80 + i - 1, `DUP${i}`, (ctx) => {
        ctx.stack.push(ctx.stack.peek(i - 1));
    });
}
for(let i = 1; i <= 16; i++) {
    registerInstruction(0x90 + i - 1, `SWAP${i}`, (ctx) => {
        ctx.stack.swap(i);
    });
}

registerInstruction(0x01, "ADD", (ctx) => {
    ctx.stack.push(mod256(ctx.stack.pop() + ctx.stack.pop()));
});
registerInstruction(0x02, "MUL", (ctx) => {
    ctx.stack.push(mod256(ctx.stack.pop() * ctx.stack.pop()));
});
registerInstruction(0x03, "SUB", (ctx) => {
    ctx.stack.push(mod256(ctx.stack.pop() - ctx.stack.pop()));
});
registerInstruction(0x53, "MSTORE8", (ctx) => {
    ctx.memory.store(ctx.stack.pop(), ctx.stack.pop() % 256);
});
registerInstruction(0xf3, "RETURN", (ctx) => {
    ctx.setReturnData(ctx.stack.pop(), ctx.stack.pop());
});
registerInstruction(0x56, "JUMP", (ctx) => {
    const dest = ctx.stack.pop();
    if(ctx.jumpdests.indexOf(dest) === -1) {
        throw new Error("Invalid Jump Destination", { dest });
    }
    ctx.setProgramCounter(dest);
});
registerInstruction(0x57, "JUMPI", (ctx) => {
    const dest = ctx.stack.pop();
    const condition = ctx.stack.pop();
    if(condition !== 0) {
        if(ctx.jumpdests.indexOf(dest) === -1) {
            throw new Error("Invalid Jump Destination", { dest });
        }
        ctx.setProgramCounter(dest);
    }
});
registerInstruction(0x5b, "JUMPDEST", () => { /* nothing! */ });

function mod256(num) {
    return parseInt(BigInt(num) % 2n ** 256n);
}

function registerInstruction(opcode, name, executeFunc) {
    const instruction = new Instruction(opcode, name);
    instruction.execute = executeFunc;
    INSTRUCTIONS.push(instruction);
    INSTRUCTIONS_BY_OPCODE[opcode] = instruction;
    INSTRUCTIONS_BY_NAME[name] = instruction;
    return instruction;
}

function decodeOpcode(context) {
    if(context.pc < 0 || context.pc >= context.code.length) {
        throw new Error("Invalid Code Offset", { code, context });
    }

    if(context.pc >= (context.code.length / 2)) {
        return INSTRUCTIONS_BY_NAME.STOP;
    }

    const opcode = context.readCodeAtPC();
    const instruction = INSTRUCTIONS_BY_OPCODE[opcode];
    if(!instruction) {
        throw new Error("Unknown Opcode");
    }

    return instruction;
}

module.exports = {
    INSTRUCTIONS,
    INSTRUCTIONS_BY_OPCODE,
    INSTRUCTIONS_BY_NAME,
    registerInstruction,
    decodeOpcode
}