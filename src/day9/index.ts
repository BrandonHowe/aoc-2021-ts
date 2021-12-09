import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const part1 = (input: number[][]) => {
    let totalRisk = 0;

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            const up = i > 0 && input[i - 1][j];
            const down = i < input.length - 1 && input[i + 1][j];
            const left = j > 0 && input[i][j - 1];
            const right = j < input[0].length - 1 && input[i][j + 1];
            const cur = input[i][j];
            if (up !== false && cur >= up) {
                continue;
            }
            if (down !== false && cur >= down) {
                continue;
            }
            if (left !== false && cur >= left) {
                continue;
            }
            if (right !== false && cur >= right) {
                continue;
            }
            // console.log(cur, up, down, left, right);
            totalRisk += cur + 1;
        }
    }

    return totalRisk;
};

const part2 = (input: number[][]) => {
    const lowPoints: [number, number][] = [];

    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[0].length; j++) {
            const up = i > 0 && input[i - 1][j];
            const down = i < input.length - 1 && input[i + 1][j];
            const left = j > 0 && input[i][j - 1];
            const right = j < input[0].length - 1 && input[i][j + 1];
            const cur = input[i][j];
            if (up !== false && cur >= up) {
                continue;
            }
            if (down !== false && cur >= down) {
                continue;
            }
            if (left !== false && cur >= left) {
                continue;
            }
            if (right !== false && cur >= right) {
                continue;
            }
            lowPoints.push([i, j]);
        }
    }

    const basinSizes = [];

    for (const lowPoint of lowPoints) {
        let curr: [number, number][] = [];
        let next = [lowPoint];
        let next2: [number, number][] = [];

        // console.log(curr, next, next2);

        while (next.length !== 0) {
            for (const point of next) {
                if (curr.find(l => l[0] === point[0] && l[1] === point[1])) {
                    continue;
                }
                // console.log(point);
                if (point[0] > 0) {
                    // console.log("up", input[point[0] - 1][point[1]]);
                    if (
                        input[point[0] - 1][point[1]] !== 9 &&
                        !curr.find(l => l[0] === point[0] && l[1] === point[1])
                    ) {
                        next2.push([point[0] - 1, point[1]]);
                    }
                }
                if (point[1] > 0) {
                    // console.log("right", input[point[0]][point[1] - 1]);
                    if (
                        input[point[0]][point[1] - 1] !== 9 &&
                        !curr.find(l => l[0] === point[0] && l[1] === point[1])
                    ) {
                        next2.push([point[0], point[1] - 1]);
                    }
                }
                if (point[0] < input.length - 1) {
                    // console.log("down", input[point[0] + 1][point[1]]);
                    if (
                        input[point[0] + 1][point[1]] !== 9 &&
                        !curr.find(l => l[0] === point[0] && l[1] === point[1])
                    ) {
                        next2.push([point[0] + 1, point[1]]);
                    }
                }
                if (point[1] < input[0].length - 1) {
                    // console.log("left", input[point[0]][point[1] + 1]);
                    if (
                        input[point[0]][point[1] + 1] !== 9 &&
                        !curr.find(l => l[0] === point[0] && l[1] === point[1])
                    ) {
                        next2.push([point[0], point[1] + 1]);
                    }
                }
            }
            // console.log("asdf", curr, next, next2);
            curr = [...curr, ...next];
            next = [...next2];
            next2 = [];
        }

        basinSizes.push(
            curr.filter(
                (l, idx) =>
                    curr.findIndex(j => j[0] === l[0] && j[1] === l[1]) === idx
            ).length
        );
    }

    basinSizes.sort((a, b) => b - a);

    console.log(basinSizes);

    return basinSizes[0] * basinSizes[1] * basinSizes[2];
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
