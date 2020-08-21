define([
 'core/js/adapt',
 './PageLevelProgressItemView'
], function(Adapt, PageLevelProgressItemView) {

  var PageLevelProgressView = Backbone.View.extend({

    className: 'pagelevelprogress',

    events: {
      'click .js-pagelevelprogress-item-click': 'scrollToPageElement'
    },

    initialize: function() {
      this.listenTo(Adapt, 'remove', this.remove);
      this.render();
      this.addChildren();
    },

    scrollToPageElement: async function(event) {
      if (event && event.preventDefault) event.preventDefault();

      var $target = $(event.currentTarget);
      if ($target.is('.is-disabled')) return;

      var id = $target.attr('data-pagelevelprogress-id');
      var model = Adapt.findById(id);

      if (!model.get('_isRendered')) {
        try {
          await Adapt.parentView.renderTo(id);
        } catch(err) {
          return;
        }
      }

      var currentComponentSelector = '.' + id;

      Adapt.once('drawer:closed', function() {
        Adapt.scrollTo(currentComponentSelector, { duration: 400 });
      }).trigger('drawer:closeDrawer', $(currentComponentSelector));
    },

    render: function() {
      var template = Handlebars.templates['pageLevelProgress'];
      this.$el.html(template({}));
    },

    addChildren: function() {
      var $children = this.$('.js-children');
      this.collection.each(function(model) {
        $children.append(new PageLevelProgressItemView({
          model: model
        }).$el);
      }.bind(this));
    }

  });

  return PageLevelProgressView;

});
