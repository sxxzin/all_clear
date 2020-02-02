import React, { Component } from 'react';
import axios from 'axios';
//import ReCAPTCHA from "react-google-recaptcha";

import './css/SearchCourse.css';

class SearchCourse extends Component {
    intervalID;
    constructor(props){
        super(props);
        // eslint-disable-next-line
        var mStyle = '';
        this.state = { dis:"", cnt:1, preClick:"", modal: 'off'};
        this.generate=this.generate.bind(this);
        this._insertRecord=this._insertRecord.bind(this);
        this._checkTimeTable=this._checkTimeTable.bind(this);
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

    //form에 따른 강의 출력 (강의실, 강의언어 제외)
    generate(click_count){
    let data=this.props.res;
    let table=[];
        table.push(
            data.map((data,i)=>{
            return(
            <tr key={i}>
                <td><input type = "button" value = "신청" disabled={this.state.dis}
                            onClick = {function setQuery() {
                                        var Q = {
                                            Stu_ID: window.localStorage.getItem('ID'),
                                            Course_Id: document.getElementById("search_Course_Id"+i).innerHTML,
                                            College: document.getElementById("search_College"+i).innerHTML,
                                            Dept: document.getElementById("search_Dept"+i).innerHTML,
                                            Class: document.getElementById("search_Class"+i).innerHTML,
                                            Course_Title: document.getElementById("search_Course_Title"+i).innerHTML,
                                            Credit: document.getElementById("search_Credit"+i).innerHTML
                                        }; //선택한 row 값 저장
                                        this._checkTimeTable(Q,click_count);
                            }.bind(this)}>
                </input></td>
                <td>{i+1}</td>
                <td id = {"search_Course_Id"+i}>{data.Course_Id}</td>
                <td id = {"search_Class"+i}>{data.Class}</td>
                <td id = {"search_Course_Title"+i}>{data.Course_Title}</td>
                <td id = {"search_College"+i}>{data.College}</td>
                <td id = {"search_Dept"+i}>{data.Dept}</td>
                <td>{data.Completion_Type}</td>
                <td id = {"search_Credit"+i}>{data.Credit}</td>
                <td>{data.Grade}</td>
                <td>{data.Pro_Name}</td>
                <td>{data.Course_Time}</td>
                <td>{data.Domain}</td>
                <td>{data.Course_Type}</td>
            </tr>
            )
            })
        )

    return table;
    }

    _reserveDelete = async(query) => {
        await axios({
            url:'/delete_cart_reserve',
            method:'post',
            data:query
        })
    }

    checkMacro = (title) =>{
        if(title===this.state.preClick){
            this.setState({cnt:(this.state.cnt)+1});
            if(this.state.cnt>=10){
                this.setState({cnt:1, preClick:title})
                alert("매크로다!!!!111 매크로가 나타났따!!!!1111")
            }
        }
        else{
            this.setState({cnt:1, preClick:title})
        }
    }

    //"신청"버튼을 누른 강의를 Enrolment나 Reserve_Number에 insert
    _insertRecord = async(query) => {
        await axios({
          url: '/insert_course',
          method: 'POST',
          data: query
      }).then(response => response.data).then((data) => {
            this.checkMacro(query.Course_Title);
           if(data.isInsert === '0') {
             alert("학점이 부족해 [" + query.Course_Title + "] 강의를 신청할 수 없습니다.")
           }
           else if(data.isInsert === '1') {
            alert("[" + query.Course_Title + "] 강의를 신청했습니다.\n확인하려면 조회 버튼을 클릭해주세요.")
            this._reserveDelete(query);
           }
           else if(data.isInsert === '2'){
            alert("[" + query.Course_Title + "] 강의 여석이 없습니다.\n학점이 부족해 예비 신청을 할 수 없습니다.")
           }
           else if(data.isInsert === '3'){
            alert("[" + query.Course_Title + "] 강의 여석이 없습니다.\n해당과목을 예비 신청합니다.")
            this._setPriority();
            
            }
           else if(data.isInsert === '4'){
            alert("[" + query.Course_Title + "] 이미 신청한 강의 입니다.")
           }
           else if(data.isInsert === '5'){
            alert("[" + query.Course_Title + "] 이미 예비 신청한 강의 입니다.")
           }
      });
    }

    _setPriority = async() => {
        axios({
            url: '/set_auto_priority',
            method: 'POST'
        }).then(response => response.data).then((data) => {
            if (data === '예비 없음') {
                console.log('우선순위를 설정할 예비 리스트가 없습니다.');
            }
        });
    } // Course_Order에 따라 Reserve_Number의 Priority 계산

    _checkTimeTable = async (query,click_count) => {
        click_count.value++;
        if (click_count.value !== 5) {

            await axios({
                url: '/check_time_table',
                method: 'POST',
                data: query
            }).then(response => response.data).then((data) => {
                if (data.isInsert === '0') {
                    alert("강의 시간이 겹쳐 [" + query.Course_Title + "] 강의를 신청할 수 없습니다.")
                }
                else if (data.isInsert === '1') {
                    this._insertRecord(query);
                }
                else if (data.isInsert === '4') {
                    alert("[" + query.Course_Title + "] 강의는 이미 수강 신청되었습니다.")
                }
                else if (data.isInsert === '5') {
                    alert("[" + query.Course_Title + "] 강의는 이미 예비 신청되었습니다.")
                }
            });
        }
        else{
            alert("상단에 메크로 방지 코드를 입력하십시오")
            this.setState({
                modal:'on'
            })
        }
    }

    oc = () => {
        this.setState({
            modal:'off'
        })
        window.location = '/service';
    }
    
    render() {
        var click_count = {value : 0};
        if (this.state.modal === 'off') {
            this.mStyle = {display: 'none'};
        } else if (this.state.modal === 'on') {
            this.mStyle = {display: 'flex'};
            click_count.value = 4;
        }
        return (
            <div className="SearchCourse">
                <div style={this.mStyle}>
                {/* { <ReCAPTCHA
                    sitekey="6Le_scQUAAAAANqvWZHyiNidNaxk_ixeKTNwtdAq"
                    onChange={this.oc} /> } */}
                </div>
                
                <p>· 수강대상 교과목</p>
                <table border="1">
                    <thead>
                        <tr>
                            <th>신청</th>
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
                        </tr>
                    </thead>
                    <tbody>
                    {this.generate(click_count)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default SearchCourse;