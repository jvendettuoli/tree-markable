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
import Paper from '@material-ui/core/Paper';
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
	avatar : {
		backgroundColor : theme.palette.secondary.light
	}
}));

function CommentsContainer({ comment }) {
	const classes = useStyles();

	return (
		<Grid container item wrap="nowrap" style={{ marginBottom: 15 }}>
			<Grid item style={{ marginRight: 15 }}>
				<Avatar className={classes.avatar}>
					{comment.author_name[0]}
				</Avatar>
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
	);
}
export default CommentsContainer;
