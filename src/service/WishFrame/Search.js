import React, { Component } from 'react';

class SearchForm extends Component {
    constructor(props){
        super(props);

        //state에 search조건 저장
        this.state = {
            Grouptype:"",
            Semester:"",
            Completion_Type:"",
            Domain:"",
            Offerring_Dept:"",
            Course_Title:"",
            Pro_Name:"",
            render_control:0,

            afterSearch:[{Offerring_Dept:"",Dept:"",Course_ID:"",Class:"",Course_Title:"",Language:"",Completion_Type:""
            ,Domain:"",Credit:"",Grade:"",Lab:"",Pro_Name:"",Starting_Time_1:"",Ending_Time_1:"",Starting_Time_2:"",Ending_Time_2:"",Starting_Time_3:"",Ending_Time_3:""}]
           
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //셀렉메뉴 바뀔때마다 현재 state값 변경
    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    //Search조건을 부모컴포넌트 SearchFrame으로 전달
    handleSubmit(event) {
        event.preventDefault();
        this.props.search_filter(this.state);
    }

    componentDidMount = () => {
        this.setState({
            render_control:this.state.render_control + 1
        })
        if(this.state.render_control !== 1){
            this.props.search_filter(this.state);
        }
    }

    render() {
        return (
            <div className="Search">
                <div id='classify'>
                    <div id='c1'>
                        <p id='p1'>조직분류</p>
                        <form id='c1_1'>
                            <select name="Grouptype" onChange={this.handleChange} value='1'> 
                                {/* Grouptype */}
                                <option value='0'>- 선택 -</option>
                                <option value='1'>학부</option>
                            </select>
                        </form>
                        <p id='p2'>년도/학기</p>
                        <form id='c1_2'>
                            <select name="Semester" onChange={this.handleChange}> 
                                {/* Semester */}
                                <option value='0'>- 선택 -</option>
                                <option value='1'>2019/2학기</option>
                                <option value='2'>2019/여름학기</option>
                                <option value='3'>2019/1학기</option>
                                <option value='4'>2018/겨울학기</option>
                            </select>
                        </form>
                        <p id='p3'>이수구분</p>
                        <form id='c1_3'>
                            <select name="Completion_Type" onChange={this.handleChange}> 
                                {/* completion_Type */}
                                <option value='0'>- 전체 -</option>
                                <option value='중핵필수'>중핵필수</option>
                                <option value='중핵필수선택'>중핵필수선택</option>
                                <option value='전공기초교양'>전공기초교양</option>
                                <option value='자유선택교양'>자유선택교양</option>
                                <option value='전공기초'>전공기초</option>
                                <option value='전공필수'>전공필수</option>
                                <option value='전공선택'>전공선택</option>
                                <option value='교직'>교직</option>
                                <option>무관후보생교육</option>
                            </select>
                        </form>
                        <p id='p4'>선택영역</p>
                        <form id='c1_4'>
                            <select name="Domain" onChange={this.handleChange}> 
                                {/* Domain */}
                                <option value='0'>- 전체 -</option>
                                <option value='인성과도덕'>인성과도덕</option>
                                <option value='역사와문화'>역사와문화</option>
                                <option value='사회와제도'>사회와제도</option>
                                <option value='생명과과학'>생명과과학</option>
                                <option value='예술과생활'>예술과생활</option>
                                <option value='지구촌의이해'>지구촌의이해</option>
                                <option value='학문기초'>학문기초</option>
                                <option value='인성과창의력'>인성과창의력</option>
                                <option value='역량강화'>역량강화</option>
                                <option value='사상과역사'>사상과역사</option>
                                <option value='사회와문화'>사회와문화</option>
                                <option value='융합과창업'>융합과창업</option>
                                <option value='자연과과학기술'>자연과과학기술</option>
                                <option value='세계와지구촌'>세계와지구촌</option>
                                <option value='대학위성강좌'>대학위성강좌</option>
                            </select>
                        </form>
                    </div>
                    <div id='c2'>
                        <p id='p5'>개설학과전공</p>
                        <form id='c2_1'>
                            <select name="Offerring_Dept" onChange={this.handleChange}> 
                            {/* Offerring_Dept */}
                            <option value='0'>- 선택 -</option>
                                <option value='2733'>건설환경공학과 [2733 학부] 공과대학</option>
                                <option value='2769'>건축공학부 [2769 학부] 공과대학</option>
                                <option value='2779'>건축공학부 건축공학전공 [2779 학부] 공과대학</option>
                                <option value='2780'>건축공학부 건축학전공 [2780 학부] 공과대학</option>
                                <option value='2330'>경영학부 [2330 학부] 경영대학</option>
                                <option value='2333'>경영학부 경영학전공 [2333 학부] 경영대학</option>
                                <option value='2243'>경제통상학과 [2243 학부] 사회과학대학</option>
                                <option value='3375'>공연예술 융합전공 [3375 학부] 연계전공</option>
                                <option value='2114'>교육학과 [2114 학부] 인문과학대학</option>
                                <option value='2784'>국방시스템공학과 [2784 학부] 공과대학</option>
                                <option value='2111'>국어국문학과 [2111 학부] 인문과학대학</option>
                                <option value='2130'>국제학부 [2130 학부] 인문과학대학</option>
                                <option value='2131'>국제학부 영어영문학전공 [2131 학부] 인문과학대학</option>
                                <option value='2132'>국제학부 일어일문학전공 [2132 학부] 인문과학대학</option>
                                <option value='2133'>국제학부 중국통상학전공 [2133 학부] 인문과학대학</option>
                                <option value='3330'>글로벌미디어소프트웨어 융합전공 [3330 학부] 연계전공</option>
                                <option value='3037'>글로벌조리학과 [3037 학부] 호텔관광대학</option>
                                <option value='2738'>기계항공우주공학부 [2738 학부] 공과대학</option>
                                <option value='2723'>기계항공우주공학부 기계공학전공 [2723 학부] 공과대학</option>
                                <option value='2724'>기계항공우주공학부 항공우주공학전공 [2724 학부] 공과대학</option>
                                <option value='2786'>나노신소재공학과 [2786 학부] 공과대학</option>
                                <option value='9005'>대양휴머니티칼리지 [9005 학부] 대양휴머니티칼리지</option>
                                <option value='3225'>데이터사이언스학과 [3225 학부] 소프트웨어융합대학</option>
                                <option value='2919'>디지털콘텐츠학과 [2919 학부] 전자정보공학대학</option>
                                <option value='3370'>럭셔리 브랜드 디자인 융합전공 [3370 학부] 연계전공</option>
                                <option value='2538'>만화애니메이션학과 [2538 학부] 예체능대학</option>
                                <option value='2515'>무용과 [2515 학부] 예체능대학</option>
                                <option value='2450'>물리천문학과 [2450 학부] 자연과학대학</option>
                                <option value='2233'>미디어커뮤니케이션학과 [2233 학부] 사회과학대학</option>
                                <option value='2051'>법학부 [2051 학부] 법학부</option>
                                <option value='2052'>법학부 법학전공 [2052 학부] 법학부</option>
                                <option value='3350'>비즈니스 애널리틱스 융합전공 [3350 학부] 연계전공</option>
                                <option value='2540'>산업디자인학과 [2540 학부] 예체능대학</option>
                                <option value='3140'>생명시스템학부 [3140 학부] 생명과학대학</option>
                                <option value='3144'>생명시스템학부 바이오산업자원공학전공 [3144 학부] 생명과학대학</option>
                                <option value='3142'>생명시스템학부 바이오융합공학전공 [3142 학부] 생명과학대학</option>
                                <option value='3141'>생명시스템학부 식품공학전공 [3141 학부] 생명과학대학</option>
                                <option value='3145'>생명시스템학부 식품생명공학전공 [3145 학부] 생명과학대학</option>
                                <option value='3340'>소셜미디어매니지먼트소프트웨어 융합전공 [3340 학부] 연계전공</option>
                                <option value='3220'>소프트웨어학과 [3220 학부] 소프트웨어융합대학</option>
                                <option value='2640'>수학통계학부 [2640 학부] 자연과학대학</option>
                                <option value='2648'>수학통계학부 수학전공 [2648 학부] 자연과학대학</option>
                                <option value='2649'>수학통계학부 응용통계학전공 [2649 학부] 자연과학대학</option>
                                <option value='3345'>스마트 투어리즘 매니지먼트 [3345 학부] 연계전공</option>
                                <option value='2232'>신문방송학과 [2232 학부] 사회과학대학</option>
                                <option value='2729'>에너지자원공학과 [2729 학부] 공과대학</option>
                                <option value='3320'>엔터테인먼트 소프트웨어 융합전공 [3320 학부] 연계전공</option>
                                <option value='2115'>역사학과 [2115 학부] 인문과학대학</option>
                                <option value='3360'>영상디자인 융합전공 [3360 학부] 연계전공</option>
                                <option value='2525'>영화예술학과 [2525 학부] 예체능대학</option>
                                <option value='3365'>예술경영 융합전공 [3365 학부] 연계전공</option>
                                <option value='2785'>원자력공학과 [2785 학부] 공과대학</option>
                                <option value='3310'>융합창업전공 [3310 학부] 연계전공</option>
                                <option value='2513'>음악과 [2513 학부] 예체능대학</option>
                                <option value='2930'>전자정보통신공학과 [2930 학부] 전자정보공학대학</option>
                                <option value='2926'>정보보호학과 [2926 학부] 전자정보공학대학</option>
                                <option value='3215'>정보보호학과 [3215 학부] 소프트웨어융합대학</option>
                                <option value='3230'>지능기전공학부 [3230 학부] 소프트웨어융합대학</option>
                                <option value='3231'>지능기전공학부 무인이동체공학전공 [3231 학부] 소프트웨어융합대학</option>
                                <option value='3232'>지능기전공학부 스마트기기공학전공 [3232 학부] 소프트웨어융합대학</option>
                                <option value='3235'>창의소프트학부 [3235 학부] 소프트웨어융합대학</option>
                                <option value='3236'>창의소프트학부 디자인이노베이션전공 [3236 학부] 소프트웨어융합대학</option>
                                <option value='3237'>창의소프트학부 만화애니메이션텍전공 [3237 학부] 소프트웨어융합대학</option>
                                <option value='2514'>체육학과 [2514 학부] 예체능대학</option>
                                <option value='2922'>컴퓨터공학과 [2922 학부] 전자정보공학대학</option>
                                <option value='3210'>컴퓨터공학과 [3210 학부] 소프트웨어융합대학</option>
                                <option value='2536'>패션디자인학과 [2536 학부] 예체능대학</option>
                                <option value='2787'>항공시스템공학과 [2787 학부] 공과대학</option>
                                <option value='2223'>행정학과 [2223 학부] 사회과학대학</option>
                                <option value='3029'>호텔관광외식경영학부 [3029 학부] 호텔관광대학</option>
                                <option value='3036'>호텔관광외식경영학부 외식경영학전공 [3036 학부] 호텔관광대학</option>
                                <option value='3035'>호텔관광외식경영학부 호텔관광경영학전공 [3035 학부] 호텔관광대학</option>
                                <option value='3033'>호텔외식관광프랜차이즈경영학과 [3033 학부] 호텔관광대학</option>
                                <option value='3034'>호텔외식비즈니스학과 [3034 학부] 호텔관광대학</option>
                                <option value='2433'>화학과 [2433 학부] 자연과학대학</option>
                                <option value='2790'>환경에너지공간융합학과 [2790 학부] 공과대학</option>
                                <option value='2511'>회화과 [2511 학부] 예체능대학</option>

                            </select>
                        </form>
                        <p id='p6'>교과목명</p>
                        <input type='text' id='c2_2' name="Course_Title" onChange={this.handleChange}/>
                        <p id='p7'>교수명</p>
                        <input type='text' id='c2_2' name="Pro_Name" onChange={this.handleChange}/>
                    </div>
                </div>
                <div id='Search_button'>
                    <input type='button' value = '조회' onClick={this.handleSubmit}/>
                </div>
            </div>
        );
    }
}

export default SearchForm;