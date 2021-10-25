import Adapt from 'core/js/adapt';
import completionCalculations from './completionCalculations';
import PageLevelProgressNavigationView from './PageLevelProgressNavigationView';
import PageLevelProgressIndicatorView from './PageLevelProgressIndicatorView';
import PageLevelProgressCollection from './PageLevelProgressCollection';

class PageLevelProgress extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, {
      'app:dataReady': this.onDataReady,
      'app:languageChanged': this.stopListening
    });
  }

  getCourseConfig() {
    return Adapt.course.get('_pageLevelProgress');
  }

  onDataReady() {
    // Do not proceed if pageLevelProgress is not enabled in course.json
    const coursePLPConfig = this.getCourseConfig();
    if (!coursePLPConfig?._isEnabled) return;
    this.setUpEventListeners();
  }

  setUpEventListeners() {
    const headerIndicatorTypes = [
      'menu',
      'menuItem',
      'page',
      'article',
      'block',
      'component'
    ];

    const headerIndicatorEventNames = headerIndicatorTypes
      .concat([''])
      .join('View:render ');

    this.listenTo(Adapt, headerIndicatorEventNames, this.renderHeaderIndicatorView);

    this.listenTo(Adapt, {
      'menuItemView:postRender': this.renderMenuItemIndicatorView,
      'router:page': this.renderNavigationView
    });

    this.listenTo(Adapt.course, 'bubble:change:_isComplete', this.onCompletionChange);
  }

  onCompletionChange(event) {
    if (!Adapt.location._currentId) return;

    const currentModel = Adapt.findById(Adapt.location._currentId);
    const completionState = {
      currentLocation: completionCalculations.calculatePercentageComplete(currentModel),
      course: completionCalculations.calculatePercentageComplete(Adapt.course)
    };
    const hasChanged = !_.isMatch(this._previousCompletionState, completionState);
    if (!hasChanged) return;

    this._previousCompletionState = completionState;
    Adapt.trigger('pageLevelProgress:percentageCompleteChange', completionState);
  }

  renderHeaderIndicatorView(view) {
    const model = view.model;
    const config = model.get('_pageLevelProgress');
    if (!config?._isEnabled || !config?._isCompletionIndicatorEnabled) return;

    const pageModel = model.findAncestor('contentObjects');
    const pageConfig = pageModel && pageModel.get('_pageLevelProgress');
    if (!pageConfig?._isEnabled) return;

    const $headings = view.$('.js-heading');
    $headings.each((index, el) => {
      const $el = $(el);
      const indicatorView = new PageLevelProgressIndicatorView({
        parent: view,
        model
      });
      indicatorView.$el.insertAfter($el);
    });
  }

  // This should add/update progress on menuView
  renderMenuItemIndicatorView(view) {
    // Do not render on menu, only render on menu items
    if (view.model.get('_id') === Adapt.location._currentId) return;

    // Progress bar should not render for course viewType
    const viewType = view.model.get('_type');
    if (viewType === 'course') return;

    // Do not proceed if pageLevelProgress is not enabled for the content object
    const pageLevelProgress = view.model.get('_pageLevelProgress');
    if (!pageLevelProgress?._isEnabled) return;

    view.$el.find('.js-menu-item-progress').append(new PageLevelProgressIndicatorView({
      parent: view,
      model: view.model,
      type: 'menu-item',
      calculatePercentage: this._getMenuItemCompletionPercentage.bind(view),
      ariaLabel: Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressMenuBar
    }).$el);
  }

  _getMenuItemCompletionPercentage() {
    return completionCalculations.calculatePercentageComplete(this.model);
  }

  // This should add/update progress on page navigation bar
  renderNavigationView(pageModel) {
    // Do not render if turned off at course level
    const coursePLPConfig = this.getCourseConfig();
    if (coursePLPConfig?._isShownInNavigationBar === false) return;

    // Do not proceed if pageLevelProgress is not enabled for the content object
    const pagePLPConfig = pageModel.get('_pageLevelProgress');
    if (!pagePLPConfig?._isEnabled) return;

    const collection = new PageLevelProgressCollection(null, {
      pageModel
    });

    if (collection.length === 0) return;

    $('.nav__drawer-btn').after(new PageLevelProgressNavigationView({
      model: pageModel,
      collection
    }).$el);
  }

}

export default (Adapt.pageLevelProgress = new PageLevelProgress());
