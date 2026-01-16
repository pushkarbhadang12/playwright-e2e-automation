import { expect } from "@playwright/test";
import { test } from "../src/config/baseTest";
import MyAccountPage from "../src/pages/MyAccountPage";
import Log from "../src/config/logger";
import {readExcelFile} from "../src/utils/excelDataProvider";
import MyWishlistPage from "../src/pages/MyWishlistPage";

const baseURL = process.env.Base_URL; 

const testDataRecords = readExcelFile('test-data-automation-test-store.xlsx','DeleteProductFromWishlist');

test.beforeEach(async ({ page }) => {
    await page.goto(baseURL!);
});

test.describe('Delete Product from Wish list from Excel Data', () => {
    testDataRecords.forEach((testDataRecord) => {
        if(testDataRecord.ExecutionFlag == "Yes"){
            test(testDataRecord.TestCaseId + ': ' + testDataRecord.TestCaseName, async ({page}) => {    

                const myAccountPage = new MyAccountPage(page);                   
                const myWishlistPage = new MyWishlistPage(page);          
                
                Log.testBegin(test.info().title);
                await test.step('Verify if application is logged in', async () => {
                    Log.info('Step 1: Verify if application is logged in');        
                    await myAccountPage.verifyIfApplicationIsLoggedIn();                    
                });

                await test.step('View Wish list before Deletion', async () => {
                    Log.info('Step 2: View Wish list before Deletion');        
                    await myAccountPage.goToWishListPage();                 
                    await myWishlistPage.verifyPageHeading("My Wish list");
                    const isProductInWishlist: Boolean = await myWishlistPage.verifyExistanceOfProductInWishList(testDataRecord.ProductName);                
                    if (!isProductInWishlist) {                        
                        Log.info("Product " + testDataRecord.ProductName + " is not present in Wishlist to delete.");
                        Log.info("Skipping test as Product " + testDataRecord.ProductName + " is not present in Wishlist to delete.");
                        test.skip();
                    } else {
                        Log.info("Product " + testDataRecord.ProductName + " is present in Wishlist before deletion.");
                    }
                    expect(isProductInWishlist).toBeTruthy();
                }); 
                
                await test.step('Delete Product from Wish list', async () => {
                    Log.info('Step 3: Delete Product from Wish list');        
                    await myWishlistPage.deleteProductFromWishlist(testDataRecord.ProductName); 
                });
                
                await test.step('Verify Product is deleted from Wish list', async () => {
                    Log.info('Step 4: Verify Product is deleted from Wish list');  
                    const isProductInWishlistAfterDeletion: boolean = await myWishlistPage.verifyExistanceOfProductInWishList(testDataRecord.ProductName);
                    if (isProductInWishlistAfterDeletion) {
                        throw new Error("Product " + testDataRecord.ProductName + " is still present in Wishlist after deletion.");
                    } else {
                        Log.info("Product " + testDataRecord.ProductName + " is successfully deleted from Wishlist.");
                    }
                    expect(isProductInWishlistAfterDeletion).toBeFalsy();
                });
                
                Log.testEnd(test.info().title);    
            });           
        }
   });
});