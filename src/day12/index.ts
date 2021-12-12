import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = [string, string][];

const part1 = (input: Input) => {
    const connections: Record<string, string[]> = {};
    for (const thing of input) {
        if (connections[thing[0]]) {
            connections[thing[0]] = [...connections[thing[0]], thing[1]];
        } else {
            connections[thing[0]] = [thing[1]];
        }
        if (connections[thing[1]]) {
            connections[thing[1]] = [...connections[thing[1]], thing[0]];
        } else {
            connections[thing[1]] = [thing[0]];
        }
    }
    let currPaths: string[][] = [];
    let nextPaths: string[][] = [["start"]];
    while (nextPaths.length !== 0) {
        currPaths = [
            ...currPaths.filter(l => l[l.length - 1] === "end"),
            ...nextPaths
        ];
        nextPaths = [];
        for (const path of currPaths) {
            const recent = path[path.length - 1];
            if (recent === "end") continue;
            for (const choice of connections[recent]) {
                if (choice.toLowerCase() === choice && path.includes(choice)) {
                    continue;
                }
                nextPaths.push([...path, choice]);
            }
        }
    }

    return currPaths.length;
};

const part2 = (input: Input) => {
    const connections: Record<string, string[]> = {};
    for (const thing of input) {
        if (connections[thing[0]]) {
            connections[thing[0]] = [...connections[thing[0]], thing[1]];
        } else {
            connections[thing[0]] = [thing[1]];
        }
        if (connections[thing[1]]) {
            connections[thing[1]] = [...connections[thing[1]], thing[0]];
        } else {
            connections[thing[1]] = [thing[0]];
        }
    }
    let currPaths: string[][] = [];
    let nextPaths: string[][] = [["start"]];
    while (nextPaths.length !== 0) {
        currPaths = [
            ...currPaths.filter(l => l[l.length - 1] === "end"),
            ...nextPaths
        ];
        nextPaths = [];
        for (const path of currPaths) {
            const recent = path[path.length - 1];
            if (recent === "end") continue;
            for (const choice of connections[recent]) {
                if (choice === "start") continue;
                if (choice.toLowerCase() === choice && path.includes(choice)) {
                    if (
                        new Set(path.filter(l => l.toLowerCase() === l))
                            .size !==
                        path.filter(l => l.toLowerCase() === l).length
                    ) {
                        continue;
                    }
                }
                nextPaths.push([...path, choice]);
            }
        }
    }

    return currPaths.length;
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = raw.map(l => l.split("-")) as [string, string][];

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
