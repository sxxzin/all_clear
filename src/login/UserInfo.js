import React, { Component } from 'react';
import './css/UserInfo.css';
import axios from 'axios';

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: [
                {Date: '', Event: ''}
            ] // 주간 일정 저장할 데이터
        }
      }
    componentDidMount() {
        this._getDates();
    }

    _getDates = async() => {
        var day = window.localStorage.getItem('connectionTime');
        day = day.split(' ')[0];
        var day_date = new Date(day); // connectionTime 기준으로 날짜 생성
        var late_date = new Date(day);
        late_date.setDate(day_date.getDate()+7); // 일주일 후 날짜 생성 (주간 일정)
        var late_day = late_date.getFullYear() + '';
        
        if (late_date.getMonth() < 9) {
            late_day += '0' + (late_date.getMonth()+1);
        } else {
            late_day += '' + (late_date.getMonth()+1);
        }
        if (late_date.getDate() < 10) {
            late_day += '0' + late_date.getDate();
        } else {
            late_day += '' + late_date.getDate();
        }
        var query_day = '';
        for (var i = 0; i < 3; i++) {
            query_day += day.split('-')[i];
        } // DB와 비교위해 날짜 -> 문자열로 변환하는 작업

        var days = {
            today: query_day,
            laterday: late_day
        }
        await axios({
            url: '/weeklyplan',
            method: 'POST',
            data: days
        }).then(response => response.data).then((data) => {
            this.setState({
                dates: data
            });
        }); // 주간 일정 받아와 state에 저장
    }

    ShowWeeklyPlan = () => {
        var temp_print = [];
        for (var i = 0; i < this.state.dates.length; i++) {
                var m = String(this.state.dates[i].Date).substring(4, 6);
                var d = String(this.state.dates[i].Date).substring(6, 8);
                temp_print.push(<p key={i}>- {m}월 {d}일 {this.state.dates[i].Event}</p>);
        }
        return temp_print;
    } // state에 저장된 주간 일정 출력

    render() {
        var bStyle = {color: 'black'};
        var datelist = this.ShowWeeklyPlan();
        return (
            <div className="UserInfo">
                <div id="user_info">
                    <p>안녕하세요, <b style={bStyle}>{this.props.userMode} {this.props.userName}님!</b></p>
                    <p>(접속 시간: {this.props.connectionTime})</p>
                </div>
                <div id="calender">
                    <p><b style={bStyle}>주간 일정</b></p>
                    <div id="cal_list">
                        {datelist}
                    </div>
                </div>
            </div>
        );
    }
}

export default UserInfo;