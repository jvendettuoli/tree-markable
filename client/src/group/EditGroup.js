import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import TreeMarkableApi from '../TreeMarkableApi';
import GroupFormBasicFields from './GroupFormBasicFields';
import { groupsRef, uploadImagesToFirebase } from '../firebase/firebaseStorage';
import ImagesInput from '../imageHandling/ImagesInput';
import { updateGroupInApi, deleteGroupInApi } from '../actions/groups';

const useStyles = makeStyles({
	innerContent : {
		padding : 20
	},
	form         : {
		display       : 'flex',
		flexDirection : 'column',
		'& div'       : {
			marginBottom : 10
		}
	}
});

function EditGroup() {
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useDispatch();
	const { id } = useParams();
	const history = useHistory();
	const status = useSelector((st) => st.groups.status);
	const error = useSelector((st) => st.groups.error);
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
		const updated = await dispatch(updateGroupInApi(id, editGroup));
		if (updated) history.push(`/groups/${id}`);
	};

	const handleDelete = async () => {
		const deleted = await dispatch(deleteGroupInApi(id));
		if (deleted) history.push('/groups');
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
