import React, { Component } from 'react';
import Search from './Search';
import ReserveCourse from './ReserveCourse';
import SyllabusModal from '../SearchFrame/SyllabusModal';
import MyCart from './MyCart'
import axios from 'axios';

import './css/WishFrame.css'

class WishFrame extends Component {

    constructor(props) {
        super(props);
        this.state = { Grouptype:"", Semester:"",Completion_Type:"",Domain:"",Offerring_Dept:"",Course_Title:"",Pro_Name:"",

        afterSearch:[{Offerring_Dept:"",Dept:"",Course_ID:"",Class:"",Course_Title:"",Language:"",Completion_Type:""
        ,Domain:"",Credit:"",Grade:"",Lab:"",Pro_Name:"",Starting_Time_1:"",Ending_Time_1:"",Starting_Time_2:"",Ending_Time_2:"",Starting_Time_3:"",Ending_Time_3:""}],

        Reserve:0,
        Auto:0,
        Ava:0,
        Render_control:0,

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
        ,modal: 'off'
        };
        // eslint-disable-next-line
        var mStyle = '';
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.courseSearch=this.courseSearch.bind(this);
        this.Auto_rerender=this.Auto_rerender.bind(this);
        this.Reserve_rerender=this.Reserve_rerender.bind(this);
        this.Reserve_rerender_cancle=this.Reserve_rerender_cancle.bind(this);
    }

    Credit_Check = async() => {
        var query = {Stu_Name: window.localStorage.getItem('userName')}
        await axios({
            url: '/credit_check',
            method: 'POST',
            data: query
        }).then(response => response.data).then((data) => {
            if(data.regis !== 0)
            {
                this.courseSearch([data.regis, data.auto, data.ava]);   
            }
        });
    }

    componentDidUpdate() {
        //console.log('modal'+this.state.modal);
        if(this.state.Render_control === 0)
        {
            this.setState({
                Render_control:this.state.Render_control + 1
            })
            this.Credit_Check();
        }
    }

    courseSearch = async(credits) => {
        var query = {
            Pro_Name: this.state.Pro_Name,
            Course_Title: this.state.Course_Title,
            Offerring_Dept: this.state.Offerring_Dept,
            Domain: this.state.Domain,
            Completion_Type: this.state.Completion_Type,
            Stu_Name: window.localStorage.getItem('userName')
        };

        await axios({
          url: '/course_load',
          method: 'POST',
          data: query
      }).then(response => response.data).then((data) => {
          for(var i = 0; i < 3; i++)
          {
            if(credits[i] === null){
                credits[i] = 0;
            }
          }
          this.setState({
              afterSearch: data,
              Reserve:credits[0],
              Auto:credits[1],
              Ava:credits[2]
          });
      });
    }

    handleCourseChange(search_filter){
        this.setState(search_filter);
    };

    Auto_rerender = (data) => {
        this.setState({
            Auto:data[0],
            Ava:data[1]
        })
    }

    Reserve_rerender_cancle = (data) => {
        this.setState({
            Reserve:this.state.Reserve - data
        })
    }

    Reserve_rerender = (data) => {
        this.setState({
            Reserve:data
        })
    }

    rraoc = (data) => {
        this.setState({
            Auto:this.state.Auto - data,
            modal: 'off'
        })
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
            console.log('보여줘');
            this.mStyle = {display: 'flex'};
        } // 모달창 클릭 상태에 따라 수업 계획서 스타일 지정

        return (
            <div className="WishFrame">
                <div id="modal" style={this.mStyle}>
                    <SyllabusModal
                    modal={this.state.modal}
                    displaySyllabus={this.displaySyllabus}
                    SyllabusData={this.state.SyllabusData}></SyllabusModal>
                </div>
                <div id="Search">
                    <Search search_filter={this.handleCourseChange} />
                </div>
                <div id="search_notice">
                    <p id="l">· 개설 강좌</p>
                    <b>※ 교과목명 클릭 시 수업 계획서가 출력됩니다.</b>
                    <p id="r">현재 신청 학점 : {this.state.Reserve} / 24&emsp;&emsp;자동이관 신청 가능 학점 : {this.state.Auto} / {this.state.Ava}</p>
                </div>    
                   
                <div id="View">
                    <div id='ReserveCourse'>
                        <ReserveCourse res={[this.state.Completion_Type, this.state.Domain, this.state.Offerring_Dept, this.state.Course_Title, this.state.Pro_Name]} rr = {this.Reserve_rerender}
                        displaySyllabus={this.displaySyllabus}/>
                    </div>
                    <div id='MyCart'>
                        <MyCart res={[this.state.Completion_Type, this.state.Domain, this.state.Offerring_Dept, this.state.Course_Title, this.state.Pro_Name]} rr = {this.Reserve_rerender_cancle} rr_auto = {this.Auto_rerender} rr_auto_on_cancle = {this.rraoc}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default WishFrame;