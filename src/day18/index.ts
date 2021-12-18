import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Thing = number | [number | Thing, number | Thing];

type Input = {
    parent?: Input;
    l: Input | number;
    r: Input | number;
    depth: number;
};

const parseInput = (
    input: Thing,
    depth: number = 0,
    parent?: Partial<Input>
) => {
    if (typeof input === "number") {
        return input;
    }
    const res: Partial<Input> = {};
    res.l = parseInput(input[0], depth + 1, res);
    res.r = parseInput(input[1], depth + 1, res);
    res.depth = depth;
    res.parent = parent as Input;
    return res as Input;
};

const displayInput = (input: Input | number): string => {
    if (typeof input === "number") {
        return `${input}`;
    }
    return `[${displayInput(input.l)},${displayInput(input.r)}]`;
};

const explodeFirst = (inp: Input) => {
    // console.log(displayInput(inp));
    if (
        inp.depth >= 4 &&
        typeof inp.l === "number" &&
        typeof inp.r === "number"
    ) {
        // console.log("exploding", displayInput(inp));
        let rSatis = false;
        let lSatis = false;
        let currNode = inp.parent;
        let lastNode = inp;

        while (currNode) {
            if (!rSatis && currNode.l === lastNode) {
                let rightSide = currNode.r;
                if (typeof rightSide === "number") {
                    currNode.r = rightSide + inp.r;
                } else {
                    let past = rightSide;
                    while (typeof rightSide.l !== "number") {
                        rightSide = rightSide.l;
                        past = rightSide;
                    }
                    rightSide = rightSide.l;
                    past.l = rightSide + inp.r;
                }
                rSatis = true;
            }

            if (!lSatis && currNode.r === lastNode) {
                let leftSide = currNode.l;
                if (typeof leftSide === "number") {
                    currNode.l = leftSide + inp.l;
                } else {
                    let past = leftSide;
                    while (typeof leftSide.r !== "number") {
                        leftSide = leftSide.r;
                        past = leftSide;
                    }
                    leftSide = leftSide.r;
                    past.r = leftSide + inp.l;
                }
                lSatis = true;
            }

            lastNode = currNode;
            currNode = currNode.parent;
        }

        if (inp.parent) {
            const leftSide = inp.parent?.l === inp;

            if (leftSide) {
                inp.parent.l = 0;
            } else {
                inp.parent.r = 0;
            }
        }

        return true;
    } else {
        if (typeof inp.l !== "number") {
            const res = explodeFirst(inp.l);
            if (res) return true;
        }
        if (typeof inp.r !== "number") {
            const res = explodeFirst(inp.r);
            if (res) return true;
        }
    }

    return false;
};

const splitOne = (inp: Input) => {
    if (typeof inp.l === "number" && inp.l >= 10) {
        inp.l = {
            l: Math.floor(inp.l / 2),
            r: Math.ceil(inp.l / 2),
            depth: inp.depth + 1,
            parent: inp
        };
        return true;
    }
    if (typeof inp.l !== "number") {
        const doAnythingL = splitOne(inp.l);
        if (doAnythingL) return true;
    }
    if (typeof inp.r === "number" && inp.r >= 10) {
        inp.r = {
            l: Math.floor(inp.r / 2),
            r: Math.ceil(inp.r / 2),
            depth: inp.depth + 1,
            parent: inp
        };
        return true;
    }
    if (typeof inp.r !== "number") {
        const doAnythingL = splitOne(inp.r);
        if (doAnythingL) return true;
    }
    return false;
};

const splittable = (inp: Input) => {
    if (typeof inp.l === "number" && inp.l >= 10) {
        return true;
    } else if (typeof inp.r === "number" && inp.r >= 10) {
        return true;
    }
    if (typeof inp.l !== "number") {
        const doAnythingL = splittable(inp.l);
        if (doAnythingL) return true;
    }
    if (typeof inp.r !== "number") {
        const doAnythingL = splittable(inp.r);
        if (doAnythingL) return true;
    }
    return false;
};

const add = (inp1: Input, inp2: Input) => {
    const add1ToDepth = (inp: Input) => {
        inp.depth++;
        if (typeof inp.l !== "number") add1ToDepth(inp.l);
        if (typeof inp.r !== "number") add1ToDepth(inp.r);
    };

    add1ToDepth(inp1);
    add1ToDepth(inp2);

    const res = {
        l: inp1,
        r: inp2,
        depth: 0
    };

    inp1.parent = res;
    inp2.parent = res;

    return res;
};

const getMagnitude = (inp: Input) => {
    let res = 0;
    if (typeof inp.l === "number") {
        res += 3 * inp.l;
    } else {
        res += 3 * getMagnitude(inp.l);
    }
    if (typeof inp.r === "number") {
        res += 2 * inp.r;
    } else {
        res += 2 * getMagnitude(inp.r);
    }
    return res;
};

const part1 = (input: Input[]) => {
    let added = input[0];

    for (let i = 1; i < input.length; i++) {
        added = add(added, input[i]);
        // console.log("next");
        // console.log(displayInput(added));
        const explodeAll = () => {
            let res = true;
            while (res) {
                res = explodeFirst(added);
                // console.log("exploding", displayInput(added));
            }
        };
        explodeAll();
        while (splittable(added)) {
            splitOne(added);
            // console.log("splitting", displayInput(added));
            explodeAll();
        }
        // console.log(displayInput(added));
    }

    return getMagnitude(added);
};

const part2 = (raw: [Thing, Thing][]) => {
    let highestMag = 0;

    for (let i = 0; i < raw.length; i++) {
        for (let j = 0; j < raw.length; j++) {
            const input = raw.map(l => parseInput(l)) as Input[];

            if (i === j) continue;
            const added = add(input[i], input[j]);
            const explodeAll = () => {
                let res = true;
                while (res) {
                    res = explodeFirst(added);
                }
            };
            explodeAll();
            while (splittable(added)) {
                splitOne(added);
                explodeAll();
            }
            if (getMagnitude(added) > highestMag) {
                highestMag = getMagnitude(added);
                // console.log(displayInput(input[i]), displayInput(input[j]));
                // console.log(i, j);
            }
        }
    }

    return highestMag;
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = raw.map(l => eval(l)) as [Thing, Thing][];

    console.time("part1");

    console.log(part1(input.map(l => parseInput(l)) as Input[]));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
