/*
 * adapt-contrib-pageLevelProgress
 * License - http://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Daryl Hedley <darylhedley@hotmail.com>, Himanshu Rajotia <himanshu.rajotia@exultcorp.com>
 */
define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var PageLevelProgressMenuView = require('extensions/adapt-contrib-pageLevelProgress/js/PageLevelProgressMenuView');
    var PageLevelProgressNavigationView = require('extensions/adapt-contrib-pageLevelProgress/js/PageLevelProgressNavigationView');

    function setupPageLevelProgress(pageModel, enabledProgressComponents) {

        var componentsCollection = new Backbone.Collection(enabledProgressComponents);

        new PageLevelProgressNavigationView({model: pageModel, collection: componentsCollection});

    }

    // To get only those models who were enabled for pageLevelProgress
    function getPageLevelProgressEnabledModels(models) {
        return _.filter(models, function(model) {
            if (model.get('_pageLevelProgress')) {
                return model.get('_pageLevelProgress')._isEnabled;
            }
        });
    }

    // This should add/update progress on menuView
    Adapt.on('menuView:postRender', function(view) {

        // do not proceed until pageLevelProgress enabled on course.json
        if (!Adapt.course.get('_pageLevelProgress') || !Adapt.course.get('_pageLevelProgress')._isEnabled) {
            return;
        }

        var pageLevelProgress = view.model.get('_pageLevelProgress');
        var viewType = view.model.get('_type');

        // Progress bar should not render for course viewType
        if (viewType == 'course') return;

        if (pageLevelProgress && pageLevelProgress._isEnabled) {

            // This should manage progress of those menuItem which have article as their children.
            if (viewType == 'page') {

                if (!view.model.get('completedChildrenAsPercentage')) {
                    view.model.set('completedChildrenAsPercentage', 0);
                }

                view.$el.find('.menu-item-inner').append(new PageLevelProgressMenuView({model: view.model}).$el);

            }

            // This should manage progress of those menuItem which have sub-menu as their children.
            else if (viewType == 'menu' && view.model.get('_id') != Adapt.location._currentId) {

                var availableContentObjects = view.model.findDescendants('contentObjects').where({'_isAvailable': true});
                var childrenWithProgressEnabled = getPageLevelProgressEnabledModels(availableContentObjects);

                var totalCompletedChildrenAsPercentage = 0;
                _.each(childrenWithProgressEnabled, function(contentObjects, index) {
                    totalCompletedChildrenAsPercentage += contentObjects.get('completedChildrenAsPercentage') | 0;
                });

                var completedChildrenAsPercentage = (totalCompletedChildrenAsPercentage / childrenWithProgressEnabled.length) | 0;
                view.model.set('completedChildrenAsPercentage', completedChildrenAsPercentage);

                view.$el.find('.menu-item-inner').append(new PageLevelProgressMenuView({model: view.model}).$el);

            }

        }

    });

    // This should add/update progress on page navigation bar
    Adapt.on('router:page', function(pageModel) {

        // do not proceed until pageLevelProgress enabled on course.json
        if (!Adapt.course.get('_pageLevelProgress') || !Adapt.course.get('_pageLevelProgress')._isEnabled) {
            return;
        }

        var currentPageComponents = pageModel.findDescendants('components').where({'_isAvailable': true});
        var enabledProgressComponents = getPageLevelProgressEnabledModels(currentPageComponents);

        if (enabledProgressComponents.length > 0) {
            setupPageLevelProgress(pageModel, enabledProgressComponents);
        }

    });

});
