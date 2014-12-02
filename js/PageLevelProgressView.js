define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var PageLevelProgressView = Backbone.View.extend({

        className: 'page-level-progress',

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.render();
        },

        events: {
            'click .page-level-progress-item a': 'scrollToPageElement'
        },

        scrollToPageElement: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            var currentComponentSelector = '.' + $(event.currentTarget).attr('data-page-level-progress-id');
            var $currentComponent = $(currentComponentSelector);
            $(window).scrollTo($currentComponent, {offset: {top: -$('.navigation').height()}});
            Adapt.trigger('page:scrollTo', currentComponentSelector);
            Adapt.trigger('drawer:closeDrawer');
        },

        render: function() {
            var data = this.collection.toJSON();
            var template = Handlebars.templates['pageLevelProgress'];
            this.$el.html(template({components: data}));
            return this;
        }

    });

    return PageLevelProgressView;

});
