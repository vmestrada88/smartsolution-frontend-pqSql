const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 1000000, // Aumentado a 1000s para más lentitud
    requestTimeout: 1000000,
    responseTimeout: 1000000,
    animationDistanceThreshold: 0, // Espera todas las animaciones
    waitForAnimations: true, // Fuerza esperar animaciones
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
