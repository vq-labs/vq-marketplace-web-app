import React from 'react';
import DOMPurify from 'dompurify'
import Moment from 'react-moment';

const displayText = (text, props) => {
    props = props || {};

    if (props.type === 'html') {
        return <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text)}}></div>;
    }

    if (props.type === 'datetime') {
        return <Moment format={`DD.MM.YYYY, HH:mm`}>{text}</Moment>
    }

    return text;
};

const displayObject = (obj, options) => {
    if (!obj) {
        return 'nothing to display';
    }

    options = options || {};
    options.fields = options.fields || {};

    options.fields.createdAt = {
        type: 'datetime'
    };

    options.fields.updatedAt = {
        type: 'datetime'
    };

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
                            {objKey}: {displayText(valueToBeDisplayed, options.fields[objKey])}
                            <hr />
                        </div>;
            }

            if (obj[objKey] === null || obj[objKey] === undefined) {
                return void 0;
            }

            return  <div className="col-xs-12">
                        <strong>{objKey}</strong>
                        <div className="col-xs-12">
                            {displayObject(obj[objKey], options)}
                        </div>
                        <hr />
                    </div>;
        });
};

export default displayObject;
