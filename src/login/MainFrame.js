import React, { Component } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import axios from 'axios';
// Component
import Login from './Login';
import Footer from './Footer';
import UserInfo from './UserInfo';
import Menu from './Menu';
// Css
import './css/Mainframe.css';
// Image
import sejong from '../img/sejong.png';

class MainFrame extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      isLogin : '',
      userName: '',
      userMode: '',
      connectionTime: ''
    }
  }
  
  setMainMode = () => {
    var connectedDay = window.localStorage.getItem('connectionTime'); // 로그인 날짜 기준으로 판단
    var today = new Date(connectedDay);
    var mainMode = 'Normal';
    ///////////////////////////////////////
    //수강, 정정기간 시작,끝 일자 받아와서 수정하기 (2019-2학기 학사 일정만: 테스트 데이터)
    ///////////////////////////////////////
    var cartStart = new Date("2019-08-06");
    var cartEnd = new Date("2019-08-09T23:59:00")
    var sugangStart = new Date("2019-08-19");
    var sugangEnd = new Date("2019-08-23T23:59:00");
    var jungjungStart = new Date("2019-09-03");
    var jungjungEnd = new Date("2019-09-06T23:59:00");
   
    if (today >=cartStart && today <=cartEnd) {
      mainMode = "Cart";
    }
    else if (today >=sugangStart && today <=sugangEnd) {
      mainMode = "Sugang";
    }
    else if (today >=jungjungStart && today <=jungjungEnd) {
      mainMode = "Jungjung";
    }
    else {
      mainMode = "Normal";
    }
    window.localStorage.setItem('mainMode', mainMode);
    //수강,정정,관심,일반 모드 로컬스토리지에 저장 
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

  SetMainFrameState = (isLogin, userName, userMode, connectionTime) => {
    window.localStorage.setItem('isLogin', isLogin);
    window.localStorage.setItem('userName', userName);
    window.localStorage.setItem('userMode', userMode);
    window.localStorage.setItem('connectionTime', connectionTime);
  } // 로그인 성공 시 localStorage에 user 정보 저장
  
  render() {
    var resCompo;
    if (this.state.isLogin === '1') {
      this.setMainMode();
      resCompo = <UserInfo
      userName={window.localStorage.getItem('userName')}
      userMode={window.localStorage.getItem('userMode')}
      connectionTime={window.localStorage.getItem('connectionTime')}
      ></UserInfo>; // 로그인 상태면 유저 정보와 일정 표시
    } else {
      resCompo =
      <Login
      isLogin={this.state.isLogin}
      userName={this.state.userName}
      userMode={this.state.userMode}

      SetBrowerState={function() {
        var isLogin = window.localStorage.getItem('isLogin');
        this.setState({
          isLogin: isLogin,
          });
        }.bind(this)} // 로그인 상태 판단해 isLogin에 저장
      SetMainFrameState={this.SetMainFrameState}>
      </Login>;
    }

    return (
    <Router>
      <div className="MainFrame">
        <div id="left">
          <div id="Menu">
            <Menu
            userMode={window.localStorage.getItem('userMode')}
            connectionTime={window.localStorage.getItem('connectionTime')}
            LogOut={this._logout}>
            </Menu>
          </div>
        </div>
        <div id="right">
          <img src={sejong} alt="세종대학교" onClick={function() {window.location = '/'}}></img>
          <div id="LoginCompo">
            {resCompo}
          </div>
          <div id="LoginFoot">
            <Footer></Footer>
          </div>
        </div>
      </div>
    </Router>
    );
  }
}

export default MainFrame;