import React from 'react';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
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
import {BulkUploadConfig} from 'app/main/BulkUpload/BulkUploadConfig'
import {TerminationConfig} from 'app/main/Termination/TerminationConfig'
import {EmployeeVarianceReportDetailConfig} from 'app/main/EmployeeVarianceReportDetail/EmployeeVarianceReportDetailConfig'
import LoginConfig from 'app/main/Login/LoginConfig';
import DashboardConfig from 'app/main/Dashboard/DashboardConfig';
import {GtoNReportConfig} from 'app/main/GtoNReport/GtoNReportConfig';
import {CompanyApplicableLawConfig} from 'app/main/CompanyApplicableLaws/CompanyApplicableLawConfig';
import {GlReportConfig} from 'app/main/GlReport/GlReportConfig';
import {PaymentDetailConfig} from 'app/main/PaymentDetail/PaymentDetailConfig';

const routeConfigs = [
	BankConfig,CompanyConfig,CostCenterConfig,CountryLawsConfig,CurrencyExchangeConfig,EmployeeConfig,EmployeeDetailConfig,
	GLAccountConfig,GradesConfig,PayElementConfig,JobsConfig,PositionConfig,PayElementGlAccountConfig,UnitConfig,UnpaidLeavesConfig,UserProtectionConfig,
	SalaryPayRollConfig,EmployeeReportsConfig,EmployeeVarianceReportConfig,PayrollReportsConfig,TerminationConfig,EmployeeVarianceReportDetailConfig,BulkUploadConfig,
	LoginConfig,DashboardConfig,GtoNReportConfig,CompanyApplicableLawConfig,GlReportConfig,PaymentDetailConfig
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	{
		path: '/',
		component: () => <Redirect to="/login" />
	}
];

export default routes;
