import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import profileHeaderImg from './images/profile-page-header.jpg';

const useStyles = makeStyles((theme) => ({
	accordianContainer  : {
		width : '100%'
	},
	heading             : {
		fontSize   : theme.typography.pxToRem(15),
		fontWeight : theme.typography.fontWeightRegular
	},
	headerImgBackground : {
		height             : 300,
		backgroundImage    : `url(${profileHeaderImg})`,
		backgroundRepeat   : 'no-repeat',
		backgroundPosition : 'center',
		backgroundSize     : 'cover',
		backgroundColor    : theme.palette.secondary.dark
	}
}));

function UserProfilePage() {
	const theme = useTheme();
	console.log('theme', theme.palette);
	const classes = useStyles(theme);
	const {
		uid,
		username,
		email,
		img_url,
		created_at,
		is_admin
	} = useSelector((st) => st.currUser);
	return (
		<Grid container>
			<Grid
				className={classes.headerImgBackground}
				container
				justify="center"
				alignItems="flex-end"
				item
				xs={12}
			>
				<img
					style={{
						borderRadius : '50%',
						height       : 250,
						width        : 'auto'
					}}
					alt="user profile picture"
					src={img_url}
				/>
			</Grid>
			<Grid
				className={classes.accordianContainer}
				container
				item
				xs={12}
			>
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="user-details-content"
						id="user-details-header"
					>
						<Typography className={classes.heading}>
							User Details
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container direction="column">
							<Typography>Username: {username}</Typography>
							<Typography>Email: {email}</Typography>
							<Typography>
								Joined:{' '}
								{new Date(
									created_at
								).toLocaleDateString('en-gb', {
									year  : 'numeric',
									month : 'long',
									day   : 'numeric'
								})}
							</Typography>
							<Button
								style={{
									backgroundColor :
										theme.palette.info.main,
									color           : theme.palette.getContrastText(
										theme.palette.info.main
									)
								}}
							>
								Edit
							</Button>
							<Button
								style={{
									backgroundColor :
										theme.palette.error.dark,
									color           : theme.palette.getContrastText(
										theme.palette.error.dark
									)
								}}
							>
								Delete
							</Button>
						</Grid>
					</AccordionDetails>
				</Accordion>
			</Grid>
		</Grid>
	);
}
export default UserProfilePage;
