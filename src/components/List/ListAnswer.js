import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import ListNoAnswer from "./ListNoAnswer";
import { Alert } from "../util/alert_modal/Alert";

import modify_normal from "../../styles/images/modify_normal.png";
import Line from "../../styles/images/Line45.png";
import delete_normal from "../../styles/images/delete_normal.png";
import toggle_unselected from "../../styles/images/list_private.png";
import toggle_selected from "../../styles/images/list_public.png";
import girl from "../../styles/images/Mask Group.png";
import "../../styles/List.css";

export default function ListAnswer({
    question,
    showDelete,
    answerAllData,
    stateOpen,
    stateClose,
    public_answer,
    month,
    selectedYear,
    member_num,
    day31,
    setQuestion,
    calender,
}) {
    const dt = new Date();
    let nowDate =
        dt.getFullYear().toString() +
        (dt.getMonth() + 1).toString().padStart(2, "0") +
        dt.getDate().toString().padStart(2, "0");

    const history = useHistory();
    const monthToString = month + "";
    const targetDate =
        selectedYear.toString() + monthToString.padStart(2, "0") + day31.getDate().toString().padStart(2, "0");

    const [answersFromTrash, setAnswersFromTrash] = useState([]);
    const [isInTrash, setIsInTrash] = useState(false);
    const [todayAnswersInTrash, setTodayAnswersInTrash] = useState([]);
    const [alertTrash, setAlertTrash] = useState(false);

    const getAnswersFromTrash = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_IP}/trashes/${member_num}`);

            setAnswersFromTrash(res.data);
        } catch (error) {
            console.log("error: ", error);
            history.push("/error");
        }
    };

    const filter = () => {
        const res = answersFromTrash.filter((v) => {
            if (v.answer_year + v.answer_date === nowDate) {
                return v;
            }
        });
        if (res.length > 0) {
            setTodayAnswersInTrash(res);
            setIsInTrash(true);
        }
    };

    useEffect(() => {
        getAnswersFromTrash();
    }, []);

    useEffect(() => {
        filter();
    }, [answersFromTrash]);

    function TodayWrite() {
        const location = useLocation();
        const handleClick = () => {
            location.onClicked = true;
            if (location.onClicked && isInTrash) {
                setAlertTrash(true);
            } else {
                history.push("/write");
            }
        };
        return (
            <div>
                <div className="TodayWrite">
                    <div>
                        <img src={girl} alt="ㅎㅇ"></img>
                        <p>오늘의 질문입니다. 지금은 나의 생각을 남겨보세요!</p>
                    </div>
                    <a>
                        <p onClick={handleClick}>답변작성하기</p>
                    </a>
                </div>
            </div>
        );
    }

    const closeAlertAnswerInTrash = () => {
        setAlertTrash(false);
    };

    return (
        <div className="List">
            {answerAllData.length > 0 ? (
                answerAllData.map((data, index) => {
                    return (
                        <div className="list" key={data.answer_num}>
                            <hr></hr>
                            <div className="watch">
                                <p>{data.answer_year}년의 나:</p>
                                <p>{data.answer}</p>
                            </div>
                            <div className="buttons">
                                {public_answer[index] === "Y" ? (
                                    <img src={toggle_selected} alt="public" onClick={() => stateOpen(index)}></img>
                                ) : (
                                    <img src={toggle_unselected} alt="private" onClick={() => stateClose(index)}></img>
                                )}
                                {targetDate === nowDate ? (
                                    <>
                                        <Link
                                            to={{
                                                pathname: `/write/${data.answer_num}`,
                                                state: { data, question },
                                            }}
                                        >
                                            <div>
                                                <img src={modify_normal}></img>
                                            </div>
                                        </Link>
                                        <img src={Line}></img>
                                    </>
                                ) : null}

                                <div style={{ cursor: "pointer" }} onClick={() => showDelete(index)}>
                                    <img src={delete_normal}></img>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : // <TodayWrite />
            targetDate === nowDate ? (
                <TodayWrite todayAnswersInTrash={todayAnswersInTrash} />
            ) : !calender ? (
                <ListNoAnswer setQuestion={setQuestion} />
            ) : (
                <ListNoAnswer setQuestion={setQuestion} />
            )}

            {alertTrash ? <Alert content="answerInTrash" closeDeleteAlert={closeAlertAnswerInTrash} /> : null}
        </div>
    );
}
