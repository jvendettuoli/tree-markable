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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
	MoreVert as MoreVertIcon,
	Send as SendIcon
} from '@material-ui/icons';


import TreeMarkableApi from '../TreeMarkableApi';
import EditIconBtn from '../iconBtns/EditIconBtn';

const useStyles = makeStyles((theme) => ({
	avatarOther : {
		backgroundColor : theme.palette.secondary.light
	},
	avatarOwn   : {
		backgroundColor : theme.palette.primary.light
	}
}));

function Comment({ onDelete, username, comment }) {
	const classes = useStyles();
	const [ editing, setEditing ] = useState(false);
	const [ editText, setEditText ] = useState(comment.text);
	const [ anchorEl, setAnchorEl ] = useState(null);
	const open = Boolean(anchorEl);
	const isCommentAuthor = username === comment.author_name;

	const handleClick = (evt) => {
		setAnchorEl(evt.currentTarget);
	};

	const handleEditClick = () => {
		setAnchorEl(null);
		setEditing(true);
	};
	const handleDeleteClick = async () => {
		setAnchorEl(null);
		await TreeMarkableApi.deleteComment(comment.id);
		onDelete();
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChange = (evt) => {
		setEditText(evt.target.value);
	};

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		setEditText(editText.trim());
		if (editText !== comment.text) {
			const res = await TreeMarkableApi.updateComment(comment.id, {
				text : editText
			});
			comment.text = res.text;
		}
		setEditing(false);
	};

	return (
		<Grid container item wrap="nowrap" style={{ marginBottom: 15 }}>
			<Grid item style={{ marginRight: 15 }}>
				<Avatar
					className={
						isCommentAuthor ? (
							classes.avatarOwn
						) : (
							classes.avatarOther
						)
					}
				>
					{comment.author_name[0]}
				</Avatar>
			</Grid>
			<Grid container item alignItems="center">
				{editing ? (
					<Grid
						container
						wrap="nowrap"
						item
						justify="space-between"
					>
						<Grid item style={{ width: '100%' }}>
							<form
								onSubmit={handleSubmit}
								id="edit-comment"
							>
								<TextField
									id="text"
									onChange={handleChange}
									type="text"
									fullWidth
									multiline
									value={editText}
								/>
							</form>
						</Grid>
						<Grid item>
							<IconButton form="edit-comment" type="submit">
								<SendIcon />
							</IconButton>
						</Grid>
					</Grid>
				) : (
					<Grid
						container
						wrap="nowrap"
						item
						justify="space-between"
					>
						<Grid item>
							<Typography>{comment.text}</Typography>
						</Grid>
						{isCommentAuthor && (
							<Grid item>
								<IconButton
									aria-label="more"
									aria-controls="long-menu"
									aria-haspopup="true"
									onClick={handleClick}
								>
									<MoreVertIcon fontSize="small" />
								</IconButton>
								<Menu
									id="long-menu"
									anchorEl={anchorEl}
									keepMounted
									open={open}
									onClose={handleClose}
								>
									<MenuItem onClick={handleEditClick}>
										Edit
									</MenuItem>
									<MenuItem onClick={handleDeleteClick}>
										Delete
									</MenuItem>
								</Menu>
							</Grid>
						)}
					</Grid>
				)}
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
export default Comment;
