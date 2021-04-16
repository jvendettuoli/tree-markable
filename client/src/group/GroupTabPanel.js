import AppBar from '@material-ui/core/AppBar';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTree } from '../actions/trees';
import LeafletMap from '../leafletMap/LeafletMap';
import TreeList from '../tree/TreeList';
import GroupMembersPanel from './GroupMembersPanel';
import GroupTreeEditTable from './GroupTreeEditTable';

const useStyles = makeStyles((theme) => {
	return {
		tabPanel : {
			flexGrow        : 1,
			backgroundColor : 'white',
			// backgroundColor : theme.palette.background.paper,
			width           : '100%'
		},
		backdrop : {
			zIndex : theme.zIndex.drawer + 1,
			color  : '#fff'
		}
	};
});

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`group-tabpanel-${index}`}
			aria-labelledby={`group-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
}

function a11yProps(index) {
	return {
		id              : `group-tab-${index}`,
		'aria-controls' : `group-tabpanel-${index}`
	};
}

function GroupTabPanel({ group, isCreator, imageUrls }) {
	const theme = useTheme();
	const classes = useStyles(theme);
	const dispatch = useDispatch();
	const [ value, setValue ] = useState(0);
	const [ open, setOpen ] = useState(false);
	const currUserUid = useSelector((st) => st.currUser.uid);

	// check if currUser is a moderator of this group
	const isModerator = Boolean(
		group.members.find((member) => member.user_id === currUserUid && member.is_moderator === true)
	);

	// Get any group trees that are already in store
	let groupTrees = useSelector((st) => [ ...group.trees ].map((id) => st.trees.entities[id]));

	// Get array of any group tree ids that were not already in store
	const remainingSelectionTreeIds = group.trees.filter((id) => !groupTrees.map((tree) => tree.id).includes(id));
	console.log('GroupTapPanal remainingSelectionTree', remainingSelectionTreeIds);

	console.log('GroupTapPanal groupTrees', groupTrees);
	// Get any other group tree that is not in store from API
	useEffect(
		() => {
			remainingSelectionTreeIds.forEach((id) => {
				const tree = dispatch(getTree(id));
				groupTrees.push(tree);
			});
		},
		[ dispatch, groupTrees, remainingSelectionTreeIds ]
	);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const displayTreeSelection = () => {
		setOpen(true);
	};
	const closeTreeSelection = (evt) => {
		setOpen(false);
	};
	return (
		<div className={classes.tabPanel}>
			<AppBar position="static">
				<Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="group tabs" centered>
					<Tab label="Trees" {...a11yProps(0)} />
					<Tab label="Album" {...a11yProps(1)} />
					<Tab label="Members" {...a11yProps(2)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0}>
				<Grid container direction="column">
					<Grid container item xs={12} justify="center">
						{isModerator && (
							<Button color="primary" onClick={displayTreeSelection} style={{ marginBottom: 20 }}>
								Edit Group Trees
							</Button>
						)}
						<Backdrop className={classes.backdrop} open={open} onClick={closeTreeSelection}>
							<Box
								style={{
									backgroundColor : 'white',
									width           : '85vw',
									maxWidth        : 1500,
									height          : `${120 + Math.min(groupTrees.length, 10) * 52}px`,
									zIndex          : 10,
									color           : 'white'
								}}
								onClick={(evt) => {
									evt.stopPropagation();
								}}
							>
								<GroupTreeEditTable group={group} groupTrees={groupTrees} />
							</Box>
						</Backdrop>
					</Grid>
					<Grid container item xs={12} justify="center">
						{groupTrees.length > 0 ? (
							<Grid container item xs={12}>
								<Grid item xs={12} xl={6}>
									<Paper elevation={3}>
										<LeafletMap trees={groupTrees} />
									</Paper>
								</Grid>
								<Grid container item xs={12} xl={6}>
									<Box
										p={2}
										style={{
											height : `${120 + Math.min(groupTrees.length, 10) * 52}px`,
											width  : '100%'
										}}
									>
										<TreeList trees={groupTrees} />
									</Box>
								</Grid>
							</Grid>
						) : (
							<Typography align="center">
								No trees within this group yet. Only moderators can edit trees of this group.
							</Typography>
						)}
					</Grid>
				</Grid>
			</TabPanel>
			{/* <TabPanel value={value} index={1}>
				Album
			</TabPanel> */}
			<TabPanel value={value} index={2}>
				<GroupMembersPanel isCreator={isCreator} isModerator={isModerator} group={group} />
			</TabPanel>
		</div>
	);
}
export default GroupTabPanel;
