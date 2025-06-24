import React from 'react';
import Adapt from 'core/js/adapt';
import a11y from 'core/js/a11y';
import { classes, compile, templates } from 'core/js/reactHelpers';

export default function PageLevelProgress(props) {
  const {
    _items,
    _item,
    _globals
  } = props;

  const _pageLevelProgress = Adapt.course.get('_pageLevelProgress');
  const _drawer = _pageLevelProgress._drawer;

  return (
    <div className="pagelevelprogress__inner">

      <div
        className={classes([
          'drawer__header',
          'pagelevelprogress__header',
          !_drawer.displayTitle && 'aria-label'
        ])}
      >
        <div className='drawer__header-inner pagelevelprogress__header-inner'>

          <div
            id='drawer-heading'
            className='drawer__title pagelevelprogress__title'
            role='heading'
            aria-level={a11y.ariaLevel({ level: 'drawer' })}
          >
            <div
              className='drawer__title-inner pagelevelprogress__title-inner'
              dangerouslySetInnerHTML={{
                __html: compile(_drawer.displayTitle
                  ? _drawer.displayTitle
                  : _pageLevelProgress.title)
              }}
            />
          </div>

          <div className="aria-label">{_globals._extensions._pageLevelProgress.pageLevelProgress}</div>

          {(_drawer.displayTitle && _drawer.body) &&
          <div className='drawer__body pagelevelprogress__body'>
            <div
              className='drawer__body-inner pagelevelprogress__body-inner'
              dangerouslySetInnerHTML={{ __html: compile(_drawer.body) }}
            />
          </div>
          }

        </div>
      </div>

      <div role="list" className="js-children">
        {_items && _items.map(item => <templates.pageLevelProgressItem {...item} _globals={_globals} key={item._id} />)}
        {_item && <templates.pageLevelProgressItem {..._item} _globals={_globals} key={_item._id} />}
      </div>

    </div>
  );
}
