import React from 'react';
import ReactDOM from 'react-dom';
import Adapt from 'core/js/adapt';
import data from 'core/js/data';
import router from 'core/js/router';
import { templates } from 'core/js/reactHelpers';

export default class PageLevelProgressView extends Backbone.View {

  className() {
    const config = Adapt.course.get('_pageLevelProgress');
    return [
      'pagelevelprogress',
      (config._showAtCourseLevel === true) && 'is-course-level'
    ].filter(Boolean).join(' ');
  }

  events() {
    return {
      'click .js-pagelevelprogress-item-click': 'scrollToPageElement'
    };
  }

  initialize() {
    this.listenTo(Adapt, 'remove', this.remove);
    this.render();
  }

  async scrollToPageElement(event) {
    if (event && event.preventDefault) event.preventDefault();

    const $target = $(event.currentTarget);
    if ($target.is('.is-disabled')) return;

    const id = $target.attr('data-pagelevelprogress-id');
    const model = data.findById(id);
    const isNavigateToContentObject = model.isTypeGroup('contentobject');

    if (isNavigateToContentObject) {
      router.navigateToElement(id, { duration: 400 });
      Adapt.trigger('drawer:closeDrawer');
      return;
    }

    if (!model.get('_isRendered')) {
      try {
        await Adapt.parentView.renderTo(id);
      } catch (err) {
        return;
      }
    }
    const currentComponentSelector = `.${id}`;
    Adapt.once('drawer:closed', () => {
      router.navigateToElement(currentComponentSelector, { duration: 400 });
    }).trigger('drawer:closeDrawer', $(currentComponentSelector));
  }

  render() {
    const Component = templates.pageLevelProgress;
    ReactDOM.render(<Component
      _items={Array.isArray(this.collection) && this.collection}
      _item={!Array.isArray(this.collection) && this.collection}
      _globals={Adapt.course.get('_globals')}
    />, this.el);
  }

}
