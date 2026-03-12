// Prérequis : npm install selenium-webdriver chromedriver
// L'appli doit tourner : backend sur :3001, frontend sur :5173

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let driver;

beforeAll(async () => {
  const options = new chrome.Options();
  options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}, 30000);

afterAll(async () => {
  if (driver) await driver.quit();
});

describe('E2E - Login', () => {
  test('affiche le formulaire de connexion', async () => {
    await driver.get('http://localhost:5173/login');
    await driver.wait(until.elementLocated(By.css('form')), 5000);
    const form = await driver.findElement(By.css('form'));
    expect(await form.isDisplayed()).toBe(true);
  }, 15000);

  test('connexion avec admin@test.com', async () => {
    await driver.get('http://localhost:5173/login');
    await driver.wait(until.elementLocated(By.id('email')), 5000);

    await driver.findElement(By.id('email')).sendKeys('admin@test.com');
    await driver.findElement(By.id('password')).sendKeys('password');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(until.urlContains('/dashboard'), 7000);
    const url = await driver.getCurrentUrl();
    expect(url).toContain('/dashboard');
  }, 20000);
});

describe('E2E - Dashboard', () => {
  test('affiche le bouton Nouvelle Tâche', async () => {
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Nouvelle')]")), 5000);
    const btn = await driver.findElement(By.xpath("//*[contains(text(),'Nouvelle')]"));
    expect(await btn.isDisplayed()).toBe(true);
  }, 15000);
});
