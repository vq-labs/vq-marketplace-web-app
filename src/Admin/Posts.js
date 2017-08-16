import React from 'react';
import * as apiConfig from '../api/config';
import apiPost from '../api/post';
import EditableEntity from '../Components/EditableEntity';
import * as coreNavigation from '../core/navigation';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import * as coreUtil from '../core/util.js'
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const defaultConfigsFields = [
    {
        type: 'string',
        key: 'NAME',
        label: 'Marketplace name'
    },
    {
        type: 'string',
        key: 'DOMAIN',
        label: 'What is your domain url? (with http or https)'
    },
    {
        type: 'string',
        key: 'LOGO_URL',
        label: 'Marketplace logo'
    },
    {
        type: 'string',
        key: 'PROMO_URL',
        label: 'Marketplace promo'
    },
    {
        type: 'string',
        key: 'SOCIAL_FB_USERNAME',
        label: 'Facebook username'
    },
    {
        type: 'string',
        key: 'COMPANY_NAME_SHORT',
        label: 'Short version of company name (will be included in landing page)'
    },
    {
        type: 'string',
        key: 'COMPANY_NAME',
        label: 'What is your company name? (will be included in emails and impressum)'
    },
    {
        type: 'string',
        key: 'COMPANY_ADDRESS',
        label: 'What is your company address? (will be included in emails and impressum)'
    },
    {
        type: 'string',
        key: 'COMPANY_CEO',
        label: 'Who is the CEO of your company? (will be included in emails and impressum)'
    },
    {
        type: 'string',
        key: 'COMPANY_URL',
        label: 'Company website (will be included in landing page, emails and impressum)'
    }
];

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

                        coreNavigation.setQueryParams({ type: value });
                        
                        this.getPosts(value);
                    }}>
                        <MenuItem value={'email'} primaryText="Emails" />
                        <MenuItem value={'terms'} primaryText="Terms" />
                        <MenuItem value={'blog'} primaryText="Blog" />
                    </DropDownMenu>
                </div>
                <div className="col-xs-12"> 
                    <Table selectable={true} onRowSelection={index => {
                        coreNavigation.goTo(`/post/${this.state.posts[index].id}/edit`)   
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
