import { test, expect } from '@playwright/test'
import { LoginPage } from '../page-objects/LoginPage.js'
import { InventoryPage } from '../page-objects/InventoryPage.js'
import { CartPage } from '../page-objects/CartPage.js'
import { CheckoutStepOnePage } from '../page-objects/CheckoutStepOnePage.js'
import { CheckoutStepTwoPage } from '../page-objects/CheckoutStepTwoPage.js'
import { CheckoutCompletePage } from '../page-objects/CheckoutCompletePage.js'

test.describe('@ui E2E Test: Complete Purchase Flow', () => {
  test('should successfully complete a purchase', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const inventoryPage = new InventoryPage(page)
    const cartPage = new CartPage(page)
    const checkoutStepOnePage = new CheckoutStepOnePage(page)
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page)
    const checkoutCompletePage = new CheckoutCompletePage(page)

    await loginPage.open()
    await expect(page).toHaveURL('https://www.saucedemo.com/')

    await loginPage.login('standard_user', 'secret_sauce')

    await expect(page.locator('.header_secondary_container .title')).toHaveText('Products')

    const mostExpensiveItem = await inventoryPage.getMostExpensiveItem()
    console.log(`Adding most expensive item: ${mostExpensiveItem.name} (${mostExpensiveItem.price})`)
    await inventoryPage.addItemToCart(mostExpensiveItem.name)

    await inventoryPage.openCart()

    expect(await cartPage.isItemInCart(mostExpensiveItem.name)).toBe(true)
    const cartItems = await cartPage.getCartItems()
    expect(cartItems).toContain(mostExpensiveItem.name)

    await cartPage.goToCheckout()

    await checkoutStepOnePage.fillUserInfo('Test', 'User', '12345')

    await checkoutStepOnePage.continueCheckout()

    await checkoutStepTwoPage.finishCheckout()

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!')
  })
})