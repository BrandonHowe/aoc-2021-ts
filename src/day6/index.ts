import * as path from "path";
import { readInputSplitNum } from "../helpers/readInput";

const part1 = (input: number[]) => {

};

const part2 = (input: number[]) => {

};

const main = async () => {
    const input = await readInputSplitNum(path.join(__dirname, "./input.txt"));

    console.time("part1");

    part1(input);

    console.timeEnd("part1");

    console.time("part2");

    part2(input);

    console.timeEnd("part2");
};

main();
