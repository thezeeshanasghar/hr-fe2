import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import SimpleReactValidator from 'simple-react-validator';
import defaultUrl from "../../services/constant/constant";
import $ from 'jquery';
import DataTable from "datatables.net";
import * as responsive from "datatables.net-responsive";
import axios from "axios";
import Select1 from 'react-select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ReactExport from "react-export-excel";
import Pdf from "react-to-pdf";
import { Link } from 'react-router-dom'

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const ref = React.createRef();
const options = {
	orientation: 'landscape'
};
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


class GtoNReport extends Component {

	state = {
		value: 0,
		Action: 'Insert Record',
		table: null,
		data: [],
		Month: "",
		Company: "",
		companyList: [],
		columns: [],
		Sum:[],
		Path:"",
		Default:localStorage.getItem("state")!=null?JSON.parse(localStorage.getItem("state")):null

	};

	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();

	}
	componentDidMount() {
		this.getselectiveCompanyDetail();
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
	handledropdown = (e) => {
		this.setState({ Company: e.value })
	}
	download=()=>{
	window.open(defaultUrl + "download/"+this.state.Path,"_self");
	}
	generateReport = () => {
	
		if (this.state.Month != "" && this.state.Default != null) {
			var obj = {
				Date: this.state.Month + "-01",
				CompanyId: this.state.Default.Id
			}
			axios({
				method: "post",
				url: defaultUrl + "Report/GTN",
				data: JSON.stringify(obj),
				headers: {
					// 'Authorization': `bearer ${token}`,
					"Content-Type": "application/json;charset=utf-8",
				},
			})
				.then((response) => {
					console.log(response.data.Path,response.data)
					this.setState({ Path: response.data.Path,data: response.data.data.recordset, columns: Object.keys(response.data.data.recordset[0]) })
					// console.log(response.response.data.recordset, Object.keys(response.data.recordset[0]))
					var FooterCount={};
				
					// debugger
					for(var i=0;i<response.data.data.recordset.length;i++) {
						
						for(var y=0;y<Object.keys(response.data.data.recordset[0]).length;y++){
							if(Number.isInteger(response.data.data.recordset[i][Object.keys(response.data.data.recordset[i])[y]])){
							FooterCount[Object.keys(response.data.data.recordset[i])[y]]=response.data.data.recordset[i][Object.keys(response.data.data.recordset[i])[y]];
							}
						}

					// 		if(Number.isInteger(response.data.recordset[i][Object.keys(response.data.recordset[0])[y]])){
					// 			if(CountArray.filter(x=>x.EmployeeCode==response.data.recordset[i].EmployeeCode).length===0)
					// 			{
					// 				CountArray.push({Object.keys(response.data.recordset[0])[y]:response.data.recordset[i][Object.keys(response.data.recordset[0])[y]],EmployeeCode:response.data.recordset[i].EmployeeCode})
					// 			}else{
					// 				var Subarray=CountArray.find(x=>x.EmployeeCode==response.data.recordset[i].EmployeeCode);
					// 				if(Subarray)
					// 				{
					// 					CountArray.splice('EmployeeId',Subarray.EmployeeCode);
					// 					CountArray.push({Object.keys(response.data.recordset[0])[y]:response.data.recordset[i][Object.keys(response.data.recordset[0])[y]]+Subarray.Amount,EmployeeCode:response.data.recordset[i].EmployeeCode})
					// 				}
					// 			}
					// 			// 
					// 		}
					// 	}
					}
					this.setState({Sum:[FooterCount]})
				})
				.catch((error) => {
					console.log(error);
				})
		}

	}
	
	handleChange = (e) => {
		console.log(e.target.value)
		this.setState({ [e.target.name]: e.target.value });
	};
	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple

				header={
					<div className="p-24"><h4>G2N Report-{this.state.Default !=null?this.state.Default.Company:"No Company Selected Yet"}</h4></div>
				}

				content={

					<div className={classes.root}>
						
						<form className={classes.container} noValidate autoComplete="off" style={{ marginBottom: '30px' }}>
							<Grid item xs={12} sm={5} style={{ marginRight: '5px' }} >
								<FormControl className={classes.formControl}>
									<TextField
										id="Month"
										label="Report Month"
										type="month"
										fullWidth
										name="Month"
										value={this.state.Month}
										className={classes.textField}
										onChange={this.handleChange}
										InputLabelProps={{
											shrink: true,
										}}
									/>

								</FormControl>
							</Grid>
							{/* <Grid item xs={12} sm={5} style={{ marginTop: "10px" }} className={this.state.Type == "Bank" || this.state.Type == "Company" || this.state.Type == "Exchange" || this.state.Type == "CountryLaw" ? 'd-none' : ''} >
								<FormControl className={classes.formControl}>

									<Select1

										name="companyId"
										options={this.state.companyList}
										value={this.state.CompanySelected}
										className="basic-multi-select"
										classNamePrefix="select"
										onChange={this.handledropdown}

									/>
									{this.validator.message('companyId', this.state.companyId, 'required')}
								</FormControl>
							</Grid> */}
							{
								this.state.Default!=null?
								<Button variant="outlined" color="secondary" style={{ marginTop: "10px" }} className={classes.button} onClick={() => this.generateReport()} >
								Generate Report
											</Button>
											:""
							}
							
						</form>
						
						<Paper  ref={ref}  className={this.state.data.length > 0 ? classes.root : "d-none"} >
						<Button style={{ "marginBottom": "10px" }} variant="outlined" color="secondary" className={classes.button} onClick={() => this.download()}>
						Download Report
  						</Button>
							<div style={{ width: "30%", height: "100px", border: "solid 1px black", margin: "10px" }}>
								<p>Country Code-{this.state.data.length > 0 ? this.state.data[0].CountryCode : ""}</p>
								<p>Company Name-{this.state.data.length > 0 ? this.state.data[0].CompanyName : ""}</p>
								<p>Entity Id-{this.state.data.length > 0 ? this.state.data[0].Code : ""}</p>
								<p>PayCycle-{this.state.Month}</p>
							</div>
							{/* <ExcelFile element={<button style={{ color: "green" }}>Download in Excel sheet</button>}>
								<ExcelSheet data={this.state.data} name="G2N-Report">
									{
										this.state.columns.map(row =>
											<ExcelColumn label={row} value={row} />
										)
									}
									<ExcelColumn label="PayCycle" value={this.state.Month} />
								</ExcelSheet>
							</ExcelFile> */}
							<Table className={classes.table}>
								<TableHead>
									<TableRow>
									<CustomTableCell align="center">Detail</CustomTableCell>
										{
											this.state.columns.map(row =>
												<CustomTableCell align="center">{row}</CustomTableCell>
											)
										}
									</TableRow>
								</TableHead>
								<TableBody>
									{this.state.data.map(row => (
										<TableRow className={classes.row} key={row.payElement}>
										<CustomTableCell align="center">
										<Link
  											to={{
    										pathname: "/PaymentDetail/"+row.PayGroup+'/'+row.EmpId,
  											}}
										> View</Link>
										</CustomTableCell>
											{
												this.state.columns.map(column =>
													<CustomTableCell align="center">{row[column]}</CustomTableCell>
												)
											}
										</TableRow>
									))}
								</TableBody>
								{/* <TableFooter>
								<TableRow className={classes.row} >
									{this.state.columns.map((row,index) => (
										console.log(index,row),console.log(this.state.Sum),
										index>6?
										
											this.state.Sum.map(column =>
													<CustomTableCell align="center">{column[row]}</CustomTableCell>
												)
											
										
										:
										<CustomTableCell align="center">-</CustomTableCell>
									
									))}
									</TableRow>
								</TableFooter> */}
							</Table>

						</Paper>

					</div>
				}
			/>
		)
	}
}

export default withStyles(styles, { withTheme: true })(GtoNReport);