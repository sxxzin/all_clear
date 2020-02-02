import React, { Component } from 'react';

import './css/ReserveCourse.css';

class ReserveCourse extends Component {
    constructor(props){
        super(props);
        this.generate=this.generate.bind(this);
    }

    SendSyllabusName = (e) => {
        var name = e.currentTarget.getAttribute('data-item');
        this.props.displaySyllabus(name);
    }

//props.res 강의시간표 출력
generate(){
    let data=this.props.res;
    let table=[];
        table.push(
            data.map((data,i)=>{
            return(
             <tr key={i} data-item={data.Syllabus_File_Name} onClick={this.SendSyllabusName}>
                <td>{i+1}</td>
                <td>{data.Course_Id}</td>
                <td>{data.Class}</td>
                <td>{data.Course_Title}</td>
                <td>{data.Dept}</td>
                <td>{data.Completion_Type}</td>
                <td>{data.Credit}.0</td>
                <td>{data.Grade}</td>
                <td>{data.Pro_Name}</td>
                <td>{data.Lab}</td>
                <td>{data.Language}</td>
                <td>{data.Course_Time}</td>
                <td>{data.Domain}</td>
                <td>{data.Course_Type}</td>
            </tr>
            )
            })
        )
    
    return table;
}
    render() {
        return (
            <div className="ReserveCourse">
                <table border="1">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>학수번호</th>
                            <th>분반</th>
                            <th>교과목명</th>
                            <th>개설학과</th>
                            <th>이수구분</th>
                            <th>학점</th>
                            <th>학년</th>
                            <th>교수명</th>
                            <th>강의실</th>
                            <th>강의언어</th>
                            <th>강의시간</th>
                            <th>강의유형</th>
                            <th>비고</th>
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

export default ReserveCourse;