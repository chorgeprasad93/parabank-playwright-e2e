// pages/BillPayPage.js
const { expect } = require('@playwright/test');

class BillPayPage {
    constructor(page) {
        this.page = page;
        this.link = page.locator('a:has-text("Bill Pay")');
        this.name = page.locator("input[name='payee.name']");
        this.street = page.locator("input[name='payee.address.street']");
        this.city = page.locator("input[name='payee.address.city']");
        this.state = page.locator("input[name='payee.address.state']");
        this.zip = page.locator("input[name='payee.address.zipCode']");
        this.phone = page.locator("input[name='payee.phoneNumber']");
        this.account = page.locator("input[name='payee.accountNumber']");
        this.verifyAccount = page.locator("input[name='verifyAccount']");
        this.amount = page.locator("input[name='amount']");
        this.fromAccount = page.locator("select[name='fromAccountId']");
        this.sendBtn = page.locator("input[value='Send Payment']");
        this.successMsg = page.locator("#billpayResult p").first()
    }

    async payBill(payeeDetails, fromAccountId) {
        await this.link.click();
        await this.name.fill(payeeDetails.name);
        await this.street.fill(payeeDetails.address);
        await this.city.fill(payeeDetails.city);
        await this.state.fill(payeeDetails.state);
        await this.zip.fill(payeeDetails.zipcode);
        await this.phone.fill(payeeDetails.phone);
        await this.account.fill(payeeDetails.accountNo);
        await this.verifyAccount.fill(payeeDetails.verifyAccountNo);
        await this.amount.fill(payeeDetails.amount);
        
        await this.fromAccount.selectOption(fromAccountId);
        await this.sendBtn.click();

        await expect(this.successMsg).toBeVisible();
        await expect(this.successMsg).toContainText(`Bill Payment to ${payeeDetails.name}`);
    }
}
module.exports = BillPayPage;