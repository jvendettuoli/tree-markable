import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
	return {
		form : {
			display       : 'flex',
			flexDirection : 'column',
			'& div'       : {
				marginBottom : 10
			}
		}
	};
});
// ${theme.palette.primary.accent}

export default useStyles;
