import * as path from "path";
import { displayGridFuncConfig } from "../helpers/displayGrid";
import { readInputSplit } from "../helpers/readInput";

type Input = number[][];

const part1 = (input: Input) => {
    const q: Set<string> = new Set();
    const dist: Record<string, number> = {};

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            q.add(`${i}|${j}`);
            dist[`${i}|${j}`] = Infinity;
        }
    }

    dist["0|0"] = 0;

    const queue: [[number, number], number][] = [[[0, 0], 0]];

    while (queue.length !== 0) {
        // console.log(queue);
        const [current, distance] = queue.shift()!;

        const neighbors: [number, number][] = [
            [current[0] + 1, current[1]],
            [current[0] - 1, current[1]],
            [current[0], current[1] + 1],
            [current[0], current[1] - 1]
        ];

        for (const neighbor of neighbors) {
            if (!q.has(neighbor.join("|"))) continue;
            if (
                neighbor[0] < 0 ||
                neighbor[1] < 0 ||
                neighbor[0] >= input.length ||
                neighbor[1] >= input.length
            ) {
                continue;
            }
            const totalDist = distance + input[neighbor[0]][neighbor[1]];
            if (totalDist < dist[neighbor.join("|")]) {
                dist[neighbor.join("|")] = totalDist;
                if (queue.length === 0) {
                    queue.push([neighbor, totalDist]);
                } else {
                    let added = false;
                    for (let i = 0; i < queue.length; i++) {
                        // console.log(queue[i][1], queue[i - 1]?.[1], totalDist);
                        if (queue[i][1] > totalDist) {
                            queue.splice(i, 0, [neighbor, totalDist]);
                            // console.log(queue);
                            added = true;
                            break;
                        }
                    }
                    if (!added) {
                        queue.push([neighbor, totalDist]);
                    }
                }
            }
        }
    }

    return dist[`${input.length - 1}|${input.length - 1}`];
};

const part2 = (input: Input) => {
    for (const row of input) {
        const oldRow = [...row];
        for (let i = 1; i < 5; i++) {
            const mapped = oldRow.map(l => (l + i > 9 ? l + i - 9 : l + i));
            row.push(...mapped);
        }
    }

    console.log(input.length, input[0].length);
    const newInput = [...input];
    for (let i = 1; i < 5; i++) {
        const mapped = input.map(l =>
            l.map(j => (j + i > 9 ? j + i - 9 : j + i))
        );
        newInput.push(...mapped);
    }

    // console.log(displayGridFuncConfig(newInput));
    console.log(newInput.length, newInput[0].length);

    return part1(newInput);
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = raw.map(l => l.split("").map(Number));

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
