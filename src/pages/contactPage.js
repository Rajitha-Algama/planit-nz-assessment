class ContactPage {
  constructor(page) {
    this.page = page;
    // Navigation
    this.contactNavLink = page.getByRole('link', { name: 'Contact' });
    this.submitLink = page.getByRole('link', { name: 'Submit' });
    // Form fields
    this.forenameInput = page.getByRole('textbox', { name: 'Forename *' });
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.telephoneInput = page.getByRole('textbox', { name: 'Telephone' });
    this.messageInput = page.getByRole('textbox', { name: 'Message *' });
    // Validation errors
    this.forenameError = page.getByText('Forename is required');
    this.emailError = page.getByText('Email is required');
    this.messageError = page.getByText('Message is required');
    // Submission feedback
    this.sendingFeedbackHeading = page.getByRole('heading', { name: 'Sending Feedback' });
    this.progressBar = page.locator('.progress');
  }

  async goToContactPage() {
    await this.contactNavLink.click();
  }

  async clickSubmit() {
    await this.submitLink.click();
  }

  async fillContactForm({ forename, email, telephone, message }) {
    await this.forenameInput.fill(forename);
    await this.emailInput.fill(email);
    await this.telephoneInput.fill(telephone);
    await this.messageInput.fill(message);
  }

  // Waits for the submission progress bar to disappear
  async waitForSubmissionToComplete() {
    await this.progressBar.waitFor({ state: 'hidden' });
  }

  // Returns a locator for the success message, built dynamically using the entered name
  getSuccessMessage(forename) {
    return this.page.getByText(`Thanks ${forename}, we appreciate`);
  }
}

module.exports = { ContactPage };