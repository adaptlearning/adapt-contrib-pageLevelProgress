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

  return (
    <div className="pagelevelprogress__inner">

      <div className='pagelevelprogress__header'>
        <div className='pagelevelprogress__header-inner'>

          <div
            id='drawer-heading'
            className={classes([
              'pagelevelprogress__title',
              !_pageLevelProgress.displayTitle && 'aria-label'
            ])}
            role='heading'
            aria-level={a11y.ariaLevel({ level: 'drawer' })}
          >
            <div
              className='pagelevelprogress__title-inner'
              dangerouslySetInnerHTML={{
                __html: compile(_pageLevelProgress.displayTitle
                  ? _pageLevelProgress.displayTitle
                  : _pageLevelProgress.title)
              }}
            />
          </div>

          <div className="aria-label">{_globals._extensions._pageLevelProgress.pageLevelProgress}</div>

          {_pageLevelProgress.body &&
          <div className='pagelevelprogress__body'>
            <div
              className='pagelevelprogress__body-inner'
              dangerouslySetInnerHTML={{ __html: compile(_pageLevelProgress.body) }}
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
