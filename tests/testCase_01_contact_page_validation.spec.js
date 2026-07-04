const { test, expect } = require('@playwright/test');
const { ContactPage } = require('../src/pages/contactPage');
const testData = require('../src/data/testData.json');

test('Contact page navigation, empty submit validation, and successful submission', async ({ page }) => {
  const contactPage = new ContactPage(page);

  await test.step('Input 01: Home Page -> Navigate to home page and go to Contact page', async () => {
    console.log('--------- Input 01 ------- : Navigate to home page and go to Contact page ------------------------------');
    await page.goto(testData.baseUrl);
    await contactPage.goToContactPage();
    console.log('--------- Expected Outcome 01 ------- : Contact page is displayed -------------------');
  });

  await test.step('Input 02: Contact Page -> Click Submit with empty form', async () => {
    console.log('--------- Input 02 ------- : Click Submit with empty form ------------------------------');
    await contactPage.clickSubmit();
  });

  await test.step('Contact Page -> Verify validation error messages appear', async () => {
    console.log('--------- Expected Outcome 02 ------- : Verify validation error messages appear for mandatory fields-------------------');
    await expect(contactPage.forenameError).toBeVisible();
    await expect(contactPage.emailError).toBeVisible();
    await expect(contactPage.messageError).toBeVisible();
    await expect(contactPage.forenameError).toHaveText(testData.messages.errors.forename);
    await expect(contactPage.emailError).toHaveText(testData.messages.errors.email);
    await expect(contactPage.messageError).toHaveText(testData.messages.errors.message);
  });

  await test.step('Input 03: Contact Page -> Fill contact form', async () => {
    console.log('--------- Input 03 ------- : Fill contact form ------------------------------');
    await contactPage.fillContactForm(testData.contactForm);
  });

  await test.step('Contact Page -> Verify errors are gone', async () => {
    console.log('--------- Expected Outcome 03 ------- : Verify errors are gone -------------------');
    await expect(contactPage.forenameError).not.toBeVisible();
    await expect(contactPage.emailError).not.toBeVisible();
    await expect(contactPage.messageError).not.toBeVisible();
  });

  await test.step('Input 04: Contact Page -> Submit valid form', async () => {
    console.log('--------- Input 04 ------- : Submit valid form ------------------------------');
    await contactPage.clickSubmit();
    
    console.log('--------- Verify submission is in progress ------- : "Sending Feedback" message appears ------');
    await expect(contactPage.sendingFeedbackHeading).toBeVisible();

    await contactPage.waitForSubmissionToComplete();
  
    console.log('--------- Expected Outcome 04 ------- : Success message is displayed -------------------');
    const successMessage = contactPage.getSuccessMessage(testData.contactForm.forename);
    await expect(successMessage).toBeVisible();
  });
});