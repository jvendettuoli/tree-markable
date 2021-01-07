import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	form       : {
		display       : 'flex',
		flexDirection : 'column',
		'& div'       : {
			marginBottom : 10
		}
	},
	imgPreview : { height: 100, width: 'auto' }
});

export default useStyles;
