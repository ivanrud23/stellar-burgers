describe('Cypress tests', () => {
  beforeEach(() => {
    cy.intercept('GET', 'ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'orders', { fixture: 'orders.json' }).as(
      'createOrder'
    );

    cy.visit('http://localhost:4000');

    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  it('Проверка добавления булки и начинки в конструктор', () => {
    cy.get('[data-cy=ingredient]')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button')
      .click();

    cy.get('[data-cy=ingredient]')
      .contains('Мясо бессмертных моллюсков Protostomia')
      .parent()
      .find('button')
      .click();

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
    cy.contains('Флюоресцентная булка R2-D3').should('exist');
    cy.contains('Флюоресцентная булка R2-D3').parent().click();

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
    cy.get('[data-cy=ingredient]')
      .contains('Флюоресцентная булка R2-D3')
      .parent()
      .find('button')
      .click();

    cy.get('[data-cy=ingredient]')
      .contains('Мясо бессмертных моллюсков Protostomia')
      .parent()
      .find('button')
      .click();

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
