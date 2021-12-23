import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = [string, string][];
type Input2 = [string, string, string, string][];

type RoomString = "roomA" | "roomB" | "roomC" | "roomD";

type Grid = {
    hallway: (string | null)[];
    roomA: [string | null, string | null];
    roomB: [string | null, string | null];
    roomC: [string | null, string | null];
    roomD: [string | null, string | null];
};

type Grid2 = {
    hallway: (string | null)[];
    roomA: [string | null, string | null, string | null, string | null];
    roomB: [string | null, string | null, string | null, string | null];
    roomC: [string | null, string | null, string | null, string | null];
    roomD: [string | null, string | null, string | null, string | null];
};

const displayGrid = (grid: Grid) => {
    let str = "";
    str += "#############\n";
    str += "#" + grid.hallway.map(l => l ?? ".").join("") + "#\n";
    str +=
        "###" +
        (grid.roomA[0] ?? ".") +
        "#" +
        (grid.roomB[0] ?? ".") +
        "#" +
        (grid.roomC[0] ?? ".") +
        "#" +
        (grid.roomD[0] ?? ".") +
        "###\n";
    str +=
        "  #" +
        (grid.roomA[1] ?? ".") +
        "#" +
        (grid.roomB[1] ?? ".") +
        "#" +
        (grid.roomC[1] ?? ".") +
        "#" +
        (grid.roomD[1] ?? ".") +
        "#  \n";
    str += "  #########";
    return str;
};

const displayGrid2 = (grid: Grid2) => {
    let str = "";
    str += "#############\n";
    str += "#" + grid.hallway.map(l => l ?? ".").join("") + "#\n";
    str +=
        "###" +
        (grid.roomA[0] ?? ".") +
        "#" +
        (grid.roomB[0] ?? ".") +
        "#" +
        (grid.roomC[0] ?? ".") +
        "#" +
        (grid.roomD[0] ?? ".") +
        "###\n";
    str +=
        "  #" +
        (grid.roomA[1] ?? ".") +
        "#" +
        (grid.roomB[1] ?? ".") +
        "#" +
        (grid.roomC[1] ?? ".") +
        "#" +
        (grid.roomD[1] ?? ".") +
        "#  \n";
    str +=
        "  #" +
        (grid.roomA[2] ?? ".") +
        "#" +
        (grid.roomB[2] ?? ".") +
        "#" +
        (grid.roomC[2] ?? ".") +
        "#" +
        (grid.roomD[2] ?? ".") +
        "#  \n";
    str +=
        "  #" +
        (grid.roomA[3] ?? ".") +
        "#" +
        (grid.roomB[3] ?? ".") +
        "#" +
        (grid.roomC[3] ?? ".") +
        "#" +
        (grid.roomD[3] ?? ".") +
        "#  \n";
    str += "  #########";
    return str;
};

