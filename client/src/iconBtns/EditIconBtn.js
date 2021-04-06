import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { Edit as EditIcon } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';

function EditIconBtn({ type, id }) {
	const history = useHistory();

	const handleClick = () => {
		history.push(`/${type}/${id}/edit`);
	};

	return (
		<Tooltip title={'Edit'}>
			<IconButton onClick={handleClick}>
				<EditIcon />
			</IconButton>
		</Tooltip>
	);
}
export default EditIconBtn;
