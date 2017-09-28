define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');
    var completionCalculations = require('./completionCalculations');

    var PageLevelProgressMenuView = require('extensions/adapt-contrib-pageLevelProgress/js/PageLevelProgressMenuView');
    var PageLevelProgressNavigationView = require('extensions/adapt-contrib-pageLevelProgress/js/PageLevelProgressNavigationView');

    function setupPageLevelProgress(pageModel, plpList) {
        new PageLevelProgressNavigationView({model: pageModel, collection: new Backbone.Collection(plpList)});
    }

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

        if (pageLevelProgress && pageLevelProgress._isEnabled) {
            var completionObject = completionCalculations.calculateCompletion(view.model);

            //take all non-assessment components and subprogress info into the percentage
            //this allows the user to see if the assessments are passed (subprogress) and all other components are complete

            var completed = completionObject.nonAssessmentCompleted + completionObject.subProgressCompleted;
            var total = completionObject.nonAssessmentTotal + completionObject.subProgressTotal;

            var percentageComplete = Math.floor((completed / total) * 100);

            view.model.set('completedChildrenAsPercentage', percentageComplete);
            view.$el.find('.menu-item-inner').append(new PageLevelProgressMenuView({model: view.model}).$el);
        }
    });

    // This should add/update progress on page navigation bar
    Adapt.on('router:page', function(pageModel) {
        var coursePLPConfig = Adapt.course.get('_pageLevelProgress');
        var pagePLPConfig = pageModel.get('_pageLevelProgress');

        // do not proceed if pageLevelProgress is not enabled in course.json or for the content object
        if (!coursePLPConfig || !coursePLPConfig._isEnabled || !pagePLPConfig || !pagePLPConfig._isEnabled) {
            return;
        }

        var currentPageComponents = _.filter(pageModel.findDescendantModels('components'), function(comp) {
            return comp.get('_isAvailable') === true;
        });
        var availableComponents = completionCalculations.filterAvailableChildren(currentPageComponents);
        var plpList = completionCalculations.getPageLevelProgressEnabledModels(availableComponents);
        if (Adapt.course.get('_pageLevelProgress')._showArticleTitles) {
        plpList = completionCalculations.generateListWithTitles(pageModel.findDescendants('articles').models, plpList);
        }

        if (plpList.length > 0) {
            setupPageLevelProgress(pageModel, plpList);
        }
    });

});
