import Adapt from 'core/js/adapt';
import PageLevelProgressIndicatorView from './PageLevelProgressIndicatorView';

class PageLevelProgressItemView extends Backbone.View {

  className() {
    return [
      'pagelevelprogress__item drawer__item',
      this.model.get('_type') + '__indicator'
    ].join(' ');
  }

  attributes() {
    return {
      role: 'listitem'
    };
  }

  initialize() {
    this.listenTo(Adapt, 'remove', this.remove);
    this.render();
    this.addIndicator();
  }

  render() {
    const data = this.model.toJSON();
    const template = Handlebars.templates[this.constructor.template];
    this.$el.html(template(data));
  }

  addIndicator() {
    if (this.model.get('_isOptional')) return;
    const item = new PageLevelProgressIndicatorView({
      model: this.model
    });
    this.$('.js-indicator').append(item.$el);
  }

}

PageLevelProgressItemView.template = 'pageLevelProgressItem';

export default PageLevelProgressItemView;
