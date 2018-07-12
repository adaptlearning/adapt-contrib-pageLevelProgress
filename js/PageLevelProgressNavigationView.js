define([
    'core/js/adapt',
    './completionCalculations',
    './PageLevelProgressView',
    './PageLevelProgressIndicatorView'
], function(Adapt, completionCalculations, PageLevelProgressView, PageLevelProgressIndicatorView) {

    var PageLevelProgressNavigationView = Backbone.View.extend({

        tagName: 'button',

        className: 'base page-level-progress-navigation',

        events: {
            'click': 'onProgressClicked'
        },

        initialize: function() {
            _.bindAll(this, "updateProgressBar");
            this.setUpEventListeners();
            this.render();
            this.addIndicator();
            this.deferredUpdate();
        },

        setUpEventListeners: function() {
            this.listenTo(Adapt, {
                'remove': this.remove,
                'router:location': this.updateProgressBar,
                'pageLevelProgress:update': this.refreshProgressBar
            });
        },

        render: function() {
            var template = Handlebars.templates['pageLevelProgressNavigation'];
            this.$el.html(template({}));
        },

        addIndicator: function() {
            this.indicatorView = new PageLevelProgressIndicatorView({
                model: this.model,
                collection: this.collection,
                calculatePercentage: function() {
                    var completionObject = completionCalculations.calculateCompletion(this.model);
                    // take all assessment, nonassessment and subprogress into percentage
                    // this allows the user to see if assessments have been passed, if assessment components can be retaken, and all other component's completion
                    var completed = completionObject.nonAssessmentCompleted + completionObject.assessmentCompleted + completionObject.subProgressCompleted;
                    var total  = completionObject.nonAssessmentTotal + completionObject.assessmentTotal + completionObject.subProgressTotal;
                    var percentageComplete = Math.floor((completed / total)*100);
                    return percentageComplete;
                },
                ariaLabel: Adapt.course.get('_globals')._extensions._pageLevelProgress.pageLevelProgressIndicatorBar
            });
            this.$el.prepend(this.indicatorView.$el);
        },

        deferredUpdate: function() {
            _.defer(this.updateProgressBar);
        },

        updateProgressBar: function() {
            this.indicatorView.refresh();
        },

        refreshProgressBar: function() {
            var currentPageComponents = _.filter(this.model.findDescendantModels('components'), function(comp) {
                return comp.get('_isAvailable') === true;
            });
            var availableChildren = completionCalculations.filterAvailableChildren(currentPageComponents);
            var enabledProgressComponents = completionCalculations.getPageLevelProgressEnabledModels(availableChildren);
            this.collection.reset(enabledProgressComponents);
            this.updateProgressBar();
        },

        onProgressClicked: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            Adapt.drawer.triggerCustomView(new PageLevelProgressView({collection: this.collection}).$el, false);
        }

    });

    return PageLevelProgressNavigationView;

});
