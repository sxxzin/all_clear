import React, { Component } from 'react';

import './css/Header.css';
import sejong from '../img/sejong.png';

class Header extends Component {
    constructor(props) {
        super(props)
        // eslint-disable-next-line
        var _style;
        this.state = {
            userMode: window.localStorage.getItem('userMode'),
            clickedMenu: window.localStorage.getItem('clickedMenu')
        }
    }

    ClickedMenu = (e) => {
        var navi;
        var menu = e.currentTarget.value;
        // eslint-disable-next-line
        var mode = window.localStorage.getItem('mainMode');

        e.preventDefault();
        // if (menu === "sugang") {
        //     if (mode === 'Sugang' || mode === 'Jungjung') {
        //         this.props.onChange(menu);
        //         window.localStorage.setItem('clickedMenu', menu);

        //         navi = '수강 신청';
        //         window.localStorage.setItem('clickedNavi', navi);
        //         this.props.changeNavi(navi);
        //     } else {
        //         alert('수강 신청 기간이 아닙니다!');
        //         return;
        //     }
        // } else {
            this.props.onChange(menu);
            window.localStorage.setItem('clickedMenu', menu);

            if (menu === "calendar") {
                navi = '1학기';
            } else if (menu === "search") {
                navi = '강의 검색';
            } else if (menu === "cart") {
                navi = '관심과목 담기';
            } else if (menu === "help") {
                navi = '수강신청 가이드';
            } else if (menu === "manage") {
                navi = '내 강의 관리';
            } else if (menu === "sugang") {
                navi = '수강 신청';
            } // 수강 신청 막으려면 위에 주석 풀고 이 조건문을 주석 처리해야
            window.localStorage.setItem('clickedNavi', navi);
            this.props.changeNavi(navi);
        // }
    } // header에서 클릭한 메뉴와 기간에 따라 navi, service component 변경

    SetMenu = () => {
        var _menu = '';
        if(this.state.userMode === "교수") {
            _menu = 
                <ul>
                    <button type="button" id="CALENDAR" value="calendar" onClick = {this.ClickedMenu}>수강일정</button>
                    <button type="button" id="SEARCH" value="search" onClick = {this.ClickedMenu}>강의조회</button>
                    <button type="button" id="MANAGE" value="manage" onClick = {this.ClickedMenu}>강의관리</button>
                    <button type="button" id="LOGOUT" value="로그아웃" onClick = {this.props.LogOut} className = "LOGOUT">로그아웃</button>
                </ul>;
        } else if (this.state.userMode === "학생") {
            _menu =
                <ul>
                    <button type="button" id="CALENDAR" value="calendar" onClick = {this.ClickedMenu}>수강일정</button>
                    <button type="button" id="SEARCH" value="search" onClick = {this.ClickedMenu}>강의조회</button>
                    <button type="button" id="CART" value="cart"onClick = {this.ClickedMenu}>관심과목</button>
                    <button type="button" id="SUGANG" value="sugang" onClick = {this.ClickedMenu}>수강신청</button>
                    <button type="button" id="HELP" value="help" onClick = {this.ClickedMenu}>도움말</button>
                    <button type="button" id="LOGOUT" value="로그아웃" onClick = {this.props.LogOut} className = "LOGOUT">로그아웃</button>
                </ul>;
        } else if (this.state.userMode === "관리자") {
            _menu = 
                <ul>
                    <button type="button" id="CALENDAR" value="calendar" onClick = {this.ClickedMenu}>수강일정</button>
                    <button type="button" id="SEARCH" value="search" onClick = {this.ClickedMenu}>강의조회</button>
                    <button type="button" id="LOGOUT" value="로그아웃" onClick = {this.props.LogOut} className = "LOGOUT">로그아웃</button>
                </ul>;
        }
        return _menu;
    }

    componentDidMount() {
    }

    render() {
        var _menu = this.SetMenu();
        
        return (
            <div className = "Header">
                <div id = "mini_logo">
                    <img src={sejong} alt="세종대학교" onClick={function() {window.location = '/'}}></img>
                </div>
                <nav id = "header_menu">
                    {_menu}
                </nav>
            </div>
        );
    }
}

export default Header;