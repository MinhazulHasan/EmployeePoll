/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
import * as React from 'react';
import GlobalStyles from '../PollApplication.module.scss';
import Styles from './PoolResult.module.scss';
import { Button } from '@material-ui/core';
// import randomColor from "randomColor";

const PoolResult = (props: any) => {
    const [totalVotes, setTotalVotes] = React.useState(0);

    React.useEffect(() => {
        const initialValue: number = 0;
        const calculatedTotalVotes = props.poolResult.AnswerList.reduce(
            (accumulator: number, currentValue: any) => accumulator + (currentValue.Responses ? currentValue.Responses.length : 0),
            initialValue
        )
        setTotalVotes(calculatedTotalVotes);
    }, [props.poolResult])

    return (
        <div className={GlobalStyles.ui_outer}>
            <div className={GlobalStyles.ui_container} style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                <h2 className={GlobalStyles.heading}>
                    {props.poolResult?.QuestionTitle}
                </h2>

                <div className={Styles.result_div}>

                    <div className={Styles.single_result_div}>
                        <div>
                            {props.poolResult?.AnswerList &&
                                props.poolResult?.AnswerList.map((response: any) => (
                                    <div className={Styles.result_card}>
                                        <div className={Styles.question_response}>
                                            <h2 style={{ paddingLeft: "20px" }}>
                                                {response.AnswerTitle}
                                            </h2>
                                            <h2 style={{ paddingRight: "20px" }}>
                                                {
                                                    totalVotes === 0 ? 0 :
                                                        (((response.Responses ? response.Responses?.length : 0) / totalVotes) * 100).toFixed(0)
                                                }
                                                %
                                            </h2>
                                        </div>

                                        <div className={Styles.result_bar_div}>
                                            <div
                                                style={{
                                                    width: `
                                                        ${totalVotes === 0 ? 0 :
                                                            ((response.Responses ? response.Responses?.length : 0) / totalVotes) * 100
                                                        }%`,
                                                    // backgroundColor: `${randomColor()}`,
                                                }}
                                            >
                                                &nbsp;
                                            </div>
                                        </div>

                                        <p className={Styles.vote_count}>
                                            {response.Responses ? response.Responses?.length : 0} Votes
                                        </p>

                                    </div>
                                ))
                            }

                        </div>
                    </div>

                    <div className={Styles.summery_div}>
                        <div className={Styles.opinion}>
                            <p>Total Votes: {totalVotes ? totalVotes : 0}</p>
                        </div>
                        <Button
                            variant="contained"
                            color='primary'
                            onClick={() => props.setPage({ PoolApplication: true, CreatePoll: false, SubmitVote: false, PoolResult: false })}
                        >
                            Back To Poll List
                        </Button>
                    </div>

                </div>


            </div>


        </div>
    );
};

export default PoolResult;