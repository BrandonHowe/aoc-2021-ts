import * as path from "path";
import { readInputSplit } from "../helpers/readInput";

type Input = [number, number, number][][];
type Vec3 = [number, number, number];

const compose = <A>(...fns: ((v: A) => A)[]) =>
    fns.reduce(
        (prevFn, nextFn) => (...args) => nextFn(prevFn(...args)),
        value => value
    );

const matrixMultiply = (A: number[][], B: number[][]) => {
    return A.map((row, i) =>
        B[0].map((_, j) =>
            row.reduce((acc, _, n) => acc + A[i][n] * B[n][j], 0)
        )
    );
};

const rotateX = (vec: Vec3, cw: boolean = false): Vec3 => {
    return matrixMultiply(
        !cw
            ? [
                  [1, 0, 0],
                  [0, 0, -1],
                  [0, 1, 0]
              ]
            : [
                  [1, 0, 0],
                  [0, 0, 1],
                  [0, -1, 0]
              ],
        vec.map(l => [l])
    ).flat() as Vec3;
};

const rotateY = (vec: Vec3, cw: boolean = false): Vec3 => {
    return matrixMultiply(
        !cw
            ? [
                  [0, 0, 1],
                  [0, 1, 0],
                  [-1, 0, 0]
              ]
            : [
                  [0, 0, -1],
                  [0, 1, 0],
                  [1, 0, 0]
              ],
        vec.map(l => [l])
    ).flat() as Vec3;
};

const rotateZ = (vec: Vec3, cw: boolean = false): Vec3 => {
    return matrixMultiply(
        !cw
            ? [
                  [0, -1, 0],
                  [1, 0, 0],
                  [0, 0, 1]
              ]
            : [
                  [0, 1, 0],
                  [-1, 0, 0],
                  [0, 0, 1]
              ],
        vec.map(l => [l])
    ).flat() as Vec3;
};

const doOrientations: ((p: Vec3) => Vec3)[] = [
    ([x, y, z]) => [x, y, z],
    ([x, y, z]) => [x, y, -z],
    ([x, y, z]) => [x, -y, z],
    ([x, y, z]) => [x, -y, -z],
    ([x, y, z]) => [-x, y, z],
    ([x, y, z]) => [-x, y, -z],
    ([x, y, z]) => [-x, -y, z],
    ([x, y, z]) => [-x, -y, -z],
    ([x, y, z]) => [z, x, y],
    ([x, y, z]) => [z, x, -y],
    ([x, y, z]) => [z, -x, y],
    ([x, y, z]) => [z, -x, -y],
    ([x, y, z]) => [-z, x, y],
    ([x, y, z]) => [-z, x, -y],
    ([x, y, z]) => [-z, -x, y],
    ([x, y, z]) => [-z, -x, -y],
    ([x, y, z]) => [y, z, x],
    ([x, y, z]) => [y, z, -x],
    ([x, y, z]) => [y, -z, x],
    ([x, y, z]) => [y, -z, -x],
    ([x, y, z]) => [-y, z, x],
    ([x, y, z]) => [-y, z, -x],
    ([x, y, z]) => [-y, -z, x],
    ([x, y, z]) => [-y, -z, -x],
    ([x, y, z]) => [x, z, y],
    ([x, y, z]) => [x, z, -y],
    ([x, y, z]) => [x, -z, y],
    ([x, y, z]) => [x, -z, -y],
    ([x, y, z]) => [-x, z, y],
    ([x, y, z]) => [-x, z, -y],
    ([x, y, z]) => [-x, -z, y],
    ([x, y, z]) => [-x, -z, -y],
    ([x, y, z]) => [y, x, z],
    ([x, y, z]) => [y, x, -z],
    ([x, y, z]) => [y, -x, z],
    ([x, y, z]) => [y, -x, -z],
    ([x, y, z]) => [-y, x, z],
    ([x, y, z]) => [-y, x, -z],
    ([x, y, z]) => [-y, -x, z],
    ([x, y, z]) => [-y, -x, -z],
    ([x, y, z]) => [z, y, x],
    ([x, y, z]) => [z, y, -x],
    ([x, y, z]) => [z, -y, x],
    ([x, y, z]) => [z, -y, -x],
    ([x, y, z]) => [-z, y, x],
    ([x, y, z]) => [-z, y, -x],
    ([x, y, z]) => [-z, -y, x],
    ([x, y, z]) => [-z, -y, -x]
];

