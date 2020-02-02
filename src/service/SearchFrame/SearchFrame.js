import React, { Component } from 'react';
import Search from './Search';
import ReserveCourse from './ReserveCourse';
import SyllabusModal from './SyllabusModal';
import axios from 'axios';

import './css/SearchFrame.css';

class SearchFrame extends Component {

    constructor(props){
        super(props);
        this.state={ Grouptype:"", Semester:"",Completion_Type:"",Domain:"",Offerring_Dept:"",Course_Title:"",Pro_Name:"",

        beforeSearch:[{Offerring_Dept:"",College:"",Course_ID:"",Class:"",Course_Title:"",Course_Type:"",Language:"",Completion_Type:""
         ,Domain:"",Credit:"",Grade:"",Lab:"",Pro_Name:"",Starting_Time_1:"",Ending_Time_1:"",Starting_Time_2:"",Ending_Time_2:"",Starting_Time_3:"",Ending_Time_3:""}],
        
         afterSearch:[{Offerring_Dept:"",Dept:"",Course_ID:"",Class:"",Course_Title:"",Language:"",Completion_Type:"",Syllabus_File_Name:""
         ,Domain:"",Credit:"",Grade:"",Lab:"",Pro_Name:"",Starting_Time_1:"",Ending_Time_1:"",Starting_Time_2:"",Ending_Time_2:"",Starting_Time_3:"",Ending_Time_3:""}],
         modal: 'off',
         SyllabusData: {
             title: '', professor: '', course_info: '', call: '', time_and_class: '', pre_subject: '', e_mail: '', lab: '', textbook: '',
             // 왼쪽 테이블 기본 정보
             goal: '', // 교과목표
             capability: '', // 핵심역량
             assignment: '', // 과제물
             assessment: '', // 평가방법
             notice: '', // 추가 안내사항,
             Course_Order: '' // 예비번호 우선순위
         }
        };
        // eslint-disable-next-line
        var click = 'off';
        // eslint-disable-next-line
        var mStyle = '';
        //beforeSearch: 조건 없이 모든 과목 조회
        //afterSearch: 조건 설정 후 과목 조회한 결과
        //modal: 수업 계획서 오픈 여부
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.doSearch=this.doSearch.bind(this);
    }

    componentDidMount() {
        this.doSearch();
    } // 처음 강의 조회 클릭 시 모든 강의 출력

    componentDidUpdate () {
        if (this.click === 'on') {
            this.doSearch();
            this.click = 'off';
        }
    } // 조회를 클릭 했을 때만 강의 새로 조회

    //search_filter조건에 맞춰 search_result에 저장
    doSearch = async() => {
        var query = {
            Pro_Name: this.state.Pro_Name,
            Course_Title: this.state.Course_Title,
            Offerring_Dept: this.state.Offerring_Dept,
            Domain: this.state.Domain,
            Completion_Type: this.state.Completion_Type
        };
        await axios({
          url: '/do_search',
          method: 'POST',
          data: query
      }).then(response => response.data).then((data) => {
          this.setState({
              afterSearch: data
          });
      });
    } // 조건에 따라 검색 필터를 거쳐 data 받아옴

    //Search 컴포넌트에서 받아온 검색조건을 state에 저장
    handleCourseChange(search_filter){
        this.setState(search_filter);
        this.click = 'on';
    }

    displaySyllabus = async(name) => {
        console.log(name);
        var send = {filename: (name+'.txt')};
        if (this.state.modal === 'off') {
            await axios({
                url: '/getSyllabus',
                method: 'POST',
                data: send
              }).then(response => response.data).then((data) => {
                  if (data.title === '') {
                      alert("등록된 수업 계획서가 없습니다.");
                  } else {
                  this.setState({
                      SyllabusData: data,
                      modal: 'on' });
                  }
            });
        }
        else if (this.state.modal === 'on') {
            this.setState({modal: 'off'})
        }
    } // table의 row 클릭 시 수업 계획서 정보 얻고 모달창 오픈 

    render() {
        if (this.state.modal === 'off') {
            this.mStyle = {display: 'none'};
        } else if (this.state.modal === 'on') {
            this.mStyle = {display: 'flex'};
        } // 모달창 클릭 상태에 따라 수업 계획서 스타일 지정

        return (
        <div className="SearchFrame">
                <div id="modal" style={this.mStyle}>
                    <SyllabusModal
                    modal={this.state.modal}
                    displaySyllabus={this.displaySyllabus}
                    SyllabusData={this.state.SyllabusData}></SyllabusModal>
                </div>
                <div id="Search">
                    <Search search_filter={this.handleCourseChange}/>
                </div>
                <div id="View">
                    <div id="search_notice">
                        <p>· 개설 강좌</p>
                        <b>※ 클릭 시 수업 계획서가 출력됩니다.</b>
                    </div>
                   <ReserveCourse
                   res={this.state.afterSearch}
                   displaySyllabus={this.displaySyllabus}/>
                </div>
            </div>
        );
    }
}

export default SearchFrame;