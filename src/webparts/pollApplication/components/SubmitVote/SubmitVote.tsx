/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
import * as React from "react";
import GlobalStyles from "../PollApplication.module.scss";
import Styles from "./SubmitVote.module.scss";
import { Button } from "@material-ui/core";
import { IAnswerList, IpoolInfo } from "./ISubmitVoteProps";
import { ToastMessage } from "../../../../services/toast";
import { UploadCloud } from "react-feather";

const SubmitVote = (props: any) => {
    const [poolInfo, setPollInfo] = React.useState(null);
    const [responseId, setResponseId] = React.useState("");

    const getPollInfo = async () => {
        const poolInfoFromList: IpoolInfo = await props.service.getPollDetails(props.pool);
        setPollInfo(poolInfoFromList);
    };

    const getPollResult = async () => {
        const poolResult: IpoolInfo = await props.service.getPollDetails(props.pool);
        props.setPoolResult(poolResult)
        props.setPage({ PoolApplication: false, CreatePoll: false, SubmitVote: false, PoolResult: true })
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (responseId !== "") {
            const res = await props.service.submitVote(responseId);
            if (res) {
                ToastMessage.toastWithoutConfirmation('success', 'Congrats...', 'Your vote has been successful!');
                getPollResult();
            }
            else {
                ToastMessage.toastWithoutConfirmation('error', 'Action Faield...', "Your vote hasn't been successful!");
            }
        }
        else {
            ToastMessage.toastWithConfirmation('error', 'Action Faield...', "Please select an option first!");
        }
    };

    const checkCheckboxByClickingDiv = (checkboxId: string) => {
        const checkbox: any = document.getElementById(checkboxId);
        checkbox.checked = true;
        setResponseId(checkboxId);
    }

    React.useEffect(() => {
        getPollInfo();
    }, [props.pool]);

    return (
        <div className={GlobalStyles.ui_outer}>
            <div className={GlobalStyles.ui_container} style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => props.setPage({ PoolApplication: true, CreatePoll: false, SubmitVote: false, PoolResult: false })}
                        >
                            Back To Pool List
                        </Button>
                    </div>
                    <h2 className={GlobalStyles.heading}>
                        {poolInfo && poolInfo?.QuestionTitle}
                    </h2>
                    <div className={Styles.create_pool_option_div}>
                        <div>
                            {poolInfo?.AnswerList?.map((option: IAnswerList) => (
                                <div className={Styles.form_div} key={option.AnswerId} onClick={() => checkCheckboxByClickingDiv(option.AnswerId)}>
                                    <div>
                                        <input
                                            type="radio"
                                            id={option.AnswerId}
                                            name="option"
                                            value={option.AnswerTitle}
                                        />
                                        <label>
                                            <h4>{option.AnswerTitle}</h4>
                                        </label>
                                    </div>
                                </div>
                            ))}

                            <div className={Styles.button_div}>
                                <button onClick={handleSubmit}>
                                    <UploadCloud />
                                    <span>Submit your vote</span>
                                </button>

                                <span onClick={getPollResult} className={Styles.view_result}>View Results</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitVote;
