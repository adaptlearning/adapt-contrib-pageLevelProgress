import { describe, getCourse, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Page level progress - v5.3.1 to v5.4.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v5.3.1..v5.4.0

  let course, coursePlpGlobals;

  whereFromPlugin('Page level progress - from v5.3.1', { name: 'adapt-contrib-pageLevelProgress', version: '<5.4.0' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    return course._pageLevelProgress;
  });

  mutateContent('Page level progress - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._pageLevelProgress')) _.set(course, '_globals._extensions._pageLevelProgress', {});
    coursePlpGlobals = course._globals._extensions._pageLevelProgress;
    return true;
  });

  mutateContent('Page level progress - global attribute _navOrder', async (content) => {
    coursePlpGlobals._navOrder = 0;
    return true;
  });

  checkContent('Page level progress - check global attribute _navOrder', async (content) => {
    const isValid = coursePlpGlobals._navOrder === 0;
    if (!isValid) throw new Error('Page level progress - global attribute _navOrder');
    return true;
  });

  updatePlugin('Page level progress - update to v5.4.0', { name: 'adapt-contrib-pageLevelProgress', version: '5.4.0', framework: '">=5.18.6' });
});
