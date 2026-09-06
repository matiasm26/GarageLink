import assert from 'node:assert/strict';
import { remote } from 'webdriverio';

const APP_PACKAGE = 'host.exp.exponent';
const selectorForText = (text) => `android=new UiSelector().text(${JSON.stringify(text)})`;

async function visibleText(driver, text, timeout = 15000) {
  const element = await driver.$(selectorForText(text));
  await element.waitForDisplayed({ timeout });
  return element;
}

async function goToWelcome(driver) {
  const welcomeButton = await driver.$(selectorForText('Comenzar'));
  if (await welcomeButton.isDisplayed()) {
    return welcomeButton;
  }

  const backButton = await driver.$(selectorForText('Volver'));
  if (await backButton.isDisplayed()) {
    await backButton.click();
    return visibleText(driver, 'Comenzar');
  }

  const logoutButton = await driver.$(selectorForText('Cerrar sesión'));
  if (await logoutButton.isDisplayed()) {
    await logoutButton.click();
    const loginBackButton = await driver.$(selectorForText('Volver'));
    await loginBackButton.waitForDisplayed({ timeout: 10000 });
    await loginBackButton.click();
    return visibleText(driver, 'Comenzar');
  }

  return visibleText(driver, 'Comenzar');
}

async function run() {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    logLevel: 'error',
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'emulator-5554',
      'appium:appPackage': APP_PACKAGE,
      'appium:appActivity': '.experience.HomeActivity',
      'appium:noReset': true,
      'appium:newCommandTimeout': 120,
    },
  });

  try {
    await driver.activateApp(APP_PACKAGE);
    const startButton = await goToWelcome(driver);
    await startButton.click();

    const loginTitle = await visibleText(driver, 'Iniciar sesión');
    assert.equal(await loginTitle.isDisplayed(), true, 'La navegación no llegó a LoginScreen');

    console.log('E2E OK: GarageLink navegó de bienvenida a inicio de sesión.');
  } finally {
    await driver.deleteSession();
  }
}

run().catch((error) => {
  console.error('E2E FAILED:', error);
  process.exitCode = 1;
});
