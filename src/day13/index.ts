import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = {
    points: number[][];
    folds: {
        overY: boolean;
        num: number;
    }[];
};

const displayPoints = (points: number[][]) => {
    const width =
        Math.max(...points.map(l => l[0])) -
        Math.min(...points.map(l => l[0])) +
        1;
    const minW = Math.min(...points.map(l => l[0]));
    const height =
        Math.max(...points.map(l => l[1])) -
        Math.min(...points.map(l => l[1])) +
        1;
    const minH = Math.min(...points.map(l => l[0]));

    let res = "";

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (points.some(l => l[0] === minW + j && l[1] === minH + i)) {
                res += "#";
            } else {
                res += ".";
            }
        }
        res += "\n";
    }

    return res;
};

const part1 = (input: Input) => {
    let points = [...input.points.map(l => [...l])];

    const doFold = (fold: Input["folds"][0]) => {
        if (fold.overY) {
            const folded = points.filter(l => l[1] > fold.num);
            points = points.filter(l => l[1] < fold.num);
            for (const point of folded) {
                points.push([point[0], point[1] - (point[1] - fold.num) * 2]);
            }
        } else if (!fold.overY) {
            const folded = points.filter(l => l[0] > fold.num);
            points = points.filter(l => l[0] < fold.num);
            for (const point of folded) {
                points.push([point[0] - (point[0] - fold.num) * 2, point[1]]);
            }
        }
        points = points.filter(
            (l, idx) =>
                points.findIndex(j => j[0] === l[0] && j[1] === l[1]) === idx
        );
    };

    // for (const fold of input.folds) {
    //     doFold(fold);
    //     console.log(displayPoints(points));
    // }

    doFold(input.folds[0]);

    return points.length;
};

const part2 = (input: Input) => {
    let points = [...input.points.map(l => [...l])];

    const doFold = (fold: Input["folds"][0]) => {
        if (fold.overY) {
            const folded = points.filter(l => l[1] > fold.num);
            points = points.filter(l => l[1] < fold.num);
            for (const point of folded) {
                points.push([point[0], point[1] - (point[1] - fold.num) * 2]);
            }
        } else if (!fold.overY) {
            const folded = points.filter(l => l[0] > fold.num);
            points = points.filter(l => l[0] < fold.num);
            for (const point of folded) {
                points.push([point[0] - (point[0] - fold.num) * 2, point[1]]);
            }
        }
        points = points.filter(
            (l, idx) =>
                points.findIndex(j => j[0] === l[0] && j[1] === l[1]) === idx
        );
    };

    for (const fold of input.folds) {
        doFold(fold);
        // console.log(displayPoints(points));
    }

    // doFold(input.folds[0]);

    return displayPoints(points);
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input: Input = {
        points: [],
        folds: []
    };
    for (const thing of raw) {
        if (thing.includes("fold")) {
            input.folds.push({
                overY: thing.includes("y"),
                num: Number(thing.split("=")[1])
            });
        } else if (thing !== "") {
            input.points.push(thing.split(",").map(Number));
        }
    }

    console.log(input);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
