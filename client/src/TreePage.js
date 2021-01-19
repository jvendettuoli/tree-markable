import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import useStyles from './styles/formStyle';

import { getTreeFromApi, getTreesFromApi } from './actions/trees';
import SelectLocationMap from './SelectLocationMap';
import ImagesInput from './ImagesInput';
import Carousel from './Carousel';
import ShowTreeMap from './ShowTreeMap';
import CommentsContainer from './CommentsContainer';
import {
	treesRef,
	downloadImageUrlsFromFirebase
} from './firebase/firebaseStorage';
import FavoriteIconBtn from './FavoriteIconBtn';
import EditIconBtn from './EditIconBtn';

function TreePage() {
	const classes = useStyles();
	const { id } = useParams();
	const tree = useSelector((st) => st.trees.trees[id]);
	const uid = useSelector((st) => st.currUser.uid);
	console.log('TreePage - tree', tree);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ imageUrls, setImageUrls ] = useState({
		primary : '',
		album   : []
	});

	const dispatch = useDispatch();

	// If Tree not already in store, request it from API
	useEffect(
		() => {
			const getTree = async (treeId) => {
				dispatch(getTreeFromApi(treeId));
			};
			if (!tree) {
				getTree(id);
			}
		},
		[ tree, id ]
	);

	// Get Tree Images from FirebaseStorage
	useEffect(
		() => {
			const getImageUrls = async (collectionRef, id) => {
				const imgUrls = await downloadImageUrlsFromFirebase(
					collectionRef,
					id
				);
				console.log('imgUrls', imgUrls);
				if (imgUrls) {
					setImageUrls(imgUrls);
				}
				setIsLoading(false);
			};

			if (isLoading) {
				getImageUrls(treesRef, id);
			}
		},
		[ isLoading, id ]
	);

	if (isLoading) {
		return <div>Loading</div>;
	}

	const displayImages = (imageUrls) => {
		if (imageUrls.primary === '') return null;
		else {
			return (
				<Carousel
					imageUrls={[ imageUrls.primary, ...imageUrls.album ]}
				/>
			);
		}
	};

	const treeFieldLabels = [
		{
			field : 'common_name',
			label : 'Common Name',
			value : tree.common_name
		},
		{
			field : 'scientific_name',
			label : 'Scientific Name',
			value : tree.scientifc_name && <i>{tree.scientific_name}</i>
		},
		{ field: 'height', label: 'Height (ft.)', value: tree.height },
		{ field: 'dsh', label: 'DSH (in.)', value: tree.dsh },
		{ field: 'leaf_type', label: 'Leaf Type', value: tree.leaf_type },
		{
			field : 'fruit_bearing',
			label : 'Fruit Bearing',
			value : tree.fruit_bearing && 'Yes'
		},
		{
			field : 'geolocation',
			label : 'Coordinates',
			value : `(${tree.geolocation.y}, ${tree.geolocation.x})`
		}
	];

	return (
		<div className={classes.root}>
			<Grid container>
				<Grid item xs={12}>
					{displayImages(imageUrls)}
				</Grid>
				<Grid
					container
					item
					xs={12}
					md={6}
					alignItems="flex-start"
				>
					<Grid
						container
						item
						xs={12}
						alignItems="center"
						wrap="nowrap"
					>
						<Typography variant="h3">{tree.name}</Typography>
						<Grid item>
							<FavoriteIconBtn treeId={tree.id} />
							{uid === tree.creator && (
								<EditIconBtn type={'trees'} id={tree.id} />
							)}
						</Grid>
					</Grid>
					{tree.description && (
						<Grid item xs={12}>
							<Typography>{tree.description}</Typography>
						</Grid>
					)}

					{treeFieldLabels.map((item, idx) => {
						return (
							item.value && (
								<React.Fragment key={`label-${idx}`}>
									<Grid item xs={6}>
										<Typography
											variant={
												item.labelVariant || 'h6'
											}
										>
											{item.label}:
										</Typography>
									</Grid>
									<Grid item xs={6}>
										<Typography
											variant={
												item.valueVariant ||
												'body1'
											}
										>
											{item.value}
										</Typography>
									</Grid>
								</React.Fragment>
							)
						);
					})}
				</Grid>
				<Grid item xs={12} md={6}>
					<ShowTreeMap tree={tree} />
				</Grid>
				<Grid item xs={12}>
					<CommentsContainer type="trees" id={tree.id} />
				</Grid>
			</Grid>
		</div>
	);
}
export default TreePage;
