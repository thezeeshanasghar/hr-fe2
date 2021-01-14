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
function createData(Code, Description, Group, Increment, Periodicity, Currency, Lumpsum, NoofDays, ofMonth) {
	id += 1;
	return { Code, Description, Group, Increment, Periodicity, Currency, Lumpsum, NoofDays, ofMonth };
}

const rows = [
	createData("Code", "Desc", "Group1", "5000", "true", "usd", "false", "22", "jan")
];

class PayElement extends Component {
	state = {
		value: 0,
		labelWidth: 0,
		Periodicity:"",
		code:"",
		description:"",
		group:"",
		increment:"",
		lumpsum:"",
		currency:"",
		days:"",
		month:"",
		company:"",
		companies:[],
		groupList:[],
		daysList:[],
		monthList:[],
		PeriodicityList:[],
		currencyList:[],
		payElements:[],
		Id:0,
		Action:"Insert Record",
		table:null,
		Frequency:"",
		Default:localStorage.getItem("state")!=null?JSON.parse(localStorage.getItem("state")):null,
		EntitlementList:[]
		
	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();

	}
	componentDidMount() {
		this.getCompanies();
		this.getGroup();
		this.getDays();
		this.getMonth();
		this.getPeriodicity();
		this.getCurrency();
		this.getPayElement();
		this.getEntitlement();
		
	}
	getGroup=()=>{
		axios({
			method: "get",
			url: defaultUrl + "lookups/"+Lookups.Group,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ groupList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getCurrency=()=>{
		axios({
			method: "get",
			url: defaultUrl + "lookups/"+Lookups.Currency,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ currencyList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getDays=()=>{
		axios({
			method: "get",
			url: defaultUrl + "lookups/"+Lookups.days,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ daysList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getMonth=()=>{
		axios({
			method: "get",
			url: defaultUrl + "lookups/"+Lookups.month,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ monthList: response.data });
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
	getEntitlement=()=>{
		axios({
			method: "get",
			url: defaultUrl + "lookups/"+Lookups.Entitlement,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ EntitlementList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getCompanies = () => {
		axios({
			method: "get",
			url: defaultUrl + "Company",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ companies: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	insertUpdatePayElement= () => {
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			this.forceUpdate();
		} else {
			var method = "post";
			var url = defaultUrl+"payelement";
			if(this.state.Action !="Insert Record")
			{
				 method = "put";
				 url = defaultUrl+"payelement/"+this.state.Id;
			}
			// console.log(this.state.company,this.state.employee,this.state.dateFrom,this.state.dateTo);
			var obj = {
				Periodicity:this.state.Periodicity,
				Code:this.state.code,
				Description:this.state.description,
				GroupId:this.state.group,
				Increment:this.state.increment,
				lumpsum:this.state.lumpsum,
				CurrencyCode:this.state.currency,
				noofDays:this.state.days,
				ofMonth:this.state.month,
				CompanyId:this.state.company,
				Frequency:this.state.Frequency
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
					this.getPayElement();
				
					this.setState({
						Periodicity:"",
						code:"",
						description:"",
						group:"",
						increment:"",
						lumpsum:"",
						currency:"",
						days:"",
						month:"",
						company:"",
						Id: 0,
						Action:'Insert Record',
						value:0,
						Frequency:""
					});
					//document.getElementById("fuse-splash-screen").style.display="none";
					Messages.success();

				})
				.catch((error) => {
					console.log(error);
					toast.error('Operation unsuccessfull');
					this.setState({
						Periodicity:"",
						code:"",
						description:"",
						group:"",
						increment:"",
						lumpsum:"",
						currency:"",
						days:"",
						month:"",
						company:"",
						Id: 0,
						Action:'Insert Record',
						value:0,
						Frequency:""
					})
					//document.getElementById("fuse-splash-screen").style.display="none";
					Messages.error(error.message);

				})


		}
	}
	getPayElement = () => {
		if(this.state.Default == null){
			return false;
		}
		axios({
			method: "get",
			url: defaultUrl + "/payelement/ByCompany/"+this.state.Default.Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ payElements: response.data });
			
			})
			.catch((error) => {
				console.log(error);
			})
		// localStorage.removeItem("ids");
		// if (!$.fn.dataTable.isDataTable('#payelement_Table')) {
		// 	this.state.table = $('#payelement_Table').DataTable({
		// 		ajax: defaultUrl + "payelement",
		// 		"columns": [
		// 			{ "data": "Code" },
		// 			{ "data": "Description" },
		// 			{ "data": "GroupId" },
		// 			{ "data": "Periodicity" },
		// 			{ "data": "CurrencyCode" },
		// 			{ "data": "lumpsum" },
		// 			{ "data": "noofDays" },
		// 			{ "data": "ofMonth" },
		// 			{ "data": "CompanyId" },
		// 			{ "data": "Increment" },
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
	getPayElementById = () => {
		let ids = localStorage.getItem("ids")
		if(ids=== null || localStorage.getItem("ids").split(",").length>1)
		{
			Messages.warning("kindly Select one record");
			return false;	
		}
		//document.getElementById("fuse-splash-screen").style.display="block";

		axios({
			method: "get",
			url: defaultUrl+"payelement/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				
				this.setState({
					Periodicity : response.data[0].Periodicity,
					code : response.data[0].Code,
					description : response.data[0].Description,
					group : response.data[0].GroupId,
					increment : response.data[0].Increment,
					lumpsum : response.data[0].lumpsum,
					currency : response.data[0].CurrencyCode,
					days : response.data[0].noofDays,
					month : response.data[0].ofMonth,
					company : response.data[0].CompanyId,
					value :  1,
					Id : response.data[0].Id,
					Action : "Update Record",
					Frequency:response.data[0].Frequency
				});
				//document.getElementById("fuse-splash-screen").style.display="none";

			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display="none";

			})
	}
	deletePayElement =()=>{
		var ids=localStorage.getItem("ids");
		if(ids===null)
		{
		Messages.warning("No Record Selected");
		return false;
		}
		//document.getElementById("fuse-splash-screen").style.display="block";

		axios({
			method: "delete",
			url: defaultUrl+"payelement/"+ids,
			headers: {
			  // 'Authorization': `bearer ${token}`,
			  "Content-Type": "application/json;charset=utf-8",
			},
		  })
			.then((response) => {
				
				this.getPayElement();
				//document.getElementById("fuse-splash-screen").style.display="none";
				Messages.success();

			})
			.catch((error) => {
				//document.getElementById("fuse-splash-screen").style.display="none";
				console.log(error);
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
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Pay Element-{this.state.Default !=null?this.state.Default.Company:"No Company Selected Yet"}</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New PayElement</h4></div>
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
											<Button variant="contained" color="secondary" className={classes.button} onClick={this.getPayElementById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button  variant="contained" color="primary" className={classes.button} onClick={this.deletePayElement}>
												Delete
										</Button>
										</div>
										
									</div>
								<Table className={classes.table}>
										<TableHead>
											<TableRow>
												<CustomTableCell align="center" >Code</CustomTableCell>
												<CustomTableCell align="center" >Description</CustomTableCell>
												<CustomTableCell align="center" >lumpsum</CustomTableCell>
												<CustomTableCell align="center">Action</CustomTableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{
												this.state.payElements.length>0?
												this.state.payElements.map(row => (
													<TableRow className={classes.row} key={row.Code}>
	
														<CustomTableCell align="center">{row.Code == "" || row.Code == null || row.Code == undefined ? 'N/A' : row.Code}</CustomTableCell>
														<CustomTableCell align="center">{row.Description == "" || row.Description == null || row.Description == undefined ? 'N/A' : row.Description}</CustomTableCell>
														<CustomTableCell align="center">{row.lumpsum == "" || row.lumpsum == null || row.lumpsum == undefined ? 'N/A' : row.lumpsum}</CustomTableCell>
														
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
								<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
									<TextField
										id="outlined-name"
										label="Code"
										className={classes.textField}
										value={this.state.code}
										name="code"
										fullWidth
										onChange={this.handleChange}
										margin="normal"
									/>
									{this.validator.message('code', this.state.code, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
									<TextField
										id="description"
										label="Description"
										className={classes.textField}
										value={this.state.description}
										name="description"
										fullWidth
										onChange={this.handleChange}
										margin="normal"
									/>
									{this.validator.message('description', this.state.description, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="group">Group</InputLabel>
										<Select
											value={this.state.group}
											onChange={this.handleChange}
											inputProps={{
												name: 'group',
												id: 'group',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{this.state.groupList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))} 
										</Select>
										{this.validator.message('group', this.state.group, 'required')}
									</FormControl>
										</Grid>
									<Grid item xs={12} sm={5} >
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="ContractType">Entitlement</InputLabel>
										<Select
											value={this.state.increment}
											onChange={this.handleChange}
											inputProps={{
												name: 'increment',
												id: 'increment',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{this.state.EntitlementList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))} 
										</Select>
									</FormControl>
									{this.validator.message('increment', this.state.increment, 'required')}
									</Grid>
								
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
								<FormControl className={classes.formControl}>
										<InputLabel htmlFor="Periodicity">Periodicity</InputLabel>
										<Select
											value={this.state.Periodicity}
											onChange={this.handleChange}
											inputProps={{
												name: 'Periodicity',
												id: 'Periodicity',
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
									{this.validator.message('Periodicity', this.state.Periodicity, 'required')}
										</Grid>
										<Grid item xs={12} sm={5} >
										<FormControl className={classes.formControl}>
										<InputLabel htmlFor="currency">Currency</InputLabel>
										<Select
											value={this.state.currency}
											onChange={this.handleChange}
											inputProps={{
												name: 'currency',
												id: 'currency',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{this.state.currencyList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))} 
										</Select>
										{this.validator.message('currency', this.state.currency, 'required')}
									</FormControl>
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
									<TextField
										id="lumpsum"
										label="lumpsum"
										name="lumpsum"
										className={classes.textField}
										value={this.state.lumpsum}
										fullWidth
										  onChange={this.handleChange}
										margin="normal"
									/>
									{this.validator.message('lumpsum', this.state.lumpsum, 'required')}
								</Grid>
								<Grid item xs={12} sm={5}  >
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="Days">Days</InputLabel>
										<Select
											value={this.state.days}
											onChange={this.handleChange}
											inputProps={{
												name: 'days',
												id: 'days',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{this.state.daysList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))} 
										</Select>
									</FormControl>
									{this.validator.message('days', this.state.days, 'required')}
								</Grid>
								<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
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
											{this.state.companies.map(row => (
													<MenuItem value={row.Id}>{row.CompanyName}</MenuItem>
												))} 
										</Select>
									</FormControl>
									{this.validator.message('company', this.state.company, 'required')}
										</Grid>
								<Grid item xs={12} sm={5}  >
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="month">Month</InputLabel>
										<Select
											value={this.state.month}
											onChange={this.handleChange}
											inputProps={{
												name: 'month',
												id: 'month',
											}}
										>
											<MenuItem value="">
												<em>None</em>
											</MenuItem>
											{this.state.monthList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))} 
										</Select>
									</FormControl>
									{this.validator.message('month', this.state.month, 'required')}

								</Grid>
								<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
									<TextField
										id="Frequency"
										label="Frequency"
										name="Frequency"
										className={classes.textField}
										value={this.state.Frequency}
										fullWidth
										  onChange={this.handleChange}
										margin="normal"
										type="number"
									/>
									{this.validator.message('Frequency', this.state.Frequency, 'required')}
								</Grid>
								
								</form>
								<div className="row">
								<Grid item xs={12} sm={10}  >
									<div style={{ float: "right", "marginRight": "8px" }}>

										<Button variant="outlined" color="secondary" onClick={this.insertUpdatePayElement} className={classes.button}>
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

export default withStyles(styles, { withTheme: true })(PayElement);