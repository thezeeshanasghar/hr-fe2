import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import React, { useState,Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link,Redirect } from 'react-router-dom';
import { logoutUser } from 'app/auth/store/userSlice';
import ReactReduxContext from 'react-redux/es/components/Context';

class UserMenu extends React.Component {

	state = {
        userMenu: null,
        redirect: localStorage.getItem('IsLoggedIn')
    };
	constructor(props) {
		super(props);
	}
    userMenuClick = event => {
        this.setState({userMenu: event.currentTarget});
    };

    userMenuClose = () => {
        this.setState({userMenu: null});
	};
	logout=()=>{
		localStorage.clear();
		this.setState({redirect:false})
	}

	render()
	{
	  if(!this.state.redirect){
		return <Redirect to='/login'/>;
	  }
	   var {user, logout} = this.props;
	   if(user == undefined || user == null){
		   user=JSON.parse(localStorage.getItem("User"))
	   }
	   const {userMenu} = this.state;
			return (
<>{
	user?
	
	<Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={this.userMenuClick}>
	<div className="hidden md:flex flex-col mx-4 items-end">
		 <Typography component="span" className="normal-case font-bold flex">
			 {user.data.displayName}
		</Typography>
		 <Typography className="text-11 capitalize" color="textSecondary">
			 {user.role.toString()}
			 {(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
		 </Typography>
	 </div>

	 {user.data.photoURL ? (
		<Avatar className="md:mx-4" alt="user photo" src={user.data.photoURL} />
	) : (
		<Avatar className="md:mx-4">{user.data.displayName[0]}</Avatar>
	)}
</Button>
:""
}

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={this.userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>
			
					<>
						
					<MenuItem  onClick={this.logout}   role="button">
							<ListItemIcon className="min-w-40">
								<Icon>lock</Icon>
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</MenuItem>
					</>
			</Popover>
		</>
			)

	}
}
export default UserMenu;


// function UserMenu(props) {
// 	const dispatch = useDispatch();
// 	const user = useSelector(({ auth }) => auth.user);
// 	const redirect = localStorage.getItem('IsLoggedIn')
// 	console.log(redirect,"SSSSSSSSSSSSSSSSSSS")
	
// 	const [userMenu, setUserMenu] = useState(null);

// 	const userMenuClick = event => {
// 		setUserMenu(event.currentTarget);
// 	};

// 	const userMenuClose = () => {
// 		setUserMenu(null);
// 	};

// 	if (!redirect) {
// 		return <Redirect to='/login'/>;
// 	  }
// 	return (
// 		<>
// 			<Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick}>
// 				<div className="hidden md:flex flex-col mx-4 items-end">
// 					<Typography component="span" className="normal-case font-bold flex">
// 						{user.data.displayName}
// 					</Typography>
// 					<Typography className="text-11 capitalize" color="textSecondary">
// 						{user.role.toString()}
// 						{(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
// 					</Typography>
// 				</div>

// 				{user.data.photoURL ? (
// 					<Avatar className="md:mx-4" alt="user photo" src={user.data.photoURL} />
// 				) : (
// 					<Avatar className="md:mx-4">{user.data.displayName[0]}</Avatar>
// 				)}
// 			</Button>

// 			<Popover
// 				open={Boolean(userMenu)}
// 				anchorEl={userMenu}
// 				onClose={userMenuClose}
// 				anchorOrigin={{
// 					vertical: 'bottom',
// 					horizontal: 'center'
// 				}}
// 				transformOrigin={{
// 					vertical: 'top',
// 					horizontal: 'center'
// 				}}
// 				classes={{
// 					paper: 'py-8'
// 				}}
// 			>
			
// 					<>
						
// 					<MenuItem component={Link} to="/login"    role="button">
// 							<ListItemIcon className="min-w-40">
// 								<Icon>lock</Icon>
// 							</ListItemIcon>
// 							<ListItemText primary="Logout" />
// 						</MenuItem>
// 					</>
// 			</Popover>
// 		</>
// 	);
// }

