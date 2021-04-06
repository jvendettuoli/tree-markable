import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Add as AddIcon, Check as CheckIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTreeToGroup, removeTreeFromGroup } from '../actions/groups';

function EditTreeInGroupIconBtn({ group, treeId }) {
	const theme = useTheme();
	const [ treeInGroup, setTreeInGroup ] = useState(null);

	const dispatch = useDispatch();

	useEffect(
		() => {
			const checkTreeInGroup = (group, treeId) => {
				setTreeInGroup(group.trees.includes(treeId));
			};
			checkTreeInGroup(group, treeId);
		},
		[ group, treeId ]
	);

	const handleClick = async () => {
		if (treeInGroup) {
			dispatch(removeTreeFromGroup(group.id, treeId));
		}
		else {
			dispatch(addTreeToGroup(group.id, treeId));
		}
		setTreeInGroup(!treeInGroup);
	};

	return (
		<Tooltip title={treeInGroup ? 'Remove Tree' : 'Add Tree'}>
			<IconButton onClick={handleClick}>
				{treeInGroup ? (
					<CheckIcon htmlColor={theme.palette.primary.light} />
				) : (
					<AddIcon htmlColor={theme.palette.primary.light} />
				)}
			</IconButton>
		</Tooltip>
	);
}
export default EditTreeInGroupIconBtn;
