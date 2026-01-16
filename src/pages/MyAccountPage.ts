import { expect, Page, Locator } from "@playwright/test";
import UIActions from "../utils/uiActions";
import Log from '../config/logger';
import Reporter from "../config/reporter";

class MyAccountPage {

    private readonly productCategoryLink: (productCategoryName: string) => Locator;
    private readonly productSubCategoryLink: (productSubCategoryName: string) => Locator;
    private readonly itemsLink: Locator;
    private readonly itemsCount: Locator;
    private readonly homeLink: Locator;
    private readonly accountLink: Locator;
    private readonly logoutLink: Locator;
    private readonly welcomeMessage: Locator;
    private readonly orderSuccessMessage: Locator;
    private readonly myWishlistLink: Locator;
    
    constructor(private page: Page) {
        this.page = page;
        this.productCategoryLink = (productCategoryName: string) => {
            return this.page.locator('#categorymenu').getByRole('link', { name: productCategoryName });
        }
        this.productSubCategoryLink = (productSubCategoryName: string) => {
            return this.page.locator('#categorymenu').getByRole('link', { name: productSubCategoryName });
        }
        this.itemsLink = page.locator("//span[@class='cart_total']");
        this.itemsCount = page.locator("//span[@class='cart_total']//preceding-sibling::span");
        this.homeLink = page.locator("//section[@id='categorymenu']//child::a[contains(text(),'Home')]");
        this.accountLink = page.locator("//ul[@id='main_menu']//child::span[contains(text(),'Account')]");
        this.logoutLink = page.locator("//ul[@id='main_menu']//following::span[contains(text(),'Logout')]");
        this.welcomeMessage = page.locator("//div[contains(text(),'Welcome')]");
        this.orderSuccessMessage = page.locator("//h1[@class='heading1']//child::span[contains(text(),'Your Order Has Been Processed')]");
        this.welcomeMessage = page.locator("//div[contains(text(),'Welcome')]");
        this.myWishlistLink = page.locator("//li[@class='dropdown open']//child::a[contains(text(),'My wish list')]");
    }

    public async hoverOnProductCategory(productCategoryName: string) {
        await UIActions.hoverElement(this.productCategoryLink(productCategoryName), "Product Category Link");
    }

    public async selectProductSubCategory(productSubCategoryName: string) {
        await UIActions.clickElement(this.productSubCategoryLink(productSubCategoryName), "Product Sub Category Link");
    }

    public async viewCartItemsCountAndPrice() {
        await UIActions.hoverElement(this.itemsLink, "Items Link");        
        await Reporter.attachScreenshotToReport(this.page, "CartItemsCountAndPrice","Cart Items Count and Price Details");
        const itemCount = await this.itemsCount.textContent();
        Log.info("Items Count:" + itemCount);
        expect(itemCount).not.toBe("$0.00");

        const itemsTotal = await this.itemsLink.textContent();
        Log.info("Items Total:" + itemsTotal);
        expect(itemsTotal).not.toBe("0");
    }

    public async logOutFromApplication() {
        await UIActions.hoverElement(this.homeLink, "Home Link");
        await UIActions.hoverElement(this.accountLink, "Account Link");
        await UIActions.clickElement(this.logoutLink, "Logout Link");
    }

    public async verifyIfApplicationIsLoggedIn() {
        const loginCheck = await UIActions.verifyElementVisibility(this.welcomeMessage, "Welcome Message");
        if (!loginCheck) {
            Log.error("Login was not successful, cannot proceed with further Test");
        }
        else {
            Log.info("Login is successful, proceeding with further Test");
        }
        expect(loginCheck).toBeTruthy();
    }

    public async clickOnShoppingCartLink() {
        await UIActions.clickElement(this.itemsLink, "Items Link");
    }

    public async verifyOrderSuccessMessage() {
        const isOrderSuccessMessageVisible = await UIActions.verifyElementVisibility(this.orderSuccessMessage, "Order Success Message");    
        if (!isOrderSuccessMessageVisible) {            
            return false;
        } else {            
            return true;
        }
        expect(isOrderSuccessMessageVisible).toBeTruthy();
    }

    public async goToWishListPage(){
        await UIActions.scrollToElement(this.welcomeMessage, "Welcome Message");
        await UIActions.hoverElement(this.welcomeMessage, "Welcome Message");
        await UIActions.clickElement(this.myWishlistLink, "My Wishlist Link");          
    }
}

export default MyAccountPage;