const part1 = (input: Input) => {
    const grid: Grid = {
        hallway: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ],
        roomA: input[0],
        roomB: input[1],
        roomC: input[2],
        roomD: input[3]
    };

    const isSuccessful = (grid: Grid) => {
        if (grid.roomA[0] !== "A" || grid.roomA[1] !== "A") return false;
        if (grid.roomB[0] !== "B" || grid.roomB[1] !== "B") return false;
        if (grid.roomC[0] !== "C" || grid.roomC[1] !== "C") return false;
        if (grid.roomD[0] !== "D" || grid.roomD[1] !== "D") return false;
        return true;
    };

    const removeDuplicates = (grids: { state: Grid; cost: number }[]) => {
        const dups: Record<string, { state: Grid; cost: number }[]> = {};
        for (let i = 0; i < grids.length; i++) {
            const stringified = displayGrid(grids[i].state);
            if (stringified in dups) {
                dups[stringified].push(grids[i]);
            } else {
                dups[stringified] = [grids[i]];
            }
        }
        const res = Object.values(dups).map(l =>
            l.reduce((acc, cur) => (cur.cost < acc.cost ? cur : acc))
        );
        return res;
    };

    const moveIntoHallway = (
        grid: Grid,
        room: number,
        hallway: number
    ): number | null => {
        if ([2, 4, 6, 8].includes(hallway)) return null;
        const u1 = Math.min(hallway, [2, 4, 6, 8][room]);
        const u2 = Math.max(hallway, [2, 4, 6, 8][room]);
        if (grid.hallway.slice(u1, u2 + 1).some(l => l !== null)) return null;
        const gridRoom =
            grid[`room${["A", "B", "C", "D"][room]}` as RoomString];
        if (
            gridRoom[0] === ["A", "B", "C", "D"][room] &&
            gridRoom[1] === ["A", "B", "C", "D"][room]
        ) {
            return null;
        }
        if (gridRoom[0] === null && gridRoom[1] === ["A", "B", "C", "D"][room])
            return null;
        if (gridRoom.filter(l => l !== null).length) {
            if (gridRoom[0] !== null) {
                grid.hallway[hallway] = gridRoom[0];
                gridRoom[0] = null;
                return u2 - u1 + 1;
            } else if (gridRoom[1] !== null) {
                grid.hallway[hallway] = gridRoom[1];
                gridRoom[1] = null;
                return u2 - u1 + 2;
            }
        } else {
            return null;
        }
        return null;
    };

    const moveHallwayIntoRoom = (
        grid: Grid,
        room: number,
        hallway: number
    ): number | null => {
        const gridRoom =
            grid[`room${["A", "B", "C", "D"][room]}` as RoomString];
        if (["A", "B", "C", "D"][room] !== grid.hallway[hallway]) return null;
        if (gridRoom.some(l => l !== null && l !== ["A", "B", "C", "D"][room]))
            return null;
        const u1 = Math.min(hallway, [2, 4, 6, 8][room]);
        const u2 = Math.max(hallway, [2, 4, 6, 8][room]);
        // console.log(grid.hallway, grid.hallway.slice(u1 + 1, u2 + 1), hallway, [2, 4, 6, 8][room]);
        if (
            grid.hallway
                .slice(
                    u1 + Number([2, 4, 6, 8][room] > hallway),
                    u2 + Number([2, 4, 6, 8][room] > hallway)
                )
                .some(l => l !== null)
        )
            return null;
        if (gridRoom[1] === null) {
            gridRoom[1] = grid.hallway[hallway];
            grid.hallway[hallway] = null;
            return u2 - u1 + 2;
        } else if (gridRoom[0] === null) {
            gridRoom[0] = grid.hallway[hallway];
            grid.hallway[hallway] = null;
            return u2 - u1 + 1;
        }
        return null;
    };

    const bfsData: { state: Grid; cost: number }[][] = [];
    let nextBfs: { state: Grid; cost: number }[] = [{ state: grid, cost: 0 }];

    let minCost = Number.MAX_VALUE;

    while (nextBfs.length) {
        const arr: { state: Grid; cost: number }[] = [];
        for (const { state, cost } of nextBfs) {
            for (let i = 0; i < 4; i++) {
                if (
                    state[`room${["A", "B", "C", "D"][i]}` as RoomString].every(
                        l => l === ["A", "B", "C", "D"][i]
                    )
                ) {
                    continue;
                }
                for (let j = 0; j < 11; j++) {
                    {
                        const newState = {
                            roomA: [...state.roomA] as [
                                string | null,
                                string | null
                            ],
                            roomB: [...state.roomB] as [
                                string | null,
                                string | null
                            ],
                            roomC: [...state.roomC] as [
                                string | null,
                                string | null
                            ],
                            roomD: [...state.roomD] as [
                                string | null,
                                string | null
                            ],
                            hallway: [...state.hallway]
                        };
                        const res = moveIntoHallway(newState, i, j);
                        const letter = newState.hallway[j];
                        if (res) {
                            arr.push({
                                state: newState,
                                cost:
                                    res *
                                        Math.pow(
                                            10,
                                            ["A", "B", "C", "D"].indexOf(
                                                letter!
                                            )
                                        ) +
                                    cost
                            });
                        }
                    }
                    if (state.hallway[j] !== null) {
                        if (state.hallway[j] !== ["A", "B", "C", "D"][i])
                            continue;
                        const newState = {
                            roomA: [...state.roomA] as [
                                string | null,
                                string | null
                            ],
                            roomB: [...state.roomB] as [
                                string | null,
                                string | null
                            ],
                            roomC: [...state.roomC] as [
                                string | null,
                                string | null
                            ],
                            roomD: [...state.roomD] as [
                                string | null,
                                string | null
                            ],
                            hallway: [...state.hallway]
                        };
                        const letter = state.hallway[j]!;
                        const res = moveHallwayIntoRoom(newState, i, j);
                        if (res) {
                            arr.push({
                                state: newState,
                                cost:
                                    res *
                                        Math.pow(
                                            10,
                                            ["A", "B", "C", "D"].indexOf(letter)
                                        ) +
                                    cost
                            });
                        }
                    }
                }
            }
        }
        bfsData.push(nextBfs);
        if (arr.some(l => isSuccessful(l.state))) {
            const leDub = removeDuplicates(
                arr.filter(l => isSuccessful(l.state))
            )[0];
            if (leDub.cost < minCost) {
                minCost = leDub.cost;
            }
        }
        nextBfs = removeDuplicates(arr);
    }

    return minCost;
};

