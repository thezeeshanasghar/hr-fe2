import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
//import { FusePageSimple, DemoContent } from '@fuse';
import FusePageSimple from '@fuse/core/FusePageSimple';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Icon, Input, MuiThemeProvider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import SimpleReactValidator from 'simple-react-validator';
import axios from "axios";
//import toastr from 'toastr'
import defaultUrl from "../../../app/services/constant/constant";

//import $ from 'jquery';
//import DataTable from "datatables.net";
//import * as responsive from "datatables.net-responsive";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Messages from '../toaster';
//import { Message } from 'semantic-ui-react';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,

	},
	dense: {
		marginTop: 16,
	},
	menu: {
		width: 200,
	},
});

const CustomTableCell = withStyles(theme => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);
function TabContainer({ children, dir }) {
	return (
		<Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
			{children}
		</Typography>
	);
}


class Bank extends Component {
	state = {
		value: 0,
		bankName: '',
		bankCode: '',
		bankAddress: '',
		SwiftCode:"",
		UAEFTSBANKCode:"",
		code:"",
		Description:"",
		RouteCode:"",
		Banks: [],
		Id: 0,
		Action: 'Insert Record',
		table: null,
	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();


	}
	componentDidMount() {
		localStorage.removeItem("ids");
		this.getBankDetail();
	}
	handleTab = (event, value) => {
		this.setState({ value });
	};
	handleChange = (e) => {

		this.setState({ [e.target.name]: e.target.value });
	};

	success = () => toast.success('Operation Succesful', {
		position: "bottom-right",
		autoClose: 5000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	});

	error = () => toast.error('An error Occured!', {
		position: "bottom-right",
		autoClose: 5000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	});

