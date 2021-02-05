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

import { getGroupFromApi, getGroupsFromApi } from './actions/groups';
import SelectLocationMap from './SelectLocationMap';
import ImagesInput from './ImagesInput';
import Carousel from './Carousel';
import ShowTreeMap from './ShowTreeMap';
import CommentsContainer from './CommentsContainer';
import {
	groupsRef,
	downloadImageUrlsFromFirebase
} from './firebase/firebaseStorage';
import FollowGroupIconBtn from './FollowGroupIconBtn';
import EditIconBtn from './EditIconBtn';

const useStyles = makeStyles((theme) => ({
	headerImg : {
		height : 200
	}
}));

function GroupPage() {
	const classes = useStyles();
	const { id } = useParams();
	const group = useSelector((st) => st.groups.groups[id]);
	const uid = useSelector((st) => st.currUser.uid);
	console.log('GroupPage - group', group);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ imageUrls, setImageUrls ] = useState({
		primary : '',
		album   : []
	});

	const dispatch = useDispatch();

	// If Group not already in store, request it from API
	useEffect(
		() => {
			const getGroup = async (groupId) => {
				dispatch(getGroupFromApi(groupId));
			};
			if (!group) {
				getGroup(id);
			}
		},
		[ group, id ]
	);

	// Get Group Images from FirebaseStorage
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
				getImageUrls(groupsRef, id);
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

	return (
		<Grid container>
			<Grid item xs={12}>
				{displayImages(imageUrls)}
			</Grid>
			<Grid container item xs={12} md={6} alignItems="flex-start">
				<Grid
					container
					item
					xs={12}
					alignItems="center"
					wrap="nowrap"
				>
					<Typography variant="h3">{group.name}</Typography>
					<Grid item>
						<FollowGroupIconBtn groupId={group.id} />
						{uid === group.creator && (
							<EditIconBtn type={'groups'} id={group.id} />
						)}
					</Grid>
				</Grid>
				{group.description && (
					<Grid item xs={12}>
						<Typography>{group.description}</Typography>
					</Grid>
				)}
				<Grid item>
					<Typography variant="h4">Trees</Typography>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				<CommentsContainer type="groups" id={group.id} />
			</Grid>
		</Grid>
	);
}
export default GroupPage;
