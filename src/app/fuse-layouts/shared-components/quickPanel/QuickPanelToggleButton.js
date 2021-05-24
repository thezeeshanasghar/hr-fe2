import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleQuickPanel } from './store/stateSlice';

function QuickPanelToggleButton(props) {
	const dispatch = useDispatch();

	return (
		// <IconButton className="w-40 h-40" title="select company" onClick={ev => dispatch(toggleQuickPanel())}>
		// 	{props.children}
		// </IconButton>
		<Button className="h-40 w-100" onClick={ev => dispatch(toggleQuickPanel())}> 
				
			Select Company
			</Button>
	);
}

QuickPanelToggleButton.defaultProps = {
	children: <Icon>bookmarks</Icon>
};

export default QuickPanelToggleButton;
