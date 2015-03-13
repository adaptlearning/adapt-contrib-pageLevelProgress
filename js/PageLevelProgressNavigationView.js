define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var PageLevelProgressView = require('extensions/adapt-contrib-pageLevelProgress/js/PageLevelProgressView');

    var PageLevelProgressNavigationView = Backbone.View.extend({

        tagName: 'a',

        className: 'page-level-progress-navigation',

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(this.collection, 'change:_isComplete', this.updateProgressBar);
            this.$el.attr('href', '#');
            this.ariaText = '';
            if (Adapt.course.get('_globals')._accessibility && Adapt.course.get('_globals')._accessibility._ariaLabels.pageLevelProgressIndicatorBar) {
                this.ariaText =Adapt.course.get('_globals')._accessibility._ariaLabels.pageLevelProgressIndicatorBar +  ' ';
            }
            this.render();
            _.defer(_.bind(function() {
                this.updateProgressBar();
            }, this));
        },

        events: {
            'click': 'onProgressClicked'
        },

        render: function() {
            var data = this.collection.toJSON();
            var template = Handlebars.templates['pageLevelProgressNavigation'];
            $('.navigation-drawer-toggle-button').after(this.$el.html(template({components: data})));
            return this;
        },

        updateProgressBar: function() {
            var componentCompletionRatio = this.collection.where({_isComplete: true}).length / this.collection.length;
            var percentageOfCompleteComponents = componentCompletionRatio * 100;

            this.$('.page-level-progress-navigation-bar').css('width', percentageOfCompleteComponents + '%');

            // Add percentage of completed components as an aria label attribute
            this.$el.attr('aria-label', this.ariaText +  Math.floor(percentageOfCompleteComponents) + '%');

            // Set percentage of completed components to model attribute to update progress on MenuView
            this.model.set('completedChildrenAsPercentage', percentageOfCompleteComponents);
        },

        onProgressClicked: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            Adapt.drawer.triggerCustomView(new PageLevelProgressView({collection: this.collection}).$el, false);
        }

    });

    return PageLevelProgressNavigationView;

});
