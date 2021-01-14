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
import { Icon, Input, MuiThemeProvider } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import SimpleReactValidator from 'simple-react-validator';
import defaultUrl from "../../services/constant/constant";
import Messages from '../toaster';
import { ToastContainer, toast } from 'react-toastify';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Lookups } from '../../services/constant/enum';
import Divider from '@material-ui/core/Divider';
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
function createData(BankName, Code, Contact, Email, Address, Country) {
	id += 1;
	return { BankName, Code, Contact, Email, Address, Country };
}

const rows = [
	createData('Telenor', '1234', '03143041544', 'chirfan521@gmail.com', 'Islamabad', 'Pakistan'),
	createData('Zong', '3467', '03143041544', 'chirfan521@gmail.com', 'Islamabad', 'Pakistan'),
	createData('Agility', '3456', '03143041544', 'chirfan521@gmail.com', 'Islamabad', 'Pakistan'),
	createData('engro foods', '4567', '03143041544', 'chirfan521@gmail.com', 'Islamabad', 'Pakistan'),
	createData('NCCS', '4567', '03143041544', 'chirfan521@gmail.com', 'Islamabad', 'Pakistan')

];

class Company extends Component {
	state = {
		value: 0,
		Name: '',
		Code: '',
		Contact: '',
		Email: '',
		Address: '',
		CountryCode: '',
		RegistrationNo:"",
		TaxationNo:"",
		SocialSecurityNo:"",
		EOBINo:"",
		Companies: [],
		countryCode:[],
		Id: 0,
		Action: 'Insert Record',
		table: null,
		bankList:[],
		Bank:"",
		currencyList:[],
		Currency:"",
		AccountNo:"",
		payrollformula:"",
		employeePercentage:"",
		companyPercentage:""
	};
	
 
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();

	}

	componentDidMount() {
		localStorage.removeItem("ids");
		this.getCompanyDetail();
		this.getCountry();
		this.getBanks();
		this.getCurrency();
	}

	handleTab = (event, value) => {
		this.setState({ value });
	};
	getBanks = () => {
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
				this.setState({ bankList: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}

	selection = (id) => {
		console.log("called");
		const checkboxes = document.querySelectorAll('input[name=radio]:checked');
									let values = [];
									checkboxes.forEach((checkbox) => {
										values.push(checkbox.value);
									});
									localStorage.setItem('ids',values);
								}
	getCurrency = () => {
		axios({
			method: "get",
			url: defaultUrl+"lookups/"+Lookups.Currency,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ CurrencyList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	
	getCurrency = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.Currency,
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
	getCountry = () => {

		axios({
			method: "get",
			url: defaultUrl + "lookups/" + Lookups.Country,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ countryCode: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};
	getCompanyDetail = () => {
		axios({
			method: "get",
			url: defaultUrl+"Company/",
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
	insertUpdateRecord = () => {
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			this.forceUpdate();
			return false;
		}
		var method = "post";
		var url = defaultUrl + "company";
		if (this.state.Action != "Insert Record") {
			method = "put";
			url = defaultUrl + "company/" + this.state.Id;
		}
		
		var obj = {
			CompanyName: this.state.Name,
			Code: this.state.Code,
			Email: this.state.Email,
			Contact: this.state.Contact,
			CountryCode: this.state.CountryCode,
			Address: this.state.Address,
			RegistrationNo:this.state.RegistrationNo,
			TaxationNo:this.state.TaxationNo,
			SocialSecurityNo:this.state.SocialSecurityNo,
			EOBINo:this.state.EOBINo,
			Bank:this.state.Bank,
			Currency:this.state.Currency,
			AccountNo:this.state.AccountNo,
			payrollformula:this.state.payrollformula,
			companyPercentage:this.state.companyPercentage,
			employeePercentage:this.state.employeePercentage
		};
		axios.interceptors.request.use(function (config) {
			////document.getElementById("fuse-splash-screen").style.display = "block";
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
				this.getCompanyDetail();
				console.log(response);
				this.setState({
					Name: "",
					Code: "",
					Contact: '',
					Email: '',
					Address: '',
					CountryCode: '',
					Action: 'Insert Record',
					Id: 0,
					value: 0,
					RegistrationNo:"",
					TaxationNo:"",
					SocialSecurityNo:"",
					EOBINo:"",
					Bank:"",
					payrollformula:"",
					Currency:"",
					AccountNo:"",
					companyPercentage:"",
					employeePercentage:""
				});
				////document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();
			})
			.catch((error) => {
				console.log(error);
				this.setState({
					Name: "",
					Code: "",
					Contact: '',
					Email: '',
					Address: '',
					CountryCode: '',
					Action: 'Insert Record',
					Id: 0,
					value: 0,
					RegistrationNo:"",
					TaxationNo:"",
					SocialSecurityNo:"",
					EOBINo:"",
					Bank:"",
					payrollformula:"",
					Currency:"",
					AccountNo:"",
					companyPercentage:"",
					employeePercentage:""
				})
				////document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.error();
			});
	}

	deleteCompany = () => {
		var ids = localStorage.getItem("ids");
		if (ids === null) {
			Messages.warning("No Record Selected");
			return false;
		}
		////document.getElementById("fuse-splash-screen").style.display = "block"
		axios({
			method: "delete",
			url: defaultUrl + "company/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.getCompanyDetail();
				////document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();
			})
			.catch((error) => {
				console.log(error);
				////document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.error();
			})
	}

	getCompanyById = () => {
		let ids = localStorage.getItem("ids");
		if (ids === null || localStorage.getItem("ids").split(",").length > 1) {
			Messages.warning("kindly Select one record");
			return false;
		}
		////document.getElementById("fuse-splash-screen").style.display = "block"

		axios({
			method: "get",
			url: defaultUrl + "company/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response.data);
				if(response.data)
				{
					this.setState({
						Action: 'Update Record', value: 1, Name: response.data[0].CompanyName, Code: response.data[0].Code, Address: response.data[0].Address,
						Id: response.data[0].Id, Contact: response.data[0].Contact, Email: response.data[0].Email, CountryCode: response.data[0].CountryCode,
						RegistrationNo:response.data[0].RegistrationNo,
						TaxationNo:response.data[0].TaxationNo,
						SocialSecurityNo:response.data[0].SocialSecurityNo,
						EOBINo:response.data[0].EOBINo,
						Bank:response.data[0].BankId,
				Currency:response.data[0].CurrencyId,
				AccountNo:response.data[0].AccNo,
				payrollformula:response.data[0].PayrollFormula,
				companyPercentage:response.data[0].EmployeeDeduction,
				employeePercentage:response.data[0].CompanyDeduction
					});
				}
				////document.getElementById("fuse-splash-screen").style.display = "none"
			})
			.catch((error) => {
				console.log(error);
			})
	}
	render() {
		const { classes, theme } = this.props;
		// if (this.state.loading == true)
		return (
			<FusePageSimple

				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Companies</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Company</h4></div>
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
											<Button variant="contained" color="secondary" className={classes.button} onClick={this.getCompanyById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button  variant="contained" color="primary" className={classes.button} onClick={this.deleteCompany}>
												Delete
										</Button>
										</div>										
									</div>


									
									<Table className={classes.table}>
										<TableHead>
											<TableRow>
												<CustomTableCell align="center" >Code</CustomTableCell>
												<CustomTableCell align="center">CompanyName</CustomTableCell>
												<CustomTableCell align="center">BranchCode</CustomTableCell>
												<CustomTableCell align="center">Address</CustomTableCell>
												<CustomTableCell align="center">Contact</CustomTableCell>
												<CustomTableCell align="center">Email</CustomTableCell>
												<CustomTableCell align="center">CountryCode</CustomTableCell>
												<CustomTableCell align="center">TaxationNo</CustomTableCell>
												<CustomTableCell align="center">SocialSecurityNo</CustomTableCell>
												<CustomTableCell align="center">EOBINo</CustomTableCell>		
												<CustomTableCell align="center">Action</CustomTableCell>														
											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.Companies.map(row => (
												<TableRow className={classes.row} key={row.Code}>
													<CustomTableCell align="center">{row.Code}</CustomTableCell>
													<CustomTableCell align="center">{row.CompanyName}</CustomTableCell>
													<CustomTableCell align="center">{row.BranchCode}</CustomTableCell>
													<CustomTableCell align="center">{row.Address}</CustomTableCell>
													<CustomTableCell align="center">{row.Contact}</CustomTableCell>
													<CustomTableCell align="center">{row.Email}</CustomTableCell>
													<CustomTableCell align="center">{row.CountryCode}</CustomTableCell>
													<CustomTableCell align="center">{row.TaxationNo}</CustomTableCell>
													<CustomTableCell align="center">{row.SocialSecurityNo}</CustomTableCell>
													<CustomTableCell align="center">{row.EOBINo}</CustomTableCell>
													<CustomTableCell align="center"><input type="checkbox" name="radio"  value= {row.Id}
						onChange={()=>this.selection(row.Id)}
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
										<TextField id="RegistrationNo" fullWidth label="Registration No" name="RegistrationNo" value={this.state.RegistrationNo} onChange={this.handleChange} />
										{this.validator.message('RegistrationNo', this.state.RegistrationNo, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="TaxationNo" fullWidth label="Taxation No" name="TaxationNo" value={this.state.TaxationNo} onChange={this.handleChange} />
										{this.validator.message('TaxationNo', this.state.TaxationNo, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="RegistrationNo" fullWidth label="Social Security No" name="SocialSecurityNo" value={this.state.SocialSecurityNo} onChange={this.handleChange} />
										{this.validator.message('SocialSecurityNo', this.state.SocialSecurityNo, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="TaxationNo" fullWidth label="EOBINo" name="EOBINo" value={this.state.EOBINo} onChange={this.handleChange} />
										{this.validator.message('EOBINo', this.state.EOBINo, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="Name" fullWidth label="Company Name" name="Name" value={this.state.Name} onChange={this.handleChange} />
										{this.validator.message('Name', this.state.Name, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="Code" fullWidth label="Company Code" name="Code" value={this.state.Code} onChange={this.handleChange} />
										{this.validator.message('Code', this.state.Code, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="Contact" fullWidth label="Contact Number" name="Contact" value={this.state.Contact} onChange={this.handleChange} />
										{this.validator.message('Contact', this.state.Contact, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="Email" fullWidth label="Company Email" name="Email" value={this.state.Email} onChange={this.handleChange} />
										{this.validator.message('Email', this.state.Email, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="Address" fullWidth label="Address" name="Address" value={this.state.Address} onChange={this.handleChange} />
										{this.validator.message('Address', this.state.Address, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
									<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Country Code</InputLabel>
											<Select
												value={this.state.CountryCode}
												onChange={this.handleChange}
												inputProps={{
													name: 'CountryCode',
													id: 'CountryCode',
												}}
											>
												
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.countryCode.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('CountryCode', this.state.CountryCode, 'required')}
									</Grid>
									<Grid item xs={12} sm={10} style={{marginTop:"20px"}}  >
										<div style={{borderBottom:"solid 1px black",borderBottom:"solid 1px black"}}>Bank Detail</div>
									
									</Grid>
									
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
									<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Bank">Bank</InputLabel>
											<Select
												value={this.state.Bank}
												onChange={this.handleChange}
												inputProps={{
													name: 'Bank',
													id: 'Bank',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.bankList.map(row => (
													<MenuItem value={row.Id}>{row.BankName}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('Bank', this.state.Bank, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
									<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Currency</InputLabel>
											<Select
												value={this.state.Currency}
												onChange={this.handleChange}
												inputProps={{
													name: 'Currency',
													id: 'Currency',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.currencyList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('Currency', this.state.Currency, 'required')}
									</Grid>
									
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="Address" fullWidth label="AccountNo" name="AccountNo" value={this.state.AccountNo} onChange={this.handleChange} />
										{this.validator.message('AccountNo', this.state.AccountNo, 'required')}
									</Grid>
								<Grid item xs={12} sm={10} style={{marginTop:"20px"}}  >
										<div style={{borderBottom:"solid 1px black",borderBottom:"solid 1px black"}}>Company Rules</div>
									
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
									<FormControl className={classes.formControl}>
											<InputLabel htmlFor="payrollformula">Payroll Formula</InputLabel>
											<Select
												value={this.state.payrollformula}
												onChange={this.handleChange}
												inputProps={{
													name: 'payrollformula',
													id: 'payrollformula',
												}}
											>
													<MenuItem value="">
													<em>None</em>
												</MenuItem>
												<MenuItem value="1">
													<em>ACTUAL DAYS</em>
												</MenuItem>
												<MenuItem value="2">
													<em>30 days</em>
												</MenuItem>
												<MenuItem value="3">
													<em>12-365</em>
												</MenuItem>
												<MenuItem value="4">
													<em>26 days</em>
												</MenuItem>
												<MenuItem value="5">
													<em>22 days</em>
												</MenuItem>
											
												
												
											</Select>
										</FormControl>
										{this.validator.message('payrollformula', this.state.payrollformula, 'required')}
									</Grid>
									{/* <Grid item xs={12} sm={5}  >
										<TextField id="employeePercentage" type="number" fullWidth label="Social Security(Employee Percentage)" name="employeePercentage" value={this.state.employeePercentage} onChange={this.handleChange} />
										{this.validator.message('employeePercentage', this.state.employeePercentage, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="companyPercentage" type="number" fullWidth label="Social Security(Company Percentage)" name="companyPercentage" value={this.state.companyPercentage} onChange={this.handleChange} />
										{this.validator.message('companyPercentage', this.state.companyPercentage, 'required')}
									</Grid>
								 */}
								</form>
								<div className="row">
									<div style={{ float: "right", "marginRight": "8px" }}>

										<Button variant="outlined" color="secondary" className={classes.button} onClick={this.insertUpdateRecord}>
											{this.state.Action}
										</Button>
									</div>
								</div>
								<div>
								</div>
								

							</TabContainer>
						</SwipeableViews>
					</div>
				}
			/>
		)
	}
}

export default withStyles(styles, { withTheme: true })(Company);