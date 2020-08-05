define([
  'core/js/adapt',
  'core/js/models/navigationItemModel',
  'core/js/views/navigationItemView',
  './completionCalculations',
  './PageLevelProgressNavigationView',
  './PageLevelProgressIndicatorView',
  './PageLevelProgressCollection'
], function(Adapt, NavigationItemModel, NavigationItemView, completionCalculations, PageLevelProgressNavigationView, PageLevelProgressIndicatorView, PageLevelProgressCollection) {

  var PageLevelProgress = Backbone.Controller.extend({

    initialize: function() {
      Adapt.on({
        'app:dataReady': this.onDataReady.bind(this),
        'app:languageChanged': function() {
          // Remove events created by setUpEventListeners
          this.stopListening();
        }.bind(this)
      });
    },

    getCourseConfig: function() {
      return Adapt.course.get('_pageLevelProgress');
    },

    onDataReady: function() {
      // Do not proceed if pageLevelProgress is not enabled in course.json
      var coursePLPConfig = this.getCourseConfig();
      if (!coursePLPConfig || !coursePLPConfig._isEnabled) {
        return;
      }
      this.setUpEventListeners();
    },

    setUpEventListeners: function() {
      var headerIndicatorTypes = [
        'menu',
        'menuItem',
        'page',
        'article',
        'block',
        'component'
      ];

      var headerIndicatorEventNames = headerIndicatorTypes
        .concat(['']).join('View:render ');

      this.listenTo(Adapt, headerIndicatorEventNames, this.renderHeaderIndicatorView);

      this.listenTo(Adapt, {
        'menuItemView:postRender': this.renderMenuItemIndicatorView,
        'router:page': this.renderNavigationView
      });

      this.listenTo(Adapt.course, 'bubble:change:_isComplete', this.onCompletionChange);
    },

    onCompletionChange: function(event) {
      if (!Adapt.location._currentId) return;

      var currentModel = Adapt.findById(Adapt.location._currentId);
      var completionState = {
        currentLocation: completionCalculations.calculatePercentageComplete(currentModel),
        course: completionCalculations.calculatePercentageComplete(Adapt.course)
      };
      var hasChanged = !_.isMatch(this._previousCompletionState, completionState);
      if (!hasChanged) return;

      this._previousCompletionState = completionState;
      Adapt.trigger('pageLevelProgress:percentageCompleteChange', completionState);
    },

    renderHeaderIndicatorView: function(view) {
      var model = view.model;

      var config = model.get('_pageLevelProgress');
      if (!config || !config._isEnabled || !config._isCompletionIndicatorEnabled) {
        return;
      }

      var pageModel = model.findAncestor('contentObjects');
      var pageConfig = pageModel && pageModel.get('_pageLevelProgress');
      if (pageConfig && !pageConfig._isEnabled) {
        return;
      }

      var $headings = view.$('.js-heading');
      $headings.each(function(index, el) {
        var $el = $(el);
        var indicatorView = new PageLevelProgressIndicatorView({
          parent: view,
          model: model
        });
        indicatorView.$el.insertAfter($el);
      });
    },

    // This should add/update progress on menuView
    renderMenuItemIndicatorView: function(view) {
      // Do not render on menu, only render on menu items
      if (view.model.get('_id') === Adapt.location._currentId) {
        return;
      }

      // Progress bar should not render for course viewType
      var viewType = view.model.get('_type');
      if (viewType === 'course') {
        return;
      }

      // Do not proceed if pageLevelProgress is not enabled for the content object
      var pageLevelProgress = view.model.get('_pageLevelProgress');
      if (!pageLevelProgress || !pageLevelProgress._isEnabled) {
        return;
      }

      view.$el.find('.js-menu-item-progress').append(new PageLevelProgressIndicatorView({
        parent: view,
        model: view.model,
        type: 'menu-item',
        calculatePercentage: this._getMenuItemCompletionPercentage.bind(view),
        ariaLabel: Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressMenuBar
      }).$el);
    },

    _getMenuItemCompletionPercentage: function() {
      return completionCalculations.calculatePercentageComplete(this.model);
    },

    // This should add/update progress on page navigation bar
    renderNavigationView: function(pageModel) {
      // Do not render if turned off at course level
      var coursePLPConfig = this.getCourseConfig();
      if (coursePLPConfig && coursePLPConfig._isShownInNavigationBar === false) {
        return;
      }

      // Do not proceed if pageLevelProgress is not enabled for the content object
      var pagePLPConfig = pageModel.get('_pageLevelProgress');
      if (!pagePLPConfig || !pagePLPConfig._isEnabled) {
        return;
      }

      var collection = new PageLevelProgressCollection(null, {
        pageModel: pageModel
      });

      if (collection.length === 0) {
        return;
      }

      const navigationItem = new NavigationItemView({
        model: new NavigationItemModel({
          _name: 'pageLevelProcess',
          _order: 500,
          _layout: 'right'
        }),
      });
      navigationItem.$el.append(new PageLevelProgressNavigationView({
        model: pageModel,
        collection: collection
      }).$el);

      Adapt.navigation.add(navigationItem);
    }

  });

  Adapt.pageLevelProgress = new PageLevelProgress();

});
