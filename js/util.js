/*
 * adapt-contrib-pageLevelProgress
 * License - http://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Daryl Hedley <darylhedley@hotmail.com>, Himanshu Rajotia <himanshu.rajotia@exultcorp.com>, "Oliver Foster" <oliver.foser@kineo.com>
 */
define(function() {
    
    // Calculate completion of a contentObject
    function calculateCompletion(contentObjectModel) {

        var viewType = contentObjectModel.get('_type'),
            totalComponentsEnabled = 0,
            totalComponentsCompleted = 0;

        // If it's a page
        if (viewType == 'page') {
            var children = contentObjectModel.findDescendants('components').where({'_isAvailable': true, '_isOptional': false});
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
        else if (viewType == 'menu') {
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

    //Get only those models who were enabled for pageLevelProgress
    function getPageLevelProgressEnabledModels(models) {
        return _.filter(models, function(model) {
            if (model.get('_pageLevelProgress')) {
                return model.get('_pageLevelProgress')._isEnabled;
            }
        });
    }

    return {
    	calculateCompletion: calculateCompletion,
    	getPageLevelProgressEnabledModels: getPageLevelProgressEnabledModels
    };

})