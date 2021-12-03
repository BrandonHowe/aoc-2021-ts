import * as path from "path";
import { readInputSplit, readInputSplitNum } from "../helpers/readInput";

const part1 = (input: number[][]) => {
    const bits = [];
    for (let i = 0; i < input[0].length; i++) {
        let zeroes = 0;
        let ones = 0;
        for (const thing of input) {
            if (thing[i] === 0) {
                zeroes++;
            } else {
                ones++;
            }
        }
        if (ones > zeroes) {
            bits.push(1);
        } else {
            bits.push(0);
        }
    }
    const epsilon = bits.map(l => (l === 0 ? 1 : 0));
    console.log(bits);
    return parseInt(bits.join(""), 2) * parseInt(epsilon.join(""), 2);
};

const part2 = (input: number[][]) => {
    let oxygenBits: number[] = [];
    {
        for (let i = 0; i < input[0].length; i++) {
            let zeroes = 0;
            let ones = 0;
            const filtered = input.filter(l => {
                for (let i = 0; i < oxygenBits.length; i++) {
                    if (oxygenBits[i] !== l[i]) {
                        return false;
                    }
                }
                return true;
            });
            if (filtered.length === 1) {
                oxygenBits = filtered[0];
                break;
            }
            for (const thing of filtered) {
                if (thing[i] === 0) {
                    zeroes++;
                } else {
                    ones++;
                }
            }
            console.log(zeroes, ones);
            if (zeroes < ones) {
                oxygenBits.push(1);
            } else if (ones < zeroes) {
                oxygenBits.push(0);
            } else {
                oxygenBits.push(1);
            }
        }
    }
    let co2Bits: number[] = [];
    {
        for (let i = 0; i < input[0].length; i++) {
            let zeroes = 0;
            let ones = 0;
            const filtered = input.filter(l => {
                for (let i = 0; i < co2Bits.length; i++) {
                    if (co2Bits[i] !== l[i]) {
                        return false;
                    }
                }
                return true;
            });
            if (filtered.length === 1) {
                co2Bits = filtered[0];
                break;
            }
            for (const thing of filtered) {
                if (thing[i] === 0) {
                    zeroes++;
                } else {
                    ones++;
                }
            }
            console.log(zeroes, ones);
            if (zeroes > ones) {
                co2Bits.push(1);
            } else if (ones > zeroes) {
                co2Bits.push(0);
            } else {
                co2Bits.push(0);
            }
        }
    }
    console.log(oxygenBits, co2Bits);
    console.log(
        parseInt(oxygenBits.join(""), 2),
        parseInt(co2Bits.join(""), 2)
    );
    return parseInt(oxygenBits.join(""), 2) * parseInt(co2Bits.join(""), 2);
};

const main = async () => {
    const input = await readInputSplit(path.join(__dirname, "./input.txt"));
    const raw = input.map(l => l.split("").map(Number));

    console.log(raw);

    console.time("part1");

    console.log(part1(raw));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(raw));

    console.timeEnd("part2");
};

main();
