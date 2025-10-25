// @ts-check
import { test, expect } from '@playwright/test';
import { ai } from '@zerostep/playwright';
import { faker } from '@faker-js/faker';

// -------------------- LOG BROWSER CONSOLE --------------------
test.beforeEach(async ({ page }) => {
  page.on('console', msg => {
    console.log(`🧭 [BROWSER LOG] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
});

// -------------------- TEST 1: LOGIN --------------------
test.skip('ZeroStep-AI-Driven Tests - Login', async ({ page }) => {
  await page.goto('https://alagamai-emp.vercel.app/login/');
  await ai('Enter "1234" in access code field', { page, test });
  await ai('Click Login', { page, test });
  await ai('Verify page displays employee details', { page, test });
});

// -------------------- TEST 2: FILL EMPLOYEE DETAILS --------------------
test('ZeroStep-AI-Driven Tests - Fill employee details', async ({ page }) => {
  await page.goto('https://alagamai-emp.vercel.app/login/');

  // Login
  await ai('Enter "1234" in access code field', { page, test });
  await ai('Click Login', { page, test });
  await ai('Verify page displays employee details', { page, test });

  // Get title
  const title = await ai('What is the title of the page?', { page, test });
  console.log(`🧭 [TITLE] ${title}`);

  // Fill form step by step
  await ai('Enter random realistic first name and last name', { page, test });
  await ai('Enter Age', { page, test });
  await ai('Fill Date of Birth with a past date', { page, test });
  await ai('Enter job role', { page, test });
  await ai('Select gender by clicking radio button', { page, test });
  await ai('Enter Joining Date and Salary', { page, test });

  // Submit and verify
  await ai('Click Submit button', { page, test });
  await ai('Verify newly added employee details appear in the table', { page, test });

  // Extract first record
  const record = await ai('Extract the first record from the employee table', { page, test });
  console.log('🧭 [FIRST RECORD]', record);
});

// -------------------- TEST 3: FILL EMPLOYEE DETAILS WITH FAKER DATA --------------------
test.skip('ZeroStep-AI-Driven Tests - Fill employee details with Faker data', async ({ page }) => {
  // Step 1: Generate dynamic Faker data
  const data = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 25, max: 50 }),
    date_of_birth: faker.date.birthdate({ min: 25, max: 50, mode: 'age' }).toISOString().split('T')[0],
    job_role: faker.person.jobTitle(),
    gender: faker.helpers.arrayElement(['Male', 'Female']),
    joining_date: faker.date.past({ years: 1 }).toISOString().split('T')[0],
    salary: faker.number.int({ min: 40000, max: 150000 }),
  };
  console.log('🧭 [FAKER DATA]', data);

  // Step 2: Go to page & login
  await page.goto('https://alagamai-emp.vercel.app/login/');
  await ai('Enter "1234" in access code field', { page, test });
  await ai('Click Login', { page, test });
  await ai('Verify page displays employee details', { page, test });

  // Get title
  const title = await ai('What is the title of the page?', { page, test });
  console.log(`🧭 [TITLE] ${title}`);

  // Step 3: Hybrid form filling (ZeroStep AI + Playwright for tricky fields)
  // AI handles text fields
  await ai(`Enter "${data.first_name}" in the first name field`, { page, test });
  await ai(`Enter "${data.last_name}" in the last name field`, { page, test });
  await ai(`Enter "${data.age}" in the age field`, { page, test });
  await ai(`Fill "${data.date_of_birth}" in the date of birth field`, { page, test });
  await ai(`Entert "${data.job_role}" in the job role field`, { page, test });
 // await ai('Enter job role', { page, test });


  // Playwright handles radio buttons and salary (reliable)
  await page.click(`input[name="gender"][value="${data.gender}"]`);
  await page.fill('input[name="salary"]', data.salary.toString());
  await page.fill('input[name="joining_date"]', data.joining_date);

  // Submit
  await ai('Click Submit button', { page, test });

  // Extract first record
  const record = await ai('Extract the first record from the employee table', { page, test });
  console.log('🧭 [FIRST RECORD]', record);
});

