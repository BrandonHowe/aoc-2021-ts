import * as path from "path";
import { displayGridFuncConfig } from "../helpers/displayGrid";
import { readInputSplit } from "../helpers/readInput";

type Input = number[][];

const part1 = (input: Input) => {
    let q: string[] = [];
    const dist: Record<string, number> = {};

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            q.push(`${i}|${j}`);
            dist[`${i}|${j}`] = 999999;
        }
    }

    dist["0|0"] = 0;

    while (q.length !== 0) {
        const current = q.sort((a, b) => dist[a] - dist[b])[0].split("|").map(Number);

        q = q.filter(l => l !== current.join("|"));

        const neighbors = [
            [current[0] + 1, current[1]],
            [current[0] - 1, current[1]],
            [current[0], current[1] + 1],
            [current[0], current[1] - 1]
        ];

        for (const neighbor of neighbors) {
            if (!q.includes(neighbor.join("|"))) continue;
            if (neighbor[0] < 0 || neighbor[1] < 0 || neighbor[0] >= input.length || neighbor[1] >= input.length) {
                continue;
            }
            const alt = dist[current.join("|")] + input[neighbor[0]][neighbor[1]];
            if (alt < dist[neighbor.join("|")]) {
                dist[neighbor.join("|")] = alt;
            }
        }
    }

    return dist[`${input.length - 1}|${input.length - 1}`];
};

const part2 = (input: Input) => {
    for (const row of input) {
        for (let i = 1; i <= 5; i++) {
            const mapped = row.map(l => l + i > 9 ? l + i - 9 : l + i);
            row.push(...mapped);
        }
    }
    const newInput = [...input];
    for (let i = 1; i <= 5; i++) {
        const mapped = input.map(l =>
            l.map(j => (j + i > 9 ? j + i - 9 : j + i))
        );
        newInput.push(...mapped);
    }

    return part1(newInput);
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = raw.map(l => l.split("").map(Number));

    console.time("part1");

    // console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
