import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = {
    polymer: string;
    rules: Record<string, string>;
};

const part1 = (input: Input) => {
    const doIter = () => {
        for (let i = 0; i < input.polymer.length - 1; i++) {
            const smallStr = input.polymer.substring(i, i + 2);
            // console.log(smallStr, input.rules[smallStr]);
            if (input.rules[smallStr]) {
                const splitStr = input.polymer.split("");
                splitStr.splice(i + 1, 0, input.rules[smallStr]);
                i++;
                input.polymer = splitStr.join("");
            }
        }
    };

    for (let i = 0; i < 10; i++) {
        doIter();
    }

    const accum: Record<string, number> = {};

    for (const char of input.polymer) {
        if (accum[char]) {
            accum[char]++;
        } else {
            accum[char] = 1;
        }
    }

    return (
        Math.max(...Object.values(accum)) - Math.min(...Object.values(accum))
    );
};

const part2 = (input: Input) => {
    let pairCount: Record<string, number> = Object.fromEntries(
        Object.entries(input.rules).map(l => [l[0], 0])
    );

    for (let i = 0; i < input.polymer.length - 1; i++) {
        const smallStr = input.polymer.substring(i, i + 2);
        // console.log(smallStr, input.rules[smallStr]);
        pairCount[smallStr]++;
    }

    const totals: Record<string, number> = {};

    for (const char of input.polymer) {
        if (totals[char]) {
            totals[char]++;
        } else {
            totals[char] = 1;
        }
    }

    const doIter = () => {
        const newPairCount: Record<string, number> = {};
        for (const rule in pairCount) {
            const newRule1 = rule[0] + input.rules[rule];
            const newRule2 = input.rules[rule] + rule[1];
            if (newPairCount[newRule1]) {
                newPairCount[newRule1] += pairCount[rule];
            } else {
                newPairCount[newRule1] = pairCount[rule];
            }
            if (newPairCount[newRule2]) {
                newPairCount[newRule2] += pairCount[rule];
            } else {
                newPairCount[newRule2] = pairCount[rule];
            }
            if (totals[input.rules[rule]]) {
                totals[input.rules[rule]] += pairCount[rule];
            } else {
                totals[input.rules[rule]] = pairCount[rule];
            }
        }
        pairCount = newPairCount;
    };

    for (let i = 0; i < 40; i++) {
        doIter();
    }

    return (
        Math.max(...Object.values(totals)) - Math.min(...Object.values(totals))
    );
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input: Partial<Input> = {};
    input.polymer = raw.shift();
    raw.shift();
    input.rules = raw.reduce(
        (acc, cur) => ({
            ...acc,
            [cur.split(" -> ")[0]]: cur.split(" -> ")[1]
        }),
        {}
    );

    console.log(input);

    console.time("part1");

    // console.log(part1(input as Input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input as Input));

    console.timeEnd("part2");
};

main();
