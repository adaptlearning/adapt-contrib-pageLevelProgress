import { describe, getCourse, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin, testStopWhere, testSuccessWhere } from 'adapt-migrations';
import _ from 'lodash';

describe('Page level progress - v@@CURRENT_VERSION to v@@RELEASE_VERSION', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v@@CURRENT_VERSION..v@@RELEASE_VERSION

  let course, coursePlpGlobals;

  whereFromPlugin('Page level progress - from v@@CURRENT_VERSION', { name: 'adapt-contrib-pageLevelProgress', version: '<@@RELEASE_VERSION' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._pageLevelProgress')) _.set(course, '_globals._extensions._pageLevelProgress', {});
    coursePlpGlobals = course._globals._extensions._pageLevelProgress;
    return true;
  });

  mutateContent('Page level progress - add global attribute _isTitleVisible', async (content) => {
    coursePlpGlobals._isTitleVisible = false;
    return true;
  });

  checkContent('Page level progress - check global attribute _isTitleVisible', async (content) => {
    const isValid = coursePlpGlobals._isTitleVisible === false;
    if (!isValid) throw new Error('Page level progress - global attribute _isTitleVisible');
    return true;
  });

  updatePlugin('Page level progress - update to v@@RELEASE_VERSION', { name: 'adapt-contrib-pageLevelProgress', version: '@@RELEASE_VERSION', framework: '>=5.31.0' });

  testSuccessWhere('course pageLevelProgress, no globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '@@CURRENT_VERSION' }],
    content: [
      { _type: 'course', _pageLevelProgress: {} }
    ]
  });

  testSuccessWhere('course pageLevelProgress, empty globals', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '@@CURRENT_VERSION' }],
    content: [
      { _type: 'course', _pageLevelProgress: {}, _globals: { _extensions: { _pageLevelProgress: {} } } }
    ]
  });

  testStopWhere('no pageLevelProgress', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '@@CURRENT_VERSION' }],
    content: [
      { _type: 'course' }
    ]
  });

  testStopWhere('incorrect version', {
    fromPlugins: [{ name: 'adapt-contrib-pageLevelProgress', version: '@@RELEASE_VERSION' }]
  });
});
