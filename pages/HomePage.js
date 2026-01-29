// pages/HomePage.js
const { expect } = require('@playwright/test');

class HomePage {
    constructor(page) {
        this.page = page;
        // Global/Side navigation links
        this.navLinks = {
            'Open New Account': 'openaccount.htm',
            'Accounts Overview': 'overview.htm',
            'Transfer Funds': 'transfer.htm',
            'Bill Pay': 'billpay.htm',
            'Find Transactions': 'findtrans.htm'
        };
    }

    async verifyGlobalNavigation() {
        // We verify the functional side menu as it's critical for banking operations
        for (const [linkName, urlPart] of Object.entries(this.navLinks)) {
            const link = this.page.locator(`a:has-text("${linkName}")`);
            await expect(link).toBeVisible();
            await link.click();
            await expect(this.page).toHaveURL(new RegExp(urlPart));
        }
    }
}
module.exports = HomePage;