import React, { useState } from 'react';

import {
	NavigateNext as NavigateNextIcon,
	NavigateBefore as NavigateBeforeIcon
} from '@material-ui/icons/';
import Card from '@material-ui/core/Card';
import Fade from '@material-ui/core/Fade';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	root  : {
		width        : '100%',
		borderRadius : '0px'
	},

	media : {
		height         : 600,
		display        : 'flex',
		justifyContent : 'space-between',
		alignItems     : 'center'
	}
});

function Carousel({ imageUrls }) {
	const classes = useStyles();
	const [ cardIdx, setCardIdx ] = useState(0);
	const total = imageUrls.length;
	const leftIconHidden = cardIdx === 0 ? true : false;
	const rightIconHidden = cardIdx === total - 1 ? true : false;
	const goForward = () => setCardIdx(cardIdx + 1);
	const goBack = () => setCardIdx(cardIdx - 1);

	return (
		<div className="Carousel">
			<Card className={classes.root}>
				<CardMedia
					className={classes.media}
					image={imageUrls[cardIdx]}
				>
					{!leftIconHidden ? (
						<IconButton onClick={goBack}>
							<NavigateBeforeIcon
								fontSize="large"
								htmlColor="rgba(255,255,255, 0.9)"
							/>
						</IconButton>
					) : (
						<div />
					)}
					{!rightIconHidden ? (
						<IconButton onClick={goForward}>
							<NavigateNextIcon
								fontSize="large"
								htmlColor="rgba(255,255,255, 0.9)"
							/>
						</IconButton>
					) : (
						<div />
					)}
				</CardMedia>
			</Card>
		</div>
	);
}

export default Carousel;
