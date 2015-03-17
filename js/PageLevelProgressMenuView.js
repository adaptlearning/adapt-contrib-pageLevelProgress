define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var PageLevelProgressMenuView = Backbone.View.extend({

        className: 'page-level-progress-menu-item',

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);

            this.ariaText = '';
            if (Adapt.course.get('_globals')._accessibility && Adapt.course.get('_globals')._accessibility._ariaLabels.pageLevelProgressIndicatorBar) {
                this.ariaText = Adapt.course.get('_globals')._accessibility._ariaLabels.pageLevelProgressIndicatorBar + ' ';
            }

            this.render();

            _.defer(_.bind(function() {
                this.updateProgressBar();
            }, this));
        },

        events: {
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
            if (this.model.get('completedChildrenAsPercentage')) {
                var percentageOfCompleteComponents = this.model.get('completedChildrenAsPercentage');
            } else {
                var percentageOfCompleteComponents = 0;
            }

            //this.$('.page-level-progress-menu-item-indicator-bar').css('width', percentageOfCompleteComponents + '%');

            // Add percentage of completed components as an aria label attribute
            this.$('.page-level-progress-menu-item-indicator-bar').attr('aria-label', this.ariaText + Math.floor(percentageOfCompleteComponents) + '%');
        },

    });

    return PageLevelProgressMenuView;

});
