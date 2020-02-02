import React, { Component } from 'react';
// Css
import './css/SyllabusModal.css';
// Module
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

class SyllabusModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            pdf: 'off',
        }
        // eslint-disable-next-line
        var doc; // pdf 정보 담는 변수
    }

    PdfControl = () => {
        if (this.state.pdf === 'off') {
            this.setState({pdf: 'on'});
        } else if (this.state.pdf === 'on') {
            this.setState({pdf: 'off'});
        }
    } // 버튼 클릭 여부에 따라 pdf viwer open 

    RenderPdf = () => {
        if (this.state.pdf === 'off') {
        } else if (this.state.pdf === 'on') {
            html2canvas(document.body.querySelector("#PDF"), {
                scale: 2.5
            }).then(canvas => {
                var imgData = canvas.toDataURL('image/png', 'base64');
                this.doc = new jsPDF('I', 'px', [800, 500]);
                this.doc.addImage(imgData, 'PNG', 15, 15, 580, 350);
                window.open(this.doc.output('bloburl'), '_blank');
            });
            this.setState({pdf: 'off'});
        }
     } // pdf 다운 버튼 클릭 시 현재 #PDF를 캡쳐해서 PDF로 띄움

    render() {
        this.RenderPdf();
        return (
            <div className="SyllabusModal">
                <div id="modal_title">
                    <p>2019 학년도 2학기 수업 계획서</p>
                    <input type="button" id="close_modal" value="X" onClick={this.props.displaySyllabus}></input>
                    <input type="button" id="open_pdf" value="PDF로 다운받기" onClick={this.PdfControl}></input>
                </div>
                <div id="PDF">
                    <div id="subject_title">
                        <table className="modal_table">
                            <thead>
                                <tr><th>교과목명</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>{this.props.SyllabusData.title}</td></tr>
                            </tbody>
                        </table>

                        <table className="modal_table">
                            <thead>
                                <tr><th>예비 우선순위</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>{this.props.SyllabusData.Course_Order}</td></tr>
                            </tbody>
                        </table>

                    </div>
                    <div id="subject_content">
                        <div id="default_info">
                            <table className="modal_table">
                                <thead>
                                    <tr><th>담당교수</th></tr>
                                    <tr><th>학수번호/구분/학점</th></tr>
                                    <tr><th>전화(연구실/HP)</th></tr>
                                    <tr><th>강의시간/강의실</th></tr>
                                    <tr><th>선수과목</th></tr>
                                    <tr><th>E-mail</th></tr>
                                    <tr><th>연구실</th></tr>
                                    <tr><th>교재</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>{this.props.SyllabusData.professor}</td></tr>
                                    <tr><td>{this.props.SyllabusData.course_info}</td></tr>
                                    <tr><td>{this.props.SyllabusData.call}</td></tr>
                                    <tr><td>{this.props.SyllabusData.time_and_class}</td></tr>
                                    <tr><td>{this.props.SyllabusData.pre_subject}</td></tr>
                                    <tr><td>{this.props.SyllabusData.e_mail}</td></tr>
                                    <tr><td>{this.props.SyllabusData.lab}</td></tr>
                                    <tr><td>{this.props.SyllabusData.textbook}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="detail_info">
                            <table className="modal_table">
                                <thead>
                                    <tr><th>교과목표</th></tr>
                                    <tr><th>핵심역량</th></tr>
                                    <tr><th>과제물</th></tr>
                                    <tr><th>학업성취 평가방법</th></tr>
                                    <tr><th>추가 안내사항</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>{this.props.SyllabusData.goal}</td></tr>
                                    <tr><td>{this.props.SyllabusData.capability}</td></tr>
                                    <tr><td>{this.props.SyllabusData.assignment}</td></tr>
                                    <tr><td>{this.props.SyllabusData.assessment}</td></tr>
                                    <tr><td>{this.props.SyllabusData.notice}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SyllabusModal;