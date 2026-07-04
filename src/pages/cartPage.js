class CartPage {
  constructor(page) {
    this.page = page;
    this.emptyCartButton = page.getByRole('link', { name: 'Empty Cart' });
  }

  getCartRow(productName) {
    return this.page.locator('table tbody tr').filter({ hasText: productName });
  }

  async getUnitPrice(productName) {
    const row = this.getCartRow(productName);
    const priceText = await row.locator('td').nth(1).innerText();
    return parseFloat(priceText.replace('$', '').trim());
  }

  async getQuantity(productName) {
    const row = this.getCartRow(productName);
    const qtyValue = await row.getByRole('spinbutton').inputValue();
    return parseInt(qtyValue, 10);
  }

  async getSubtotal(productName) {
    const row = this.getCartRow(productName);
    const subtotalText = await row.locator('td').nth(3).innerText();
    return parseFloat(subtotalText.replace('$', '').trim());
  }

  async getGrandTotal() {
    // "Total: 193.84" — no $ sign, unlike subtotal cells
    const totalText = await this.page.locator('text=Total:').innerText();
    return parseFloat(totalText.replace('Total:', '').trim());
  }

  async emptyCart() {
    // Only click if cart actually has items, to avoid erroring on an already-empty cart
    if (await this.emptyCartButton.isVisible()) {
      await this.emptyCartButton.click();
    }
  }
}

module.exports = { CartPage };