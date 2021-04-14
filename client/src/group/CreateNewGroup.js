import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addToFollowedGroups } from '../actions/currUser';
import { createGroup } from '../actions/groups';
import ImagesInput from '../imageHandling/ImagesInput';
import form from '../styles/form';
import innerContent from '../styles/innerContent';
import GroupFormBasicFields from './GroupFormBasicFields';

const useStyles = makeStyles((theme) => {
	return {
		innerContent : innerContent(theme),
		form         : form(theme)
	};
});

function CreateNewGroup() {
	const theme = useTheme();
	const classes = useStyles(theme);
	const dispatch = useDispatch();
	const history = useHistory();
	const userId = useSelector((st) => st.currUser.uid);
	const INITIAL_GROUP_FORM_DATA = {
		name        : '',
		description : '',
		is_public   : true
	};
	const [ groupFormData, setGroupFormData ] = useState(INITIAL_GROUP_FORM_DATA);
	const [ imageFiles, setImageFiles ] = useState([]);

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

	const handleImageFilesChange = (files) => {
		console.log('handleImageFilesChange', files);
		setImageFiles(files);
	};

	// On form submit, convert data to type expected by server
	// and make POST request to create new group
	// Add group to creator's followed groups
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		let newGroup = { ...groupFormData };

		for (let field in newGroup) {
			if (newGroup[field] === '') {
				delete newGroup[field];
			}
		}

		console.log('new group', newGroup);
		const groupId = await dispatch(createGroup(newGroup, imageFiles));
		dispatch(addToFollowedGroups(userId, groupId, true));

		if (groupId) {
			console.log('CreateNewGroup - groupId', groupId);
			history.push(`/groups/${groupId}`);
		}
	};

	return (
		<div className={classes.innerContent}>
			<Typography variant="h4" gutterBottom>
				Create New Group
			</Typography>
			<form onSubmit={handleSubmit} className={classes.form}>
				<GroupFormBasicFields formData={groupFormData} onFormChange={handleGroupFormChange} />
				<Divider variant="middle" style={{ marginTop: 15, marginBottom: 15 }} />
				<div>
					<Typography variant="h5" gutterBottom>
						Group Header Image
					</Typography>
					<ImagesInput allowMultiple={false} onImageFilesChange={handleImageFilesChange} />
					<Divider variant="middle" style={{ marginBottom: 15 }} />
				</div>

				<Button color="secondary" variant="contained" type="submit">
					Create Group
				</Button>
			</form>
		</div>
	);
}
export default CreateNewGroup;
