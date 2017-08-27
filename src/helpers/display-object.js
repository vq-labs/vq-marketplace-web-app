import React from 'react';

const displayObject = obj => {
    if (!obj) {
        return 'nothing to display';
    }

    return Object.keys(obj)
        .map(objKey => {
            if (typeof obj[objKey] === 'string' || typeof obj[objKey] === 'number') {
                const valueToBeDisplayed = String(obj[objKey]).substring(0, 50);
                const maybeThreeDots = String(obj[objKey]).length > 50 ? '...' : '';

                return <div className="col-xs-12">
                            {objKey}: {valueToBeDisplayed}{maybeThreeDots}
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
                            {displayObject(obj[objKey])}
                        </div>
                    </div>;
        });
};

export default displayObject;
