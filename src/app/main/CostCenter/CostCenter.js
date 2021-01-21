import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showLoading, hideLoading } from '../../../app/store/fuse/loadingSlice';
import { bindActionCreators } from '@reduxjs/toolkit';
import Splash from '../../fuse-layouts/layout2/components/splash-screen/splash-screen.component';


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
//import toastr from 'toastr';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import defaultUrl from "../../../app/services/constant/constant";
import Messages from '../toaster';
import { ToastContainer, toast } from 'react-toastify';

import $ from 'jquery';
import DataTable from "datatables.net";
import * as responsive from "datatables.net-responsive";
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
	formControl: {
		margin: theme.spacing.unit,
		minWidth: "99%",
	}
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
let id = 0;
function createData(Code, Description) {
	id += 1;
	return { Code, Description };
}

const rows = [
	createData('0001', 'Basic Salary')

];

class CostCenter extends Component {
	state = {
		value: 0,
		company: "",
		Companies: [],
		costcenter: [],
		code: "",
		description: "",
		Action: "Insert Record",
		Id: 0,
		table: null,
		Default:localStorage.getItem("state")!=null?JSON.parse(localStorage.getItem("state")):null
	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();

	}
	componentDidMount() {

		this.getCompanies();
		this.getCostCenter();
	}
	getCompanies = () => {
		this.props.showLoading();
		axios({
			method: "get",
			url: defaultUrl + "Company",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.props.hideLoading();
				console.log(response);
				this.setState({ Companies: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	insertUpdateCostCenter = () => {
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			this.forceUpdate();
		} else {
			var method = "post";
			var url = defaultUrl + "CostCenter";
			if (this.state.Action != "Insert Record") {
				method = "put";
				url = defaultUrl + "CostCenter/" + this.state.Id;
			}
			// console.log(this.state.company,this.state.employee,this.state.dateFrom,this.state.dateTo);
			var obj = {
				CompanyId: this.state.company,
				Code: this.state.code,
				Description: this.state.description
			};
			axios.interceptors.request.use(function (config) {
				//document.getElementById("fuse-splash-screen").style.display = "block";
				return config;
			}, function (error) {
				console.log('Error');
				return Promise.reject(error);
			});
			this.props.showLoading();
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
					this.props.hideLoading();
					toast.success('Operation successfull');
					this.getCostCenter();
					this.setState({
						company: "",
						code: "",
						description: "",
						Action: "Insert Record",
						Id: 0,
						value: 0
					});
					//document.getElementById("fuse-splash-screen").style.display = "none";
					Messages.success();
				})
				.catch((error) => {
					console.log(error);
					toast.error('Operation unsuccessfull');
					this.setState({
						company: "",
						code: "",
						description: "",
						Action: "Insert Record",
						Id: 0,
						value: 0
					})
					//document.getElementById("fuse-splash-screen").style.display = "none";
					Messages.error(error.message);
				})


		}
	}
	getCostCenter = () => {
		if(this.state.Default == null){
			return false;
		}
		this.props.showLoading();
		axios({
			method: "get",
			url: defaultUrl + "/CostCenter/ByCompany/"+this.state.Default.Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.props.hideLoading();
				console.log(response);

				this.setState({ costcenter: response.data });
			
			})
			.catch((error) => {
				console.log(error);
			})
		// localStorage.removeItem("ids");
		// if (!$.fn.dataTable.isDataTable('#CostCenter_Table')) {
		// 	this.state.table = $('#CostCenter_Table').DataTable({
		// 		ajax: defaultUrl + "CostCenter",
		// 		"columns": [
		// 			{ "data": "Code" },
		// 			{ "data": "Description" },
		// 			{ "data": "CompanyId" },
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
	getCostCenterById = () => {
		let ids = localStorage.getItem("ids")
		if (ids === null || localStorage.getItem("ids").split(",").length > 1) {
			Messages.warning("kindly Select one record");
			return false;
		}
		//document.getElementById("fuse-splash-screen").style.display = "block";
		this.props.showLoading();
		axios({
			method: "get",
			url: defaultUrl + "CostCenter/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.props.hideLoading();
				console.log(response);
				this.setState({
					code: response.data[0].Code,
					company: response.data[0].CompanyId,
					description: response.data[0].Description,
					value: 1,
					Id: response.data[0].Id,
					Action: "Update Record"
				});
				//document.getElementById("fuse-splash-screen").style.display = "none";
			})
			.catch((error) => {
				//document.getElementById("fuse-splash-screen").style.display = "none";
				console.log(error);
			})
	}
	deleteCostCenter = () => {
		var ids = localStorage.getItem("ids");
		if (ids === null) {
			Messages.warning("No Record Selected");
			return false;
		}
		//document.getElementById("fuse-splash-screen").style.display = "block";
		this.props.showLoading();
		axios({
			method: "delete",
			url: defaultUrl + "CostCenter/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.props.hideLoading();
				this.getCostCenter();
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();
			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.error(error.message);
			})
	}
	handleTabChange = (event, value) => {
		this.setState({ value });
		this.setState({ [event.target.name]: event.target.value });

	};
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });

	};
	selection = (id) => {
		console.log("called");
		const checkboxes = document.querySelectorAll('input[name=radio]:checked');
		let values = [];
		checkboxes.forEach((checkbox) => {
			values.push(checkbox.value);
		});
		localStorage.setItem('ids', values);
	}
	render() {
		const { classes, theme } = this.props;

		return (
			<React.Fragment>
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Cost Cneter-{this.state.Default !=null?this.state.Default.Company:"No Company Selected Yet"}</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Cost-Center</h4></div>
				}
				content={

					<div className={classes.root}>
						<div>
							<ToastContainer />
						</div>
						<AppBar position="static" color="default">
							<Tabs
								value={this.state.value}
								onChange={this.handleTabChange}
								indicatorColor="primary"
								textColor="primary"
								variant="fullWidth"
							>
								<Tab label="View" />
								<Tab label="Add New Cost-Center" />
							</Tabs>
						</AppBar>
						<SwipeableViews
							axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
							index={this.state.value}
							onChangeIndex={this.handleChangeIndex}
						>
							<TabContainer dir={theme.direction}>
								<Paper className={classes.root}>
								
									<div className="row" style={{marginBottom:"5px"}}  >
										<div style={{ float: "left",  "margin": "8px" }}>
											<Button variant="contained" color="secondary" className={classes.button} onClick={this.getCostCenterById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button  variant="contained" color="primary" className={classes.button} onClick={this.deleteCostCenter}>
												Delete
										</Button>
										</div>
										
									</div>
									<Table className={classes.table}>
										<TableHead>
											<TableRow>
												<CustomTableCell align="center" >Code</CustomTableCell>
												<CustomTableCell align="center" >Description</CustomTableCell>
												<CustomTableCell align="center">Action</CustomTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{
												this.state.costcenter.length>0?
												this.state.costcenter.map(row => (
													<TableRow className={classes.row} key={row.Code}>
	
														<CustomTableCell align="center">{row.Code == "" || row.Code == null || row.Code == undefined ? 'N/A' : row.Code}</CustomTableCell>
														<CustomTableCell align="center">{row.Description == "" || row.Description == null || row.Description == undefined ? 'N/A' : row.Description}</CustomTableCell>
														
														<CustomTableCell align="center"><input type="checkbox" name="radio" value={row.Id}
															onChange={() => this.selection(row.Id)}
														/>
														</CustomTableCell>
													</TableRow>
												))
												:
												<div style={{fontSize: "calc(1em + 1vw)",textAlign: "center"}} >{this.state.Default==null?"No Company Selected Yet":"No Record Found"}</div>
											}
										</TableBody>
									</Table>
								</Paper>
							</TabContainer>
							<TabContainer dir={theme.direction}>
								<form className={classes.container} noValidate autoComplete="off">

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}>
										<TextField id="code" fullWidth label="Code" name="code" value={this.state.code} onChange={this.handleChange}

										/>
										{this.validator.message('code', this.state.code, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} >
										<TextField id="description" fullWidth label="description" name="description" value={this.state.description} onChange={this.handleChange}
										/>
										{this.validator.message('description', this.state.description, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}   >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="company">Company</InputLabel>
											<Select
												value={this.state.company}
												onChange={this.handleChange}
												inputProps={{
													name: 'company',
													id: 'company',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.Companies.map(row => (
													<MenuItem value={row.Id}>{row.CompanyName}</MenuItem>
												))}
											</Select>
											{this.validator.message('company', this.state.company, 'required')}
										</FormControl>
									</Grid>
								</form>
								<div className="row">
									<Grid item xs={12} sm={10} style={{ marginRight: '5px' }}   >
										<div style={{ float: "right", "marginRight": "8px" }}>

											<Button variant="outlined" color="secondary" onClick={this.insertUpdateCostCenter} className={classes.button}>
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
			<Splash/>
			</React.Fragment>
		)
	}
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{
			
			showLoading,
			hideLoading
		},
		dispatch
	);
}



export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(CostCenter));