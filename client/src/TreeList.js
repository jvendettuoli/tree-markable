import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import useStyles from './styles/formStyle';

import { getTreesFromApi } from './actions/trees';
import SelectLocationMap from './SelectLocationMap';
import {
	treesRef,
	uploadImagesToFirebase
} from './firebase/firebaseStorage';
import ImagesInput from './ImagesInput';

// const useStyles = makeStyles((theme) => ({
// 	root : {
// 		width           : '100%',
// 		maxWidth        : 360,
// 		backgroundColor : theme.palette.background.paper
// 	}
// }));

function ListItemLink(props) {
	return <ListItem button component="a" {...props} />;
}

function TreeList() {
	const classes = useStyles();
	const [ treeMarkers, setTreeMarkers ] = useState([]);
	const [ searchParams, setSearchParams ] = useState([]);
	let userUid = useSelector((st) => st.auth.uid);
	const [ isLoading, setIsLoading ] = useState(true);

	const dispatch = useDispatch();

	useEffect(
		() => {
			if (isLoading) {
				dispatch(getTreesFromApi());
				setIsLoading(false);
			}
		},
		[ isLoading, dispatch ]
	);

	let trees = useSelector((st) =>
		Object.values(st.trees).map((tree) => tree)
	);

	if (isLoading) {
		return <div>Loading</div>;
	}

	return (
		<div className={classes.root}>
			TEST
			<List component="nav" aria-label="trees list">
				<ListItem button>
					<ListItemText primary="test" />
				</ListItem>
				{trees.map((tree) => {
					return (
						<ListItemLink
							key={tree.id}
							href={`trees/${tree.id}`}
						>
							<ListItemText primary={tree.name} />
						</ListItemLink>
					);
				})}
			</List>
		</div>
	);
}
export default TreeList;
