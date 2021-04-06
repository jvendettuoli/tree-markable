import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root : {
		width                     : '100%',
		backgroundColor           : theme.palette.background.paper,
		'& .data-grid-fav-header' : {
			'& .MuiDataGrid-colCellTitleContainer' : {
				alignItems : 'center'
			}
		}
	}
}));

function DetailsLinkBtn(props) {
	return (
		<Button color="primary" component={Link} {...props}>
			Show
		</Button>
	);
}

function GroupList({ groups }) {
	const classes = useStyles();

	const groupRows = groups.map((group) => ({
		...group,
		created_at : new Date(group.created_at).toLocaleDateString('en-gb', {
			year  : 'numeric',
			month : 'long',
			day   : 'numeric'
		}),
		link       : `groups/${group.id}`
	}));

	// const handleUnfavoriteClick = (evt) => {
	// 	const groupId = parseInt(evt.currentTarget.dataset.groupId);
	// 	dispatch(removeFromSavedTrees(uid, groupId));
	// };
	// const handleFavoriteClick = (evt) => {
	// 	const groupId = parseInt(evt.currentTarget.dataset.groupId);
	// 	dispatch(addToSavedTrees(uid, groupId));
	// };

	const columns = [
		{ field: 'name', headerName: 'Name', width: 200 },
		{ field: 'description', headerName: 'Description', width: 200 },
		{
			field      : 'link',
			headerName : 'Details',
			renderCell : (params) => <DetailsLinkBtn to={params.value} />
		},
		{ field: 'created_at', headerName: 'Created', width: 150 }
	];

	return (
		<div style={{ width: '100%' }} className={classes.root}>
			<DataGrid rows={groupRows} columns={columns} pageSize={10} autoHeight />
		</div>
	);
}
export default GroupList;
