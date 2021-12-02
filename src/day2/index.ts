import * as path from "path";
import { readInputSplit, readInputSplitNum } from "../helpers/readInput";

const part1 = (input: string[][]) => {
    let leftRight = 0;
    let verti = 0;
    for (const thing of input) {
        if (thing[0] === "forward") {
            leftRight += Number(thing[1]);
        }
        if (thing[0] === "down") {
            verti += Number(thing[1]);
        }
        if (thing[0] === "up") {
            verti -= Number(thing[1]);
        }
    }
    console.log(leftRight, verti);
    return leftRight * verti;
};

const part2 = (input: string[][]) => {
    let leftRight = 0;
    let verti = 0;
    let aim = 0;
    for (const thing of input) {
        if (thing[0] === "forward") {
            leftRight += Number(thing[1]);
            verti += aim * Number(thing[1]);
        }
        if (thing[0] === "down") {
            aim += Number(thing[1]);
        }
        if (thing[0] === "up") {
            aim -= Number(thing[1]);
        }
    }
    console.log(leftRight, verti);
    return leftRight * verti;
};

const main = async () => {
    const input = await readInputSplit(path.join(__dirname, "./input.txt"));
    input.pop();
    const dirs = input.map(l => l.split(" "));
    console.log(input);

    console.time("part1");

    console.log(part1(dirs));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(dirs));

    console.timeEnd("part2");
};

main();
