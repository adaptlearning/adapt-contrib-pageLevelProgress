import Adapt from 'core/js/adapt';
import data from 'core/js/data';
import location from 'core/js/location';
import completionCalculations from './completionCalculations';
import PageLevelProgressNavigationView from './PageLevelProgressNavigationView';
import PageLevelProgressIndicatorView from './PageLevelProgressIndicatorView';
import getPageLevelProgressItems from './getPageLevelProgressItems';
import navigation from 'core/js/navigation';
import NavigationButtonModel from 'core/js/models/NavigationButtonModel';

class PageLevelProgress extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, {
      'app:dataReady': this.onDataReady,
      'app:languageChanged': this.onLanguageChange
    });
  }

  static get globalsConfig() {
    return Adapt.course.get('_globals')?._extensions?._pageLevelProgress;
  }

  static get courseConfig() {
    return Adapt.course.get('_pageLevelProgress');
  }

  onDataReady() {
    // Do not proceed if pageLevelProgress is not enabled in course.json
    const coursePLPConfig = PageLevelProgress.courseConfig;
    if (!coursePLPConfig?._isEnabled) return;
    this.setUpEventListeners();
  }

  onLanguageChange() {
    this.stopListening();
    this.initialize();
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
      'router:contentObject': this.renderNavigationView
    });

    this.listenTo(Adapt.course, 'bubble:change:_isComplete bubble:change:_isVisited', this.onCompletionChange);
  }

  onCompletionChange(event) {
    if (!location._currentId) return;

    const currentModel = data.findById(location._currentId);
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

    const pageModel = model.findAncestor('contentobject');
    const pageConfig = pageModel && pageModel.get('_pageLevelProgress');
    if (!pageConfig?._isEnabled) return;

    const $headings = view.$('.js-heading');
    $headings.each((index, el) => {
      const $el = $(el);
      const indicatorView = new PageLevelProgressIndicatorView({
        parent: view,
        model
      });
      const isBackwardCompatible = [...$el[0].classList].every(name => !name.includes('-inner'));
      if (isBackwardCompatible) {
        indicatorView.$el.insertAfter($el);
        return;
      }
      indicatorView.$el.insertBefore($el);
    });
  }

  // This should add/update progress on menuView
  renderMenuItemIndicatorView(view) {
    // Do not render on menu, only render on menu items
    if (view.model.get('_id') === location._currentId) return;

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
      ariaLabel: PageLevelProgress.globalsConfig?.pageLevelProgressMenuBar
    }).$el);
  }

  // This should add/update progress on page navigation bar
  renderNavigationView(pageModel) {
    // Do not render if _isDefaultNavigationDisabled is set to true
    const navigationConfig = Adapt.course.get('_navigation');
    if (navigationConfig?._isDefaultNavigationDisabled) return;

    // Do not render if turned off at course level
    const coursePLPConfig = PageLevelProgress.courseConfig;
    if (coursePLPConfig?._isShownInNavigationBar === false) return;

    // Do not proceed if pageLevelProgress is not enabled for the content object
    const pagePLPConfig = pageModel.get('_pageLevelProgress');
    if (!pagePLPConfig?._isEnabled) return;

    // Progress bar should not render for course viewType
    const viewType = pageModel.get('_type');
    if (viewType === 'course' && coursePLPConfig._showAtCourseLevel !== true) return;

    const collection = getPageLevelProgressItems(pageModel);
    if (!collection) return;

    const {
      _navOrder = 0,
      _showLabel = true,
      navLabel = '',
      pageLevelProgressIndicatorBar = '',
      _drawerPosition = 'auto'
    } = PageLevelProgress.globalsConfig ?? {};

    const model = new NavigationButtonModel({
      _id: 'pagelevelprogress',
      _order: _navOrder,
      _showLabel,
      _classes: 'nav__pagelevelprogress-btn pagelevelprogress__nav-btn',
      _iconClasses: '',
      _role: 'button',
      ariaLabel: pageLevelProgressIndicatorBar,
      text: navLabel,
      _drawerPosition
    });

    navigation.addButton(new PageLevelProgressNavigationView({
      model,
      pageModel,
      collection
    }));
  }

}

export default (Adapt.pageLevelProgress = new PageLevelProgress());
