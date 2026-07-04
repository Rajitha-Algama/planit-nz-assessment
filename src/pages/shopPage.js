class ShopPage {
  constructor(page) {
    this.page = page;
    this.startShoppingLink = page.getByRole('link', { name: 'Start Shopping »' });
  }

  async goToShop() {
    await this.startShoppingLink.click();
  }

  // productId example: 'product-2', 'product-4', 'product-7'
  async addProductToCart(productId, quantity) {
    const buyButton = this.page.locator(`#${productId} .btn`);
    for (let i = 0; i < quantity; i++) {
      await buyButton.click();
    }
  }

  async goToCart() {
    await this.page.getByRole('link', { name: /Cart \(\d+\)/ }).click();
  }
}

module.exports = { ShopPage };