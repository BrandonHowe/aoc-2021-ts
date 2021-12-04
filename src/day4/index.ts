import * as path from "path";
import { readInputRaw } from "../helpers/readInput";

const part1 = (winners: number[], boards: number[][][]) => {
    const getBingoScore = (
        board: { val: number; complete: boolean }[][],
        recent: number
    ) => {
        const unmarked = board.reduce(
            (acc, cur) =>
                acc + cur.reduce((a, c) => (c.complete ? a : c.val + a), 0),
            0
        );
        return unmarked * recent;
    };

    const modifiedBoards = boards.map(l =>
        l.map(j => j.map(k => ({ val: k, complete: false })))
    );
    for (const ball of winners) {
        for (const board of modifiedBoards) {
            board.map(l =>
                l.map(j => {
                    if (j.val === ball) {
                        j.complete = true;
                    }
                })
            );
        }
        for (const board of modifiedBoards) {
            for (const row of board) {
                if (row.every(l => l.complete)) {
                    return getBingoScore(board, ball);
                }
            }
            for (let i = 0; i < board[0].length; i++) {
                let good = true;
                for (let j = 0; j < board.length; j++) {
                    if (board[j][i].complete !== true) {
                        good = false;
                        break;
                    }
                }
                if (good) {
                    return getBingoScore(board, ball);
                }
            }
        }
    }
};

const part2 = (winners: number[], boards: number[][][]) => {
    let bingoCount = 0;

    const getBingoScore = (
        board: { val: number; complete: boolean }[][],
        recent: number
    ) => {
        const unmarked = board.reduce(
            (acc, cur) =>
                acc + cur.reduce((a, c) => (c.complete ? a : c.val + a), 0),
            0
        );
        return unmarked * recent;
    };

    let modifiedBoards = boards.map(l =>
        l.map(j => j.map(k => ({ val: k, complete: false })))
    );
    for (const ball of winners) {
        for (const board of modifiedBoards) {
            board.map(l =>
                l.map(j => {
                    if (j.val === ball) {
                        j.complete = true;
                    }
                })
            );
        }
        for (let a = 0; a < modifiedBoards.length; a++) {
            const board = modifiedBoards[a];
            for (const row of board) {
                if (row.every(l => l.complete)) {
                    bingoCount++;
                    modifiedBoards = modifiedBoards.filter(
                        (_, idx) => idx !== a
                    );
                    if (bingoCount === boards.length) {
                        return getBingoScore(board, ball);
                    }
                    break;
                }
            }
            for (let i = 0; i < board[0].length; i++) {
                let good = true;
                for (let j = 0; j < board.length; j++) {
                    if (board[j][i].complete !== true) {
                        good = false;
                        break;
                    }
                }
                if (good) {
                    bingoCount++;
                    modifiedBoards = modifiedBoards.filter(
                        (_, idx) => idx !== a
                    );
                    if (bingoCount === boards.length) {
                        return getBingoScore(board, ball);
                    }
                    break;
                }
            }
        }
    }
};

const main = async () => {
    const input = (
        await readInputRaw(path.join(__dirname, "./input.txt"))
    ).trim();
    const blah = input.split("\n\n");
    const first = blah.shift()!.split(",").map(Number);
    const boards = blah.map(l =>
        l.split("\n").map(j =>
            j
                .split(" ")
                .filter(k => k !== "")
                .map(Number)
        )
    );

    console.time("part1");

    console.log(part1(first, boards));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(first, boards));

    console.timeEnd("part2");
};

main();
