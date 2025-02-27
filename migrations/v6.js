import { describe, getCourse, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Page level progress - v6.2.2 to v6.2.3', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v6.2.2..v6.2.3

  let course, coursePlpGlobals;

  whereFromPlugin('Page level progress - from v6.2.2', { name: 'adapt-contrib-pageLevelProgress', version: '<6.2.3' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._pageLevelProgress')) _.set(course, '_globals._extensions._pageLevelProgress', {});
    coursePlpGlobals = course._globals._extensions._pageLevelProgress;
    return true;
  });

  mutateContent('Page level progress - update global attribute _navOrder', async (content) => {
    if (coursePlpGlobals._navOrder !== 0) return true;
    coursePlpGlobals._navOrder = 90;
    return true;
  });

  checkContent('Page level progress - check global attribute _navOrder', async (content) => {
    const isValid = coursePlpGlobals._navOrder !== 0;
    if (!isValid) throw new Error('Page level progress - global attribute _navOrder');
    return true;
  });

  updatePlugin('Page level progress - update to v6.2.3', { name: 'adapt-contrib-pageLevelProgress', version: '6.2.3', framework: '">=5.24.4' });

  testSuccessWhere('course pageLevelProgress, no globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.2' }],
    content: [
      { _type: 'course', _pageLevelProgress: {} }
    ]
  });

  testSuccessWhere('course pageLevelProgress, empty globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.2' }],
    content: [
      { _type: 'course', _pageLevelProgress: {}, _globals: { _extensions: { _pageLevelProgress: {} } } }
    ]
  });

  testSuccessWhere('course pageLevelProgress, globals with _navOrder', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.2' }],
    content: [
      { _type: 'course', _pageLevelProgress: {}, _globals: { _extensions: { _pageLevelProgress: { _navOrder: 0 } } } }
    ]
  });

  testStopWhere('no pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.2' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.3' }]
  });
});

describe('Page level progress - v6.2.3 to v6.2.4', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v6.2.3..v6.2.4

  let course;

  whereFromPlugin('Page level progress - from v6.2.3', { name: 'adapt-contrib-pageLevelProgress', version: '<6.2.4' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add course attribute _showAtCourseLevel', async (content) => {
    course._pageLevelProgress._showAtCourseLevel = false;
    return true;
  });

  checkContent('Page level progress - check course attribute _showAtCourseLevel', async (content) => {
    const isValid = course._pageLevelProgress._showAtCourseLevel === false;
    if (!isValid) throw new Error('Page level progress - course attribute _showAtCourseLevel');
    return true;
  });

  updatePlugin('Page level progress - update to v6.2.4', { name: 'adapt-contrib-pageLevelProgress', version: '6.2.4', framework: '">=5.24.4' });

  testSuccessWhere('course pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.3' }],
    content: [
      { _type: 'course', _pageLevelProgress: {} }
    ]
  });

  testStopWhere('no pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.3' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.4' }]
  });
});

