import React, { useEffect } from 'react';
import { compile, classes } from 'core/js/reactHelpers';
import a11y from 'core/js/a11y';
import data from 'core/js/data';
import completionCalculations from '../js/completionCalculations';
import PageLevelProgressIndicatorView from '../js/PageLevelProgressIndicatorView';

export default function PageLevelProgressItem(props) {
  const {
    _globals,
    _isOptional,
    _isLocked,
    _isVisible,
    _isComplete,
    title,
    _id,
    _type,
    _children
  } = props;

  const indicatorSeat = React.createRef();
  useEffect(() => {
    if (_isOptional) return;
    const model = data.findById(_id);
    const item = new PageLevelProgressIndicatorView({
      model,
      calculatePercentage: model.isTypeGroup('contentobject') && completionCalculations.calculatePercentageComplete.bind(this, model, true)
    });
    $(indicatorSeat.current).append(item.$el);
  });

  return (
    <div
      className={classes([
        'pagelevelprogress__item drawer__item',
        `${_type}__indicator`
      ])}
      role='listitem'
    >
      <button
        className={classes([
          'pagelevelprogress__item-btn drawer__item-btn',
          'js-indicator js-pagelevelprogress-item-click',
          (_isLocked || !_isVisible) && 'is-disabled'
        ])}
        ref={indicatorSeat}
        data-pagelevelprogress-id={_id}
        aria-label={classes([
          (_isLocked || !_isVisible) && `${_globals._accessibility._ariaLabels.locked}.`,
          _isOptional && `${_globals._extensions._pageLevelProgress.optionalContent}.`,
          !_isOptional && _isComplete && `${_globals._accessibility._ariaLabels.complete}.`,
          !_isOptional && !_isComplete && `${_globals._accessibility._ariaLabels.incomplete}.`,
          compile(a11y.normalize(title))
        ])}
      >

        <span className="pagelevelprogress__item-title drawer__item-title">
          <span className="pagelevelprogress__item-title-inner drawer__item-title-inner" dangerouslySetInnerHTML={{ __html: compile(title) }}>
          </span>
        </span>

        {_isOptional &&
        <span className="pagelevelprogress__item-optional">
          <span className="pagelevelprogress__item-optional-inner">
            {_globals._extensions._pageLevelProgress.optionalContent}
          </span>
        </span>
        }

      </button>
      <div className='pagelevelprogress__item-children'>
        <div role="list" className="js-children">
          {_children && _children.map(item => <PageLevelProgressItem {...item} key={item._id} _globals={_globals} />)}
        </div>
      </div>
    </div>
  );

}
