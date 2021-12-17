/* eslint-disable no-constant-condition */
import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

type Input = {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};

const part1 = (input: Input) => {
    // const acceptableNums = [];
    // let cSuc = false;

    // for (let i = 0; i < Infinity; i++) {
    //     const dist = ((i + 1) * i) / 2;
    //     if (dist > input.maxX) {
    //         cSuc = false;
    //         break;
    //     } else if (dist <= input.maxX && dist >= input.minX) {
    //         cSuc = true;
    //         acceptableNums.push(i);
    //     }
    // }

    // console.log(acceptableNums);

    const checkSuccess = (yVelStart: number) => {
        let yPos = 0;
        let yVel = yVelStart;
        while (true) {
            yPos += yVel;
            yVel--;
            if (yPos >= input.minY && yPos <= input.maxY) {
                return true;
            } else if (yPos < input.minY) {
                return false;
            }
        }
    };

    let successing = false;
    let best = 0;
    for (let i = 0; i < 5000; i++) {
        const res = checkSuccess(i);
        if (res && !successing) {
            successing = true;
        } else if (!res && successing) {
            best = i - 1;
            successing = false;
        }
    }

    return ((best + 1) * best) / 2;
};

const part2 = (input: Input) => {
    const acceptableNums = [];
    let cSuc = false;

    for (let i = 0; i < Infinity; i++) {
        const dist = ((i + 1) * i) / 2;
        if (dist > input.maxX) {
            cSuc = false;
            break;
        } else if (dist <= input.maxX && dist >= input.minX) {
            cSuc = true;
            acceptableNums.push(i);
        }
    }

    console.log(acceptableNums);

    const checkSuccess = (yVelStart: number) => {
        let yPos = 0;
        let yVel = yVelStart;
        while (true) {
            yPos += yVel;
            yVel--;
            if (yPos >= input.minY && yPos <= input.maxY) {
                return true;
            } else if (yPos < input.minY) {
                return false;
            }
        }
    };

    const successes = [];

    let successing = false;
    let best = 0;
    for (let i = 0; i < 5000; i++) {
        const res = checkSuccess(i);
        if (res && !successing) {
            successing = true;
        } else if (!res && successing) {
            best = i - 1;
            successing = false;
        }
    }

    const doIter = (xVelR: number, yVelR: number) => {
        // console.log("iter");
        let xPos = 0;
        let xVel = xVelR;
        let yPos = 0;
        let yVel = yVelR;

        while (true) {
            xPos += xVel;
            if (xVel < 0) {
                xVel++;
            } else if (xVel > 0) {
                xVel--;
            }
            yPos += yVel--;
            // console.log(xPos, yPos);
            if (xPos > input.maxX || yPos < input.minY) {
                // console.log("failure");
                return false;
            }
            if (
                xPos >= input.minX &&
                yPos >= input.minY &&
                xPos <= input.maxX &&
                yPos <= input.maxY
            ) {
                // console.log("success");
                return true;
            }
        }
    };

    for (let i = 0; i <= input.maxX; i++) {
        for (let j = input.minY; j <= best; j++) {
            if (doIter(i, j)) {
                successes.push([i, j]);
            }
        }
    }

    return successes.length;
};

const main = async () => {
    const raw = await readInputRaw(path.join(__dirname, "./input.txt"));
    const i1 = raw.trim().split(" ");
    i1.shift();
    i1.shift();
    const i2 = i1.map(l => l.split("=")).map(l => l[1]);
    const i3 = i2.map(l =>
        l
            .split("")
            .filter(j => j !== ",")
            .join("")
    );
    const i4 = i3.map(l => l.split("..").map(Number));
    const input: Input = {
        minX: i4[0][0],
        maxX: i4[0][1],
        minY: i4[1][0],
        maxY: i4[1][1]
    };
    console.log(input);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
