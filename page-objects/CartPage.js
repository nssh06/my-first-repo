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

  getCartItem(itemName) {
    return this.cartItems.filter({ hasText: itemName })
  }

  async getCartItems() {
    const items = []
    const count = await this.productsList.count()

    for (let i = 0; i < count; i++) {
      const name = await this.productsList
        .nth(i)
        .locator('.inventory_item_name')
        .textContent()

      items.push(name ? name.trim() : '')
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