import { Page, Locator, expect } from "@playwright/test";
import UIActions from "../utils/uiActions";
import Log from '../config/logger';
import Reporter from "../config/reporter";

class ShoppingCartPage {      
    
   private readonly shoppingCartHeading: Locator; 
   private readonly productInShoppingCart: (ProductName: string) => Locator;  
   private readonly continueShoppingButton: Locator;
   private readonly deleteButton: (ProductName: string) => Locator;
   private readonly productRows: Locator;  
   private readonly productNameInCart: Locator;
   private readonly productTotalAmount: Locator;
   private readonly finalAmount: Locator;
   private readonly checkoutButton: Locator;
   
   constructor(private page: Page) {
        this.page = page;       
        this.shoppingCartHeading = page.getByText("Shopping Cart");        
        this.productInShoppingCart = (ProductName: string) => {
          return page.locator("//form[@id='cart']//child::a[contains(text(),'"+ProductName+"')]");
        }        
        this.continueShoppingButton = page.locator("//table[@id='totals_table']//following::a[@title='']");
        this.deleteButton = (ProductName: string) => {
          return page.locator("//tr[.//a[contains(text(),'"+ProductName+"')]]//td//a[contains(@href,'cart&remove')]");
        }
        this.productRows = page.locator("//a[contains(@href,'cart&remove')]");
        this.productNameInCart = page.locator("//*[@id='cart']/div/div[1]/table/tbody/tr/td[2]/a");
        this.productTotalAmount = page.locator("//*[@id='cart']/div/div[1]/table/tbody/tr/td[6]");
        this.finalAmount = page.locator("//span[@class='bold totalamout']");
        this.checkoutButton = page.locator("#cart_checkout2");
      }

   public async verifyShoppingCartPageHeading() {
       await UIActions.verifyElementVisibility(this.shoppingCartHeading, "Shopping Cart Heading");
   }

   public async verifyProductExistanceInShoppingCart(ProductName: string): Promise<Boolean> {
       const IsProductAvailableInCart:Boolean = await UIActions.verifyElementVisibility(this.productInShoppingCart(ProductName), "Product Name in Shopping Cart");
       if(!IsProductAvailableInCart){
          Log.error("Product "+ ProductName + "is not available in Shopping Cart");
       } else{
          Log.info("Product " + ProductName + " is available in Shopping Cart");
       }
       return IsProductAvailableInCart;
    }

   public async clickOnContinueShopping() {
       await UIActions.scrollToElement(this.continueShoppingButton, "Continue Shopping");       
       await Reporter.attachScreenshotToReport(this.page, "ShoppingCartListView","Shopping Cart List View");
       await UIActions.clickElement(this.continueShoppingButton, "Continue Shopping");
   }
   
   public async deleteProductFromShoppingCart(ProductName: string) {
       await UIActions.verifyElementVisibility(this.productInShoppingCart(ProductName), "Product Name in Shopping Cart before Deletion");
       await UIActions.scrollToElement(this.deleteButton(ProductName), "Delete Button for Product: "+ProductName);
       await UIActions.clickElement(this.deleteButton(ProductName), "Delete Button for Product: "+ProductName);
       await this.page.waitForTimeout(5000);      
       await Reporter.attachScreenshotToReport(this.page, "ShoppingCartAfterDeletion","Shopping Cart After Deletion of Product: "+ProductName);
   }

   public async verifyExistanceOfProductsInShoppingCart(): Promise<boolean> {
       const productRowsCount = this.productRows;
       const rowCount = await productRowsCount.count();       
       if (rowCount >= 2) {           
           return true;                    
       } else {           
           return false;  
      }
      expect(rowCount).toBeGreaterThanOrEqual(2);
   }

   public async viewProductNamesInShoppingCart() {             
       const productNamesInCart = this.productNameInCart;
       const productCount = await productNamesInCart.count();
       await Reporter.attachScreenshotToReport(this.page,"ProductsInShoppingCart","Products In Shopping Cart");
       Log.info("Products in Shopping Cart:");
       for (let i = 0; i < productCount; i++) {
           Log.info(await productNamesInCart.nth(i).innerText() + "\n");
       }       
   }

   public async calculateShoppingCartTotalAmount(): Promise<number> {
       // Implementation for calculating total amount can be added here
       const productTotalAmount = this.productTotalAmount;
       const productCount = await productTotalAmount.count();
       let totalAmount = 0;
       for (let i = 0; i < productCount; i++) {
           const amountText = await productTotalAmount.nth(i).innerText();
           const amountValue = parseFloat(amountText.replace(/[^0-9.]/g, ''));
           totalAmount += amountValue;
       }
       return totalAmount;
   }

   public async getShoppingCartTotalAmount(): Promise<number> {
      await UIActions.scrollToElement(this.finalAmount, "Final Amount in Shopping Cart");
      Reporter.attachScreenshotToReport(this.page, "ShoppingCartTotalAmount","Shopping Cart Total Amount");
      const finalAmountText = await this.finalAmount.innerText();
      const finalAmountValue = parseFloat(finalAmountText.replace(/[^0-9.]/g, ''));
      return finalAmountValue;
   }

   public async proceedToCheckout() {      
       await UIActions.scrollToElement(this.checkoutButton, "Checkout Button in Shopping Cart");
       await Reporter.attachScreenshotToReport(this.page, "ShoppingCartBeforeCheckout","Shopping Cart Before Proceeding to Checkout");
       await UIActions.clickElement(this.checkoutButton, "Checkout Button in Shopping Cart");  
   }
}

export default ShoppingCartPage;