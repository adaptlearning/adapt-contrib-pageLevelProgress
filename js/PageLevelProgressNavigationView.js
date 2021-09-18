import Adapt from 'core/js/adapt';
import completionCalculations from './completionCalculations';
import PageLevelProgressView from './PageLevelProgressView';
import PageLevelProgressIndicatorView from './PageLevelProgressIndicatorView';

export default class PageLevelProgressNavigationView extends Backbone.View {

  tagName() {
    return 'button';
  }

  className() {
    return 'btn-icon nav__btn nav__pagelevelprogress-btn pagelevelprogress__nav-btn';
  }

  events() {
    return {
      click: 'onProgressClicked'
    };
  }

  initialize() {
    _.bindAll(this, 'updateProgressBar');
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
  }

  render() {
    const template = Handlebars.templates.pageLevelProgressNavigation;
    this.$el.html(template({}));
  }

  addIndicator() {
    this.indicatorView = new PageLevelProgressIndicatorView({
      model: this.model,
      collection: this.collection,
      calculatePercentage: this._getPageCompletionPercentage,
      ariaLabel: Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressIndicatorBar
    });
    this.$el.prepend(this.indicatorView.$el);
  }

  _getPageCompletionPercentage() {
    return completionCalculations.calculatePercentageComplete(this.model);
  }

  deferredUpdate() {
    _.defer(this.updateProgressBar);
  }

  updateProgressBar() {
    this.indicatorView.refresh();
  }

  refreshProgressBar() {
    this.collection.repopulate();
    this.updateProgressBar();
  }

  onProgressClicked(event) {
    if (event && event.preventDefault) event.preventDefault();
    Adapt.drawer.triggerCustomView(new PageLevelProgressView({
      collection: this.collection
    }).$el, false);
  }

  remove() {
    super.remove();
    this.collection.reset();
  }

}
