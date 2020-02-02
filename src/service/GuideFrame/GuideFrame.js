import React, { Component } from 'react';
import Sugang1 from "./Sugang/sugang1.jpg";
import Sugang2 from "./Sugang/sugang2.jpg";
import Sugang3 from "./Sugang/sugang3.jpg";
import Sugang4 from "./Sugang/sugang4.jpg";
import Sugang5 from "./Sugang/sugang5.jpg";
import Sugang6 from "./Sugang/sugang6.jpg";
import Sugang7 from "./Sugang/sugang7.jpg";
import Sugang8 from "./Sugang/sugang8.jpg";
import Wish1 from "./Wish/wish1.jpg";
import Wish2 from "./Wish/wish2.jpg";
import Wish3 from "./Wish/wish3.jpg";
import Wish4 from "./Wish/wish4.jpg";
import Wish5 from "./Wish/wish5.jpg";
import Wish6 from "./Wish/wish6.jpg";
import Wish7 from "./Wish/wish7.jpg";
import Wish8 from "./Wish/wish8.jpg";
import Yebi1 from "./Yebi/yebi1.jpg";
import Yebi2 from "./Yebi/yebi2.jpg";
import Yebi3 from "./Yebi/yebi3.jpg";
import Yebi4 from "./Yebi/yebi4.jpg";
import Yebi5 from "./Yebi/yebi5.jpg";
import Yebi6 from "./Yebi/yebi6.jpg";
import Yebi7 from "./Yebi/yebi7.jpg";
import Yebi8 from "./Yebi/yebi8.jpg";
import Yebi9 from "./Yebi/yebi9.jpg";

import './GuideFrame.css';

class GuideFrame extends Component {

    showSugang=()=>{
        var image = 
        <div className = "guideimg">
            <h3>수강신청 가이드</h3>
            <img src={Sugang1} id ="guide" alt="수강신청가이드"></img>
            <img src={Sugang2} id ="guide" alt="수강신청가이드"></img>
            <img src={Sugang3} id ="guide" alt="수강신청가이드"></img>
            <img src={Sugang4} id ="guide" alt="수강신청가이드"></img>
            <img src={Sugang5} id ="guide" alt="수강신청가이드"></img>
            <img src={Sugang6} id ="guide" alt="수강신청가이드"></img>
            <img src={Sugang7} id ="guide" alt="수강신청가이드"></img>
            <img src={Sugang8} id ="guide" alt="수강신청가이드"></img>  
        </div>
        return image;
    }
    
    showWish=()=>{
        var image = 
        <div class = "guideimg">
            <h3>관심과목 가이드</h3>
            <img src={Wish1} id ="guide" alt="관심과목가이드"></img>
            <img src={Wish2} id ="guide" alt="관심과목가이드"></img>
            <img src={Wish3} id ="guide" alt="관심과목가이드"></img>
            <img src={Wish4} id ="guide" alt="관심과목가이드"></img>
            <img src={Wish5} id ="guide" alt="관심과목가이드"></img>
            <img src={Wish6} id ="guide" alt="관심과목가이드"></img>
            <img src={Wish7} id ="guide" alt="관심과목가이드"></img>
            <img src={Wish8} id ="guide" alt="관심과목가이드"></img>  
        </div>
        return image;
    }

    showYebi=()=>{
        var image = 
        <div class = "guideimg">
            <h3>예비신청 가이드</h3>
            <img src={Yebi1} id ="guide" alt="예비신청가이드"></img>
            <img src={Yebi2} id ="guide" alt="예비신청가이드"></img>
            <img src={Yebi3} id ="guide" alt="예비신청가이드"></img>
            <img src={Yebi4} id ="guide" alt="예비신청가이드"></img>
            <img src={Yebi5} id ="guide" alt="예비신청가이드"></img>
            <img src={Yebi6} id ="guide" alt="예비신청가이드"></img>
            <img src={Yebi7} id ="guide" alt="예비신청가이드"></img>
            <img src={Yebi8} id ="guide" alt="예비신청가이드"></img>  
            <img src={Yebi9} id ="guide" alt="예비신청가이드"></img>  
        </div>
        return image;
    }

    render() {
        var a;
        if(this.props.select ===  "수강"){
            a=this.showSugang();
        }
        else if(this.props.select === "관심"){
            a=this.showWish();
        }
        else{
            a=this.showYebi();
        }
        
        return (
            <div>
                {a}
            </div>
        );
    }
}

export default GuideFrame;