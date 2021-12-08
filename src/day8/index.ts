import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

const part1 = (input: string[][][]) => {
    let amt = 0;
    for (const thing of input) {
        amt += thing[1].filter(
            l =>
                l.length === 2 ||
                l.length === 3 ||
                l.length === 4 ||
                l.length === 7
        ).length;
    }
    return amt;
};

const part2 = (input: string[][][]) => {
    const alpha = "abcdefg".split("");
    const resses = [];
    for (const thing of input) {
        const res = [];
        const identification: Record<string, number> = {};
        let rightTwo: number[] = [];
        let rightBottom = -1;
        let leftBottom = -1;
        for (const val of thing.flat()) {
            const num = val.split("").map(l => alpha.indexOf(l) + 1);
            if (num.length === 3) {
                const twoval = thing.flat().find(l => l.length === 2)!;
                const single = num.filter(
                    l =>
                        !twoval
                            .split("")
                            .map(l => alpha.indexOf(l) + 1)
                            .includes(l)
                );
                rightTwo = twoval.split("").map(l => alpha.indexOf(l) + 1);
                // console.log(single, num, twoval, rightTwo);
                identification[alpha[single[0]]] = 1;
            }
        }
        for (const val of thing.flat()) {
            const num = val.split("").map(l => alpha.indexOf(l) + 1);
            if (num.length === 6) {
                if (!rightTwo.every(l => num.includes(l))) {
                    rightBottom = num.find(l => rightTwo.includes(l))!;
                }
            }
        }
        for (const val of thing.flat()) {
            const num = val.split("").map(l => alpha.indexOf(l) + 1);
            if (num.length === 5) {
                if (rightTwo.every(l => num.includes(l))) {
                    // console.log("asdf", num);
                    for (const vvv of thing.flat()) {
                        const v2 = vvv.split("").map(l => alpha.indexOf(l) + 1);
                        if (
                            v2.length === 6 &&
                            v2.filter(l => num.includes(l)).length === 5
                        ) {
                            leftBottom = alpha
                                .map((_, idx) => idx + 1)
                                .filter(l => !v2.includes(l))[0];
                        }
                    }
                    break;
                }
            }
        }
        // console.log(thing, rightTwo, rightBottom, leftBottom);
        for (const val of thing[1]) {
            const num: number[] = val.split("").map(l => alpha.indexOf(l) + 1);
            if (num.length === 2) {
                res.push(1);
            } else if (num.length === 3) {
                res.push(7);
            } else if (num.length === 4) {
                res.push(4);
            } else if (num.length === 7) {
                res.push(8);
            } else if (num.length === 5) {
                if (rightTwo.every(l => num.includes(l))) {
                    res.push(3);
                } else if (num.includes(rightBottom)) {
                    res.push(5);
                } else {
                    res.push(2);
                }
            } else if (num.length === 6) {
                if (!rightTwo.every(l => num.includes(l))) {
                    res.push(6);
                } else if (num.includes(leftBottom)) {
                    res.push(0);
                } else {
                    res.push(9);
                }
            }
        }
        // console.log(res);
        resses.push(res);
    }
    return resses.reduce(
        (acc, cur) => acc + cur.reduce((a, c) => a * 10 + c, 0),
        0
    );
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = raw.map(l => l.split(" | ").map(j => j.split(" ")));

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
