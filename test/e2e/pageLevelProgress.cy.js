describe('Page Level Progress', function () {
  beforeEach(function () {
    cy.getData();
    cy.visit('/');
  });
  
  it('should display the page level progress bars correctly on the menu items', function () {
    const isPageLevelProgressEnabled = this.data.course._pageLevelProgress?._isEnabled;
    // Check if PLP is enabled. Check it's visible on menu tiles
    if (isPageLevelProgressEnabled) {
      const pagesCount = this.data.contentObjects.filter(page => page._pageLevelProgress._isEnabled).length;
      cy.get('.pagelevelprogress__indicator').should('have.length', pagesCount);
    } else {
      cy.get('.pagelevelprogress__indicator').should('not.exist');
    };
  });
  
  it('should display the page level progress bars correctly on the pages', function () {
    const pageLevelProgress = this.data.course._pageLevelProgress;
    if (!pageLevelProgress?._isEnabled) return;
    const pages = this.data.contentObjects;
    pages.forEach(page => {
      cy.visit(`/#/${page._id}`);
      // Only check it appears correctly if it shows in the nav bar and its enabled on the page
      if (!page._pageLevelProgress?._isEnabled || pageLevelProgress._isShownInNavigationBar) {
        cy.get('.pagelevelprogress__indicator').should('not.exist');
        return;
      };
      
      const articlesOnPage = this.data.articles.filter(article => article._parentId === page._id).map(article => article._id);
      const blocksOnPage = this.data.blocks.filter(block => articlesOnPage.includes(block._parentId)).map(blocks => blocks._id);
      const componentsOnPage = this.data.components.filter(component => blocksOnPage.includes(component._parentId));
      const plpComponents = componentsOnPage.filter(component => component._pageLevelProgress?._isEnabled);
      cy.get('.pagelevelprogress__indicator').should('exist');
      cy.get('button.nav__pagelevelprogress-btn').click();
      // TODO: If its a random assessment more checks are necessary
      if (page._classes !== 'assessment') {
        cy.get('.pagelevelprogress__item').should('have.length', plpComponents.length);
      };
    });
  });
});
