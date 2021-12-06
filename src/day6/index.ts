import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

const part1 = (input: number[]) => {
    let newList = [...input];

    const changeArr = (arr: number[]) => {
        const resArr = [];
        const additions = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
                arr[i] = 7;
                additions.push(8);
            }
            arr[i]--;
            resArr.push(arr[i]);
        }
        return [...resArr, ...additions];
    };

    for (let i = 0; i < 80; i++) {
        // console.log(changeArr([...newList]));
        newList = changeArr([...newList]);
    }

    return newList.length;
};

const part2 = (input: number[]) => {
    const things: number[] = Array(9).fill(0);

    for (const thing of input) {
        things[thing]++;
    }

    const changeArr = (arr: number[]) => {
        const hatchCount = arr[0];
        arr.shift();
        arr[6] += hatchCount;
        arr.push(hatchCount);
    };

    for (let i = 0; i < 256; i++) {
        // console.log(i, things, things.reduce((acc, cur) => acc + cur, 0));
        changeArr(things);
    }

    return things.reduce((acc, cur) => acc + cur, 0);
};

const main = async () => {
    const input = (await readInputRaw(path.join(__dirname, "./input.txt")))
        .split(",")
        .map(Number);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
