import React from 'react';
import { compile, templates } from 'core/js/reactHelpers';

export default function PageLevelProgress(props) {
  const {
    _items,
    _item,
    _globals
  } = props;

  return (
    <div className="pagelevelprogress__inner">
      <span className='aria-label'>{compile(_globals._extensions._pageLevelProgress.pageLevelProgress)}</span>

      <div role="list" className="js-children">
        {_items && _items.map(item => <templates.pageLevelProgressItem {...item} _globals={_globals} key={item._id} />)}
        {_item && <templates.pageLevelProgressItem {..._item} _globals={_globals} key={_item._id} />}
      </div>

    </div>
  );
}
