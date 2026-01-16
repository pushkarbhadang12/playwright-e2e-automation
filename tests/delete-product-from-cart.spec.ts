import { expect } from "@playwright/test";
import { test } from "../src/config/baseTest";
import MyAccountPage from "../src/pages/MyAccountPage";
import ShoppingCartPage from "../src/pages/ShoppingCartPage";
import Log from "../src/config/logger";
import {readExcelFile} from "../src/utils/excelDataProvider";

const baseURL = process.env.Base_URL; 

const testDataRecords = readExcelFile('test-data-automation-test-store.xlsx','DeleteProductFromShoppingCart');

test.beforeEach(async ({ page }) => {
    await page.goto(baseURL!);
});

test.describe('Delete Product from Shopping Cart from Excel Data', () => {
    testDataRecords.forEach((testDataRecord) => {
        if(testDataRecord.ExecutionFlag == "Yes"){
            test(testDataRecord.TestCaseId + ': ' + testDataRecord.TestCaseName, async ({page}) => {    

                const myAccountPage = new MyAccountPage(page);   
                // const productSelectionPage = new ProductSelectionPage(page);
                // const productDetailsPage = new ProductDetailsPage(page);
                const shoppingCartPage = new ShoppingCartPage(page);               
                
                Log.testBegin(test.info().title);
                await test.step('Verify if application is logged in', async () => {
                    Log.info('Step 1: Verify if application is logged in');        
                    await myAccountPage.verifyIfApplicationIsLoggedIn();                    
                });

                await test.step('View Shopping Cart before Deletion', async () => {
                    Log.info('Step 2: View Shopping Cart before Deletion');        
                    await myAccountPage.clickOnShoppingCartLink();                    
                    await shoppingCartPage.verifyShoppingCartPageHeading();
                    const isProductInCart: Boolean = await shoppingCartPage.verifyProductExistanceInShoppingCart(testDataRecord.ProductName);                    
                    if (!isProductInCart) {
                        Log.info("Product " + testDataRecord.ProductName + " is not present in Shopping Cart to delete.");
                        Log.info("Skipping test as Product " + testDataRecord.ProductName + " is not present in Shopping Cart to delete.");
                        test.skip();
                    } else {
                        Log.info("Product " + testDataRecord.ProductName + " is present in Shopping Cart before deletion.");
                    }
                    expect(isProductInCart).toBeTruthy();
                }); 
                
                await test.step('Delete Product from Shopping Cart', async () => {
                    Log.info('Step 3: Delete Product from Shopping Cart');        
                    await shoppingCartPage.deleteProductFromShoppingCart(testDataRecord.ProductName);                    
                    
                });
                
                await test.step('Verify Product is deleted from Shopping Cart', async () => {
                    Log.info('Step 4: Verify Product is deleted from Shopping Cart');  
                    const isProductInCartAfterDeletion: any = await shoppingCartPage.verifyProductExistanceInShoppingCart(testDataRecord.ProductName);
                    if (isProductInCartAfterDeletion) {
                        throw new Error("Product " + testDataRecord.ProductName + " is still present in Shopping Cart after deletion.");
                    } else {
                        Log.info("Product " + testDataRecord.ProductName + " is successfully deleted from Shopping Cart.");
                    }
                    expect(isProductInCartAfterDeletion).toBeFalsy();
                });                
                
                Log.testEnd(test.info().title);    
            });           
        }
   });
});