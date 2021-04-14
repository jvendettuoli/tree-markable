import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getGroup } from '../actions/groups';
import CommentsContainer from '../comment/CommentsContainer';
import { downloadImageUrlsFromFirebase, groupsRef } from '../firebase/firebaseStorage';
import GroupTabPanel from '../group/GroupTabPanel';
import EditIconBtn from '../iconBtns/EditIconBtn';
import FollowGroupIconBtn from '../iconBtns/FollowGroupIconBtn';
import form from '../styles/form';
import innerContent from '../styles/innerContent';

const useStyles = makeStyles((theme) => {
	return {
		innerContent   : innerContent(theme),
		form           : form(theme),
		tableContainer : {
			marginRight : 10
		}
	};
});

function GroupPage() {
	console.log('GroupPage - start');
	const theme = useTheme();
	const classes = useStyles(theme);
	const history = useHistory();
	const { id } = useParams();
	const isAuthenticated = useSelector((st) => st.auth.authenticated);
	const group = useSelector((st) => st.groups.entities[id]);
	const uid = useSelector((st) => st.currUser.uid);
	const error = useSelector((st) => st.groups.error);
	const isCreator = uid === group.creator;
	const isModerator = group.members.find((member) => member.is_moderator === true && member.user_id === uid);

	console.log('GroupPage - group', group);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ imageUrls, setImageUrls ] = useState({
		primary : '',
		album   : []
	});

	const dispatch = useDispatch();

	// Get specific group from API
	useEffect(
		() => {
			const getGroupFromApi = async (groupId) => {
				dispatch(getGroup(groupId));
			};
			getGroupFromApi(id);
		},
		[ id, error, dispatch, history ]
	);

	// Get Group Images from FirebaseStorage
	useEffect(
		() => {
			const getImageUrls = async (collectionRef, id) => {
				const imgUrls = await downloadImageUrlsFromFirebase(collectionRef, id);
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

			<Grid className={classes.innerContent} container item xs={12} alignItems="flex-start">
				<Grid container item xs={12} wrap="nowrap" justify="space-between">
					<Typography variant="h3" gutterBottom>
						{group.name}
					</Typography>
					<Grid item>
						{isAuthenticated && !isCreator && <FollowGroupIconBtn groupId={group.id} />}
						{isCreator && <EditIconBtn type={'groups'} id={group.id} />}
					</Grid>
				</Grid>
				{group.description && (
					<Grid item xs={12} style={{ marginBottom: 15 }}>
						<Typography gutterBottom style={{ whiteSpace: 'pre-line' }}>
							{group.description}
						</Typography>
					</Grid>
				)}
				<Grid item xs={12}>
					<GroupTabPanel isCreator={isCreator} group={group} imageUrls={imageUrls} />
				</Grid>

				<Grid item xs={12} style={{ marginTop: 15 }}>
					<CommentsContainer type="groups" id={group.id} isCreatorOrModerator={isCreator || isModerator} />
				</Grid>
			</Grid>
		</Grid>
	);
}
export default GroupPage;
