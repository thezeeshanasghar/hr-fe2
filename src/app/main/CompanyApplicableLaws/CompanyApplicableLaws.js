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
import { Lookups } from '../../services/constant/enum'
import axios from "axios";
//import toastr from 'toastr';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import SimpleReactValidator from 'simple-react-validator';
import defaultUrl from "../../../app/services/constant/constant";
import Messages from '../toaster';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import DataTable from "datatables.net";
import * as responsive from "datatables.net-responsive";
import _Select from 'react-select';
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
		<Typography component="div" dir={dir} style={{ padding: 8 * 3,height:"100vh" }}>
			{children}
		</Typography>
	);
}
let id = 0;
function createData(Description, CountryCode) {
	id += 1;
	return { Description, CountryCode };
}

const rows = [
	createData('Law-1', 'Pk')

];

class CompanyApplicableLaws extends Component {
	state = {
		value: 0,
		code: '',
		countryCode: [],
		CurrencyList: [],
		Currency: '',
		mode: '',
		adultAge: '',
		minSalary: '',
		maxSalary: '',
		percentage: '',
		type: '',
		typeList: [],
		modeList: [],
		adultAge: '',
		description: '',
		Id: 0,
		Action: "Insert Record",
		CountryLaws: [],
		table: null,
		Discount:"",
		TaxAmount:"",
		NoCarryForward:"",
		Lumpsum:"",
		PaidWithIn:"",
		DeclarationMode:"",
		declarationModelList:[],
		Companies:[],
		CompanyId:"",
		LawsList:[],
		LawId:"",
		deductinoType:"",
		fixedAmount:"",
		PayElementList:[],
		PayElementSelected:"",
		PayElement:"",
		CompanyCut:"",
		EmployeeCut:"",
		LawType:"",
		LawValue:""

	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();

	}
	componentDidMount() {
		localStorage.removeItem("ids");
		this.getCompanyDetail();
	}
	
