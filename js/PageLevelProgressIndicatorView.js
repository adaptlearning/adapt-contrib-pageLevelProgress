import Adapt from 'core/js/adapt';

class PageLevelProgressIndicatorView extends Backbone.View {

  initialize(options) {
    options = options || {};
    this.parent = options.parent;
    this.calculatePercentage = options.calculatePercentage || this.calculatePercentage;
    this.ariaLabel = options.ariaLabel || '';
    this.type = options.type || this.model.get('_type');
    this.addClasses();
    this.setUpEventListeners();
    this.setPercentageComplete();
    this.render();
    this.refresh();
  }

  addClasses() {
    this.$el.addClass([
      'pagelevelprogress__indicator',
      'is-' + this.type
    ].join(' '));
  }

  checkAria() {
    if (!this.ariaLabel) {
      this.$el.attr('aria-hidden', true);
      return;
    }
    const data = this.getRenderData();
    this.$('.js-indicator-aria-label').html(Handlebars.compile(this.ariaLabel)(data));
  }

  setUpEventListeners() {
    if (this.parent) {
      this.listenToOnce(this.parent, 'postRemove', this.remove);
    } else {
      this.listenTo(Adapt, 'remove', this.remove);
    }
    this.listenTo(this.model, 'change:_isComplete', this.refresh);
    if (!this.collection) return;
    this.listenTo(this.collection, 'change:_isComplete', this.refresh);
  }

  setPercentageComplete() {
    const percentage = this.calculatePercentage();
    this.model.set('percentageComplete', percentage);
    return percentage;
  }

  calculatePercentage() {
    return this.model.get('_isComplete') ? 100 : 0;
  }

  render() {
    const data = this.getRenderData();
    const template = Handlebars.templates[this.constructor.template];
    this.$el.html(template(data));
  }

  getRenderData() {
    const data = this.model.toJSON();
    data.ariaLabel = this.ariaLabel;
    data.type = this.type;
    return data;
  }

  refresh() {
    this.checkCompletion();
    this.checkAria();
    this.$('.js-indicator-bar').css({
      width: this.calculatePercentage() + '%'
    });
  }

  checkCompletion() {
    const percentage = this.setPercentageComplete();
    this.$el
      .toggleClass('is-complete', percentage === 100)
      .toggleClass('is-incomplete', percentage !== 100);
  }

}

PageLevelProgressIndicatorView.template = 'pageLevelProgressIndicator';

export default PageLevelProgressIndicatorView;
