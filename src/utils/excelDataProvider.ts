import * as path from 'path';
import * as XLSX from 'xlsx';

export const readExcelFile = (filename: string, sheetname: string): any[] => {
    const currentDirectory = __dirname;
    const projectRoot = path.resolve(currentDirectory, '../../');
    const filePath = path.join(`${projectRoot}/test-data/${filename}`);
    
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetname];
    
    if(!worksheet){
        throw new Error(`Sheet ${sheetname} not found in file ${filename}`);
    }   

    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return jsonData;
};