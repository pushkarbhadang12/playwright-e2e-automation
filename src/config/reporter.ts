import { test } from "./baseTest";

export default class Reporter {

    public static async attachTextToReport(description: string){
        test.info().attach(description);        
    }

    public static async attachScreenshotToReport(page: any, screenshotName: any, screenshotDetails: string){
        screenshotName = await page.screenshot({ fullPage: true });
        test.info().attach(screenshotDetails, {body: screenshotName, contentType: 'image/png'})
    }  
}