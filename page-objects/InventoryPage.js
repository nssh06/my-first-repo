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

  async getAllProducts() {
    const products = []
    const items = await this.productsList.all()
    
    for (const item of items) {
      const name = await item.locator('.inventory_item_name').innerText()
      const price = await item.locator('.inventory_item_price').innerText()
      products.push({ name, price })
    }
    
    return products
  }

  async getMostExpensiveItem() {
    const products = await this.getAllProducts()
    
    products.sort((a, b) => {
      const priceA = parseFloat(a.price.replace('$', ''))
      const priceB = parseFloat(b.price.replace('$', ''))
      return priceB - priceA
    });
    
    return products[0]
  }

  async isItemVisible(itemName) {
    return await this.productsList.filter({ hasText: itemName }).isVisible()
  }
}