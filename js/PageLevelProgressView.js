define([
   'core/js/adapt',
   './PageLevelProgressItemView'
], function(Adapt, PageLevelProgressItemView) {

    var PageLevelProgressView = Backbone.View.extend({

        className: 'pagelevelprogress',

        events: {
            'click .pagelevelprogress-item button': 'scrollToPageElement'
        },

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.render();
            this.addChildren();
        },

        scrollToPageElement: function(event) {
            if (event && event.preventDefault) event.preventDefault();

            var $target = $(event.currentTarget);
            if ($target.is('.disabled')) return;

            var currentComponentSelector = '.' + $target.attr('data-pagelevelprogress-id');

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
