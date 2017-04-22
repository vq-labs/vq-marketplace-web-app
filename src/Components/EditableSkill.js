import React, { Component } from 'react';
import { ListItem } from 'material-ui/List';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';

const SKILL_LEVELS = [
    'Beginner',
    'Intermediate',
    'Expert'
];

export default class Skill extends Component {
    constructor(props) {
        super();

        this.state = {
            allowChange: props.allowChange,
            editMode: props.skill.editMode,
            skillId: props.skillId,
            key: props.index,
            skill: {
                _id: props.skill._id,
                level: props.skill.level,
                name: props.skill.name
            },
            options: props.options
        };
    }
    componentWillReceiveProps (nextProps) {
        const skill = nextProps.skill;

        const newState = {
            skill: skill,
            options: nextProps.options || []
        };

        if (skill.editMode) {
            newState.editMode = skill.editMode;
        }

        this.setState(newState);
    }
    getEditMenu () {
        if (this.state.allowChange) {
            return <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        >
                        <MenuItem primaryText="Editieren" onClick={ () => { 
                            this.setState({ editMode: true });
                        } }/>
                        <MenuItem primaryText="Entfernen" onClick={ () => { 
                            this.props.onDelete(this.state.skill);
                        } }/>
                    </IconMenu>;
        }

        return <div></div>;
    }

    getStaticSkill(skill) {

                return <ListItem
                        primaryText={skill.name}
                        secondaryText={SKILL_LEVELS[skill.level]}
                        rightIcon={ this.getEditMenu() }
                />;
    }
    getDataSource() {
        return this.state.options;
    }
    getEditableSkill () {
        return <div className="row">
                        <div className="col-xs-12">
                            <AutoComplete
                                disabled={this.state.skillId}
                                openOnFocus={true}
                                style={ { paddingLeft: '24px', paddingRight: '24px' } }
                                fullWidth={true}
                                onUpdateInput={
                                    searchString => {
                                        const newSkill = this.state.skill;

                                        newSkill.name = searchString;
                                        
                                        this.setState({ skill: newSkill });
                                        this.setState({ options: this.state.options });
                                    }
                                }
                                onNewRequest={
                                    searchString => {
                                        const newSkill = this.state.skill;

                                        newSkill.name = searchString;
                                        
                                        this.setState({ skill: newSkill });
                                    }
                                }
                                menuStyle={{ maxHeight: '300px' }}
                                searchText={this.state.skill.name}
                                floatingLabelText="Type your skill e.g 'JavaScript'"
                                filter={AutoComplete.caseInsensitiveFilter}
                                dataSource={ this.getDataSource() }
                            />
                    </div>
                    <div className="col-xs-12">
                        <DropDownMenu
                            autoWidth={false}
                            style={ { width: '100%', padding: '0px' } }
                            onChange={(event, target, value) => {
                                const newSkill = this.state.skill;

                                newSkill.level = value;
                                
                                this.setState({ skill: newSkill });
                            }} 
                            value={this.state.skill.level} >
                                <MenuItem value={null} primaryText="-" />
                                <MenuItem value={0} primaryText={SKILL_LEVELS[0]} />
                                <MenuItem value={1} primaryText={SKILL_LEVELS[1]} />
                                <MenuItem value={2} primaryText={SKILL_LEVELS[2]} />
                        </DropDownMenu>    
                    </div>
                    <div className="col-xs-12">
                         <FlatButton
                            primary={true}
                            onClick={ () => {
                                this.setState( { editMode: false });
                                this.props.onConfirm(this.state.skill);
                            } 
                            }
                            label="Bestätigen" disabled={!this.state.skill.name} style={ { float: 'right' } }
                        />
                        <FlatButton 
                         secondary={true}
                         onClick={ () => {
                             this.setState( { editMode: false });
                             this.props.onCancel(this.state.skill)
                          } } label="Abbrechen" disabled={false} style={ { float: 'right' } }/>
                       
                    </div>
                </div> ;
    }

    render() {
        return (
            <div className="col-xs-12">
                {
                   !this.state.editMode && this.getStaticSkill(this.state.skill)
                }

                { 
                   this.state.editMode && this.getEditableSkill(this.state.skill) 
                }
           </div>
        );
    } 
};
