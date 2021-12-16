import * as path from "path";
import { readInputRaw, readInputSplit } from "../helpers/readInput";

type Input = number[];

const part1 = (input: Input) => {
    // console.log("received", input.join(""));
    const f1 = input.shift();
    const f2 = input.shift();
    const f3 = input.shift();
    const version = parseInt(`${f1}${f2}${f3}`, 2);
    const t1 = input.shift();
    const t2 = input.shift();
    const t3 = input.shift();
    const type = parseInt(`${t1}${t2}${t3}`, 2);
    // console.log(version, type);
    let total = 0;
    if (type === 4) {
        let num = "";
        while (true) {
            const n1 = input.shift();
            const n2 = input.shift();
            const n3 = input.shift();
            const n4 = input.shift();
            const n5 = input.shift();
            num += `${n2}${n3}${n4}${n5}`;
            if (n1 === 0) {
                break;
            }
        }
        total += version;
    } else {
        const bitType = input.shift();
        if (bitType === 0) {
            let packetLenRaw = "";
            for (let i = 0; i < 15; i++) {
                packetLenRaw += input.shift();
            }
            const packetLen = parseInt(packetLenRaw, 2);
            // console.log("lennn", packetLenRaw);
            const packets = [];
            let packetsLen = 0;
            while (packetsLen < packetLen) {
                const initialInput = [...input];
                const res = part1(input);
                // console.log("res", res, initialInput.join(""), input.join(""));
                packetsLen += initialInput.length - input.length;
                packets.push(
                    initialInput.slice(0, initialInput.length - input.length)
                );
            }

            // console.log(packets);
            total += version;
            for (const packet of packets) {
                total += part1(packet);
            }
        } else if (bitType === 1) {
            let packetCountRaw = "";
            for (let i = 0; i < 11; i++) {
                packetCountRaw += input.shift();
            }
            const packetCount = parseInt(packetCountRaw, 2);
            // console.log("count", packetCountRaw);
            const packets = [];
            while (packets.length < packetCount) {
                const initialInput = [...input];
                const res = part1(input);
                // console.log("res", res, initialInput.join(""), input.join(""));
                packets.push(
                    initialInput.slice(0, initialInput.length - input.length)
                );
            }

            // console.log(packets);
            total += version;
            for (const packet of packets) {
                total += part1(packet);
            }
        }
    }

    return total;
};

const part2 = (input: Input) => {
    // console.log("received", input.join(""));
    const f1 = input.shift();
    const f2 = input.shift();
    const f3 = input.shift();
    const version = parseInt(`${f1}${f2}${f3}`, 2);
    const t1 = input.shift();
    const t2 = input.shift();
    const t3 = input.shift();
    const type = parseInt(`${t1}${t2}${t3}`, 2);
    // console.log(version, type);
    let total = 0;
    let packs: number[][] = [];
    if (type === 4) {
        let num = "";
        while (true) {
            const n1 = input.shift();
            const n2 = input.shift();
            const n3 = input.shift();
            const n4 = input.shift();
            const n5 = input.shift();
            num += `${n2}${n3}${n4}${n5}`;
            if (n1 === 0) {
                break;
            }
        }
        total += parseInt(num, 2);
    } else {
        const bitType = input.shift();
        if (bitType === 0) {
            let packetLenRaw = "";
            for (let i = 0; i < 15; i++) {
                packetLenRaw += input.shift();
            }
            const packetLen = parseInt(packetLenRaw, 2);
            // console.log("lennn", packetLenRaw);
            const packets = [];
            let packetsLen = 0;
            while (packetsLen < packetLen) {
                const initialInput = [...input];
                part1(input);
                // console.log("res", res, initialInput.join(""), input.join(""));
                packetsLen += initialInput.length - input.length;
                packets.push(
                    initialInput.slice(0, initialInput.length - input.length)
                );
            }

            packs = packets;
        } else if (bitType === 1) {
            let packetCountRaw = "";
            for (let i = 0; i < 11; i++) {
                packetCountRaw += input.shift();
            }
            const packetCount = parseInt(packetCountRaw, 2);
            // console.log("count", packetCountRaw);
            const packets = [];
            while (packets.length < packetCount) {
                const initialInput = [...input];
                part1(input);
                // console.log("res", res, initialInput.join(""), input.join(""));
                packets.push(
                    initialInput.slice(0, initialInput.length - input.length)
                );
            }

            packs = packets;
        }
    }

    if (type === 0) {
        for (const pack of packs) {
            total += part2(pack);
        }
    } else if (type === 1) {
        let r = 1;
        for (const pack of packs) {
            r *= part2(pack);
        }
        total = r;
    } else if (type === 2) {
        total = Math.min(...packs.map(l => part2(l)));
    } else if (type === 3) {
        total = Math.max(...packs.map(l => part2(l)));
    } else if (type === 5) {
        total = part2(packs[0]) > part2(packs[1]) ? 1 : 0;
    } else if (type === 6) {
        total = part2(packs[0]) < part2(packs[1]) ? 1 : 0;
    } else if (type === 7) {
        total = part2(packs[0]) === part2(packs[1]) ? 1 : 0;
    }

    return total;
};

const main = async () => {
    const raw = await readInputRaw(path.join(__dirname, "./input.txt"));
    const input = raw
        .trim()
        .split("")
        .map(l => parseInt(l, 16).toString(2).padStart(4, "0"))
        .join("")
        .split("")
        .map(Number);

    console.time("part1");

    console.log(part1(input));

    console.timeEnd("part1");

    console.time("part2");

    console.log(part2(input));

    console.timeEnd("part2");
};

main();
