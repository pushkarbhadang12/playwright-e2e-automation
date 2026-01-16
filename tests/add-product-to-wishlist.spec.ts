import { test } from "../src/config/baseTest";
import { expect } from "@playwright/test";
import MyAccountPage from "../src/pages/MyAccountPage";
import ProductSelectionPage from "../src/pages/ProductSelectionPage";
import ProductDetailsPage from "../src/pages/ProductDetailsPage";
import MyWishlistPage from "../src/pages/MyWishlistPage";
import Log from "../src/config/logger";
import { readExcelFile } from "../src/utils/excelDataProvider";

const baseURL = process.env.Base_URL;

const testDataRecords = readExcelFile('test-data-automation-test-store.xlsx', 'AddProductWishlist');

test.beforeEach(async ({ page }) => {
    await page.goto(baseURL!);
});

test.describe('Add Product to Wishlist from Excel Data', () => {
    testDataRecords.forEach((testDataRecord) => {
        if (testDataRecord.ExecutionFlag == "Yes") {
            test(testDataRecord.TestCaseId + ': ' + testDataRecord.TestCaseName, async ({ page }) => {

                const myAccountPage = new MyAccountPage(page);
                const productSelectionPage = new ProductSelectionPage(page);
                const productDetailsPage = new ProductDetailsPage(page);
                //const shoppingCartPage = new ShoppingCartPage(page);
                const myWishlistPage = new MyWishlistPage(page);

                Log.testBegin(test.info().title);
                await test.step('Verify if application is logged in', async () => {
                    Log.info('Step 1: Verify if application is logged in');
                    await myAccountPage.verifyIfApplicationIsLoggedIn();
                });

                await test.step('Select Product Category and Sub Category', async () => {
                    Log.info('Step 2: Select Product Category and Sub Category');
                    await myAccountPage.hoverOnProductCategory(testDataRecord.ProductCategoryName);
                    await myAccountPage.selectProductSubCategory(testDataRecord.ProductSubCategoryName);
                });

                await test.step('Select Product to Add to Wishlist', async () => {
                    Log.info('Step 3: Select Product to Add to Wishlist');
                    Log.info('Verify Product Sub Category Heading');
                    await productSelectionPage.verifyProductSubCategoryHeading(testDataRecord.ProductSubCategoryName);
                    Log.info('Select Product');
                    await productSelectionPage.selectProduct(testDataRecord.ProductName);
                });

                await test.step('Check Product is not already in Wishlist', async () => {
                    Log.info('Step 4: Check Product is not already in Wishlist');                    
                    Log.info('Check if Remove from Wishlist link is already visible');
                    const isRemoveFromWishlistLinkVisibleBeforeAdd: boolean = await productDetailsPage.checkIfRemoveFromWishlistLinkIsVisible();    
                    if (isRemoveFromWishlistLinkVisibleBeforeAdd){                       
                        Log.testEnd("Skipping test as Product " + testDataRecord.ProductName + " is already present in Wishlist before addition.");
                        test.skip();
                    } else {
                        Log.info("Product " + testDataRecord.ProductName + " is not present in Wishlist before addition.");
                    }   
                });             

                await test.step('Add selected Product to Wishlist', async () => {
                    Log.info('Step 5: Add selected Product to Wishlist');
                    Log.info('Verify Product Name in Header');
                    await productDetailsPage.verifyProductHeading(testDataRecord.ProductName);
                    Log.info('Add Product to Wishlist');
                    await productDetailsPage.addProductToWishlist();
                });

                await test.step('Verify If Remove from Wishlist link is visible after adding product to wish list', async () => {
                    Log.info('Step 6:Verify If Remove from Wishlist link is visible after adding product to wish list');
                    const isRemoveFromWishlistLinkVisible: boolean = await productDetailsPage.checkIfRemoveFromWishlistLinkIsVisible();
                    if (isRemoveFromWishlistLinkVisible){
                        Log.info("Remove from Wishlist link is visible");
                    } else {
                        throw new Error("Remove from Wishlist link is not visible");
                    }
                });
                
                await test.step('Move to Wishlist and verify page heading', async () => {
                    Log.info('Step 7: Move to Wishlist');
                    await productDetailsPage.goToWishListPage();
                    Log.info('Verify My Wishlist Page Heading');
                    const isMyWishlistPageHeadingCorrect: boolean = await myWishlistPage.verifyPageHeading("My wish list");
                });

                await test.step('Verify Product is added to Wishlist', async () => {
                    Log.info('Step 8: Verify Product is added to Wishlist');
                    const isProductInWishlist: boolean = await myWishlistPage.verifyExistanceOfProductInWishList(testDataRecord.ProductName);   
                    if (!isProductInWishlist) {
                        throw new Error("Product " + testDataRecord.ProductName + " is not present in Wishlist after addition.");
                    } else {
                        Log.info("Product " + testDataRecord.ProductName + " is present in Wishlist after addition.");
                    } 
                    expect(isProductInWishlist).toBeTruthy();
                });  

                Log.testEnd(test.info().title);

            });
        }
    });
});

