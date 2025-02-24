import { describe, getCourse, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Page level progress - v6.4.0 to v7.0.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v6.4.0..v7.0.0

  let course, coursePlpGlobals;

  whereFromPlugin('Page level progress - from v6.4.0', { name: 'adapt-contrib-pageLevelProgress', version: '<7.0.0' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._pageLevelProgress')) _.set(course, '_globals._extensions._pageLevelProgress', {});
    coursePlpGlobals = course._globals._extensions._pageLevelProgress;
    return true;
  });

  mutateContent('Page level progress - add global attribute _showLabel', async (content) => {
    coursePlpGlobals._showLabel = true;
    return true;
  });

  mutateContent('Page level progress - add global attribute navLabel', async (content) => {
    coursePlpGlobals.navLabel = 'Page progress';
    return true;
  });

  checkContent('Page level progress - check global attribute _showLabel', async (content) => {
    const isValid = coursePlpGlobals._showLabel === true;
    if (!isValid) throw new Error('Page level progress - global attribute _showLabel');
    return true;
  });

  checkContent('Page level progress - check global attribute navLabel', async (content) => {
    const isValid = coursePlpGlobals.navLabel === 'Page progress';
    if (!isValid) throw new Error('Page level progress - global attribute navLabel');
    return true;
  });

  updatePlugin('Page level progress - update to v7.0.0', { name: 'adapt-contrib-pageLevelProgress', version: '7.0.0', framework: '">=5.24.4' });
});

describe('Page level progress - v7.0.2 to v7.1.1', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v7.0.2..v7.1.1

  let course, coursePlpGlobals;

  const navToolip = {
    _isEnabled: true,
    text: 'Page progress'
  };

  whereFromPlugin('Page level progress - from v7.0.2', { name: 'adapt-contrib-pageLevelProgress', version: '<7.1.1' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._pageLevelProgress')) _.set(course, '_globals._extensions._pageLevelProgress', {});
    coursePlpGlobals = course._globals._extensions._pageLevelProgress;
    return true;
  });

  mutateContent('Page level progress - add global attribute _navTooltip', async (content) => {
    coursePlpGlobals._navTooltip = navToolip;
    return true;
  });

  checkContent('Page level progress - check global attribute _navTooltip', async (content) => {
    const isValid = _.isEqual(coursePlpGlobals._navTooltip, navToolip);
    if (!isValid) throw new Error('Page level progress - global attribute _navTooltip');
    return true;
  });

  updatePlugin('Page level progress - update to v7.1.1', { name: 'adapt-contrib-pageLevelProgress', version: '7.1.1', framework: '">=5.24.4' });
});

describe('Page level progress - v7.4.0 to v7.5.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v7.4.0..v7.5.0

  let course;

  whereFromPlugin('Page level progress - from v7.4.0', { name: 'adapt-contrib-pageLevelProgress', version: '<7.5.0' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add course attribute title', async (content) => {
    course._pageLevelProgress.title = 'Alternate title';

    return true;
  });

  checkContent('Page level progress - check course attribute title', async (content) => {
    const isValid = course._pageLevelProgress.title === 'Alternate title';

    if (!isValid) throw new Error('Page level progress - course attribute title');

    return true;
  });

  updatePlugin('Page level progress - update to v7.5.0', { name: 'adapt-contrib-pageLevelProgress', version: '7.5.0', framework: '">=5.31.0' });
});

describe('Page level progress - v7.7.0 to v7.8.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v7.7.0..v7.8.0

  let course;

  whereFromPlugin('Page level progress - from v7.7.0', { name: 'adapt-contrib-pageLevelProgress', version: '<7.8.0' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add course attribute _useCourseProgressInNavigationButton', async (content) => {
    course._pageLevelProgress._useCourseProgressInNavigationButton = false;

    return true;
  });

  checkContent('Page level progress - check course attribute _useCourseProgressInNavigationButton', async (content) => {
    const isValid = course._pageLevelProgress._useCourseProgressInNavigationButton === false;

    if (!isValid) throw new Error('Page level progress - course attribute _useCourseProgressInNavigationButton');

    return true;
  });

  updatePlugin('Page level progress - update to v7.8.0', { name: 'adapt-contrib-pageLevelProgress', version: '7.8.0', framework: '">=5.31.0' });
});
