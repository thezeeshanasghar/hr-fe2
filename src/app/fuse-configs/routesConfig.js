import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import ExampleConfig from 'app/main/example/ExampleConfig';
import {BankConfig} from 'app/main/Bank/BankConfig';
import {CompanyConfig} from 'app/main/company/CompanyConfig';
import {CostCenterConfig} from 'app/main/CostCenter/CostCenterConfig';
import {CountryLawsConfig} from 'app/main/CountryLaws/CountryLawsConfig';
import {CurrencyExchangeConfig} from 'app/main/CurrencyExchange/CurrencyExchangeConfig';
import {EmployeeConfig} from 'app/main/Employee/EmployeeConfig';
import {EmployeeDetailConfig} from 'app/main/EmployeDetail/EmployeeDetailConfig'; 
import {GLAccountConfig} from 'app/main/GLAccount/GLAccountConfig';
import {GradesConfig} from 'app/main/Grades/GradesConfig';
import {PayElementConfig} from 'app/main/PayElement/PayElementConfig';
import {JobsConfig} from 'app/main/Jobs/JobsConfig';
import {PositionConfig} from 'app/main/Position/PositionConfig';
import {PayElementGlAccountConfig} from 'app/main/PayElementGlAccount/PayElementGlAccountConfig';
import {UnitConfig} from 'app/main/Unit/UnitConfig';
import {UnpaidLeavesConfig} from 'app/main/UnpaidLeaves/UnpaidLeavesConfig';
import {UserProtectionConfig} from 'app/main/UserProtection/UserProtectionConfig';
import {SalaryPayRollConfig} from 'app/main/SalaryPayRoll/SalaryPayRollConfig.js'
import {EmployeeReportsConfig} from 'app/main/EmployeeReports/EmployeeReportsConfig'
import {EmployeeVarianceReportConfig} from 'app/main/EmployeeVarianceReport/EmployeeVarianceReportConfig'
import {PayrollReportsConfig} from 'app/main/PayrollReports/PayrollReportsConfig'
import {TerminationConfig} from 'app/main/Termination/TerminationConfig'
import {EmployeeVarianceReportDetailConfig} from 'app/main/EmployeeVarianceReportDetail/EmployeeVarianceReportDetailConfig'


const routeConfigs = [
	ExampleConfig,BankConfig,CompanyConfig,CostCenterConfig,CountryLawsConfig,CurrencyExchangeConfig,EmployeeConfig,EmployeeDetailConfig,
	GLAccountConfig,GradesConfig,PayElementConfig,JobsConfig,PositionConfig,PayElementGlAccountConfig,UnitConfig,UnpaidLeavesConfig,UserProtectionConfig,
	SalaryPayRollConfig,EmployeeReportsConfig,EmployeeVarianceReportConfig,PayrollReportsConfig,TerminationConfig,EmployeeVarianceReportDetailConfig
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		component: () => <Redirect to="/example" />
	}
];

export default routes;
