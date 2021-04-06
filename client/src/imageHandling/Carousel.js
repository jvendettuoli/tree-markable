import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { NavigateBefore as NavigateBeforeIcon, NavigateNext as NavigateNextIcon } from '@material-ui/icons/';
import React, { useState } from 'react';

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
				<CardMedia className={classes.media} image={imageUrls[cardIdx]}>
					{!leftIconHidden ? (
						<IconButton onClick={goBack} style={{ backgroundColor: 'rgba(0,0,0,.25)' }}>
							<NavigateBeforeIcon fontSize="large" htmlColor="rgba(255,255,255, 0.9)" />
						</IconButton>
					) : (
						<div />
					)}
					{!rightIconHidden ? (
						<IconButton onClick={goForward} style={{ backgroundColor: 'rgba(0,0,0,.25)' }}>
							<NavigateNextIcon fontSize="large" htmlColor="rgba(255,255,255, 0.9)" />
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
