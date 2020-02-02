import React, { Component } from 'react';
import axios from 'axios';

import './css/MyCourse.css';

class MyCourse extends Component {
    intervalID;
    constructor(props){
        super(props);

        this.state = {
            click: '신청과목',
            click_1: 'select',
            click_2: 'nonselect',
            dis:""
        };
        this.button = this.button.bind(this);
        this.getTable=this.getTable.bind(this);
    }


    componentDidMount(){
        this.getData();
        this.intervalID=setInterval(this.getData.bind(this),1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }   

    getData = () => {
        var time = new Date();
        //if(time.getHours() >= 10 && time.getHours() < 18){ // 원래 조건, 테스트 위해 ||
        //if (time.getHours() >= 10 || time.getHours() < 18) // 테스트 조건 
        if(time.getHours() >= 10 || time.getHours() < 18) {
             if(this.state.dis==="disabled"){
                 this.setState({dis:""});
             }
        }
        else{
             if(this.state.dis===""){
             this.setState({dis:"disabled"});
            }
        }
     }

    
    button = (e) => {
        if(e.currentTarget.value === "신청과목") {
            this.setState(
                {click: '신청과목',
                click_1: 'select',
                click_2: 'nonselect'}
            );
        }
        else {
            this.setState(
                {click: '예비과목',
                click_1: 'nonselect',
                click_2: 'select'}
            );
        }
    }

    //클릭한 버튼에 따라 신청강의/예비강의 목록 출력 (강의실, 강의언어 제외)
    getTable = () => {
        let data;
        let table=[];

        //신청과목에서 삭제
        if(this.state.click === '신청과목') {
            data=this.props.res_enrolment;

            table.push(
                data.map((data,i)=>{
                    return(
                    <tr key={i}>
                        <td><input type = "button" value = "취소" disabled={this.state.dis}
                                    onClick = {function setQuery() {
                                                var Q = {
                                                    Stu_ID: window.localStorage.getItem('ID'),
                                                    Course_Id: document.getElementById("enrolment_Course_Id"+i).innerHTML,
                                                    College: document.getElementById("enrolment_College"+i).innerHTML,
                                                    Dept: document.getElementById("enrolment_Dept"+i).innerHTML,
                                                    Class: document.getElementById("enrolment_Class"+i).innerHTML,
                                                    Course_Title: document.getElementById("enrolment_Course_Title"+i).innerHTML,
                                                    Credit: document.getElementById("enrolment_Credit"+i).innerHTML
                                                }; //선택한 row 값 저장
                                                
                                                this._deleteEnrolment(Q);
                                    }.bind(this)}>
                        </input></td>
                        <td>{i+1}</td>
                        <td id = {"enrolment_Course_Id"+i}>{data.Course_Id}</td>
                        <td id = {"enrolment_Class"+i}>{data.Class}</td>
                        <td id = {"enrolment_Course_Title"+i}>{data.Course_Title}</td>
                        <td id = {"enrolment_College"+i}>{data.College}</td>
                        <td id = {"enrolment_Dept"+i}>{data.Dept}</td>
                        <td>{data.Completion_Type}</td>
                        <td id = {"enrolment_Credit"+i}>{data.Credit}.0</td>
                        <td>{data.Grade}</td>
                        <td>{data.Pro_Name}</td>
                        <td>{data.Course_Time}</td>
                        <td>{data.Domain}</td>
                        <td>{data.Course_Type}</td>
                        <td><input type = "button" value = "조회" disabled={this.state.dis}
                                    onClick = {function setQuery() {
                                                var Q = {
                                                    Stu_ID: window.localStorage.getItem('ID'),
                                                    Course_Id: document.getElementById("enrolment_Course_Id"+i).innerHTML,
                                                    College: document.getElementById("enrolment_College"+i).innerHTML,
                                                    Dept: document.getElementById("enrolment_Dept"+i).innerHTML,
                                                    Class: document.getElementById("enrolment_Class"+i).innerHTML,
                                                }; //선택한 row 값 저장
                                                this._checkNumber(Q);
                                    }.bind(this)}>
                        </input></td>
                    </tr>
                    )
                })
            )
        }
        //예비과목에서 삭제
        else {
            data=this.props.res_reserve;

            table.push(
                data.map((data,i)=>{
                    return(
                    <tr key={i}>
                        <td><input type = "button" value = "취소" 
                                    onClick = {function setQuery() {
                                                var Q = {
                                                    Stu_ID: window.localStorage.getItem('ID'),
                                                    Course_Id: document.getElementById("reserve_Course_Id"+i).innerHTML,
                                                    College: document.getElementById("reserve_College"+i).innerHTML,
                                                    Dept: document.getElementById("reserve_Dept"+i).innerHTML,
                                                    Class: document.getElementById("reserve_Class"+i).innerHTML,
                                                    Course_Title: document.getElementById("reserve_Course_Title"+i).innerHTML,
                                                    Credit: document.getElementById("reserve_Credit"+i).innerHTML
                                                }; //선택한 row 값 저장
                                                
                                                this._deleteReserve(Q);
                                    }.bind(this)}>
                        </input></td>
                        <td>{i+1}</td>
                        <td id = {"reserve_Course_Id"+i}>{data.Course_Id}</td>
                        <td id = {"reserve_Class"+i}>{data.Class}</td>
                        <td id = {"reserve_Course_Title"+i}>{data.Course_Title}</td>
                        <td id = {"reserve_College"+i}>{data.College}</td>
                        <td id = {"reserve_Dept"+i}>{data.Dept}</td>
                        <td>{data.Completion_Type}</td>
                        <td id = {"reserve_Credit"+i}>{data.Credit}.0</td>
                        <td>{data.Grade}</td>
                        <td>{data.Pro_Name}</td>
                        <td>{data.Course_Time}</td>
                        <td>{data.Domain}</td>
                        <td>{data.Course_Type}</td>
                        <td><input type = "button" value = "조회" 
                                    onClick = {function setQuery() {
                                                var Q = {
                                                    Stu_ID: window.localStorage.getItem('ID'),
                                                    Course_Id: document.getElementById("reserve_Course_Id"+i).innerHTML,
                                                    College: document.getElementById("reserve_College"+i).innerHTML,
                                                    Dept: document.getElementById("reserve_Dept"+i).innerHTML,
                                                    Class: document.getElementById("reserve_Class"+i).innerHTML,
                                                }; //선택한 row 값 저장
                                                this._checkNumber(Q);
                                    }.bind(this)}>
                        </input></td>
                    </tr>
                    )
                })
            )
        }

        return table;
        }

        _deleteEnrolment = async(query) => {
            var confirmAnswer = window.confirm('해당 신청 과목을 삭제하시겠습니까?');

            if(confirmAnswer) {
                await axios({
                    url: '/delete_enrolment',
                    method: 'POST',
                    data: query
                }).then(response => response.data).then((data) => {
                    if(data.isDelete === '1') {
                        alert("[" + query.Course_Title + "] 강의는 이미 신청과목에서 삭제되었습니다.")
                    }
                    else if(data.isDelete === '0') {
                        alert("[" + query.Course_Title + "] 강의를 신청과목에서 삭제했습니다.\n확인하려면 조회 버튼을 클릭해주세요.")
                        this._EnrolmentToReserve(query);
                    }
                });
            }
            else {
                alert('삭제가 취소되었습니다.');
            }
        }
        
        _EnrolmentToReserve = async(query) => {
            await axios({
                url: '/enrolment_to_reserve',
                method: 'POST',
                data: query
            }).then(response => response.data).then((data) => {
                this._sendMail(data);
            });
        }

        _ReserveToReserve = async(query) => {
            await axios({
                url: '/reserve_to_reserve',
                method: 'POST',
                data: query
            }).then(response => response.data).then((data) => {
                this._sendMail(data);
            });
        }

        _sendMail = async(student_info) => {
            await axios({
                url: '/send_mail',
                method: 'POST',
                data: student_info
            }).then(response => response.data).then((data) => {
                console.log(student_info.Stu_Name);
            });
        }

        _deleteReserve = async(query) => {
            var confirmAnswer = window.confirm('해당 예비 과목을 삭제하시겠습니까?');

            if(confirmAnswer) {
                await axios({
                    url: '/delete_reserve',
                    method: 'POST',
                    data: query
                }).then(response => response.data).then((data) => {
                    if(data.isDelete === '1') {
                        alert("[" + query.Course_Title + "] 강의는 이미 예비과목에서 삭제되었습니다.")
                    }
                    else if(data.isDelete === '0') {
                        alert("[" + query.Course_Title + "] 강의를 예비과목에서 삭제했습니다.\n확인하려면 조회 버튼을 클릭해주세요.")
                        this._ReserveToReserve(query);
                    }
              });
            }
            else {
                alert('삭제가 취소되었습니다.');
            }
        }
        
        _checkNumber = async(query) => {
            await axios({
              url: '/check_number',
              method: 'POST',
              data: query
          }).then(response => response.data).then((data) => {
              
              if(data.reserve_number === 0) {
                alert("- 강의 수용 인원: " + data.enrolment_capacity + "명\n- 강의 신청 인원: " + data.enrolment_number + "명");
              }
              else {
                alert("- 강의 수용 인원: " + data.enrolment_capacity + "명\n- 강의 신청 인원: " + data.enrolment_number + "명\n- 예비 번호: " + data.reserve_number + "번");
              }
          });
        }

        render() {
        return (
            <div className = "MyCourse">
                {/*상단의 버튼 부분*/}
                <p>· 신청내역</p>
                <div id = "Tab">
                    <input id = {this.state.click_1} type="button" value="신청과목" onClick = {this.button}></input>
                    <input id = {this.state.click_2} type="button" value="예비과목"onClick = {this.button}></input>
                </div>
                <div id = "MyList">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>취소</th>
                                <th>NO</th>
                                <th>학수번호</th>
                                <th>분반</th>
                                <th>교과목명</th>
                                <th>단과대학</th>
                                <th>개설학과</th>
                                <th>이수구분</th>
                                <th>학점</th>
                                <th>학년</th>
                                <th>교수명</th>
                                <th>강의시간</th>
                                <th>선택영역</th>
                                <th>강의유형</th>
                                <th>신청인원</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.getTable()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default MyCourse;