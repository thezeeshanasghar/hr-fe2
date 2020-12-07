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
import { Icon, Input, MuiThemeProvider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import SimpleReactValidator from 'simple-react-validator';
import axios from "axios";
//import toastr from 'toastr';
import moment from 'moment';
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

class UnpaidLeaves extends Component {
	state = {
		value: 0,
		labelWidth: 0,
		employee: "",
		dateTo: "",
		dateFrom: "",
		company: "",
		Companies: [],
		Employees: [],
		leaves: [],
		Action:"Insert Record",
		Id:0,
		table:null

	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
	}
	componentDidMount() {
		this.getCompanies();
		this.getUnPaidLeaves();
	}
	getCompanies = () => {
		axios({
			method: "get",
			url: defaultUrl+"Company",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ Companies: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getEmployees = (companyId) => {
		axios({
			method: "get",
			url: defaultUrl+"Employee/ByCompany/" + companyId,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ Employees: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})

	}

	handleTabChange = (event, value) => {
		this.setState({ value });
		this.setState({ [event.target.name]: event.target.value });

	};
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
		console.log(e.target.name, e.target.value);
		if (e.target.name == "company" && e.target.value != "") {
			this.getEmployees(e.target.value);
		}
	};
	insertUpdateLeaves = () => {
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			this.forceUpdate();
		} else {
			var method = "post";
			var url =  defaultUrl+"Unpaidleaves";
			if(this.state.Action !="Insert Record")
			{
				 method = "put";
				 url = defaultUrl+"Unpaidleaves/"+this.state.Id;
			}
			// console.log(this.state.company,this.state.employee,this.state.dateFrom,this.state.dateTo);
			var obj = {
				CompanyId: this.state.company,
				EmployeeId: this.state.employee,
				LeaveStartDate: this.state.dateFrom,
				LeaveEndDate: this.state.dateTo
			};
			axios.interceptors.request.use(function (config) {
				//document.getElementById("fuse-splash-screen").style.display="block";

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
					this.getUnPaidLeaves();
					this.getBankDetail();
					this.setState({
						company: "",
						employee: "",
						dateFrom: "",
						dateTo: "",
						Action:"Insert Record",
						Id:0,
						value:0
					});
					//document.getElementById("fuse-splash-screen").style.display="none";
					Messages.success();

				})
				.catch((error) => {
					console.log(error);
					toast.error('Operation unsuccessfull');
					this.setState({
						company: "",
						employee: "",
						dateFrom: "",
						dateTo: "",
						Action:"Insert Record",
						Id:0,
						value:0
					})
					//document.getElementById("fuse-splash-screen").style.display="none";
					Messages.error();
				})


		}
	}
	getUnPaidLeaves = () => {
		localStorage.removeItem("ids");
		if (!$.fn.dataTable.isDataTable('#Unpaid_Table')) {
			this.state.table = $('#Unpaid_Table').DataTable({
				ajax: defaultUrl + "unpaidleaves",
				"columns": [
					{ "data": "FirstName" },
					{ "data": "CompanyName" },
					{ "data": "LeaveStartDate" },
					{ "data": "LeaveStartDate" },
					{ "data": "Action",
					sortable: false,
					"render": function ( data, type, full, meta ) {
					   
						return `<input type="checkbox" name="radio"  value=`+full.Id+`
						onclick=" const checkboxes = document.querySelectorAll('input[name=radio]:checked');
									let values = [];
									checkboxes.forEach((checkbox) => {
										values.push(checkbox.value);
									});
									localStorage.setItem('ids',values);	"
						/>`;
					}
				 }

				],
				rowReorder: {
					selector: 'td:nth-child(2)'
				},
				responsive: true,
				dom: 'Bfrtip',
				buttons: [

				],
				columnDefs: [{
					"defaultContent": "-",
					"targets": "_all"
				  }]
			});
		} else {
			this.state.table.ajax.reload();
		}
	}
	getLeavesById = () => {
		let ids = localStorage.getItem("ids")
		if(ids=== null || localStorage.getItem("ids").split(",").length>1)
		{
			Messages.warning("kindly Select one record");
			return false;
		}
		axios({
			method: "get",
			url: defaultUrl+"Unpaidleaves/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.getEmployees(response.data[0].CompanyId);
				this.setState({
					employee: response.data[0].EmployeeId,
					dateFrom: moment(response.data[0].LeaveStartDate).format('YYYY-MM-DD'),
					dateTo: moment(response.data[0].LeaveEndDate).format('YYYY-MM-DD'),
					company: response.data[0].CompanyId,
					value: 1,
					Id:response.data[0].Id,
					Action :"Update Record"
				});

			})
			.catch((error) => {
				console.log(error);
			})
	}
	deleteLeaves=()=>{
		var ids=localStorage.getItem("ids");
		if(ids===null)
		{
		Messages.warning("No Record Selected");
		return false;
		}
		
		axios({
			method: "delete",
			url: defaultUrl+"Unpaidleaves/"+ids,
			headers: {
			  // 'Authorization': `bearer ${token}`,
			  "Content-Type": "application/json;charset=utf-8",
			},
		  })
			.then((response) => {
				
				this.getUnPaidLeaves();
			})
			.catch((error) => {
				console.log(error);
			})
	  }
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Unpaid Leave</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Unpaid Leave</h4></div>
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
								<div className="row">
									<div style={{ float: "left", "marginLeft": "8px", "marginTop": "8px" }}>
										<Button variant="outlined" color="primary" className={classes.button} onClick={this.getLeavesById}>
											Edit
										</Button>
									</div>
									<div style={{ float: "left", "marginLeft": "8px", "marginTop": "8px" }}>
										<Button variant="outlined" color="inherit" className={classes.button} onClick={this.deleteLeaves}>
											Delete
										</Button>
									</div>
								</div>
									<table id="Unpaid_Table" className="nowrap header_custom" style={{ "width": "100%" }}>
										<thead>
											<tr>
												<th>First Name</th>
												<th>Company Name</th>
												<th>Leave Start Date</th>
												<th>Leave Start Date</th>
												<th>Action</th>
											</tr>
										</thead>

									</table>
								</Paper>
							</TabContainer>
							<TabContainer dir={theme.direction}>
								<form className={classes.container} noValidate autoComplete="off">
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

									<Grid item xs={12} sm={5} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Employee">Employee</InputLabel>
											<Select
												value={this.state.employee}
												onChange={this.handleChange}
												inputProps={{
													name: 'employee',
													id: 'employee',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.Employees.map(row => (
													<MenuItem value={row.Id}>{row.FirstName}</MenuItem>
												))}
											</Select>
											{this.validator.message('employee', this.state.employee, 'required')}
										</FormControl>
										{/* {this.validator.message('bankName', this.state.bankName, 'required')} */}
									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}>
										<TextField id="dateFrom" fullWidth label="Date From" type="date" name="dateFrom"  value={this.state.dateFrom}  onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('dateFrom', this.state.dateFrom, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}>
											<TextField id="dateFrom" fullWidth label="Date To" type="date" name="dateTo"  value={this.state.dateTo}  onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('dateTo', this.state.dateTo, 'required')}
									</Grid>

								</form>
								<div className="row">
									<Grid item xs={12} sm={10} >
										<div style={{ float: "right", "marginRight": "8px", "marginTop": "5px" }}>

											<Button variant="outlined" color="secondary" className={classes.button} onClick={this.insertUpdateLeaves} >
												{this.state.Action}
      								</Button>
										</div>
									</Grid>
								</div>
							</TabContainer>
						</SwipeableViews>
					</ div>
				}
			/>
		)
	}
}

export default withStyles(styles, { withTheme: true })(UnpaidLeaves);