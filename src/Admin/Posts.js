import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import apiPost from '../api/post';
import { goTo, setQueryParams } from '../core/navigation';
import DropDownMenu from 'material-ui/DropDownMenu';



export default class SectionPosts extends React.Component {
    constructor() {
        super();
        this.state = {
            type: 'terms',
            posts: []
        };
    }
   
    getPosts(type) {
        return apiPost
            .getItems({ type }, { returnRaw: true })
            .then(posts => {
                this.setState({
                    posts
                });
            });
    }

    componentDidMount() {
        this.getPosts('terms');
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12">
                    <h1>Posts</h1>
                </div>
                <div className="col-xs-12">
                    <DropDownMenu value={this.state.type} onChange={(event, index, value) => {
                        this.setState({
                            posts: [],
                            type: value
                        });

                        setQueryParams({
                            type: value
                        });
                        
                        this.getPosts(value);
                    }}>
                        <MenuItem value={'email'} primaryText="Emails" />
                        <MenuItem value={'terms'} primaryText="Terms" />
                        <MenuItem value={'blog'} primaryText="Blog" />
                        <MenuItem value={'process'} primaryText="Process" />
                    </DropDownMenu>
                </div>
                <div className="col-xs-12"> 
                    <Table selectable={true} onRowSelection={index => {
                        goTo(`/post/${this.state.posts[index].id}/edit`)   
                    }} >
                        <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                            <TableHeaderColumn tooltip="Post ID">ID</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Type">Type</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Slug">Slug</TableHeaderColumn>
                            <TableHeaderColumn tooltip="Title">Title</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} stripedRows={true} >
                            { !this.state.posts.length &&
                                <TableRow>
                                    <TableRowColumn>No articles of type {this.state.type} has been initialised.</TableRowColumn>
                                </TableRow>
                            }
                            { this.state.posts
                              .map((post, index) =>
                                <TableRow key={index} >
                                    <TableRowColumn>{post.id}</TableRowColumn>
                                    <TableRowColumn>{post.type}</TableRowColumn>
                                    <TableRowColumn>{post.code}</TableRowColumn>
                                    <TableRowColumn>{post.title}</TableRowColumn>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>    
            </div>
        );
    }
}
