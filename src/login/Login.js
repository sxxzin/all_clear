import React, { Component } from 'react';
import './css/Login.css';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        // eslint-disable-next-line 
        var id = '', pw = '';
        // eslint-disable-next-line 
        var userchk, loginClick = '';
    }
    componentDidMount() {
        this.userchk = 'student';
        this.loginClick = 'off';
        this._getUser();
    }

    changeId = (e) => {
        this.id = e.target.value;
    }
    changePw = (e) => {
        this.pw = e.target.value;
    }
    changeUser = (e) => {
        this.userchk = e.target.value;
    } // form에 입력된 값으로 변경

    inputLogin = () => {
        this.loginClick = 'on';
        this._getUser();
    } // 로그인 버튼 클릭 시

    _getTime = async() => {
        axios({
            url: '/getConnectTime',
            method: 'POST'
        }).then(response => response.data).then((data) => {
            window.localStorage.setItem('connectionTime', data);
        });
    } // 서버 시간 localStorage에 저장

    _getUser = async() => {
        if (this.loginClick === 'on') { // 로그인 버튼 클릭 시
            var query = {
                id: this.id,
                pw: this.pw,
                loginClick: this.loginClick,
                chk_user: this.userchk
            }; // 입력 정보 저장
            await axios({
                url: '/login',
                method: 'POST',
                data: query,
            }).then(response => response.data).then((data) => {
                if (data.isLogin === '0' ) {
                    alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                    this.loginClick = 'off';
                } else {
                    this.props.SetMainFrameState(data.isLogin, data.name, data.mode, data.connectionTime);
                    window.localStorage.setItem('ID', query.id); //로그인 성공시, 입력받은 id값을 localStorage에 저장
                    this.loginClick = 'off';
                    this.props.SetBrowerState();
                    window.localStorage.setItem('ID', query.id); //로그인 성공시, 입력받은 id값을 localStorage에 저장
                }
            }); // DB 검색 결과에 따른 반응
        }
        this.props.SetBrowerState(); // 로그인 여부에 따라 localStorage 변경
    }

    render(){
      return (
        <div className='Login'>
            <form>
                <div id="title">
                    {/* 로그인 라디오 버튼 부분 */}
                    <b>서비스 로그인</b>
                    <div>
                        <input type="radio" name="radio" value="student"
                            onChange={this.changeUser} defaultChecked={true}/>학생　
                        <input type="radio" name="radio" value="professor" onChange={this.changeUser}/>교수　
                        <input type="radio" name="radio" value="manager" onChange={this.changeUser}/>관리자
                    </div>
                </div>
                    {/* ID, PW 버튼 부분 */}
                <div id="info">
                    <div id="label">
                        <p>아이디 (ID)</p>
                        <p>비밀번호 (PW)</p>
                    </div>
                    <div id="input">
                        <input type="text" name="id" onChange={this.changeId}></input>
                        <input type="password" name="pw" onChange={this.changePw}></input>
                    </div>
                    <div id="input_info">
                        <input type="button" value="로그인" onClick={this.inputLogin}></input>
                    </div>
                </div>
            </form>
            {/* 로그인 안내 부분 */}
            <div id="notice">
                <p><b>※ 학생은 학번, 교수/관리자는 포털 아이디</b>로 로그인이 가능합니다.</p>
                <p>※ 사용 후 자리를 비울 땐 반드시 로그아웃 하십시오.</p>
                <p id="pw_info">신입생 초기 비밀번호: 생년월일 8자리 (예: 19970813)</p>
            </div>
        </div>
      );
    }
  }

export default Login;