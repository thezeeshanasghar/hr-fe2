import React, { Component } from 'react';
import { connect } from 'react-redux';

import { showLoading, hideLoading } from '../../../app/store/fuse/loadingSlice';
import { bindActionCreators } from '@reduxjs/toolkit';
import Splash from '../../fuse-layouts/layout2/components/splash-screen/splash-screen.component';


import { withStyles } from '@material-ui/core/styles';
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
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { Icon, Input, MuiThemeProvider} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import defaultUrl from "../../../app/services/constant/constant";
import { Lookups } from '../../services/constant/enum'
import SimpleReactValidator from 'simple-react-validator';
import $ from 'jquery';
import Messages from '../toaster';
import { ToastContainer, toast } from 'react-toastify';
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
function createData(LabourId) {
	id += 1;
	return { LabourId };
}

const rows = [
	createData("LabourId")
];

class UserProtection extends Component {
	state = {
		value: 0,
		labelWidth: 0,
		unit: 1,
		Job: 1,
		labourId:"",
		countryId:"",
		companyId:"",
		Action: 'Insert Record',
		table:null,
		Companies:[],
		countryCode:[],
		UserProtection:[],
		Default:localStorage.getItem("state")!=null?JSON.parse(localStorage.getItem("state")):null
	};
		constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
	
	}
	componentDidMount() {
		localStorage.removeItem("ids");
		this.getUserProtection();
		this.getCompanyDetail();
		this.getCountry();
	}

	getUserProtection = () => {
		if(this.state.Default == null){
			return false;
		}
		this.props.showLoading();
		axios({
			method: "get",
			url: defaultUrl + "/userProtection/ByCompany/"+this.state.Default.Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.props.hideLoading();
				console.log(response);

				this.setState({ UserProtection: response.data });
			
			})
			.catch((error) => {
				console.log(error);
			})
		// localStorage.removeItem("ids");
		// if (!$.fn.dataTable.isDataTable('#Protection_Table')) {
		// 	this.state.table = $('#Protection_Table').DataTable({
		// 		ajax: defaultUrl + "userProtection",
		// 		"columns": [
		// 			{ "data": "LabourId" },
		// 			{ "data": "CompanyName" },
		// 			{ "data": "Country" },
		// 			{ "data": "Action",
		// 			sortable: false,
		// 			"render": function ( data, type, full, meta ) {
					   
		// 				return `<input type="checkbox" name="radio"  value=`+full.Id+`
		// 				onclick=" const checkboxes = document.querySelectorAll('input[name=radio]:checked');
		// 							let values = [];
		// 							checkboxes.forEach((checkbox) => {
		// 								values.push(checkbox.value);
		// 							});
		// 							localStorage.setItem('ids',values);	"
		// 				/>`;
		// 			}
		// 		 }

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
		// 		  }]
		// 	});
		// } else {
		// 	this.state.table.ajax.reload();
		// }
	}
	getUserProtectionById = () => {
		let ids = localStorage.getItem("ids")
		if(ids=== null || localStorage.getItem("ids").split(",").length>1)
		{
			Messages.warning("kindly Select one record");
			return false;
		}
		//document.getElementById("fuse-splash-screen").style.display="block";
		this.props.showLoading();
		axios({
			method: "get",
			url: defaultUrl + "userProtection/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.props.hideLoading();
				console.log(response);
				this.setState({ Action: 'Update Record', value: 1, 
				companyId: response.data[0].CompanyId, labourId: response.data[0].LabourId, Id: response.data[0].Id,countryId:response.data[0].Country });
				//document.getElementById("fuse-splash-screen").style.display="none";

			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display="none";

			})
	}

	deleteProtection = () => {
		var ids=localStorage.getItem("ids");
		if(ids===null)
		{
		Messages.warning("No Record Selected");
		return false;
		}
		//document.getElementById("fuse-splash-screen").style.display="block";
		this.props.showLoading();
		axios({
			method: "delete",
			url: defaultUrl + "userProtection/"+ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.props.hideLoading();
				localStorage.removeItem("ids");
				this.getUserProtection();
				//document.getElementById("fuse-splash-screen").style.display="none";
				Messages.success();

			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display="none";
				Messages.error();

			})
	}

	insertUpdateRecord = () => {
		if (!this.validator.allValid()) {
			console.log("false");
			this.validator.showMessages();
			this.forceUpdate();
			return false;
		}

		var method = "post";
		var url = defaultUrl + "userProtection";
		if (this.state.Action != "Insert Record") {
			method = "put";
			url = defaultUrl + "userProtection/" + this.state.Id;
		}


		var obj = {
			LabourId: this.state.labourId,
			CompanyId: this.state.companyId,
			Country: this.state.countryId
		};
		axios.interceptors.request.use(function (config) {
			//document.getElementById("fuse-splash-screen").style.display="block";
			
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
				Messages.success();
				this.getUserProtection();

				this.setState({
					labourId:0,
					companyId:0,
					countryId:0,
					Action: 'Insert Record',
					Id: 0,
					value:0
				});
				//document.getElementById("fuse-splash-screen").style.display="none";
				

			})
			.catch((error) => {
				console.log(error);
				this.setState({
					labourId:0,
					companyId:0,
					countryId:0,
					Action: 'Insert Record',
					Id: 0,
					value:0
				})
				//document.getElementById("fuse-splash-screen").style.display="none";
				Messages.error(error.message);

			})
	}

	getCompanyDetail = () => {
		this.props.showLoading();
		axios({
			method: "get",
			url: defaultUrl + "company",
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
	getCountry = () => {
		this.props.showLoading();
		axios({
			method: "get",
			url: defaultUrl + "lookups/" + Lookups.Country,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.props.hideLoading();
				console.log(response);
				this.setState({ countryCode: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	handleTab = (event, value) => {
		this.setState({ value });
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
					<div className="p-24"><h4>User Protection-{this.state.Default !=null?this.state.Default.Company:"No Company Selected Yet"}</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New User Protection</h4></div>
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
								<Tab label="Add New" />
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
											<Button variant="contained" color="secondary" className={classes.button} onClick={this.getUserProtectionById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button  variant="contained" color="primary" className={classes.button} onClick={this.deleteProtection}>
												Delete
										</Button>
										</div>
										
									</div>
								
									<Table className={classes.table}>
										<TableHead>
											<TableRow>
												<CustomTableCell align="center" >labour Id</CustomTableCell>
												<CustomTableCell align="center">Action</CustomTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{
												this.state.UserProtection.length>0?
												this.state.UserProtection.map(row => (
													<TableRow className={classes.row} key={row.Code}>
	
														<CustomTableCell align="center">{row.LabourId == "" || row.LabourId == null || row.LabourId == undefined ? 'N/A' : row.LabourId}</CustomTableCell>
														
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
								<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
			
										<TextField id="labourId" fullWidth label="labourId" name="labourId" value={this.state.labourId} onChange={this.handleChange} />
									{this.validator.message('labourId', this.state.labourId, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
									<FormControl className={classes.formControl}>
											<InputLabel htmlFor="company">Company</InputLabel>
											<Select
												value={this.state.companyId}
												onChange={this.handleChange}
												inputProps={{
													name: 'companyId',
													id: 'companyId',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>

												 {this.state.Companies.map(row => (
													<MenuItem value={row.Id}>{row.CompanyName}</MenuItem>
												))} 
											</Select>
											{this.validator.message('companyId', this.state.companyId, 'required')}
										</FormControl>

									</Grid>
									<Grid item xs={12} sm={5}  >
									<FormControl className={classes.formControl}>
											<InputLabel htmlFor="company">Country</InputLabel>
											<Select
												value={this.state.countryId}
												onChange={this.handleChange}
												inputProps={{
													name: 'countryId',
													id: 'countryId',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>

												{this.state.countryCode.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
											{this.validator.message('countryId', this.state.countryId, 'required')}
										</FormControl>
									</Grid>
								</form>
								<div className="row">
									<div style={{ float: "right", "marginRight": "8px" }}>

										<Button variant="outlined" color="secondary" className={classes.button} onClick={this.insertUpdateRecord} >
										{this.state.Action}
      								</Button>
									</div>
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
export default connect(null, mapDispatchToProps)(withStyles(styles, { withTheme: true })(UserProtection));