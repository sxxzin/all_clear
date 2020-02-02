import React, { Component } from 'react';
import axios from 'axios';
import Syllabus from './Syllabus';
// Css
import './css/ManageFrame.css';

class ManageFrame extends Component {
    constructor(props){
        super(props);
        this.state={
        ID:window.localStorage.getItem('ID'),
        // 로그인 한 교수가 담당하는 강의 리스트의 정보들
        afterSearch:[{P_Lab:"", C_Lab: "",Pro_ID:"",Pro_Name:"",Course_Order: "",
        Major:"",E_Mail:"",Lab:"",Completion_Type: "",
        Course_SID:"",Course_ID:"",Course_Title:"",Class:"",
        Offerring_Dept:"", Course_Time:"",
        Grade:"", Language:"", Course_Type:"", filename:""}],
        // 강의 리스트 중 클릭한 강의의 정보
        send:{P_Lab:"", C_Lab: "", Pro_ID:"", Pro_Name:"", Course_Order: "",
        Major:"", E_Mail:"", Completion_Type: "",
        Course_SID:"",Course_ID:"",Course_Title:"",
        Class:"", Offerring_Dept:"", Course_Time:"",
        Grade:"", Language:"", Course_Type:"", Syllabus_File_Name:""},
        // 클릭한 강의의 수업 계획서 내용을 담고 있는 객체
        SyllabusData: {
            title: '', professor: '', course_info: '', call: '', time_and_class: '',
            pre_subject: '', e_mail: '', lab: '', textbook: '',
            // 왼쪽 테이블 기본 정보
            goal: '', // 교과목표
            capability: '', // 핵심역량
            assignment: '', // 과제물
            assessment: '', // 평가방법
            notice: '', // 추가 안내사항,
            Course_Order: '', // 예비번호 우선순위
            filename: ''
            }
        }
        this.doSearch=this.doSearch.bind(this);
        this.generate=this.generate.bind(this);
        this.edit=this.edit.bind(this);
    }
    componentDidMount(){
        this.doSearch();
    }

    doSearch = async() => {
        var query = {
           one:this.state.ID
        };
        await axios({
          url: '/search',
          method: 'POST',
          data: query
      }).then(response => response.data).then((data) => {
        this.setState({
            afterSearch:data
        });
      });
    } // 조건에 따라 검색 필터를 거쳐 강의 리스트를 받아옴

    edit = async(e) => {
        var filename = this.state.afterSearch[e.target.value].filename;
        this.printSyllabus(filename);
        this.setState({send:this.state.afterSearch[e.target.value]});
    } // 강의 리스트 중 클릭한 강의의 정보를 send에 담기

    printSyllabus = async(data) => {
        var send = {filename: data+'.txt'};
        await axios({
            url: '/getSyllabus',
            method: 'POST',
            data: send
        }).then(response => response.data).then((data) => {
            this.setState({
                SyllabusData: data
            })
        });
    } // 수업 계획서의 내용을 읽어와서 SyllabaData에 저장

    changeText = (e) => {
        const target = e.currentTarget;
        const value = target.value;
        const name = target.name;
        var temp = {
            title: '', professor: '', course_info: '', call: '', time_and_class: '',
            pre_subject: '', e_mail: '', lab: '', textbook: '', filename: '',
            // 왼쪽 테이블 기본 정보
            goal: '', // 교과목표
            capability: '', // 핵심역량
            assignment: '', // 과제물
            assessment: '', // 평가방법
            notice: '', // 추가 안내사항,
            Course_Order: '' // 예비번호 우선순위
        }
        temp = this.state.SyllabusData;
        temp[name] = value;
        this.setState({
            SyllabusData: temp
        })
    } // Syllabus.js가 SyllabusData에서 클릭한 키 값 변경

    generate(){
        let data=this.state.afterSearch;
        let table=[];
            table.push(
                data.map((data,i)=>{
                return(
                 <tr key={i}>
                    <td><button id="edit_syllabus" value={i} onClick={this.edit}>수정</button></td>
                    <td>{i+1}</td>
                    <td>{data.Course_ID}</td>
                    <td>{data.Class}</td>
                    <td>{data.Grade}</td>
                    <td>{data.Course_Title}</td>
                    <td>{data.Course_Time}</td>
                    </tr>
                )
                })
            )
        return table;
    }

    render() {
        var bStyle = {'fontSize': '12px'};
        return (
            <div className = "ManageFrame">
                <div id="Courselist">
                    <p>· 담당 강의 목록</p>
                    <div id="t_list">
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>강의계획서</th>
                                    <th>NO</th>
                                    <th>학수번호</th>
                                    <th>분반</th>
                                    <th>학점</th>
                                    <th>교과목명</th>
                                    <th>강의시간</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.generate()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="Syllabus">
                    <p>· 강의 계획서 <b style={bStyle}>　(※ 수정 후 하단의 수정사항 자장을 통해 적용할 수 있습니다.)</b></p>
                    <Syllabus value = {this.state.send}
                    File = {this.state.SyllabusData}
                    FileName = {this.state.send.filename}
                    changeText = {this.changeText}
                    CourseOrder = {this.state.send.Course_Order}></Syllabus>
                </div>
            </div>
        );
    }
}

export default ManageFrame;