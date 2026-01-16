import { test } from "../src/config/baseTest";
import { faker } from "@faker-js/faker";
import BookstoreAPIOperations from "../src/api/BookstoreAPIOperations";
import { readExcelFile } from "../src/utils/excelDataProvider";
import Log from "../src/config/logger";

const testDataRecordsAddBook = readExcelFile('test-data-bookstore-api.xlsx', 'AddBook');
const testDataRecordsEditBook = readExcelFile('test-data-bookstore-api.xlsx', 'EditBook');
const testDataRecordsDeleteBook = readExcelFile('test-data-bookstore-api.xlsx', 'DeleteBook');

test.describe('Bookstore API Tests', () => {
    testDataRecordsAddBook.forEach((testDataRecordAddBook) => {
        if(testDataRecordAddBook.ExecutionFlag == "Yes") {
            test(testDataRecordAddBook.TestCaseId + ': ' + testDataRecordAddBook.TestCaseName + ' for book ' + testDataRecordAddBook.BookName, async () => {                
                Log.testBegin(test.info().title);                
                const userName = faker.animal.petName() + faker.airline.flightNumber();
                const bookStore = new BookstoreAPIOperations();
                await bookStore.createUser(userName);                
                await bookStore.generateToken(userName);                
                await bookStore.addBookISBN(testDataRecordAddBook.BookName);                
                Log.testEnd(test.info().title);
            });
        }
    });

     testDataRecordsEditBook.forEach((testDataRecordEditBook) => {
        if(testDataRecordEditBook.ExecutionFlag == "Yes") {
            test(testDataRecordEditBook.TestCaseId + ': ' + testDataRecordEditBook.TestCaseName + ' for book ' + testDataRecordEditBook.BookName, async () => {                
                Log.testBegin(test.info().title);                
                const userName = faker.animal.petName() + faker.airline.flightNumber();
                const bookStore = new BookstoreAPIOperations();
                await bookStore.createUser(userName);                
                await bookStore.generateToken(userName);                
                await bookStore.addBookISBN(testDataRecordEditBook.BookName);
                await bookStore.editBookISBN(testDataRecordEditBook.BookName, testDataRecordEditBook.NewBookName);
                Log.testEnd(test.info().title);
            });
        }
    });

    testDataRecordsDeleteBook.forEach((testDataRecordDeleteBook) => {
        if(testDataRecordDeleteBook.ExecutionFlag == "Yes") {
            test(testDataRecordDeleteBook.TestCaseId + ': ' + testDataRecordDeleteBook.TestCaseName + ' for book ' + testDataRecordDeleteBook.BookName, async () => {                
                Log.testBegin(test.info().title);                
                const userName = faker.animal.petName() + faker.airline.flightNumber();
                const bookStore = new BookstoreAPIOperations();
                await bookStore.createUser(userName);                
                await bookStore.generateToken(userName);                
                await bookStore.addBookISBN(testDataRecordDeleteBook.BookName);
                await bookStore.deleteBookISBN(testDataRecordDeleteBook.BookName);
                Log.testEnd(test.info().title);
            });
        }
    });

});