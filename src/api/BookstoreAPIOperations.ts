import Log from "../config/logger";
import RESTMethods from "../utils/restMethods";
import CryptoEncryptDecrypt from "../utils/cryptoEncryptDecrypt";
import { expect } from "@playwright/test";

export default class BookstoreAPIOperations extends RESTMethods {

    userId: string = "";
    token: string = "";
    isbn: string = "";
    password: string = process.env.API_Password!;
    cryptoEncryptDecrypt = new CryptoEncryptDecrypt(process.env.ENCRYPTION_KEY!);
    decryptedPassword = this.cryptoEncryptDecrypt.decryptData(this.password!);

    public async createUser(username: string): Promise<any> {
        try {
            const requestURL = process.env.API_BASE_URL! + process.env.API_CreateUser_URL!;
            const requestBody = {
                "userName": username,
                "password": this.decryptedPassword
            };
            Log.info('Sending Create User API request with request url: ' + requestURL + ' and request body: ' + JSON.stringify(requestBody));

            const response = await this.sendPOSTRequest(
                requestURL,
                "Create User API",
                { 'Content-Type': 'application/json' },
                requestBody
            );

            const responseBody = await response.json();
            this.userId = responseBody.userID;
            Log.info(`User created with UserID: ${this.userId}`);
            return this.userId;
        } catch (error) {
            Log.error(`Error creating user ${username}: ${error}`);
            throw error;
        }
    }

    public async generateToken(username: string): Promise<any> {
        try {
            const requestURL = process.env.API_BASE_URL! + process.env.API_GenerateToken_URL!;
            const requestBody = {
                "userName": username,
                "password": this.decryptedPassword
            };
            Log.info('Sending Generate Token API request with request url: ' + requestURL + ' and request body: ' + JSON.stringify(requestBody));
            const response = await this.sendPOSTRequest(
                requestURL,
                "Generate Token API",
                { 'Content-Type': 'application/json' },
                requestBody
            );
            const responseBody = await response.json();
            this.token = responseBody.token;
            Log.info(`Generated Token: ${this.token}`);
            return this.token;
        } catch (error) {
            Log.error(`Error Generating Token: ${error}`);
            throw error;
        }
    }

    public async getBookISBN(bookName: string): Promise<any> {
        try {
            const requestURL = process.env.API_BASE_URL! + process.env.API_GetBook_URL!;
            Log.info('Sending Get Book API request with request url: ' + requestURL);
            const response = await this.sendGETRequest(requestURL, "Get Book API");
            const responseBody = await response.json();
            let books: Array<any> = await responseBody.books;
            books.forEach((book) => {
                if (book.title == bookName) {
                    this.isbn = book.isbn;
                }
            });
            Log.info(`Received Book ISBN ${this.isbn} for the book: ${bookName}`);
            return this.isbn;
        } catch (error) {
            Log.error(`Error getting Book ISBN: ${error}`);
            throw error;
        }
    }

    public async addBookISBN(bookName: string) {
        try {
            const requestURL = process.env.API_BASE_URL! + process.env.API_GetBook_URL!;
            const headers = {
                "Authorization": `Bearer ${this.token}`
            }
            const isbn = await this.getBookISBN(bookName);
            const requestBody = {
                "userId": this.userId,
                "collectionOfIsbns": [
                    {
                        "isbn": isbn
                    }
                ]
            }
            Log.info('Sending Add Book API request with request url: ' + requestURL + ', Header: ' + JSON.stringify(headers) + ' and request body: ' + JSON.stringify(requestBody));

            const response = await this.sendPOSTRequest(requestURL, "Add Book API", headers, requestBody);
            const responseBody = await response.json();

            Log.info("Response Body: " + JSON.stringify(responseBody));

            if (response.status() == 201) {
                Log.info("Book ISBN added successfully.");
            } else {
                Log.error(`Error adding Book ISBN`);
            }
            expect(response.status()).toBe(201);
        } catch (error) {
            Log.error(`Error adding Book ISBN: ${error}`);
            throw error;
        }
    }

    public async editBookISBN(bookName: string, newBookName: string) {
        try {
            const isbn = await this.getBookISBN(bookName);
            Log.info(`Editing Book ISBN ${isbn} to new Book ${newBookName}`);
            const newIsbn = await this.getBookISBN(newBookName);
            Log.info(`New Book ISBN is ${newIsbn}`);
            const requestURL = process.env.API_BASE_URL! + process.env.API_GetBook_URL! + '/' + isbn;
            const headers = {
                "Authorization": `Bearer ${this.token}`
            }
            const requestBody = {
                "userId": this.userId,
                "isbn": newIsbn
            }
            Log.info('Sending Edit Book API request with request url: ' + requestURL + ', Header: ' + JSON.stringify(headers) + ' and request body: ' + JSON.stringify(requestBody));

            const response = await this.sendPUTRequest(requestURL, "Edit Book API", headers, requestBody);
            const responseBody = await response.json();

            Log.info("Response Body: " + JSON.stringify(responseBody));

            if (response.status() == 200) {
                Log.info("Book ISBN edited successfully.");
            } else {
                Log.error(`Error editing Book ISBN`);
            }
            expect(response.status()).toBe(200);
        } catch (error) {
            Log.error(`Error editing Book ISBN: ${error}`);
            throw error;
        }
    }

    public async deleteBookISBN(bookName: string) {
        try {
            const isbn = await this.getBookISBN(bookName);
            Log.info(`Deleting Book ISBN ${isbn}`);

            const requestURL = process.env.API_BASE_URL! + process.env.API_DeleteBook_URL!;
            const headers = {
                "Authorization": `Bearer ${this.token}`
            }
            const requestBody = {
                "userId": this.userId,
                "isbn": isbn
            }
            Log.info('Sending Delete Book API request with request url: ' + requestURL + ', Header: ' + JSON.stringify(headers) + ' and request body: ' + JSON.stringify(requestBody));

            const response = await this.sendDELETERequest(requestURL, "Delete Book API", headers, requestBody);

            if (response.status() == 204) {
                Log.info("Book ISBN deleted successfully.");
            } else {
                Log.error(`Error deleting Book ISBN`);
            }
            expect(response.status()).toBe(204);
        } catch (error) {
            Log.error(`Error deleting Book ISBN: ${error}`);
            throw error;
        }
    }
}




