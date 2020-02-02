import React, { Component } from 'react';
import axios from 'axios'
// Css
import './css/MyCart.css'

class MyCart extends Component {
    intervalID;
    constructor(props) {
        super(props);
        this.state = {
            Completion_Type: "",
            Domain: "",
            Offerring_Dept: "",
            Course_Title: "",
            Pro_Name: "",
            checked: [false, true],
            dis:"",//버튼 disabled

            afterSearch: [{
                Offerring_Dept: "", Dept: "", Course_ID: "", Class: "", Course_Title: "", Language: "", Completion_Type: ""
                , Domain: "", Credit: "", Grade: "", Lab: "", Pro_Name: "", Course_Time: "", Auto_Apply_Flag: ""
            }]
        };
    }


    componentDidMount(){
        this.getData();
        this.intervalID=setInterval(this.getData.bind(this),1000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }    

    getData = () => {
       var time = new Date();
       //var mode = window.localStorage.getItem('mainMode');
       //if(mode === 'Cart' && (time.getHours() >= 10 && time.getHours() < 18)){ // 원래 조건, 테스트 위해 ||
       //if (time.getHours() >= 10 || time.getHours() < 18) // 테스트 조건 
       if(time.getHours() >= 10 || time.getHours() < 18){  
            if(this.state.dis==="disabled"){
                this.setState({dis:""});
            }
       }
       else{
            if(this.state.dis===""){
            this.setState({dis:"disabled"});
        }
       }
    }


    componentWillReceiveProps = (nextProps) => {
        this.setState({
            Completion_Type: nextProps.res[0],
            Domain: nextProps.res[1],
            Offerring_Dept: nextProps.res[2],
            Course_Title: nextProps.res[3],
            Pro_Name: nextProps.res[4]
        }, async () => {
            var query = { Stu_Name: window.localStorage.getItem('userName') };
            await axios({
                url: '/cart_search',
                method: 'POST',
                data: query
            }).then(response => response.data).then((data) => {
                this.setState({
                    afterSearch: data
                })
                var cl = []
                data.forEach(function (e) {
                    if (e.Auto_Apply_Flag === 'F') {
                        cl.push(false)
                    }
                    else {
                        cl.push(true)
                    }
                });
                this.setState({
                    checked: cl
                })
            });
        })
    }

    cancle = (i) => {
        this.cart2course(i);
    }

    cart2course = async (i) => {
        var conf = window.confirm(document.getElementById('cart_td_Course_Title' + i).innerHTML + "과목을 취소하시겠습니까?")
        if (conf === true) {
            var query = {
                Dept: document.getElementById('cart_td_Dept' + i).innerHTML,
                College: document.getElementById('cart_td_College' + i).innerHTML,
                Course_ID: document.getElementById('cart_td_Course_Id' + i).innerHTML,
                Class: document.getElementById('cart_td_Class' + i).innerHTML,
                Stu_Name: window.localStorage.getItem('userName')
            };

            await axios({
                url: '/cart_to_course',
                method: 'POST',
                data: query
            }).then(response => response.data).then((data) => {
                if (data.isInsert !== '0') {
                    alert("취소되었습니다!")
                    var cre;
                    switch (document.getElementById('cart_td_Credit' + i).innerHTML) {
                        case '1.0':
                            cre = 1;
                            break;
                        case '2.0':
                            cre = 2;
                            break;
                        case '3.0':
                            cre = 3;
                            break;
                        case '4.0':
                            cre = 4;
                            break;
                        case '5.0':
                            cre = 5;
                            break;
                        case '6.0':
                            cre = 6;
                            break;
                        default:
                        
                    }
                    this.props.rr(cre)
                    if(document.getElementById("cb" + i).checked === true){
                        this.props.rr_auto_on_cancle(cre)
                    }
                }
            })
        }
        else {

        }
    }

    check_click = (i, flag) => {
        this.check_time_cart(i, flag);
    } // 1. 자동이관 체크 버튼 클릭 이벤트

    check_time_cart = async (i, flag) => {
        var query = {
            Auto_Apply_Flag: flag,
            Stu_Name: window.localStorage.getItem('userName'),
            Dept: document.getElementById('cart_td_Dept' + i).innerHTML,
            College: document.getElementById('cart_td_College' + i).innerHTML,
            Course_ID: document.getElementById('cart_td_Course_Id' + i).innerHTML,
            Class: document.getElementById('cart_td_Class' + i).innerHTML,
        };

        if (flag === 'T') {
            await axios({
                url: '/check_time_cart',
                method: 'POST',
                data: query
            }).then(response => response.data).then((data) => {
                if (data.isInsert === '1') {
                    this.flag_change(query);
                }
                else {
                    alert("이미 자동이관 된 강의 시간과 겹쳐 자동이관 활성화를 할 수 없습니다.");
                    return;
                }
            });
        } else {
            this.flag_change(query);
        }
    } // 2. 현재 자동이관 된 과목들과 겹치지 않을 경우에만 신청

    flag_change = async (query) => {
        await axios({
            url: '/auto_change',
            method: 'POST',
            data: query
        }).then(response => response.data).then((data) => {
            if (data.isInsert !== '0') {
                alert("변경되었습니다!")
                this.props.rr_auto([data.regis, data.ava]);
            }
            else {
                alert("신청 가능 학점이 부족하여 신청에 실패했습니다!")
            }
        });
    } // 3. 자동이관 활성상태 변경

    regi_search = async(i) => {
        var query = {
            Dept: document.getElementById('cart_td_Dept' + i).innerHTML,
            College: document.getElementById('cart_td_College' + i).innerHTML,
            Course_ID: document.getElementById('cart_td_Course_Id' + i).innerHTML,
            Class: document.getElementById('cart_td_Class' + i).innerHTML,
        };

        await axios({
            url: '/regi_search',
            method: 'POST',
            data: query
        }).then(response => response.data).then((data) => {
            alert("- 강의 수용 인원: " + data.Capacity + "명\n- 관심과목 신청 인원: " + data.Count + "명");
        });
    }

    generate() {
        let table = [];
        let qq = [];
        table.push(
            this.state.afterSearch.map((data, i) => {
                qq.push(false)
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td id={"cart_td_Course_Id" + i}>{data.Course_Id}</td>
                        <td id={"cart_td_Class" + i}>{data.Class}</td>
                        <td id={"cart_td_Course_Title" + i}>{data.Course_Title}</td>
                        <td id={"cart_td_Credit" + i}>{data.Credit + '.0'}</td>
                        <td id={"cart_td_College" + i}>{data.College}</td>
                        <td id={"cart_td_Dept" + i}>{data.Dept}</td>
                        <td>{data.Pro_Name}</td>
                        <td>{data.Course_Time}</td>
                        <td><input type='button' value='철회' disabled={this.state.dis} onClick={function oc(e) {
                            e.preventDefault();
                            this.cancle(i)
                        }.bind(this)}></input></td>
                        <td><input id={"cb" + i} type='checkbox' checked={this.state.checked[i]} disabled={this.state.dis} onChange={function oc(e) {
                            e.preventDefault();
                            if (this.state.checked[i] === true) {
                                this.check_click(i, 'F')
                            }
                            if (this.state.checked[i] === false) {
                                this.check_click(i, 'T')
                            }
                        }.bind(this)}></input></td>
                        <td><input type = "button" value = '조회' onClick = {function(e){
                            e.preventDefault();
                            this.regi_search(i);
                        }.bind(this)}></input></td>
                    </tr>
                )
            })
        )
        return table;
    }

    render() {
        return (
            <div className="MC">
                <table border="1">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>학수번호</th>
                            <th>분반</th>
                            <th>교과목명</th>
                            <th>학점</th>
                            <th>단과대학</th>
                            <th>개설학과</th>
                            <th>교수명</th>
                            <th>시간</th>
                            <th>철회</th>
                            <th>자동이관</th>
                            <th>신청인원</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.generate()}
                    </tbody>
                </table>

            </div>
        );
    }
}

export default MyCart;