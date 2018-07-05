define([
    'core/js/adapt'
], function(Adapt) {

    var PageLevelProgressIndicatorView = Backbone.View.extend({

        className: function () {
            return [
                'page-level-progress-completion-indicator',
                this.model.get('_type') + '-completion-indicator'
            ].join(' ');
        },

        attributes: function() {
            return {
                'aria-hidden': true
            };
        },

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.listenTo(this.model, "change:_isComplete", this.checkCompletion);
            this.checkCompletion();
            this.render();
        },

        render: function() {
            var data = this.model.toJSON();
            var template = Handlebars.templates[this.constructor.template];
            this.$el.html(template(data));
            return this;
        },

        checkCompletion: function() {
            this.$el.toggleClass("complete", this.model.get("_isComplete"));
        }

    }, {
        template: 'pageLevelProgressIndicator'
    });

    return PageLevelProgressIndicatorView;

});
