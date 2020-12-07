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
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Icon, Input, MuiThemeProvider } from '@material-ui/core';
import SimpleReactValidator from 'simple-react-validator';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import { Lookups } from '../../services/constant/enum'
import defaultUrl from "../../services/constant/constant";
import moment from 'moment';
import Messages from '../toaster';
import { ToastContainer, toast } from 'react-toastify';

import $ from 'jquery';
import DataTable from "datatables.net";
import * as responsive from "datatables.net-responsive";
//import Collapsible from 'react-collapsible';

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
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
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
let id = 0;
function createData(Cnic, Name, Email, Unit, position) {
	id += 1;
	return { Cnic, Name, Email, Unit, position };
}

class EmployeeDetail extends Component {
	state = {
		value: 0,
		Employee: {},
		table: null
		// Id: 0,
		// Action: "Insert Record"
	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
	}
	componentDidMount() {
		var url = window.location.href.split('/')[4];
		this.getEmployeeById(url);

	}
	deleteRow = (element) => {
		console.log(element);
		this.setState({ PayRoll: this.state.PayRoll.filter(x => x.PayElement != element) })
	}


	handleTabChange = (event, value) => {

		this.setState({ value });
		this.setState({ [event.target.name]: event.target.value });

	};

	nextTab = (val) => {
		this.setState({ value: val });
	}

