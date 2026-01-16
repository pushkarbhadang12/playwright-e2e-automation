import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export const readCSVFile = (filename: string): any[] => {   
    const currentDirectory = __dirname;
    const projectRoot = path.resolve(currentDirectory, '../../');
    const filePath = path.join(`${projectRoot}/test-data/${filename}`); 
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });
    return records;
};