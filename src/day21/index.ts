import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = [number, number];

const part1 = (input: Input) => {
    const board = [...input];
    const scores = [0, 0];
    let diceVal = 1;
    let diceCount = 0;

    const addDiceVal = () => {
        const v = diceVal;
        diceVal++;
        if (diceVal > 100) {
            diceVal %= 100;
        }
        return v;
    };

    while (scores.every(l => l < 1000)) {
        const diceRolls = [addDiceVal(), addDiceVal(), addDiceVal()];
        board[0] += diceRolls.reduce((acc, cur) => acc + cur, 0);
        while (board[0] > 10) {
            board[0] -= 10;
        }
        scores[0] += board[0];
        if (scores[0] >= 1000) {
            diceCount += 3;
            break;
        }
        const diceRolls2 = [addDiceVal(), addDiceVal(), addDiceVal()];
        board[1] += diceRolls2.reduce((acc, cur) => acc + cur, 0);
        while (board[1] > 10) {
            board[1] -= 10;
        }
        scores[1] += board[1];
        diceCount += 6;
        // console.log(diceCount, diceRolls, diceRolls2, board, scores);
    }

    console.log(scores);

    return scores.find(l => l < 1000)! * diceCount;
};
const part2 = (input: Input) => {
    let states: Record<string, number> = {};

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 21; j++) {
            states[`${i}|${j}`] = 0;
        }
    }

    states[`${input[0]}|0`] = 1;

    const dubs: number[] = [];
    const sizes: number[] = [];
    for (let _ = 0; _ < 15; _++) {
        const stuff = Object.entries(states);
        const newStates: Record<string, number> = {};
        for (const [key, amt] of stuff) {
            if (amt === 0) continue;
            const [pos, score] = key.split("|").map(Number);
            const possiblities: number[][] = [];
            for (let i = 1; i <= 3; i++) {
                for (let j = 1; j <= 3; j++) {
                    for (let k = 1; k <= 3; k++) {
                        possiblities.push([i, j, k]);
                    }
                }
            }
            for (const possibility of possiblities) {
                let newPos =
                    pos + possibility.reduce((acc, cur) => acc + cur, 0);
                while (newPos > 10) {
                    newPos -= 10;
                }
                if (`${newPos}|${score + newPos}` in newStates) {
                    newStates[`${newPos}|${score + newPos}`] += amt;
                } else {
                    newStates[`${newPos}|${score + newPos}`] = amt;
                }
            }
        }
        states = newStates;
        // console.log(states);
        dubs.push(
            Object.entries(newStates)
                .filter(l => l[1] > 0 && Number(l[0].split("|")[1]) >= 21)
                .reduce((acc, cur) => acc + cur[1], 0)
        );
        states = Object.fromEntries(
            Object.entries(states).filter(l => Number(l[0].split("|")[1]) < 21)
        );
        sizes.push(Object.values(states).reduce((acc, cur) => acc + cur, 0));
    }

    let states2: Record<string, number> = {};

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 21; j++) {
            states2[`${i}|${j}`] = 0;
        }
    }

    states2[`${input[1]}|0`] = 1;

    const dubs2: number[] = [];
    const sizes2: number[] = [];
    for (let _ = 0; _ < 15; _++) {
        const stuff = Object.entries(states2);
        const newStates2: Record<string, number> = {};
        for (const [key, amt] of stuff) {
            if (amt === 0) continue;
            const [pos, score] = key.split("|").map(Number);
            const possiblities: number[][] = [];
            for (let i = 1; i <= 3; i++) {
                for (let j = 1; j <= 3; j++) {
                    for (let k = 1; k <= 3; k++) {
                        possiblities.push([i, j, k]);
                    }
                }
            }
            for (const possibility of possiblities) {
                let newPos =
                    pos + possibility.reduce((acc, cur) => acc + cur, 0);
                while (newPos > 10) {
                    newPos -= 10;
                }
                if (`${newPos}|${score + newPos}` in newStates2) {
                    newStates2[`${newPos}|${score + newPos}`] += amt;
                } else {
                    newStates2[`${newPos}|${score + newPos}`] = amt;
                }
            }
        }
        states2 = newStates2;
        // console.log(states);
        dubs2.push(
            Object.entries(newStates2)
                .filter(l => l[1] > 0 && Number(l[0].split("|")[1]) >= 21)
                .reduce((acc, cur) => acc + cur[1], 0)
        );
        states2 = Object.fromEntries(
            Object.entries(states2).filter(l => Number(l[0].split("|")[1]) < 21)
        );
        sizes2.push(Object.values(states2).reduce((acc, cur) => acc + cur, 0));
    }

    const wins1 = [];
    const wins2 = [];

    for (let i = 1; i < dubs.length; i++) {
        wins1.push(dubs[i] * sizes2[i - 1]);
        wins2.push(dubs2[i] * sizes[i]);
    }

    const w1 = wins1.reduce((acc, cur) => acc + cur, 0);
    const w2 = wins2.reduce((acc, cur) => acc + cur, 0);

    return w1 > w2 ? w1 : w2;
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = raw.map(l => Number(l.split(": ")[1])) as Input;

    console.log(input);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
