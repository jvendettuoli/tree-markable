import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 200;

const useStyles = makeStyles((theme) => {
	return {
		root        : {
			display : 'flex'
		},
		drawer      : {
			[theme.breakpoints.up('md')]: {
				width      : drawerWidth,
				flexShrink : 0
			}
		},
		appBar      : {
			[theme.breakpoints.up('md')]: {
				width      : `calc(100% - ${drawerWidth}px)`,
				marginLeft : drawerWidth
			}
		},
		menuButton  : {
			marginRight                  : theme.spacing(2),
			[theme.breakpoints.up('md')]: {
				display : 'none'
			}
		},
		// necessary for content to be below app bar
		toolbar     : {
			...theme.mixins.toolbar,
			display         : 'flex',
			justifyContent  : 'space-between',
			backgroundColor : theme.palette.primary.dark
		},
		drawerPaper : {
			width : drawerWidth
		},
		content     : {
			flexGrow : 1
			// padding  : theme.spacing(3)
		},
		nested      : {
			paddingLeft : theme.spacing(4)
		}
	};
});

export default useStyles;
