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

class Termination extends Component {
	state = {
		value: 0,
		labelWidth: 0,
		employee: "",
		reason: "",
		lastDate: "",
		company: "",
		Companies: [],
		Employees: [],
		TerminationList: [],
		Action:"Insert Record",
		Id:0,
		table:null,
		Default:localStorage.getItem("state")!=null?JSON.parse(localStorage.getItem("state")):null

	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
	}
	componentDidMount() {
		this.getCompanies();
		this.getEmployeeTermination();
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
			var url =  defaultUrl+"Termination";
			if(this.state.Action !="Insert Record")
			{
				 method = "put";
				 url = defaultUrl+"Termination/"+this.state.Id;
			}
			// console.log(this.state.company,this.state.employee,this.state.dateFrom,this.state.dateTo);
			var obj = {
				CompanyId: this.state.company,
				EmployeeId: this.state.employee,
				reason: this.state.reason,
				lastDate: this.state.lastDate,
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
					this.getEmployeeTermination();
					this.setState({
						company: "",
						employee: "",
						reason: "",
						lastDate: "",
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
						reason: "",
						lastDate: "",
						Action:"Insert Record",
						Id:0,
						value:0
					})
					//document.getElementById("fuse-splash-screen").style.display="none";
					Messages.error(error.message);
				})


		}
	}
	getEmployeeTermination = () => {
				
		if(this.state.Default == null){
			return false;
		}
		axios({
			method: "get",
			url: defaultUrl + "/termination/ByCompany/"+this.state.Default.Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ TerminationList: response.data.data });
			
			})
			.catch((error) => {
				console.log(error);
			})
	
	}
	getTerminationById = () => {
		let ids = localStorage.getItem("ids")
		if(ids=== null || localStorage.getItem("ids").split(",").length>1)
		{
			Messages.warning("kindly Select one record");
			return false;
		}
		axios({
			method: "get",
			url: defaultUrl+"Termination/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				//document.getElementById("fuse-splash-screen").style.display="none";
				console.log(response);
				this.getEmployees(response.data[0].CompanyId);
				this.setState({
					employee: response.data[0].EmployeeId,
					lastDate: moment(response.data[0].LastWorkingDate).format('YYYY-MM-DD'),
					reason:response.data[0].TerminationReason,
					company: response.data[0].CompanyId,
					value: 1,
					Id:response.data[0].Id,
					Action :"Update Record"
				});
		

			})
			.catch((error) => {
				//document.getElementById("fuse-splash-screen").style.display="none";
				console.log(error);
			})
	}
	deleteTermination=()=>{
		var ids=localStorage.getItem("ids");
		if(ids===null)
		{
		Messages.warning("No Record Selected");
		return false;
		}
		
		axios({
			method: "delete",
			url: defaultUrl+"Termination/"+ids,
			headers: {
			  // 'Authorization': `bearer ${token}`,
			  "Content-Type": "application/json;charset=utf-8",
			},
		  })
			.then((response) => {
				Messages.success();
				this.getEmployeeTermination();
			})
			.catch((error) => {
				Messages.error(error.message);
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
					<div className="p-24"><h4>Employee Termination-{this.state.Default !=null?this.state.Default.Company:"No Company Selected Yet"}</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Employee Termination</h4></div>
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
											<Button variant="contained" color="secondary" className={classes.button} onClick={this.getTerminationById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button  variant="contained" color="primary" className={classes.button} onClick={this.deleteTermination}>
												Delete
										</Button>
										</div>
										
									</div>
									<Table className={classes.table}>
										<TableHead>
											<TableRow>
												<CustomTableCell align="center" >First Name</CustomTableCell>
												<CustomTableCell align="center" >Company Name</CustomTableCell>
												<CustomTableCell align="center" >Last working Date</CustomTableCell>
												<CustomTableCell align="center" >Reason of Termination</CustomTableCell>
												<CustomTableCell align="center">Action</CustomTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{
												this.state.TerminationList.length>0?
												this.state.TerminationList.map(row => (
													<TableRow className={classes.row} key={row.Code}>
	
														<CustomTableCell align="center">{row.FirstName == "" || row.FirstName == null || row.FirstName == undefined ? 'N/A' : row.FirstName}</CustomTableCell>
														<CustomTableCell align="center">{row.CompanyName == "" || row.CompanyName == null || row.CompanyName == undefined ? 'N/A' : row.CompanyName}</CustomTableCell>
														<CustomTableCell align="center" component="th" scope="row">
															{row.LastWorkingDate == "" || row.LastWorkingDate == null || row.LastWorkingDate == undefined ? 'N/A' : row.LastWorkingDate}
														</CustomTableCell>
														<CustomTableCell align="center" component="th" scope="row">
															{row.TerminationReason == "" || row.TerminationReason == null || row.TerminationReason == undefined ? 'N/A' : row.TerminationReason}
														</CustomTableCell>
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
										<TextField id="dateFrom" fullWidth label="Last Date" type="date" name="lastDate"  value={this.state.lastDate}  onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('lastDate', this.state.lastDate, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}>
											<TextField id="reason" fullWidth label="Reason of Termination" type="text" name="reason"  value={this.state.reason}  onChange={this.handleChange}
										
										/>
										{this.validator.message('reason', this.state.reason, 'required')}
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

export default withStyles(styles, { withTheme: true })(Termination);