import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import { getGroupFromApi, getGroupsFromApi } from './actions/groups';
import SelectLocationMap from './SelectLocationMap';
import ImagesInput from './ImagesInput';
import Carousel from './Carousel';
import ShowTreeMap from './ShowTreesMap';
import CommentsContainer from './CommentsContainer';
import {
	groupsRef,
	downloadImageUrlsFromFirebase
} from './firebase/firebaseStorage';
import FollowGroupIconBtn from './FollowGroupIconBtn';
import EditIconBtn from './EditIconBtn';
import ShowTreesMap from './ShowTreesMap';
import GroupTabPanel from './GroupTabPanel';

const useStyles = makeStyles((theme) => {
	return {
		innerContent   : {
			padding : 15
		},
		tableContainer : {
			marginRight : 10
		}
	};
});

function GroupPage() {
	const classes = useStyles();
	const theme = useTheme();
	const { id } = useParams();
	const isAuthenticated = useSelector((st) => st.auth.authenticated);
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
			if (!group.trees) {
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
				<Grid
					container
					justify="center"
					alignItems="flex-end"
					item
					xs={12}
					style={{
						height             : 300,
						backgroundImage    : `url(${imageUrls.primary})`,
						backgroundRepeat   : 'no-repeat',
						backgroundPosition : 'center',
						backgroundSize     : 'cover',
						backgroundColor    : theme.palette.secondary.dark
					}}
				>
					<div style={{ height: 300 }} />
				</Grid>
			);
		}
	};

	return (
		<Grid className="GroupPage" container direction="column">
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
				<Grid
					container
					item
					xs={12}
					wrap="nowrap"
					justify="space-between"
				>
					<Typography variant="h3" gutterBottom>
						{group.name}
					</Typography>
					<Grid item>
						{isAuthenticated && (
							<FollowGroupIconBtn groupId={group.id} />
						)}
						{uid === group.creator && (
							<EditIconBtn type={'groups'} id={group.id} />
						)}
					</Grid>
				</Grid>
				{group.description && (
					<Grid item xs={12} style={{ marginBottom: 15 }}>
						<Typography gutterBottom>
							{group.description}
						</Typography>
					</Grid>
				)}
				<Grid item xs={12}>
					<GroupTabPanel group={group} imageUrls={imageUrls} />
				</Grid>

				<Grid item xs={12} style={{ marginTop: 15 }}>
					<CommentsContainer type="groups" id={group.id} />
				</Grid>
			</Grid>
		</Grid>
	);
}
export default GroupPage;
