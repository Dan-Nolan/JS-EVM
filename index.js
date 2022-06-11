const fs = require('fs');
const ExecutionContext = require('./ExecutionContext');
const Calldata = require('./Calldata');
const {decodeOpcode, INSTRUCTIONS_BY_NAME} = require('./instructions');

function run(code, calldata, maxInstructions) {
    const context = new ExecutionContext(code, calldata);

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
            console.log("Max Instructions Reached.");
            return;
        }
    }
    
    const returndata = context.returndata;
    const hexreturn = returndata ? `0x${returndata.toString('hex')}` : "0x";
    console.log(`Output: ${hexreturn}`);
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

const assembly = fs.readFileSync("./assembly/scratch.easm").toString();
run(assemble(assembly), new Calldata("1234"));