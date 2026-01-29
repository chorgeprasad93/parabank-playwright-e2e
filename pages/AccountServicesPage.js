// pages/AccountServicesPage.js
const { expect } = require('@playwright/test');

class AccountServicesPage {
    constructor(page) {
        this.page = page;
        this.openAccountLink = page.locator('a:has-text("Open New Account")');
        this.accountTypeSelect = page.locator('#type');
        this.openAccountBtn = page.locator('input[value="Open New Account"]');
        this.newAccountIdMsg = page.locator('#newAccountId');
        
        this.transferLink = page.locator('a:has-text("Transfer Funds")');
        this.amountInput = page.locator('#amount');
        this.fromAccountSelect = page.locator('#fromAccountId');
        this.toAccountSelect = page.locator('#toAccountId');
        this.transferBtn = page.locator('input[value="Transfer"]');
        this.transferSuccessMsg = page.getByText('Transfer Complete!');
    }

    async createSavingsAccount() {
        await this.openAccountLink.click();
        await this.accountTypeSelect.selectOption('1');
        const fromAccountDropdown = this.page.locator('#fromAccountId');
        await expect(fromAccountDropdown.locator('option').first()).toBeAttached();
        
        await expect(async () => {
          const count = await fromAccountDropdown.locator('option').count();
          expect(count).toBeGreaterThan(0);
        }).toPass();

        const [response] = await Promise.all([
            this.page.waitForResponse(resp => resp.url().includes('createAccount') && resp.status() === 200),
            this.openAccountBtn.click()
        ]);
        await expect(this.newAccountIdMsg).toBeVisible();
        const accountId = await this.newAccountIdMsg.textContent();
        console.log(`New Savings Account Created: ${accountId}`);
        return accountId;
    }

    async validateAccountBalance(accountId, expectedAmount) {
        await this.page.click('a:has-text("Accounts Overview")');
        await expect(this.page.locator('#accountTable')).toBeVisible();
        await this.page.click(`a[href*='activity.htm?id=${accountId}']`);
        const balanceLocator = this.page.locator('#balance');
        await expect(balanceLocator).toContainText(expectedAmount);
    }

    async transferFunds(fromId, toId, amount) {
        await this.transferLink.click();
        await this.page.waitForTimeout(1000); 
        
        await this.amountInput.fill(amount);
        await this.fromAccountSelect.selectOption(fromId);
        await this.toAccountSelect.selectOption(toId); 
        await this.transferBtn.click();
        
        await expect(this.transferSuccessMsg).toBeVisible();
    }
}
module.exports = AccountServicesPage;