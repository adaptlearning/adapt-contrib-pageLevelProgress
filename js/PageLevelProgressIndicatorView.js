import Adapt from 'core/js/adapt';
import React from 'react';
import ReactDOM from 'react-dom';
import { templates } from 'core/js/reactHelpers';
import ItemsComponentModel from 'core/js/models/itemsComponentModel';
import completionCalculations from './completionCalculations';

class PageLevelProgressIndicatorView extends Backbone.View {

  tagName() {
    return 'span';
  }

  initialize(options) {
    options = options || {};
    this.parent = options.parent;
    this.calculatePercentage = options.calculatePercentage || this.calculatePercentage;
    this.ariaLabel = options.ariaLabel || '';
    this.type = options.type || this.model.get('_type');
    this.addClasses();
    this.setUpEventListeners();
    this.setPercentageComplete();
    this.render();
  }

  addClasses() {
    this.$el.addClass([
      'pagelevelprogress__indicator-outer',
      'is-' + this.type
    ].join(' '));
  }

  setUpEventListeners() {
    if (this.parent) {
      this.listenToOnce(this.parent, 'postRemove', this.remove);
    } else {
      this.listenTo(Adapt, 'remove', this.remove);
    }
    this.listenTo(Adapt.course, 'bubble:change:_isComplete bubble:change:_isVisited', this.render);
  }

  setPercentageComplete() {
    const percentage = this.calculatePercentage();
    this.model.set('percentageComplete', percentage);
    this.$el.css({
      '--adapt-pagelevelprogress-percentage': percentage + '%'
    });
    return percentage;
  }

  calculatePercentage() {
    const isContentObject = this.model.isTypeGroup('contentobject');
    if (isContentObject) return completionCalculations.calculatePercentageComplete(this.model);
    const isComplete = this.model.get('_isComplete');
    if (isComplete) return 100;
    const isPresentationComponentWithItems = (!this.model.isTypeGroup('question') && this.model instanceof ItemsComponentModel);
    if (isPresentationComponentWithItems) {
      const children = this.model.getChildren();
      const visited = children.filter(child => child.get('_isVisited'));
      return Math.round(visited.length / children.length * 100);
    }
    return 0;
  }

  render() {
    this.checkCompletion();
    this.checkAriaHidden();
    const data = this.getRenderData();
    const Component = templates.pageLevelProgressIndicator;
    ReactDOM.render(<Component {...data} />, this.el);
  }

  refresh() {
    this.render();
  }

  checkCompletion() {
    const percentage = this.setPercentageComplete();
    const isComplete = (percentage === 100);
    const canShowMarking = Boolean(this.model.get('_canShowMarking'));
    const isCorrect = (canShowMarking && isComplete && this.model.get('_isCorrect') === true);
    const isPartlyCorrect = (canShowMarking && isComplete && this.model.get('_isCorrect') === false && this.model.get('_isAtLeastOneCorrectSelection'));
    const isIncorrect = (canShowMarking && isComplete && this.model.get('_isCorrect') === false && !this.model.get('_isAtLeastOneCorrectSelection'));
    this.$el
      .toggleClass('is-complete', isComplete)
      .toggleClass('is-incomplete', !isComplete)
      .toggleClass('is-correct', isCorrect)
      .toggleClass('is-partially-correct', isPartlyCorrect)
      .toggleClass('is-incorrect', isIncorrect);
  }

  checkAriaHidden() {
    if (this.ariaLabel) return;
    this.$el.attr('aria-hidden', true);
  }

  getRenderData() {
    const data = this.model.toJSON();
    data.ariaLabel = this.ariaLabel;
    data.type = this.type;
    return data;
  }

}

PageLevelProgressIndicatorView.template = 'pageLevelProgressIndicator.jsx';

export default PageLevelProgressIndicatorView;
