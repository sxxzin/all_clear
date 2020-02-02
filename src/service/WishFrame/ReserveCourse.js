import React, { Component } from 'react';
import axios from 'axios';
// Css
import './css/ReserveCourse.css'

class ReserveCourse extends Component {
    intervalID;
    constructor(props) {
        super(props);
        this.state = {
            Completion_Type: "",
            Domain: "",
            Offerring_Dept: "",
            Course_Title: "",
            Pro_Name: "",
            Sum_Credit: [],
            dis:"",
            afterSearch: [{
                Offerring_Dept: "", Dept: "", Course_ID: "", Class: "", Course_Title: "", Language: "", Completion_Type: ""
                , Domain: "", Credit: "", Grade: "", Lab: "", Pro_Name: "", Course_Time: "", Syllabus_File_Name: ""
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
            var query = {
                Pro_Name: this.state.Pro_Name,
                Course_Title: this.state.Course_Title,
                Offerring_Dept: this.state.Offerring_Dept,
                Domain: this.state.Domain,
                Completion_Type: this.state.Completion_Type,
                Stu_Name: window.localStorage.getItem('userName')
            };
            await axios({
                url: '/Reserve_search',
                method: 'POST',
                data: query
            }).then(response => response.data).then((data) => {
                this.setState({
                    afterSearch: data
                })
            });
        })
    }

    register = (i) => {
        this.course2cart(i);
    }

    course2cart = async (i) => {
        var conf = window.confirm(document.getElementById('reserve_td_Course_Title' + i).innerHTML + "과목을 신청하시겠습니까?")
        if (conf === true) {
            var query = {
                Dept: document.getElementById('reserve_td_Dept' + i).innerHTML,
                College: document.getElementById('reserve_td_College' + i).innerHTML,
                Course_ID: document.getElementById('reserve_td_Course_Id' + i).innerHTML,
                Class: document.getElementById('reserve_td_Class' + i).innerHTML,
                Stu_Name: window.localStorage.getItem('userName')
            };
            await axios({
                url: '/course_to_cart',
                method: 'POST',
                data: query
            }).then(response => response.data).then((data) => {
                if(data.isInsert !== '0') {
                    alert("신청되었습니다!")
                    this.props.rr(data.regis);
                }
                else{
                    alert("관심과목에 추가할 수 있는 학점을 초과했습니다!")
                }
            });
        }
    }

    SendSyllabusName = (e) => {
        var name = e.currentTarget.getAttribute('data-item');
        this.props.displaySyllabus(name);
    }

    generate() {
        let table = [];
        table.push(
            this.state.afterSearch.map((data, i) => {
                return (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td><input type='button' value='신청' disabled={this.state.dis} onClick={function oc(e) {
                            this.syll_click = 'off';
                            e.preventDefault();
                            this.register(i);
                        }.bind(this)}></input></td>
                        <td id={"reserve_td_Course_Id" + i}>{data.Course_Id}</td>
                        <td id={"reserve_td_Class" + i}>{data.Class}</td>
                        <td  key={i} data-item={data.Syllabus_File_Name} onClick={this.SendSyllabusName}
                        id={"reserve_td_Course_Title" + i}>{data.Course_Title}</td>
                        <td id={"reserve_td_Credit" + i}>{data.Credit + '.0'}</td>
                        <td id={"reserve_td_College" + i}>{data.College}</td>
                        <td id={"reserve_td_Dept" + i}>{data.Dept}</td>
                        <td>{data.Pro_Name}</td>
                        <td>{data.Course_Time}</td>
                    </tr>
                )
            })
        )

        return table;
    }

    render() {
        return (
            <div className="RC">
                <table border="1">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>신청</th>
                            <th>학수번호</th>
                            <th>분반</th>
                            <th>교과목명</th>
                            <th>학점</th>
                            <th>단과대학</th>
                            <th>개설학과</th>
                            <th>교수명</th>
                            <th>시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.generate()}
                    </tbody>
                </table>

            </div >
        );
    }
}

export default ReserveCourse;