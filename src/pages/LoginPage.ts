import { expect, Page, Locator } from "@playwright/test";
import Log from '../config/logger';
import UIActions from "../utils/uiActions";
import Reporter from "../config/reporter";

class LoginPage {

     private readonly userNameTextBox: Locator;
     private readonly passwordTextBox: Locator;
     private readonly loginButton: Locator;
     private readonly errorMessage: Locator;
     private readonly logoutLabel: Locator;

     constructor(private page: Page) {
          this.page = page;
          this.userNameTextBox = page.locator('#loginFrm_loginname');
          this.passwordTextBox = page.locator('input[type=password]');         
          this.loginButton = page.getByTitle('Login');
          this.errorMessage = page.getByText('Incorrect login or password');
          this.logoutLabel = page.locator("//div[@id='maincontainer']//child::span[contains(text(),'Account Logout')]");
     }

     public async performLogin(username: string, password: string) {
          await UIActions.fillElement(this.userNameTextBox, username, "User Name Text Box");
          await UIActions.fillElementWithSensitiveData(this.passwordTextBox, password, "Password Text Box");          
          await Reporter.attachScreenshotToReport(this.page, "LoginDetailsCapture","Login Details Capture");
          await UIActions.clickElement(this.loginButton, "Login Button");
     }

     public async verifyLoginSuccess(pageTitle: string) {
          const pageTitleCheck = await UIActions.verifyPageTitle(pageTitle, this.page, "My Account Page");

          if (!pageTitleCheck) {
               Log.error("Login Failed - Page title does not match");
               Log.error(`Received error on Login` + await this.errorMessage.textContent()!);
          }
          else
               Log.info("Login Successful - Page title matches");

          expect(pageTitleCheck).toBeTruthy();
     }

     public async verifyLogoutSuccess() {
          const isLogoutSuccessful: Boolean = await UIActions.verifyElementVisibility(this.logoutLabel, "Account Logout Label");
                  
          if (isLogoutSuccessful) {
               Log.info("Logout Successful");
          }
          else {
               Log.error("Unable to perform Logout");
          }
          expect(isLogoutSuccessful).toBeTruthy();
     }
}

export default LoginPage;