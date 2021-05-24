import React, { Component } from 'react';
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
import SimpleReactValidator from 'simple-react-validator';
import axios from "axios";
//import toastr from 'toastr';
import { Lookups } from '../../services/constant/enum'
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import defaultUrl from "../../../app/services/constant/constant";

import $ from 'jquery';
import DataTable from "datatables.net";
import * as responsive from "datatables.net-responsive";
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
function createData(PayElement, GlAccount, CostCenterPosting, CostCenter, PostingPerEmployee) {
	id += 1;
	return { PayElement, GlAccount, CostCenterPosting, CostCenter, PostingPerEmployee };
}

const rows = [
	createData("PayElement", "GlAccount", "true", "CostCenter", "PostingPerEmployee")
];

class PayElementGlAccount extends Component {
	state = {
		value: 0,
		labelWidth: 0,
		PayElement:"",
		GLAccount: "",
		CostCenterPosting: "",
		CostCenter: "",
		payElements:[],
		postperEmployee:"",
		glaccountList:[],
		PeriodicityList:[],
		costcenterList:[],
		payelementglAccountList:[],
		Id:0,
		Action:"Insert Record",
		table:null,
		StaffCategory:"",
		StaffCategoryList:[],
		Default:localStorage.getItem("state")!=null?JSON.parse(localStorage.getItem("state")):null

	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();

	}
	componentDidMount() {
	this.getPayElement();
	this.getGlAccount();
	this.getPeriodicity();
	this.getCostCenter();
	this.getpayelementglAccountList();
	this.getStaffCategory();
	}
	getCostCenter = () => {
		axios({
			method: "get",
			url: defaultUrl+"CostCenter",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ costcenterList: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getStaffCategory=()=>{
		axios({
			method: "get",
			url: defaultUrl + "lookups/"+Lookups.StaffCategory,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ StaffCategoryList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getPeriodicity=()=>{
		axios({
			method: "get",
			url: defaultUrl + "lookups/"+Lookups.periodicity,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ PeriodicityList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}

	getPayElement = () => {
		axios({
			method: "get",
			url: defaultUrl+"payelement",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ payElements: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getGlAccount = () => {
		axios({
			method: "get",
			url: defaultUrl+"glaccount",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ glaccountList: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	insertUpdatePayElementGLAccount= () => {
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			this.forceUpdate();
		} else {
			var method = "post";
			var url = defaultUrl+"PayElementGLAccount";
			if(this.state.Action !="Insert Record")
			{
				 method = "put";
				 url = defaultUrl+"PayElementGLAccount/"+this.state.Id;
			}
			// console.log(this.state.company,this.state.employee,this.state.dateFrom,this.state.dateTo);
			var obj = {
				PayElementId:this.state.PayElement,
				GLAccountId:this.state.GLAccount,
				CostCenterPosting:this.state.CostCenterPosting,
				CostCenterId:this.state.CostCenter,
				PostingPerEmployee:this.state.postperEmployee,
				FinStaffCategory:this.state.StaffCategory
			};
			axios.interceptors.request.use(function (config) {
				// document.getElementById("fuse-splash-screen").style.display="block";
				return config;
			}, function (error) {
				console.log('Error');
				return Promise.reject(error);
			});
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
					toast.success('Operation successfull');
				this.getpayelementglAccountList();
					this.setState({
						PayElement:"",
						GLAccount:"",
						CostCenterPosting:"",
						CostCenter:"",
						postperEmployee:"",
						Id: 0,
						Action:'Insert Record',
						StaffCategory:"",
						value :  0
					});
					// document.getElementById("fuse-splash-screen").style.display="none";
					Messages.success();

				})
				.catch((error) => {
					console.log(error);
					toast.error('Operation unsuccessfull');
					this.setState({
						PayElement:"",
						GLAccount:"",
						CostCenterPosting:"",
						CostCenter:"",
						postperEmployee:"",
						Id: 0,
						Action:'Insert Record',
						StaffCategory:"",
						value :  0
					})
					// document.getElementById("fuse-splash-screen").style.display="none";
					Messages.error(error.message);

				})


		}
	}
	selection = (id) => {
		console.log("called");
		const checkboxes = document.querySelectorAll('input[name=radio]:checked');
		let values = [];
		checkboxes.forEach((checkbox) => {
			values.push(checkbox.value);
		});
		localStorage.setItem('ids', values);
	}
	getpayelementglAccountList = () => {
		if(this.state.Default == null){
			return false;
		}
		axios({
			method: "get",
			url: defaultUrl + "/PayElementGLAccount",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ payelementglAccountList: response.data.data });
			
			})
			.catch((error) => {
				console.log(error);
			})
		// localStorage.removeItem("ids");
		// if (!$.fn.dataTable.isDataTable('#PayElementGLAccount_Table')) {
		// 	this.state.table = $('#PayElementGLAccount_Table').DataTable({
		// 		ajax: defaultUrl + "PayElementGLAccount",
		// 		"columns": [
		// 			{ "data": "PayElementId" },
		// 			{ "data": "GLAccountId" },
		// 			{ "data": "CostCenterPosting" },
		// 			{ "data": "CostCenterId" },
		// 			{ "data": "PostingPerEmployee" },
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
	getpayelementglAccountListById = () => {
		
		let ids = localStorage.getItem("ids")
		if(ids=== null || localStorage.getItem("ids").split(",").length>1)
		{
			alert("kindly Select one record");
			return false;	
		}
		// document.getElementById("fuse-splash-screen").style.display="block";

		axios({
			method: "get",
			url: defaultUrl+"PayElementGLAccount/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				
				this.setState({
					PayElement:response.data[0].PayElementId,
					GLAccount: response.data[0].GLAccountId,
					CostCenterPosting: response.data[0].CostCenterPosting,
					CostCenter:response.data[0].CostCenterId,
					postperEmployee:response.data[0].PostingPerEmployee,
					value :  1,
					Id : response.data[0].Id,
					Action : "Update Record",
					StaffCategory : response.data[0].FinStaffCategory
				});
				// document.getElementById("fuse-splash-screen").style.display="none";

			})
			.catch((error) => {
				console.log(error);
				// document.getElementById("fuse-splash-screen").style.display="none";

			})
	}
	deletegetpayelementglAccountList =()=>{
		var ids=localStorage.getItem("ids");
		if(ids===null)
		{
		Messages.warning("No Record Selected");
		return false;
		}
		// document.getElementById("fuse-splash-screen").style.display="block";

		axios({
			method: "delete",
			url: defaultUrl+"PayElementGLAccount/"+ids,
			headers: {
			  // 'Authorization': `bearer ${token}`,
			  "Content-Type": "application/json;charset=utf-8",
			},
		  })
			.then((response) => {
				
				this.getpayelementglAccountList();
				// document.getElementById("fuse-splash-screen").style.display="none";
				Messages.success();

			})
			.catch((error) => {
				console.log(error);
				// document.getElementById("fuse-splash-screen").style.display="none";
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
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Pay-Element/GL-Account</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Pay-Element/GL-Account</h4></div>
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
											<Button variant="contained" color="secondary" className={classes.button} onClick={this.getpayelementglAccountListById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button  variant="contained" color="primary" className={classes.button} onClick={this.deletegetpayelementglAccountList}>
												Delete
										</Button>
										</div>
										
									</div>
									<Table className={classes.table}>
										<TableHead>
											<TableRow>
											<CustomTableCell align="center">Action</CustomTableCell>
												<CustomTableCell align="center" >Pay Element</CustomTableCell>
												<CustomTableCell align="center" >GLAccount</CustomTableCell>
												<CustomTableCell align="center" >Posting Per Employee</CustomTableCell>
												
											</TableRow>
										</TableHead>
										<TableBody>
											{
												this.state.payelementglAccountList.length>0?
												this.state.payelementglAccountList.map(row => (
													<TableRow className={classes.row} key={row.PayElementId}>
														<CustomTableCell align="center"><input type="checkbox" name="radio" value={row.Id}
															onChange={() => this.selection(row.Id)}
														/>
														</CustomTableCell>
														<CustomTableCell align="center">{row.PayElementId == "" || row.PayElementId == null || row.PayElementId == undefined ? 'N/A' : row.PayElementId}</CustomTableCell>
														<CustomTableCell align="center">{row.GLAccountId == "" || row.GLAccountId == null || row.GLAccountId == undefined ? 'N/A' : row.GLAccountId}</CustomTableCell>
														<CustomTableCell align="center">{row.PostingPerEmployee == "" || row.PostingPerEmployee == null || row.PostingPerEmployee == undefined ? 'N/A' : row.PostingPerEmployee}</CustomTableCell>
														
														
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
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="PayElement">PayElement</InputLabel>
										<Select
											value={this.state.PayElement}
											onChange={this.handleChange}
											inputProps={{
												name: 'PayElement',
												id: 'PayElement',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{this.state.payElements.map(row => (
													<MenuItem value={row.Id}>{row.Code}</MenuItem>
												))} 
										</Select>
									</FormControl>
									{this.validator.message('PayElement', this.state.PayElement, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}>
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="PayElement">GL-Account</InputLabel>
										<Select
											value={this.state.GLAccount}
											onChange={this.handleChange}
											inputProps={{
												name: 'GLAccount',
												id: 'GLAccount',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{this.state.glaccountList.map(row => (
													<MenuItem value={row.Id}>{row.Account}</MenuItem>
												))} 
										</Select>
									</FormControl>
									{this.validator.message('GLAccount', this.state.GLAccount, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<FormControl className={classes.formControl}>
										<InputLabel htmlFor="CostCenterPosting">CostCenter Posting</InputLabel>
										<Select
											value={this.state.CostCenterPosting}
											onChange={this.handleChange}
											inputProps={{
												name: 'CostCenterPosting',
												id: 'CostCenterPosting',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											
											{this.state.PeriodicityList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))} 
										</Select>
									</FormControl>
									{this.validator.message('CostCenterPosting', this.state.CostCenterPosting, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}>
										<FormControl className={classes.formControl}>
										<InputLabel htmlFor="PayElement">Cost Center</InputLabel>
										<Select
											value={this.state.CostCenter}
											onChange={this.handleChange}
											inputProps={{
												name: 'CostCenter',
												id: 'CostCenter',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											
											{this.state.costcenterList.map(row => (
													<MenuItem value={row.Id}>{row.Code}</MenuItem>
												))} 
										</Select>
									</FormControl>
									{this.validator.message('CostCenter', this.state.CostCenter, 'required')}

									</Grid>
									
									<Grid item xs={12} sm={5}>
										<TextField
										id="postperEmployee"
										type="number"
										label="Posting Per Employee"
										className={classes.textField}
										value={this.state.postperEmployee}
										name="postperEmployee"
										fullWidth
										  onChange={this.handleChange}
										margin="normal"
										/>
										{this.validator.message('postperEmployee', this.state.postperEmployee, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}>
										<FormControl className={classes.formControl}>
										<InputLabel htmlFor="PayElement">Staff Category</InputLabel>
										<Select
											value={this.state.StaffCategory}
											onChange={this.handleChange}
											inputProps={{
												name: 'StaffCategory',
												id: 'StaffCategory',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											
											{this.state.StaffCategoryList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))} 
										</Select>
									</FormControl>
									{this.validator.message('CostCenter', this.state.CostCenter, 'required')}

									</Grid>
								</form>
								<div className="row">
								<Grid item xs={12} sm={10}>
									<div style={{ float: "right", "marginRight": "8px" }}>

										<Button variant="outlined" color="secondary" onClick={this.insertUpdatePayElementGLAccount} className={classes.button}>
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

export default withStyles(styles, { withTheme: true })(PayElementGlAccount);