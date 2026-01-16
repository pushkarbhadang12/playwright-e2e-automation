import { Page, Locator } from "@playwright/test";
import UIActions from "../utils/uiActions";
import Reporter from "../config/reporter";

class MyWishlistPage {      
    
   private readonly pageHeading: Locator;
   private readonly productInWishlist: (productName: string) => Locator; 
   private readonly deleteButton: (productName: string) => Locator;
   
   constructor(private page: Page) {
        this.page = page;        ""
        this.pageHeading = page.locator("//span[@class='maintext']");
        this.productInWishlist = (productName: string) => {
          return page.locator("//div[@id='maincontainer']//child::a[contains(text(),'"+productName+"')]");
        } 
        this.deleteButton = (productName: string) => {
          return page.locator("//tr[.//a[contains(text(),'"+productName+"')]]//following-sibling::td//a[contains(@class,'btn-remove')]");
        }
   }

   public async verifyPageHeading(expectedHeading: string): Promise<boolean> {
       const pageHeadingText = await UIActions.getElementText(this.pageHeading, "My Wishlist Page Heading");
       console.log("Page Heading Text: " + pageHeadingText);
       if(pageHeadingText.includes(expectedHeading)){
              return true;
       } else{
              return false;
       }
    }

    public async verifyExistanceOfProductInWishList(productName: string): Promise<boolean> {
        const isProductAvailableInWishlist = await UIActions.verifyElementVisibility(this.productInWishlist(productName), "Product in Wishlist");
        Reporter.attachScreenshotToReport(this.page, "MyWishlistPage","My Wishlist Page");
        if(isProductAvailableInWishlist){
            return true;
        } else {
            return false;
        }        
   }

    public async deleteProductFromWishlist(productName: string) {        
        await UIActions.scrollToElement(this.deleteButton(productName), "Delete Button for Product: "+productName);
        await UIActions.clickElement(this.deleteButton(productName), "Delete Button for Product: "+productName);    
        await UIActions.waitForElementToBeInvisible(this.productInWishlist(productName), "Product in Wishlist after Deletion");
        await Reporter.attachScreenshotToReport(this.page, "MyWishlistPage","My Wishlist Page after Deletion");
    }
}

export default MyWishlistPage;