import Adapt from 'core/js/adapt';
import data from 'core/js/data';
import drawer from 'core/js/drawer';
import completionCalculations from './completionCalculations';
import PageLevelProgressView from './PageLevelProgressView';
import PageLevelProgressIndicatorView from './PageLevelProgressIndicatorView';
import getPageLevelProgressItemsJSON from './getPageLevelProgressItems';

export default class PageLevelProgressNavigationView extends Backbone.View {

  tagName() {
    return 'button';
  }

  className() {
    return 'btn-icon nav__btn nav__pagelevelprogress-btn pagelevelprogress__nav-btn';
  }

  attributes() {
    return {
      'data-order': this.globalsConfig?._navOrder ?? 0
    };
  }

  events() {
    return {
      click: 'onProgressClicked'
    };
  }

  initialize() {
    _.bindAll(this, 'updateProgressBar');
    this.refreshProgressBar = _.debounce(this.refreshProgressBar.bind(this), 16);
    this.setUpEventListeners();
    this.render();
    this.addIndicator();
    this.deferredUpdate();
  }

  setUpEventListeners() {
    this.listenTo(Adapt, {
      remove: this.remove,
      'router:location': this.updateProgressBar,
      'view:childAdded pageLevelProgress:update': this.refreshProgressBar
    });
    this.listenTo(data, 'change:_isLocked change:_isComplete', this.refreshProgressBar);
  }

  render() {
    const template = Handlebars.templates.pageLevelProgressNavigation;
    this.$el.html(template({}));
  }

  addIndicator() {
    this.indicatorView = new PageLevelProgressIndicatorView({
      model: this.model,
      calculatePercentage: this._getPageCompletionPercentage,
      ariaLabel: this.globalsConfig?.pageLevelProgressIndicatorBar
    });
    this.$el.prepend(this.indicatorView.$el);
  }

  _getPageCompletionPercentage() {
    return completionCalculations.calculatePercentageComplete(this.model, true);
  }

  deferredUpdate() {
    _.defer(this.updateProgressBar);
  }

  updateProgressBar() {
    this.indicatorView.refresh();
  }

  refreshProgressBar() {
    this.collection = getPageLevelProgressItemsJSON(this.model);
    this.updateProgressBar();
  }

  get globalsConfig() {
    return Adapt.course.get('_globals')._extensions._pageLevelProgress;
  }

  onProgressClicked(event) {
    if (event && event.preventDefault) event.preventDefault();
    drawer.triggerCustomView(new PageLevelProgressView({
      collection: this.collection
    }).$el, false, this.globalsConfig?._drawerPosition);
  }

  remove() {
    super.remove();
  }

}
