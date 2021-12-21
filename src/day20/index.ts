import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = {
    alg: string;
    grid: Record<string, boolean>;
};

const displayGrid = (input: Input) => {
    const minX = Math.min(
        ...Object.keys(input.grid).map(l => Number(l.split("|")[0]))
    );
    const minY = Math.min(
        ...Object.keys(input.grid).map(l => Number(l.split("|")[1]))
    );
    const maxX = Math.max(
        ...Object.keys(input.grid).map(l => Number(l.split("|")[0]))
    );
    const maxY = Math.max(
        ...Object.keys(input.grid).map(l => Number(l.split("|")[1]))
    );

    let res = "";
    for (let i = minX - 1; i < maxX + 2; i++) {
        for (let j = minY - 1; j < maxY + 2; j++) {
            res += input.grid[`${j}|${i}`] ? "#" : ".";
        }
        res += "\n";
    }
    return res;
};

const part1 = (input: Input) => {
    const maxX_ = Math.max(
        ...Object.keys(input.grid).map(l => Number(l.split("|")[0]))
    );
    const maxY_ = Math.max(
        ...Object.keys(input.grid).map(l => Number(l.split("|")[1]))
    );

    const getEnhanced = (x: number, y: number): "#" | "." => {
        const upLeft = input.grid[`${x - 1}|${y - 1}`] ? "#" : ".";
        const up = input.grid[`${x}|${y - 1}`] ? "#" : ".";
        const upRight = input.grid[`${x + 1}|${y - 1}`] ? "#" : ".";
        const left = input.grid[`${x - 1}|${y}`] ? "#" : ".";
        const center = input.grid[`${x}|${y}`] ? "#" : ".";
        const right = input.grid[`${x + 1}|${y}`] ? "#" : ".";
        const downLeft = input.grid[`${x - 1}|${y + 1}`] ? "#" : ".";
        const down = input.grid[`${x}|${y + 1}`] ? "#" : ".";
        const downRight = input.grid[`${x + 1}|${y + 1}`] ? "#" : ".";
        const str = [
            upLeft,
            up,
            upRight,
            left,
            center,
            right,
            downLeft,
            down,
            downRight
        ]
            .map(l => (l === "#" ? 1 : 0))
            .join("");
        const num = parseInt(str, 2);
        // console.log(str, num);
        return input.alg[num] as "#" | ".";
    };

    const enhance = () => {
        const newGrid: Input["grid"] = {};

        const minX = Math.min(
            ...Object.keys(input.grid).map(l => Number(l.split("|")[0]))
        );
        const minY = Math.min(
            ...Object.keys(input.grid).map(l => Number(l.split("|")[1]))
        );
        const maxX = Math.max(
            ...Object.keys(input.grid).map(l => Number(l.split("|")[0]))
        );
        const maxY = Math.max(
            ...Object.keys(input.grid).map(l => Number(l.split("|")[1]))
        );

        for (let i = minX - 3; i < maxX + 4; i++) {
            for (let j = minY - 3; j < maxY + 4; j++) {
                const enhanced = getEnhanced(i, j);
                newGrid[`${i}|${j}`] = enhanced === "#";
            }
        }

        return newGrid;
    };

    for (let i = 0; i < 50; i++) {
        input.grid = enhance();
    }

    return Object.entries(input.grid)
        .filter(l => {
            const split = l[0].split("|").map(Number) as [number, number];
            if (split[0] < -50 || split[1] < -50) {
                return false;
            }
            if (split[0] > maxX_ + 50 || split[1] > maxY_ + 50) {
                return false;
            }
            return true;
        })
        .filter(l => l[1] === true).length;
};

const part2 = (input: Input) => {
    const maxX_ = Math.max(
        ...Object.keys(input.grid).map(l => Number(l.split("|")[0]))
    );
    const maxY_ = Math.max(
        ...Object.keys(input.grid).map(l => Number(l.split("|")[1]))
    );

    const getGridAtCoords = (x: number, y: number, iter: number) => {
        if (x < -iter || y < -iter || x > iter + maxX_ || y > iter + maxY_) {
            return iter % 2 === 0 ? "." : "#";
        } else {
            return input.grid[`${x}|${y}`] ? "#" : ".";
        }
    };

    const getEnhanced = (x: number, y: number, iter: number): "#" | "." => {
        // console.log(x, y, iter);
        const upLeft = getGridAtCoords(x - 1, y - 1, iter);
        const up = getGridAtCoords(x, y - 1, iter);
        const upRight = getGridAtCoords(x + 1, y - 1, iter);
        const left = getGridAtCoords(x - 1, y, iter);
        const center = getGridAtCoords(x, y, iter);
        const right = getGridAtCoords(x + 1, y, iter);
        const downLeft = getGridAtCoords(x - 1, y + 1, iter);
        const down = getGridAtCoords(x, y + 1, iter);
        const downRight = getGridAtCoords(x + 1, y + 1, iter);
        const str = [
            upLeft,
            up,
            upRight,
            left,
            center,
            right,
            downLeft,
            down,
            downRight
        ]
            .map(l => (l === "#" ? 1 : 0))
            .join("");
        const num = parseInt(str, 2);
        // console.log(str, num);
        return input.alg[num] as "#" | ".";
    };

    const enhance = (iter: number) => {
        let newGrid: Input["grid"] = {};

        const minX = Math.min(
            ...Object.keys(input.grid).map(l => Number(l.split("|")[0]))
        );
        const minY = Math.min(
            ...Object.keys(input.grid).map(l => Number(l.split("|")[1]))
        );
        const maxX = Math.max(
            ...Object.keys(input.grid).map(l => Number(l.split("|")[0]))
        );
        const maxY = Math.max(
            ...Object.keys(input.grid).map(l => Number(l.split("|")[1]))
        );

        for (let i = minX - 3; i < maxX + 4; i++) {
            for (let j = minY - 3; j < maxY + 4; j++) {
                const enhanced = getEnhanced(i, j, iter);
                newGrid[`${i}|${j}`] = enhanced === "#";
            }
        }

        newGrid = Object.fromEntries(
            Object.entries(newGrid).filter(l => {
                const split = l[0].split("|").map(Number) as [number, number];
                if (split[0] < -iter - 1 || split[1] < -iter - 1) {
                    return false;
                }
                if (
                    split[0] > maxX_ + iter + 1 ||
                    split[1] > maxY_ + iter + 1
                ) {
                    return false;
                }
                return true;
            })
        );

        return newGrid;
    };

    for (let i = 0; i < 50; i++) {
        input.grid = enhance(i);
    }

    return Object.entries(input.grid)
        .filter(l => {
            const split = l[0].split("|").map(Number) as [number, number];
            if (split[0] < -50 || split[1] < -50) {
                return false;
            }
            if (split[0] > maxX_ + 50 || split[1] > maxY_ + 50) {
                return false;
            }
            return true;
        })
        .filter(l => l[1] === true).length;
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const inp: Partial<Input> = {};
    inp.alg = raw.shift();
    raw.shift();
    const grid = raw.map(l => l.split(""));

    const res: Record<string, boolean> = {};
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            res[`${j}|${i}`] = grid[i][j] === "#";
        }
    }
    const input: Input = { ...inp, grid: res } as Input;

    console.time("part1");

    // console.log(part1({ alg: input.alg, grid: { ...input.grid } }));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2({ alg: input.alg, grid: { ...input.grid } }));

    console.timeEnd("part2");
};

main();
