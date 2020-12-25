import FuseScrollbars from '@fuse/core/FuseScrollbars';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleQuickPanel } from './store/stateSlice';
import reducer from './store';
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
const useStyles = makeStyles(theme => ({
	root: {
		width: 280
	}
}));

function QuickPanel(props) {
	const dispatch = useDispatch();
	const state = useSelector(({ quickPanel }) => quickPanel.state);
	const { companies } = props
	const classes = useStyles();

	return (
		<SwipeableDrawer
			classes={{ paper: classes.root }}
			open={state}
			anchor="right"
			onOpen={ev => { }}
			onClose={ev => dispatch(toggleQuickPanel())}
			disableSwipeToOpen
		>
			<FuseScrollbars>
				<Typography className="leading-none text-32 MuiTypography-colorTextSecondary">Select Company</Typography>

				{
					<List component="nav" aria-label="main mailbox folders">
						{
							console.log(companies),
							companies.map(x =>
								<ListItem button onClick={()=>props.clicked(x.Id,x.CompanyName)}  >
									<ListItemIcon>
										<InboxIcon />
									</ListItemIcon>
									<ListItemText primary={x.CompanyName} />
								</ListItem>
							)
						}
					</List>
				}

			</FuseScrollbars>
		</SwipeableDrawer>
	);
}

export default withReducer('quickPanel', reducer)(React.memo(QuickPanel));