describe('Page level progress - v6.2.7 to v6.3.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v6.2.7..v6.3.0

  let course, coursePlpGlobals;

  const plpOld = 'Page sections';
  const plpNew = 'List of page sections and completion status. Select incomplete sections to jump directly to the content.';

  const plpIndicatorBarOld = "Page progress. Use this to listen to the list of regions in this topic and whether they're completed. You can jump directly to any that are incomplete or which sound particularly interesting. {{percentageComplete}}%";
  const plpIndicatorBarNew = 'Page progress. {{percentageComplete}}%. Open page sections.';

  whereFromPlugin('Page level progress - from v6.2.7', { name: 'adapt-contrib-pageLevelProgress', version: '<6.3.0' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._pageLevelProgress')) _.set(course, '_globals._extensions._pageLevelProgress', {});
    coursePlpGlobals = course._globals._extensions._pageLevelProgress;
    return true;
  });

  mutateContent('Page level progress - update global attribute pageLevelProgress', async (content) => {
    if (coursePlpGlobals.pageLevelProgress !== plpOld) return true;
    coursePlpGlobals.pageLevelProgress = plpNew;
    return true;
  });

  mutateContent('Page level progress - update global attribute pageLevelProgressIndicatorBar', async (content) => {
    if (coursePlpGlobals.pageLevelProgressIndicatorBar !== plpIndicatorBarOld) return true;
    coursePlpGlobals.pageLevelProgressIndicatorBar = plpIndicatorBarNew;
    return true;
  });

  mutateContent('Page level progress - remove global attribute pageLevelProgressEnd', async (content) => {
    delete coursePlpGlobals.pageLevelProgressEnd;
    return true;
  });

  checkContent('Page level progress - check global attribute pageLevelProgress', async (content) => {
    const isValid = coursePlpGlobals.pageLevelProgress !== plpOld;
    if (!isValid) throw new Error('Page level progress - global attribute pageLevelProgress');
    return true;
  });

  checkContent('Page level progress - check global attribute pageLevelProgressIndicatorBar', async (content) => {
    const isValid = coursePlpGlobals.pageLevelProgressIndicatorBar !== plpIndicatorBarOld;
    if (!isValid) throw new Error('Page level progress - global attribute pageLevelProgressIndicatorBar');
    return true;
  });

  checkContent('Page level progress - check global attribute pageLevelProgressEnd', async (content) => {
    const isValid = !_.has(coursePlpGlobals, 'pageLevelProgressEnd');
    if (!isValid) throw new Error('Page level progress - global attribute pageLevelProgressEnd');
    return true;
  });

  updatePlugin('Page level progress - update to v6.3.0', { name: 'adapt-contrib-pageLevelProgress', version: '6.3.0', framework: '">=5.24.4' });

  testSuccessWhere('course pageLevelProgress, no globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.7' }],
    content: [
      { _type: 'course', _pageLevelProgress: {} }
    ]
  });

  testSuccessWhere('course pageLevelProgress, empty globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.7' }],
    content: [
      { _type: 'course', _pageLevelProgress: {}, _globals: { _extensions: { _pageLevelProgress: {} } } }
    ]
  });

  testSuccessWhere('course pageLevelProgress, default globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.7' }],
    content: [
      {
        _type: 'course',
        _pageLevelProgress: {},
        _globals: {
          _extensions: {
            _pageLevelProgress: {
              pageLevelProgress: plpOld,
              pageLevelProgressIndicatorBar: plpIndicatorBarOld,
              pageLevelProgressEnd: 'End of page sections'
            }
          }
        }
      }
    ]
  });

  testSuccessWhere('course pageLevelProgress, custom globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.7' }],
    content: [
      {
        _type: 'course',
        _pageLevelProgress: {},
        _globals: {
          _extensions: {
            _pageLevelProgress: {
              pageLevelProgress: 'Custom pageLevelProgress',
              pageLevelProgressIndicatorBar: 'Custom pageLevelProgressIndicatorBar',
              pageLevelProgressEnd: 'End of page sections'
            }
          }
        }
      }
    ]
  });

  testStopWhere('no pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.2.7' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.3.0' }]
  });
});

describe('Page level progress - v6.3.1 to v6.4.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v6.3.1..v6.4.0

  let course, coursePlpGlobals;

  whereFromPlugin('Page level progress - from v6.3.1', { name: 'adapt-contrib-pageLevelProgress', version: '<6.4.0' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._pageLevelProgress')) _.set(course, '_globals._extensions._pageLevelProgress', {});
    coursePlpGlobals = course._globals._extensions._pageLevelProgress;
    return true;
  });

  mutateContent('Page level progress - add global attribute _drawerPosition', async (content) => {
    coursePlpGlobals._drawerPosition = 'auto';
    return true;
  });

  checkContent('Page level progress - check global attribute _drawerPosition', async (content) => {
    const isValid = coursePlpGlobals._drawerPosition === 'auto';
    if (!isValid) throw new Error('Page level progress - global attribute _drawerPosition');
    return true;
  });

  updatePlugin('Page level progress - update to v6.4.0', { name: 'adapt-contrib-pageLevelProgress', version: '6.4.0', framework: '">=5.24.4' });

  testSuccessWhere('course pageLevelProgress, no globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.3.1' }],
    content: [
      { _type: 'course', _pageLevelProgress: {} }
    ]
  });

  testSuccessWhere('course pageLevelProgress, empty globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.3.1' }],
    content: [
      { _type: 'course', _pageLevelProgress: {}, _globals: { _extensions: { _pageLevelProgress: {} } } }
    ]
  });

  testStopWhere('no pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.3.1' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '6.4.0' }]
  });
});
