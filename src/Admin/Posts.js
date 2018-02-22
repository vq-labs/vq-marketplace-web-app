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
import {getParams} from '../core/util'
import apiPost from '../api/post';
import {goTo, setQueryParams} from '../core/navigation';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';

export default class SectionPosts extends React.Component {
  constructor() {
    super();

    const viewType = getParams(location.search).type;

    this.state = {
      type: viewType || 'email',
      posts: []
    };
  }

  getPosts(type) {
    return apiPost
      .getItems({type}, {returnRaw: true})
      .then(posts => {
        this.setState({
          posts
        });
      });
  }

  componentDidMount() {
    this.getPosts(this.state.type);
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h1>Posts</h1>
        </div>
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-8">
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
                <MenuItem value={'email'} primaryText="Emails"/>
                <MenuItem value={'terms'} primaryText="Terms"/>
                <MenuItem value={'page'} primaryText="Page"/>
                {false && <MenuItem value={'blog'} primaryText="Blog"/>}
              </DropDownMenu>
            </div>
            <div className="col-xs-4 text-right">
              {this.state.type === 'page' &&
              <RaisedButton
                primary
                onTouchTap={() => {
                  goTo('/post');
                  location.reload();
                }}
                label="New Page"/>
              }
            </div>
          </div>
        </div>
        {this.state.type === 'email' &&
        <div className="col-xs-12">
          <p className="text-muted">Read about e-mail content here: <a
            href="https://vqlabs.freshdesk.com/solution/articles/33000208415-email-descriptions"
            target="_blank">here</a>.</p>
        </div>
        }
        <div className="col-xs-12">
          <Table selectable={true} onRowSelection={index => {
            goTo(`/post/${this.state.posts[index].id}/edit`)
          }}>
            <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn tooltip="Post ID">ID</TableHeaderColumn>
                <TableHeaderColumn tooltip="Type">Type</TableHeaderColumn>
                <TableHeaderColumn tooltip="Slug">Slug</TableHeaderColumn>
                <TableHeaderColumn tooltip="Title">Title</TableHeaderColumn>
                <TableHeaderColumn tooltip="Title">Receiver</TableHeaderColumn>
                <TableHeaderColumn tooltip="Event code when the email is sent.">Sent when?</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} stripedRows={true}>
              {!this.state.posts.length &&
              <TableRow>
                <TableRowColumn>No articles of type {this.state.type} has been
                  initialised.</TableRowColumn>
              </TableRow>
              }
              {this.state.posts
                .map((post, index) =>
                  <TableRow style={{cursor: 'pointer'}} key={index}>
                    <TableRowColumn>{post.id}</TableRowColumn>
                    <TableRowColumn>{post.type}</TableRowColumn>
                    <TableRowColumn>{post.code}</TableRowColumn>
                    <TableRowColumn>{post.title}</TableRowColumn>
                    <TableRowColumn>{post.targetUserType ? (post.targetUserType === 1 ? 'Demand' : 'Supply') : '-'}</TableRowColumn>
                    <TableRowColumn>{post.eventTrigger}</TableRowColumn>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}
