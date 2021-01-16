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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import { getTreeFromApi, getTreesFromApi } from './actions/trees';
import SelectLocationMap from './SelectLocationMap';
import ImagesInput from './ImagesInput';
import Carousel from './Carousel';
import ShowTreeMap from './ShowTreeMap';
import {
	treesRef,
	downloadImageUrlsFromFirebase
} from './firebase/firebaseStorage';

import TreeMarkableApi from './TreeMarkableApi';

const useStyles = makeStyles((theme) => ({
	userAvatar : {
		backgroundColor : theme.palette.primary.light
	}
}));

function CommentsContainer({ type, id }) {
	const classes = useStyles();
	const INITIAL_STATE = {
		text : '',
		type,
		id
	};
	const [ formData, setFormData ] = useState(INITIAL_STATE);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ comments, setComments ] = useState([]);
	const username = useSelector((st) => st.currUser.username);

	const dispatch = useDispatch();

	useEffect(
		() => {
			const getComments = async (type, id) => {
				const comments = await TreeMarkableApi.getComments(
					type,
					id
				);
				console.log('getComments - comments', comments);
				setComments(comments);
				setIsLoading(false);
			};
			getComments(type, id);
		},
		[ isLoading, type, id ]
	);

	const handleChange = (evt) => {
		const { name, value } = evt.target;

		setFormData((fData) => ({
			...fData,
			[name] : value
		}));
	};

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		console.log('Comment submit - text', formData);

		const res = await TreeMarkableApi.createComment(formData);
		console.log('res', res);
		setFormData(INITIAL_STATE);
		setIsLoading(true);
	};

	return (
		<Grid container className="CommentsContainer">
			<Typography variant="h4">Comments</Typography>
			{comments.map((comment) => (
				<Grid
					key={`comment-${comment.id}`}
					container
					wrap="nowrap"
				>
					<Grid item>
						<Avatar>{comment.author_name[0]}</Avatar>
					</Grid>
					<Grid container item>
						<Grid item>
							<Typography>{comment.text}</Typography>
						</Grid>
						<Grid container item justify="space-between">
							<Typography variant="caption">
								Posted By: {comment.author_name}
							</Typography>
							<Typography variant="caption">
								{new Date(
									comment.created_at
								).toLocaleDateString('en-gb', {
									year  : 'numeric',
									month : 'long',
									day   : 'numeric'
								})}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			))}

			<Grid container>
				<Card>
					<CardContent>
						<Grid container alignItems="center">
							<Grid item>
								<Avatar className={classes.userAvatar}>
									{username[0]}
								</Avatar>
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
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
}
export default CommentsContainer;
