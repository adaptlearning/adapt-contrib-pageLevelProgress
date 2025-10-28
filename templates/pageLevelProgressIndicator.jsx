import React from 'react';
import { compile } from 'core/js/reactHelpers';

export default function PageLevelProgressIndicator (props) {
  const {
    ariaLabel
  } = props;

  return (
    <span className='pagelevelprogress__indicator'>
      <span className="pagelevelprogress__indicator-inner">

        <span className="pagelevelprogress__indicator-bar"></span>

        {ariaLabel &&
        <span className="aria-label">
          {compile(ariaLabel, props)}
        </span>
        }

      </span>
    </span>
  );
};
