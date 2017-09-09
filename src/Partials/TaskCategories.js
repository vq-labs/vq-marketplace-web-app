import React, { Component } from 'react';
import { translate } from '../core/i18n';
import { goTo } from '../core/navigation';

import Chip from 'material-ui/Chip';

const styles = {
  chip: {
    margin: '4px',
  },
  span: {
        marginRight: '5px',
        fontSize: '11px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  categoryStyle: {
      textDecoration: 'none',
      cursor: 'pointer',
      marginBottom:'2px',
      marginRight:'2px',
  },
};

export default class TaskCategories extends Component {
    getChip(category) {
        return (
             <a style={styles.categoryStyle}>
                <Chip 
                    key={category.label}
                    style={styles.margin}
                    onClick={() => {
                        if (this.props.clickable) {
                            goTo(`/?category=${category.code}`);
                        }
                }}>
                    <div>{translate(category.code)}</div>
                </Chip> 
             </a>
        );
    }
    render() {
        return (
             <div style={styles.wrapper}>
                    { this.props.categories && this.props.categories.map( 
                        (category, i) => this.getChip(category)
                    ) }
            </div>
        );
    };
}
