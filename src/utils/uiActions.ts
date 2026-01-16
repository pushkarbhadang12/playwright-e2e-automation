import { Locator, expect, Page } from "@playwright/test";
import Log from '../config/logger';
import Reporter from "../config/reporter";
import CommonConstants from "../constants/commonConstants";

export default class UIActions {

    /**
     * Navigates to a specified URL in the provided page context.
     * @param url - The URL to navigate to.
     * @param page - The page object used to perform the navigation.
     * @param description - A description of the navigation action (currently unused).
     * @throws {Error} Throws an error if navigation fails.
     * @returns {Promise<void>}
     */
    public static async navigateToUrl(url: string, page: any, description: string) {
        try {
            await page.goto(url);
            Log.info(`Navigated to URL: ${url} successfully.`);
        } catch (error) {
            Log.error(`Error navigating to URL ${url}: ${error}`);
            throw error;
        }
    }

    /**
     * Clicks on an element identified by the provided locator.
     * @param locator - The Locator object representing the element to click
     * @param description - A descriptive name of the element being clicked, used for logging purposes
     * @throws {Error} Throws an error if the click action fails
     * @returns {Promise<void>} A promise that resolves when the click action completes successfully
     */
    public static async clickElement(locator: Locator, description: string) {
        try {
            await locator.click();
            Log.info(`Clicked on ${description} successfully.`);
        } catch (error) {
            Log.error(`Error clicking on ${description}: ${error}`);
            throw error;
        }
    }

    /**
     * Fills an input element with the specified value.
     * @param locator - The Locator object pointing to the input element to fill.
     * @param value - The text value to fill into the element.
     * @param description - A descriptive name of the element being filled, used for logging purposes.
     * @throws {Error} Throws an error if the fill operation fails.
     * @returns {Promise<void>} A promise that resolves when the element has been filled successfully.
     */
    public static async fillElement(locator: Locator, value: string, description: string) {
        try {
            await locator.fill(value);
            Log.info(`Filled ${description} with value: ${value} successfully.`);
        } catch (error) {
            Log.error(`Error filling ${description} with value ${value}: ${error}`);
            throw error;
        }
    }

    /**
     * Fills a locator with a sensitive value and logs the action with masked data.
     * @param locator - The Playwright Locator element to fill
     * @param value - The sensitive value to fill into the locator
     * @param description - A description of the element being filled, used in logging
     * @throws {Error} Throws an error if the fill operation fails
     */
    public static async fillElementWithSensitiveData(locator: Locator, value: string, description: string) {
        try {
            await locator.fill(value);
            const maskedValue = await UIActions.maskSensitiveData(value);
            Reporter.attachTextToReport(`Filled ${description} with value: ${maskedValue}`);
            Log.info(`Filled ${description} with value: ${maskedValue} successfully.`);
        } catch (error) {
            Log.error(`Error filling ${description} with value: ${error}`);
            throw error;
        }
    }

    /**
     * Masks sensitive data by replacing it with a repeated mask character.
     * @param password - The sensitive string to be masked.
     * @param maskChar - The character to use for masking. Defaults to '*'.
     * @returns A promise that resolves to a string where all characters are replaced with the mask character.
     * @example
     * const masked = await maskSensitiveData('myPassword123');
     * // Returns: '***************'
     */
    public static async maskSensitiveData(password: string, maskChar: string = '*'): Promise<string> {
        return maskChar.repeat(password.length);
    }

    /**
     * Verifies that the current page title matches the expected title.
     * @param expectedTitle - The expected page title to verify against
     * @param page - The page object from Playwright
     * @returns A promise that resolves when the verification is complete
     * @remarks Logs the page title and verification result. Logs an error if the actual title does not match the expected title.
     */
    public static async verifyPageTitle(expectedTitle: string, page: any, description: string): Promise<boolean> {
        const pageTitle = (await page.title());
        Log.info("Checking page title");
        Log.info("Page title is " + pageTitle);
        if (pageTitle === expectedTitle) {
            Log.info("Page Title Verification Passed");
            return true;
        } else {
            Log.error(`Page Title Verification Failed. Expected: ${expectedTitle}, Actual: ${pageTitle}`);
            return false;
        }
    }

