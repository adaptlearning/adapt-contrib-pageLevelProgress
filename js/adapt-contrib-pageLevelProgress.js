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

    // Calculate completion of a contentObject
    function calculateCompletion(contentObjectModel) {

        var viewType = contentObjectModel.get('_type'),
            totalComponentsEnabled = 0,
            totalComponentsCompleted = 0;

        // If it's a page
        if (viewType == 'page') {
            var children = contentObjectModel.findDescendants('components').where({'_isAvailable': true});
            var components = getPageLevelProgressEnabledModels(children);

            totalComponentsEnabled = components.length | 0,
            totalComponentsCompleted = _.filter(components, function(item) {
                return item.get('_isComplete');
            }).length;

            return {
                "completed": totalComponentsCompleted,
                "total": totalComponentsEnabled
            };
        }
        // If it's a sub-menu
        else if (viewType == 'menu' && contentObjectModel.get('_id') != Adapt.location._currentId) {
            _.each(contentObjectModel.get('_children').models, function(contentObject) {
                var completionObject = calculateCompletion(contentObject);
                totalComponentsEnabled += completionObject.total;
                totalComponentsCompleted += completionObject.completed;
            });
            return {
                "completed": totalComponentsCompleted,
                "total": totalComponentsEnabled
            };
        }
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

            var completionObject = calculateCompletion(view.model);
            var percentageComplete = (completionObject.completed / completionObject.total)*100;
            view.model.set('completedChildrenAsPercentage', percentageComplete);
            view.$el.find('.menu-item-inner').append(new PageLevelProgressMenuView({model: view.model}).$el);

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
