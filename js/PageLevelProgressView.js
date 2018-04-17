define([
   'core/js/adapt'
], function(Adapt) {

    var PageLevelProgressView = Backbone.View.extend({

        className: 'page-level-progress',

        events: {
            'click .page-level-progress-item button': 'scrollToPageElement'
        },

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.render();
        },

        scrollToPageElement: function(event) {
            if(event && event.preventDefault) event.preventDefault();

            var currentComponentSelector = '.' + $(event.currentTarget).attr('data-page-level-progress-id');

            Adapt.once('drawer:closed', function() {
                Adapt.scrollTo(currentComponentSelector, { duration: 400 });
            }).trigger('drawer:closeDrawer');
        },

        render: function() {
            var data = {
                components: this.collection.toJSON(),
                _globals: Adapt.course.get('_globals')
            };
            var template = Handlebars.templates['pageLevelProgress'];
            this.$el.html(template(data));
            this.$el.a11y_aria_label(true);
            return this;
        }

    });

    return PageLevelProgressView;

});
