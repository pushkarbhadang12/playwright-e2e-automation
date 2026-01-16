import { test } from "../src/config/baseTest";
import MyAccountPage from "../src/pages/MyAccountPage";
import ProductSelectionPage from "../src/pages/ProductSelectionPage";
import ProductDetailsPage from "../src/pages/ProductDetailsPage";
import ShoppingCartPage from "../src/pages/ShoppingCartPage";
import Log from "../src/config/logger";
import { readExcelFile } from "../src/utils/excelDataProvider";
import { expect } from "@playwright/test";

const baseURL = process.env.Base_URL;

const testDataRecords = readExcelFile('test-data-automation-test-store.xlsx', 'AddProductShoppingCart');

test.beforeEach(async ({ page }) => {
    await page.goto(baseURL!);
});

test.describe('Add Product to Shopping Cart from Excel Data', () => {
    testDataRecords.forEach((testDataRecord) => {
        if (testDataRecord.ExecutionFlag == "Yes") {
            test(testDataRecord.TestCaseId + ': ' + testDataRecord.TestCaseName, async ({ page }) => {

                const myAccountPage = new MyAccountPage(page);
                const productSelectionPage = new ProductSelectionPage(page);
                const productDetailsPage = new ProductDetailsPage(page);
                const shoppingCartPage = new ShoppingCartPage(page);

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

                await test.step('Select Product to Add to Cart', async () => {
                    Log.info('Step 3: Select Product to Add to Cart');
                    Log.info('Verify Product Sub Category Heading');
                    await productSelectionPage.verifyProductSubCategoryHeading(testDataRecord.ProductSubCategoryName);
                    Log.info('Select Product');
                    await productSelectionPage.selectProduct(testDataRecord.ProductName);
                });

                await test.step('Add selected Product in Shopping Cart', async () => {
                    Log.info('Step 4: Add selected Product in Shopping Cart');
                    Log.info('Verify Product Name in Header');
                    await productDetailsPage.verifyProductHeading(testDataRecord.ProductName);
                    Log.info('Add Product to Shopping Cart');
                    await productDetailsPage.addProductToCart();
                });

                await test.step('Verify If Product is added in Shopping Cart', async () => {
                    Log.info('Step 5: Verify If Product is added in Shopping Cart');
                    Log.info('Verify Shopping Cart Page Heading');
                    await shoppingCartPage.verifyShoppingCartPageHeading();
                    Log.info('Verify Product in Shopping Cart');
                    const isProductInCart: Boolean = await shoppingCartPage.verifyProductExistanceInShoppingCart(testDataRecord.ProductName);
                    if (!isProductInCart) {
                        throw new Error("Product " + testDataRecord.ProductName + " is not present in Shopping Cart after addition.");
                    } else {
                        Log.info("Product " + testDataRecord.ProductName + " is present in Shopping Cart after addition.");
                    }
                    expect(isProductInCart).toBeTruthy();
                    Log.info('Click to Continue Shopping');
                    await shoppingCartPage.clickOnContinueShopping();
                });

                await test.step('View Shopping Cart Item Count and Price on My Account Page', async () => {
                    Log.info('Step 6: View Shopping Cart Item Count and Price on My Account Page');
                    await myAccountPage.viewCartItemsCountAndPrice();
                });

                Log.testEnd(test.info().title);

            });
        }
    });
});

test('Verify Shopping Cart Total Amount', async ({ page }) => {
    const myAccountPage = new MyAccountPage(page);    
    const shoppingCartPage = new ShoppingCartPage(page);

    Log.testBegin(test.info().title);
    await test.step('Verify if application is logged in', async () => {
        Log.info('Step 1: Verify if application is logged in');
        await myAccountPage.verifyIfApplicationIsLoggedIn();
    });

    await test.step('View Shopping Cart', async () => {
        Log.info('Step 2: View Shopping Cart');
        await myAccountPage.clickOnShoppingCartLink();
        await shoppingCartPage.verifyShoppingCartPageHeading();
        const isProductInCart: boolean = await shoppingCartPage.verifyExistanceOfProductsInShoppingCart();
        if (!isProductInCart) {
            throw new Error("No product is present in Shopping Cart to verify total amount.");
        } else {
            Log.info("Product(s) present in Shopping Cart to verify total amount.");
        }

        await shoppingCartPage.viewProductNamesInShoppingCart();
    });

    await test.step('Calculate Shopping Cart Total Amount', async () => {
        Log.info('Step 3: Calculate Shopping Cart Total Amount');
        const calculatedTotalAmount: number =  await shoppingCartPage.calculateShoppingCartTotalAmount();
        Log.info("Calculated Total Amount from Shopping Cart Products: " + calculatedTotalAmount);
        const flatShippingRate = 2.00; 
        const expectedTotalAmount = calculatedTotalAmount + flatShippingRate;
        const displayedTotalAmount: number = await shoppingCartPage.getShoppingCartTotalAmount();
       
        Log.info("Displayed Total Amount in Shopping Cart: " + displayedTotalAmount);
        Log.info("Expected Total Amount (Calculated + Shipping): " + expectedTotalAmount);

        if(displayedTotalAmount !== expectedTotalAmount){
            throw new Error(`Total Amount Mismatch: Expected ${expectedTotalAmount}, but got ${displayedTotalAmount}`);
        } else {
            Log.info("Total Amount matches the expected value.");
        }
        expect(displayedTotalAmount == expectedTotalAmount).toBeTruthy();
    });
    Log.testEnd(test.info().title);

});