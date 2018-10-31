define([
    'core/js/adapt'
], function(Adapt) {

    // Calculate completion of a contentObject
    function calculateCompletion(contentObjectModel) {

        var viewType = contentObjectModel.get('_type');
        var nonAssessmentComponentsTotal = 0;
        var nonAssessmentComponentsCompleted = 0;
        var assessmentComponentsTotal = 0;
        var assessmentComponentsCompleted = 0;
        var subProgressCompleted = 0;
        var subProgressTotal = 0;
        var isComplete = contentObjectModel.get("_isComplete") ? 1 : 0;
        var children;

        switch (viewType) {
            case 'page':
                // If it's a page
                var descendantComponents = contentObjectModel.findDescendantModels('components');
                children = descendantComponents.filter(function(comp) {
                    return comp.get('_isAvailable') === true && comp.get('_isOptional') === false;
                });

                var availableChildren = filterAvailableChildren(children);
                var components = getPageLevelProgressEnabledModels(availableChildren);

                var nonAssessmentComponents = getNonAssessmentComponents(components);

                nonAssessmentComponentsTotal = nonAssessmentComponents.length;
                nonAssessmentComponentsCompleted = getComponentsCompleted(nonAssessmentComponents).length;

                var assessmentComponents = getAssessmentComponents(components);

                assessmentComponentsTotal = assessmentComponents.length;
                assessmentComponentsCompleted = getComponentsInteractionCompleted(assessmentComponents).length;

                if (!contentObjectModel.get('_pageLevelProgress')._excludeAssessments) {
                    subProgressCompleted = contentObjectModel.get("_subProgressComplete") || 0;
                    subProgressTotal = contentObjectModel.get("_subProgressTotal") || 0;
                }

                var pageCompletion = {
                    "subProgressCompleted": subProgressCompleted,
                    "subProgressTotal": subProgressTotal,
                    "nonAssessmentCompleted": nonAssessmentComponentsCompleted,
                    "nonAssessmentTotal": nonAssessmentComponentsTotal,
                    "assessmentCompleted": assessmentComponentsCompleted,
                    "assessmentTotal": assessmentComponentsTotal
                };

                var showPageCompletionCourse = Adapt.course.get("_pageLevelProgress") && Adapt.course.get("_pageLevelProgress")._showPageCompletion !== false;
                var showPageCompletionPage = contentObjectModel.get("_pageLevelProgress") && contentObjectModel.get("_pageLevelProgress")._showPageCompletion !== false;

                if (showPageCompletionCourse && showPageCompletionPage) {
                    // optionally add one point extra for page completion to eliminate incomplete pages and full progress bars
                    // if _showPageCompletion is true then the progress bar should also consider it so add 1 to nonAssessmentTotal
                    pageCompletion.nonAssessmentCompleted += isComplete;
                    pageCompletion.nonAssessmentTotal += 1;
                }

                return pageCompletion;
            case 'menu':
                // If it's a sub-menu
                children = contentObjectModel.get('_children').models;
                children.forEach(function(contentObject) {
                    var completionObject = calculateCompletion(contentObject);
                    subProgressCompleted += contentObjectModel.subProgressCompleted || 0;
                    subProgressTotal += contentObjectModel.subProgressTotal || 0;
                    nonAssessmentComponentsTotal += completionObject.nonAssessmentTotal;
                    nonAssessmentComponentsCompleted += completionObject.nonAssessmentCompleted;
                    assessmentComponentsTotal += completionObject.assessmentTotal;
                    assessmentComponentsCompleted += completionObject.assessmentCompleted;
                });

                return {
                    "subProgressCompleted": subProgressCompleted,
                    "subProgressTotal" : subProgressTotal,
                    "nonAssessmentCompleted": nonAssessmentComponentsCompleted,
                    "nonAssessmentTotal": nonAssessmentComponentsTotal,
                    "assessmentCompleted": assessmentComponentsCompleted,
                    "assessmentTotal": assessmentComponentsTotal,
                };
        }
    }

    function getNonAssessmentComponents(models) {
        return models.filter(function(model) {
            return !model.get('_isPartOfAssessment');
        });
    }

    function getAssessmentComponents(models) {
        return models.filter(function(model) {
            return model.get('_isPartOfAssessment');
        });
    }

    function getComponentsCompleted(models) {
        return models.filter(function(item) {
            return item.get('_isComplete');
        });
    }

    function getComponentsInteractionCompleted(models) {
        return models.filter(function(item) {
            return item.get('_isComplete');
        });
    }

    //Get only those models who were enabled for pageLevelProgress
    function getPageLevelProgressEnabledModels(models) {
        return models.filter(function(model) {
            var config = model.get('_pageLevelProgress');
            return config && config._isEnabled;
        });
    }

    function unavailableInHierarchy(parents) {
        if (parents.length === 0) return;
        return parents.some(function(parent) {
            return !parent.get('_isAvailable');
        });
    }

    function filterAvailableChildren(children) {
        var availableChildren = [];

        for (var i = 0, count = children.length; i < count; i++) {
            var parents = children[i].getAncestorModels();
            if (unavailableInHierarchy(parents)) continue;
            availableChildren.push(children[i]);
        }

        return availableChildren;
    }

    function calculatePercentageComplete(model) {
        var completionObject = calculateCompletion(model);
        // take all assessment, nonassessment and subprogress into percentage
        // this allows the user to see if assessments have been passed, if assessment components can be retaken, and all other component's completion
        var completed = completionObject.nonAssessmentCompleted + completionObject.assessmentCompleted + completionObject.subProgressCompleted;
        var total  = completionObject.nonAssessmentTotal + completionObject.assessmentTotal + completionObject.subProgressTotal;
        var percentageComplete = Math.floor((completed / total)*100);
        return percentageComplete;
    }

    return {
        calculateCompletion: calculateCompletion,
        calculatePercentageComplete: calculatePercentageComplete,
        getPageLevelProgressEnabledModels: getPageLevelProgressEnabledModels,
        filterAvailableChildren: filterAvailableChildren
    };

});
