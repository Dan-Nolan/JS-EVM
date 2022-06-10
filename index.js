const ExecutionContext = require('./ExecutionContext');
const {decodeOpcode, INSTRUCTIONS_BY_NAME} = require('./instructions');

function run(code, maxInstructions) {
    const context = new ExecutionContext(code);

    let i = 0;
    while (!context.stopped) {
        const pcBefore = context.pc;
        const instruction = decodeOpcode(context);
        instruction.execute(context);

        console.log(`${instruction.name} @ pc=${pcBefore}`);
        console.log(context);
        console.log("");

        i++;
        if(i === maxInstructions) {
            console.log("Max Instructions Reached.")
            return;
        }
    }

    console.log(`Output: 0x${context.returndata.toString('hex')}`);
}

function padByteStr(val = "") {
    if(val.length === 0) return;
    const hex = parseInt(val).toString('16');
    if(hex.length === 1) return `0${hex}`;
    return hex;
}

function assemble(code) {
    const lines = code.split("\n").map(x => x.trim()).filter(x => x.length > 0);
    const bytecode = lines.map((line) => {
        const [opName, operand1, operand2] = line.split(" ");
        const instruction = INSTRUCTIONS_BY_NAME[opName];
        if(!instruction) {
            throw new Error(`Invalid Instruction Name: ${opName}`);
        }
        return [padByteStr(instruction.opcode), padByteStr(operand1), padByteStr(operand2)].join("");
    }).join("");
    return bytecode;
}

run(assemble(
    `
PUSH1 4
DUP1
PUSH1 0

JUMPDEST
DUP2
PUSH1 18
JUMPI 

PUSH1 0
MSTORE8
PUSH1 1
PUSH1 0
RETURN

JUMPDEST

DUP3
ADD

SWAP1
PUSH1 1
SWAP1
SUB

SWAP1

PUSH1 5
JUMP
    `
));