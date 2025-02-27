import { describe, getCourse, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Page level progress - v2.0.1 to v2.0.2', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v2.0.1..v2.0.2

  let course, coursePlpGlobals;
  const plpIndicatorBarDefaultOld = 'You have completed ';
  const plpIndicatorBarDefaultNew = 'Progress bar. Select here to view your current progress, and select an item to navigate to it. You have completed ';

  whereFromPlugin('Page level progress - from v2.0.1', { name: 'adapt-contrib-pageLevelProgress', version: '>=2.0.0 <2.0.2' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._pageLevelProgress')) _.set(course, '_globals._extensions._pageLevelProgress', {});
    coursePlpGlobals = course._globals._extensions._pageLevelProgress;
    return true;
  });

  mutateContent('Page level progress - global attribute pageLevelProgressMenuBar', async (content) => {
    coursePlpGlobals.pageLevelProgressMenuBar = 'You have completed ';
    return true;
  });

  mutateContent('Page level progress - global attribute optionalContent', async (content) => {
    coursePlpGlobals.optionalContent = 'Optional Content';
    return true;
  });

  mutateContent('Page level progress - update attribute default', async (content) => {
    if (coursePlpGlobals.pageLevelProgressIndicatorBar !== plpIndicatorBarDefaultOld) return true;
    coursePlpGlobals.pageLevelProgressIndicatorBar = plpIndicatorBarDefaultNew;
    return true;
  });

  checkContent('Page level progress - check global attribute pageLevelProgressMenuBar', async (content) => {
    const isValid = coursePlpGlobals.pageLevelProgressMenuBar === 'You have completed ';
    if (!isValid) throw new Error('Page level progress - global attribute pageLevelProgressMenuBar');
    return true;
  });

  checkContent('Page level progress - check global attribute optionalContent', async (content) => {
    const isValid = coursePlpGlobals.optionalContent === 'Optional Content';
    if (!isValid) throw new Error('Page level progress - global attribute optionalContent');
    return true;
  });

  checkContent('Page level progress - check global attribute pageLevelProgressIndicatorBar', async (content) => {
    const isValid = coursePlpGlobals.pageLevelProgressIndicatorBar !== plpIndicatorBarDefaultOld;
    if (!isValid) throw new Error('Page level progress - global attribute pageLevelProgressIndicatorBar');
    return true;
  });

  updatePlugin('Page level progress - update to v2.0.2', { name: 'adapt-contrib-pageLevelProgress', version: '2.0.2', framework: '">=2.0.0' });

  testSuccessWhere('pageLevelProgress with empty course', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.1' }],
    content: [
      { _type: 'course', _pageLevelProgress: {} }
    ]
  });

  testSuccessWhere('pageLevelProgress with empty course globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.1' }],
    content: [
      { _type: 'course', _pageLevelProgress: {}, _globals: { _extensions: { _pageLevelProgress: {} } } }
    ]
  });

  testSuccessWhere('pageLevelProgress with default course globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.1' }],
    content: [
      { _type: 'course', _pageLevelProgress: {}, _globals: { _extensions: { _pageLevelProgress: { pageLevelProgressIndicatorBar: plpIndicatorBarDefaultOld } } } }
    ]
  });

  testSuccessWhere('pageLevelProgress with custom course globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.1' }],
    content: [
      { _type: 'course', _pageLevelProgress: {}, _globals: { _extensions: { _pageLevelProgress: { pageLevelProgressIndicatorBar: 'custom progress indicator' } } } }
    ]
  });

  testStopWhere('no pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.1' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.2' }]
  });
});

describe('Page level progress - v2.0.3 to v2.0.4', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v2.0.3..v2.0.4

  let course, configuredContentObjects;

  whereFromPlugin('Page level progress - from v2.0.3', { name: 'adapt-contrib-pageLevelProgress', version: '<2.0.4' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    configuredContentObjects = content.filter(({ _type, _pageLevelProgress }) => {
      if (!_pageLevelProgress) return false;
      return _type === 'page' || _type === 'menu';
    });
    return course._pageLevelProgress || configuredContentObjects.length;
  });

  mutateContent('Page level progress - add course attribute _showPageCompletion', async (content) => {
    if (course._pageLevelProgress) course._pageLevelProgress._showPageCompletion = true;

    return true;
  });

  mutateContent('Page level progress - add content object attribute _showPageCompletion', async (content) => {
    configuredContentObjects.forEach(co => (co._pageLevelProgress._showPageCompletion = true));

    return true;
  });

  checkContent('Page level progress - check course attribute _showPageCompletion', async (content) => {
    const isValid = !course._pageLevelProgress || course._pageLevelProgress._showPageCompletion === true;

    if (!isValid) throw new Error('Page level progress - course attribute _showPageCompletion');

    return true;
  });

  checkContent('Page level progress - check content object attribute _showPageCompletion', async (content) => {
    const isValid = configuredContentObjects.every(co => co._pageLevelProgress._showPageCompletion === true);

    if (!isValid) throw new Error('Page level progress - content object attribute _showPageCompletion');

    return true;
  });

  updatePlugin('Page level progress - update to v2.0.4', { name: 'adapt-contrib-pageLevelProgress', version: '2.0.4', framework: '">=2.0.0' });

  testSuccessWhere('course pageLevelProgress and contentObject with/without pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.3' }],
    content: [
      { _type: 'course', _pageLevelProgress: {} },
      { _type: 'page', _pageLevelProgress: {} },
      { _type: 'page' }
    ]
  });

  testSuccessWhere('course pageLevelProgress and contentObject without pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.3' }],
    content: [
      { _type: 'course', _pageLevelProgress: {} },
      { _type: 'page' },
      { _type: 'page' }
    ]
  });

  testSuccessWhere('pageLevelProgress with no contentObjects', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.3' }],
    content: [
      { _type: 'course', _pageLevelProgress: {} }
    ]
  });

  testStopWhere('no pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.3' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '2.0.4' }]
  });
});
