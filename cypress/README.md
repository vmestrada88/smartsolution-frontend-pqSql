# Cypress Tests for Smart Solution App

Este directorio contiene los tests end-to-end (E2E) para la aplicación Smart Solution usando Cypress.

## Estructura de Tests

### `products.cy.js`
Tests principales para la página de productos que cubren:
- ✅ Carga de página y navegación
- ✅ Funcionalidad de lista de productos
- ✅ Funcionalidad de tabla de facturas
- ✅ Exportación de PDF
- ✅ Diseño responsive
- ✅ Manejo de errores
- ✅ Accesibilidad
- ✅ Rendimiento

### `products-integration.cy.js`
Tests de integración avanzados que cubren:
- ✅ Integración con API
- ✅ Flujos de usuario complejos
- ✅ Tests de rendimiento
- ✅ Compatibilidad cross-browser
- ✅ Tests de seguridad
- ✅ Tests de accesibilidad avanzados

## Comandos Personalizados

Hemos creado comandos personalizados en `cypress/support/commands.js` para facilitar los tests:

```javascript
// Agregar producto al carrito
cy.addProductToInvoice(0);

// Remover producto del carrito
cy.removeProductFromInvoice(0);

// Aumentar cantidad
cy.increaseProductQuantity(0);

// Disminuir cantidad
cy.decreaseProductQuantity(0);

// Obtener total de la factura
cy.getInvoiceTotal();

// Exportar PDF
cy.exportPDF();

// Confirmar exportación
cy.confirmPDFExport();

// Cancelar exportación
cy.cancelPDFExport();

// Esperar carga de productos
cy.waitForProducts();

// Toggle menú móvil
cy.toggleMobileMenu();

// Login como admin/cliente
cy.loginAsAdmin();
cy.loginAsClient();

// Logout
cy.logout();
```

## Configuración

Los tests están configurados en `cypress.config.js` con:
- `baseUrl`: `http://localhost:5173`
- Timeouts extendidos para desarrollo
- Capturas de pantalla en fallos
- Soporte para animaciones

## Ejecutar Tests

### Todos los tests
```bash
npm run cypress:run
```

### Tests específicos
```bash
npx cypress run --spec "cypress/e2e/products.cy.js"
```

### Modo interactivo
```bash
npm run cypress:open
```

## Cobertura de Tests

### Funcionalidades probadas:
1. **Navegación y carga de página**
2. **Lista de productos y filtros**
3. **Carrito de compras (agregar/remover/modificar cantidades)**
4. **Cálculos de totales**
5. **Exportación de PDF con confirmación**
6. **Diseño responsive (móvil/tablet/desktop)**
7. **Manejo de errores y estados de carga**
8. **Accesibilidad (ARIA, navegación por teclado)**
9. **Rendimiento y tiempos de carga**

### Escenarios de error probados:
- API que no responde
- Lista de productos vacía
- Intentar exportar PDF sin productos
- Errores de red
- Ataques XSS (simulados)

## Mejores Prácticas Implementadas

1. **Page Object Pattern**: Usamos selectores consistentes y reutilizables
2. **Custom Commands**: Comandos personalizados para acciones comunes
3. **Data-driven Tests**: Tests que pueden ejecutarse con diferentes datos
4. **Error Handling**: Tests que verifican el manejo correcto de errores
5. **Accessibility**: Tests que verifican cumplimiento de estándares de accesibilidad
6. **Performance**: Tests que miden tiempos de carga y rendimiento
7. **Cross-browser**: Tests que verifican compatibilidad entre navegadores

## CI/CD Integration

Los tests están preparados para integración continua:
- Ejecutan automáticamente en cada push
- Generan reportes de cobertura
- Capturan screenshots en fallos
- Compatible con múltiples navegadores

## Debugging

Para debuggear tests:
1. Usa `cy.pause()` para pausar la ejecución
2. Usa `cy.debug()` para inspeccionar el estado
3. Revisa las capturas de pantalla en `cypress/screenshots/`
4. Usa el modo interactivo con `npm run cypress:open`

## Mantenimiento

### Agregar nuevos tests:
1. Identifica la funcionalidad a probar
2. Crea el test en el archivo apropiado
3. Usa comandos personalizados cuando sea posible
4. Agrega data-testid a componentes nuevos para facilitar testing
5. Ejecuta todos los tests para asegurar compatibilidad

### Actualizar tests existentes:
1. Revisa si los selectores han cambiado
2. Actualiza los comandos personalizados si es necesario
3. Verifica que los tests sigan siendo relevantes
4. Ejecuta tests en múltiples navegadores