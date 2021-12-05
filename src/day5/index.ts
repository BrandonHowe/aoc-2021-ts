import * as path from "path";
import { readInputSplit, readInputSplitNum } from "../helpers/readInput";

const part1 = (input: [number, number][][]) => {
    const stuff: Record<string, number> = {};

    for (const line of input) {
        const p1 = line[0];
        const p2 = line[1];
        // console.log(p1, p2);
        if (p1[0] === p2[0]) {
            for (
                let i = Math.min(p1[1], p2[1]);
                i <= Math.max(p1[1], p2[1]);
                i++
            ) {
                // console.log(`${p1[0]}|${i}`);
                stuff[`${p1[0]}|${i}`] = stuff[`${p1[0]}|${i}`]
                    ? stuff[`${p1[0]}|${i}`] + 1
                    : 1;
            }
        } else if (p1[1] === p2[1]) {
            for (
                let i = Math.min(p1[0], p2[0]);
                i <= Math.max(p1[0], p2[0]);
                i++
            ) {
                // console.log(`${i}|${p1[1]}`);
                stuff[`${i}|${p1[1]}`] = stuff[`${i}|${p1[1]}`]
                    ? stuff[`${i}|${p1[1]}`] + 1
                    : 1;
            }
        }
    }

    return Object.values(stuff).filter(l => l >= 2).length;
};

const part2 = (input: [number, number][][]) => {
    const stuff: Record<string, number> = {};

    for (const line of input) {
        const p1 = line[0];
        const p2 = line[1];
        // console.log(p1, p2);
        const left = Math.min(p1[0], p2[0]) === p1[0] ? p1 : p2;
        const right = Math.min(p1[0], p2[0]) !== p1[0] ? p1 : p2;
        if (p1[0] === p2[0]) {
            for (
                let i = Math.min(p1[1], p2[1]);
                i <= Math.max(p1[1], p2[1]);
                i++
            ) {
                // console.log(`${p1[0]}|${i}`);
                stuff[`${p1[0]}|${i}`] = stuff[`${p1[0]}|${i}`]
                    ? stuff[`${p1[0]}|${i}`] + 1
                    : 1;
            }
        } else if (p1[1] === p2[1]) {
            for (
                let i = Math.min(p1[0], p2[0]);
                i <= Math.max(p1[0], p2[0]);
                i++
            ) {
                // console.log(`${i}|${p1[1]}`);
                stuff[`${i}|${p1[1]}`] = stuff[`${i}|${p1[1]}`]
                    ? stuff[`${i}|${p1[1]}`] + 1
                    : 1;
            }
        } else {
            for (let i = 0; i <= right[0] - left[0]; i++) {
                const goingDown = right[1] < left[1] ? -1 : 1;
                // console.log(`${left[0] + i}|${left[1] + i * goingDown}`);
                const shi = stuff[`${left[0] + i}|${left[1] + i * goingDown}`];
                stuff[`${left[0] + i}|${left[1] + i * goingDown}`] = shi ? shi + 1 : 1;
            }
        }
    }

    // console.log(stuff);

    return Object.values(stuff).filter(l => l >= 2).length;
};

const main = async () => {
    const input = await readInputSplit(path.join(__dirname, "./input.txt"));
    const stuff = input.map(l =>
        l.split(" -> ").map(j => j.split(",").map(Number))
    ) as [number, number][][];

    console.log(stuff);

    console.time("part1");

    console.log(part1(stuff));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(stuff));

    console.timeEnd("part2");
};

main();
