import { Page, Locator } from "@playwright/test";
import UIActions from "../utils/uiActions";

class HomePage {      
    
   private readonly LoginLink: Locator;
   
   constructor(private page: Page) {
        this.page = page;        
        this.LoginLink = page.getByRole('link', { name: 'Login or register' });
   }

   public async clickLoginLink() {
       await UIActions.clickElement(this.LoginLink, "Login Link");
   }
   
}

export default HomePage;