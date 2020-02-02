import React, { Component } from 'react';
// Css
import './css/Menu.css';
// Image
import logout from './img/logout.png';
import calendar from './img/calendar.png';
import help from './img/help.png';
import search from './img/search.png';
import cart from './img/cart.png';
import sugang from './img/sugang.png';
import manage from './img/manage.png';
// Module
import axios from 'axios';


class Menu extends Component {
    constructor(props) {
        super(props);
        // eslint-disable-next-line 
        var cStyle, sStyle, pStyle, mStyle, bigStyle;
        this.state = {
            clickedMenu: ''
        }
    }
    componentDidMount() {
        this.CheckMenu();
    }
    

    CheckMenu = () => {
        var mainMode = window.localStorage.getItem('mainMode');
        if (this.props.userMode === '학생') {
            if(mainMode === 'Sugang'){
                this.cStyle = {display: "none"};
                this.sStyle = {display: "none"};
                this.pStyle = {display: "none"};
                this.mStyle = {display: "none"};
                this.bigStyle = {display: "inline", transform: "scale(1.7)",  top: "20vh" ,left: "20vh"};
            } //수강신청모드
            else{
            this.cStyle = {display: "inline"}; // 학생
            this.sStyle = {display: "inline"}; // 교수
            this.pStyle = {display: "none"}; // 학생, 교수 공통
            this.mStyle = {display: "none"}; // 관리자
            this.bigStyle = {display: "none"}; // 수강신청 모드 버튼
            }
        } else if (this.props.userMode === '교수') {
            this.cStyle = {display: "inline"};
            this.sStyle = {display: "none"};
            this.pStyle = {display: "inline"};
            this.mStyle = {display: "none"};
            this.bigStyle = {display: "none"};
        } else if (this.props.userMode === '관리자') {
            this.cStyle = {display: "inline"};
            this.sStyle = {display: "none"};
            this.pStyle = {display: "none"};
            this.mStyle = {display: "inline"};
            this.bigStyle = {display: "none"};
        } else { // 로그아웃 상태일 때
            this.cStyle = {display: "none"};
            this.sStyle = {display: "none"};
            this.pStyle = {display: "none"};
            this.mStyle = {display: "none"};
            this.bigStyle = {display: "none"};
        }
    } // user 성격에 맞게 버튼 display 변경

    ClickedMenu = (e) => {
        var select = e.currentTarget.value;
        var select_navi;
        if (select === 'calendar') {
            select_navi = '1학기';
        } else if ( select === 'search') {
            select_navi = '강의 검색';
        } else if ( select === 'cart') {
            select_navi = '관심과목 담기';
        } else if ( select === 'sugang') {
            // if (window.localStorage.getItem('mainMode') === 'Sugang' || window.localStorage.getItem('mainMode') === 'Jungjung') {
                select_navi = '수강 신청';
            // } else {
            //     alert('수강 신청 기간이 아닙니다!');
            //     return;
            // }
        } else if ( select === 'manage') {
            select_navi = '내 강의 관리';
        } else if ( select === 'help') {
            select_navi = '수강신청 가이드';
        }
        window.localStorage.setItem('clickedMenu', select);
        window.localStorage.setItem('clickedNavi', select_navi);
        window.location = '/service';
    } // 클릭 메뉴에 맞는 service 페이지로 이동

    _setAutoApply = async() => {
        if (window.localStorage.getItem('AutoClick') === 'on') {
            alert('이미 자동이관을 완료했습니다.');
            return;
        } // 자동이관 중복 방지
        var apply_object = [{
            Auto_Increment: '',
            Stu_ID: '',
            Course_SID: ''
        }]; // 자동이관 대상 강의 정보 담는 객체
        await axios({
            url: '/set_apply',
            method: 'POST',
        }).then(response => response.data).then((data) => {
            window.localStorage.setItem('AutoClick', 'on');
            if (data === "대상 없음") {
                alert('자동이관 대상 교과목이 없습니다!');
                return;
            } // 자동이관 후보 강의 없을 때
            else {
                apply_object = data;
                this._getAutoInfo(apply_object);
            }
        });
    } // 1. 자동 이관 시작 -> 대상 강의 정보를 가져옴

