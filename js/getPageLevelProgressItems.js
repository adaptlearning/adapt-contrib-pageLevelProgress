import Adapt from 'core/js/adapt';
import completionCalculations from './completionCalculations';

export default function getPageLevelProgressItemsJSON(parentModel) {
  const {
    _showAtCourseLevel
  } = Adapt.course.get('_pageLevelProgress');

  const isInAPage = parentModel.isTypeGroup('page');

  function addChildren(model) {
    const allDescendants = model.getAllDescendantModels(true);
    const currentPageItems = allDescendants.filter(descendant => {
      const isDescendantContentObject = descendant.isTypeGroup('contentobject');
      const isDescendantCurrentPage = (model === parentModel);
      if (!isInAPage && !isDescendantContentObject) return false;
      if (isInAPage && !isDescendantCurrentPage && !isDescendantContentObject) return false;
      return (descendant.get('_isAvailable') === true);
    });
    const availableItems = completionCalculations.filterAvailableChildren(currentPageItems);
    const enabledProgressItems = completionCalculations.getPageLevelProgressEnabledModels(availableItems);
    if (!enabledProgressItems.length) {
      return {
        ...model.toJSON(),
        _children: null
      };
    }
    const _children = enabledProgressItems.map(model => addChildren(model));
    return {
      ...model.toJSON(),
      _children
    };
  }

  const jsonOutput = _showAtCourseLevel
    ? addChildren(Adapt.course)
    : addChildren(parentModel)._children;

  return jsonOutput;
}
