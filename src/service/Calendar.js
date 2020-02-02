import React, {Component}from 'react';
import './css/Calendar.scss';
import moment from 'moment';
import axios from 'axios';


class Calendar extends Component {

  constructor(props){
    super(props);

    this.state={dates:[{Dates:'',Event:''}]};
    this.setState = this.setState.bind(this);
  }

  componentDidMount(){
    this.generate_schedule();
  }

  setDate(){
    if(this.props.semester === "1"){
      this.today=moment("2019-02-01");
      this.next=moment("2019-03-01");
    }
    else {
      this.today=moment("2019-08-01");
      this.next=moment("2019-09-01");
    }
  }


  //달력 생성
  generate(_today) {
    const startWeek = _today.clone().startOf('month').week();
    const endWeek = _today.clone().endOf('month').week() === 1 ? 53 : _today.clone().endOf('month').week();
    let calendar = [];
    for (let week = startWeek; week <= endWeek; week++) {
      calendar.push(
        <div className="row" key={week}>
          {
            Array(7).fill(0).map((n, i) => {
              let current = _today.clone().week(week).startOf('week').add(n + i, 'day');
              let isSelected;
              for(var j=0;j<this.state.dates.length;j++){
                isSelected = String(this.state.dates[j].Date) === current.format('YYYYMMDD') ? 'selected' : '';
                if(isSelected==='selected') break;
              }
              let isGrayed = current.format('MM') === _today.format('MM') ? '' : 'grayed';
              return (
                <div className={`box  ${isSelected} ${isGrayed}`} key={i}>
                  <span className={`text`}>{current.format('D')}</span>
                </div>
              )
            })
          }
        </div>
      )
    }
    return calendar;
  }
  //일정 생성
  generate_schedule = async() => {
    await axios({
      url: '/monthlyplan',
      method: 'POST',
  }).then(response => response.data).then((data) => {
      this.setState({
          dates: data
      });
  });
  }


  drawschedule(_today){
    var temp_print = [];
    for (var i = 0; i < this.state.dates.length; i++) {
            var m = String(this.state.dates[i].Date).substring(4, 6);
            var d = String(this.state.dates[i].Date).substring(6, 8);
            if((moment(_today).format("MM"))===m)
            {
              temp_print.push(<p key = {i}>- {m}월 {d}일 {this.state.dates[i].Event}</p>);
            }  
    }
    return(
      <div className="Schedule">
        <div className="head">
          <span className="title">이번달 일정</span>
        </div>
        <div className="body">
        {temp_print}
        </div>
      </div>
    )
  }

  draw(_today){
    return(
    <div className="return">
      <div className="Calendar">
      <div className="Date">
        <div className="head" >
          <span className="title">{_today.format('MMMM YYYY')}</span> 
        </div>
        <div className="body">
          <div className="row">
            <div className="box">
              <span className="text" id="day">SUN</span>
            </div>
            <div className="box">
              <span className="text" id="day">MON</span>
            </div>
            <div className="box">
              <span className="text" id="day">TUE</span>
            </div>
            <div className="box">
              <span className="text" id="day">WED</span>
            </div>
            <div className="box">
              <span className="text" id="day">THU</span>
            </div>
            <div className="box">
              <span className="text" id="day">FRI</span>
            </div>
            <div className="box">
              <span className="text" id="day">SAT</span>
            </div>
          </div>
          {this.generate(_today)}
        </div>
      </div>
    </div>
    </div>
    )
}

  render() {

    return (
      <div className="Calendar">
        <p id="s_cal">※ 2019 {this.props.semester}학기 수강일정</p>
          <div className="main">
              {this.setDate()}
            <div className="content">
              <div className="cal1">{this.draw(this.today)}</div>
              <div className="sche1">{this.drawschedule(this.today)}</div>
            </div>
            <div className="content">
              <div className="cal2">{this.draw(this.next)}</div>
              <div className="sche2">{this.drawschedule(this.next)}</div>
            </div>
          </div>
      </div>
    )
  }
  
}

export default Calendar;