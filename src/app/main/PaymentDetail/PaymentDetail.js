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
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Payment } from '@material-ui/icons';

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


class PaymentDetail extends Component {

	state = {
		value: 0,
		Action: 'Insert Record',
		table: null,
		data:[],
			Month: "",
		Company: "",
		companyList: [],
		columns: [],
		Sum:[],
		Path:""

	};

	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();

	}
	componentDidMount() {
		this.getDetail();
	}
	getDetail = () => {
		axios({
			method: "get",
			url: defaultUrl + "Report/PaySlipdetail/"+window.location.href.split("/")[4]+'/'+window.location.href.split("/")[5],
			headers: {
				// 'Authorization': `bearer ${token}`,
				"Content-Type": "application/json;charset=utf-8",
			},
		})
			.then((response) => {
				console.log(response);

				this.setState({ data: response.data });
				return response.data;
			})
			.catch((error) => {
				console.log(error);
			})
	}

	render() {
		const { classes, theme } = this.props;

		return (
			<FusePageSimple

				header={
					<div className="p-24"><h4>Payment Detail</h4></div>
				}

				content={
					
						<div>
							{
							this.state.data.map((row)=>
				<div className={classes.root} style={{padding:"10px"}}>
				<Card className={classes.root}>
				  <CardContent>
				  <Typography variant="h4" component="h1">
				  {row.Payment[0].Name}
					</Typography>
					<Typography variant="h5" component="h2">
					  Pay Element Details
					</Typography>
					{
					row.Payment.map((payment)=>
					<Typography variant="body2" component="p">
						{
							<div>
								&rarr;Pay Element #  { payment.Description}  &rarr;Formula #  {payment.DaysDiff==0?'('+(payment.amount+'/'+payment.ActualDays+') X '+ payment.ActualDays):'('+(Math.round((payment.amount/ payment.DaysDiff)*payment.ActualDays) +'/'+payment.ActualDays+') X '+ payment.DaysDiff)}  &rarr;Amount #  {payment.amount} 
							</div>
							
						}
					</Typography>	
					)
					
					}
					<Typography variant="h5" component="h2">
					  Taxation/Social Security Details
					</Typography>
					{
					row.Tax.map((Tax)=>
					<Typography variant="body2" component="p">
						{
							<div>
								&rarr;Law #  { Tax.Description}  &rarr;Type #  {Tax.Type}  &rarr;Amount #  {Tax.Amount} &rarr;
								<h4>Detail</h4>
								{Tax.Equation.split(",").map(x=>
									<div>{x}</div>
									)}
							</div>
		
							
						}
					</Typography>	
					)
					
					}
					<Typography variant="h5" component="h2">
					  Total
					</Typography>
					
					<Typography variant="body2" component="p">
						{
							<div>
								&rarr;Payment #  { row.TotalPayment}
								&rarr;Tax #  { row.TotalTax}
								&rarr;Net Payment #  {Number(row.TotalPayment)-Number(row.TotalTax)}
								</div>
							
						}
					</Typography>	
					
				  </CardContent>
				</Card>
								</div>
							)
							
						}
							
						</div>

					
			
				}
			/>
		)
	}
}

export default withStyles(styles, { withTheme: true })(PaymentDetail);