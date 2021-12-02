import * as path from "path";
import { readInputSplitNum } from "../helpers/readInput";

const part1 = (input: number[]) => {
    let sum = 0;
    for (let i = 1; i < input.length; i++) {
        if (input[i] > input[i - 1]) {
            sum++;
        }
    }
    return sum;
};

const part2 = (input: number[]) => {
    let sum = 0;
    for (let i = 3; i < input.length; i++) {
        if (
            input[i] + input[i - 1] + input[i - 2] >
            input[i - 1] + input[i - 2] + input[i - 3]
        ) {
            sum++;
        }
    }
    return sum;
};

const main = async () => {
    const input = await readInputSplitNum(path.join(__dirname, "./input.txt"));
    console.log(input);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
