import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import { getTreeFromApi, getTreesFromApi } from '../actions/trees';
import LeafletMap from '../leafletMap/LeafletMap';
import ImagesInput from '../imageHandling/ImagesInput';
import Carousel from '../imageHandling/Carousel';
import Comment from './Comment';

import TreeMarkableApi from '../TreeMarkableApi';

const useStyles = makeStyles((theme) => ({
	userAvatar : {
		backgroundColor : theme.palette.primary.light
	}
}));

/**
 * Component accepts a string type ('groups' or 'trees') and an id
 * and returns the comments associated with that item in the
 * database. 
 */

function CommentsContainer({ type, id, isCreatorOrModerator }) {
	console.log('CommentsContainer - Start', type, id);

	const classes = useStyles();
	const INITIAL_STATE = {
		text : '',
		type,
		id
	};
	const [ formData, setFormData ] = useState(INITIAL_STATE);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ commentDeleted, setCommentDeleted ] = useState(false);
	const [ comments, setComments ] = useState([]);
	const username = useSelector((st) => st.currUser.username);

	useEffect(
		() => {
			const getComments = async (type, id) => {
				const comments = await TreeMarkableApi.getComments(type, id);
				setComments(comments);
				setIsLoading(false);
				setCommentDeleted(false);
			};
			getComments(type, id);
		},
		[ isLoading, type, id, commentDeleted ]
	);

	const handleDeleteComment = () => {
		setCommentDeleted(true);
	};

	const handleChange = (evt) => {
		const { name, value } = evt.target;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		await TreeMarkableApi.createComment(formData);
		setFormData(INITIAL_STATE);
		setIsLoading(true);
	};

	return (
		<Grid container className="CommentsContainer">
			<Typography variant="h4">Comments</Typography>
			<Grid container item xs={12}>
				<Box mt={2} mb={2} style={{ width: '100%' }}>
					{comments.length > 0 ? (
						comments.map((comment) => (
							<Comment
								key={`comment-${comment.id}`}
								onDelete={handleDeleteComment}
								comment={comment}
								username={username}
								isCreatorOrModerator={isCreatorOrModerator}
							/>
						))
					) : (
						<Typography>No Comments</Typography>
					)}
				</Box>
			</Grid>
			{username ? (
				<Grid container item>
					<Grid container alignItems="center" spacing={2} item xs={12} wrap="nowrap">
						<Grid item>
							<Avatar className={classes.userAvatar}>{username[0]}</Avatar>
						</Grid>
						<Grid item>
							<form id="comment" onSubmit={handleSubmit}>
								<TextField
									id="text"
									name="text"
									placeholder="Add comment..."
									fullWidth
									onChange={handleChange}
									value={formData.text}
								/>
							</form>
						</Grid>
						<Grid item>
							<IconButton form="comment" type="submit">
								<SendIcon />
							</IconButton>
						</Grid>
					</Grid>
				</Grid>
			) : (
				<Typography>
					<Link component={RouterLink} to="/signup">
						Sign Up
					</Link>{' '}
					or{' '}
					<Link component={RouterLink} to="/signin">
						Sign In
					</Link>{' '}
					to add comments.
				</Typography>
			)}
		</Grid>
	);
}
export default CommentsContainer;
