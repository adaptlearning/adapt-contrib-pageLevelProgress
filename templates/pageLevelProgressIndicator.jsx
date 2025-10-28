import React from 'react';
import { compile } from 'core/js/reactHelpers';

export default function PageLevelProgressIndicator (props) {
  const {
    ariaLabel,
    _isOptional
  } = props;

  // Build aria-label with optional prefix if needed
  const compiledAriaLabel = ariaLabel ? compile(ariaLabel, props) : '';
  const fullAriaLabel = _isOptional ? `Optional. ${compiledAriaLabel}` : compiledAriaLabel;

  // Only render wrapper group when optional label exists
  if (_isOptional) {
    return (
      <span className='pagelevelprogress__indicator-group'>
        <span className='pagelevelprogress__indicator'>
          <span className="pagelevelprogress__indicator-inner">

            <span className="pagelevelprogress__indicator-bar"></span>

            {ariaLabel &&
            <span className="aria-label">
              {fullAriaLabel}
            </span>
            }

          </span>
        </span>

        <span className="pagelevelprogress__indicator-label" aria-hidden="true">
          Optional
        </span>
      </span>
    );
  }

  return (
    <span className='pagelevelprogress__indicator'>
      <span className="pagelevelprogress__indicator-inner">

        <span className="pagelevelprogress__indicator-bar"></span>

        {ariaLabel &&
        <span className="aria-label">
          {fullAriaLabel}
        </span>
        }

      </span>
    </span>
  );
};
