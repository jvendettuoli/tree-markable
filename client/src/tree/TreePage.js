import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { getTreeFromApi, getTreesFromApi } from '../actions/trees';
import Carousel from '../imageHandling/Carousel';
import ShowTreesMap from '../leafletMap/ShowTreesMap';
import CommentsContainer from '../comment/CommentsContainer';
import {
	treesRef,
	downloadImageUrlsFromFirebase
} from '../firebase/firebaseStorage';
import FavoriteIconBtn from '../iconBtns/FavoriteIconBtn';
import EditIconBtn from '../iconBtns/EditIconBtn';

const useStyles = makeStyles({
	innerContent   : {
		padding : 20
	},
	tableContainer : {
		marginRight : 10
	}
});

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
		<Grid container direction="column">
			<Grid item xs={12}>
				{displayImages(imageUrls)}
			</Grid>
			<Grid
				className={classes.innerContent}
				container
				item
				xs={12}
				alignItems="flex-start"
			>
				<Grid container item xs={12} md={6}>
					<Grid container item xs={12} wrap="nowrap">
						<Typography variant="h3" gutterBottom>
							{tree.name}
						</Typography>
						<Grid item>
							<FavoriteIconBtn treeId={tree.id} />
							{uid === tree.creator && (
								<EditIconBtn type={'trees'} id={tree.id} />
							)}
						</Grid>
					</Grid>
					{tree.description && (
						<Grid item xs={12}>
							<Typography gutterBottom>
								{tree.description}
							</Typography>
						</Grid>
					)}
					<Grid container item>
						<TableContainer className={classes.tableContainer}>
							<Table aria-label="tree details">
								<TableBody>
									{treeFieldLabels.map((item, idx) => {
										return (
											item.value && (
												<TableRow key={item.label}>
													<TableCell>
														<b>{item.label}</b>
													</TableCell>
													<TableCell>
														{item.value}
													</TableCell>
												</TableRow>
											)
										);
									})}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
				<Grid item xs={12} md={6}>
					<Paper elevation={3}>
						<ShowTreesMap trees={[ tree ]} />
					</Paper>
				</Grid>
				<Grid item xs={12} style={{ marginTop: 15 }}>
					<CommentsContainer type="trees" id={tree.id} />
				</Grid>
			</Grid>
		</Grid>
	);
}
export default TreePage;
