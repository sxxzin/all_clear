import React, { Component } from 'react';
import axios from 'axios';

import './css/CourseFrame.css';

import SearchCourse from './SearchCourse';
import MyCourse from './MyCourse';
import SearchForm from './SearchForm';

class CourseFrame extends Component {
    constructor(props){
        super(props);
        this.state={ CourseType:"관심과목강의조회",Completion_Type:"",Domain:"",Offerring_Dept:"",Course_Title:"",Pro_Name:"",

         afterSearch:[{Offerring_Dept:"",Dept:"",Course_ID:"",Class:"",Course_Title:"",Language:"",Completion_Type:""
         ,Domain:"",Credit:"",Grade:"",Lab:"",Pro_Name:"",Starting_Time_1:"",Ending_Time_1:"",Starting_Time_2:"",Ending_Time_2:"",Starting_Time_3:"",Ending_Time_3:""}],
        
         myEnrolment:[{Offerring_Dept:"",Dept:"",Course_ID:"",Class:"",Course_Title:"",Language:"",Completion_Type:""
         ,Domain:"",Credit:"",Grade:"",Lab:"",Pro_Name:"",Starting_Time_1:"",Ending_Time_1:"",Starting_Time_2:"",Ending_Time_2:"",Starting_Time_3:"",Ending_Time_3:""}],
    
         myReserve:[{Offerring_Dept:"",Dept:"",Course_ID:"",Class:"",Course_Title:"",Language:"",Completion_Type:""
         ,Domain:"",Credit:"",Grade:"",Lab:"",Pro_Name:"",Starting_Time_1:"",Ending_Time_1:"",Starting_Time_2:"",Ending_Time_2:"",Starting_Time_3:"",Ending_Time_3:""}],

         myCredit:{
            App_Credit: 0,
            Ava_Credit: 0,
            App_Reserve_Credit: 0,
            Ava_Reserve_Credit: 0
         },
         captcha:"off"
        };
        // eslint-disable-next-line
        var click = 'off';
        //beforeSearch:조건 없이 모든 과목 조회
        //afterSearch:조건 설정 후 과목 조회한 결과
        //myEnrolment: 사용자의 신청 강의 조회
        //myReserve: 사용자의 예비 강의 조회
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.courseSearch=this.courseSearch.bind(this);
        this.enrolmentSearch=this.enrolmentSearch.bind(this);
        this.reserveSearch=this.reserveSearch.bind(this);
    }

    componentDidMount() {
        this.courseSearch();
        this.enrolmentSearch();
        this.reserveSearch();
        this._PrintCredit();
    }

    componentDidUpdate () {
        if (this.click === 'on') {
            this.courseSearch();
            this.enrolmentSearch();
            this.reserveSearch();
            this._PrintCredit();
            
            this.click = 'off';
        }
    }

    //search_filter조건에 맞춰 search_result에 저장
    courseSearch = async() => {
        var query = {
            Stu_ID: window.localStorage.getItem('ID'), 
            Pro_Name: this.state.Pro_Name,
            Course_Title: this.state.Course_Title,
            Offerring_Dept: this.state.Offerring_Dept,
            Domain: this.state.Domain,
            Completion_Type: this.state.Completion_Type,
            CourseType: this.state.CourseType
        };

        await axios({
          url: '/course_search',
          method: 'POST',
          data: query
      }).then(response => response.data).then((data) => {
          this.setState({
              afterSearch: data
          });
      });
    } // 조건에 따라 검색 필터를 거쳐 data 받아옴

    //신청강의를 myEnrolment에 저장
    enrolmentSearch = async() => {
        var query = {
            ID: window.localStorage.getItem('ID')
        };

        await axios({
        url: '/enrolment_search',
        method: 'POST',
        data: query
    }).then(response => response.data).then((data) => {
        this.setState({
            myEnrolment: data
        });
    });
    }

    //예비강의를 myReserve에 저장
    reserveSearch = async() => {
        var query = {
            ID: window.localStorage.getItem('ID')
        };
        await axios({
          url: '/reserve_sugang',
          method: 'POST',
          data: query
      }).then(response => response.data).then((data) => {
          this.setState({
              myReserve: data
          });
      });
    }

    _PrintCredit = async() => {
        var query = {
            ID: window.localStorage.getItem('ID')
        };
        await axios({
          url: '/print_credit',
          method: 'POST',
          data: query
      }).then(response => response.data).then((data) => {
          if(data.App_Credit === null) {
              data.App_Credit = 0;
          }
          if(data.App_Reserve_Credit === null) {
              data.App_Reserve_Credit = 0;
          }
          this.setState({
              App_Credit: data.App_Credit,
              Ava_Credit: data.Ava_Credit,
              App_Reserve_Credit: data.App_Reserve_Credit,
              Ava_Reserve_Credit: data.Ava_Reserve_Credit
          });
      });
    }

    //Search 컴포넌트에서 받아온 검색조건을 state에 저장
    handleCourseChange(search_filter){
        this.setState(search_filter);
        this.click = 'on';
    };

    render() {
        return (
            <div className="CourseFrame">
                {/*form 부분*/}
                <div id="search_form">
                    <SearchForm search_filter={this.handleCourseChange}></SearchForm>
                </div>
                <p>현재 신청 학점 :  {this.state.App_Credit} / {this.state.Ava_Credit}&emsp;&emsp;예비 신청 학점 : {this.state.App_Reserve_Credit} / {this.state.Ava_Reserve_Credit}</p>
                {/*form으로 검색된 강의 조회*/}
                <div id="search_course">
                    <SearchCourse res={this.state.afterSearch}></SearchCourse>
                </div>
                {/*사용자의 신청강의 / 예비 강의 조회*/}
                <div id="my_course">
                    <MyCourse res_enrolment={this.state.myEnrolment} res_reserve={this.state.myReserve}></MyCourse>
                </div>
            </div>
        );
    }
}

export default CourseFrame;