	getEmployeeById = (id) => {

		axios({
			method: "get",
			url: defaultUrl + "/employee/details/" + id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.setState({
					Employee: response.data,
					// Action: "Update Record",
					// Id: response.data[0].Id,

				});
				document.getElementById("fuse-splash-screen").style.display = "none";
				console.log(response.data)
				// employee detail table start
				this.state.table = $('#employeedetail_Table').DataTable({
					data: [response.data],
					"columns": [
						{ "data": "FirstName" },
						{ "data": "LastName" },
						{ "data": "DOB" },
						{ "data": "HireDate" },
						{ "data": "HireReason" },
						{ "data": "ServiceStartDate" },
						{ "data": "ProbationEndDate" },
						{ "data": "PartTimePercentage" },
						{ "data": "Positions" },
						{ "data": "Grade" },
						{ "data": "Address" },
						{ "data": "Contact" },
						{ "data": "ContractEndDate" },
						{ "data": "CompanyName" },
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

				// employee banl table start 
				this.state.table = $('#employebank_Table').DataTable({
					data: response.data.EmployeeBankAccount,
					"columns": [
						{ "data": "CompanyId" },
						{ "data": "BankId" },
						{ "data": "IBAN" },
						{ "data": "EffectiveDate" },
						{ "data": "IsPrimary" },
						{ "data": "CurrencyCode" },
						{ "data": "EmployeeId" }
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
			})
			.catch((error) => {
				console.log(error);
				document.getElementById("fuse-splash-screen").style.display = "none";

			})
	}
	getEmployeeBankById = (EmployeeId) => {
		axios({
			method: "get",
			url: defaultUrl + "/BankAccount/ByEmployee/" + EmployeeId,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.setState({
					Bank: response.data[0].BankId,
					Currency: response.data[0].CurrencyCode,
					IBAN: response.data[0].IBAN,
					IsPrimary: response.data[0].IsPrimary,
					EffectiveDate: moment(response.data[0].EffectiveDate).format('YYYY-MM-DD'),
				})
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getEmployeePayRollById = (EmployeeId) => {
		axios({
			method: "get",
			url: defaultUrl + "/Employee/PayRoll/" + EmployeeId,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.setState({
					PayRoll: response.data
				})
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getApplicableLaws = (EmployeeId) => {
		axios({
			method: "get",
			url: defaultUrl + "/Employee/ApplicableLaw/" + EmployeeId,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.setState({
					selectedLaws: response.data
				})
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getEmployeeDetailsForEdit = (Id) => {
		console.log(Id);
		this.getEmployeeById(Id);
		this.getEmployeeBankById(Id);
		this.getEmployeePayRollById(Id);
		this.getApplicableLaws(Id);
	}

	render() {
		const { classes, theme } = this.props;


		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				// header={
				// 	<div className="p-24"><h4>Employee Detail</h4></div>
				// }

				content={

					<div className={classes.root}>
						<div style={{ borderBottom: "solid 1px black" }} ></div>
						<h1 style={{ textAlign: "center" }}>Basic Information</h1>
						<div style={{ borderBottom: "solid 1px black" }} ></div>
						<form className={classes.container} style={{ textAlign: "center" }} noValidate autoComplete="off">
							<Grid item xs={4} sm={4}  >
								<h2>FirstName</h2>
								<label>{this.state.Employee.FirstName}</label>
							</Grid>
							<Grid item xs={4} sm={4}  >
								<h2>LastName</h2>
								<label>{this.state.Employee.LastName}</label>
							</Grid>
							<Grid item xs={4} sm={4}  >
								<h2>Cnic</h2>
								<label>{this.state.Employee.Cnic}</label>
							</Grid>

							<Grid item xs={4} sm={4}  >
								<h2>Contact</h2>
								<label>{this.state.Employee.Contact}</label>
							</Grid>
							<Grid item xs={4} sm={4}  >
								<h2>Address</h2>
								<label>{this.state.Employee.Address}</label>
							</Grid>
							<Grid item xs={4} sm={4}  >
								<h2>DOB</h2>
								<label>{this.state.Employee.DOB}</label>
							</Grid>

							<Grid item xs={4} sm={4}  >
								<h2>Insurance Id</h2>
								<label>{this.state.Employee.InsuranceId}</label>
							</Grid>
							<Grid item xs={4} sm={4}  >
								<h2>Taxation Id</h2>
								<label>{this.state.Employee.TaxationId}</label>
							</Grid>
							<Grid item xs={4} sm={4}  >
								<h2>Hire Date</h2>
								<label>{this.state.Employee.HireDate}</label>
							</Grid>

							<Grid item xs={4} sm={4}  >
								<h2>Probation End Date</h2>
								<label>{this.state.Employee.ProbationEndDate}</label>
							</Grid>
							<Grid item xs={4} sm={4}  >
								<h2>Service Start Date</h2>
								<label>{this.state.Employee.ServiceStartDate}</label>
							</Grid>
							<Grid item xs={4} sm={4}  >
								<h2>Contract End Date</h2>
								<label>{this.state.Employee.ContractEndDate}</label>
							</Grid>
						</form>

						<Paper className={classes.root}>

							<div style={{ borderBottom: "solid 1px black" }} ></div>
							<h1 style={{ textAlign: "center" }} >Bank Details</h1>
							<div style={{ borderBottom: "solid 1px black" }} ></div>
							<Table className={classes.table}>
								<TableHead>
									<TableRow>
										<CustomTableCell align="center"  >Bank</CustomTableCell>
										<CustomTableCell align="center"  >IBAN</CustomTableCell>
										<CustomTableCell align="center"  >Effective Date</CustomTableCell>

									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.Employee.EmployeeBankAccount == null ? '' : this.state.Employee.EmployeeBankAccount.map(row => (
										<TableRow className={classes.row} key={row.Id}>

											<CustomTableCell align="center"  >{row.BankName}</CustomTableCell>
											<CustomTableCell align="center"  >{row.IBAN}</CustomTableCell>
											<CustomTableCell align="center"  >{row.EffectiveDate}</CustomTableCell>

										</TableRow>
									))}
								</TableBody>
							</Table>

							<div style={{ borderBottom: "solid 1px black" }} ></div>
							<h1 style={{ textAlign: "center" }} >OneTime PayElements</h1>
							<div style={{ borderBottom: "solid 1px black" }} ></div>
							<Table className={classes.table}>
								<TableHead>
									<TableRow>
										<CustomTableCell align="center"  >Code</CustomTableCell>
										<CustomTableCell align="center"  >IBAN</CustomTableCell>
										<CustomTableCell align="center"  >Effective Date</CustomTableCell>
										<CustomTableCell align="center"  >Payment Date</CustomTableCell>

									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.Employee.OnetimeElement == null ? '' : this.state.Employee.OnetimeElement.map(row => (
										<TableRow className={classes.row} key={row.Id}>

											<CustomTableCell align="center"  >{row.Code}</CustomTableCell>
											<CustomTableCell align="center"  >{row.Amount}</CustomTableCell>
											<CustomTableCell align="center"  >{row.EffectiveDate}</CustomTableCell>
											<CustomTableCell align="center"  >{row.PaymentDate == null ? "-" : row.PaymentDate}</CustomTableCell>

										</TableRow>
									))}
								</TableBody>
							</Table>

							<div style={{ borderBottom: "solid 1px black" }} ></div>
							<h1 style={{ textAlign: "center" }} >Periodic PayElements</h1>
							<div style={{ borderBottom: "solid 1px black" }} ></div>
							<Table className={classes.table}>
								<TableHead>
									<TableRow>
										<CustomTableCell align="center"  >Code</CustomTableCell>
										<CustomTableCell align="center"  >Amount</CustomTableCell>
										<CustomTableCell align="center"  >Start Date</CustomTableCell>
										<CustomTableCell align="center"  >End Date</CustomTableCell>
										<CustomTableCell align="center"  >Payment Date</CustomTableCell>

									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.Employee.PeriodicPayElements == null ? '' : this.state.Employee.PeriodicPayElements.map(row => (
										<TableRow className={classes.row} key={row.Id}>

											<CustomTableCell align="center"  >{row.Code}</CustomTableCell>
											<CustomTableCell align="center"  >{row.amount}</CustomTableCell>
											<CustomTableCell align="center"  >{row.StartDate}</CustomTableCell>
											<CustomTableCell align="center"  >{row.EndDate}</CustomTableCell>
											<CustomTableCell align="center"  >{row.PaymentDate == null ? "-" : row.PaymentDate}</CustomTableCell>

										</TableRow>
									))}
								</TableBody>
							</Table>
							<div style={{ borderBottom: "solid 1px black" }} ></div>
							<h1 style={{ textAlign: "center" }} >Payment Details</h1>
							<div style={{ borderBottom: "solid 1px black" }} ></div>

							<Table className={classes.table}>
								<TableHead>
									<TableRow>
										<CustomTableCell align="center"  >Payable</CustomTableCell>
										<CustomTableCell align="center"  >Tax deductions</CustomTableCell>
										<CustomTableCell align="center"  >Leave deductions</CustomTableCell>
										<CustomTableCell align="center"  >Paid</CustomTableCell>
										<CustomTableCell align="center"  >Type</CustomTableCell>

									</TableRow>
								</TableHead>
								{this.state.Employee.Payments == null ? '' : this.state.Employee.Payments.map(row => (



									<TableBody>

										<TableRow className={classes.row} key={row.Id}>

											<CustomTableCell align="center"  >{row.paid}</CustomTableCell>
											<CustomTableCell align="center"  >{row.taxdeduction}</CustomTableCell>
											<CustomTableCell align="center"  >{row.leavededuct}</CustomTableCell>
											<CustomTableCell align="center"  >{row.PayMonth}</CustomTableCell>
											<CustomTableCell align="center"  >{row.PayRollType}</CustomTableCell>

										</TableRow>

									</TableBody>

								))}
							</Table>
						</Paper>
					</div>
				}
			/>
		)
	}
}
export default withStyles(styles, { withTheme: true })(EmployeeDetail);