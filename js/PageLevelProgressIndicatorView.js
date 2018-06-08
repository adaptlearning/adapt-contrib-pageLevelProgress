define([
    'core/js/adapt'
], function(Adapt) {

    var PageLevelProgressIndicatorView = Backbone.View.extend({

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
        },

        render: function() {
            var data = this.model.toJSON();
            var template = Handlebars.templates[this.constructor.template];
            this.$el.html(template(data));
            return this;
        }

    }, {
        template: 'pageLevelProgressIndicator'
    });

    return PageLevelProgressIndicatorView;

});
