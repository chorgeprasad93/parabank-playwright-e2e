// tests/parabank-e2e.spec.js
const { test, expect } = require('@playwright/test');
const Helper = require('../utils/helper')
const RegisterPage = require('../pages/RegisterPage');
const HomePage = require('../pages/HomePage');
const AccountServicesPage = require('../pages/AccountServicesPage');
const BillPayPage = require('../pages/BillPayPage');

test.describe('Para Bank E2E Automation Framework', () => {
    let registerPage;
    let homePage;
    let accountPage;
    let billPayPage;
    
    // Test Data
    const userData = Helper.generateRandomUser();
    const payeeData = {
        name: 'paul1',
        address: 'address1',
        city: 'city1',
        state: 'state1',
        zipcode: '123456',
        phone: '1234567890',
        accountNo: '123456',
        verifyAccountNo: '123456',
        amount: '50'
    };

    test('UI and API E2E Scenario', async ({ page, request }) => {
        registerPage = new RegisterPage(page);
        homePage = new HomePage(page);
        accountPage = new AccountServicesPage(page);
        billPayPage = new BillPayPage(page);

        await registerPage.navigate();
        await registerPage.registerUser(userData);

        await expect(page.locator('a:has-text("Log Out")')).toBeVisible();

        await homePage.verifyGlobalNavigation();

        const newSavingsId = await accountPage.createSavingsAccount();

        await accountPage.validateAccountBalance(newSavingsId, '$100.00');

        await page.click('a:has-text("Transfer Funds")');
        const toAccountDropdown = page.locator('#toAccountId');
        await page.waitForFunction((select) => select.options.length >= 2, 
            await toAccountDropdown.elementHandle()
        );

        const allOptions = await toAccountDropdown.locator('option').allTextContents();
        console.log("Available accounts for transfer:", allOptions);

        const defaultAccountId = allOptions.find(id => id.trim() !== newSavingsId.trim());
        
        if (!defaultAccountId) {
            throw new Error(`Could not find a second account. Found: ${allOptions.join(', ')}`);
        }

        await accountPage.transferFunds(newSavingsId, defaultAccountId, '10');

        await billPayPage.payBill(payeeData, newSavingsId);

        console.log("Starting API Validation...");
        
        const apiUrl = `/parabank/services/bank/accounts/${newSavingsId}/transactions/amount/${payeeData.amount}`;

        const apiResponse = await request.get(apiUrl, {
            headers: {
                'Accept': 'application/json' 
            }
        });
        expect(apiResponse.status()).toBe(200);
        const responseJson = await apiResponse.json();
        console.log("API Response:", JSON.stringify(responseJson, null, 2));
        const transaction = responseJson.find(t => t.description.includes(`Bill Payment to ${payeeData.name}`));
        
        expect(transaction).toBeDefined();
        expect(transaction.amount).toBe(parseFloat(payeeData.amount));
        expect(transaction.type).toBe('Debit');
    });
});