define([
    'core/js/adapt',
    './completionCalculations',
    './PageLevelProgressNavigationView',
    './PageLevelProgressIndicatorView',
    './PageLevelProgressCollection'
], function(Adapt, completionCalculations, PageLevelProgressNavigationView, PageLevelProgressIndicatorView, PageLevelProgressCollection) {

    var PageLevelProgress = Backbone.Controller.extend({

        initialize: function() {
            this.setUpEventListeners();
        },

        setUpEventListeners: function() {
            var headerIndicatorTypes = [
                    'menu',
                    'page',
                    'article',
                    'block',
                    'component'
                ];

            var headerIndicatorEventNames = headerIndicatorTypes
                .concat(['']).join('View:render ');

            this.listenTo(Adapt, headerIndicatorEventNames, this.renderHeaderIndicatorView);

            this.listenTo(Adapt, {
                'menuView:postRender': this.renderMenuItemIndicatorView,
                'router:page': this.renderNavigationView
            });
        },

        renderHeaderIndicatorView: function(view) {
            var model = view.model;
            var config = model.get('_pageLevelProgress');
            if (!config || !config._isEnabled || !config._isCompletionIndicatorEnabled) return;
            var $headings = view.$('.js-heading');
            $headings.each(function(index, el) {
                var $el = $(el);
                var indicatorView = new PageLevelProgressIndicatorView({
                    model: model
                });
                indicatorView.$el.insertAfter($el);
            });
        },

        // This should add/update progress on menuView
        renderMenuItemIndicatorView: function(view) {
            if (view.model.get('_id') == Adapt.location._currentId) return;

            var coursePLPConfig = Adapt.course.get('_pageLevelProgress');

            // do not proceed if pageLevelProgress is not enabled in course.json
            if (!coursePLPConfig || !coursePLPConfig._isEnabled) {
                return;
            }

            var pageLevelProgress = view.model.get('_pageLevelProgress');
            var viewType = view.model.get('_type');

            // Progress bar should not render for course viewType
            if (viewType == 'course') return;

            if (!pageLevelProgress || !pageLevelProgress._isEnabled) return;

            view.$el.find('.js-menu-item-progress').append(new PageLevelProgressIndicatorView({
                model: view.model,
                type: "menu-item",
                calculatePercentage: this._getMenuItemCompletionPercentage.bind(view),
                ariaLabel: Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressMenuBar
            }).$el);
        },

        _getMenuItemCompletionPercentage: function() {
            return completionCalculations.calculatePercentageComplete(this.model);
        },

        // This should add/update progress on page navigation bar
        renderNavigationView: function(pageModel) {
            var coursePLPConfig = Adapt.course.get('_pageLevelProgress');
            var pagePLPConfig = pageModel.get('_pageLevelProgress');

            // do not proceed if pageLevelProgress is not enabled in course.json or for the content object
            if (!coursePLPConfig || !coursePLPConfig._isEnabled || !pagePLPConfig || !pagePLPConfig._isEnabled) {
                return;
            }

            var collection = new PageLevelProgressCollection(null, { pageModel: pageModel});
            if (collection.length === 0) return;

            $('.navigation-drawer-toggle-button').after(new PageLevelProgressNavigationView({
                model: pageModel,
                collection: collection
            }).$el);
        }

    });

    Adapt.pageLevelProgress = new PageLevelProgress();

});
