import { test as teardown } from "../src/config/baseTest";
import Log from "../src/config/logger";
import LoginPage from "../src/pages/loginPage";
import MyAccountPage from "../src/pages/MyAccountPage";

teardown('Global Teardown after all tests', async ({ page }) => {
    const myAccountPage = new MyAccountPage(page);   
    const loginPage = new LoginPage(page);

    await page.goto(process.env.Base_URL!);
    Log.info('Performing Logout Action');
    await myAccountPage.logOutFromApplication();
    Log.info('Verify Logout Success');
    await loginPage.verifyLogoutSuccess();

    page.close();    
});