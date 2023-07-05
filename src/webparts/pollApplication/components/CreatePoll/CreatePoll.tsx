/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
import * as React from 'react';
import styles from '../PollApplication.module.scss';
import { Button, TextField } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, CloudLightning } from 'react-feather';
import { ToastMessage } from '../../../../services/toast';

const CreatePoll = (props: any) => {

    const [questions, setQuestion] = React.useState({
        id: uuidv4(),
        question: '',
        error: false,
    });
    const [inputFields, setInputFields] = React.useState([
        { id: uuidv4(), options: '', error: false },
        { id: uuidv4(), options: '', error: false },
    ]);

    const handleAddfields = () => {
        setInputFields([
            ...inputFields,
            { id: uuidv4(), options: '', error: false },
        ]);
    };

    const handleRemoveFields = (event: any, id: any) => {
        const values = [...inputFields];
        const remain = values.filter(value => value.id !== id)
        setInputFields(remain);
    };

    const handleQuestion = (id: any, event: { target: { value: any; }; }) => {
        setQuestion({ id: id, question: event.target.value, error: false });
    };

    const handleChangeInput = (id: string, event: any) => {
        const newInputFields = inputFields.map((i) => {
            if (id === i.id) {
                i.options = event.target.value;
            }
            return i;
        });
        setInputFields(newInputFields);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const isQuestionExists = questions.question.trim().length > 0;
        const isOptionExists = inputFields.every(obj => obj.options.length > 0);

        if (!isQuestionExists) {
            ToastMessage.toastWithoutConfirmation('error', 'Question Missing', 'Input your Question');
            setQuestion({ ...questions, error: true });
            return;
        }
        if (!isOptionExists) {
            ToastMessage.toastWithoutConfirmation('error', 'Option Missing', 'Input your all Options');
            setInputFields([...inputFields].map((object) => {
                if (object.options === '') {
                    return { ...object, error: true };
                } else return object;
            })
            );
            return;
        }
        else {
            const answerIds = inputFields.map(input => input.id);
            const questionListObj = {
                Title: questions.question.trim(),
                QuestionID: questions.id,
                AnswerID: answerIds.toString()
            };

            const answerListObj: any[] = inputFields.map(input => ({
                Title: input.options,
                AnswerID: input.id
            }));

            const res = await props.service.sumbitQuestionWithAnswers(questionListObj, answerListObj);
            if (res) {
                ToastMessage.toastWithoutConfirmation('success', 'Congrats...', 'Poll Created Successfully');
                await props.setPage({ PoolApplication: true, CreatePoll: false, SubmitVote: false, PoolResult: false });
            } else {
                ToastMessage.toastWithoutConfirmation('error', 'Action Faield', 'Poll not Created');
            }
        }
    };


    return (
        <div className={styles.ui_outer}>
            <div className={styles.ui_container} style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                <div >
                    <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        <div className={styles.ui_container_description}>
                            <div>
                                <h1>Create Poll</h1>
                                <p>Complete below fields to create a poll</p>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => props.setPage({ PoolApplication: true, CreatePoll: false, SubmitVote: false, PoolResult: false })}
                                >
                                    Back To Pool List
                                </Button>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {/* <label className={styles.question_label}>
                                    Poll Question
                                </label> */}
                                <TextField
                                    name="question"
                                    multiline={true}
                                    rows={3}
                                    className={styles.question_textfield}
                                    id="outlined-basic"
                                    label="Ask your Question"
                                    variant="filled"
                                    // value={questions.question}
                                    onChange={(event) => handleQuestion(questions.id, event)}
                                />
                            </div>
                            {
                                inputFields.map((inputField, index) => (
                                    <div style={{ marginTop: '.5rem', flexDirection: 'column' }}>
                                        <div style={{ marginBottom: '.75rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                {/* <label className={styles.option_label}>
                                                    Option {index + 1}
                                                </label> */}
                                                <div className={styles.option_div}>
                                                    <TextField
                                                        id={inputField.id}
                                                        name="options"
                                                        className={styles.option_textfield}
                                                        value={inputField.options}
                                                        label={'Option ' + (index + 1)}
                                                        variant="filled"
                                                        onChange={(event) => handleChangeInput(inputField.id, event)}
                                                    />

                                                    <button
                                                        hidden={inputFields.length === 2}
                                                        onClick={(event) => handleRemoveFields(event, inputField.id)}
                                                        className={styles.delete_option_button}
                                                    >
                                                        <Trash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))

                            }


                        </div>

                        <div className={styles.button_div}>
                            <button
                                type="button"
                                onClick={handleAddfields}
                            >
                                <span>Add another option</span>
                                <Plus />
                            </button>


                            <button
                                type="submit"
                                onClick={handleSubmit}
                            >
                                <CloudLightning />
                                <span>Create your poll</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CreatePoll;