	getBankDetail = () => {
	
		axios({
			method: "get",
			url: defaultUrl + "Bank",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ Banks: response.data.data });
				console(this.state.Banks);
				return response.data;
			})
			.catch((error) => {
				console.log(error);
			})


		localStorage.removeItem("ids");


		// if (!$.fn.dataTable.isDataTable('#Bank_Table')) {
		// 	this.state.table = $('#Bank_Table').DataTable({
		// 		ajax: defaultUrl + "Bank",
		// 		"columns": [
		// 			{ "data": "Code" },
		// 			{ "data": "BankName" },
		// 			{ "data": "BranchCode" },
		// 			{ "data": "Address" },
		// 			{ "data": "SwiftCode" },
		// 			{ "data": "UAEFTSBANKCode" },
		// 			{ "data": "RouteCode" },
		// 			{ "data": "Description" },
		// 			{
		// 				"data": "Action",
		// 				sortable: false,
		// 				"render": function (data, type, full, meta) {

		// 					return `<input type="checkbox" name="radio"  value=` + full.Id + `
		// 				onclick=" const checkboxes = document.querySelectorAll('input[name=radio]:checked');
		// 							let values = [];
		// 							checkboxes.forEach((checkbox) => {
		// 								values.push(checkbox.value);
		// 							});
		// 							localStorage.setItem('ids',values);	"
		// 				/>`;
		// 				}
		// 			}

		// 		],
		// 		rowReorder: {
		// 			selector: 'td:nth-child(2)'
		// 		},
		// 		responsive: true,
		// 		dom: 'Bfrtip',
		// 		buttons: [

		// 		],
		// 		columnDefs: [{
		// 			"defaultContent": "-",
		// 			"targets": "_all"
		// 		}]
		// 	});
		// } else {
		// 	this.state.table.ajax.reload();
		// }
	}
	insertUpdateRecord = () => {
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			this.forceUpdate();
			return false;
		}
		var method = "post";
		var url = defaultUrl + "Bank";
		if (this.state.Action != "Insert Record") {
			method = "put";
			url = defaultUrl + "Bank/" + this.state.Id;
		}

		//   this.setState({bankName:'',bankCode:'',bankAddress:''})
		var obj = {
			BankName: this.state.bankName,
			BranchCode: this.state.bankCode,
			Address: this.state.bankAddress,
			Code:this.state.code,
			SwiftCode:this.state.SwiftCode,
			UAEFTSBANKCode:this.state.UAEFTSBANKCode,
			RouteCode:this.state.RouteCode,
			Description:this.state.Description
		};
		// axios.interceptors.request.use(function (config) {
		// 	document.getElementById("fuse-splash-screen").style.display = "block"
		// 	return config;
		// }, function (error) {
		// 	console.log('Error');
		// 	return Promise.reject(error);
		// });
		axios({
			method: method,
			url: url,
			data: JSON.stringify(obj),
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.getBankDetail();
				this.setState({
					bankName: "",
					bankCode: "",
					bankAddress: "",
					SwiftCode:"",
					UAEFTSBANKCode:"",
					code:"",
					Description:"",
					RouteCode:"",
					Action: 'Insert Record',
					Id: 0,
					value: 0
				});
			//	document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();
			})
			.catch((message) => {
			//	document.getElementById("fuse-splash-screen").style.display = "none"
				console.log(message);
				// error();
				this.setState({
					bankName: "",
					bankCode: "",
					bankAddress: "",
					Action: 'Insert Record',
					SwiftCode:"",
					UAEFTSBANKCode:"",
					code:"",
					Description:"",
					RouteCode:"",
					Id: 0,
					value: 0
				})
			})
	}
	deleteBank = () => {
		var ids = localStorage.getItem("ids");
		if (ids === null) {
			Messages.warning("No Record Selected");
			return false;
		}
	//	document.getElementById("fuse-splash-screen").style.display = "block"
		axios({
			method: "delete",
			url: defaultUrl + "Bank/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {

				this.getBankDetail();
			//	document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();

			})
			.catch((error) => {
				console.log(error);
			//	document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.error();
			})
	}
	getBankById = () => {
		let ids = localStorage.getItem("ids")
		if (ids === null || localStorage.getItem("ids").split(",").length > 1) {
			Messages.warning("kindly Select one record");
			return false;
		}
	//	document.getElementById("fuse-splash-screen").style.display = "block"
		axios({
			method: "get",
			url: defaultUrl + "Bank/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({
					Action: 'Update Record', value: 1, bankName: response.data[0].BankName, bankCode: response.data[0].BranchCode, bankAddress: response.data[0].Address,
					Id: response.data[0].Id,
					SwiftCode:response.data[0].SwiftCode,
					UAEFTSBANKCode:response.data[0].UAEFTSBANKCode,
					code:response.data[0].Code,
					Description:response.data[0].Description,
					RouteCode:response.data[0].RouteCode,
				});
		//		document.getElementById("fuse-splash-screen").style.display = "none"
			})
			.catch((error) => {
			//	document.getElementById("fuse-splash-screen").style.display = "none"
				console.log(error);
			})
	}

	selection = () => {
		console.log("called");
		const checkboxes = document.querySelectorAll('input[name=radio]:checked');
									let values = [];
									checkboxes.forEach((checkbox) => {
										values.push(checkbox.value);
									});
									localStorage.setItem('ids',values);}

	render() {

		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Bank</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Bank</h4></div>
				}
				content={

					<div className={classes.root}>
						<div>
							<ToastContainer />
						</div>
						<AppBar position="static" color="default">
							<Tabs
								value={this.state.value}
								onChange={this.handleTab}
								indicatorColor="primary"
								textColor="primary"
								variant="fullWidth"
							>
								<Tab label="View" />
								<Tab label="Add New Bank" />
							</Tabs>
						</AppBar>
						<SwipeableViews
							axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
							index={this.state.value}
							onChangeIndex={this.handleChangeIndex}
						>
							<TabContainer dir={theme.direction}>
								<Paper className={classes.root}>
									<div className="row">
										<div style={{ float: "left", "marginLeft": "8px", "marginTop": "8px" }}>
											<Button variant="outlined" color="primary" className={classes.button} onClick={this.getBankById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "marginLeft": "8px", "marginTop": "8px" }}>
											<Button variant="outlined" color="inherit" className={classes.button} onClick={this.deleteBank}>
												Delete
										</Button>
										</div>
									</div>

									<Table className={classes.table}>
										<TableHead>
											<TableRow>
												<CustomTableCell align="center" >Code</CustomTableCell>
												<CustomTableCell align="center">BankName</CustomTableCell>
												<CustomTableCell align="center">BranchCode</CustomTableCell>
												<CustomTableCell align="center">Address</CustomTableCell>
												<CustomTableCell align="center">Swift Code</CustomTableCell>
												<CustomTableCell align="center">UAE FTS BANK Code</CustomTableCell>
												<CustomTableCell align="center">Route Code</CustomTableCell>
												<CustomTableCell align="center">Description</CustomTableCell>
												<CustomTableCell align="center">Action</CustomTableCell>												
											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.Banks.map(row => (
												<TableRow className={classes.row} key={row.Code}>
													<CustomTableCell align="center">{row.Code}</CustomTableCell>
													<CustomTableCell align="center">{row.BankName}</CustomTableCell>
													<CustomTableCell align="center">{row.BranchCode}</CustomTableCell>
													<CustomTableCell align="center">{row.Address}</CustomTableCell>
													<CustomTableCell align="center">{row.SwiftCode}</CustomTableCell>
													<CustomTableCell align="center">{row.UAEFTSBANKCode}</CustomTableCell>
													<CustomTableCell align="center">{row.RouteCode}</CustomTableCell>
													<CustomTableCell align="center">{row.Description}</CustomTableCell>
											<CustomTableCell align="center"><input type="checkbox" name="radio"  value= {row.Id}
						onClick={this.selection()}
						/>
						</CustomTableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</Paper>
							</TabContainer>
							<TabContainer dir={theme.direction}>
								<form className={classes.container} noValidate autoComplete="off">
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="bankName" fullWidth label="Bank Code" name="code" value={this.state.code} onChange={this.handleChange} tabindex="1" />
										{this.validator.message('code', this.state.code, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="RouteCode" fullWidth label="Route Code" name="RouteCode" value={this.state.RouteCode} onChange={this.handleChange} tabindex="2" />
										{this.validator.message('RouteCode', this.state.RouteCode, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="UAEFTSBANKCode" fullWidth label="UAE FTS BANK Code" name="UAEFTSBANKCode" value={this.state.UAEFTSBANKCode} onChange={this.handleChange} tabindex="3" />
										{this.validator.message('UAEFTSBANKCode', this.state.UAEFTSBANKCode, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}   >
										<TextField id="bankName" fullWidth label="Swift Code" name="SwiftCode" value={this.state.SwiftCode} onChange={this.handleChange} tabindex="4" />
										{this.validator.message('SwiftCode', this.state.SwiftCode, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<TextField id="bankName" fullWidth label="Bank Name" name="bankName" value={this.state.bankName} onChange={this.handleChange} tabindex="5" />
										{this.validator.message('bankName', this.state.bankName, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="bankCode" fullWidth label="Branch Code" name="bankCode" value={this.state.bankCode} onChange={this.handleChange} tabindex="6" />
										{this.validator.message('bankCode', this.state.bankCode, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}   >
										<TextField id="bankAddress" fullWidth label="Bank Address" name="bankAddress" value={this.state.bankAddress} onChange={this.handleChange} tabindex="7" />
										{this.validator.message('bankAddress', this.state.bankAddress, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="Description" fullWidth label="Description" name="Description" value={this.state.Description} onChange={this.handleChange} tabindex="8" />
										{this.validator.message('Description', this.state.Description, 'required')}
									</Grid>
								</form>
								<div className="row">
									<Grid item xs={12} sm={10}  >
										<div style={{ float: "right", "marginRight": "8px" }}>

											<Button variant="outlined" style={{marginTop:"10px"}} color="secondary" className={classes.button} onClick={this.insertUpdateRecord} >
												{this.state.Action}
											</Button>
										</div>
									</Grid>
								</div>
							</TabContainer>
						</SwipeableViews>
					</div>
				}
			/>
		)
	}
}

export default withStyles(styles, { withTheme: true })(Bank);