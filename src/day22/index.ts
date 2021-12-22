import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = {
    state: boolean;
    coords: [[number, number], [number, number], [number, number]];
}[];

const parseInput = (raw: string[]): Input => {
    const inp = [];
    for (const str of raw) {
        const s0 = str.split(" ");
        const s1 = s0[1].split(",");
        const s2 = s1.map(l => l.split("=")[1]);
        const s3 = s2.map(l => l.split("..").map(Number));
        inp.push({ state: s0[0] === "on", coords: s3 as Input[0]["coords"] });
    }
    return inp as Input;
};

const part1 = (input: Input) => {
    const grid: Record<string, boolean> = {};

    for (const { state, coords } of input) {
        const minX =
            Math.min(...coords[0]) < -50 ? -50 : Math.min(...coords[0]);
        const minY =
            Math.min(...coords[1]) < -50 ? -50 : Math.min(...coords[1]);
        const minZ =
            Math.min(...coords[2]) < -50 ? -50 : Math.min(...coords[2]);
        const maxX = Math.max(...coords[0]) > 50 ? 50 : Math.max(...coords[0]);
        const maxY = Math.max(...coords[1]) > 50 ? 50 : Math.max(...coords[1]);
        const maxZ = Math.max(...coords[2]) > 50 ? 50 : Math.max(...coords[2]);
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                for (let z = minZ; z <= maxZ; z++) {
                    grid[`${x}|${y}|${z}`] = state;
                }
            }
        }
    }

    return Object.values(grid).filter(l => l === true).length;
};

class Cuboid {
    constructor(
        public state: boolean,
        public minX: number,
        public maxX: number,
        public minY: number,
        public maxY: number,
        public minZ: number,
        public maxZ: number
    ) {
        if (this.minX > this.maxX) {
            const temp = this.minX;
            this.minX = this.maxX;
            this.maxX = temp;
        }
        if (this.minY > this.maxY) {
            const temp = this.minY;
            this.minY = this.maxY;
            this.maxY = temp;
        }
        if (this.minZ > this.maxZ) {
            const temp = this.minZ;
            this.minZ = this.maxZ;
            this.maxZ = temp;
        }
    }

    get size(): number {
        return (
            (this.maxX - this.minX + 1) *
            (this.maxY - this.minY + 1) *
            (this.maxZ - this.minZ + 1)
        );
    }

    public intersection({
        minX,
        minY,
        minZ,
        maxX,
        maxY,
        maxZ
    }: Cuboid): Cuboid | null {
        if (
            this.maxX >= minX &&
            this.minX <= maxX &&
            this.maxY >= minY &&
            this.minY <= maxY &&
            this.maxZ >= minZ &&
            this.minZ <= maxZ
        ) {
            return new Cuboid(
                false,
                Math.max(this.minX, minX),
                Math.min(this.maxX, maxX),
                Math.max(this.minY, minY),
                Math.min(this.maxY, maxY),
                Math.max(this.minZ, minZ),
                Math.min(this.maxZ, maxZ)
            );
        }
        return null;
    }
}

const part2 = (raw: Input) => {
    const input = raw.map(
        l =>
            new Cuboid(
                l.state,
                ...(l.coords.flat() as [
                    number,
                    number,
                    number,
                    number,
                    number,
                    number
                ])
            )
    );
    const cuboids: Cuboid[] = [];
    let size = 0;

    const getOverlapSizeOfCuboid = (cuboid: Cuboid, prev: Cuboid[]) => {
        let sum = 0;
        for (const box of prev) {
            const intersection = cuboid.intersection(box);
            if (intersection) {
                sum += intersection.size;
                sum -= getOverlapSizeOfCuboid(
                    intersection,
                    prev.slice(1 + prev.indexOf(box))
                );
            }
        }
        return sum;
    };

    input.reverse();

    for (const cuboid of input) {
        if (cuboid.state) {
            const adding =
                cuboid.size - getOverlapSizeOfCuboid(cuboid, cuboids);
            size += adding;
            // console.log("Adding", adding, cuboid.size);
        }
        cuboids.push(cuboid);
    }

    return size;

    // console.log(cuboids, size);
};

const main = async () => {
    const raw = await readInputSplit(path.join(__dirname, "./input.txt"));
    const input = parseInput(raw);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
