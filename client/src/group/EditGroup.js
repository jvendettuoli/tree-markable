import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import GroupFormBasicFields from './GroupFormBasicFields';
import { updateGroup, deleteGroup } from '../actions/groups';
import { removeFromFollowedGroups } from '../actions/currUser';
import form from '../styles/form';
import innerContent from '../styles/innerContent';

const useStyles = makeStyles((theme) => {
	return {
		innerContent : innerContent(theme),
		form         : form(theme)
	};
});

function EditGroup() {
	const theme = useTheme();
	const classes = useStyles(theme);
	const dispatch = useDispatch();
	const { id } = useParams();
	const history = useHistory();
	const [ action, setAction ] = useState(null);
	const status = useSelector((st) => st.groups.status);
	const group = useSelector((st) => st.groups.entities[id]);

	if (status === 'success') {
		if (action === 'edit') history.push(`/groups/${id}`);
		if (action === 'delete') history.push(`/groups`);
	}

	const INITIAL_GROUP_FORM_DATA = {
		name        : '',
		description : '',
		is_public   : true
	};
	const [ groupFormData, setGroupFormData ] = useState(INITIAL_GROUP_FORM_DATA);

	const handleGroupFormChange = (data) => {
		let { name, value } = data;
		if (name === 'is_public') {
			value = data.checked;
		}

		setGroupFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	// On form submit, convert data to type expected by server
	// and make POST request to create new group
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		let editGroup = { ...groupFormData };

		for (let field in editGroup) {
			if (editGroup[field] === '') {
				delete editGroup[field];
			}
		}

		console.log('EditGroup - editGroup', editGroup);
		setAction('edit');
		dispatch(updateGroup(id, editGroup));
	};

	const handleDelete = async () => {
		setAction('delete');
		dispatch(removeFromFollowedGroups(group.creator, id));
		dispatch(deleteGroup(id));
	};

	const handleCancel = () => {
		history.push(`/groups/${id}`);
	};

	return (
		<div className={classes.innerContent}>
			<Typography variant="h4" gutterBottom>
				Edit Group
			</Typography>
			<form onSubmit={handleSubmit} className={classes.form}>
				<GroupFormBasicFields formData={groupFormData} onFormChange={handleGroupFormChange} edit={true} />

				<Grid container item justify="space-between" style={{ paddingLeft: 40, paddingRight: 40 }}>
					<Button onClick={handleCancel} variant="contained" color="secondary">
						Go Back
					</Button>
					<Button
						onClick={handleDelete}
						variant="contained"
						style={{ backgroundColor: theme.palette.error.dark, color: theme.palette.error.contrastText }}
					>
						Delete Group
					</Button>
					<Button variant="contained" color="primary" type="submit">
						Save Edits
					</Button>
				</Grid>
			</form>
		</div>
	);
}
export default EditGroup;