    /**
     * Hovers over the specified element.
     * @param locator - The locator of the element to hover over.
     * @param description - A description of the element being hovered on, used for logging purposes.
     * @throws {Error} Throws an error if the hover action fails.
     * @returns {Promise<void>}
     */
    public static async hoverElement(locator: Locator, description: string) {
        try {
            await locator.hover();
            Log.info(`Hovered on ${description} successfully.`);
        } catch (error) {
            Log.error(`Error hovering on ${description}: ${error}`);
            throw error;
        }
    }

    /**
     * Scrolls to a specific element on the page if it is not already visible.
     * @param locator - The Locator object representing the element to scroll to
     * @param description - A description of the element being scrolled to, used for logging purposes
     * @throws {Error} Throws an error if the scroll action fails
     * @returns {Promise<void>}
     */
    public static async scrollToElement(locator: Locator, description: string): Promise<void> {
        try {
            await locator.scrollIntoViewIfNeeded();
            Log.info(`Scrolled to ${description} successfully.`);
        } catch (error) {
            Log.error(`Error scrolling to ${description}: ${error}`);
            throw error;
        }
    }

    /**
     * Scrolls to the bottom of the current page.
     * @param page - The Playwright `Page` object representing the browser page
     * @param description - A descriptive label for logging purposes
     * @returns {Promise<void>} Resolves after scrolling completes
     */
    public static async scrollToPageBottom(page: Page, description: string): Promise<void> {
        try {
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
            });
            Log.info(`Scrolled to bottom: ${description}`);
        } catch (error) {
            Log.error(`Error scrolling to bottom for ${description}: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies that a specified element is visible on the page.
     * @param locator - The Locator object representing the element to verify
     * @param description - A descriptive name of the element for logging purposes
     * @throws {Error} Throws an error if the element is not visible
     * @returns {Promise<void>} A promise that resolves when the visibility check completes
     */
    public static async verifyElementVisibility(locator: Locator, description: string): Promise<Boolean> {
        try {
            await expect(locator).toBeVisible();
            Log.info(`${description} is visible on the page.`);
            return true;
        } catch (error) {
            Log.error(`Error verifying visibility of ${description}: ${error}`);
            return false;
        }
    }

    /**
     * Retrieves the text content from a specified element on the page.
     * @param locator - The Locator object representing the element to get text from
     * @param description - A descriptive name of the element for logging purposes
     * @throws {Error} Throws an error if text retrieval fails
     * @returns {Promise<string>} A promise that resolves to the text content of the element, or an empty string if no text is found
     */
    public static async getElementText(locator: Locator, description: string): Promise<string> {
        try {
            const elementText = await locator.textContent();
            Log.info(`Retrieved text from ${description} successfully.`);
            return elementText ? elementText : "";
        } catch (error) {
            Log.error(`Error retrieving text from ${description}: ${error}`);
            throw error;
        }
    }

    /**
     * Waits for a specified element to become invisible (hidden) on the page.
     * @param locator - The Locator object representing the element to wait for
     * @param description - A descriptive name of the element for logging purposes
     * @param timeout - The maximum time to wait for the element in milliseconds. Defaults to 5000ms
     * @throws {Error} Throws an error if the element does not become invisible within the timeout period
     * @returns {Promise<void>} A promise that resolves when the element becomes invisible
     * @remarks This method is useful for waiting until loading spinners, modals, or other temporary elements disappear
     */
    public static async waitForElementToBeInvisible(locator: Locator, description: string, timeout: number = 5000): Promise<void> {
        try {
            await locator.waitFor({ state: 'hidden', timeout: timeout });
            Log.info(`${description} is now invisible on the page.`);
        } catch (error) {
            Log.error(`Error waiting for ${description} to be invisible: ${error}`);
            throw error;
        }
    }

    /**
     * Waits for a specified element to become visible on the page.
     * @param locator - The Locator object representing the element to wait for
     * @param description - A descriptive name of the element for logging purposes
     * @param timeout - The maximum time to wait for the element in milliseconds. Defaults to 5000ms
     * @throws {Error} Throws an error if the element does not become visible within the timeout period
     * @returns {Promise<void>} A promise that resolves when the element becomes visible
     */
    public static async waitForElementToBeVisible(locator: Locator, description: string, timeout: number = 5000): Promise<void> {
        try {
            await locator.waitFor({ state: 'visible', timeout: timeout });
            Log.info(`${description} is now visible on the page.`);
        } catch (error) {
            Log.error(`Error waiting for ${description} to be visible: ${error}`);
            throw error;
        }
    }

    /**
     * Checks if a specified element exists on the page.
     * @param locator - The Locator object representing the element to check
     * @param description - A descriptive name of the element for logging purposes
     * @returns {Promise<boolean>} A promise that resolves to true if the element exists, false otherwise
     * @remarks This method does not throw an error if the element does not exist; it returns false instead
     */
    public static async elementExists(locator: Locator, description: string): Promise<boolean> {
        try {
            const count = await locator.count();
            if (count > 0) {
                Log.info(`${description} exists on the page.`);
                return true;
            } else {
                Log.info(`${description} does not exist on the page.`);
                return false;
            }
        } catch (error) {
            Log.error(`Error checking if ${description} exists: ${error}`);
            return false;
        }
    }

    /**
 * Checks if a specified element is enabled.
 * @param locator - The Locator object representing the element to check
 * @param description - A descriptive name of the element for logging purposes
 * @returns {Promise<boolean>} A promise that resolves to true if the element is enabled, false otherwise
 * @remarks This method does not throw an error if the element is disabled; it returns false instead
 */
    public static async isElementEnabled(locator: Locator, description: string): Promise<boolean> {
        try {
            const isEnabled = await locator.isEnabled();
            if (isEnabled) {
                Log.info(`${description} is enabled.`);
                return true;
            } else {
                Log.info(`${description} is disabled.`);
                return false;
            }
        } catch (error) {
            Log.error(`Error checking if ${description} is enabled: ${error}`);
            return false;
        }
    }

    /**
     * Checks if a specified element is editable.
     * @param locator - The Locator object representing the element to check
     * @param description - A descriptive name of the element for logging purposes
     * @returns {Promise<boolean>} A promise that resolves to true if the element is editable, false otherwise
     * @remarks Uses Playwright's `isEditable()`; returns false on errors
     */
    public static async isElementEditable(locator: Locator, description: string): Promise<boolean> {
        try {
            const editable = await locator.isEditable();
            if (editable) {
                Log.info(`${description} is editable.`);
                return true;
            } else {
                Log.info(`${description} is not editable.`);
                return false;
            }
        } catch (error) {
            Log.error(`Error checking if ${description} is editable: ${error}`);
            return false;
        }
    }

    /**
     * Checks if a specified element is visible on the page.
     * @param locator - The Locator object representing the element to check
     * @param description - A descriptive name of the element for logging purposes
     * @returns {Promise<boolean>} A promise that resolves to true if the element is visible, false otherwise
     * @remarks Uses Playwright's `isVisible()`; returns false on errors
     */
    public static async isElementVisible(locator: Locator, description: string): Promise<boolean> {
        try {
            const visible = await locator.isVisible({ timeout: CommonConstants.STANDARD_TIMEOUT });
            if (visible) {
                Log.info(`${description} is visible.`);
                return true;
            } else {
                Log.info(`${description} is not visible.`);
                return false;
            }
        } catch (error) {
            Log.error(`Error checking if ${description} is visible: ${error}`);
            return false;
        }
    }

    /**
    * Checks a checkbox or selects a radio button (or unchecks a checkbox).
    * @param locator - The Locator object for the input element
    * @param description - A descriptive name of the element for logging purposes
    * @param checked - Desired state: `true` to check/select, `false` to uncheck (radio cannot be unchecked)
    * @returns {Promise<boolean>} Resolves to true if the operation succeeded, false otherwise
    */
    public static async checkCheckboxOrRadio(locator: Locator, description: string, checked: boolean = true): Promise<boolean> {
        try {
            const count = await locator.count();
            if (count === 0) {
                Log.error(`${description} not found on the page.`);
                return false;
            }

            const type = (await locator.getAttribute('type')) || '';

            if (type.toLowerCase() === 'radio') {
                if (!checked) {
                    Log.info(`Cannot unselect a radio button: ${description}. Skipping.`);
                    return false;
                }
                await locator.check();
                Log.info(`Selected radio button: ${description}`);
                return true;
            }

            // Treat everything else as checkbox (checkbox supports uncheck)
            if (checked) {
                await locator.check();
                Log.info(`Checked checkbox: ${description}`);
            } else {
                await locator.uncheck();
                Log.info(`Unchecked checkbox: ${description}`);
            }
            return true;
        } catch (error) {
            Log.error(`Error checking/unchecking ${description}: ${error}`);
            return false;
        }
    }

    /**
     * Unchecks a checkbox element if it exists and is currently checked.
     * @param locator - The Locator object for the checkbox element
     * @param description - A descriptive name of the element for logging purposes
     * @returns {Promise<boolean>} Resolves to true if the checkbox is now unchecked or already unchecked, false on error or if element not found
     */
    public static async uncheckCheckbox(locator: Locator, description: string): Promise<boolean> {
        try {
            const count = await locator.count();
            if (count === 0) {
                Log.error(`${description} not found on the page.`);
                return false;
            }

            const type = (await locator.getAttribute('type')) || '';
            if (type.toLowerCase() === 'radio') {
                Log.info(`${description} is a radio button and cannot be unchecked directly.`);
                return false;
            }

            const isChecked = await locator.isChecked();
            if (isChecked) {
                await locator.uncheck();
                Log.info(`Unchecked checkbox: ${description}`);
            } else {
                Log.info(`${description} was already unchecked.`);
            }
            return true;
        } catch (error) {
            Log.error(`Error unchecking ${description}: ${error}`);
            return false;
        }
    }

    /**
     * Checks if a checkbox is currently checked/selected.
     * @param locator - The Locator object for the checkbox element
     * @param description - A descriptive name of the element for logging purposes
     * @returns {Promise<boolean>} Resolves to true if the checkbox is checked, false if unchecked or on error
     */
    public static async isCheckboxChecked(locator: Locator, description: string): Promise<boolean> {
        try {
            const count = await locator.count();
            if (count === 0) {
                Log.error(`${description} not found on the page.`);
                return false;
            }

            const isChecked = await locator.isChecked();
            if (isChecked) {
                Log.info(`${description} is checked.`);
            } else {
                Log.info(`${description} is not checked.`);
            }
            return isChecked;
        } catch (error) {
            Log.error(`Error checking if ${description} is checked: ${error}`);
            return false;
        }
    }

    /**
     * Selects an option from a dropdown/select element by its `value` attribute.
     * @param locator - The Locator object for the select element
     * @param value - The value attribute of the option to select
     * @param description - A descriptive name of the element for logging purposes
     * @returns {Promise<boolean>} Resolves to true if selection succeeded, false otherwise
     */
    public static async selectDropdownByValue(locator: Locator, value: string, description: string): Promise<boolean> {
        try {
            const count = await locator.count();
            if (count === 0) {
                Log.error(`${description} not found on the page.`);
                return false;
            }

            await locator.selectOption({ value });
            Log.info(`Selected option with value '${value}' in ${description}.`);
            return true;
        } catch (error) {
            Log.error(`Error selecting value '${value}' in ${description}: ${error}`);
            return false;
        }
    }

    /**
     * Selects an option from a dropdown/select element by its visible text (label).
     * @param locator - The Locator object for the select element
     * @param visibleText - The visible text (label) of the option to select
     * @param description - A descriptive name of the element for logging purposes
     * @returns {Promise<boolean>} Resolves to true if selection succeeded, false otherwise
     */
    public static async selectDropdownByVisibleText(locator: Locator, visibleText: string, description: string): Promise<boolean> {
        try {
            const count = await locator.count();
            if (count === 0) {
                Log.error(`${description} not found on the page.`);
                return false;
            }

            await locator.selectOption({ label: visibleText });
            Log.info(`Selected option with visible text '${visibleText}' in ${description}.`);
            return true;
        } catch (error) {
            Log.error(`Error selecting visible text '${visibleText}' in ${description}: ${error}`);
            return false;
        }
    }

    /**
     * Selects an option from a dropdown/select element by its index.
     * @param locator - The Locator object for the select element
     * @param index - The zero-based index of the option to select
     * @param description - A descriptive name of the element for logging purposes
     * @returns {Promise<boolean>} Resolves to true if selection succeeded, false otherwise
     */
    public static async selectDropdownByIndex(locator: Locator, index: number, description: string): Promise<boolean> {
        try {
            const count = await locator.count();
            if (count === 0) {
                Log.error(`${description} not found on the page.`);
                return false;
            }

            await locator.selectOption({ index });
            Log.info(`Selected option at index ${index} in ${description}.`);
            return true;
        } catch (error) {
            Log.error(`Error selecting index ${index} in ${description}: ${error}`);
            return false;
        }
    }

    /**
     * Retrieves all options from a dropdown/select element.
     * @param locator - The Locator object for the select element
     * @param description - A descriptive name of the element for logging purposes
     * @returns {Promise<Array<{ value: string; label: string }>>} Resolves to an array of option objects with `value` and `label`.
     */
    public static async getAllDropdownOptions(locator: Locator, description: string): Promise<string[]> {
        try {
            await this.waitForElementToBeVisible(locator, description);
            const allDropdownOptions = await locator.locator('option').allTextContents();
            Log.info(`Retrieved all options from ${description}: ${allDropdownOptions.join(', ')}`);
            return allDropdownOptions;
        } catch (error) {
            Log.error(`Error retrieving options from ${description}: ${error}`);
            throw error;
        }
    }

    /**
     * Accepts an alert dialog if one appears on the page.
     * @param page - The Playwright Page object
     * @param description - A descriptive label for logging purposes
     * @returns {Promise<void>} Resolves after handling the alert (or immediately if no alert appears)
     * @remarks Sets up a listener for 'dialog' events and auto-accepts any alerts that appear within the execution window
     */
    public static async acceptAlert(page: Page, description: string): Promise<void> {
        try {
            let alertAccepted = false;
            const dialogHandler = (dialog: any) => {
                alertAccepted = true;
                Log.info(`Alert accepted: ${description}`);
                dialog.accept();
            };

            page.on('dialog', dialogHandler);
            // Give a brief window for alerts to appear and be handled
            await page.waitForTimeout(CommonConstants.SMALL_TIMEOUT);
            page.off('dialog', dialogHandler);

            if (!alertAccepted) {
                Log.info(`No alert appeared for: ${description}`);
            }
        } catch (error) {
            Log.error(`Error handling alert for ${description}: ${error}`);
        }
    }

    /**
     * Accepts an alert dialog and retrieves its message text.
     * @param page - The Playwright Page object
     * @param description - A descriptive label for logging purposes
     * @returns {Promise<string>} Resolves to the alert message text, or empty string if no alert appears
     * @remarks Sets up a listener for 'dialog' events, captures the message, and auto-accepts the alert
     */
    public static async acceptAlertAndGetText(page: Page, description: string): Promise<string> {
        try {
            let alertMessage = '';
            const dialogHandler = (dialog: any) => {
                alertMessage = dialog.message();
                Log.info(`Alert message: ${alertMessage}`);
                Log.info(`Alert accepted: ${description}`);
                dialog.accept();
            };

            page.on('dialog', dialogHandler);
            // Give a brief window for alerts to appear and be handled
            await page.waitForTimeout(CommonConstants.SMALL_TIMEOUT);
            page.off('dialog', dialogHandler);

            if (alertMessage === '') {
                Log.info(`No alert appeared for: ${description}`);
            }
            return alertMessage;
        } catch (error) {
            Log.error(`Error handling alert for ${description}: ${error}`);
            return '';
        }
    }

    /**
     * Dismisses an alert dialog if one appears on the page.
     * @param page - The Playwright Page object
     * @param description - A descriptive label for logging purposes
     * @returns {Promise<void>} Resolves after dismissing the alert (or immediately if no alert appears)
     * @remarks Sets up a listener for 'dialog' events and auto-dismisses any alerts by calling `dialog.dismiss()`
     */
    public static async dismissAlert(page: Page, description: string): Promise<void> {
        try {
            let alertDismissed = false;
            const dialogHandler = (dialog: any) => {
                alertDismissed = true;
                Log.info(`Alert dismissed: ${description}`);
                dialog.dismiss();
            };

            page.on('dialog', dialogHandler);
            // Give a brief window for alerts to appear and be handled
            await page.waitForTimeout(CommonConstants.SMALL_TIMEOUT);
            page.off('dialog', dialogHandler);

            if (!alertDismissed) {
                Log.info(`No alert appeared for: ${description}`);
            }
        } catch (error) {
            Log.error(`Error dismissing alert for ${description}: ${error}`);
        }
    }
}