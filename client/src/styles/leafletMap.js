import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	mapContainer    : {
		width          : '10%',
		height         : '20vh',
		display        : 'flex',
		justifyContent : 'center',
		'& > div'      : {
			maxWidth : 330,
			backgroundColor: 'red',
			color: 'red',
			'& .open':{
				backgroundColor: 'red'
			}
		}
	},

	treeMarkerPopup : {
		'& .leaflet-popup-content' : {
			// paddingLeft  : 0,
			// paddingRight : 0,
			// paddingBottom : 0,
			marginLeft   : 0,
			marginRight  : 0,
			marginBottom : 5,
			marginTop    : 15
		}
	}
}));

export default useStyles;
