import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = string[][];

const part1 = (input: Input) => {
    const illegals: string[] = [];

    for (const line of input) {
        const openings: string[] = [];
        for (const char of line) {
            if (["[", "(", "<", "{"].includes(char)) {
                openings.push(char);
            }
            if (["]", ")", ">", "}"].includes(char)) {
                const matching: Record<string, string> = {
                    "]": "[",
                    "}": "{",
                    ")": "(",
                    ">": "<"
                };
                if (matching[char] !== openings[openings.length - 1]) {
                    illegals.push(char);
                    break;
                } else {
                    openings.pop();
                }
            }
        }
    }

    console.log(illegals);

    const matching: Record<string, number> = {
        "]": 57,
        "}": 1197,
        ")": 3,
        ">": 25137
    };

    return illegals.reduce((acc, cur) => acc + matching[cur], 0);
};

const part2 = (input: Input) => {
    const scores: number[] = [];

    for (const line of input) {
        const openings: string[] = [];
        let stopped = false;
        for (const char of line) {
            if (["[", "(", "<", "{"].includes(char)) {
                openings.push(char);
            }
            if (["]", ")", ">", "}"].includes(char)) {
                const matching: Record<string, string> = {
                    "]": "[",
                    "}": "{",
                    ")": "(",
                    ">": "<"
                };
                if (matching[char] !== openings[openings.length - 1]) {
                    stopped = true;
                    break;
                } else {
                    openings.pop();
                }
            }
        }
        if (stopped) {
            continue;
        }
        let score = 0;
        for (const char of openings.reverse()) {
            score *= 5;
            const matching: Record<string, number> = {
                "[": 2,
                "{": 3,
                "(": 1,
                "<": 4
            };
            score += matching[char];
        }
        scores.push(score);
    }

    scores.sort((a, b) => b - a);

    return scores[Math.floor(scores.length / 2)];
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = raw.map(l => l.split(""));

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
