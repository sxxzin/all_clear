import React, { Component } from 'react';

class Footer extends Component {
    render() {
        var pStyle = {display: "inline-block", margin: "0 auto", 'fontSize': "10px"}
        return (
            <div className="Footer">
                <p style={pStyle}>05006 서울특별시 광진구 능동로 209 (군자동) 세종대학교 COPYRIGHT @ 2019 <b>RECA PLUS.</b> ALL RIGHTS RESVERED.</p>
            </div>
        );
    }
}

export default Footer;