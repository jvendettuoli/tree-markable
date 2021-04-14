import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { MoreVert as MoreVertIcon, Send as SendIcon } from '@material-ui/icons';
import React, { useState } from 'react';
import TreeMarkableApi from '../TreeMarkableApi';

const useStyles = makeStyles((theme) => ({
	avatarOther : {
		backgroundColor : theme.palette.secondary.light
	},
	avatarOwn   : {
		backgroundColor : theme.palette.primary.light
	}
}));

function Comment({ type, onDelete, username, comment, isCreatorOrModerator }) {
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
		await TreeMarkableApi.deleteComment(comment.id, type);
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
				<Avatar className={isCommentAuthor ? classes.avatarOwn : classes.avatarOther}>
					{comment.author_name[0]}
				</Avatar>
			</Grid>
			<Grid container item alignItems="center">
				{editing ? (
					<Grid container wrap="nowrap" item justify="space-between">
						<Grid item style={{ width: '100%' }}>
							<form onSubmit={handleSubmit} id="edit-comment">
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
					<Grid container wrap="nowrap" item justify="space-between">
						<Grid item>
							<Typography style={{ whiteSpace: 'pre-line' }}>{comment.text}</Typography>
						</Grid>
						{(isCommentAuthor || isCreatorOrModerator) && (
							<Grid item>
								<IconButton
									aria-label="more"
									aria-controls="long-menu"
									aria-haspopup="true"
									onClick={handleClick}
								>
									<MoreVertIcon fontSize="small" />
								</IconButton>
								<Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
									{isCommentAuthor && <MenuItem onClick={handleEditClick}>Edit</MenuItem>}
									<MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
								</Menu>
							</Grid>
						)}
					</Grid>
				)}
				<Grid container item justify="space-between">
					<Typography variant="caption">Posted By: {comment.author_name}</Typography>
					<Typography variant="caption">
						{new Date(comment.created_at).toLocaleDateString('en-gb', {
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
