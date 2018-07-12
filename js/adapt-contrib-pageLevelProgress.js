define([
    'core/js/adapt',
    './completionCalculations',
    './PageLevelProgressNavigationView',
    './PageLevelProgressIndicatorView'
], function(Adapt, completionCalculations, PageLevelProgressNavigationView, PageLevelProgressIndicatorView) {

    var types = [ 'menu', 'page', 'article', 'block', 'component' ];
    var eventNames = types.concat(['']).join('View:render ');
    Adapt.on(eventNames, function(view) {
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
    });


    // This should add/update progress on menuView
    Adapt.on('menuView:postRender', function(view) {
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
            calculatePercentage: function() {
                var completionObject = completionCalculations.calculateCompletion(view.model);
                var completed = completionObject.nonAssessmentCompleted + completionObject.subProgressCompleted;
                var total = completionObject.nonAssessmentTotal + completionObject.subProgressTotal;
                // take all non-assessment components and subprogress info into the percentage
                // this allows the user to see if the assessments are passed (subprogress) and all other components are complete
                var percentageComplete = Math.floor((completed / total) * 100);
                return percentageComplete;
            },
            ariaLabel: Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressMenuBar
        }).$el);

    });

    // This should add/update progress on page navigation bar
    Adapt.on('router:page', function(pageModel) {
        var coursePLPConfig = Adapt.course.get('_pageLevelProgress');
        var pagePLPConfig = pageModel.get('_pageLevelProgress');

        // do not proceed if pageLevelProgress is not enabled in course.json or for the content object
        if (!coursePLPConfig || !coursePLPConfig._isEnabled || !pagePLPConfig || !pagePLPConfig._isEnabled) {
            return;
        }

        var currentPageItems = _.filter(pageModel.getAllDescendantModels(true), function(comp) {
            return comp.get('_isAvailable') === true;
        });
        var availableItems = completionCalculations.filterAvailableChildren(currentPageItems);
        var enabledProgressItems = completionCalculations.getPageLevelProgressEnabledModels(availableItems);

        if (enabledProgressItems.length === 0) return;

        $('.navigation-drawer-toggle-button').after(new PageLevelProgressNavigationView({
            model: pageModel,
            collection: new Backbone.Collection(enabledProgressItems)
        }).$el);

    });

});
