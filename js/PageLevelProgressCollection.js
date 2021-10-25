import Adapt from 'core/js/adapt';
import completionCalculations from './completionCalculations';

export default class PageLevelProgressCollection extends Backbone.Collection {

  initialize(models, options) {
    this.listenTo(Adapt, 'remove', this.reset);
    if (!options?.pageModel) return;
    this._pageModel = options.pageModel;
    this.repopulate();
  }

  repopulate() {
    this.reset();
    if (!this._pageModel) return;

    const allDescendants = this._pageModel.getAllDescendantModels(true);
    const currentPageItems = allDescendants.filter(item => {
      return item.get('_isAvailable') === true;
    });
    const availableItems = completionCalculations.filterAvailableChildren(currentPageItems);
    const enabledProgressItems = completionCalculations.getPageLevelProgressEnabledModels(availableItems);

    this.add(enabledProgressItems);
  }

}
