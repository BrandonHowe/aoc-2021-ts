import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = [string, string][];

type RoomString = "roomA" | "roomB" | "roomC" | "roomD";

type Grid = {
    hallway: (string | null)[];
    roomA: [string | null, string | null];
    roomB: [string | null, string | null];
    roomC: [string | null, string | null];
    roomD: [string | null, string | null];
};

const displayGrid = (grid: Grid) => {
    let str = "";
    str += "#############\n";
    str += "#." + grid.hallway.map(l => l ?? ".").join(".") + ".#\n";
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

const part1 = (input: Input) => {
    const grid: Grid = {
        hallway: [null, null, null, null, null],
        roomA: input[0],
        roomB: input[1],
        roomC: input[2],
        roomD: input[3]
    };

    const moveIntoHallway = (grid: Grid, room: number, hallway: number) => {
        const gridRoom =
            grid[`room${["A", "B", "C", "D"][room]}` as RoomString];
        if (gridRoom.filter(l => l !== null).length) {
            if (gridRoom[0] !== null) {
                grid.hallway[hallway] = gridRoom[0];
                gridRoom[0] = null;
            } else if (gridRoom[1] !== null) {
                grid.hallway[hallway] = gridRoom[1];
                gridRoom[1] = null;
            }
        }
    };

    const moveRoomToRoom = (grid: Grid, room: number, room2: number) => {
        const gridRoom =
            grid[`room${["A", "B", "C", "D"][room]}` as RoomString];
        const gridRoom2 =
            grid[`room${["A", "B", "C", "D"][room2]}` as RoomString];
        if (gridRoom.filter(l => l !== null).length) {
            const mover = gridRoom[0] !== null ? gridRoom[0] : gridRoom[1];
            if (["A", "B", "C", "D"][room2] !== mover) return;
            if (gridRoom2.some(l => l !== null && l !== mover)) return;
            if (gridRoom2[1] && !gridRoom2[0]) {
                if (gridRoom[0] === null) {
                    gridRoom[1] = null;
                } else {
                    gridRoom[0] = null;
                }
                gridRoom2[0] = mover;
            } else if (!gridRoom2[1] && !gridRoom2[0]) {
                if (gridRoom[0] === null) {
                    gridRoom[1] = null;
                } else {
                    gridRoom[0] = null;
                }
                gridRoom2[1] = mover;
            }
        }
    };

    const moveHallwayIntoRoom = (grid: Grid, room: number, hallway: number) => {
        const gridRoom =
            grid[`room${["A", "B", "C", "D"][room]}` as RoomString];
        if (["A", "B", "C", "D"][room] !== grid.hallway[hallway]) return;
        if (gridRoom.some(l => l !== null && l !== ["A", "B", "C", "D"][room]))
            return;
        if (gridRoom[1] === null) {
            gridRoom[1] = grid.hallway[hallway];
            grid.hallway[hallway] = null;
        } else if (gridRoom[0] === null) {
            gridRoom[0] = grid.hallway[hallway];
            grid.hallway[hallway] = null;
        }
    };

    moveIntoHallway(grid, 2, 1);
    moveRoomToRoom(grid, 1, 2);
    moveIntoHallway(grid, 1, 2);
    moveHallwayIntoRoom(grid, 1, 1);

    console.log(displayGrid(grid));
};

const part2 = (input: Input) => {};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const adsf = [
        raw[2].split("").filter(l => l !== "#"),
        raw[3].split("").filter(l => l !== "#" && l !== " ")
    ];
    const input = adsf[0].map((l, idx) => [l, adsf[1][idx]]) as Input;

    console.log(input);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
