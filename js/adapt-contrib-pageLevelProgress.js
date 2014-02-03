define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');

	var PageLevelProgressView = Backbone.View.extend({

		className: "page-level-progress",

		initialize: function() {
			this.listenTo(Adapt, 'remove', this.remove);
			console.log('this:', this);
			this.render();
		},

		events: {
			'click .page-level-progress-item a': 'scrollToPageElement'
		},

		scrollToPageElement: function(event) {
			event.preventDefault();
			var currentComponentSelector = '.' + $(event.currentTarget).attr('data-page-level-progress-id');
			var $currentComponent = $(currentComponentSelector);
			$(window).scrollTo($currentComponent, {offset:{top:-$('.navigation').height()}});
			Adapt.trigger('page:scrollTo', currentComponentSelector);
		},

		render: function() {
			var data = this.collection.toJSON();
	        var template = Handlebars.templates["pageLevelProgress"];
	        this.$el.html(template({components:data})).appendTo('body');
	        return this;
		}

	});

	function setupPageLevelProgress(currentPageComponents) {
		var componentsCollection = new Backbone.Collection(currentPageComponents);
		new PageLevelProgressView({collection:componentsCollection})
	}

	Adapt.on('router:page', function(pageModel) {
		var currentPageComponents = pageModel.findDescendants('components').where({'_isAvailable': true});
		setupPageLevelProgress(currentPageComponents);
	});

})