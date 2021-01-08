import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import { getTreeFromApi, getTreesFromApi } from './actions/trees';

import useStyles from './styles/formStyle';

function TreeSearchForm() {
	const classes = useStyles();
	const dispatch = useDispatch();

	const [ formData, setFormData ] = useState({
		search     : '',
		distance   : '',
		leaf_type  : '',
		height_min : '',
		height_max : '',
		dsh_min    : '',
		dsh_max    : ''
	});

	const handleChange = (evt) => {
		const name = evt.target.name;
		const value = evt.target.value;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		setFormData(formData);

		const searchParams = {
			search     : formData.search,
			distance   : parseFloat(formData.distance) || '',
			leaf_type  : formData.leaf_type,
			height_min : parseFloat(formData.height_min) || '',
			height_max : parseFloat(formData.height_max) || '',
			dsh_min    : parseFloat(formData.dsh_min) || '',
			dsh_max    : parseFloat(formData.dsh_max) || ''
		};

		for (let field in searchParams) {
			if (searchParams[field] === '') {
				delete searchParams[field];
			}
		}

		console.log('Searchparams', searchParams);
		dispatch(getTreesFromApi(searchParams));
	};

	return (
		<form onSubmit={handleSubmit} className={classes.form}>
			<Grid container>
				<Grid item xs={12} className={classes.form}>
					<TextField
						id="search"
						name="search"
						label="Search"
						placeholder="Search Tree Name, Common Name, Scientific Name..."
						onChange={handleChange}
						value={formData.search}
					/>
					<TextField
						id="leaf_type"
						name="leaf_type"
						label="Leaf Type"
						select
						onChange={handleChange}
						value={formData.leaf_type}
					>
						<MenuItem value="">Both</MenuItem>
						<MenuItem value="deciduous">Deciduous</MenuItem>
						<MenuItem value="evergreen">Evergreen</MenuItem>
					</TextField>
					<TextField
						id="distance"
						name="distance"
						label="Miles from Map Center"
						type="number"
						inputProps={{ min: 0, step: 1 }}
						onChange={handleChange}
						value={formData.distance}
					/>
				</Grid>
				<Grid container item xs={12}>
					<Grid item xs={6}>
						Height
						<TextField
							id="height_min"
							name="height_min"
							label="Min"
							type="number"
							inputProps={{ min: 0, max: 500, step: 0.01 }}
							onChange={handleChange}
							value={formData.height_min}
						/>
						<TextField
							id="height_max"
							name="height_max"
							label="Max"
							type="number"
							inputProps={{ min: 1, max: 500, step: 0.01 }}
							onChange={handleChange}
							value={formData.height_max}
						/>
					</Grid>
					<Grid item xs={6}>
						DSH
						<TextField
							id="dsh_min"
							name="dsh_min"
							label="Min"
							type="number"
							inputProps={{ min: 0, max: 500, step: 0.01 }}
							onChange={handleChange}
							value={formData.dsh_min}
						/>
						<TextField
							id="dsh_max"
							name="dsh_max"
							label="Max"
							type="number"
							inputProps={{ min: 1, max: 500, step: 0.01 }}
							onChange={handleChange}
							value={formData.dsh_max}
						/>
					</Grid>
				</Grid>

				<Button
					fullWidth
					variant="outlined"
					color="secondary"
					type="submit"
				>
					Search
				</Button>
			</Grid>
		</form>
	);
}

export default TreeSearchForm;
