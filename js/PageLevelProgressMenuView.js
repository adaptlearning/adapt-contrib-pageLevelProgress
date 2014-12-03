define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var PageLevelProgressMenuView = Backbone.View.extend({

        className: 'page-level-progress-menu-item',

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.render();
        },

        events: {
        },

        render: function() {
            var data = this.model.toJSON();
            var template = Handlebars.templates['pageLevelProgressMenu'];
            this.$el.html(template(data));
            return this;
        }

    });

    return PageLevelProgressMenuView;

});
