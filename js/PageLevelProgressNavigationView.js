import Adapt from 'core/js/adapt';
import data from 'core/js/data';
import drawer from 'core/js/drawer';
import completionCalculations from './completionCalculations';
import PageLevelProgressView from './PageLevelProgressView';
import PageLevelProgressIndicatorView from './PageLevelProgressIndicatorView';
import getPageLevelProgressItemsJSON from './getPageLevelProgressItems';
import NavigationButtonView from 'core/js/views/NavigationButtonView';
import tooltips from 'core/js/tooltips';

export default class PageLevelProgressNavigationView extends NavigationButtonView {

  events() {
    return {
      click: 'onProgressClicked'
    };
  }

  attributes() {
    const attributes = this.model.toJSON();
    return {
      name: attributes._id,
      role: attributes._role === 'button' ? undefined : attributes._role,
      'data-order': attributes._order,
      'data-tooltip-id': 'pagelevelprogress',
      'aria-expanded': false
    };
  }

  static get template() {
    return 'pageLevelProgressNavigationButton.jsx';
  }

  initialize(options) {
    super.initialize(options);
    this.pageModel = options.pageModel;
    _.bindAll(this, 'updateProgressBar');
    this.refreshProgressBar = _.debounce(this.refreshProgressBar.bind(this), 16);
    this.setUpEventListeners();
    this.render();
    this.addIndicator();
    this.refreshProgressBar();
    this.deferredUpdate();

    tooltips.register({
      _id: 'pagelevelprogress',
      ...Adapt.course.get('_globals')?._extensions?._pageLevelProgress?._navTooltip || {}
    });
    this.tooltip = tooltips.getTooltip('pagelevelprogress');
  }

  setUpEventListeners() {
    this.listenTo(Adapt, {
      remove: this.remove,
      'router:location': this.updateProgressBar,
      'view:childAdded pageLevelProgress:update': this.refreshProgressBar,
      'drawer:closed': this.drawerClosed
    });
    this.listenTo(data, 'change:_isLocked change:_isComplete', this.refreshProgressBar);
  }

  addIndicator() {
    const {
      _useCourseProgressInNavigationButton = false
    } = Adapt.course.get('_pageLevelProgress') ?? {};
    this.indicatorView = new PageLevelProgressIndicatorView({
      model: _useCourseProgressInNavigationButton
        ? Adapt.course
        : this.pageModel,
      calculatePercentage: this._getPageCompletionPercentage.bind(this),
      ariaLabel: this.model.get('ariaLabel')
    });
    const $wrapper = this.$el.find('.pagelevelprogress__indicator-wrapper');
    $wrapper.prepend(this.indicatorView.$el);
  }

  _getPageCompletionPercentage() {
    const {
      _useCourseProgressInNavigationButton = false
    } = Adapt.course.get('_pageLevelProgress') ?? {};
    return _useCourseProgressInNavigationButton
      ? completionCalculations.calculatePercentageComplete(Adapt.course)
      : completionCalculations.calculatePercentageComplete(this.pageModel, true);
  }

  deferredUpdate() {
    _.defer(this.updateProgressBar);
  }

  updateProgressBar() {
    this.indicatorView.refresh();
  }

  refreshProgressBar() {
    const percentageComplete = this._getPageCompletionPercentage();
    this.model.set('percentageComplete', percentageComplete);
    this.tooltip.set('percentageComplete', percentageComplete);
    this.collection = getPageLevelProgressItemsJSON(this.pageModel);
    this.updateProgressBar();
  }

  drawerClosed() {
    this.$el.attr('aria-expanded', false);
  }

  onProgressClicked(event) {
    if (event && event.preventDefault) event.preventDefault();
    this.$el.attr('aria-expanded', true);
    drawer.openCustomView(new PageLevelProgressView({
      collection: this.collection
    }).$el, false, this.model.get('_drawerPosition'));
  }

  remove() {
    super.remove();
  }

}
