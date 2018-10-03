define([
    'core/js/adapt',
    './completionCalculations',
    './PageLevelProgressNavigationView',
    './PageLevelProgressIndicatorView',
    './PageLevelProgressCollection'
], function(Adapt, completionCalculations, PageLevelProgressNavigationView, PageLevelProgressIndicatorView, PageLevelProgressCollection) {

    var PageLevelProgress = Backbone.Controller.extend({

        initialize: function() {
            this.listenTo(Adapt, 'app:dataReady', this.onDataReady);
        },

        getCourseConfig: function() {
            return Adapt.course.get('_pageLevelProgress');
        },

        onDataReady: function() {
            // Do not proceed if pageLevelProgress is not enabled in course.json
            var coursePLPConfig = this.getCourseConfig();
            if (!coursePLPConfig || !coursePLPConfig._isEnabled) {
                return;
            }
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
            if (!config || !config._isEnabled || !config._isCompletionIndicatorEnabled) {
                return;
            }

            var pageModel = _.find(model.getAncestorModels(), function (item) {
                return item.get('_type') === "page";
            });
            var pageConfig = pageModel && pageModel.get('_pageLevelProgress');
            if (pageConfig && !pageConfig._isEnabled) {
                return;
            }

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
            // Do not render on menu, only render on menu items
            if (view.model.get('_id') === Adapt.location._currentId) {
                return;
            }

            // Progress bar should not render for course viewType
            var viewType = view.model.get('_type');
            if (viewType === 'course') {
                return;
            }

            // Do not proceed if pageLevelProgress is not enabled for the content object
            var pageLevelProgress = view.model.get('_pageLevelProgress');
            if (!pageLevelProgress || !pageLevelProgress._isEnabled) {
                return;
            }

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
            // Do not render if turned off at course level
            var coursePLPConfig = this.getCourseConfig();
            if (coursePLPConfig && coursePLPConfig._isShownInNavigationBar === false) {
                return;
            }

            // Do not proceed if pageLevelProgress is not enabled for the content object
            var pagePLPConfig = pageModel.get('_pageLevelProgress');
            if (!pagePLPConfig || !pagePLPConfig._isEnabled) {
                return;
            }

            var collection = new PageLevelProgressCollection(null, {
                pageModel: pageModel
            });

            if (collection.length === 0) {
                return;
            }

            $('.navigation-drawer-toggle-button').after(new PageLevelProgressNavigationView({
                model: pageModel,
                collection: collection
            }).$el);
        }

    });

    Adapt.pageLevelProgress = new PageLevelProgress();

});
