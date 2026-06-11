export class InventoryPage {
  constructor(page) {
    this.page = page
    
    this.pageTitle = page.locator('h1')
    this.cartIcon = page.locator('[class*="cart_link"]')
    this.productsList = page.locator('.inventory_item')
  }

  async open() {
    await this.page.goto('https://www.saucedemo.com/inventory.html')
  }

  async getPageTitle() {
    return await this.pageTitle.innerText()
  }

  async addItemToCart(itemName) {
    const item = this.productsList.filter({ hasText: itemName })
    const addToCartButton = item.locator('button:has-text("Add to cart")')
    await addToCartButton.click()
  }

  async openCart() {
    await this.cartIcon.click()
  }

  async isItemVisible(itemName) {
    return await this.productsList.filter({ hasText: itemName }).isVisible()
  }
}