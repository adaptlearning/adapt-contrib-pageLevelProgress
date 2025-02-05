import { describe, whereContent, whereFromPlugin, mutateContent, checkContent, updatePlugin } from 'adapt-migrations';

describe('Page level progress - v3.0.0 to v3.1.0', async () => {
  // https://github.com/adaptlearning/adapt-contrib-pageLevelProgress/compare/v3.0.0..v3.1.0

  let configuredContentObjects;

  whereFromPlugin('Page level progress - from v3.0.0', { name: 'adapt-contrib-pageLevelProgress', version: '<3.1.0' });

  whereContent('Page level progress is configured', content => {
    configuredContentObjects = content.filter(({ _type, _pageLevelProgress }) => {
      if (!_pageLevelProgress) return false;
      return _type === 'page' || _type === 'menu';
    });
    return configuredContentObjects.length;
  });

  mutateContent('Page level progress - add content object attribute _excludeAssessments', async (content) => {
    configuredContentObjects.forEach(co => (co._pageLevelProgress._excludeAssessments = false));

    return true;
  });

  checkContent('Page level progress - check content object attribute _excludeAssessments', async (content) => {
    const isValid = configuredContentObjects.every(co => co._pageLevelProgress._excludeAssessments === false);

    if (!isValid) throw new Error('Page level progress - content object attribute _excludeAssessments');

    return true;
  });

  updatePlugin('Page level progress - update to v3.1.0', { name: 'adapt-contrib-pageLevelProgress', version: '3.1.0', framework: '">=2.2.0' });
});
