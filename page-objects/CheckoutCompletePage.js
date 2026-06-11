export class CheckoutCompletePage {
  constructor(page) {
    this.page = page
    
    this.completionMessage = page.locator('h2')
    this.backHomeButton = page.locator('[data-test="backHome"]')
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/checkout-complete.html')
  }

  async getCompletionMessage() {
    return await this.completionMessage.innerText()
  }

  async backToHome() {
    await this.backHomeButton.click()
  }

  async isOrderComplete() {
    const message = await this.getCompletionMessage()
    return message.includes('Thank you for your order')
  }
}