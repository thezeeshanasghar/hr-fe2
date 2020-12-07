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
function createData(Description, CountryCode) {
	id += 1;
	return { Description, CountryCode };
}

const rows = [
	createData('Law-1', 'Pk')

];

class CountryLaws extends Component {
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
		declarationModelList:[]

	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();

	}
	componentDidMount() {
		localStorage.removeItem("ids");
		this.getCountryLaw();
		this.getCountry();
		this.getCurrency();
		this.getMode();
		this.getType();
		this.getDeclarationMode();
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
	getDeclarationMode = () => {

		axios({
			method: "get",
			url: defaultUrl + "lookups/" + Lookups.Declaration,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ declarationModelList: response.data });
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

	InsertUpdateCountryLaw = () => {
		if (!this.validator.allValid()) {
			this.validator.showMessages();
			this.forceUpdate();
		} else {

			var method = "post";
			var url = defaultUrl + "countrylaw";
			if (this.state.Action != "Insert Record") {
				method = "put";
				url = defaultUrl + "countrylaw/" + this.state.Id;
			}

			var obj = {
				Detail: this.state.description,
				CountryCode: this.state.code,
				Currency: this.state.Currency,
				AdultAge: this.state.adultAge,
				CalculationMode: this.state.mode,
				MaxSalary: this.state.maxSalary,
				MinSalary: this.state.minSalary,
				Percentage: this.state.percentage,
				Type: this.state.type,
				Discount:this.state.Discount,
				TaxAmount:this.state.TaxAmount,
				NoCarryForward:this.state.NoCarryForward,
				Lumpsum:this.state.Lumpsum,
				PaidWithIn:this.state.PaidWithIn,
				DeclarationMode:this.state.DeclarationMode,
			};
			//document.getElementById("fuse-splash-screen").style.display = "block";
			axios.interceptors.request.use(function (config) {
				// document.getElementsByClassName("loader-wrapper")[0].style.display="block"
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
					this.getCountryLaw();
					this.setState({
						description: "",
						code: "",
						Currency: "",
						adultAge: "",
						mode: "",
						maxSalary: "",
						minSalary: "",
						percentage: "",
						type: "",
						Action: "Insert Record",
						Id: 0,
						value: 0,
						Discount:"",
						TaxAmount:"",
						NoCarryForward:"",
						Lumpsum:"",
						PaidWithIn:"",
						DeclarationMode:"",
					});
					//document.getElementById("fuse-splash-screen").style.display = "none";
					Messages.success();
				})
				.catch((error) => {
					console.log(error);
					toast.error('Operation unsuccessfull');
					this.setState({
						description: "",
						code: "",
						Currency: "",
						adultAge: "",
						mode: "",
						maxSalary: "",
						minSalary: "",
						percentage: "",
						type: "",
						Action: "Insert Record",
						Id: 0,
						Discount:"",
						TaxAmount:"",
						NoCarryForward:"",
						Lumpsum:"",
						PaidWithIn:"",
						DeclarationMode:"",
					})
					//document.getElementById("fuse-splash-screen").style.display = "none";
					Messages.error();
				})
		}
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
		localStorage.removeItem("ids");
		if (!$.fn.dataTable.isDataTable('#CountryLaw_Table')) {
			this.state.table = $('#CountryLaw_Table').DataTable({
				ajax: defaultUrl + "countrylaw",
				"columns": [
					{ "data": "Detail" },
					{ "data": "CountryCode" },
					{ "data": "Currency" },
					{ "data": "StartDate" },
					{ "data": "EndDate" },
					{ "data": "AdultAge" },
					{ "data": "CalculationMode" },
					{ "data": "MaxSalary" },
					{ "data": "MinSalary" },
					{ "data": "Percentage" },
					{ "data": "Type" },
					{
						"data": "Action",
						sortable: false,
						"render": function (data, type, full, meta) {

							return `<input type="checkbox" name="radio"  value=` + full.Id + `
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
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Country Laws</h4></div>
				}
				contentToolbar={
					<div className="px-24"><h4>Add New Laws</h4></div>
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
									<div className="row">
										<div style={{ float: "left", "marginLeft": "8px", "marginTop": "8px" }}>
											<Button variant="outlined" color="primary" className={classes.button} onClick={this.getCountryLawById}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "marginLeft": "8px", "marginTop": "8px" }}>
											<Button variant="outlined" color="inherit" className={classes.button} onClick={this.deleteCountryLaw}>
												Delete
										</Button>
										</div>
									</div>
									<table id="CountryLaw_Table" className="nowrap header_custom" style={{ "width": "100%" }}>
										<thead>
											<tr>
												<th>Detail</th>
												<th>CountryCode</th>
												<th>Currency</th>
												<th>StartDate</th>
												<th>EndDate</th>
												<th>AdultAge</th>
												<th>CalculationMode</th>
												<th>MaxSalary</th>
												<th>MinSalary</th>
												<th>Percentage</th>
												<th>Type</th>
												<th>Action</th>
											</tr>
										</thead>
									</table>
								</Paper>
							</TabContainer>
							<TabContainer dir={theme.direction}>
								<form className={classes.container} noValidate autoComplete="off">
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}    >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Country Code</InputLabel>
											<Select
												value={this.state.code}
												onChange={this.handleChange}
												inputProps={{
													name: 'code',
													id: 'code',
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
										{this.validator.message('code', this.state.code, 'required')}

									</Grid>

									<Grid item xs={12} sm={5}>
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Currency">Currency Code</InputLabel>
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
												{this.state.CurrencyList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('Currency', this.state.Currency, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}>
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="mode">Calculation Mode</InputLabel>
											<Select
												value={this.state.mode}
												onChange={this.handleChange}
												inputProps={{
													name: 'mode',
													id: 'mode',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.modeList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('mode', this.state.mode, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
										<TextField
											id="adultAge"
											label="Adult Age"
											fullWidth
											type="number"
											name="adultAge"
											className={classes.textField}
											value={this.state.adultAge}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('adultAge', this.state.adultAge, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  style={{ marginRight: '5px' }} >
										<TextField
											id="minSalary"
											label="Min Salary"
											fullWidth
											type="number"
											name="minSalary"
											className={classes.textField}
											value={this.state.minSalary}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('minSalary', this.state.minSalary, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} >
										<TextField
											id="maxSalary"
											label="Max Salary"
											fullWidth
											type="number"
											name="maxSalary"
											className={classes.textField}
											value={this.state.maxSalary}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('maxSalary', this.state.maxSalary, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}>
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="type">Type</InputLabel>
											<Select
												value={this.state.type}
												onChange={this.handleChange}
												inputProps={{
													name: 'type',
													id: 'type',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.typeList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('type', this.state.type, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
										<TextField
											id="percentage"
											label="Percentage"
											fullWidth
											type="number"
											name="percentage"
											className={classes.textField}
											value={this.state.percentage}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('percentage', this.state.percentage, 'required')}
									</Grid>

									<Grid item xs={12} sm={10} >
										<TextField
											id="description"
											label="Law"
											fullWidth
											type="text"
											name="description"
											className={classes.textField}
											value={this.state.description}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('description', this.state.description, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField
											id="Discount"
											label="Discount"
											fullWidth
											type="number"
											name="Discount"
											className={classes.textField}
											value={this.state.Discount}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('Discount', this.state.Discount, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
										<TextField
											id="TaxAmount"
											label="Tax Amount"
											fullWidth
											type="number"
											name="TaxAmount"
											className={classes.textField}
											value={this.state.TaxAmount}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('TaxAmount', this.state.TaxAmount, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}>
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="type">No CarryForward</InputLabel>
											<Select
												value={this.state.NoCarryForward}
												onChange={this.handleChange}
												inputProps={{
													name: 'NoCarryForward',
													id: 'NoCarryForward',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
											
													<MenuItem value="1">Yes</MenuItem>
													<MenuItem value="0">No</MenuItem>
												
											</Select>
										</FormControl>
										{this.validator.message('NoCarryForward', this.state.NoCarryForward, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
										<TextField
											id="Lumpsum"
											label="Lumpsum"
											fullWidth
											type="number"
											name="Lumpsum"
											className={classes.textField}
											value={this.state.Lumpsum}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('Lumpsum', this.state.Lumpsum, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}>
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="type">Declaration Mode</InputLabel>
											<Select
												value={this.state.DeclarationMode}
												onChange={this.handleChange}
												inputProps={{
													name: 'DeclarationMode',
													id: 'DeclarationMode',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
											
													{this.state.declarationModelList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('DeclarationMode', this.state.DeclarationMode, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
										<TextField
											id="PaidWithIn"
											label="PaidWithIn"
											fullWidth
											type="number"
											name="PaidWithIn"
											className={classes.textField}
											value={this.state.PaidWithIn}
											onChange={this.handleChange}
											margin="normal"
										/>
										{this.validator.message('PaidWithIn', this.state.PaidWithIn, 'required')}
									</Grid>
								</form>
								<div className="row">
									<Grid item xs={12} sm={10} >
										<div style={{ float: "right", "marginRight": "8px" }}>

											<Button variant="outlined" color="secondary" className={classes.button} onClick={this.InsertUpdateCountryLaw} >
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

export default withStyles(styles, { withTheme: true })(CountryLaws);