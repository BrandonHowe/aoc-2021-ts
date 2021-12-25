import * as path from "path";
import { displayGridFuncConfig } from "../helpers/displayGrid";
import { readInputSplit } from "../helpers/readInput";

type Input = string[][];

const part1 = (input: Input) => {
    let currState = input;

    const grids: string[] = [];

    const doStep = (inp: Input) => {
        const newArr: string[][] = [];

        for (const row of inp) {
            newArr.push([]);
            for (let i = 0; i < row.length; i++) {
                if (row[i] === ">") {
                    if (row[(i + 1) % row.length] === ".") {
                        newArr[newArr.length - 1].push(".");
                        if (i + 1 === row.length) {
                            newArr[newArr.length - 1][0] = ">";
                        } else {
                            newArr[newArr.length - 1].push(">");
                            i++;
                        }
                    } else {
                        newArr[newArr.length - 1].push(row[i]);
                    }
                } else {
                    newArr[newArr.length - 1].push(row[i]);
                }
            }
        }

        const newArr2: string[][] = [...newArr.map(l => [...l])];

        for (let j = 0; j < newArr[0].length; j++) {
            for (let i = 0; i < newArr.length; i++) {
                if (newArr[i][j] === "v") {
                    if (newArr[(i + 1) % newArr.length][j] === ".") {
                        newArr2[i][j] = ".";
                        if (i + 1 === newArr.length) {
                            newArr2[0][j] = "v";
                        } else {
                            newArr2[i + 1][j] = "v";
                            i++;
                        }
                    }
                }
            }
        }

        return newArr2;
    };

    currState = doStep(currState);
    grids.push(displayGridFuncConfig(currState));
    currState = doStep(currState);
    grids.push(displayGridFuncConfig(currState));

    while (grids[grids.length - 2] !== grids[grids.length - 1]) {
        currState = doStep(currState);
        grids.push(displayGridFuncConfig(currState));
    }

    return grids.length;
};

const part2 = (input: Input) => {
    return "Merry Christmas!";
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