const getAllOrientations = (raw: Vec3[]) => {
    let vec = [...raw.map(l => [...l])] as Vec3[];
    const orientations: Vec3[][] = [];

    for (let i = 0; i < 4; i++) {
        vec = vec.map(l => rotateY(l)).map(l => l.flat()) as Vec3[];
        for (let j = 0; j < 4; j++) {
            orientations.push(
                vec
                    .map(l => (i % 2 === 0 ? rotateZ(l) : rotateX(l)))
                    .map(l => l.flat()) as Vec3[]
            );

            vec = vec
                .map(l => (i % 2 === 0 ? rotateZ(l) : rotateX(l)))
                .map(l => l.flat()) as Vec3[];
        }
    }

    vec = vec.map(l => rotateZ(l)).map(l => l.flat()) as Vec3[];
    for (let j = 0; j < 4; j++) {
        orientations.push(
            vec.map(l => rotateY(l)).map(l => l.flat()) as Vec3[]
        );
        vec = vec.map(l => rotateY(l)).map(l => l.flat()) as Vec3[];
    }
    vec = vec.map(l => rotateZ(l)).map(l => l.flat()) as Vec3[];
    vec = vec.map(l => rotateZ(l)).map(l => l.flat()) as Vec3[];
    for (let j = 0; j < 4; j++) {
        orientations.push(
            vec.map(l => rotateY(l)).map(l => l.flat()) as Vec3[]
        );
        vec = vec.map(l => rotateY(l)).map(l => l.flat()) as Vec3[];
    }

    return orientations;
};

const parseInput = (raw: string[]) => {
    const res: Input = [];
    for (const row of raw) {
        if (row.includes("scanner")) {
            res.push([]);
        } else if (row !== "") {
            res[res.length - 1].push(row.split(",").map(Number) as Vec3);
        }
    }
    return res;
};

const vecDist = (v: Vec3) => {
    return Math.pow(v[0], 2) + Math.pow(v[1], 2) + Math.pow(v[2], 2);
};

const add = (a: Vec3, b: Vec3) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec3, b: Vec3) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

