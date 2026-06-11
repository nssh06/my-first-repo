export class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page
    
    this.finishButton = page.locator('[data-test="finish"]')
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/checkout-step-two.html')
  }

  async finishCheckout() {
    await this.finishButton.click()
  }
}