	getCompanyDetail = () => {

		axios({
			method: "get",
			url: defaultUrl + "company",
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

	handleTabChange = (event, value) => {
		this.setState({ value });
		this.setState({ [event.target.name]: event.target.value });

	};
	handleChange = (e) => {
		if(e.target.name=="LawId" && e.target.value != ""){
			console.log(e)
			var array=JSON.parse(e.target.value);

			this.setState({"LawId":Number(array[0]),"LawValue":e.target.value,"LawType":Number(array[1])});
		}else if(e.target.name=="LawId" && e.target.value == "")
		{
			this.setState({"LawValue":"","LawType":"" })
		}	
		else{
			
			this.setState({ [e.target.name]: e.target.value});
			console.log(e.target.name, e.target.value);
			if (e.target.name == "CompanyId" && e.target.value != "") {
				this.setState({"LawValue":"","LawType":"" })
				this.countrylawByCompany(e.target.value);
				this.getPayElements(e.target.value);
			}

		}
	};
	
	selection = (id) => {
		console.log("called");
		const checkboxes = document.querySelectorAll('input[name=radio]:checked');
									let values = [];
									checkboxes.forEach((checkbox) => {
										values.push(checkbox.value);
									});
									localStorage.setItem('ids',values);
								}
								getPayElements = (id) => {
									axios({
										method: "get",
										url: defaultUrl + "payelement/Selective/" + id,
										headers: {
											// 'Authorization': `bearer ${token}`,
											"Content-Type": "application/json;charset=utf-8",
										},
									})
										.then((response) => {
											this.setState({ PayElementList: response.data })
										})
										.catch((error) => {
											//console.log(error);
										})
								}
	countrylawByCompany = (Id) => {

		axios({
			method: "get",
			url: defaultUrl + "countrylaw/ByCompany/" + Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ LawsList: response.data.data });
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
	getCurrency = () => {
		axios({
			method: "get",
			url: defaultUrl + "lookups/" + Lookups.Currency,
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
	getMode = () => {
		axios({
			method: "get",
			url: defaultUrl + "lookups/" + Lookups.mode,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ modeList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}

	getType = () => {
		axios({
			method: "get",
			url: defaultUrl + "lookups/" + Lookups.lawtypes,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ typeList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}

	InsertUpdateCompanyApplicableLaws = () => {
		
			if (!this.validator.fieldValid('CompanyId') || !this.validator.fieldValid('LawId') ) {
			
				this.validator.showMessages();
				this.forceUpdate();
				return false;
			}
			if(this.state.LawType==="43")
			{
			}
			else
			{
				
				if (!this.validator.fieldValid('CompanyId') || !this.validator.fieldValid('LawId') || this.validator.fieldValid('CompanyCut') 
				|| !this.validator.fieldValid('EmployeeCut') || !this.validator.fieldValid('deductinoType') ) {
					this.validator.showMessages();
					this.forceUpdate();
					return false;
				}
			}

			if(this.state.deductinoType==="Fixed"){
				if (!this.validator.fieldValid('fixedAmount') ) {
					this.validator.showMessages();
					this.forceUpdate();
					return false;
				}
			}else{
				if (!this.validator.fieldValid('PayElement') ) {
					this.validator.showMessages();
					this.forceUpdate();
					return false;
				}
			}
		

		// PayElement,
		// CompanyCut,
		// EmployeeCut,
		// LawType,
		// LawValue

		// if (!this.validator.allValid()) {
		// 	this.validator.showMessages();
		// 	this.forceUpdate();
		// } else {

		// 	var method = "post";
		// 	var url = defaultUrl + "countrylaw";
		// 	if (this.state.Action != "Insert Record") {
		// 		method = "put";
		// 		url = defaultUrl + "countrylaw/" + this.state.Id;
		// 	}

		// 	var obj = {
		// 		Detail: this.state.description,
		// 		CountryCode: this.state.code,
		// 		Currency: this.state.Currency,
		// 		AdultAge: this.state.adultAge,
		// 		CalculationMode: this.state.mode,
		// 		MaxSalary: this.state.maxSalary,
		// 		MinSalary: this.state.minSalary,
		// 		Percentage: this.state.percentage,
		// 		Type: this.state.type,
		// 		Discount:this.state.Discount,
		// 		TaxAmount:this.state.TaxAmount,
		// 		NoCarryForward:this.state.NoCarryForward,
		// 		Lumpsum:this.state.Lumpsum,
		// 		PaidWithIn:this.state.PaidWithIn,
		// 		DeclarationMode:this.state.DeclarationMode,
		// 	};
		// 	//document.getElementById("fuse-splash-screen").style.display = "block";
		// 	axios.interceptors.request.use(function (config) {
		// 		// document.getElementsByClassName("loader-wrapper")[0].style.display="block"
		// 		return config;
		// 	}, function (error) {
		// 		console.log('Error');
		// 		return Promise.reject(error);
		// 	});
		// 	axios({
		// 		method: method,
		// 		url: url,
		// 		data: JSON.stringify(obj),
		// 		headers: {
		// 			// 'Authorization': `bearer ${token}`,
		// 			"Content-Type": "application/json;charset=utf-8",
		// 		},
		// 	})
		// 		.then((response) => {
		// 			toast.success('Operation successfull');
		// 			this.getCountryLaw();
		// 			this.setState({
		// 				description: "",
		// 				code: "",
		// 				Currency: "",
		// 				adultAge: "",
		// 				mode: "",
		// 				maxSalary: "",
		// 				minSalary: "",
		// 				percentage: "",
		// 				type: "",
		// 				Action: "Insert Record",
		// 				Id: 0,
		// 				value: 0,
		// 				Discount:"",
		// 				TaxAmount:"",
		// 				NoCarryForward:"",
		// 				Lumpsum:"",
		// 				PaidWithIn:"",
		// 				DeclarationMode:"",
		// 			});
		// 			//document.getElementById("fuse-splash-screen").style.display = "none";
		// 			Messages.success();
		// 		})
		// 		.catch((error) => {
		// 			console.log(error);
		// 			toast.error('Operation unsuccessfull');
		// 			this.setState({
		// 				description: "",
		// 				code: "",
		// 				Currency: "",
		// 				adultAge: "",
		// 				mode: "",
		// 				maxSalary: "",
		// 				minSalary: "",
		// 				percentage: "",
		// 				type: "",
		// 				Action: "Insert Record",
		// 				Id: 0,
		// 				Discount:"",
		// 				TaxAmount:"",
		// 				NoCarryForward:"",
		// 				Lumpsum:"",
		// 				PaidWithIn:"",
		// 				DeclarationMode:"",
		// 			})
		// 			//document.getElementById("fuse-splash-screen").style.display = "none";
		// 			Messages.error();
		// 		})
		// }
	}
	getCountryLawById = () => {
		var ids = localStorage.getItem("ids");
		if (ids === null) {
			Messages.warning("No Record Selected");
			return false;
		}
		//document.getElementById("fuse-splash-screen").style.display = "block";
		axios({
			method: "get",
			url: defaultUrl + "countrylaw/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.setState({
					description: response.data[0].Detail,
					code: response.data[0].CountryCode,
					Currency: response.data[0].Currency,
					adultAge: response.data[0].AdultAge,
					mode: response.data[0].CalculationMode,
					maxSalary: response.data[0].MaxSalary,
					minSalary: response.data[0].MinSalary,
					percentage: response.data[0].Percentage,
					type: response.data[0].Type,
					value: 1,
					Id: response.data[0].Id,
					Action: "Update Record",
					Discount:response.data[0].Discount,
					TaxAmount:response.data[0].TaxAmount,
					NoCarryForward:response.data[0].NoCarryForward,
					Lumpsum:response.data[0].lumpsum,
					PaidWithIn:response.data[0].PaidWithin,
					DeclarationMode:response.data[0].DeclarationMode,
				});
				//document.getElementById("fuse-splash-screen").style.display = "none";
			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display = "none";
			})
	}
	getCountryLaw = () => {
		axios({
			method: "get",
			url: defaultUrl+"countrylaw/",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ CountryLaws: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	deleteCountryLaw = () => {
		let ids = localStorage.getItem("ids");
		if (ids === null || localStorage.getItem("ids").split(",").length > 1) {
			Messages.warning("kindly Select one record");
			return false;
		}
		//document.getElementById("fuse-splash-screen").style.display = "block";
		axios({
			method: "delete",
			url: defaultUrl + "countrylaw/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {

				this.getCountryLaw();
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();
			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.error();
			})
	}
	handlePayelementChange = (e) => {
		var PayElements = "";
		if(!e){
			this.setState({ 'PayElement': "", PayElementSelected: [] });
			return false;
		}
		for (var i = 0; i < e.length; i++) {
			PayElements += e[i].value + ','
		}
		this.setState({ 'PayElement': PayElements.slice(0, -1), PayElementSelected: e.value });
	}
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Company Applicable Laws</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Applicable Law</h4></div>
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
								<Tab label="Add New Laws" />
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
											<Button variant="contained" color="secondary" className={classes.button}  onClick={this.getCountryLawById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button  variant="contained" color="primary" className={classes.button} onClick={this.deleteCountryLaw}>
												Delete
										</Button>
										</div>										
									</div>
									<Table className={classes.table}>
										<TableHead>
											<TableRow>
												<CustomTableCell align="center" >Detail</CustomTableCell>
												<CustomTableCell align="center">CountryCode</CustomTableCell>
												<CustomTableCell align="center">Currency</CustomTableCell>
												<CustomTableCell align="center">StartDate</CustomTableCell>
												<CustomTableCell align="center">EndDate</CustomTableCell>
												<CustomTableCell align="center">AdultAge</CustomTableCell>
												<CustomTableCell align="center">CalculationMode</CustomTableCell>
												<CustomTableCell align="center">MaxSalary</CustomTableCell>
												<CustomTableCell align="center">MinSalary</CustomTableCell>
												<CustomTableCell align="center">Percentage</CustomTableCell>		
												<CustomTableCell align="center">Type</CustomTableCell>	
												<CustomTableCell align="center">Action</CustomTableCell>														
											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.CountryLaws.map(row => (
												<TableRow className={classes.row} key={row.Code}>
													<CustomTableCell align="center">{row.Detail}</CustomTableCell>
													<CustomTableCell align="center">{row.CountryCode}</CustomTableCell>
													<CustomTableCell align="center">{row.Currency}</CustomTableCell>
													<CustomTableCell align="center">{row.StartDate}</CustomTableCell>
													<CustomTableCell align="center">{row.EndDate}</CustomTableCell>
													<CustomTableCell align="center">{row.AdultAge}</CustomTableCell>
													<CustomTableCell align="center">{row.CalculationMode}</CustomTableCell>
													<CustomTableCell align="center">{row.MaxSalary}</CustomTableCell>
													<CustomTableCell align="center">{row.MinSalary}</CustomTableCell>
													<CustomTableCell align="center">{row.Percentage}</CustomTableCell>
													<CustomTableCell align="center">{row.Type}</CustomTableCell>
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
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}    >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Company </InputLabel>
											<Select
												value={this.state.CompanyId}
												onChange={this.handleChange}
												inputProps={{
													name: 'CompanyId',
													id: 'CompanyId',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.Companies.map(row => (
													<MenuItem countrycode={row.CountryCode} value={row.Id}>{row.CompanyName}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('CompanyId', this.state.CompanyId, 'required')}

									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}>
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="mode">Country Law</InputLabel>
											<Select
												value={this.state.LawValue}
												onChange={this.handleChange}
												inputProps={{
													name: 'LawId',
													id: 'LawId',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.LawsList.map(row => (
													<MenuItem  value={JSON.stringify([row.Id,row.Type])} >{row.Detail}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('LawId', this.state.LawId, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} className={this.state.LawType=="42"?"":"d-none"} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="mode">Deduction Type</InputLabel>
											<Select
												value={this.state.deductionType}
												onChange={this.handleChange}
												inputProps={{
													name: 'deductionType',
													id: 'deductionType',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												<MenuItem value="Fixed">
													<em>Fixed</em>
												</MenuItem>
												<MenuItem value="PayElement">
													<em>PayElement</em>
												</MenuItem>
												
											</Select>
										</FormControl>
										{this.validator.message('deductionType', this.state.deductionType, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  style={{ marginRight: '5px' }} className={this.state.LawType=="42" && this.state.deductionType=="Fixed"?"":"d-none"} >
										<TextField
											id="fixedAmount"
											label="Fixed Amount"
											fullWidth
											type="number"
											name="fixedAmount"
											className={classes.textField}
											value={this.state.fixedAmount}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('fixedAmount', this.state.fixedAmount, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} className={this.state.LawType =="42"?"":"d-none"} >
										<TextField
											id="CompanyCut"
											label="Company(%)"
											fullWidth
											type="number"
											name="CompanyCut"
											className={classes.textField}
											value={this.state.CompanyCut}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('CompanyCut', this.state.CompanyCut, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  className={this.state.LawType=="42"?"":"d-none"} >
										<TextField
											id="EmployeeCut"
											label="Employee(%)"
											fullWidth
											type="number"
											name="EmployeeCut"
											className={classes.textField}
											value={this.state.EmployeeCut}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('EmployeeCut', this.state.EmployeeCut, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  className={this.state.LawType=="42" && this.state.deductionType=="PayElement"?"":"d-none"}>
										<FormControl className={classes.formControl}>
											<_Select
												isMulti
												name='PayElement'
												id='PayElement'
												placeholder="Select Pay Element"
												options={this.state.PayElementList}
												className="basic-multi-select"
												classNamePrefix="select"
												value={this.state.PayElementSelected}
												onChange={this.handlePayelementChange}
											/>
											{this.validator.message('PayElement', this.state.PayElement, 'required')}

										</FormControl>

									</Grid>
									</form>
								<div className="row">
									<Grid item xs={12} sm={10} >
										<div style={{ float: "right", "marginRight": "8px" }}>

											<Button variant="outlined" color="secondary" className={classes.button} onClick={this.InsertUpdateCompanyApplicableLaws} >
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

export default withStyles(styles, { withTheme: true })(CompanyApplicableLaws);