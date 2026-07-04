const { test, expect } = require('@playwright/test');
const { ShopPage } = require('../src/pages/shopPage');
const { CartPage } = require('../src/pages/cartPage');
const testData = require('../src/data/testData.json');

test('Verify cart subtotals and grand total for multiple products', async ({ page }) => {
  test.setTimeout(60000);

  const shopPage = new ShopPage(page);
  const cartPage = new CartPage(page);

  const products = [
    { id: 'product-2', name: 'Stuffed Frog', qty: 2 },
    { id: 'product-4', name: 'Fluffy Bunny', qty: 5 },
    { id: 'product-7', name: 'Valentine Bear', qty: 3 },
  ];

  await test.step('Input 01: Navigate to home page', async () => {
    console.log('--------- Input 01 ------- : Navigate to home page ------------------------------');
    await page.goto(testData.baseUrl);
  });

  await test.step('Input 02: Go to Shop and reset cart to empty state', async () => {
    console.log('--------- Input 02 ------- : Navigate to shop page ------------------------------');
    await shopPage.goToShop();
  });

  await test.step('Input 03: Add products to cart with specified quantities', async () => {
    for (const product of products) {
      console.log(`--------- Input 03 ------- : Add ${product.qty} x ${product.name} to cart ------------------------------`);
      await shopPage.addProductToCart(product.id, product.qty);
    }
    console.log('--------- Expected Outcome 03 ------- : All products added to cart -------------------');
  });

  await test.step('Input 04: Navigate to cart page', async () => {
    console.log('--------- Input 04 ------- : Navigate to cart page ------------------------------');
    await shopPage.goToCart();
    console.log('--------- Expected Outcome 04 ------- : Cart page is displayed with added items -------------------');
  });

  let calculatedGrandTotal = 0;

  for (const product of products) {
    await test.step(`Verify subtotal for ${product.name}`, async () => {
      console.log(`--------- Verifying ${product.name} ------- : Checking price x quantity = subtotal ------------------------------`);

      const unitPrice = await cartPage.getUnitPrice(product.name);
      const quantity = await cartPage.getQuantity(product.name);
      const subtotal = await cartPage.getSubtotal(product.name);

      console.log(`--------- ${product.name}: unit price=$${unitPrice}, quantity=${quantity}, subtotal=$${subtotal} ---------`);

      // Confirm quantity in cart matches what we intended to add
      expect(quantity).toBe(product.qty);

      // Confirm subtotal = unit price x quantity
      expect(subtotal).toBeCloseTo(unitPrice * quantity, 2);

      calculatedGrandTotal += subtotal;
    });
  }

  await test.step('Verify grand total matches sum of all subtotals', async () => {
    console.log('--------- Verifying Grand Total ------- : Checking sum of subtotals matches displayed total ------------------------------');

    const grandTotal = await cartPage.getGrandTotal();

    console.log(`--------- Calculated total=$${calculatedGrandTotal.toFixed(2)}, Displayed total=$${grandTotal} ---------`);

    expect(grandTotal).toBeCloseTo(calculatedGrandTotal, 2);

    console.log('--------- Expected Outcome ------- : Grand total is correct -------------------');
  });
});