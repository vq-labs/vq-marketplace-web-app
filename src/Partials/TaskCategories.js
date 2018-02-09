import React, { Component } from 'react';
import { goTo } from '../core/navigation';
import { getCategoriesAsync } from '../core/categories.js';
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
    constructor() {
        super();

        this.state = {};
    }

    componentDidMount() {
        getCategoriesAsync(categories => {
            const categoryLabels = {};
            
            categories.forEach(category => {
                categoryLabels[category.code] = category.label;
            });

            this.setState({
                categoryLabels
            });
        });
    }
    getChip(category) {
        return (
             <a key={category.id} style={styles.categoryStyle}>
                <Chip 
                    style={styles.margin}
                    onClick={() => {
                        if (this.props.clickable) {
                            goTo(`/?category=${category.code}`);
                        }
                }}>
                    <div>{this.state.categoryLabels[category.code]}</div>
                </Chip> 
             </a>
        );
    }
    render() {
        return (
             <div style={styles.wrapper}>
                    {   this.state.categoryLabels &&
                        this.props.categories.length > 0 &&
                        this.props.categories.filter(category => Number(category.status) === 0).map(
                        (category, i) => this.getChip(category)
                    )}
            </div>
        );
    };
}