const part2 = (input: Input2) => {
    const grid: Grid2 = {
        hallway: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ],
        roomA: input[0],
        roomB: input[1],
        roomC: input[2],
        roomD: input[3]
    };

    const isSuccessful = (grid: Grid2) => {
        if (
            grid.roomA[0] !== "A" ||
            grid.roomA[1] !== "A" ||
            grid.roomA[2] !== "A" ||
            grid.roomA[3] !== "A"
        )
            return false;
        if (
            grid.roomB[0] !== "B" ||
            grid.roomB[1] !== "B" ||
            grid.roomB[2] !== "B" ||
            grid.roomB[3] !== "B"
        )
            return false;
        if (
            grid.roomC[0] !== "C" ||
            grid.roomC[1] !== "C" ||
            grid.roomC[2] !== "C" ||
            grid.roomC[3] !== "C"
        )
            return false;
        if (
            grid.roomD[0] !== "D" ||
            grid.roomD[1] !== "D" ||
            grid.roomD[2] !== "D" ||
            grid.roomD[3] !== "D"
        )
            return false;
        return true;
    };

    const removeDuplicates = (grids: { state: Grid2; cost: number }[]) => {
        const dups: Record<string, { state: Grid2; cost: number }[]> = {};
        for (let i = 0; i < grids.length; i++) {
            const stringified = displayGrid2(grids[i].state);
            if (stringified in dups) {
                dups[stringified].push(grids[i]);
            } else {
                dups[stringified] = [grids[i]];
            }
        }
        const res = Object.values(dups).map(l =>
            l.reduce((acc, cur) => (cur.cost < acc.cost ? cur : acc))
        );
        return res;
    };

    const moveIntoHallway = (
        grid: Grid2,
        room: number,
        hallway: number
    ): number | null => {
        if ([2, 4, 6, 8].includes(hallway)) return null;
        const u1 = Math.min(hallway, [2, 4, 6, 8][room]);
        const u2 = Math.max(hallway, [2, 4, 6, 8][room]);
        if (grid.hallway.slice(u1, u2 + 1).some(l => l !== null)) return null;
        const gridRoom =
            grid[`room${["A", "B", "C", "D"][room]}` as RoomString];
        if (gridRoom[3] === ["A", "B", "C", "D"][room]) {
            if (gridRoom[2] === ["A", "B", "C", "D"][room]) {
                if (gridRoom[1] === ["A", "B", "C", "D"][room]) {
                    if (gridRoom[0] === ["A", "B", "C", "D"][room]) {
                        return null;
                    } else if (gridRoom[0] === null) {
                        return null;
                    }
                } else if (gridRoom[1] === null) {
                    return null;
                }
            } else if (gridRoom[2] === null) {
                return null;
            }
        } else if (gridRoom[3] === null) {
            return null;
        }
        if (gridRoom.filter(l => l !== null).length) {
            if (gridRoom[0] !== null) {
                grid.hallway[hallway] = gridRoom[0];
                gridRoom[0] = null;
                return u2 - u1 + 1;
            } else if (gridRoom[1] !== null) {
                grid.hallway[hallway] = gridRoom[1];
                gridRoom[1] = null;
                return u2 - u1 + 2;
            } else if (gridRoom[2] !== null) {
                grid.hallway[hallway] = gridRoom[2];
                gridRoom[2] = null;
                return u2 - u1 + 3;
            } else if (gridRoom[3] !== null) {
                grid.hallway[hallway] = gridRoom[3];
                gridRoom[3] = null;
                return u2 - u1 + 4;
            }
        } else {
            return null;
        }
        return null;
    };

    const moveHallwayIntoRoom = (
        grid: Grid2,
        room: number,
        hallway: number
    ): number | null => {
        const gridRoom =
            grid[`room${["A", "B", "C", "D"][room]}` as RoomString];
        if (["A", "B", "C", "D"][room] !== grid.hallway[hallway]) return null;
        if (gridRoom.some(l => l !== null && l !== ["A", "B", "C", "D"][room]))
            return null;
        const u1 = Math.min(hallway, [2, 4, 6, 8][room]);
        const u2 = Math.max(hallway, [2, 4, 6, 8][room]);
        // console.log(grid.hallway, grid.hallway.slice(u1 + 1, u2 + 1), hallway, [2, 4, 6, 8][room]);
        if (
            grid.hallway
                .slice(
                    u1 + Number([2, 4, 6, 8][room] > hallway),
                    u2 + Number([2, 4, 6, 8][room] > hallway)
                )
                .some(l => l !== null)
        )
            return null;
        if (gridRoom[3] === null) {
            gridRoom[3] = grid.hallway[hallway];
            grid.hallway[hallway] = null;
            return u2 - u1 + 4;
        } else if (gridRoom[2] === null) {
            gridRoom[2] = grid.hallway[hallway];
            grid.hallway[hallway] = null;
            return u2 - u1 + 3;
        } else if (gridRoom[1] === null) {
            gridRoom[1] = grid.hallway[hallway];
            grid.hallway[hallway] = null;
            return u2 - u1 + 2;
        } else if (gridRoom[0] === null) {
            gridRoom[0] = grid.hallway[hallway];
            grid.hallway[hallway] = null;
            return u2 - u1 + 1;
        }
        return null;
    };

    const bfsData: { state: Grid2; cost: number }[][] = [];
    let nextBfs: { state: Grid2; cost: number }[] = [{ state: grid, cost: 0 }];

    let minCost = Number.MAX_VALUE;

    while (nextBfs.length) {
        const arr: { state: Grid2; cost: number }[] = [];
        for (const { state, cost } of nextBfs) {
            for (let i = 0; i < 4; i++) {
                if (
                    state[`room${["A", "B", "C", "D"][i]}` as RoomString].every(
                        l => l === ["A", "B", "C", "D"][i]
                    )
                ) {
                    continue;
                }
                for (let j = 0; j < 11; j++) {
                    {
                        const newState = {
                            roomA: [...state.roomA] as Grid2["roomA"],
                            roomB: [...state.roomB] as Grid2["roomB"],
                            roomC: [...state.roomC] as Grid2["roomC"],
                            roomD: [...state.roomD] as Grid2["roomD"],
                            hallway: [...state.hallway]
                        };
                        const res = moveIntoHallway(newState, i, j);
                        const letter = newState.hallway[j];
                        if (res) {
                            arr.push({
                                state: newState,
                                cost:
                                    res *
                                        Math.pow(
                                            10,
                                            ["A", "B", "C", "D"].indexOf(
                                                letter!
                                            )
                                        ) +
                                    cost
                            });
                        }
                    }
                    if (state.hallway[j] !== null) {
                        if (state.hallway[j] !== ["A", "B", "C", "D"][i])
                            continue;
                        const newState = {
                            roomA: [...state.roomA] as Grid2["roomA"],
                            roomB: [...state.roomB] as Grid2["roomB"],
                            roomC: [...state.roomC] as Grid2["roomC"],
                            roomD: [...state.roomD] as Grid2["roomD"],
                            hallway: [...state.hallway]
                        };
                        const letter = state.hallway[j]!;
                        const res = moveHallwayIntoRoom(newState, i, j);
                        if (res) {
                            arr.push({
                                state: newState,
                                cost:
                                    res *
                                        Math.pow(
                                            10,
                                            ["A", "B", "C", "D"].indexOf(letter)
                                        ) +
                                    cost
                            });
                        }
                    }
                }
            }
        }
        bfsData.push(nextBfs);
        if (arr.some(l => isSuccessful(l.state))) {
            const leDub = removeDuplicates(
                arr.filter(l => isSuccessful(l.state))
            )[0];
            if (leDub.cost < minCost) {
                minCost = leDub.cost;
            }
        }
        nextBfs = removeDuplicates(arr);
    }

    return minCost;
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const adsf = [
        raw[2].split("").filter(l => l !== "#"),
        raw[3].split("").filter(l => l !== "#" && l !== " "),
        raw[4].split("").filter(l => l !== "#" && l !== " "),
        raw[5].split("").filter(l => l !== "#" && l !== " ")
    ];
    const input = adsf[0].map((l, idx) => [l, adsf[1][idx]]) as Input;
    const input2: Input2 = [];

    for (let i = 0; i < adsf[0].length; i++) {
        input2.push([adsf[0][i], adsf[1][i], adsf[2][i], adsf[3][i]]);
    }

    console.time("part1");

    console.log(part1(input)); // Make sure to edit input.txt to reflect not having part 2 for this one

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input2));

    console.timeEnd("part2");
};

main();
