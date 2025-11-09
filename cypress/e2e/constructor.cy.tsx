describe('Cypress tests', () => {

  const testAccessToken = 'Bearer test-access-token';
  const testRefreshToken = 'test-refresh-token';

  beforeEach(() => {

    window.localStorage.setItem('accessToken', testAccessToken);

    cy.intercept('GET', 'ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'orders', (req) => {
      expect(req.headers.authorization).to.equal(testAccessToken);
      req.reply({ fixture: 'orders.json' });
    }).as('createOrder');

    cy.visit('http://localhost:4000', {
      onBeforeLoad(win) {
        win.document.cookie = `accessToken=${testAccessToken}`;
        win.localStorage.setItem('refreshToken', testRefreshToken);
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('Проверка добавления булки и начинки в конструктор', () => {
    cy.addIngredient('Флюоресцентная булка R2-D3');
    cy.addIngredient('Мясо бессмертных моллюсков Protostomia');

    cy.get('[data-cy=top-bun]')
      .contains('Флюоресцентная булка R2-D3 (верх)')
      .should('exist');
    cy.get('[data-cy=bottom-bun]')
      .contains('Флюоресцентная булка R2-D3 (низ)')
      .should('exist');
    cy.get('[data-cy=constructor-ingredients]')
      .contains('Мясо бессмертных моллюсков Protostomia')
      .should('exist');
  });

  it('Проверка модального окна по крестику', () => {
    cy.contains('Флюоресцентная булка R2-D3').as('bunIngredient');
    cy.get('@bunIngredient').should('exist');
    cy.get('@bunIngredient').parent().click();

    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal]').within(() => {
      cy.contains('Детали ингредиента').should('exist');
      cy.contains('Флюоресцентная булка R2-D3').should('exist');
    });

    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Проверка модального окна по оверлею', () => {
    cy.contains('Мясо бессмертных моллюсков Protostomia').parent().click();

    cy.get('[data-cy=modal]').should('exist');

    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Проверка создания заказа', () => {
    cy.addIngredient('Флюоресцентная булка R2-D3');
    cy.addIngredient('Мясо бессмертных моллюсков Protostomia');

    cy.get('[data-cy=orders]')
      .find('button')
      .click();

    cy.get('[data-cy=modal]').should('exist');
    cy.get('[data-cy=modal]').contains('93621').should('exist');

    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=top-bun-placeholder]')
      .contains('Выберите булки')
      .should('exist');
    cy.get('[data-cy=bottom-bun-placeholder]')
      .contains('Выберите булки')
      .should('exist');
    cy.get('[data-cy=constructor-ingredients-placeholder]')
      .contains('Выберите начинку')
      .should('exist');
    
  });
});
