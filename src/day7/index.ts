import * as path from "path";
import { readInputRaw, readInputSplitNum } from "../helpers/readInput";

const part1 = (input: number[]) => {
    let leastFuelCount = 9999999;
    let leastFuelCountIdx = -1;
    for (let i = 0; i < Math.max(...input); i++) {
        const totalCost = input.reduce(
            (acc, cur) => acc + Math.abs(cur - i),
            0
        );
        if (totalCost < leastFuelCount) {
            leastFuelCount = totalCost;
            leastFuelCountIdx = i;
        }
    }
    return leastFuelCount;
};

const part2 = (input: number[]) => {
    let leastFuelCount = 99999999999999999999999999999999999;
    let leastFuelCountIdx = -1;
    for (let i = 0; i < Math.max(...input); i++) {
        const totalCost = input.reduce(
            (acc, cur) =>
                acc +
                Math.abs(
                    (Math.pow(Math.abs(cur - i), 2) + Math.abs(cur - i)) / 2
                ),
            0
        );
        // console.log(input.map((cur) => Math.abs((Math.pow(Math.abs(cur - i), 2) + (Math.abs(cur - i))) / 2), 0));
        // console.log(totalCost, i);
        if (totalCost < leastFuelCount) {
            leastFuelCount = totalCost;
            leastFuelCountIdx = i;
        }
    }
    return leastFuelCount;
};

const main = async () => {
    const input = (await readInputRaw(path.join(__dirname, "./input.txt")))
        .split(",")
        .map(Number);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
