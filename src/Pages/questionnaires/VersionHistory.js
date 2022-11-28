import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../api/axios";
import { ADD_QUESTIONNAIRE } from "../../api/Url";
import TableComponent from "../../components/TableComponent";

const VersionHistory = () => {
    const params = useParams();
    const navigate = useNavigate();
    const versionHistoryTableHeadColumns = [
        {
            id: "title",

            disablePadding: false,
            label: "Title",
        },

        // {
        //     id: "uuid",
        //     // width: "30%",
        //     disablePadding: false,
        //     // label: "Version Date",
        // },
        {
            id: "vNo",

            disablePadding: false,
            label: "Versions",
        },
        {
            id: "date",
            // width: "30%",
            disablePadding: false,
            label: "Version Date",
        },
    ];
    const [versionHistoryPage, setVersionHistoryPage] = React.useState(1);
    const [versionHistoryRowsPerPage, setVersionHistoryRowsPerPage] =
        React.useState(10);
    const [versionHistoryOrder, setVersionHistoryOrder] =
        React.useState("desc");
    const [versionHistoryOrderBy, setVersionHistoryOrderBy] =
        React.useState("");
    const [versionHistoryRecords, setVersionHistoryRecords] = React.useState(
        []
    );
    const [versionHistoryTotalRecords, setVersionHistoryTotalRecords] =
        React.useState(0);
    const [makeApiCall, setMakeApiCall] = useState(true);
    const [questionnaireTitle, setQuestionnaireTitle] = useState("");

    const generateUrl = () => {
        // console.log("Search", search);
        let url = `${ADD_QUESTIONNAIRE}/${params.id}/versions?page=${versionHistoryPage}&size=${versionHistoryRowsPerPage}&orderBy=${versionHistoryOrderBy}&order=${versionHistoryOrder}`;

        // if (search?.length >= 3) url += `&search=${search}`;

        return url;
    };

    const updateRecordsForVersionHistory = (data) => {
        const onboardedKeysOrder = ["title", "vNo", "date"];

        console.log("data before update----", data);

        let staleData = data;
        staleData.forEach((object) => {
            object["date"] = new Date(object["createdAt"]).toLocaleDateString(
                "en-US",
                {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                }
            );
            object["vNo"] = "v" + object["vNo"];
            // delete object["title"];
            delete object["createdAt"];

            onboardedKeysOrder.forEach((k) => {
                const v = object[k];
                delete object[k];
                object[k] = v;
            });
        });
        console.log("data in updaterecords method", staleData);
        setVersionHistoryRecords([...staleData]);
    };

    const getVersionHistory = async (
        isMounted = true,
        controller = new AbortController()
    ) => {
        try {
            let url = generateUrl();
            // setIsLoading(true);
            const response = await privateAxios.get(url, {
                signal: controller.signal,
            });
            // console.log(response.headers["x-total-count"]);
            setVersionHistoryTotalRecords(
                parseInt(response.headers["x-total-count"])
            );
            console.log("Response from version history api get", response);

            updateRecordsForVersionHistory([...response.data]);
            let title = response.data.filter((data) => data.uuid === params.id);
            setQuestionnaireTitle(title[0].title);
            // console.log("title from questionnaire = ", title);
            // setIsLoading(false);
        } catch (error) {
            if (error?.code === "ERR_CANCELED") return;
            // console.log(toasterDetails);
            console.log("Error from version history-------", error);

            if (error?.response?.status == 401) {
                // navigate("/login");
            }
            // setIsLoading(false);
        }
    };
    console.log("title from questionnaire = ", questionnaireTitle);

    const handleTablePageChange = (newPage) => {
        setVersionHistoryPage(newPage);
    };

    // rows per page method for onboarded tab
    const handleRowsPerPageChange = (event) => {
        setVersionHistoryRowsPerPage(parseInt(event.target.value, 10));
        setVersionHistoryPage(1);
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        makeApiCall && getVersionHistory(isMounted, controller);
        console.log("makeApiCall", makeApiCall);
        console.log("inside use Effect");
        return () => {
            isMounted = false;
            // clearTimeout(searchTimeout);
            controller.abort();
        };
    }, [
        versionHistoryPage,
        versionHistoryRowsPerPage,
        versionHistoryOrderBy,
        versionHistoryOrder,
        // filters,
        makeApiCall,
        setMakeApiCall,
        // searchTimeout,
    ]);

    const onClickVisibilityIconHandler = (uuid) => {
        console.log("id", uuid);
        return navigate(
            `/questionnaires/preview-questionnaire-version/${uuid}`
        );
    };

    return (
        <div className="page-wrapper">
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <ul className="breadcrumb">
                        <li>
                            <Link
                                // onClick={() => navigate(`/questionnaires`)}
                                to="/questionnaires"
                                style={{ cursor: "pointer" }}
                            >
                                Questionnaire
                            </Link>
                        </li>

                        <li>
                            <a
                                onClick={() =>
                                    navigate(
                                        `/questionnaires/preview-questionnaire/${params.id}`
                                    )
                                }
                                style={{ cursor: "pointer" }}
                            >
                                Preview Questionnaire
                            </a>
                        </li>

                        <li>Questionnaire history</li>
                    </ul>
                </div>
            </div>
            <div className="container">
                <div className="form-header flex-between">
                    <h2 className="heading2">Questionnaire history</h2>
                </div>
            </div>
            <section>
                <div className="container">
                    <div className="que-ttl-blk">
                        <div className="form-group">
                            <label htmlFor="emailid">
                                Questionnaire Title{" "}
                                <span className="mandatory">*</span>
                            </label>
                            <TextField
                                className={`input-field 
                                 
                                    // questionnaire.title === "" &&
                                    // globalSectionTitleError?.errMsg &&
                                     // "input-error"
                                // }`}
                                id="outlined-basic"
                                value={questionnaireTitle}
                                placeholder="Enter questionnaire title"
                                // inputProps={{
                                //   maxLength: 500,
                                // }}
                                disabled
                                variant="outlined"
                                // onChange={(e) => {
                                //     setQuestionnaire({
                                //         ...questionnaire,
                                //         title: e.target.value,
                                //     });
                                // }}
                                // onBlur={(e) =>
                                //     setQuestionnaire({
                                //         ...questionnaire,
                                //         title: e.target.value?.trim(),
                                //     })
                                // }
                                // helperText={
                                //     questionnaire.title === "" &&
                                //     globalSectionTitleError?.errMsg
                                //         ? "Enter the questionnaire title"
                                //         : " "
                                // }
                            />
                        </div>
                    </div>
                    <div className="member-info-wrapper table-content-wrap table-footer-btm-space">
                        <TableComponent
                            tableHead={versionHistoryTableHeadColumns}
                            records={versionHistoryRecords}
                            handleChangePage1={handleTablePageChange}
                            handleChangeRowsPerPage1={handleRowsPerPageChange}
                            page={versionHistoryPage}
                            rowsPerPage={versionHistoryRowsPerPage}
                            totalRecords={versionHistoryTotalRecords}
                            orderBy={versionHistoryOrderBy}
                            // icons={["visibility"]}
                            onClickVisibilityIconHandler1={
                                onClickVisibilityIconHandler
                            }
                            order={versionHistoryOrder}
                            setOrder={setVersionHistoryOrder}
                            setOrderBy={setVersionHistoryOrderBy}
                            setCheckBoxes={false}
                            //   setSelected={setSelected}
                            //   selected={selected}
                            onRowClick={true}
                            isQuestionnare={true}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VersionHistory;
