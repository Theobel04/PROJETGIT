const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 10000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  const options = new chrome.Options();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  let passed = 0;
  let failed = 0;

  try {
    console.log('\n[TEST 1] Login avec admin@test.com...');
    try {
      await driver.get(BASE_URL);
      await driver.wait(until.elementLocated(By.id('email')), TIMEOUT);
      await driver.findElement(By.id('email')).sendKeys('admin@test.com');
      await driver.findElement(By.id('password')).sendKeys('password');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.css('.dashboard')), TIMEOUT);
      await driver.wait(until.elementTextContains(
        await driver.findElement(By.css('.dashboard-header h1')),
        'Gestionnaire de Tâches'
      ), TIMEOUT);
      console.log('  ✅ PASS - Login réussi, dashboard affiché');
      passed++;
    } catch (e) {
      console.log('  ❌ FAIL - Login échoué :', e.message);
      failed++;
    }

    console.log('\n[TEST 2] Création d\'une tâche...');
try {
  await sleep(1000);
  await driver.findElement(By.css('.btn.btn-primary')).click();
  await sleep(1500);

  const modals = await driver.findElements(By.css('.modal'));
  if (modals.length === 0) throw new Error('Modal non trouvé après clic');

  const titleInput = await driver.findElement(By.id('title'));
  await titleInput.clear();
  await titleInput.sendKeys('Tâche E2E Test');

  const descInput = await driver.findElement(By.id('description'));
  await descInput.sendKeys('Créée automatiquement par Selenium');

  await driver.findElement(By.css('select#priority')).sendKeys('Haute');
  await driver.findElement(By.css('.form-actions .btn.btn-primary')).click();
  await sleep(1000);

  const taskTitles = await driver.findElements(By.css('.task-title'));
  const texts = await Promise.all(taskTitles.map(el => el.getText()));
  const found = texts.some(t => t.includes('Tâche E2E Test'));
  if (!found) throw new Error('Tâche non trouvée dans la liste');

  console.log('  ✅ PASS - Tâche créée et visible dans la liste');
  passed++;
} catch (e) {
  console.log('  ❌ FAIL - Création de tâche échouée :', e.message);
  failed++;
}




    console.log('\n[TEST 3] Suppression d\'une tâche...');
    try {
      const cardsAvant = await driver.findElements(By.css('.task-card'));
      const nbAvant = cardsAvant.length;
      const deleteBtn = await driver.findElement(By.css('.task-card .btn-icon[title="Supprimer"]'));
      await deleteBtn.click();
      await driver.switchTo().alert().accept();
      await sleep(500);
      const cardsApres = await driver.findElements(By.css('.task-card'));
      const nbApres = cardsApres.length;
      if (nbApres !== nbAvant - 1) throw new Error(`Attendu ${nbAvant - 1} tâches, trouvé ${nbApres}`);
      console.log('  ✅ PASS - Tâche supprimée avec succès');
      passed++;
    } catch (e) {
      console.log('  ❌ FAIL - Suppression échouée :', e.message);
      failed++;
    }

    console.log('\n[TEST 4] Déconnexion...');
    try {
      await driver.findElement(By.css('.logout-btn')).click();
      await driver.wait(until.elementLocated(By.id('email')), TIMEOUT);
      console.log('  ✅ PASS - Déconnexion réussie');
      passed++;
    } catch (e) {
      console.log('  ❌ FAIL - Déconnexion échouée :', e.message);
      failed++;
    }

  } finally {
    await driver.quit();
    console.log(`\n══════════════════════════════`);
    console.log(`Résultats : ${passed} ✅ passés, ${failed} ❌ échoués`);
    console.log(`══════════════════════════════\n`);
    if (failed > 0) process.exit(1);
  }
}

runTests();