    _getAutoInfo = async(insert_info) => {
        var apply_insert = [{
            Auto_Increment: '',
            Stu_ID: '',
            Course_Id: '',
            College: '',
            Dept: '',
            Class: '',
            Course_Title: '',
            Credit: ''
        }];  // /insert_course에 req.body로 줄 정보를 담는 객체
        await axios({
            url: '/get_insert_info',
            method: 'POST',
            data: insert_info
        }).then(response => response.data).then((data) => {
            for (var i = 0; i < data.length; i++) {
                if (data.length <= 1) {
                    apply_insert[i] = data[i];
                } else {
                    apply_insert[i] = data[i][0];
                }
            }
            this._insertAutoCourse(apply_insert);
        });
    } // 2. 필요한 정보를 얻어 수강신청 함수 호출

    _insertAutoCourse = async(auto_insert) => {
        for (const auto_apply of auto_insert) {
            this._insertRecord(auto_apply);
        }
    } // 3. 자동이관 대상 강의 수만큼 반복하여 시간대 중복 함수 호출
    
    _insertRecord(auto_apply){
        axios({
          url: '/insert_course',
          method: 'POST',
          data: auto_apply
      }).then(response => response.data).then((data) => {
          if(data.isInsert === '1') {
            this._deleteCart(auto_apply);
        } else {
            return;
        } // 신청 성공일 때만 삭제
      });
    } // 4. 강의 신청 후 신청 완료한 과목이면 관심과목에서 삭제

    _deleteCart(delete_cart) {
        axios({
            url: '/delete_auto_cart',
            method: 'POST',
            data: delete_cart
        }).then(response => response.data).then((data) => {
            return;
        });
    } // 자동이관 성공한 강의를 관심과목에서 삭제

    _setPriority = async() => {
        if (window.localStorage.getItem('AutoOrder') === 'on') {
            alert('이미 예비 우선순위 설정을 완료했습니다!');
            return;
        }
        window.localStorage.setItem('AutoOrder', 'on');
        axios({
            url: '/set_auto_priority',
            method: 'POST'
        }).then(response => response.data).then((data) => {
            if (data === '예비 없음') {
                alert('우선순위를 설정할 예비 리스트가 없습니다.');
            }
        });
    } // Course_Order에 따라 Reserve_Number의 Priority 계산

    render() {
        this.CheckMenu();
        return (
            <div className="Menu">
                <button type="button" id="logout" value="logout" style={this.cStyle} onClick={this.props.LogOut}>
                    <img src={logout} alt="로그아웃"></img>
                    <br></br>로그아웃
                </button>
                <button type="button" id="search" value="search" style={this.cStyle} onClick={this.ClickedMenu}>
                    <img src={search} alt="강의조회"></img>
                    <br></br>강의조회
                </button>
                <button type="button" id="calendar" value="calendar"  style={this.cStyle}  onClick={this.ClickedMenu}>
                    <img src={calendar} alt="수강일정"></img>
                    <br></br>수강일정
                </button>
                <button type="button" id="cart" value="cart" style={this.sStyle}  onClick={this.ClickedMenu}>
                    <img src={cart} alt="관심과목"></img>
                    <br></br>관심과목
                </button>
                <button type="button" id="sugang" value="sugang" style={this.sStyle}  onClick={this.ClickedMenu}>
                    <img src={sugang} alt="수강신청"></img>
                    <br></br>수강신청
                </button>
                <button type="button" id="manage" value="manage" style={this.pStyle}  onClick={this.ClickedMenu}>
                    <img src={manage} alt="강의관리"></img>
                    <br></br>강의관리
                </button>
                <button type="button" id="help" value="help" style={this.cStyle}  onClick={this.ClickedMenu}>
                    <img src={help} alt="도움말"></img>
                    <br></br>도움말
                </button>
                <button type="button" id="auto_manage" value="auto_manage" style={this.mStyle} onClick={this._setAutoApply}>
                    <img src={manage} alt="자동이관"></img>
                    <br></br>자동이관
                </button>
                <button type="button" id="sugang" value="sugang" style={this.bigStyle} onClick={this.ClickedMenu}>
                    <img src={sugang} alt="수강신청"></img>
                    <br></br>수강신청
                </button>
                <button type="button" id="set_auto" value="set_auto" style={this.mStyle} onClick={this._setPriority}>
                    <img src={sugang} alt="예비설정"></img>
                    <br></br>예비설정
                </button>
                <p id="min_size_notice">안녕하세요, {window.localStorage.getItem('userName')}님!</p>
            </div>
        );
    }
}

export default Menu;