define([
    'core/js/adapt'
], function(Adapt) {

    var PageLevelProgressMenuView = Backbone.View.extend({

        className: 'page-level-progress-menu-item',

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);

            this.ariaText = Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressMenuBar + ' ';

            this.render();

            _.defer(this.updateProgressBar.bind(this));
        },

        render: function() {
            var data = this.model.toJSON();
            _.extend(data, {
                _globals: Adapt.course.get('_globals')
            });
            var template = Handlebars.templates['pageLevelProgressMenu'];

            this.$el.html(template(data));
            return this;
        },

        updateProgressBar: function() {
            var percentageComplete = this.model.get('completedChildrenAsPercentage') || 0;

            // Add percentage of completed components as an aria label attribute
            this.$('.page-level-progress-menu-item-indicator-bar .aria-label').html(this.ariaText + Math.floor(percentageComplete) + '%');
        }

    });

    return PageLevelProgressMenuView;

});
