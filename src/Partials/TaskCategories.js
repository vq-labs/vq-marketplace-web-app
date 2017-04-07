import React, { Component } from 'react';
import { browserHistory } from 'react-router';

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
  marginBottom: {
      marginBottom:'2px',
      marginRight:'2px',
  },
};

export default class TaskCategories extends Component {
    getChip(category) {
        return (
             <a style={styles.marginBottom}>
                <Chip key={category.label} style={styles.margin} onClick={() => browserHistory.push('/app?category=' + category.code)} >
                    <div>{category.label}</div>
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
