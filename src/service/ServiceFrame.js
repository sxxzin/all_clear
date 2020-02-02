import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import './css/ServiceFrame.css';

import Header from './Header';
import Navi from './Navi';
import Footer from './Footer';
import Calendar from './Calendar';
import WishFrame from './WishFrame/WishFrame';
import CourseFrame from './sugang/CourseFrame';
import SearchFrame from './SearchFrame/SearchFrame';
import ManageFrame from './ManageFrame/ManageFrame';
import Clock from './Clock';
import GuideFrame from './GuideFrame/GuideFrame';

class ServiceFrame extends Component {
    constructor(props) {
        super(props)
        this.handler = this.handler.bind(this);
        this.state = {
            clickedMenu: '',
            clickedNavi: ''
        };
    }

    componentDidMount() {
        this.setState({
            clickedNavi: window.localStorage.getItem('clickedNavi')
        });
    }

    _logout = async(e) => {
        this.setState({
          isLogin: '0'
        });
        var query = {
          Stu_ID: window.localStorage.getItem('ID')
        };
        await axios({
          url: '/logout',
          method: 'POST',
          data: query
        }).then(response => response.data).then((data) => {
          window.localStorage.clear();
          alert('로그아웃 되었습니다!');
          window.location = '/';
        });
      } // 로그아웃

    handler() {
        this.setState({
            clickedMenu: window.localStorage.getItem('clickedMenu')
        });
    }

    changeNavi = (data) => {
        this.setState( {
            clickedNavi: data
        })
    } // Navi에서 클릭 버튼에 따라 clickedNavi값 변경

    changeService = () => {
        // eslint-disable-next-line
        var mainMode = window.localStorage.getItem('mainMode');
        var selectNavi = this.state.clickedNavi;
        var service;
        if (selectNavi === '1학기' || selectNavi === '2학기') {
            if (selectNavi === '1학기') {
                service = <Calendar className="Calendar" semester="1"/>;
            } else {
                service = <Calendar className="Calendar" semester="2"/>;
            }
        } else if (selectNavi === '강의 검색') {
            service = <SearchFrame></SearchFrame>;
        } else if (selectNavi === '관심과목 담기') {
            service =  <WishFrame></WishFrame>;
        } else if (selectNavi === '수강 신청') {
            // if(mainMode === 'Sugang' || mainMode === 'Jungjung') {
                service =  <CourseFrame></CourseFrame>;
            // } 수강 신청 풀기 위해 주석 처리
        } else if (selectNavi === '수강신청 가이드' || selectNavi === '관심과목 가이드' || selectNavi === '예비번호 가이드') {
            if (selectNavi === '수강신청 가이드') {
                service =<GuideFrame select = "수강"></GuideFrame>
            } else if (selectNavi === '관심과목 가이드') {
                service =<GuideFrame select = "관심"></GuideFrame>
            } else {
                service =<GuideFrame select = "예비"></GuideFrame>
            }
        } else if (selectNavi === '내 강의 관리') {
            service = <ManageFrame></ManageFrame>;
        }
        return service;
    }

    render() {
        var service = this.changeService();
        return (
        <Router>
                <div className="ServiceFrame">
                    <div id = "top">
                        <Header LogOut={this._logout}
                        changeNavi = {this.changeNavi} 
                                onChange = {function(_clickedMenu){
                                    this.setState({clickedMenu: _clickedMenu});
                                    }.bind(this)}>       
                       </Header>
                    </div>
                    <div id = "middle">
                        <div id = "navi">
                            <Navi action = {this.handler}
                            clickedNavi = {this.state.clickedNavi}
                            changeNaviInNavi = {this.changeNavi}
                            >  
                            </Navi>
                           <div id="Clock"><Clock/></div>
                        </div>
                        <div id = "service">
                            {service}
                        </div>
                    </div>
                    <div id = "bottom">
                    
                    <Footer></Footer>
                    </div>
                </div>
            </Router>
        );
        
        
    }
};

export default ServiceFrame;