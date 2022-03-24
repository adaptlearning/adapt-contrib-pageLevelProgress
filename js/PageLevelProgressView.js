import Adapt from 'core/js/adapt';
import data from 'core/js/data';
import router from 'core/js/router';
import PageLevelProgressItemView from './PageLevelProgressItemView';

export default class PageLevelProgressView extends Backbone.View {

  className() {
    return 'pagelevelprogress';
  }

  events() {
    return {
      'click .js-pagelevelprogress-item-click': 'scrollToPageElement'
    };
  }

  initialize() {
    this.listenTo(Adapt, 'remove', this.remove);
    this.render();
    this.addChildren();
  }

  async scrollToPageElement(event) {
    if (event && event.preventDefault) event.preventDefault();

    const $target = $(event.currentTarget);
    if ($target.is('.is-disabled')) return;

    const id = $target.attr('data-pagelevelprogress-id');
    const model = data.findById(id);

    if (!model.get('_isRendered')) {
      try {
        await Adapt.parentView.renderTo(id);
      } catch (err) {
        return;
      }
    }

    const currentComponentSelector = `.${id}`;

    Adapt.once('drawer:closed', () => {
      router.navigateToElement(currentComponentSelector, { duration: 400 });
    }).trigger('drawer:closeDrawer', $(currentComponentSelector));
  }

  render() {
    const template = Handlebars.templates.pageLevelProgress;
    this.$el.html(template({}));
  }

  addChildren() {
    const $children = this.$('.js-children');
    this.collection.each(model => {
      $children.append(new PageLevelProgressItemView({
        model
      }).$el);
    });
  }

}