const part1 = (input: Input) => {
    const distances: Record<number, [Vec3, Vec3]>[] = [];

    for (const scanner of input) {
        distances.push({});
        for (let i = 0; i < scanner.length; i++) {
            for (let j = 0; j < scanner.length; j++) {
                if (i >= j) continue;
                const dist =
                    Math.pow(scanner[j][0] - scanner[i][0], 2) +
                    Math.pow(scanner[j][1] - scanner[i][1], 2) +
                    Math.pow(scanner[j][2] - scanner[i][2], 2);
                distances[distances.length - 1][dist] = [
                    scanner[i],
                    scanner[j]
                ];
            }
        }
    }

    const normalized: Record<number, Vec3[]> = {};
    const normalizedRot: Record<number, number> = {};
    const translations: Record<number, Vec3> = {};
    let remaining = input.map((_, idx) => idx);
    remaining.shift();

    const normalize = (
        distAnchor: Record<number, [Vec3, Vec3]>,
        distScanner: Record<number, [Vec3, Vec3]>,
        idx1: number,
        idx2: number
    ) => {
        const matchingDistances = Object.keys(distAnchor)
            .filter(l => l in distScanner)
            .map(Number);

        const matchingPairsAnchor: Vec3[] = [];

        const f1 = matchingDistances.map(l => distAnchor[l]).flat();
        for (const pair of f1) {
            if (
                !matchingPairsAnchor.some(
                    l =>
                        l[0] === pair[0] && l[1] === pair[1] && l[2] === pair[2]
                )
            ) {
                matchingPairsAnchor.push(pair);
            }
        }

        const matchingPairsScanner: Vec3[] = [];

        const f2 = matchingDistances.map(l => distScanner[l]).flat();
        for (const pair of f2) {
            if (
                !matchingPairsScanner.some(
                    l =>
                        l[0] === pair[0] && l[1] === pair[1] && l[2] === pair[2]
                )
            ) {
                matchingPairsScanner.push(pair);
            }
        }

        if (matchingPairsAnchor.length < 12) {
            return false;
        }

        // console.log("blah", idx1, idx2, matchingPairsAnchor.length);

        const translationMatrixCandidates: Record<
            string,
            { count: number; rotation: number }
        > = {};
        for (let i = 0; i < doOrientations.length; i++) {
            const rot = doOrientations[i];
            for (const dist of matchingDistances) {
                const dist1 = sub(
                    doOrientations[normalizedRot[idx1]](distAnchor[dist][0]),
                    rot(distScanner[dist][0])
                );
                const dist2 = sub(
                    doOrientations[normalizedRot[idx1]](distAnchor[dist][1]),
                    rot(distScanner[dist][1])
                );
                if (
                    dist1[0] === dist2[0] &&
                    dist1[1] === dist2[1] &&
                    dist1[2] === dist2[2]
                ) {
                    if (translationMatrixCandidates[dist1.join(",")]) {
                        translationMatrixCandidates[dist1.join(",")].count++;
                    } else {
                        translationMatrixCandidates[dist1.join(",")] = {
                            count: 1,
                            rotation: i
                        };
                    }
                }
            }
        }

        // console.log(translationMatrixCandidates);
        const rotationIdx = Object.entries(translationMatrixCandidates).sort(
            (a, b) => b[1].count - a[1].count
        )?.[0]?.[1];
        const translationMatrix = Object.entries(translationMatrixCandidates)
            .sort((a, b) => b[1].count - a[1].count)?.[0]?.[0]
            ?.split(",")
            ?.map(Number) as Vec3;

        if (!translationMatrix || !rotationIdx) return false;

        // console.log(translationMatrix, rotationIdx, translations[idx1]);

        normalized[idx2] = input[idx2].map(
            l =>
                add(
                    translationMatrix,
                    doOrientations[rotationIdx.rotation](l)
                ) as Vec3
        );
        normalizedRot[idx2] = rotationIdx.rotation;
        translations[idx2] = add(translationMatrix, translations[idx1]) as Vec3;
        remaining = remaining.filter(l => l !== idx2);

        return true;
    };

    normalized[0] = input[0];
    normalizedRot[0] = 0;
    translations[0] = [0, 0, 0];

    // console.log("REMAINING", remaining);

    while (remaining.length) {
        for (const i of remaining) {
            for (const j in normalized) {
                // console.log(i, j, remaining, Object.keys(normalized));
                normalize(distances[j], distances[i], Number(j), i);
            }
        }
    }

    const intersection: Vec3[] = [];

    for (let i = 0; i < input.length; i++) {
        const scanner = input[i];
        for (const point of scanner) {
            const rotated = doOrientations[normalizedRot[i]](point);
            const normalized = add(rotated, translations[i]);
            if (
                intersection.some(
                    l =>
                        l[0] === normalized[0] &&
                        l[1] === normalized[1] &&
                        l[2] === normalized[2]
                )
            )
                continue;
            intersection.push(normalized as Vec3);
        }
    }

    // console.log(normalized);

    // console.log(translations);

    return intersection.length;

    // console.log(intersection.sort((a, b) => a[0] - b[0]).join("\n"));
};

