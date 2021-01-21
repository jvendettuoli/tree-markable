import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	mapContainer    : {
		width          : '100%',
		height         : '70vh',
		display        : 'flex',
		justifyContent : 'center',
		'& .open'      : {
			maxWidth : 330
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
