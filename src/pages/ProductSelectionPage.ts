import { Page, Locator, expect } from "@playwright/test";
import UIActions from "../utils/uiActions";
import Reporter from "../config/reporter";

class ProductSelectionPage {      
    
   private readonly productSubCategoryHeading: (productSubCategoryName: string) => Locator;
   private readonly productLink: (productName: string) => Locator;
   
   
   constructor(private page: Page) {
        this.page = page;       
        this.productSubCategoryHeading = (productSubCategoryName: string) => {
            return page.locator("//span[contains(text(),'"+productSubCategoryName+"')]");
        }      
        this.productLink = (productName: string) => {
            return page.locator("//div[contains(@class,'list-inline')]//child::a[contains(text(),'"+productName+"')]");
        }
    }

   public async verifyProductSubCategoryHeading(productSubCategoryName: string) {
       const productSubCategoryHeading = await UIActions.verifyElementVisibility(this.productSubCategoryHeading(productSubCategoryName), "Product Sub Category Heading: "+productSubCategoryName);       
       await Reporter.attachScreenshotToReport(this.page, "ProductSubCategoryHeading","Product Sub Category Heading");
       expect(productSubCategoryHeading).toBeTruthy();
    }

   public async selectProduct(productName: string) {       
       await UIActions.scrollToElement(this.productLink(productName), "Product Link: "+productName);   
       await UIActions.clickElement(this.productLink(productName), "Product Link: "+productName);
   }   
}

export default ProductSelectionPage;