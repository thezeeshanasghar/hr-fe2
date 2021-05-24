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
import defaultUrl from "../../../app/services/constant/constant";
import moment from 'moment';
import Messages from '../toaster';
import { ToastContainer, toast } from 'react-toastify';
import Select1 from 'react-select';

import $ from 'jquery';
import DataTable from "datatables.net";
import * as responsive from "datatables.net-responsive";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
function createData(Cnic, Name, Email, Unit, position) {
	id += 1;
	return { Cnic, Name, Email, Unit, position };
}

const rows = [
	createData('61101345656', 'Salman', 'chirfan521@gmail.com', 'IT', 'Manager'),
	createData('61101345656', 'Salman', 'chirfan521@gmail.com', 'IT', 'Manager'),
	createData('61101345656', 'Salman', 'chirfan521@gmail.com', 'IT', 'Manager'),
	createData('61101345656', 'Salman', 'chirfan521@gmail.com', 'IT', 'Manager'),
	createData('61101345656', 'Salman', 'chirfan521@gmail.com', 'IT', 'Manager'),



];

class Employee extends Component {
	state = {
		firstName: "",
		lastName: "",
		dateOfBirth: "",
		email: "",
		employeeCode: "",
		insuranceId: "",
		texationId: "",
		PartTime: "",
		cnic: "",
		value: 0,
		Gender: '',
		Status: '',
		Country: '',
		ContractType: '',
		EmployeeStatus: '',
		company: "",
		Position: "",
		grade: "",
		Bank: "",
		Currency: "",
		PaymentMethod: "",
		SalaryStatus: "",
		PayElement: "",
		amount: "",
		PayRollCurrency: "",
		payrollStartDate: "",
		payrollEndDate: "",
		IBAN: "",
		IsPrimary: "",
		EffectiveDate: "",
		HireDate: "",
		reason: "",
		ServiceStartDate: "",
		ProbationEndDate: "",
		parttimepercentage: "",
		ContractEndDate: "",
		Address: "",
		Contact: "",
		title: "",
		frequency: "",
		entitlement: "",
		oneTimePayElement: "",
		oneTimeEntitlement: "",
		oneTimeAmount: "",
		oneTimeDate: "",
		oneTimeCurrency: "",
		Companies: [],
		companyList: [],
		genderList: [],
		countryList: [],
		maritallist: [],
		contractTypeList: [],
		statusList: [],
		currencyList: [],
		parttimeList: [],
		positionList: [],
		gradeList: [],
		salaryStatusList: [],
		paymentmethodList: [],
		socialList: [],
		taxationList: [],
		bankList: [],
		payElements: [],
		PayRoll: [],
		TitleList: [],
		employeeList: [],
		lawsList: [],
		lawId: "",
		selectedLaws: [],
		entitlementList: [],
		oneTimePayRoll: [],
		Id: 0,
		companyListsel: [],
		companyIdsel: "",
		CompanySelected: "",
		Action: "Insert Record",
		Default: localStorage.getItem("state") != null ? JSON.parse(localStorage.getItem("state")) : null,
		SocialSecurityApplicable: true,
		TaxationApplicable: true,
		CompanyBank:[],
		PayFrom:0
	};
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
	}
	componentDidMount() {
		localStorage.removeItem("ids");
		this.getGender();
		this.getCountry();
		this.getMaritalStatus();
		this.getContractType();
		this.getEmployeeStatus();
		this.getPartTime();
		this.getCompanyDetail();
		this.getCurrency();
		this.getSalaryStatus();
		this.getPaymentMethod();
		this.getBanks();
		this.getTitle();
		this.getEmployeeList(0);
		this.getCountryLaws();
		this.getEntitlement();
		this.getselectiveCompanyDetail();
	}
	deleteRow = (element) => {
		console.log(element);
		this.setState({ PayRoll: this.state.PayRoll.filter(x => x.Id != element) })
	}
	deleteoneTimeRow = (element) => {

		this.setState({ oneTimePayRoll: this.state.oneTimePayRoll.filter(x => x.Id != element) })
	}
	AddPayRoll = () => {
		if (!this.validator.fieldValid('payrollEndDate') ||
			!this.validator.fieldValid('payrollStartDate') ||
			!this.validator.fieldValid('PayRollCurrency') ||
			!this.validator.fieldValid('amount') ||
			!this.validator.fieldValid('PayElement') ||
			!this.validator.fieldValid('frequency') ||
			!this.validator.fieldValid('entitlement')
		) {
			this.validator.showMessages();
			this.forceUpdate();
			return false;
		}
		let list = this.state.PayRoll;
		let count = list.filter(x => x.PayElement == this.state.PayElement).length;

		if (count > 0) {
			this.setState({ PayRoll: list, PayElement: "", amount: "", payrollStartDate: "", payrollEndDate: "", frequency: "", entitlement: "" })
			return false;
		}

		list.push({
			PayElementId: this.state.PayElement,
			amount: this.state.amount,
			Currency: this.state.PayRollCurrency,
			StartDate: this.state.payrollStartDate,
			EndDate: this.state.payrollEndDate,
			frequency: this.state.frequency,
			entitlement: this.state.entitlement
		});

		this.setState({ PayRoll: list, PayElement: "", amount: "", payrollStartDate: "", payrollEndDate: "" })
	}

	addLaw = () => {
		if (!this.validator.fieldValid('lawId')) {
			this.validator.showMessages();
			this.forceUpdate();
			return false;
		}
		var array = [];
		array = this.state.selectedLaws;
		let count = array.filter(x => x.LawId == this.state.lawId).length;
		if (!(count > 0)) {
			array.push({
				LawId: this.state.lawId
			})
			console.log(array);
			this.setState({ selectedLaws: array });
		}
	}
	deleteLawRow = (id) => {
		this.setState({ selectedLaws: this.state.selectedLaws.filter(x => x.LawId != id) })
	}

	handleTabChange = (event, value) => {
		if (this.state.Action == "Insert Record") {
			if ((value == 1 || value == 0)) {
				this.setState({ value });
				this.setState({ [event.target.name]: event.target.value });
			}

		} else {
			this.setState({ value });
			this.setState({ [event.target.name]: event.target.value });
		}


	};
	handleChange = (e) => {
		console.log({ [e.target.name]: e.target.value })
		this.setState({ [e.target.name]: e.target.value });
		if (e.target.name == "company") {
			this.getPosition(e.target.value);
			this.getGrades(e.target.value);
			this.getPayElement(e.target.value);
			this.getCompanyBank(e.target.value);
		}
	};
	getMaritalStatus = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.marital_Status,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ maritallist: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}

	getCompanyBank = (Id) => {
		axios({
			method: "get",
			url: defaultUrl + "/Company/Banks/" + Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ CompanyBank: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}

	getGender = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.gender,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ genderList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getCountry = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.Country,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ countryList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getContractType = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.Contract_Type,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ contractTypeList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getEmployeeStatus = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.EmployeeStatus,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ statusList: response.data });
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
	getSalaryStatus = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.salarystatus,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ salaryStatusList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getPaymentMethod = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.paymentmethod,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ paymentmethodList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getselectiveCompanyDetail = () => {
		axios({
			method: "get",
			url: defaultUrl + "company/Selective/data",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ companyList: response.data });
				return response.data;
			})
			.catch((error) => {
				console.log(error);
			})
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
	getPartTime = () => {

		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.parttime,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ parttimeList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getPosition = (id) => {
		console.log(id);
		axios({
			method: "get",
			url: defaultUrl + "position/ByCompany/" + id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response.data);
				this.setState({
					positionList: response.data
				});

			})
			.catch((error) => {
				console.log(error);
			})
	}
	getGrades = (id) => {

		axios({
			method: "get",
			url: defaultUrl + "Grades/ByCompany/" + id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response.data);
				this.setState({
					gradeList: response.data
				});

			})
			.catch((error) => {
				console.log(error);
			})
	}
	handledropdown = (e) => {
		console.log("working", e.value)
		this.getEmployeeList(e.value)
	}
	getSocialSecurity = (id) => {

		axios({
			method: "get",
			url: defaultUrl + "socialsecurity",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response.data);
				this.setState({
					socialList: response.data
				});

			})
			.catch((error) => {
				console.log(error);
			})
	}
	getTaxation = (id) => {

		axios({
			method: "get",
			url: defaultUrl + "taxation",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response.data);
				this.setState({
					taxationList: response.data
				});

			})
			.catch((error) => {
				console.log(error);
			})
	}
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
	getPayElement = (id) => {
		axios({
			method: "get",
			url: defaultUrl + "payelement/ByCompany/" + id,
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
	}
	AddoneTimePayRoll = () => {
		debugger
		if (!this.validator.fieldValid('oneTimePayElement') ||
			!this.validator.fieldValid('oneTimeEntitlement') ||
			!this.validator.fieldValid('oneTimeDate') ||
			!this.validator.fieldValid('oneTimeAmount') ||
			!this.validator.fieldValid('oneTimeCurrency')
		) {
			this.validator.showMessages();
			this.forceUpdate();
			return false;
		}
		let list = this.state.oneTimePayRoll;
		let count = list.filter(x => x.oneTimePayElement == this.state.oneTimePayElement).length;

		if (count > 0) {
			this.setState({ oneTimePayRoll: list, oneTimePayElement: "", oneTimeEntitlement: "", oneTimeDate: "", oneTimeAmount: "", oneTimeCurrency: "" })
			return false;
		}

		list.push({
			PayelementId: this.state.oneTimePayElement,
			Amount: this.state.oneTimeAmount,
			Currency: this.state.oneTimeCurrency,
			EffectiveDate: this.state.oneTimeDate,
			entitlement: this.state.oneTimeEntitlement
		});

		this.setState({ oneTimePayRoll: list, oneTimePayElement: "", oneTimeEntitlement: "", oneTimeDate: "", oneTimeAmount: "", oneTimeCurrency: "" })

	}
	getOneTimePayroll = (Id) => {
		axios({
			method: "get",
			url: defaultUrl + "/Employee/onetime/" + Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response, "ddddddddddddddddd");
				this.setState({ oneTimePayRoll: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getOneTimePayrollDetail = () => {
		var detail = "";
		console.log(this.state.oneTimePayRoll, 'sdfdsfhsdfsdh')
		for (var i = 0; i < this.state.oneTimePayRoll.length; i++) {
			detail += this.state.oneTimePayRoll[i].PayelementId + '@' + this.state.oneTimePayRoll[i].Amount + "_" + this.state.oneTimePayRoll[i].Currency + "&" + this.state.oneTimePayRoll[i].EffectiveDate + "|" + this.state.oneTimePayRoll[i].entitlement + "!;";
		}
		return detail;
	}
	getPayRollDetail = () => {
		var detail = "";

		for (var i = 0; i < this.state.PayRoll.length; i++) {
			detail += this.state.PayRoll[i].PayElementId + '@' + this.state.PayRoll[i].amount + "_" + this.state.PayRoll[i].Currency + "&" + this.state.PayRoll[i].StartDate + "|" + this.state.PayRoll[i].EndDate + "$" + this.state.PayRoll[i].entitlement + ">" + this.state.PayRoll[i].frequency + "!;";
		}
		return detail;
	}
	getLawsDetail = () => {
		var detail = "";

		for (var i = 0; i < this.state.selectedLaws.length; i++) {
			detail += this.state.selectedLaws[i].LawId + ";";
		}
		return detail;
	}

	getEntitlement = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.Entitlement,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ entitlementList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getTitle = () => {
		axios({
			method: "get",
			url: defaultUrl + "/lookups/" + Lookups.Title,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ TitleList: response.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	getCountryLaws = () => {
		axios({
			method: "get",
			url: defaultUrl + "countryLaw",
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ lawsList: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}
	
	 handlecheckboxChange = (event) => {
		this.setState({ [event.target.name]: event.target.checked });
	  };
	insertUpdateEmployee = (TYPE) => {
		if (TYPE == "employee") {
			if (!this.validator.fieldValid('firstName') ||
				!this.validator.fieldValid('lastName') ||
				!this.validator.fieldValid('Gender') ||
				!this.validator.fieldValid('Country') ||
				!this.validator.fieldValid('Status') ||
				!this.validator.fieldValid('dateOfBirth') ||
				!this.validator.fieldValid('email') ||
				!this.validator.fieldValid('employeeCode') ||
				!this.validator.fieldValid('insuranceId') ||
				!this.validator.fieldValid('texationId') ||
				!this.validator.fieldValid('cnic') ||
				!this.validator.fieldValid('ContractType') ||
				!this.validator.fieldValid('EmployeeStatus') ||
				!this.validator.fieldValid('HireDate') ||
				!this.validator.fieldValid('reason') ||
				!this.validator.fieldValid('PartTime') ||
				!this.validator.fieldValid('ServiceStartDate') ||
				!this.validator.fieldValid('title') ||
				!this.validator.fieldValid('ContractEndDate') ||
				!this.validator.fieldValid('company') ||
				!this.validator.fieldValid('Position') ||
				!this.validator.fieldValid('grade') ||
				!this.validator.fieldValid('Contact') ||
				!this.validator.fieldValid('Address') ||
				!this.validator.fieldValid('PayFrom') 
				
				) {
				{
					this.validator.showMessages();
					this.forceUpdate();
					return false;
				}
			}
		} else if (TYPE == "bank") {
			
			
			if (!this.validator.fieldValid('Bank') ||
				!this.validator.fieldValid('Currency') ||
				!this.validator.fieldValid('IBAN') ||
				!this.validator.fieldValid('EffectiveDate') ||
				!this.validator.fieldValid('IsPrimary')
			) {

				this.validator.showMessages();
				this.forceUpdate();
				return false;
			}	
			
			
		} else if (TYPE == "payroll") {
			// if (this.state.PayRoll.length <= 0 || this.state.oneTimePayRoll.length <= 0) {
			// 	return false;
			// }
		} else {

		}
		var method = "post";
		var url = defaultUrl + "employee";
		if (this.state.Action != "Insert Record") {
			method = "put";
			url = defaultUrl + "employee/" + this.state.Id;
		}
		var obj = {
			Title: this.state.title,
			TaxationId: this.state.texationId,
			Address: this.state.Address,
			Contact: this.state.Contact,
			IsPrimary: this.state.IsPrimary,
			IBAN: this.state.IBAN,
			EffectiveDate: this.state.EffectiveDate,
			FirstName: this.state.firstName,
			LastName: this.state.lastName,
			DOB: this.state.dateOfBirth,
			HireDate: this.state.HireDate,
			HiringReason: this.state.reason,
			ServiceStartDate: this.state.ServiceStartDate,
			ProbationEndDate: this.state.ProbationEndDate,
			PartTimePercentage: this.state.parttimepercentage,
			ContractEndDate: this.state.ContractEndDate,
			Email: this.state.email,
			EmployeeCode: this.state.employeeCode,
			InsuranceId: this.state.insuranceId,
			PartTimeSituation: this.state.PartTime,
			Cnic: this.state.cnic,
			Gender: this.state.Gender,
			MaritalStatus: this.state.Status,
			Country: this.state.Country,
			ContractType: this.state.ContractType,
			CurrentEmployeeStatus: this.state.EmployeeStatus,
			CompanyId: this.state.company,
			PositionId: this.state.Position,
			GradeId: this.state.grade,
			BankId: this.state.Bank,
			CurrencyCode: this.state.Currency,
			Paymethod: this.state.PaymentMethod,
			SalaryStatus: this.state.SalaryStatus,
			PayRollDetail: this.getPayRollDetail(),
			OneTimePayRollDetail: this.getOneTimePayrollDetail(),
			ApplicableLaws: this.getLawsDetail(),
			type: TYPE,
			Id: this.state.Id,
			SocialSecurityApplicable: this.state.SocialSecurityApplicable,
			TaxationApplicable: this.state.TaxationApplicable,
			PayFrom:this.state.PayFrom
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
				this.getEmployeeList(0);
				this.setState({
					firstName: "",
					lastName: "",
					dateOfBirth: "",
					email: "",
					employeeCode: "",
					insuranceId: "",
					texationId: "",
					PartTime: "",
					cnic: "",
					Gender: '',
					Status: '',
					Country: '',
					ContractType: '',
					EmployeeStatus: '',
					company: "",
					Position: "",
					grade: "",
					Bank: "",
					Currency: "",
					PaymentMethod: "",
					SalaryStatus: "",
					PayElement: "",
					amount: "",
					PayRollCurrency: "",
					payrollStartDate: "",
					payrollEndDate: "",
					IBAN: "",
					IsPrimary: "",
					EffectiveDate: "",
					HireDate: "",
					reason: "",
					ServiceStartDate: "",
					ProbationEndDate: "",
					parttimepercentage: "",
					ContractEndDate: "",
					Address: "",
					Contact: "",
					PayRoll: [],
					selectedLaws: [],
					Id: 0,
					Action: 'Insert Record',
					value: 0,
					SocialSecurityApplicable:true,
					TaxationApplicable:true,
				});
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();
			})
			.catch((error) => {
				console.log(error);
				this.setState({
					firstName: "",
					lastName: "",
					dateOfBirth: "",
					email: "",
					employeeCode: "",
					insuranceId: "",
					texationId: "",
					PartTime: "",
					cnic: "",
					Gender: '',
					Status: '',
					Country: '',
					ContractType: '',
					EmployeeStatus: '',
					company: "",
					Position: "",
					grade: "",
					Bank: "",
					Currency: "",
					PaymentMethod: "",
					SalaryStatus: "",
					PayElement: "",
					amount: "",
					PayRollCurrency: "",
					payrollStartDate: "",
					payrollEndDate: "",
					IBAN: "",
					IsPrimary: "",
					EffectiveDate: "",
					HireDate: "",
					reason: "",
					ServiceStartDate: "",
					ProbationEndDate: "",
					parttimepercentage: "",
					ContractEndDate: "",
					Address: "",
					Contact: "",
					PayRoll: [],
					selectedLaws: [],
					Id: 0,
					Action: 'Insert Record',
					table: null,
					value: 0,
					SocialSecurityApplicable:true,
					TaxationApplicable:true,
				})
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.error(error.message);
			})

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
	nextTab = (val) => {
		if (val === 2) {
			if (
				!this.validator.fieldValid('firstName') ||
				!this.validator.fieldValid('lastName') ||
				!this.validator.fieldValid('Gender') ||
				!this.validator.fieldValid('Country') ||
				!this.validator.fieldValid('Status') ||
				!this.validator.fieldValid('dateOfBirth') ||
				!this.validator.fieldValid('email') ||
				!this.validator.fieldValid('employeeCode') ||
				!this.validator.fieldValid('insuranceId') ||
				!this.validator.fieldValid('texationId') ||
				!this.validator.fieldValid('cnic') ||
				!this.validator.fieldValid('ContractType') ||
				!this.validator.fieldValid('EmployeeStatus') ||
				!this.validator.fieldValid('HireDate') ||
				!this.validator.fieldValid('reason') ||
				!this.validator.fieldValid('PartTime') ||
				!this.validator.fieldValid('ServiceStartDate') ||
				// !this.validator.fieldValid('ProbationEndDate') ||
				!this.validator.fieldValid('title') ||
				!this.validator.fieldValid('ContractEndDate') ||
				!this.validator.fieldValid('company') ||
				!this.validator.fieldValid('Position') ||
				!this.validator.fieldValid('grade') ||
				!this.validator.fieldValid('Contact') ||
				!this.validator.fieldValid('Address')
			) {
				this.validator.showMessages();
				this.forceUpdate();
				return false;
			}
		}
		else if (val == 3) {
			if(this.state.Bank =="" && this.state.Currency=="" && this.state.IBAN=="" && this.state.EffectiveDate=="" && this.state.IsPrimary=="")
			{

			}
			else{
				if (!this.validator.fieldValid('Bank') ||
				!this.validator.fieldValid('Currency') ||
				!this.validator.fieldValid('IBAN') ||
				!this.validator.fieldValid('EffectiveDate') ||
				!this.validator.fieldValid('IsPrimary')
			) {

				this.validator.showMessages();
				this.forceUpdate();
				return false;
			}
			}
			
		}
		else if (val == 4) {
			if (this.state.PayRoll.length <= 0 || this.state.oneTimePayRoll.length <= 0) {
				return false;
			}
		}
		this.setState({ value: val });
	}
	getEmployeeList = (IDD) => {
		if (this.state.Default == null) {
			return false;
		}
		axios({
			method: "get",
			url: defaultUrl + "employee/ByCompany/" + this.state.Default.Id,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);
				this.setState({ employeeList: response.data.data });
			})
			.catch((error) => {
				console.log(error);
			})
	}

	deleteEmployee = () => {
		let ids = localStorage.getItem("ids");
		// if(ids=== null || localStorage.getItem("ids").split(",").length>1)
		// {
		// 	Messages.warning("kindly Select one record")
		// 	return false;
		// }
		////document.getElementById("fuse-splash-screen").style.display = "block";

		axios({
			method: "delete",
			url: defaultUrl + "/employee/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.getEmployeeList(0);
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.success();

			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display = "none";
				Messages.error(error.message);

			})
	}
	getEmployeeById = (ids) => {

		if (ids === null) {
			Messages.warning("No Record Selected")
			return false;
		}
		////document.getElementById("fuse-splash-screen").style.display = "block";

		axios({
			method: "get",
			url: defaultUrl + "/employee/" + ids,
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				this.getPosition(response.data[0].CompanyId);
				this.getGrades(response.data[0].CompanyId);
				this.getPayElement(response.data[0].CompanyId);
				this.setState({
					firstName: response.data[0].FirstName,
					lastName: response.data[0].LastName,
					dateOfBirth: moment(response.data[0].DOB).format('YYYY-MM-DD'),
					email: response.data[0].Email,
					employeeCode: response.data[0].EmployeeCode,
					insuranceId: response.data[0].InsuranceId,
					texationId: response.data[0].TaxationId,
					PartTime: response.data[0].PartTimeSituation,
					cnic: response.data[0].Cnic,
					value: 1,
					Gender: response.data[0].Gender,
					Status: response.data[0].MaritalStatus,
					Country: response.data[0].Country,
					ContractType: response.data[0].ContractType,
					EmployeeStatus: response.data[0].CurrentEmployeeStatus,
					company: response.data[0].CompanyId,
					Position: response.data[0].PositionId,
					grade: response.data[0].GradeId,
					HireDate: moment(response.data[0].HireDate).format('YYYY-MM-DD'),
					reason: response.data[0].HiringReason,
					ServiceStartDate: moment(response.data[0].ServiceStartDate).format('YYYY-MM-DD'),
					ProbationEndDate: moment(response.data[0].ProbationEndDate).format('YYYY-MM-DD'),
					parttimepercentage: response.data[0].PartTimePercentage,
					ContractEndDate: moment(response.data[0].ContractEndDate).format('YYYY-MM-DD'),
					Address: response.data[0].Address,
					Contact: response.data[0].Contact,
					title: response.data[0].Title,
					Action: "Update Record",
					Id: response.data[0].Id,
					SocialSecurityApplicable:response.data[0].SocialSecurityApplicable==1?true:false,
					TaxationApplicable:response.data[0].TaxationApplicable==1?true:false,
				})
				//document.getElementById("fuse-splash-screen").style.display = "none";

			})
			.catch((error) => {
				console.log(error);
				//document.getElementById("fuse-splash-screen").style.display = "none";

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
				console.log(response.data, "Bank Detail");
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
	getView = () => {
		var ids = localStorage.getItem("ids");
		if (ids === null || localStorage.getItem("ids").split(",").length > 1) {
			Messages.warning("kindly Select one record")
			return false;
		}
		this.props.history.push(`/employeedetail/${ids}`);
	}
	getEmployeeDetailsForEdit = () => {

		var ids = localStorage.getItem("ids");
		if (ids === null || localStorage.getItem("ids").split(",").length > 1) {
			Messages.warning("kindly Select one record")
			return false;
		}
		this.getEmployeeBankById(ids);
		this.getEmployeeById(ids);
		this.getEmployeePayRollById(ids);
		this.getOneTimePayroll(ids);
		this.getApplicableLaws(ids);
	}
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple
				classes={{
					root: classes.layoutRoot
				}}
				header={
					<div className="p-24"><h4>Employee-{this.state.Default != null ? this.state.Default.Company : "No Company Selected Yet"}</h4></div>
				}
				// contentToolbar={
				// 	<div className="px-24"><h4>Add New Company</h4></div>
				// }
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
								<Tab label="Employee Detail" />
								<Tab label="Employee Bank" />
								<Tab label="Employee Payroll" />
								{/* <Tab label="Applicable Laws" /> */}
							</Tabs>
						</AppBar>
						<SwipeableViews
							axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
							index={this.state.value}
							onChangeIndex={this.handleChangeIndex}
						>
							<TabContainer dir={theme.direction}>
								<Paper className={classes.root}>
									<div className="row" style={{ marginBottom: "5px" }}  >
										<div style={{ float: "left", "margin": "8px" }}>
											<Button variant="contained" color="secondary" className={classes.button} onClick={this.getEmployeeDetailsForEdit}>
												Edit
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button variant="contained" color="primary" className={classes.button} onClick={this.deleteEmployee}>
												Delete
										</Button>
										</div>
										<div style={{ float: "left", "margin": "8px" }}>
											<Button variant="contained" color="success" className={classes.button} onClick={this.getView}>
												View
										</Button>
										</div>

									</div>


									{/* <Grid item xs={12} sm={5} style={{ paddingTop: "10px",float:"right",width:"20%" }}  >
											<Select1

												name="companyId"
												options={this.state.companyList}
												// value={this.state.CompanySelected}
												className="basic-multi-select"
												classNamePrefix="select"
												onChange={this.handledropdown}

											/>
										</Grid> */}

									<Grid item xs={12} className="table-responsive">
										<Table className={classes.table}>
											<TableHead>
												<TableRow>
												<CustomTableCell align="center">Action</CustomTableCell>
													<CustomTableCell align="center" >EmployeeCode</CustomTableCell>
													<CustomTableCell align="center">Title</CustomTableCell>
													<CustomTableCell align="center">FirstName</CustomTableCell>
													<CustomTableCell align="center">LastName</CustomTableCell>
													<CustomTableCell align="center">Gender</CustomTableCell>
													<CustomTableCell align="center">Email</CustomTableCell>
													<CustomTableCell align="center">Cnic</CustomTableCell>
													<CustomTableCell align="center">DOB</CustomTableCell>
													<CustomTableCell align="center">InsuranceId</CustomTableCell>
													<CustomTableCell align="center">HireDate</CustomTableCell>
													<CustomTableCell align="center">HiringReason</CustomTableCell>
													<CustomTableCell align="center">ServiceStartDate</CustomTableCell>
													<CustomTableCell align="center">ProbationEndDate</CustomTableCell>
													<CustomTableCell align="center">PartTimePercentage</CustomTableCell>
													<CustomTableCell align="center">ContractEndDate</CustomTableCell>
													<CustomTableCell align="center">Address</CustomTableCell>
													<CustomTableCell align="center">Contact</CustomTableCell>
													<CustomTableCell align="center">MaritalStatus</CustomTableCell>
													<CustomTableCell align="center">Country</CustomTableCell>
													<CustomTableCell align="center">CurrentEmployeeStatus</CustomTableCell>
													<CustomTableCell align="center">PartTimeSituation</CustomTableCell>
													
												</TableRow>
											</TableHead>
											<TableBody>
												{this.state.employeeList.map(row => (
													<TableRow className={classes.row} key={row.Code}>
															<CustomTableCell align="center"><input type="checkbox" name="radio" value={row.Id}
															onChange={() => this.selection(row.Id)}
														/>
														</CustomTableCell>
														<CustomTableCell align="center">{row.EmployeeCode}</CustomTableCell>
														<CustomTableCell align="center">{row.Title}</CustomTableCell>
														<CustomTableCell align="center">{row.FirstName}</CustomTableCell>
														<CustomTableCell align="center">{row.LastName}</CustomTableCell>
														<CustomTableCell align="center">{row.Gender}</CustomTableCell>
														<CustomTableCell align="center">{row.Email}</CustomTableCell>
														<CustomTableCell align="center">{row.Cnic}</CustomTableCell>
														<CustomTableCell align="center">{row.DOB}</CustomTableCell>
														<CustomTableCell align="center">{row.InsuranceId}</CustomTableCell>
														<CustomTableCell align="center">{row.HireDate}</CustomTableCell>
														<CustomTableCell align="center">{row.HiringReason}</CustomTableCell>
														<CustomTableCell align="center">{row.ServiceStartDate}</CustomTableCell>
														<CustomTableCell align="center">{row.ProbationEndDate}</CustomTableCell>
														<CustomTableCell align="center">{row.PartTimePercentage}</CustomTableCell>
														<CustomTableCell align="center">{row.ContractEndDate}</CustomTableCell>
														<CustomTableCell align="center">{row.Address}</CustomTableCell>
														<CustomTableCell align="center">{row.Contact}</CustomTableCell>
														<CustomTableCell align="center">{row.MaritalStatus}</CustomTableCell>
														<CustomTableCell align="center">{row.Country}</CustomTableCell>
														<CustomTableCell align="center">{row.CurrentEmployeeStatus==="30"?'Deactive':'Active'}</CustomTableCell>
														<CustomTableCell align="center">{row.PartTimeSituation}</CustomTableCell>
													
													</TableRow>
												))}
											</TableBody>
										</Table>


									</Grid>



								</Paper>
							</TabContainer>
							<TabContainer dir={theme.direction}>

								<form className={classes.container} noValidate autoComplete="off">
									<Grid item xs={12} sm={2} style={{ marginRight: '5px' }} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="title">Title</InputLabel>
											<Select
												value={this.state.title}
												onChange={this.handleChange}
												inputProps={{
													name: 'title',
													id: 'title',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.TitleList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('title', this.state.title, 'required')}

									</Grid>
									<Grid item xs={12} sm={3} style={{ marginRight: '5px' }} >
										<TextField id="standard-basic" fullWidth label="First Name" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
										{this.validator.message('firstName', this.state.firstName, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}>
										<TextField id="standard-basic" fullWidth label="Last Name" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
										{this.validator.message('lastName', this.state.lastName, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Gender">Gender</InputLabel>
											<Select
												value={this.state.Gender}
												onChange={this.handleChange}
												inputProps={{
													name: 'Gender',
													id: 'Gender',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.genderList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('Gender', this.state.Gender, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}  >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Country">Country</InputLabel>
											<Select
												value={this.state.Country}
												onChange={this.handleChange}
												inputProps={{
													name: 'Country',
													id: 'Country',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.countryList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('Country', this.state.Country, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Status">Marital Status</InputLabel>
											<Select
												value={this.state.Status}
												onChange={this.handleChange}
												inputProps={{
													name: 'Status',
													id: 'Status',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.maritallist.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('Status', this.state.Status, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField
											id="date"
											label="Date of Birth"
											type="date"
											fullWidth
											name="dateOfBirth"
											value={this.state.dateOfBirth}
											className={classes.textField}
											onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('dateOfBirth', this.state.dateOfBirth, 'required')}

									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="standard-basic" fullWidth label="Email" value={this.state.email} onChange={this.handleChange} name="email" />
										{this.validator.message('email', this.state.email, 'required')}

									</Grid>

									<Grid item xs={12} sm={5}   >
										<TextField id="standard-basic" value={this.state.employeeCode} fullWidth label="Employee Code" name="employeeCode" onChange={this.handleChange} />
										{this.validator.message('employeeCode', this.state.employeeCode, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="standard-basic" fullWidth label="Insurance Id" value={this.state.insuranceId} name="insuranceId" onChange={this.handleChange} />
										{this.validator.message('insuranceId', this.state.texationId, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField id="standard-basic" fullWidth label="Texation Id" onChange={this.handleChange} name="texationId" value={this.state.texationId} />
										{this.validator.message('texationId', this.state.texationId, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="standard-basic" value={this.state.cnic} fullWidth label="Cnic" onChange={this.handleChange} name="cnic" />
										{this.validator.message('cnic', this.state.cnic, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}>
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Contract Type</InputLabel>
											<Select
												value={this.state.ContractType}
												onChange={this.handleChange}
												inputProps={{
													name: 'ContractType',
													id: 'ContractType',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.contractTypeList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('ContractType', this.state.ContractType, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Employee Status</InputLabel>
											<Select
												value={this.state.EmployeeStatus}
												onChange={this.handleChange}
												inputProps={{
													name: 'EmployeeStatus',
													id: 'EmployeeStatus',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.statusList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('EmployeeStatus', this.state.EmployeeStatus, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}  >
										<TextField
											id="date"
											label="Hire Date"
											type="date"
											name="HireDate"
											value={this.state.HireDate}
											fullWidth
											className={classes.textField}
											onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('HireDate', this.state.HireDate, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >

										<TextField id="standard-basic" value={this.state.reason} fullWidth label="Hiring Reason" onChange={this.handleChange} name="reason" />
										{this.validator.message('reason', this.state.reason, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}   >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="PartTime">PartTime Situation</InputLabel>
											<Select
												value={this.state.PartTime}
												onChange={this.handleChange}
												inputProps={{
													name: 'PartTime',
													id: 'PartTime',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.parttimeList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('PartTime', this.state.PartTime, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<TextField
											id="date"
											label="Service Start Date"
											type="date"
											fullWidth
											name="ServiceStartDate"
											value={this.state.ServiceStartDate}
											className={classes.textField}
											onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('ServiceStartDate', this.state.ServiceStartDate, 'required')}

									</Grid>
									<Grid item xs={12} sm={5}   >
										<TextField
											id="date"
											label="Probation End Date"
											type="date"
											fullWidth
											name="ProbationEndDate"
											value={this.state.ProbationEndDate}
											className={classes.textField}
											onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{/* {this.validator.message('ProbationEndDate', this.state.ProbationEndDate, 'required')} */}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >

										<TextField id="standard-basic" type="number" value={this.state.parttimepercentage} fullWidth label="Part Time Percentage" onChange={this.handleChange} name="parttimepercentage" />
										{this.validator.message('parttimepercentage', this.state.parttimepercentage, 'required')}
									</Grid>
									<Grid item xs={12} sm={5}   >
										<TextField
											id="date"
											label="Contract End Date"
											type="date"
											fullWidth
											name="ContractEndDate"
											value={this.state.ContractEndDate}
											className={classes.textField}
											onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('ContractEndDate', this.state.ContractEndDate, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
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
										</FormControl>
										{this.validator.message('company', this.state.company, 'required')}
									</Grid>

									<Grid item xs={12} sm={5}  >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Position">Position</InputLabel>
											<Select
												value={this.state.Position}
												onChange={this.handleChange}
												inputProps={{
													name: 'Position',
													id: 'Position',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>

												{this.state.positionList.map(row => (
													<MenuItem value={row.Id}>{row.Title}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('Position', this.state.Position, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Grade">Grade</InputLabel>
											<Select
												value={this.state.grade}
												onChange={this.handleChange}
												inputProps={{
													name: 'grade',
													id: 'grade',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>

												{this.state.gradeList.map(row => (
													<MenuItem value={row.Id}>{row.Code}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('grade', this.state.grade, 'required')}
									</Grid>


									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
										<TextField id="standard-basic" value={this.state.Contact} fullWidth label="Contact" onChange={this.handleChange} name="Contact" />
										{this.validator.message('Contact', this.state.Contact, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
										<TextField id="standard-basic" value={this.state.Address} fullWidth label="Address" onChange={this.handleChange} name="Address" />
										{this.validator.message('Address', this.state.Address, 'required')}
									</Grid>
									<Grid item xs={12} sm={5} >
										<FormControlLabel
											control={<Checkbox checked={this.state.SocialSecurityApplicable} onChange={this.handlecheckboxChange} name="SocialSecurityApplicable" />}
											label="Social Security Applicable"
										/>
											<FormControlLabel
											control={<Checkbox checked={this.state.TaxationApplicable} onChange={this.handlecheckboxChange} name="TaxationApplicable" />}
											label="Taxation Applicable"
										/>
									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Pay From(Company Bank)</InputLabel>
											<Select
												value={this.state.PayFrom}
												onChange={this.handleChange}
												inputProps={{
													name: 'PayFrom',
													id: 'PayFrom',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.CompanyBank.map(row => (
													<MenuItem value={row.Id}>{row.AccNo}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('PayFrom', this.state.PayFrom, 'required')}

									</Grid>
								</form>
								<div className="row" >
									<Grid item xs={12} sm={10}  >
									
										<div style={{ float: "right", "marginRight": "8px" }}>
										<Button style={{ "marginBottom": "10px", "marginRight": "10px" }}  variant="outlined" color="secondary" className={this.state.Action == 'Insert Record' ? classes.button : 'd-none'} onClick={() => this.insertUpdateEmployee('employee')} >
												Save Employee
											</Button>
											<Button style={{ "marginBottom": "10px", "marginRight": "10px" }} variant="outlined" color="secondary" className={this.state.Action != 'Insert Record' ? classes.button : 'd-none'} onClick={() => this.insertUpdateEmployee('employee')}>
												Update Employee Detail
      										</Button>
											<Button style={{ "marginBottom": "10px" }} variant="outlined" color="secondary" className={classes.button} onClick={() => this.nextTab(2)}>
												Next
      								</Button>
										</div>
									</Grid>

								</div>
							</TabContainer>
							<TabContainer dir={theme.direction}>
								<h4>Add New Account</h4>
								<form className={classes.container} noValidate autoComplete="off">
									<Grid item xs={12} sm={5} >
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
									<Grid item xs={12} sm={5} >
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

									<Grid item xs={12} sm={5} >

										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Is Primary</InputLabel>
											<Select
												value={this.state.IsPrimary}
												onChange={this.handleChange}
												inputProps={{
													name: 'IsPrimary',
													id: 'IsPrimary',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												<MenuItem value="Y">Yes</MenuItem>
												<MenuItem value="N">No</MenuItem>

											</Select>
										</FormControl>
										{this.validator.message('IsPrimary', this.state.IsPrimary, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} >
										<TextField
											id="date"
											label="Effective Date"
											type="date"
											name="EffectiveDate"
											value={this.state.EffectiveDate}
											fullWidth
											className={classes.textField}
											onChange={this.handleChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('EffectiveDate', this.state.EffectiveDate, 'required')}
									</Grid>

									<Grid item xs={12} sm={5} >
										<TextField
											id="outlined-name"
											label="IBAN"
											className={classes.textField}
											value={this.state.IBAN}
											name="IBAN"
											fullWidth
											onChange={this.handleChange}
											margin="normal"
										//variant="outlined"
										/>
										{this.validator.message('IBAN', this.state.IBAN, 'required')}

									</Grid>
								</form>
								<div className="row" style={{ "marginBottom": "10px" }} >
									<div style={{ float: "left", "marginLeft": "8px" }}>

										<Button style={{ "marginBottom": "10px" }} variant="outlined" color="secondary" className={classes.button} onClick={() => this.nextTab(1)}>
											Previous
  										</Button>
									</div>
									<div style={{ float: "right", "marginRight": "8px" }}>
										<Button style={{ "marginBottom": "10px", "marginRight": "10px" }} variant="outlined" color="secondary" className={this.state.Action != 'Insert Record' ? classes.button : 'd-none'} onClick={() => this.insertUpdateEmployee('bank')}>
											Update Bank Detail
      										</Button>
										<Button style={{ "marginBottom": "10px" }} variant="outlined" color="secondary" className={classes.button} onClick={() => this.nextTab(3)}>
											Next
      									</Button>
									</div>
								</div>
							</TabContainer>

							<TabContainer dir={theme.direction}>
								<h4>Periodic PayElements</h4>
								<form className={classes.container} noValidate autoComplete="off">

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Pay Elements</InputLabel>
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

									<Grid item xs={12} sm={5}  >
										<TextField id="amount" fullWidth label="amount" name="amount" value={this.state.amount} onChange={this.handleChange} />
										{this.validator.message('amount', this.state.amount, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Currency">Currency</InputLabel>
											<Select
												value={this.state.PayRollCurrency}
												onChange={this.handleChange}
												inputProps={{
													name: 'PayRollCurrency',
													id: 'PayRollCurrency',
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
										{this.validator.message('PayRollCurrency', this.state.PayRollCurrency, 'required')}

									</Grid>

									<Grid item xs={12} sm={5} >
										<TextField
											id="date"
											label="Start Date"
											type="date"
											fullWidth
											value={this.state.payrollStartDate}
											name="payrollStartDate"
											onChange={this.handleChange}
											className={classes.textField}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('payrollStartDate', this.state.payrollStartDate, 'required')}

									</Grid>

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<TextField
											id="date"
											label="End Date"
											type="date"
											fullWidth
											value={this.state.payrollEndDate}
											name="payrollEndDate"
											onChange={this.handleChange}
											className={classes.textField}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('payrollEndDate', this.state.payrollEndDate, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginLeft: '5px' }}   >
										<TextField id="frequency" type="number" fullWidth label="Frequency" name="frequency" value={this.state.frequency} onChange={this.handleChange} />
										{this.validator.message('frequency', this.state.frequency, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="entitlement">Entilement</InputLabel>
											<Select
												value={this.state.entitlement}
												onChange={this.handleChange}
												inputProps={{
													name: 'entitlement',
													id: 'entitlement',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.entitlementList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('entitlement', this.state.entitlement, 'required')}

									</Grid>

								</form>
								<div className="row">
									<div style={{ float: "right", "marginRight": "8px" }}>

										<IconButton className={classes.button} aria-label="Add" onClick={this.AddPayRoll} >
											<AddIcon />
										</IconButton>
									</div>
								</div>
								<div className="row">

									<Table className={classes.table}>
										<TableHead>
											<TableRow>

												<CustomTableCell align="center" >Pay Element</CustomTableCell>
												<CustomTableCell align="center" >Ammount</CustomTableCell>
												<CustomTableCell align="center" >Currency</CustomTableCell>
												<CustomTableCell align="center">Action</CustomTableCell>

											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.PayRoll.map(row => (
												<TableRow className={classes.row} key={row.Id}>
													<CustomTableCell align="center">{row.PayElementId}</CustomTableCell>
													<CustomTableCell align="center">{row.amount}</CustomTableCell>
													<CustomTableCell align="center">{row.Currency}</CustomTableCell>
													<CustomTableCell align="center" component="th" scope="row">
														<IconButton className={classes.button} aria-label="Delete" onClick={() => this.deleteRow(row.Id)} >
															<DeleteIcon />
														</IconButton>
													</CustomTableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>

								<h4>OneTime PayElements</h4>
								<form className={classes.container} noValidate autoComplete="off">

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="oneTimePayElement">Pay Elements</InputLabel>
											<Select
												value={this.state.oneTimePayElement}
												onChange={this.handleChange}
												inputProps={{
													name: 'oneTimePayElement',
													id: 'oneTimePayElement',
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
										{this.validator.message('oneTimePayElement', this.state.oneTimePayElement, 'required')}

									</Grid>

									<Grid item xs={12} sm={5}  >
										<TextField id="oneTimeAmount" fullWidth label="oneTimeAmount" name="oneTimeAmount" value={this.state.oneTimeAmount} onChange={this.handleChange} />
										{this.validator.message('oneTimeAmount', this.state.oneTimeAmount, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="Currency">Currency</InputLabel>
											<Select
												value={this.state.oneTimeCurrency}
												onChange={this.handleChange}
												inputProps={{
													name: 'oneTimeCurrency',
													id: 'oneTimeCurrency',
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
										{this.validator.message('oneTimeCurrency', this.state.oneTimeCurrency, 'required')}

									</Grid>



									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<TextField
											id="date"
											label="Effective Date"
											type="date"
											fullWidth
											value={this.state.oneTimeDate}
											name="oneTimeDate"
											onChange={this.handleChange}
											className={classes.textField}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										{this.validator.message('oneTimeDate', this.state.oneTimeDate, 'required')}

									</Grid>
									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="entitlement">Entilement</InputLabel>
											<Select
												value={this.state.oneTimeEntitlement}
												onChange={this.handleChange}
												inputProps={{
													name: 'oneTimeEntitlement',
													id: 'oneTimeEntitlement',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.entitlementList.map(row => (
													<MenuItem value={row.Id}>{row.Name}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('oneTimeEntitlement', this.state.oneTimeEntitlement, 'required')}

									</Grid>
								</form>
								<div className="row">
									<div style={{ float: "right", "marginRight": "8px" }}>

										<IconButton className={classes.button} aria-label="Add" onClick={this.AddoneTimePayRoll} >
											<AddIcon />
										</IconButton>
									</div>
								</div>
								<div className="row">

									<Table className={classes.table}>
										<TableHead>
											<TableRow>

												<CustomTableCell align="center" >Pay Element</CustomTableCell>
												<CustomTableCell align="center" >Amount</CustomTableCell>
												<CustomTableCell align="center" >Currency</CustomTableCell>
												<CustomTableCell align="center" >Effective Date</CustomTableCell>
												<CustomTableCell align="center">Action</CustomTableCell>

											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.oneTimePayRoll.map(row => (
												<TableRow className={classes.row} key={row.Id}>
													<CustomTableCell align="center">{row.PayelementId}</CustomTableCell>
													<CustomTableCell align="center">{row.Amount}</CustomTableCell>
													<CustomTableCell align="center">{row.Currency}</CustomTableCell>
													<CustomTableCell align="center">{row.EffectiveDate}</CustomTableCell>
													<CustomTableCell align="center" component="th" scope="row">
														<IconButton className={classes.button} aria-label="Delete" onClick={() => this.deleteoneTimeRow(row.Id)} >
															<DeleteIcon />
														</IconButton>
													</CustomTableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>

								<div className="row" style={{ "marginBottom": "10px" }} >
									<Grid item xs={12} sm={12}  >
										<div style={{ float: "left", "marginLeft": "8px" }}>
											<Button style={{ "marginBottom": "10px" }} variant="outlined" color="secondary" className={classes.button} onClick={() => this.nextTab(2)}>
												Previous
  											</Button>
										</div>
										<div style={{ float: "right", "marginRight": "8px","marginTop": "5px" }}>
											<Button style={{  "marginRight": "10px" }} variant="outlined" color="secondary" className={this.state.Action != 'Insert Record' ? classes.button : 'd-none'} onClick={() => this.insertUpdateEmployee('payroll')}>
												Update payroll
      										</Button>
											  <Button variant="outlined" color="secondary" className={classes.button} onClick={() => this.insertUpdateEmployee('All')} >
												{this.state.Action}
											</Button>
										</div>
									</Grid>
								</div>
							</TabContainer>
							<TabContainer dir={theme.direction}>
								<h4>Applicable Laws</h4>
								<form className={classes.container} noValidate autoComplete="off">

									<Grid item xs={12} sm={5} style={{ marginRight: '5px' }}  >
										<FormControl className={classes.formControl}>
											<InputLabel htmlFor="ContractType">Country Laws</InputLabel>
											<Select
												value={this.state.lawId}
												onChange={this.handleChange}
												inputProps={{
													name: 'lawId',
													id: 'lawId',
												}}
											>
												<MenuItem value="">
													<em>None</em>
												</MenuItem>
												{this.state.lawsList.map(row => (
													<MenuItem value={row.Id}>{row.Detail}</MenuItem>
												))}
											</Select>
										</FormControl>
										{this.validator.message('lawId', this.state.lawId, 'required')}

									</Grid>


								</form>
								<div className="row">
									<div style={{ float: "right", "marginRight": "8px" }}>

										<IconButton className={classes.button} aria-label="Add" onClick={this.addLaw} >
											<AddIcon />
										</IconButton>
									</div>
								</div>
								<div className="row">

									<Table className={classes.table}>
										<TableHead>
											<TableRow>

												<CustomTableCell align="center" >Law</CustomTableCell>
												<CustomTableCell align="center">Action</CustomTableCell>

											</TableRow>
										</TableHead>
										<TableBody>
											{this.state.selectedLaws.map(row => (
												<TableRow className={classes.row} key={row.LawId}>
													<CustomTableCell align="center">{row.LawId}</CustomTableCell>
													<CustomTableCell align="center" component="th" scope="row">
														<IconButton className={classes.button} aria-label="Delete" onClick={() => this.deleteLawRow(row.LawId)} >
															<DeleteIcon />
														</IconButton>
													</CustomTableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
								<div className="row">
									<Grid item xs={12} sm={12}  >
										<div style={{ float: "left", "marginLeft": "8px" }}>
											<Button style={{ "marginBottom": "10px" }} variant="outlined" color="secondary" className={classes.button} onClick={() => this.nextTab(3)}>
												Previous
  											</Button>
										</div>
										<div style={{ float: "right", "marginRight": "8px" }}>
											<Button style={{ "marginBottom": "10px", "marginRight": "10px" }} variant="outlined" color="secondary" className={this.state.Action != 'Insert Record' ? classes.button : 'd-none'} onClick={() => this.insertUpdateEmployee('laws')}>
												Update Law
      										</Button>
											<Button variant="outlined" color="secondary" className={classes.button} onClick={() => this.insertUpdateEmployee('All')} >
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
export default withStyles(styles, { withTheme: true })(Employee);