export class CartPage {
  constructor(page) {
    this.page = page
    
    this.productsList = page.locator('.cart_item')
    this.checkoutButton = page.locator('[data-test="checkout"]')
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]')
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/cart.html')
  }

  async goToCheckout() {
    await this.checkoutButton.click()
  }

  async continueShopping() {
    await this.continueShoppingButton.click()
  }

  async getCartItems() {
    const items = []
    const productItems = await this.productsList.all()
    
    for (const item of productItems) {
      const name = await item.locator('.cart_item_name').innerText()
      items.push(name)
    }
    
    return items
  }

  async isItemInCart(itemName) {
    return await this.productsList.filter({ hasText: itemName }).isVisible()
  }

  async getCartItemCount() {
    return await this.productsList.count()
  }
}