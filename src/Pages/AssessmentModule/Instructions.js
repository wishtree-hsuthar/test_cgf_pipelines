import React from 'react'
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useDocumentTitle } from "../../utils/useDocumentTitle";
import { Link, useNavigate } from 'react-router-dom';
import "../../components/TableComponent.css";

function Instructions() {
    const navigate = useNavigate();
    useDocumentTitle("Instructions");
    return (
        <div className="page-wrapper">
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link to="/assessment-list">Assessments</Link>
                        </li>
                        <li>Instructions</li>
                    </ul>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="form-header member-form-header mb-0 mt-0">
                        <div className="form-header-left-blk">
                            <h2 className="heading2">Instructions: HRDD Self Assessment Tool on Forced Labour for Own Operations </h2>
                        </div>
                    </div>
                    <div className='instruct-table-sect'>
                        <div className="table-content-wrap">
                            <Box
                                sx={{ width: "100%" }}
                                className="table-blk table-blk-without-checkbox"
                            >
                                <Paper sx={{ width: "100%", mb: 2 }}>
                                    <TableContainer>
                                        <Table
                                            sx={{ minWidth: 750 }}
                                            aria-labelledby="tableTitle"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell colSpan={2} className="table-header"><span>Guidance</span></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        What the HRDD self assessment is aiming for?
                                                    </TableCell>
                                                    <TableCell>
                                                        The HRDD Self-assessment aims to capture baseline information and progress over time of a company's management systems to address forced labour. It is one of the pillars of a Human Rights Due Diligence (HRDD) system. Objectives of conducting HRDD self assessment are to;
                                                        <ul className='instruct-table-listblk'>
                                                            <li>become aware of the actual business practices that could impact human rights</li>
                                                            <li>enable prioritisation and managing the areas of greatest risk and leverage</li>
                                                            <li>identifying any implementation gaps and  future plans to address them</li>
                                                            <li>support measuring process in a reporting framework and understand what steps have been taken to fulfil the various maturity levels as defined by The Consumer Goods Forum- Human Rights Coalition (CGF-HRC)</li>
                                                        </ul>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Who is the target group for the self assessment?
                                                    </TableCell>
                                                    <TableCell>
                                                        This HRDD self assessment is developed for the CGF-HRC members and their own operation.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Who should fill out the tool?
                                                    </TableCell>
                                                    <TableCell>
                                                        The tool may be filled in a participatory manner by various persons/departments located at the company headquarters, regional, or country level. Potential responsible staff could be from sustainability, human rights, legal, social compliance, human resource, procurement, operations, sourcing, public relations, etc.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        How to approach to the self assessment exercise? (Dimensions)
                                                    </TableCell>
                                                    <TableCell className='instruct-red'>
                                                        HRDD self assessment should be filled at four levels<br />
                                                        A. HEADQUARTER ALL OPERATIONS HRDD - should be filled for all own operations at the global level.<br />
                                                        B. GLOBAL SELECT OPERATION HRDD - should be filled for one select operation at the global level.<br />
                                                        C. COUNTRY OPERATION HRDD -  should be filled for one country for one select operation.<br />
                                                        D. SITE VISIT  - should be filled for one sampled site for the select operation in one country.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        What are the examples of operations?
                                                    </TableCell>
                                                    <TableCell>
                                                        Some examples of operations are: manufacturing, cleaning, security, gardening, catering service provider, warehouse, distribution centre, logistic, transportation, marketing, sales, promotion, car wash, pet clinics, construction for maintenance, retail store etc. <br />
                                                        The tool should be filled at the operation and country level. Example: Warehousing operations in Pakistan; Manufacturing operations in France, etc.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        How the tool will measure company's Human Rights Due Diligence (HRDD)  maturity level? (Measures)
                                                    </TableCell>
                                                    <TableCell>
                                                        CGF-HRC member companies will assess their HRDD system based on three stages of maturity as defined together by the coalition- <span className="instruct-txt-bold-underline">Launched, Established, Leadership.</span> Please see definitions section. "Not Initiated" is introduced to capture information if the company has not taken any action.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        How frequent the tool should be filled out?  (Frequency)
                                                    </TableCell>
                                                    <TableCell>
                                                        Companies should undertake this self assessment annually to review progress <span className="instruct-txt-bold-underline">OR</span> until they achieve the Leadership level.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        How to fill out the self assessment tool?
                                                    </TableCell>
                                                    <TableCell>
                                                        There are light orange coloured cells in the tools that need to be filled. With the exception of (Further Comments) other columns are mandatory to be filled. <br />
                                                        1. ("Select Answer") where you will select the existing status of the operation/country HRDD system - Not Initiated/Launched /Established/Leadership - from a drop down menu. <br />
                                                        2. ("Evidence of Implementation)  where you will provide the name of the document or reference or link to company policy, procedure or process. <br />
                                                        3. ("Further comments") Further observations could be filled to elaborate the answer, if needed. It is optional. <br />

                                                        <span style={{ margin: "10px 0", display: "block" }}>As a first step, the Headquarters level staff should review the tool and designate a person who will oversee the CGF-HRC project over the next 60 months. This HQ level person should either fill or delegate responsibility for the Tab A to be filled at the HQ level for all operations. Similarly a person to coordinate the filling of Tab B Global Operations HRDD should be identified. This tool, starts to map the global scale of the selected operation. Once the selected operation have been identified, priority country/ies should be identified to pilot the tool. Tab C should be filled at the selected operation and country level. Finally, once all the sites are identified in a country for the selectedw operation, sampled sites are to be visited and Tab D Facility Level Assessment Tool will be filled. </span>

                                                        The Tool should be updated annually with updated information to capture the progress company is making overtime to move from Launched to Established to Leadership Levels.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ backgroundColor: 'rgba(253,234,255,0.5)' }}>
                                                        Light Orange Coloured Cells
                                                    </TableCell>
                                                    <TableCell>
                                                        Please provide your responses in the light orange colours cells. In the HRDD Section of the tool, once you have selected the answer, the colour of the cell will change to green. If you wish to undo your response, please go to the top of the tab (formula bar) and delete the answer from the top. The colour of the cell will go back to Orange.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ backgroundColor: 'rgba(215,228,189,0.5)' }}>
                                                        Green Coloured Cells
                                                    </TableCell>
                                                    <TableCell>
                                                        All answers will be automatically coloured in green when answered. This will facilitate the identification of questions that have not been responded to. The colour does not reflect various maturity levels. It only reflects if the question has been answered.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        What if the question is Not Applicable for my operation? Or if I only have one type of workers in my operations.
                                                    </TableCell>
                                                    <TableCell>
                                                        If the question is not applicable, please select the highest level of maturity level. For example, if a company does not have third party workers  they can mark Leadership if they are achieving the KPIs for their directly hired workers. OR If the company only has third party workers for an operation, then the company can only select Leadership Level once the benchmark has been fulfilled.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Scoring
                                                    </TableCell>
                                                    <TableCell>
                                                        Each question is equally weighed. Each question will be scored from 0-3 depending on the maturity level selected.  Following scores will be allocated.<br />
                                                        <span className="instruct-red">Not Initiated: 0 &nbsp;&nbsp;&nbsp;&nbsp; Launched: 1 &nbsp;&nbsp;&nbsp;&nbsp; Established: 2 &nbsp;&nbsp;&nbsp;&nbsp; Leadership: 3 </span>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        How to read the results?
                                                    </TableCell>
                                                    <TableCell>
                                                        The final score will be automatically calculated once all questions are answered, and presented as a bar graph and radar graph (or spider diagram) on the HRDD Level Result and Maturity Level Result tabs. The tool presents the results per assessment area. The radar graph contains a red zone which depicts the foundational requirements. Being in the red zone means that implementation is necessary to reach the "Launched" level.  Beyond this zone, the company can show progress in reaching "Established"  and "Leadership" levels.
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Box>
                        </div>

                        <div className="table-content-wrap">
                            <Box
                                sx={{ width: "100%" }}
                                className="table-blk table-blk-without-checkbox"
                            >
                                <Paper sx={{ width: "100%", mb: 2 }}>
                                    <TableContainer>
                                        <Table
                                            sx={{ minWidth: 750 }}
                                            aria-labelledby="tableTitle"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell colSpan={2} className="table-header"><span>Terms Used In This Tool</span></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        Company
                                                    </TableCell>
                                                    <TableCell>
                                                        All members of the CGF-HRC Coalition who have committed to CGF's Maturity Journey Framework for Human Rights Due Diligence (HRDD) Systems Focused on Forced Labour in Own Operations.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>

                                                    <TableCell colSpan={2} className="instruct-inner-cell">
                                                        <Table sx={{ minWidth: 650 }}
                                                            aria-labelledby="tableTitle" className='instruct-inner-table'>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        Human Rights Due Diligence (HRDD)
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Due Diligence is an ongoing risk management process to identify, prevent, mitigate and account for how a company addresses its actual and potential human rights impacts. The CGF-HRC framework recommends the following six key components:
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        1. Policy Commitment and Governance
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        There is a publicly available commitment and policy against forced labour aligned with the Priority Industry Principles (PIPs), UNGPs, or other internationally recognised instruments pertaining to forced labour risks. Governance and management systems are established to be conducive of the commitment against forced labour relating to direct labour in own operations and have expanded to any third-party labour engaged by contractors, sub-contractors or third party service providers/ labour agencies for the performance of ongoing work in own operations.
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        2. Assess Human Right Potential & Actual Impacts
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        A process to identify forced labour risks in own operations is being developed. The process should include assessing actual and potential human rights impacts. Forced labour assessment processes and tools are actively and regularly conducted covering full scope of own operations globally (including areas such as warehouses and logistics sites and all offices, etc.) including direct and third-party labour. Companies may deploy different processes and tools in particular parts of their own operations, depending upon risk.
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        3. Integrate & Act in Order to Prevent & Mitigate
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        With the governance and management system in place, the forced labour commitment is communicated internally and relevant staff (e.g. Procurement / Human Resources) trained. A grievance mechanism that is guided by the UNGPs, for direct labour is being developed. Grievance mechanisms are available for directly hired workers and  third-party workers working regularly on own sites either through own or the contractors’, sub-contractors’ or labour agencies' mechanism. As identified through the assessment processes and established grievance mechanisms, necessary actions are taken, to mitigate forced labour risks relating to their directly hired workers and third party workers working regularly on all own operation sites.
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        4. Track the Effectiveness of Responses
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Outputs relating to addressing forced labour risks are monitored and impact tracked over time: e.g. compliance status, action plan implementation. Outcomes relating to addressing forced labour risks are monitored and impact tracked over time: e.g. reduction in number of grievances received by facility; reduction in recruitment fees paid by workers, if any, etc.
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        5. Report
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        There is annual public reporting about the Company’s approach to addressing forced labour through HRDD. Annual public reporting includes: issues related to forced labour found in company’s own operations identified through HRDD, the mitigation steps taken and outcomes.
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        6. Remedy
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        Effective remediation measures for forced labour impacts are being explored, including through collaborative actions. Remediation processes are in place for addressing forced labour for all own operations. Necessary actions are taken, with relevant contractors/labour agencies etc., on a risk basis, to enable them to address forced labour relating to direct labour working regularly on all own operations’ sites.
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableCell>

                                                </TableRow>

                                                <TableRow>
                                                    <TableCell>
                                                        Own Operations
                                                    </TableCell>
                                                    <TableCell>
                                                        CGF-HRC defines this as the company itself, the entities it owns, the entities in which it holds a majority of voting shares and  the facilities it manages. Contractors, sub-contractors or agencies supplying a company with labour or services in facilities that that company directly manages should also implement similar employment practices so as to mitigate the risks of forced labour.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Operations
                                                    </TableCell>
                                                    <TableCell>
                                                        E.g., Facility services, cleaning, security, transportation, logistics, marketing/advertising/promotion, canteen/kitchen/catering, call centre, maintenance, construction, warehousing, distribution, retail/franchise, commercial offices, etc. <br />
                                                        Note: These identified  categories are illustrative and are not intended to be the authoritative or exhaustive list of “operations”.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Worker
                                                    </TableCell>
                                                    <TableCell>
                                                        For the purposes of identifying and addressing forced labour risks to workers in "own operations", the definition of “worker" in this tool includes: any worker <span className="instruct-txt-bold-underline">directly hired by the company or third party workers</span> engaged by contractors, sub contractor, or labour agencies (including temporary or seasonal workers) for the performance of regular and ongoing work in own onsite.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Not Initiated
                                                    </TableCell>
                                                    <TableCell>
                                                        The company has not taken any action in relation to the relevant HRDD step.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Launched
                                                    </TableCell>
                                                    <TableCell>
                                                        Initial, <span style={{ color: 'red', textDecoration: 'underline', fontFamily: 'ProximaNova-Semibold' }}>basic steps</span> towards human rights due diligence addressing forced labour risks in own operations are in place and provide a foundation for future programme growth.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Established
                                                    </TableCell>
                                                    <TableCell>
                                                        A functional human rights due diligence programme addressing forced labour risks for own operations is in place and is actively deployed for <span style={{ color: 'red', textDecoration: 'underline', fontFamily: 'ProximaNova-Semibold' }}>prioritised locations.</span>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Leadership
                                                    </TableCell>
                                                    <TableCell>
                                                        A human rights due diligence programme for forced labour risks in own operations is in place for <span style={{ color: 'red', textDecoration: 'underline', fontFamily: 'ProximaNova-Semibold' }}>all locations</span> and delivering outcomes for vulnerable workers.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Policy for Responsible Business Conduct
                                                    </TableCell>
                                                    <TableCell>
                                                        Company's internal policy on main HRDD components. (e.g. forced labour)
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Guideline Topic Area
                                                    </TableCell>
                                                    <TableCell>
                                                        Main topic corresponding to CGF six-step HRDD system.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Sub-topic
                                                    </TableCell>
                                                    <TableCell>
                                                        Related to the sub items of the topic or related topics.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Requirements
                                                    </TableCell>
                                                    <TableCell>
                                                        Elements that are required to confirm a positive answer and which could be evidenced.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Recommended practices and guidance
                                                    </TableCell>
                                                    <TableCell>
                                                        Guidance on interpretation of the question and recommendations based on best practices regarding the question which can serve as input for remediation plans.
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Box>
                        </div>

                        <div className="table-content-wrap">
                            <Box
                                sx={{ width: "100%" }}
                                className="table-blk table-blk-without-checkbox"
                            >
                                <Paper sx={{ width: "100%", mb: 2 }}>
                                    <TableContainer>
                                        <Table
                                            sx={{ minWidth: 750 }}
                                            aria-labelledby="tableTitle"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell colSpan={2} className="table-header"><span>Forced Labour Concepts (Adapted From Various ILO Documents)</span></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        Forced Labour
                                                    </TableCell>
                                                    <TableCell>
                                                        The ILO Forced Labour Convention, 1930 (No. 29) defines, in its Article 2, forced or compulsory labour for the purposes of the Convention as “all work or service which is exacted from any person under the menace of any penalty and for which the said person has not offered himself voluntarily.” A person is classified as being in forced labour if engaged during a specified reference period in any work that is both under the threat of menace of a penalty and involuntary. Both conditions must exist for this to be statistically regarded as forced labour.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Threat of menace of a penalty
                                                    </TableCell>
                                                    <TableCell>
                                                        Threat and menace of any penalty are the means of coercion used to impose work on a worker against his or her will. Workers can be actually subjected to coercion, or verbally threatened by these elements of coercion, or be witness to coercion imposed on other co‐workers in relation to involuntary work. Elements of coercion may include, inter alia, threats or violence against workers or workers’ families and relatives, or close associates; restrictions on workers’ movement; debt bondage or manipulation of debt; withholding of wages or other promised benefits; withholding of valuable documents (such as identity documents or residence permits); and abuse of workers’ vulnerability through the denial of rights or privileges, threats of dismissal or deportation.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Involuntary
                                                    </TableCell>
                                                    <TableCell>
                                                        Involuntary work refers to any work taking place without the free and informed consent of the worker. Circumstances that may give rise to involuntary work, when undertaken under deception or uninformed, include, inter alia, unfree recruitment at birth or through transaction such as slavery or bonded labour; situations in which the worker must perform a job of different nature from that specified during recruitment without his or her consent; abusive requirements for overtime or on‐call work that were not previously agreed with the employer; work in hazardous conditions to which the worker has not consented, with or without compensation or protective equipment; work with very low or no wages; in degrading living conditions imposed by the employer; work for other employers than agreed; work for longer period of time than agreed; work with no or limited freedom to terminate work contract.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Reference Period
                                                    </TableCell>
                                                    <TableCell>
                                                        The reference period may be short such as last week, last month or last season, or long such as the past year, the past two years, the past five years or lifetime. A short reference period may be appropriate where the concern is the measurement of forced labour among a particular category of workers. A long reference period may be appropriate where the concern is the measurement of forced labour among a general population group.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        ILO's 11 Indicators of Forced Labour <br /><span style={{ wordBreak: "break-all" }}>https://www.ilo.org/wcmsp5/groups/public/---ed_norm/---declaration/documents/publication/wcms_203832.pdf </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        1. Abuse of vulnerability <br />
                                                        2. Deception <br />
                                                        3. Restriction of movement <br />
                                                        4. Isolation <br />
                                                        5.Physical and sexual violence <br />
                                                        6. Intimidation and threats <br />
                                                        7. Retention of identity documents <br />
                                                        8. Withholding of wages <br />
                                                        9. Debt bondage <br />
                                                        10. Abusive working and living conditions <br />
                                                        11. Excessive overtime
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Standard employment relationship
                                                    </TableCell>
                                                    <TableCell>
                                                        Work that is full time, indefinite, as well as part of a subordinate relationship between an employee and an employer.
                                                    </TableCell>
                                                </TableRow>

                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Box>
                        </div>

                        <div className="table-content-wrap">
                            <Box
                                sx={{ width: "100%" }}
                                className="table-blk table-blk-without-checkbox"
                            >
                                <Paper sx={{ width: "100%", mb: 2 }}>
                                    <TableContainer>
                                        <Table
                                            sx={{ minWidth: 750 }}
                                            aria-labelledby="tableTitle"
                                        >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell colSpan={2} className="table-header"><span>UNGP 8 Effectiveness Criteria for Grievance Mechanisms (GM)</span></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>
                                                        Accessible
                                                    </TableCell>
                                                    <TableCell>
                                                        Grievance mechanism should be know to all workers. It should be written in a language understood by the workers. In the event where illiteracy rate is high, the grievance mechanism is translated into infographic and poster format - easily understood by the workers. The mechanisms should be free-of-cost so that workers can easily access them. The workers should be made aware of the grievance mechanism(s) through various means.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Legitimate
                                                    </TableCell>
                                                    <TableCell>
                                                        Grievance mechanism should be trusted by its intended users. GM continuously reviewed with the view to further improve its delivery and effectiveness. For improvement of grievance mechanism, various stakeholder should be consulted including workers or workers' representatives in the design or redesign (improvement) of the grievance mechanism. This engagement can be in any formats such as dialogue, consultation, roundtable, survey, etc. Any engagement with the workers or workers' representatives must be documented (e.g., attendance, meeting minutes, picture, etc.). There should be a process to ensure that any party cannot interfere with its fair conduct. This can be achieved in some cases through a formal and independent oversight structure.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Rights Compatible
                                                    </TableCell>
                                                    <TableCell>
                                                        Grievance mechanism should guarantee non-retaliation and confidentiality of the worker complainants, and the process, outcomes, and remedy is in accordance with the international standards. Company should inform workers on the aspects of non-retaliation and confidentiality of its grievance mechanism. The company shall ensure that any methods of grievance platform, including using mobile technologies, do not in any way reveal the workers' personal information. The company should continuously encourage workers to use the internal grievance mechanism, to the extent possible, through regular communication updates and in any social dialogue platforms with the workers.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Source of Continuous Learning
                                                    </TableCell>
                                                    <TableCell>
                                                        The GM should have a mechanism to identify lessons for improving the mechanism and preventing future grievances and harm. There should be regular analysis of the frequency, patterns, and causes of grievances. There should be a process to seek feedback from the intended users. Wider policies of an organisation can be informed by the outcome of the grievance mechanism.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Equitable
                                                    </TableCell>
                                                    <TableCell>
                                                        All complainants should have reasonable access to information, advice and expertise necessary to enable them to engage in a grievance process on fair, informed and respectful terms. Available resources and individual experts should be identified to provide necessary support to worker complainants (either internally in a company or such services outside the organisation).
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Predictable
                                                    </TableCell>
                                                    <TableCell>
                                                        Grievance procedure should have a clear timeframe for each stage of the grievance handling, and clarity on the different types of process involved and the means of implementation.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Transparent
                                                    </TableCell>
                                                    <TableCell>
                                                        The GM procedures should be structured in a way that keep the parties informed about the progress of their grievance. It should provide sufficient evidence to build confidence in its effectiveness and meet any public interest at stake. GM should have a clear and effective communication process to ensure the progress and outcome of the grievances are communicated to worker complainants sufficiently and in a timely manner. Effective communication of the grievance process helps strengthen worker complainants' confidence and trust on the grievance mechanism and outcome.
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>
                                                        Based on Engagement and Dialogue
                                                    </TableCell>
                                                    <TableCell>
                                                        The GM design, redesign, addressing of the issues should be done based on consultations held with the intended users (workers, other stakeholders).  There should be a written procedure, as part of the grievance handling process - for engagement and social dialogue with worker complainants or other workers' representatives where appropriate for resolution. Any solution deriving from the grievance process should aim to address root causes and benefit workers at large.
                                                    </TableCell>
                                                </TableRow>

                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Box>
                        </div>

                    </div>
                    <div className="form-btn flex-between add-members-btn">
                        <button
                        type="submit"
                        style={{ marginBottom: "50px" }}
                        className="secondary-button"
                        onClick={() => navigate(-1)}
                        >
                        Back
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Instructions