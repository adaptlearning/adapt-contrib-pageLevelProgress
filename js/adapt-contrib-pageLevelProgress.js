/*
* Page Level Progress
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Daryl Hedley <darylhedley@hotmail.com>
*/

define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');

	var PageLevelProgressView = Backbone.View.extend({

		className: "page-level-progress",

		initialize: function() {
			this.listenTo(Adapt, 'remove', this.remove);
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
			Adapt.trigger('drawer:closeDrawer');
		},

		render: function() {
			var data = this.collection.toJSON();
	        var template = Handlebars.templates["pageLevelProgress"];
	        this.$el.html(template({components:data}));
	        return this;
		}

	});

	var PageLevelProgressNavigationView = Backbone.View.extend({

		tagName: 'a',

		className: 'page-level-progress-navigation',

		initialize: function() {
			this.listenTo(Adapt, 'remove', this.remove);
			this.listenTo(this.collection, 'change:_isComplete', this.updateProgressBar);
			this.$el.attr('href', '#');
			this.render();
			this.updateProgressBar();
		},

		events: {
			'click': 'onProgressClicked'
		},

		render: function() {
			var data = this.collection.toJSON();
	        var template = Handlebars.templates["pageLevelProgressNavigation"];
	        $('.navigation-drawer-toggle-button').after(this.$el.html(template({components:data})));
	        return this;
		},

		updateProgressBar: function() {
			var componentCompletionRatio = this.collection.where({_isComplete:true}).length / this.collection.length;
			var percentageOfCompleteComponents = componentCompletionRatio*100;

			this.$('.page-level-progress-navigation-bar').css('width', percentageOfCompleteComponents+'%');

		},

		onProgressClicked: function(event) {
			event.preventDefault();
			Adapt.drawer.triggerCustomView(new PageLevelProgressView({collection:this.collection}).$el, false);
		}

	});

	function setupPageLevelProgress(enabledProgressComponents) {

		var componentsCollection = new Backbone.Collection(enabledProgressComponents);

		new PageLevelProgressNavigationView({collection:componentsCollection});
	
	}

	Adapt.on('router:page', function(pageModel) {
		var currentPageComponents = pageModel.findDescendants('components').where({'_isAvailable': true});

		var enabledProgressComponents = _.filter(currentPageComponents, function(component) {
			if (component.attributes._pageLevelProgress) {
				return component.attributes._pageLevelProgress._isEnabled;
			}
		});

		if (enabledProgressComponents.length > 0) {
			setupPageLevelProgress(enabledProgressComponents);
		}

	});

})