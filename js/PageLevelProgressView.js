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

    scrollToPageElement: function(event) {
      if (event && event.preventDefault) event.preventDefault();

      var $target = $(event.currentTarget);
      if ($target.is('.is-disabled')) return;

      var id = $target.attr('data-pagelevelprogress-id');
      var currentComponentSelector = '.' + id;

      var model = Adapt.findById(id);
      var modelType = model.get('_type');
      var contentObjectId = id;
      if (modelType !== 'page' && modelType !== 'menu') {
        contentObjectId = model.findAncestor('contentObjects').get('_id');
      }

      var focusSelector = (Adapt.location._currentId === contentObjectId) ?
        currentComponentSelector :
        'body';

      Adapt.once('drawer:closed', function() {
        Adapt.navigateToElement(currentComponentSelector, { duration: 400 });
      }).trigger('drawer:closeDrawer', $(focusSelector));
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
