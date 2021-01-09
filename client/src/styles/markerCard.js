import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root    : {
		maxWidth : 300
	},
	media   : {
		height : 140
	},
	content : {
		paddingBottom : 0,
		paddingLeft   : 10,
		paddingRight  : 10,
		'& p'         : {
			margin : 0
		}
	},
	actions : {
		paddingBottom : 0,
		paddingTop    : 2
	}
});

export default useStyles;
