import React from 'react';
import './css/Clock.css';

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: '',
      minutes: '',
      seconds: '',
      day: '',
      date: '',
      month: '',
      year: '',
      displayDate: false,
      intervalId: '',
      mode:"off"
    };
    this.stopClock = this.stopClock.bind(this);
    this.toggleDate = this.toggleDate.bind(this);
    this.displayDate = this.displayDate.bind(this);
    this.showTimer = this.showTimer.bind(this);
    this.showButton = this.showButton.bind(this);
    this.showCloseButton = this.showCloseButton.bind(this);
    this.changeOnMode = this.changeOnMode.bind(this);
    this.changeOffMode = this.changeOffMode.bind(this);
  }

  componentDidMount() {
    const intervalId = setInterval(() => {
      const now = new Date();
      let hours = now.getHours().toString();
      let minutes = now.getMinutes().toString();
      let seconds = now.getSeconds().toString();
      let day = now.getDay();
      let date = now.getDate();
      let month = now.getMonth();
      let year = 1900 + now.getYear();

      if (hours.length === 1) {
        hours = '0' + hours;
      } else if (minutes.length === 1) {
        minutes = '0' + minutes;
      } else if (seconds.length === 1) {
        seconds = '0' + seconds;
      }

      hours += ':';
      minutes += ':';

      switch (day) {
        case 0:
          day = 'Sunday';
          break;
        case 1:
          day = 'Monday';
          break;
        case 2:
          day = 'Tuesday';
          break;
        case 3:
          day = 'Wednesday';
          break;
        case 4:
          day = 'Thursday';
          break;
        case 5:
          day = 'Friday';
          break;
        case 6:
          day = 'Saturday';
          break;
        default:
          console.log('No default ever!');
      }

      switch (month) {
        case 0:
          month = 'January';
          break;
        case 1:
          month = 'February';
          break;
        case 2:
          month = 'March';
          break;
        case 3:
          month = 'April';
          break;
        case 4:
          month = 'May';
          break;
        case 5:
          month = 'June';
          break;
        case 6:
          month = 'July';
          break;
        case 7:
          month = 'August';
          break;
        case 8:
          month = 'September';
          break;
        case 9:
          month = 'October';
          break;
        case 10:
          month = 'November';
          break;
        case 11:
          month = 'December';
          break;
        default:
          console.log('No default MF!');
      }

      this.setState({
        hours,
        minutes,
        seconds,
        day,
        date,
        month,
        year
      });
    }, 1000);
    this.setState({
      intervalId
    });
  }

  toggleDate() {
    const { displayDate } = this.state;
    this.setState({
      displayDate: !displayDate
    });
  }

  stopClock() {
    clearInterval(this.state.intervalId);
  }

  displayDate() {
    const { day, date, month, year, displayDate } = this.state;
    if (displayDate) {
      return (
        <div>
          {day} {date} {month} {year}
        </div>
      );
    }
  }

  showTimer(){
    const { hours, minutes, seconds } = this.state;
    return ( 
    <div className="Clock">
    Display Date
    <div className="toggle">
      <i className="far fa-calendar-alt" />
      <input type="checkbox" onChange={this.toggleDate} />
    </div>
    <div className="container">
      <div className="clock">
        <div className="time">
          {hours}
          {minutes}
          {seconds}
        </div>
        <div className="date">{this.displayDate()}</div>
      </div>
    </div>
  </div>);
  }

  showButton(){
    return (<div>
      <button type="button" id="button" value="showtimer" style={this.cStyle} onClick={this.changeOnMode}>SHOW TIMER</button>
    </div>)
  }
  showCloseButton(){
    return (<div>
      <button type="button" id="button" value="close" style={this.cStyle} onClick={this.changeOffMode}>CLOSE</button>
    </div>)
  }
  changeOnMode(){
    if(this.state.mode === "off") this.setState({mode:"on"});
  } 
  changeOffMode(){
    if(this.state.mode === "on") this.setState({mode:"off"});
  }

  render() {
    
    if(this.state.mode==="on"){
      return (
          <div>
          <div>{this.showTimer()}</div>
          <div>{this.showCloseButton()}</div>
          </div>
      );
    }
    else{
      return(
        <div>{this.showButton()}</div>
      );
    }
  }
}

export default Clock;
