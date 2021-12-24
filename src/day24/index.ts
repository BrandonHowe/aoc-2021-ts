import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Command =
    | { type: "inp"; value1: string }
    | { type: "add"; value1: string; value2: string | number }
    | { type: "mul"; value1: string; value2: string | number }
    | { type: "div"; value1: string; value2: string | number }
    | { type: "mod"; value1: string; value2: string | number }
    | { type: "eql"; value1: string; value2: string | number };

const parseInput = (strs: string[]) => {
    const res: Command[] = [];

    for (const str of strs) {
        if (str.startsWith("#")) continue;
        const split = str.split(" ");
        if (split[0] === "inp") {
            res.push({ type: "inp", value1: split[1] });
        } else {
            const num2: string | number = isNaN(Number(split[2]))
                ? split[2]
                : Number(split[2]);
            res.push({
                type: split[0] as Command["type"],
                value1: split[1],
                value2: num2
            });
        }
    }

    const filtered: Command[] = [];

    for (const command of res) {
        if (command.type === "div" && command.value2 === 1) continue;
        if (command.type === "eql" && command.value2 === 1) continue;
        if (command.type === "add" && command.value2 === 0) continue;
        filtered.push(command);
    }

    return filtered;
};

const runCommands = (commands: Command[], input: number[]) => {
    const variables: Record<string, number> = {
        w: 0,
        x: 0,
        y: 0,
        z: 0
    };
    let inputIdx = 0;
    for (const command of commands) {
        if (command.type === "inp") {
            variables[command.value1] = input[inputIdx++];
        } else {
            const value1 = variables[command.value1];
            const value2 =
                typeof command.value2 === "number"
                    ? command.value2
                    : variables[command.value2];
            if (command.type === "add") {
                const sum = value1 + value2;
                variables[command.value1] = sum;
            } else if (command.type === "mul") {
                const sum = value1 * value2;
                variables[command.value1] = sum;
            } else if (command.type === "div") {
                const sum = value1 / value2;
                variables[command.value1] = Math.floor(sum);
            } else if (command.type === "mod") {
                const sum = value1 % value2;
                variables[command.value1] = sum;
            } else if (command.type === "eql") {
                variables[command.value1] = Number(value1 === value2);
            }
        }
    }

    return variables;
};

const part1 = (input: Command[]) => {
    /*
    1 x set to 0
    1 x set to z
    1 x modulo 26
    divide z by A (1 or 26)
    x add B
    x = 1 if x != w, x = 0 otherwise
    1 y set to 0
    1 y set to 25
    1 y set to y * x
    1 y add 1
    1 z multiplied by y
    1 y set to 0
    1 y set to w
    y add C
    1 y multiplied by x
    1 z add y

    x = ((z % 26) + B != w)
    y = (25 * x) + 1
    z = (z / A) * y + (w + C) * x

    if A = 1, then B > 10, otherwise B < -5
    if A = 1, x = 1, y = 26, z = (z * 26) + (w + C)
    for z to be 0 x must be 0, (z % 26) + B == w
    w1 + C == w2 - B
    w1 + C + B = w2

    w1 + 1 - 5 = w14    - 9 + 1 - 5 = 5
    w2 + 9 - 6 = w13    - 6 + 9 - 6 = 9
    w3 + 11 - 13 = w4   - 9 + 11 - 13 = 7
    w5 + 6 - 11 = w12   - 9 + 6 - 11 = 4
    w6 + 13 - 14 = w7   - 9 + 13 - 14 = 8
    w8 + 5 - 8 = w9     - 9 + 5 - 8 = 6
    w10 + 2 - 9 = w11   - 9 + 2 - 9 = 2
    96979989692495
    */

    return 96979989692495;
};

const part2 = (input: Command[]) => {
    /*
    w1 + 1 - 5 = w14    - 5 + 1 - 5 = 1
    w2 + 9 - 6 = w13    - 1 + 9 - 6 = 4
    w3 + 11 - 13 = w4   - 3 + 11 - 13 = 1
    w5 + 6 - 11 = w12   - 6 + 6 - 11 = 1
    w6 + 13 - 14 = w7   - 2 + 13 - 14 = 1
    w8 + 5 - 8 = w9     - 4 + 5 - 8 = 1
    w10 + 2 - 9 = w11   - 8 + 2 - 9 = 1
    51316214181141
    */

    return 51316214181141;
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = parseInput(raw);

    // I did this problem by hand actually

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
