import { test as setup } from "../src/config/baseTest";
import LoginPage from "../src/pages/LoginPage";
import HomePage from "../src/pages/HomePage";
import CryptoEncryptDecrypt from "../src/utils/cryptoEncryptDecrypt";
import Log from "../src/config/logger";
import { STORAGE_STATE } from "../playwright.config";

setup('Authenticate User and Save Storage State', async ({ page }) => {
    const baseURL = process.env.Base_URL;
    const username = process.env.Default_Username;
    const password = process.env.Default_Password;
    const pageTitleMyAccountPage = process.env.PageTitleMyAccountPage;

    const cryptoEncryptDecrypt = new CryptoEncryptDecrypt(process.env.ENCRYPTION_KEY!);
    const decryptedPassword = cryptoEncryptDecrypt.decryptData(password!);

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    
    await setup.step('Navigate to Application URL', async () => {
        Log.info('Step 0: Navigate to Application URL');
        await page.goto(baseURL!);
    });

    await setup.step('Click on Login Link', async () => {
        Log.info('Step 1: Click on Login Link');
        await homePage.clickLoginLink();
    });

    await setup.step('Login to Application and verify login', async () => {
        Log.info('Step 2: Login to Application and verify login');
        Log.info('Performing Login Action');        
        await loginPage.performLogin(username!, decryptedPassword!);
        Log.info('Verify Login Success');
        await loginPage.verifyLoginSuccess(pageTitleMyAccountPage!);
    })

    await page.context().storageState({ path: STORAGE_STATE });
});

