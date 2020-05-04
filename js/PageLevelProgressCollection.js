define([
  'core/js/adapt',
  './completionCalculations'
], function(Adapt, completionCalculations) {

  var PageLevelProgressCollection = Backbone.Collection.extend({

    initialize: function(models, options) {
      this.listenTo(Adapt, 'remove', this.reset);
      if (!options || !options.pageModel) return;
      this._pageModel = options.pageModel;
      this.repopulate();
    },

    repopulate: function() {
      this.reset();
      if (!this._pageModel) return;

      var allDescendants = this._pageModel.getAllDescendantModels(true);
      var currentPageItems = allDescendants.filter(function(item) {
        return item.get('_isAvailable') === true;
      });
      var availableItems = completionCalculations.filterAvailableChildren(currentPageItems);
      var enabledProgressItems = completionCalculations.getPageLevelProgressEnabledModels(availableItems);

      this.add(enabledProgressItems);
    }

  });

  return PageLevelProgressCollection;

});
