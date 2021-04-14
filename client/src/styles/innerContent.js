const innerContent = (theme) => {
	return {
		padding         : 20,
		backgroundColor : theme.palette.background.paper,
		boxShadow       : theme.shadows[4],
		height          : '100%',
		minHeight       : '100vh'
	};
};

export default innerContent;
