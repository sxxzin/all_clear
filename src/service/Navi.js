import React, { Component } from 'react';

import './css/Navi.css';

class Navi extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userMode: window.localStorage.getItem('userMode'),
            clickedMenu: window.localStorage.getItem('clickedMenu'),
        }
    }

    SetTitle = () => {
        var _title = '';

        if(window.localStorage.getItem('clickedMenu') === "calendar") {
            _title = <div id = "title">수강 일정</div>;
        }
        else if(window.localStorage.getItem('clickedMenu') === "search") {
            _title = <div id = "title">강의 조회</div>;
    
        }
        else if(window.localStorage.getItem('clickedMenu') === "cart") {
            _title = <div id = "title">관심 과목</div>;
   
        }
        else if(window.localStorage.getItem('clickedMenu') === "sugang") {
            _title = <div id = "title">수강 신청</div>;
        }
        else if(window.localStorage.getItem('clickedMenu') === "help") {
            _title = <div id = "title">도움말</div>;
        }
        else if(window.localStorage.getItem('clickedMenu') === "manage") {
            _title = <div id = "title">강의 관리</div>;
        }

        return _title;
    }

    SetAndChangeNavi = (e) => {
        var navi = e.currentTarget.value;
        this.props.changeNaviInNavi(navi);
    }

    SetSubMenu = () => {
        var _subMenu = '';

        if(window.localStorage.getItem('clickedMenu') === "calendar") {
            _subMenu =
            <div id = "menu_list">
                <input type="button" value="1학기" onClick={this.SetAndChangeNavi}></input>
                <input type="button" value="2학기" onClick={this.SetAndChangeNavi}></input>
            </div>;
        } else if(window.localStorage.getItem('clickedMenu') === "search") {
            _subMenu =
            <div id = "menu_list">
                <input type="button" value="강의 검색" onClick={this.SetAndChangeNavi}></input>
            </div>;
        } else if(window.localStorage.getItem('clickedMenu') === "cart") {
            _subMenu =
            <div id = "menu_list">
                <input type="button" value="관심과목 담기" onClick={this.SetAndChangeNavi}></input>
            </div>;
        } else if(window.localStorage.getItem('clickedMenu') === "sugang") {
            _subMenu =
            <div id = "menu_list">
                <input type="button" value="수강 신청" onClick={this.SetAndChangeNavi}></input>
            </div>;
        } else if(window.localStorage.getItem('clickedMenu') === "help") {
            _subMenu =
            <div id = "menu_list">
                <input type="button" value="수강신청 가이드" onClick={this.SetAndChangeNavi}></input>
                <input type="button" value="관심과목 가이드" onClick={this.SetAndChangeNavi}></input>
                <input type="button" value="예비번호 가이드" onClick={this.SetAndChangeNavi}></input>
            </div>;
        } else if(window.localStorage.getItem('clickedMenu') === "manage") {
            _subMenu =
            <div id = "menu_list">
                <input type="button" value="내 강의 관리" onClick={this.SetAndChangeNavi}></input>
            </div>;
        }

        return _subMenu;
    }


    render() {
        var _title = this.SetTitle();
        var user = window.localStorage.getItem('userMode');
        var name = window.localStorage.getItem('userName');
        var time = window.localStorage.getItem('connectionTime');
        var _subMenu = this.SetSubMenu();

        return (
            <div className = "Navi">
                <p>
                    <b id="shortinfo">{user} {name}</b>
                    <br></br>
                    (접속 시간: {time})
                </p>
                {_title}
                {_subMenu}
            </div>
        );
    }
}

export default Navi;