const part2 = (input: Input) => {
    const distances: Record<number, [Vec3, Vec3]>[] = [];

    for (const scanner of input) {
        distances.push({});
        for (let i = 0; i < scanner.length; i++) {
            for (let j = 0; j < scanner.length; j++) {
                if (i >= j) continue;
                const dist =
                    Math.pow(scanner[j][0] - scanner[i][0], 2) +
                    Math.pow(scanner[j][1] - scanner[i][1], 2) +
                    Math.pow(scanner[j][2] - scanner[i][2], 2);
                distances[distances.length - 1][dist] = [
                    scanner[i],
                    scanner[j]
                ];
            }
        }
    }

    const normalized: Record<number, Vec3[]> = {};
    const normalizedRot: Record<number, number> = {};
    const translations: Record<number, Vec3> = {};
    let remaining = input.map((_, idx) => idx);
    remaining.shift();

    const normalize = (
        distAnchor: Record<number, [Vec3, Vec3]>,
        distScanner: Record<number, [Vec3, Vec3]>,
        idx1: number,
        idx2: number
    ) => {
        const matchingDistances = Object.keys(distAnchor)
            .filter(l => l in distScanner)
            .map(Number);

        const matchingPairsAnchor: Vec3[] = [];

        const f1 = matchingDistances.map(l => distAnchor[l]).flat();
        for (const pair of f1) {
            if (
                !matchingPairsAnchor.some(
                    l =>
                        l[0] === pair[0] && l[1] === pair[1] && l[2] === pair[2]
                )
            ) {
                matchingPairsAnchor.push(pair);
            }
        }

        const matchingPairsScanner: Vec3[] = [];

        const f2 = matchingDistances.map(l => distScanner[l]).flat();
        for (const pair of f2) {
            if (
                !matchingPairsScanner.some(
                    l =>
                        l[0] === pair[0] && l[1] === pair[1] && l[2] === pair[2]
                )
            ) {
                matchingPairsScanner.push(pair);
            }
        }

        if (matchingPairsAnchor.length < 12) {
            return false;
        }

        // console.log("blah", idx1, idx2, matchingPairsAnchor.length);

        const translationMatrixCandidates: Record<
            string,
            { count: number; rotation: number }
        > = {};
        for (let i = 0; i < doOrientations.length; i++) {
            const rot = doOrientations[i];
            for (const dist of matchingDistances) {
                const dist1 = sub(
                    doOrientations[normalizedRot[idx1]](distAnchor[dist][0]),
                    rot(distScanner[dist][0])
                );
                const dist2 = sub(
                    doOrientations[normalizedRot[idx1]](distAnchor[dist][1]),
                    rot(distScanner[dist][1])
                );
                if (
                    dist1[0] === dist2[0] &&
                    dist1[1] === dist2[1] &&
                    dist1[2] === dist2[2]
                ) {
                    if (translationMatrixCandidates[dist1.join(",")]) {
                        translationMatrixCandidates[dist1.join(",")].count++;
                    } else {
                        translationMatrixCandidates[dist1.join(",")] = {
                            count: 1,
                            rotation: i
                        };
                    }
                }
            }
        }

        // console.log(translationMatrixCandidates);
        const rotationIdx = Object.entries(translationMatrixCandidates).sort(
            (a, b) => b[1].count - a[1].count
        )?.[0]?.[1];
        const translationMatrix = Object.entries(translationMatrixCandidates)
            .sort((a, b) => b[1].count - a[1].count)?.[0]?.[0]
            ?.split(",")
            ?.map(Number) as Vec3;

        if (!translationMatrix || !rotationIdx) return false;

        // console.log(translationMatrix, rotationIdx, translations[idx1]);

        normalized[idx2] = input[idx2].map(
            l =>
                add(
                    translationMatrix,
                    doOrientations[rotationIdx.rotation](l)
                ) as Vec3
        );
        normalizedRot[idx2] = rotationIdx.rotation;
        translations[idx2] = add(translationMatrix, translations[idx1]) as Vec3;
        remaining = remaining.filter(l => l !== idx2);

        return true;
    };

    normalized[0] = input[0];
    normalizedRot[0] = 0;
    translations[0] = [0, 0, 0];

    // console.log("REMAINING", remaining);

    while (remaining.length) {
        for (const i of remaining) {
            for (const j in normalized) {
                normalize(distances[j], distances[i], Number(j), i);
            }
        }
    }

    const intersection: Vec3[] = [];

    for (let i = 0; i < input.length; i++) {
        const scanner = input[i];
        for (const point of scanner) {
            const rotated = doOrientations[normalizedRot[i]](point);
            const normalized = add(rotated, translations[i]);
            if (
                intersection.some(
                    l =>
                        l[0] === normalized[0] &&
                        l[1] === normalized[1] &&
                        l[2] === normalized[2]
                )
            )
                continue;
            intersection.push(normalized as Vec3);
        }
    }

    let maxDist = 0;

    for (let i = 0; i < Object.values(translations).length; i++) {
        for (let j = 0; j < Object.values(translations).length; j++) {
            const total = sub(translations[i], translations[j])
                .map(Math.abs)
                .reduce((acc, cur) => acc + cur, 0);
            if (total > maxDist) {
                maxDist = total;
            }
        }
    }

    return maxDist;
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
