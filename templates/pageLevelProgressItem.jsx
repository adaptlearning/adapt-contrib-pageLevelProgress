import React, { useEffect } from 'react';
import { compile, classes } from 'core/js/reactHelpers';
import a11y from 'core/js/a11y';
import data from 'core/js/data';
import location from 'core/js/location';
import completionCalculations from '../js/completionCalculations';
import PageLevelProgressIndicatorView from '../js/PageLevelProgressIndicatorView';

export default function PageLevelProgressItem(props) {
  const {
    _globals,
    _isOptional,
    _isLocked,
    _isVisible,
    _isComplete,
    _isCorrect,
    _isAtLeastOneCorrectSelection,
    _canShowMarking,
    title,
    altTitle,
    _id,
    _type,
    _children
  } = props;

  const isCorrect = (_canShowMarking && _isComplete && _isCorrect === true);
  const isPartlyCorrect = (_canShowMarking && _isComplete && _isCorrect === false && _isAtLeastOneCorrectSelection);
  const isIncorrect = (_canShowMarking && _isComplete && _isCorrect === false && !_isAtLeastOneCorrectSelection);

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
        `${_type}__indicator`,
        (location._currentModel.get('_id') === _id) && 'is-current-location'
      ])}
      role='listitem'
    >
      <button
        className={classes([
          'pagelevelprogress__item-btn drawer__item-btn',
          'js-indicator js-pagelevelprogress-item-click',
          `is-${_type}-indicator`,
          (_isComplete) && 'is-complete',
          (_isOptional) && 'is-optional',
          (_isLocked) && 'is-locked',
          (_isLocked || !_isVisible) && 'is-disabled'
        ])}
        ref={indicatorSeat}
        data-pagelevelprogress-id={_id}
        aria-label={classes([
          (_isLocked || !_isVisible) && `${_globals._accessibility._ariaLabels.locked}.`,
          _isOptional && `${_globals._extensions._pageLevelProgress.optionalContent}.`,
          !_isOptional && _isComplete && `${_globals._accessibility._ariaLabels.complete}.`,
          !_isOptional && !_isComplete && `${_globals._accessibility._ariaLabels.incomplete}.`,
          isCorrect && `${_globals._accessibility._ariaLabels.answeredCorrectly}.`,
          isPartlyCorrect && `${_globals._accessibility._ariaLabels.answeredPartlyCorrect ?? _globals._accessibility._ariaLabels.answeredIncorrectly}.`,
          isIncorrect && `${_globals._accessibility._ariaLabels.answeredIncorrectly}.`,
          compile(a11y.normalize(altTitle || title))
        ])}
      >

        <span className="pagelevelprogress__item-title drawer__item-title">
          <span className="pagelevelprogress__item-title-inner drawer__item-title-inner" dangerouslySetInnerHTML={{ __html: compile(altTitle || title, props) }}>
          </span>
        </span>

        {_isOptional &&
        <span className="pagelevelprogress__item-optional">
          <span className="pagelevelprogress__item-optional-inner">
            {_globals._extensions._pageLevelProgress.optionalContent}
          </span>
        </span>
        }

        <span className='pagelevelprogress__item-icon'>
          <span className='icon' aria-hidden="true"></span>
        </span>

      </button>
      <div className='pagelevelprogress__item-children'>
        <div role="list" className="js-children">
          {_children && _children.map(item => <PageLevelProgressItem {...item} key={item._id} _globals={_globals} />)}
        </div>
      </div>
    </div>
  );

}
