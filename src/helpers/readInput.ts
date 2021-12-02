import * as fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

export const readInputRaw = (filepath: string): Promise<string> =>
    readFile(filepath, "utf-8");

export const readInputSplit = async (filepath: string): Promise<string[]> => {
    const v = (await readFile(filepath, "utf-8")).split("\n");
    v.pop();
    return v;
};

export const readInputSplitNum = async (
    filepath: string
): Promise<number[]> => {
    const v = (await readFile(filepath, "utf-8")).split("\n").map(Number);
    v.pop();
    return v;
};

export const readInputGrid = async (filepath: string): Promise<string[][]> => {
    const v = (await readFile(filepath, "utf-8")).split("\n");
    v.pop();
    return v.map(l => l.split(""));
};
