import { test } from "../src/config/baseTest";
import { expect } from "@playwright/test";
import MyAccountPage from "../src/pages/MyAccountPage";
import ShoppingCartPage from "../src/pages/ShoppingCartPage";
import CheckoutConfirmationPage from "../src/pages/checkoutConfirmationPage";
import Log from "../src/config/logger";

const baseURL = process.env.Base_URL;

test.beforeEach(async ({ page }) => {
    await page.goto(baseURL!);
});

test('Verify Shopping Cart Checkout Functionality', async ({ page }) => {
    const myAccountPage = new MyAccountPage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    const checkoutConfirmationPage = new CheckoutConfirmationPage(page);

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
            throw new Error("No product is present in Shopping Cart to proceed with Checkout.");
        } else {
            Log.info("Product(s) present in Shopping Cart to proceed with Checkout.");
        }
        await shoppingCartPage.viewProductNamesInShoppingCart();
    });

    await test.step('Proceed to Checkout Process', async () => {
        Log.info('Step 3: Proceed to Checkout Process');
        await shoppingCartPage.proceedToCheckout();

    });

    await test.step('Verify Checkout Confirmation Page details', async () => {
        Log.info('Step 4: Verify Checkout Confirmation Page details');
        Log.info('Verify Checkout Confirmation Page Heading');
        await checkoutConfirmationPage.verifyCheckoutConfirmationPageHeading();
        Log.info('Calculate Product Total Amount on Checkout Confirmation Page');
        const calculatedTotalAmount = await checkoutConfirmationPage.calculateShoppingCartTotalAmount();
        Log.info("Calculated Total Amount on Checkout Confirmation Page: " + calculatedTotalAmount);
        const shippingRate = 2.00;
        Log.info("Shipping Rate: " + shippingRate);
        const expectedTotalAmount = calculatedTotalAmount + shippingRate;
        const displayedTotalAmount: number = await checkoutConfirmationPage.getShoppingCartTotalAmountOnCheckoutConfirmationPage();

        Log.info("Displayed Total Amount in Shopping Cart: " + displayedTotalAmount);
        Log.info("Expected Total Amount (Calculated + Shipping): " + expectedTotalAmount);

        if (displayedTotalAmount !== expectedTotalAmount) {
            throw new Error(`Total Amount Mismatch: Expected ${expectedTotalAmount}, but got ${displayedTotalAmount}`);
        } else {
            Log.info("Total Amount matches the expected value.");
        }
        expect(displayedTotalAmount == expectedTotalAmount).toBeTruthy();
    });

    await test.step('Confirm the Order and Verify Order Success', async () => {
        Log.info('Step 5: Confirm the Order and Verify Order Success');

        Log.info('Click Confirm Order Button');
        await checkoutConfirmationPage.clickConfirmOrderButton();
        Log.info('Verify Order Success Message on My Account Page');
        const isOrderSuccess: boolean = await myAccountPage.verifyOrderSuccessMessage();
        if (!isOrderSuccess) {
            throw new Error("Unable to process the order.");
        } else {
            Log.info("Order processed successfully.");
        }
    });

    Log.testEnd(test.info().title);


});