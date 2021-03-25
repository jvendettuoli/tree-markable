import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { getTreesFromApi } from '../actions/trees';

import useStyles from '../styles/formStyle';

function TreeSearchForm({ mapCenter, setCenterOnUser }) {
	const classes = useStyles();
	const dispatch = useDispatch();

	console.log('TreeSearchForm - mapCenter', mapCenter);

	const [ formData, setFormData ] = useState({
		search        : '',
		distance      : '',
		leaf_type     : '',
		fruit_bearing : false,
		height_min    : '',
		height_max    : '',
		dsh_min       : '',
		dsh_max       : ''
	});

	const handleChange = (evt) => {
		const name = evt.target.name;
		const value =
			name === 'fruit_bearing'
				? evt.target.checked
				: evt.target.value;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleSubmit = (evt) => {
		evt.preventDefault();
		setFormData(formData);

		const searchParams = {
			search        : formData.search,
			distance      : parseFloat(formData.distance) || '',
			map_center_x  : mapCenter[1],
			map_center_y  : mapCenter[0],
			leaf_type     : formData.leaf_type,
			fruit_bearing : formData.fruit_bearing || '',
			height_min    : parseFloat(formData.height_min) || '',
			height_max    : parseFloat(formData.height_max) || '',
			dsh_min       : parseFloat(formData.dsh_min) || '',
			dsh_max       : parseFloat(formData.dsh_max) || ''
		};

		for (let field in searchParams) {
			if (searchParams[field] === '') {
				delete searchParams[field];
			}
		}

		console.log('Searchparams', searchParams);
		dispatch(getTreesFromApi(searchParams));
	};

	const handleCenterMapOnUser = () => {
		console.log('handleCenterMapOnUser - click');
		setCenterOnUser(true);
	};

	return (
		<form onSubmit={handleSubmit} className={classes.form}>
			<Grid container>
				<Typography variant="h3">Explore Trees</Typography>
				<Grid item xs={12} className={classes.form}>
					<TextField
						id="search"
						name="search"
						label="Search Term"
						placeholder="Search Tree Name, Common Name, Scientific Name..."
						onChange={handleChange}
						value={formData.search}
					/>
				</Grid>

				<Grid container item xs={12} md={6}>
					<Grid item xs={6}>
						<Typography variant="subtitle1">
							Height (ft.)
						</Typography>
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
						<Typography variant="subtitle1">
							DSH (in.)
						</Typography>
						<TextField
							id="dsh_min"
							name="dsh_min"
							label="Min"
							type="number"
							inputProps={{
								min  : 0,
								max  : 500,
								step : 0.01
							}}
							onChange={handleChange}
							value={formData.dsh_min}
						/>
						<TextField
							id="dsh_max"
							name="dsh_max"
							label="Max"
							type="number"
							inputProps={{
								min  : 1,
								max  : 500,
								step : 0.01
							}}
							onChange={handleChange}
							value={formData.dsh_max}
						/>
					</Grid>
				</Grid>
				<Grid container item xs={12} md={6}>
					<Grid item xs={6} md={12}>
						<TextField
							id="leaf_type"
							name="leaf_type"
							label="Leaf Type"
							select
							onChange={handleChange}
							value={formData.leaf_type}
							fullWidth
						>
							<MenuItem value="">Any</MenuItem>
							<MenuItem value="deciduous">
								Deciduous
							</MenuItem>
							<MenuItem value="evergreen">
								Evergreen
							</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={6} md={12}>
						<FormControlLabel
							control={
								<Checkbox
									id="fruit_bearing"
									name="fruit_bearing"
									onChange={handleChange}
									checked={formData.fruit_bearing}
									color="primary"
								/>
							}
							label="Fruit Bearing"
							labelPlacement="top"
						/>
					</Grid>
				</Grid>
				<Grid container alignItems="center" item xs={12}>
					<Grid item md={8}>
						<TextField
							id="distance"
							name="distance"
							label="Miles from Map Center to Show Trees"
							type="number"
							fullWidth
							inputProps={{ min: 0, step: 1 }}
							onChange={handleChange}
							value={formData.distance}
						/>
					</Grid>
					<Grid container justify="center" item md={4}>
						<Tooltip title="Requires user location permission">
							<Button
								size="small"
								color="primary"
								variant="contained"
								onClick={handleCenterMapOnUser}
							>
								Center on Me
							</Button>
						</Tooltip>
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
