// pages/RegisterPage.js
const { expect } = require('@playwright/test');

class RegisterPage {
    constructor(page) {
        this.page = page;
        this.firstNameInput = page.locator("input[id='customer.firstName']");
        this.lastNameInput = page.locator("input[id='customer.lastName']");
        this.addressInput = page.locator("input[id='customer.address.street']");
        this.cityInput = page.locator("input[id='customer.address.city']");
        this.stateInput = page.locator("input[id='customer.address.state']");
        this.zipInput = page.locator("input[id='customer.address.zipCode']");
        this.phoneInput = page.locator("input[id='customer.phoneNumber']");
        this.ssnInput = page.locator("input[id='customer.ssn']");
        this.usernameInput = page.locator("input[id='customer.username']");
        this.passwordInput = page.locator("input[id='customer.password']");
        this.confirmPasswordInput = page.locator("input[id='repeatedPassword']");
        this.registerBtn = page.locator("input[value='Register']");
    }

    async navigate() {
        await this.page.goto('/parabank/register.htm');
    }

    async registerUser(user) {
        await this.firstNameInput.fill(user.firstName);
        await this.lastNameInput.fill(user.lastName);
        await this.addressInput.fill(user.address);
        await this.cityInput.fill(user.city);
        await this.stateInput.fill(user.state);
        await this.zipInput.fill(user.zipCode);
        await this.phoneInput.fill(user.phoneNumber);
        await this.ssnInput.fill(user.ssn);
        await this.usernameInput.fill(user.username);
        await this.passwordInput.fill(user.password);
        await this.confirmPasswordInput.fill(user.password);
        await this.registerBtn.click();
        
        await expect(this.page.getByText(`Welcome ${user.username}`)).toBeVisible();
    }
}
module.exports = RegisterPage;