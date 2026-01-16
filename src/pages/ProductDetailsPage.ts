import { expect, Page, Locator } from "@playwright/test";
import UIActions from "../utils/uiActions";
import Reporter from "../config/reporter";

class ProductDetailsPage {      
    
   private readonly productNameHeader: (ProductName: string)=>Locator;
   private readonly addToCartButton: Locator;
   private readonly addToWishlistLink: Locator
   private readonly removeFromWishlistLink: Locator;
   private readonly welcomeMessage: Locator;
   private readonly myWishlistLink: Locator;

   constructor(private page: Page) {
        this.page = page;       
        this.productNameHeader = (ProductName: string)=>{
            return page.locator("//span[contains(text(),'"+ProductName+"')]");
        }
        this.addToCartButton = page.getByText("Add to Cart");
        this.addToWishlistLink = page.locator("//a[contains(@class,'wishlist_add')]");
        this.removeFromWishlistLink = page.locator("//a[contains(@class,'wishlist_remove')]");
        this.welcomeMessage = page.locator("//div[contains(text(),'Welcome')]");
        this.myWishlistLink = page.locator("//li[@class='dropdown open']//child::a[contains(text(),'My wish list')]");
    }

   public async verifyProductHeading(ProductName: string) {
       const verifyHeader = await UIActions.verifyElementVisibility(this.productNameHeader(ProductName), "Product Name Header: "+ProductName);
       expect(verifyHeader).toBeTruthy();
    }  

    public async addProductToCart(){
           await UIActions.scrollToElement(this.addToCartButton, "Add To Cart Button");
           await UIActions.clickElement(this.addToCartButton, "Add To Cart Button");
    }  

    public async addProductToWishlist(){
           await UIActions.scrollToElement(this.addToWishlistLink, "Add To Wishlist Link");
           await UIActions.clickElement(this.addToWishlistLink, "Add To Wishlist Link");
    }  

    public async checkIfRemoveFromWishlistLinkIsVisible(): Promise<boolean> {
           await UIActions.scrollToElement(this.addToCartButton, "Add To Cart Button"); 
           const isProductAddedToWishlist = await UIActions.verifyElementVisibility(this.removeFromWishlistLink, "Remove From Wishlist Link");
           Reporter.attachScreenshotToReport(this.page, "RemoveFromWishlistLink","Remove From Wishlist Link Visibility");
           if(isProductAddedToWishlist){
               return true;
           } else{
               return false;
           }
    }

    public async goToWishListPage(){
           await UIActions.scrollToElement(this.welcomeMessage, "Welcome Message");
           await UIActions.hoverElement(this.welcomeMessage, "Welcome Message");
           await UIActions.clickElement(this.myWishlistLink, "My Wishlist Link");          
    }
}

export default ProductDetailsPage;