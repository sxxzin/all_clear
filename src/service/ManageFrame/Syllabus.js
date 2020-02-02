import React, { Component } from 'react';
import axios from 'axios';
// Css
import './css/Syllabus.css';
class Syllabus extends Component {
    constructor(props){
        super(props);
        this.state={
            dis:""
        }
    }

    notice () {
        alert("해당 정보는 바꿀 수 없습니다!");
    } // 고정 정보 변경 시도 시

    isData(data) {
        if (data === '' || data === undefined || data === 'undefined' || data === null || data === 'null' || data === '없음') {
            return '없음';
        } else {
            return data;
        }
    } // 계획서에 빈 칸 있을 때 '없음' 으로 대체

    componentDidMount() {
        this.getData();
        this.intervalID=setInterval(this.getData.bind(this),1000);
    }

    
    getData = () => {
        var mainMode = window.localStorage.getItem('mainMode');
        //alert(mainMode);
        if(mainMode==='Cart' || mainMode==='Jungjung')
        {
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

    editSyllabus = async() => {
        var empty = this.props.File.Course_Order;
        var temp_order = '';
        if (empty === "" || empty === undefined || empty === 'undefined' || empty === null || empty === 'null') {
            temp_order = this.props.CourseOrder;
        } else {
            temp_order = this.props.File.Course_Order
        }
        if (this.props.FileName === undefined) {
            alert('올바른 강의를 선택해주세요!');
            return;
        }
        var query = {
            title: document.getElementById('s_title').value + '\n',
            professor: document.getElementById('professor').value + '\n',
            course_info: document.getElementById('course_id').value + "/" +
            document.getElementById('completion_type').value + "/" +
            document.getElementById('grade').value + "\n",
            call: this.isData(this.props.File.call) + '\n',
            time_and_class: document.getElementById('time').value + "/" + document.getElementById('C_Lab').value + '\n',
            pre_subject: this.isData(this.props.File.pre_subject) + '\n',
            e_mail: document.getElementById('e_mail').value + '\n',
            lab: document.getElementById('C_Lab').value + '\n',
            textbook: this.isData(this.props.File.textbook) + '\n',
            goal: this.isData(this.props.File.goal) + '\n',
            capability: this.isData(this.props.File.capability) + '\n',
            assignment: this.isData(this.props.File.assignment) + '\n',
            assessment: this.isData(this.props.File.assessment) + '\n',
            notice: this.isData(this.props.File.notice) + '\n',
            Course_Order: temp_order + '\n',
            filename: this.props.FileName.concat('.txt')
        }
        await axios({
            url: '/setSyllabus',
            method: 'POST',
            data: query
        })
        .then(response => response.data).then((data) => {
            alert('강의 계획서가 수정되었습니다!');
            window.location.reload();
        });
    } // 고정과 변동 정보를 구분 하여 받은 후 강의 계획서 수정 

    render() {
        var info = this.props.value;
        var order;
        var empty = this.props.File.Course_Order;
        if (empty === '' || empty === undefined || empty === 'undefined' || empty === null || empty === 'null') {
            order = this.props.CourseOrder; // 파일 없으면 데베에 있는 Course_Order
        } else {
            order = this.props.File.Course_Order // 파일 있으면 파일에 있는 Course_Order
        }
        return (   
            <div className="Syllabus">
                <form id="modify_syllabus"> {/*15개*/}
                    <div className="short_info">
                        <p>교과목명</p> {/*DB*/}
                        <input type="text" id="s_title" readOnly={true} onClick={this.notice}
                        value={info.Course_Title}></input>
                    </div>
                    <div className="short_info">
                        <p>담당교수</p> {/*DB*/}
                        <input type="text" id="professor" readOnly={true} onClick={this.notice}
                        value={info.Pro_Name}></input>
                    </div>
                    <div className="short_info">
                        <p>이수구분</p> {/*DB*/}
                        <input type="text" id="completion_type" readOnly={true} onClick={this.notice}
                        value={info.Completion_Type}></input>                     
                    </div>
                    <div className="short_info">
                        <p>강의시간</p> {/*DB*/}
                        <input type="text" id="time" readOnly={true} onClick={this.notice}
                        value={info.Course_Time}></input>  
                    </div>
                    <div className="short_info">
                        <p>강의실</p> {/*DB*/}
                        <input type="text" id="C_Lab" readOnly={true} onClick={this.notice}
                        value={info.C_Lab}></input>  
                    </div>
                    <div className="short_info">
                        <p>E-mail</p> {/*DB*/}
                        <input type="text" id="e_mail" readOnly={true} onClick={this.notice}
                        value={info.E_Mail}></input>  
                    </div>
                    <div className="short_info">
                        <p>연구실</p> {/*DB*/}
                        <input type="text" id="P_Lab" readOnly={true} onClick={this.notice}
                        value={info.P_Lab}></input>  
                    </div>
                        <input type="text" id="course_id" className="not" value={info.Course_ID}></input>
                        <input type="text" id="grade" className="not" value={info.Grade}></input>
                        <input type="text" id="filename" name="filename" className="not" value={this.props.FileName}></input>
                    <div id="add_radio">
                        <p>예비 우선순위</p>
                        <div>
                        <p>현재 적용 순서: <b>{order}</b></p>
                        <div><input type="radio" id="2_order" name="Course_Order" value="선착순" disabled={this.state.dis} onChange={this.props.changeText}></input>1. <b>선착순</b></div>
                            <div><input type="radio" id="1_order" name="Course_Order" value="전공" disabled={this.state.dis} onChange={this.props.changeText}></input>2. <b>전공</b> 우선</div>
                            <div><input type="radio" id="2_order" name="Course_Order" value="대상학년 우선" disabled={this.state.dis} onChange={this.props.changeText}></input>3. 전공 우선 후 <b>대상학년 우선</b></div>
                            <div><input type="radio" id="2_order" name="Course_Order" value="졸업 우선" disabled={this.state.dis} onChange={this.props.changeText}></input>4. 전공 우선 후 <b>졸업 우선</b></div>
                        </div>
                    </div>
                    <div className="short_info">
                        <p>전화(연구실/HP)</p>
                        <input type="text" name="call" onChange={this.props.changeText} defaultValue={this.props.File.call}></input>  
                    </div>
                    <div className="short_info">
                        <p>선수과목</p>
                        <input type="text" name="pre_subject" onChange={this.props.changeText} defaultValue={this.props.File.pre_subject}></input>  
                    </div>
                    <div className="short_info">
                        <p>교재</p>
                        <input type="text" name="textbook" onChange={this.props.changeText} defaultValue={this.props.File.textbook}></input>  
                    </div>
                    <div className="long_info">
                        <p>교과목표</p>
                        <textarea name="goal" onChange={this.props.changeText} defaultValue={this.props.File.goal}></textarea>
                    </div>
                    <div className="long_info">
                        <p>핵심역량</p>
                        <textarea name="capability" onChange={this.props.changeText} defaultValue={this.props.File.capability}></textarea>
                    </div>
                    <div className="long_info">
                        <p>과제물</p>
                        <textarea name="assignment" onChange={this.props.changeText} defaultValue={this.props.File.assignment}></textarea> 
                    </div>
                    <div className="long_info">
                        <p>학업성취 평가방법</p>
                        <textarea name="assessment" onChange={this.props.changeText} defaultValue={this.props.File.assessment}></textarea>  
                    </div>
                    <div className="long_info">
                        <p>추가 안내사항</p>
                        <textarea name="notice" onChange={this.props.changeText} defaultValue={this.props.File.notice}></textarea> 
                    </div>
                    <input type="button" value="수정사항 저장" onClick={this.editSyllabus}></input>
               </form>
            </div>
        );
    }
}

export default Syllabus;