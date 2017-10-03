import React from 'react';

const displayObject = (obj, options) => {
    if (!obj) {
        return 'nothing to display';
    }

    options = options || {};

    return Object.keys(obj)
        .map(objKey => {
            if (typeof obj[objKey] === 'string' || typeof obj[objKey] === 'number') {
                let valueToBeDisplayed;

                if (options.doNotTrim) {
                    valueToBeDisplayed = obj[objKey];
                } else {
                    const maybeThreeDots = String(obj[objKey]).length > 50 ? '...' : '';

                    valueToBeDisplayed = `${String(obj[objKey]).substring(0, 50)}${maybeThreeDots}`;
                }

                return <div className="col-xs-12">
                            {objKey}: {valueToBeDisplayed}
                        </div>;
            }

            if (obj[objKey] === null || obj[objKey] === undefined) {
                return <div className="col-xs-12">
                            {objKey}: null
                        </div>;
            }

            return  <div className="col-xs-12">
                        <strong>{objKey}</strong>
                        <div className="col-xs-12">
                            {displayObject(obj[objKey], options)}
                        </div>
                    </div>;
        });
};

export default displayObject;
