import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import useStyles from './styles/formStyle';
import TreeMarkableApi from './TreeMarkableApi';
import GroupFormBasicFields from './GroupFormBasicFields';
import SelectCoordinates from './SelectCoordinates';
import {
	groupsRef,
	uploadImagesToFirebase
} from './firebase/firebaseStorage';
import ImagesInput from './ImagesInput';

function CreateNewGroup() {
	const classes = useStyles();

	const history = useHistory();
	const INITIAL_GROUP_FORM_DATA = {
		name        : '',
		description : '',
		is_public   : true
	};

	const [ groupFormData, setGroupFormData ] = useState(
		INITIAL_GROUP_FORM_DATA
	);
	const [ imageFiles, setImageFiles ] = useState([]);
	const [ formErrors, setFormErrors ] = useState({ name: false });
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
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		let newGroup = { ...groupFormData };

		for (let field in newGroup) {
			if (newGroup[field] === '') {
				delete newGroup[field];
			}
		}

		console.log('new group', newGroup);
		try {
			const res = await TreeMarkableApi.createGroup(newGroup);

			console.log('Groups Submit res', res);
			console.log('ImageFiles', imageFiles);
			await uploadImagesToFirebase(groupsRef, res.id, imageFiles);

			history.push(`/groups/${res.id}`);
		} catch (err) {
			setFormErrors({ name: true });
		}
	};

	return (
		<div>
			<Typography variant="h4" gutterBottom>
				Create New Group
			</Typography>
			<form onSubmit={handleSubmit} className={classes.form}>
				<GroupFormBasicFields
					formData={groupFormData}
					errors={formErrors}
					onFormChange={handleGroupFormChange}
				/>
				<Divider variant="middle" />
				<div>
					<Typography variant="h5" gutterBottom>
						Group Header Image
					</Typography>
					<ImagesInput
						allowMultiple={false}
						onImageFilesChange={handleImageFilesChange}
					/>
					<Divider variant="middle" />
				</div>

				<Button
					color="secondary"
					variant="contained"
					type="submit"
				>
					Create Group
				</Button>
			</form>
		</div>
	);
}
export default CreateNewGroup;
