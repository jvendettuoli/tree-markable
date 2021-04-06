import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
	Add as AddIcon,
	Explore as ExploreIcon,
	Group as GroupIcon,
	Home as HomeIcon,
	Info as InfoIcon,
	Nature as NatureIcon
} from '@material-ui/icons';
import { React } from 'react';
import { useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import useStyles from './styles/navDrawer';

function NavDrawer(props) {
	const { location: { pathname } } = props;

	const isAuthenticated = useSelector((st) => st.auth.authenticated);
	const theme = useTheme();
	const classes = useStyles(theme);

	return (
		<div>
			<Paper
				className={classes.toolbar}
				style={{
					backgroundColor : theme.palette.primary.dark,
					justifyContent  : 'center',
					alignItems      : 'center'
				}}
				square
				elevation={5}
			>
				<Typography align="center" variant="h5" noWrap style={{ color: 'white' }}>
					Tree-Markable
				</Typography>
			</Paper>

			<Divider />
			<List>
				<ListItem button component={Link} to="/" selected={'/' === pathname}>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary="Home" />
				</ListItem>
				<Divider />

				<ListItem style={{ backgroundColor: theme.palette.secondary.lightest }} disabled={!isAuthenticated}>
					<ListItemIcon>
						<AddIcon />
					</ListItemIcon>
					<ListItemText primary="Create" />
				</ListItem>
				<List component="div" disablePadding>
					<ListItem
						button
						className={classes.nested}
						component={Link}
						to="/trees/new"
						selected={'/trees/new' === pathname}
						disabled={!isAuthenticated}
					>
						<ListItemIcon>
							<NatureIcon />
						</ListItemIcon>
						<ListItemText primary="Tree" />
					</ListItem>
					<ListItem
						button
						className={classes.nested}
						component={Link}
						to="/groups/new"
						selected={'/groups/new' === pathname}
						disabled={!isAuthenticated}
					>
						<ListItemIcon>
							<GroupIcon />
						</ListItemIcon>
						<ListItemText primary="Group" />
					</ListItem>
				</List>
			</List>
			<Divider />
			<List style={{ paddingTop: 0 }}>
				<ListItem style={{ backgroundColor: theme.palette.secondary.lightest }}>
					<ListItemIcon>
						<ExploreIcon />
					</ListItemIcon>
					<ListItemText primary="Explore" />
				</ListItem>
				<List component="div" disablePadding>
					<ListItem
						button
						className={classes.nested}
						component={Link}
						to="/trees"
						selected={'/trees' === pathname}
					>
						<ListItemIcon>
							<NatureIcon />
						</ListItemIcon>
						<ListItemText primary="Trees" />
					</ListItem>
					<ListItem
						button
						className={classes.nested}
						component={Link}
						to="/groups"
						selected={'/groups' === pathname}
					>
						<ListItemIcon>
							<GroupIcon />
						</ListItemIcon>
						<ListItemText primary="Groups" />
					</ListItem>
				</List>
				<Divider />
				<ListItem button component={Link} to="/about" selected={'/about' === pathname}>
					<ListItemIcon>
						<InfoIcon />
					</ListItemIcon>
					<ListItemText primary="About" />
				</ListItem>
			</List>
		</div>
	);
}

export default withRouter(NavDrawer);
