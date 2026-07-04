const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');
const { ContactPage } = require('../src/pages/contactPage');
const testData = require('../src/data/testData.json');

test('Contact page navigation & verify successful submission x5', async ({ page }) => {
  test.setTimeout(150000); // 150s total — ~30s per iteration x 5
  
  const contactPage = new ContactPage(page);
  const results = [];

  for (let i = 1; i <= 5; i++) {
    try {
      await allure.step(`Iteration ${i}: Full contact submission flow`, async () => {

        await allure.step('Input 01: Home Page -> Navigate to home page and go to Contact page', async () => {
          console.log(`--------- Iteration ${i} | Input 01 ------- : Navigate to home page and go to Contact page ------------------------------`);
          await page.goto(testData.baseUrl);
          await contactPage.goToContactPage();
          console.log('--------- Expected Outcome 01 ------- : Contact page is displayed -------------------');
        });

        await allure.step('Input 02: Contact Page -> Fill contact form with valid data', async () => {
          console.log(`--------- Iteration ${i} | Input 02 ------- : Fill contact form with valid data ------------------------------`);
          await contactPage.fillContactForm(testData.contactForm);
        });

        await allure.step('Input 03: Contact Page -> Submit valid form', async () => {
          console.log(`--------- Iteration ${i} | Input 03 ------- : Submit valid form ------------------------------`);
          await contactPage.clickSubmit();

          console.log('--------- Verify submission is in progress ------- : "Sending Feedback" message appears ------');
          await expect(contactPage.sendingFeedbackHeading).toBeVisible();

          await contactPage.waitForSubmissionToComplete();

          console.log('--------- Expected Outcome 03 ------- : Success message is displayed -------------------');
          const successMessage = contactPage.getSuccessMessage(testData.contactForm.forename);
          await expect(successMessage).toBeVisible();
        });

      });

      await allure.attachment(`Iteration ${i} result`, 'PASSED', 'text/plain');
      results.push({ iteration: i, status: 'passed' });

    } catch (error) {
      console.log(`--------- Iteration ${i} FAILED: ${error.message} ---------`);
      await allure.attachment(`Iteration ${i} result`, `FAILED: ${error.message}`, 'text/plain');
      results.push({ iteration: i, status: 'failed', error: error.message });
      // no throw — loop continues to iteration i+1
    }
  }

  console.log('--------- Summary ---------');
  console.table(results);
  await allure.attachment('Final Summary (5 iterations)', JSON.stringify(results, null, 2), 'application/json');

  const failures = results.filter(r => r.status === 'failed');
  if (failures.length > 0) {
    throw new Error(`${failures.length}/5 iterations failed: ${JSON.stringify(failures)}`);
  }
});