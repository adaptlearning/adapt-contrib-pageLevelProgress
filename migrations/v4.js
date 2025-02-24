import { describe, getCourse, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';
import _ from 'lodash';

describe('Page level progress - v3.1.0 to v4.0.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v3.1.0..v4.0.0

  let course, coursePlpGlobals, configuredContentObjects, configuredComponents;

  const plpIndicatorBarDefaultOld = 'Progress bar. Select here to view your current progress, and select an item to navigate to it. You have completed ';
  const plpIndicatorBarDefaultNew = "Page progress. Use this to listen to the list of regions in this topic and whether they're completed. You can jump directly to any that are incomplete or which sound particularly interesting. {{percentageComplete}}%";

  const plpMenuBarOld = 'You have completed ';
  const plpMenuBarNew = 'Page completion {{percentageComplete}}%';

  const plpOptionalContentOld = 'Optional Content';
  const plpOptionalContentNew = 'Optional content';

  whereFromPlugin('Page level progress - from v3.1.0', { name: 'adapt-contrib-pageLevelProgress', version: '<4.0.0' });

  whereContent('Page level progress is configured', content => {
    course = getCourse();
    configuredContentObjects = content.filter(({ _type, _pageLevelProgress }) => {
      if (!_pageLevelProgress) return false;
      return _type === 'page' || _type === 'menu';
    });
    configuredComponents = content.filter(({ _type, _pageLevelProgress }) => {
      if (!_pageLevelProgress) return false;
      return _type === 'component';
    });
    return course._pageLevelProgress || configuredContentObjects.length || configuredComponents.length;
  });

  mutateContent('Page level progress - add globals if missing', async (content) => {
    if (!_.has(course, '_globals._extensions._pageLevelProgress')) _.set(course, '_globals._extensions._pageLevelProgress', {});
    coursePlpGlobals = course._globals._extensions._pageLevelProgress;
    return true;
  });

  mutateContent('Page level progress - update global attribute pageLevelProgressIndicatorBar', async (content) => {
    if (coursePlpGlobals.pageLevelProgressIndicatorBar !== plpIndicatorBarDefaultOld) return true;
    coursePlpGlobals.pageLevelProgressIndicatorBar = plpIndicatorBarDefaultNew;
    return true;
  });

  mutateContent('Page level progress - update global attribute pageLevelProgressMenuBar', async (content) => {
    if (coursePlpGlobals.pageLevelProgressMenuBar !== plpMenuBarOld) return true;
    coursePlpGlobals.pageLevelProgressMenuBar = plpMenuBarNew;
    return true;
  });

  mutateContent('Page level progress - update global attribute optionalContent', async (content) => {
    if (coursePlpGlobals.optionalContent !== plpOptionalContentOld) return true;
    coursePlpGlobals.optionalContent = plpOptionalContentNew;
    return true;
  });

  mutateContent('Page level progress - add course attribute _isShownInNavigationBar', async (content) => {
    if (course._pageLevelProgress) course._pageLevelProgress._isShownInNavigationBar = true;

    return true;
  });

  mutateContent('Page level progress - add course attribute _isCompletionIndicatorEnabled', async (content) => {
    if (course._pageLevelProgress) course._pageLevelProgress._isCompletionIndicatorEnabled = false;

    return true;
  });

  mutateContent('Page level progress - add content object attribute _isCompletionIndicatorEnabled', async (content) => {
    configuredContentObjects.forEach(co => (co._pageLevelProgress._isCompletionIndicatorEnabled = false));

    return true;
  });

  mutateContent('Page level progress - add content object attribute _isCompletionIndicatorEnabled', async (content) => {
    configuredComponents.forEach(co => (co._pageLevelProgress._isCompletionIndicatorEnabled = false));

    return true;
  });

  checkContent('Page level progress - check global attribute pageLevelProgressIndicatorBar', async (content) => {
    const isValid = coursePlpGlobals.pageLevelProgressIndicatorBar !== plpIndicatorBarDefaultOld;
    if (!isValid) throw new Error('Page level progress - global attribute pageLevelProgressIndicatorBar');
    return true;
  });

  checkContent('Page level progress - check global attribute pageLevelProgressMenuBar', async (content) => {
    const isValid = coursePlpGlobals.pageLevelProgressMenuBar !== plpMenuBarOld;
    if (!isValid) throw new Error('Page level progress - global attribute pageLevelProgressMenuBar');
    return true;
  });

  checkContent('Page level progress - check global attribute optionalContent', async (content) => {
    const isValid = coursePlpGlobals.optionalContent !== plpOptionalContentOld;
    if (!isValid) throw new Error('Page level progress - global attribute optionalContent');
    return true;
  });

  checkContent('Page level progress - check course attribute _isShownInNavigationBar', async (content) => {
    const isValid = !course._pageLevelProgress || course._pageLevelProgress._isShownInNavigationBar === true;

    if (!isValid) throw new Error('Page level progress - course attribute _isShownInNavigationBar');

    return true;
  });

  checkContent('Page level progress - check course attribute _isCompletionIndicatorEnabled', async (content) => {
    const isValid = !course._pageLevelProgress || course._pageLevelProgress._isCompletionIndicatorEnabled === false;

    if (!isValid) throw new Error('Page level progress - course attribute _isCompletionIndicatorEnabled');

    return true;
  });

  checkContent('Page level progress - check content object attribute _isCompletionIndicatorEnabled', async (content) => {
    const isValid = configuredContentObjects.every(co => co._pageLevelProgress._isCompletionIndicatorEnabled === false);

    if (!isValid) throw new Error('Page level progress - content object attribute _isCompletionIndicatorEnabled');

    return true;
  });

  checkContent('Page level progress - check component attribute _isCompletionIndicatorEnabled', async (content) => {
    const isValid = configuredComponents.every(co => co._pageLevelProgress._isCompletionIndicatorEnabled === false);

    if (!isValid) throw new Error('Page level progress - component attribute _isCompletionIndicatorEnabled');

    return true;
  });

  updatePlugin('Page level progress - update to v4.0.0', { name: 'adapt-contrib-pageLevelProgress', version: '4.0.0', framework: '">=4' });
});
