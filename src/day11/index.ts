import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = number[][];

const part1 = (input: Input) => {
    let flashes = 0;

    const doMove = () => {
        for (const row of input) {
            for (let i = 0; i < row.length; i++) {
                row[i]++;
            }
        }
        const flashed = [];
        while (input.flat().some(l => l > 9)) {
            for (let i = 0; i < input.length; i++) {
                for (let j = 0; j < input[i].length; j++) {
                    const adjacents = [];
                    if (input[i][j] > 9) {
                        if (i - 1 >= 0) adjacents.push([i - 1, j]);
                        if (i + 1 < input.length) adjacents.push([i + 1, j]);
                        if (j - 1 >= 0) adjacents.push([i, j - 1]);
                        if (j + 1 < input[i].length) adjacents.push([i, j + 1]);
                        if (i - 1 >= 0 && j - 1 >= 0)
                            adjacents.push([i - 1, j - 1]);
                        if (i + 1 < input.length && j - 1 >= 0)
                            adjacents.push([i + 1, j - 1]);
                        if (i + 1 < input.length && j + 1 < input[i].length)
                            adjacents.push([i + 1, j + 1]);
                        if (i - 1 >= 0 && j + 1 < input[i].length)
                            adjacents.push([i - 1, j + 1]);
                        input[i][j] = 0;
                        flashes++;
                        flashed.push([i, j]);
                    }

                    for (const adjacent of adjacents) {
                        if (
                            flashed.some(
                                l =>
                                    l[0] === adjacent[0] && l[1] === adjacent[1]
                            )
                        )
                            continue;
                        input[adjacent[0]][adjacent[1]]++;
                    }
                }
            }

            for (const flash of flashed) {
                input[flash[0]][flash[1]] = 0;
            }
        }
    };

    for (let i = 0; i < 100; i++) {
        doMove();
        // console.log(flashes);
        // console.log(displayGridObjConfig(input));
    }

    return flashes;
};

const part2 = (input: Input) => {
    let idx = 0;

    const doMove = () => {
        for (const row of input) {
            for (let i = 0; i < row.length; i++) {
                row[i]++;
            }
        }
        const flashed = [];
        while (input.flat().some(l => l > 9)) {
            for (let i = 0; i < input.length; i++) {
                for (let j = 0; j < input[i].length; j++) {
                    const adjacents = [];
                    if (input[i][j] > 9) {
                        if (i - 1 >= 0) adjacents.push([i - 1, j]);
                        if (i + 1 < input.length) adjacents.push([i + 1, j]);
                        if (j - 1 >= 0) adjacents.push([i, j - 1]);
                        if (j + 1 < input[i].length) adjacents.push([i, j + 1]);
                        if (i - 1 >= 0 && j - 1 >= 0)
                            adjacents.push([i - 1, j - 1]);
                        if (i + 1 < input.length && j - 1 >= 0)
                            adjacents.push([i + 1, j - 1]);
                        if (i + 1 < input.length && j + 1 < input[i].length)
                            adjacents.push([i + 1, j + 1]);
                        if (i - 1 >= 0 && j + 1 < input[i].length)
                            adjacents.push([i - 1, j + 1]);
                        input[i][j] = 0;
                        flashed.push([i, j]);
                    }

                    for (const adjacent of adjacents) {
                        if (
                            flashed.some(
                                l =>
                                    l[0] === adjacent[0] && l[1] === adjacent[1]
                            )
                        )
                            continue;
                        input[adjacent[0]][adjacent[1]]++;
                    }
                }
            }

            for (const flash of flashed) {
                input[flash[0]][flash[1]] = 0;
            }
        }

        if (input.flat().every(l => l === 0)) {
            return idx;
        }
    };

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const res = doMove();
        if (res) return res + 1;
        idx++;
    }
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = raw.map(l => l.split("").map(Number));

    console.time("part1");

    console.log(part1([...input.map(l => [...l])]));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
