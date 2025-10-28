import Adapt from 'core/js/adapt';
import _ from 'underscore';

class Completion extends Backbone.Controller {

  initialize() {
    _.bindAll(this, 'calculatePercentageComplete');
    this.subProgressCompleted = 0;
    this.subProgressTotal = 0;
    this.nonAssessmentCompleted = 0;
    this.nonAssessmentTotal = 0;
    this.assessmentCompleted = 0;
    this.assessmentTotal = 0;
  }

  // Calculate completion of a contentObject
  calculateCompletion(contentObjectModel, setGlobal = false) {
    const completion = {};
    const perform = contentObjectModel => {
      const viewType = contentObjectModel.get('_type');
      const isComplete = contentObjectModel.get('_isComplete') ? 1 : 0;
      let children;
      switch (viewType) {
        case 'page': {
          // If it's a page
          children = contentObjectModel.getAllDescendantModels().filter(model => {
            return model.get('_isAvailable') && !model.get('_isOptional');
          });

          const availableChildren = this.filterAvailableChildren(children);
          const components = this.getPageLevelProgressEnabledModels(availableChildren);
          const nonAssessmentComponents = this.getNonAssessmentComponents(components);

          completion.nonAssessmentTotal += nonAssessmentComponents.length;
          completion.nonAssessmentCompleted += this.getComponentsCompleted(nonAssessmentComponents).length;

          const assessmentComponents = this.getAssessmentComponents(components);

          completion.assessmentTotal += assessmentComponents.length;
          completion.assessmentCompleted += this.getComponentsInteractionCompleted(assessmentComponents).length;

          if (contentObjectModel.get('_pageLevelProgress')?._excludeAssessments !== true) {
            completion.subProgressCompleted += contentObjectModel.get('_subProgressComplete') || 0;
            completion.subProgressTotal += contentObjectModel.get('_subProgressTotal') || 0;
          }

          const showPageCompletionCourse = Adapt.course.get('_pageLevelProgress')?._showPageCompletion !== false;
          const showPageCompletionPage = contentObjectModel.get('_pageLevelProgress')?._showPageCompletion !== false;

          if (showPageCompletionCourse && showPageCompletionPage) {
            // optionally add one point extra for page completion to eliminate incomplete pages and full progress bars
            // if _showPageCompletion is true then the progress bar should also consider it so add 1 to nonAssessmentTotal
            completion.nonAssessmentCompleted += isComplete;
            completion.nonAssessmentTotal += 1;
          }

          break;
        }
        case 'menu': case 'course': {
          // If it's a sub-menu
          children = contentObjectModel.getChildren().models;
          children.forEach(perform);
          break;
        }
      }
    };
    completion.subProgressCompleted = 0;
    completion.subProgressTotal = 0;
    completion.nonAssessmentTotal = 0;
    completion.nonAssessmentCompleted = 0;
    completion.assessmentTotal = 0;
    completion.assessmentCompleted = 0;
    perform(contentObjectModel);
    if (setGlobal) Object.assign(Adapt.completion, completion);
    return completion;
  }

  getNonAssessmentComponents(models) {
    return models.filter(model => {
      return !model.get('_isPartOfAssessment');
    });
  }

  getAssessmentComponents(models) {
    return models.filter(model => {
      return model.get('_isPartOfAssessment');
    });
  }

  getComponentsCompleted(models) {
    return models.filter(item => {
      return item.get('_isComplete');
    });
  }

  getComponentsInteractionCompleted(models) {
    return models.filter(item => {
      return item.get('_isComplete');
    });
  }

  // Get only those models who were enabled for pageLevelProgress
  getPageLevelProgressEnabledModels(models) {
    return models.filter(model => {
      const config = model.get('_pageLevelProgress');
      return config?._isEnabled;
    });
  }

  unavailableInHierarchy(parents) {
    if (!parents) return;
    return parents.some(parent => {
      return !parent.get('_isAvailable');
    });
  }

  filterAvailableChildren(children) {
    const availableChildren = [];

    for (let i = 0, count = children.length; i < count; i++) {
      const parents = children[i].getAncestorModels();
      if (this.unavailableInHierarchy(parents)) continue;
      availableChildren.push(children[i]);
    }

    return availableChildren;
  }

  calculatePercentageComplete(model, setGlobal = false) {
    const completionObject = this.calculateCompletion(model, setGlobal);
    // take all assessment, nonassessment and subprogress into percentage
    // this allows the user to see if assessments have been passed, if assessment components can be retaken, and all other component's completion
    const completed = completionObject.nonAssessmentCompleted + completionObject.assessmentCompleted + completionObject.subProgressCompleted;
    const total = completionObject.nonAssessmentTotal + completionObject.assessmentTotal + completionObject.subProgressTotal;
    const percentageComplete = Math.floor((completed / total) * 100);
    return percentageComplete;
  }

}

export default (Adapt.completion = new Completion());
