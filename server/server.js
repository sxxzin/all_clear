const express = require('express');
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser');
var sessionParser = require('express-session');
const PORT = process.env.PORT || 4000;
var fs = require('fs');
const nodemailer = require('nodemailer');

const con = require('./config/db');
const creds = require('./config/mail');

var transport = {
    service: 'gmail',
    auth: {
        user: creds.USER,
        pass: creds.PASS
    }
};
var transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
    if(error) {console.log(error)}
    else {
        console.log('All works fine')
    }
});

app.use(express.json());

app.use(cors(
    {
        origin: ["http://localhost:4000"],
        credentials: true
    }
));
app.use(sessionParser({
    secret: 'recareca',
    resave: true,
    saveUninitialized: true
})); // 세션 설정
app.use(bodyParser.json());

app.post('/logout', (req, res) => {
    var user_mode = req.session.user;

    req.session.destroy();

    if(user_mode === undefined) {
        var sql_cnt = "SELECT table_name FROM information_schema.tables WHERE table_name Like 'enrolment_%'";
        con.query(sql_cnt, function(err_cnt, row_cnt) {
            if (err_cnt) {console.log(err_cnt)}
            else {
                if (row_cnt.length >= 1) { // 뷰가 있을 경우
                    var all_del_view1 = "";
                    for (var i = 0; i < row_cnt.length; i++) {
                        var reserve_name = 'reserve_' + row_cnt[i].table_name.split('_')[1];
                        all_del_view1 += "DROP VIEW " + row_cnt[i].table_name + ";" + "DROP VIEW " + reserve_name + ";";
                    }
                    con.query(all_del_view1, function(err_del1, row_del1) {
                        if (err_del1) {console.log(err_del1)}
                        else  {
                            res.send('로그아웃 완료');
                        }
                    })
                }
                else {
                    res.send('로그아웃 완료'); // 뷰가 없을 경우
                }
            }
        });
    }
    else {
        if (user_mode.mode === '교수') {
            res.send('로그아웃 완료');
        } // 교수 로그인 시 뷰 검사 안 하고 로그아웃
        else if (user_mode.mode === '관리자') {
            var sql_cnt = "SELECT count(*) AS cnt FROM information_schema.tables WHERE table_name Like 'enrolment_%'";
            con.query(sql_cnt, function (err_cnt, row_cnt) {
                if (err_cnt) {console.log(err_cnt)}
                else {
                    var sql_all_student = "SELECT Stu_ID FROM Student";
                    con.query(sql_all_student, function (err_stu, row_stu) {
                        if (err_stu) {console.log(err_stu)}
                        else {
                            if (row_cnt[0].cnt === row_stu.length) {
                                var all_del_view1 = "";
                                for (var i = 0; i < row_stu.length; i++) {
                                    all_del_view1 += "DROP VIEW reserve_" + row_stu[i].Stu_ID + ";";
                                }
                                con.query(all_del_view1, function(err_res, row_res) {
                                    if (err_res) {console.log(err_res)}
                                    else {
                                        var all_del_view2 = "";
                                        for (var i = 0; i < row_stu.length; i++) {
                                            all_del_view2 += "DROP VIEW enrolment_" + row_stu[i].Stu_ID + ";";
                                        }
                                        con.query(all_del_view2, function(err_enr, row_enr) {
                                            if (err_enr) {console.log(err_enr)}
                                            else {
                                                res.send('로그아웃 완료');
                                            }
                                        });
                                    }
                                });
                            } // 관리자는 모든 학생 뷰를 생성하므로 다 지우고 로그아웃
                            else {
                                res.send('로그아웃 완료');
                            } // 모든 학생 뷰 없을 시 그냥 로그아웃
                        }
                    });
                }
            });
        }
        else if (user_mode.mode === '학생') {
            var sql_check_enrolment = "SELECT count(*) AS cnt FROM information_schema.tables WHERE table_name = 'enrolment_" + req.body.Stu_ID + "'";
            var sql_drop_enrolment = "DROP VIEW enrolment_"+req.body.Stu_ID;
            var sql_check_reserve = "SELECT count(*) AS cnt FROM information_schema.tables WHERE table_name = 'reserve_" + req.body.Stu_ID + "'";
            var sql_drop_reserve = "DROP VIEW reserve_"+req.body.Stu_ID;

            con.query(sql_check_enrolment, function (err, row1) {
                if (err) { console.log(err) }
                else {
                    if(row1[0].cnt === 0) { //enrolment 뷰가 없는 경우
                        con.query(sql_check_reserve, function (err, row2) {
                            if (err) { console.log(err) }
                            else {
                                if(row2[0].cnt === 0) { //reserve 뷰가 없는 경우
                                    res.send('로그아웃 완료');
                                }
                                else if(row2[0].cnt === 1) { //reserve 뷰가 있는 경우
                                    con.query(sql_drop_reserve, function (err, row3) {
                                        if (err) { console.log(err) }
                                        else {
                                            res.send('로그아웃 완료');
                                        }
                                    });
                                }
                            }
                        });
                    } else if (row1[0].cnt === 1) { //enrolment 뷰가 있는 경우
                        con.query(sql_drop_enrolment, function (err, row2) {
                            if (err) { console.log(err) }
                            else {
                                con.query(sql_check_reserve, function (err, row3) {
                                    if (err) { console.log(err) }
                                    else {
                                        if(row3[0].cnt === 0) { //reserve 뷰가 없는 경우
                                            res.send(row3);
                                        }
                                        else if (row3[0].cnt === 1) { //reserve 뷰가 있는 경우
                                            con.query(sql_drop_reserve, function (err, row4) {
                                                if (err) { console.log(err) }
                                                else {
                                                    res.send('로그아웃 완료');
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }
}); // 로그아웃 시 session 삭제

app.post('/login', (req, res) => { // 시간 안 맞으면: data_sub(interval 9 hour), 관심 과목: date_sub(interval 24 day), 수강 신청: date_sub(interval 8 day), 
    var sql = "SELECT DATE_FORMAT(DATE_SUB(DATE_SUB(now(), interval 3 MONTH), interval 10 DAY), '%Y-%m-%d %H:%i:%s') 'connectionTime', ";
    var user = {
        id: '',
        isLogin: '0',
        name: '',
        mode: '0'
    } // MainFrame.js에 전달할 user 초기화
    user.mode = req.body.chk_user;
    user.id = req.body.id;
    if (user.mode === 'student') {
        sql += "Stu_ID, Stu_Name, Password FROM Student WHERE Stu_ID = ? AND Password = ?";
        user.mode = '학생';
    } else if (user.mode === 'professor') {
        sql += "Pro_ID, Pro_Name, Password FROM Professor WHERE Pro_ID = ? AND Password = ?";
        user.mode = '교수';
    } else if (user.mode === 'manager') {
        sql += "Manager_ID, Manager_Name, Password FROM Manager WHERE Manager_ID = ? AND Password = ?";
        user.mode = '관리자';
    }
    // user mode에 따라 다른 sql문 할당
    var params = [req.body.id, req.body.pw];
    con.query(sql, params, function (err, row) {
        if (err) { console.log(err) }
        else {
            if (row[0] != undefined) { // 로그인 성공 시
                if (user.mode === '학생') {
                    //신청강의 view, 예비강의 view 생성
                    var sql_check_enrolment = "SELECT count(*) AS cnt FROM information_schema.tables WHERE table_name = 'enrolment_" + req.body.id + "'";
                    var sql_create_reserve = "CREATE VIEW reserve_" + req.body.id + " AS SELECT * FROM Reserve_Number WHERE Stu_ID = " + req.body.id;
                    var sql_check_reserve = "SELECT count(*) AS cnt FROM information_schema.tables WHERE table_name = 'reserve_" + req.body.id + "'";
                    var sql_create_enrolment = "CREATE VIEW enrolment_" + req.body.id + " AS SELECT * FROM Enrolment WHERE Stu_ID = "+ req.body.id;
                    
                    con.query(sql_check_enrolment, function (err, row1) {
                        if (err) { console.log(err) }
                        else {
                            if(row1[0].cnt === 1) { //enrolment 뷰가 있는 경우
                                con.query(sql_check_reserve, function (err, row2) {
                                    if (err) { console.log(err) }
                                    else {
                                        if(row2[0].cnt === 1) { //reserve 뷰가 있는 경우
                                            user.isLogin = '1';
                                            user.name = row[0].Stu_Name;
                                            user.connectionTime = row[0].connectionTime;

                                            req.session.user = user;
                                            res.send(user);
                                        }
                                        else { //reserve 뷰가 없는 경우
                                            con.query(sql_create_reserve, function (err, row3) {
                                                if (err) { console.log(err) }
                                                else {
                                                    user.isLogin = '1';
                                                    user.name = row[0].Stu_Name;
                                                    user.connectionTime = row[0].connectionTime;
        
                                                    req.session.user = user;
                                                    res.send(user);
                                                }
                                            });
                                        }
                                    }
                                });
                            } else if (row1[0].cnt === 0){ //enrolment 뷰가 없는 경우
                                con.query(sql_create_enrolment, function (err, row2) {
                                    if (err) { console.log(err) }
                                    else {
                                        con.query(sql_check_reserve, function (err, row3) {
                                            if (err) { console.log(err) }
                                            else {
                                                if(row3[0].cnt === 1) { //reserve 뷰가 있는 경우
                                                    user.isLogin = '1';
                                                    user.name = row[0].Stu_Name;
                                                    user.connectionTime = row[0].connectionTime;
        
                                                    req.session.user = user;
                                                    res.send(user);
                                                }
                                                else if(row3[0].cnt === 0) { //reserve 뷰가 없는 경우
                                                    con.query(sql_create_reserve, function (err, row4) {
                                                        if (err) { console.log(err) }
                                                        else {
                                                            user.isLogin = '1';
                                                            user.name = row[0].Stu_Name;
                                                            user.connectionTime = row[0].connectionTime;
                
                                                            req.session.user = user;
                                                            res.send(user);
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }); // 학생 로그인 시 VIEW 생성
                } else if (user.mode === '교수') {
                    user.isLogin = '1';
                    user.name = row[0].Pro_Name;
                    user.connectionTime = row[0].connectionTime;

                    req.session.user = user;
                    res.send(user);
                } // 교수 로그인 시
                else if (user.mode === '관리자') {
                    user.isLogin = '1';
                    user.name = row[0].Manager_Name;
                    user.connectionTime = row[0].connectionTime;

                    req.session.user = user;

                    var sql_cnt = "SELECT count(*) AS cnt FROM information_schema.tables WHERE table_name Like 'enrolment_%'";
                    con.query(sql_cnt, function (err_cnt, row_cnt) {
                        if (err_cnt) {console.log(err_cnt)}
                        else {
                            var sql_all_student = "SELECT Stu_ID FROM Student";
                            con.query(sql_all_student, function (err_stu, row_stu) {
                                if (err_stu) {console.log(err_stu)}
                                else {
                                    if (row_cnt[0].cnt !== row_stu.length) { // 모든 학생 뷰 없을 시 뷰 생성
                                        var sql_all_student = "SELECT Stu_ID FROM Student";
                                        con.query(sql_all_student, function (err_stu, row_stu) {
                                            if (err_stu) {console.log(err_stu)}
                                            else {
                                                var sql_create_reserve = "";
                                                for (var i = 0; i < row_stu.length; i++) {
                                                    sql_create_reserve += "CREATE VIEW reserve_" + row_stu[i].Stu_ID + " AS SELECT * FROM Reserve_Number WHERE Stu_ID = " + row_stu[i].Stu_ID + ";";
                                                }
                                                con.query(sql_create_reserve, function (err_res, row2) {
                                                if (err_res) { console.log(err_res) }
                                                else {
                                                    var sql_create_enrolment = "";
                                                    for (var i = 0; i < row_stu.length; i++) {
                                                        sql_create_enrolment += "CREATE VIEW enrolment_" + row_stu[i].Stu_ID + " AS SELECT * FROM Enrolment WHERE Stu_ID = " + row_stu[i].Stu_ID + ";";
                                                    }
                                                    con.query(sql_create_enrolment, function (err_enr, row_enr) { // 모든 학생들의 뷰 생성
                                                        if (err_enr) { console.log(err_enr) }
                                                        else {
                                                            res.send(user);
                                                        }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    } else { // 모든 학생 뷰가 존재하면 로그인만
                                        res.send(user);
                                    }
                                }
                            });
                        }
                    });
                }
            } else {
                res.send(user);
            } // 로그인 실패 시
        }
    });
}); // 로그인 시 사용자 모드 판단해 user 정보와 connectionTime 할당

app.post('/weeklyplan', (req, res) => {
    var sql_print = "SELECT Date, Event FROM Calendar WHERE Date >= ? AND Date <= ?";
    var params = [req.body.today, req.body.laterday];
    con.query(sql_print, params, function (err, row) {
        if (err) { console.log(err) }
        else {
            res.send(row);
        }
    });
}); // 주간 일정 데이터 전송


// db에서 캘린더 스케줄 가져오기
app.post('/monthlyplan', (req, res) => {
    var sql = "SELECT Date, Event FROM Calendar";
    con.query(sql, function(err, row) {
        if (err) {console.log(err)}
        else {
            res.send(row)
        }
    });
});


//강의조회 search
app.post('/search', (req, res) => {
      var sql = "SELECT CI.Course_Order, C.Completion_Type, P.Pro_ID, P.Pro_Name, P.Major, P.E_Mail, P.Lab as 'P_Lab', CI.Lab as 'C_Lab', C.Course_Title, CI.Course_SID, CI.Course_ID, CI.Class, CI.Offerring_Dept, CI.Course_Time,CI.Grade, CI.Language, CI.Course_Type, CI.Syllabus_File_Name as 'filename' FROM Professor as P INNER JOIN Course_Info as CI ON P.Pro_ID=CI.Pro_ID INNER JOIN Course as C ON CI.Course_ID = C.Course_ID WHERE P.Pro_ID=? ORDER BY CI.Course_SID;";
     var params = [req.body.one];
     con.query(sql, params, function(err, row) {
         if (err) {console.log(err)}
         else {
             res.send(row);
        }
    });
});


 app.post('/do_search', (req, res) => {  
    var sql = "SELECT C.Domain, D.College, D.Dept, C.Course_Id, CI.Syllabus_File_Name, CI.Class, Course_Title, C.Completion_Type, CI.Offerring_Dept, Credit, Grade, Pro_Name, CI.Lab, Language, CI.Course_Type, CI.Course_Time FROM Course as C, Course_Info as CI, Dept_Info as D, Professor as P WHERE C.Course_Id = CI.Course_Id AND CI.Offerring_Dept = D.Offerring_Dept AND CI.Pro_ID = P.Pro_ID AND P.Pro_Name LIKE CONCAT('%', ?,  '%') AND C.Course_Title LIKE CONCAT('%', ?,  '%') AND D.Offerring_Dept LIKE CONCAT('%', ?,  '%') AND C.Domain LIKE CONCAT('%', ?,  '%') AND C.Completion_Type LIKE CONCAT('%', ?,  '%')";
    var params = [req.body.Pro_Name, req.body.Course_Title, req.body.Offerring_Dept, req.body.Domain, req.body.Completion_Type];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    } // params에 값이 없으면 초기화
    con.query(sql, params, function (err, row) {
        if (err) { console.log(err) }
        else {
            res.send(row);
        }
    });
}); // 필터를 거쳐서 강의 조회

app.post('/Reserve_search', (req, res) => {
    var sql = "SELECT C.Domain, D.College, D.Dept, C.Course_Id, CI.Class, CI.Syllabus_File_Name, Course_Title, C.Completion_Type, CI.Offerring_Dept, Credit, Grade, Pro_Name, CI.Lab, Language, CI.Course_Type, CI.Course_Time FROM Course as C, Course_Info as CI, Dept_Info as D, Professor as P WHERE C.Course_Id = CI.Course_Id AND CI.Offerring_Dept = D.Offerring_Dept AND CI.Pro_ID = P.Pro_ID AND P.Pro_Name LIKE CONCAT('%', ?, '%') AND C.Course_Title LIKE CONCAT('%', ?, '%') AND D.Offerring_Dept LIKE CONCAT('%', ?, '%') AND C.Domain LIKE CONCAT('%', ?, '%') AND C.Completion_Type LIKE CONCAT('%', ?, '%') AND CI.Course_SID NOT IN (select Course_SID from Cart where Stu_ID in (select Stu_ID from Student where Stu_Name = ?))";
    var params = [req.body.Pro_Name, req.body.Course_Title, req.body.Offerring_Dept, req.body.Domain, req.body.Completion_Type, req.body.Stu_Name];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    } // params에 값이 없으면 초기화
    con.query(sql, params, function (err, row) {
        if (err) { console.log(err) }
        else {
            res.send(row);
        }
    });
}); // 필터를 거쳐서 강의 조회

app.post('/cart_search', (req, res) => {
    var sql = "select  C.Domain, D.College, D.Dept, C.Course_Id, CI.Class, Course_Title, C.Completion_Type, CI.Offerring_Dept, Credit, Grade, Pro_Name, CI.Lab, Language, CI.Course_Type, CI.Course_Time, Auto_Apply_Flag from Cart as CT, Course_Info as CI, Course as C, Dept_Info as D, Professor as P where CT.Stu_ID IN ( select Stu_ID from Student where Stu_Name = ?) AND CT.Course_SID = CI.Course_SID AND CI.Course_ID = C.Course_ID AND CI.Offerring_Dept = D.Offerring_Dept AND CI.Pro_ID = P.Pro_ID;";
    var params = [req.body.Stu_Name];

    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    } // params에 값이 없으면 초기화
    con.query(sql, params, function (err, row) {
        if (err) { console.log(err) }
        else {
            res.send(row);
        }
    });
}); // 필터를 거쳐서 강의 조회

app.post('/regi_search', (req, res) => {
    var result = {Capacity:0, Count:0}
    var sql2 = "select Capacity from Course_Info where Course_SID = CONCAT((select Offerring_Dept from Dept_Info where Dept = '" + req.body.Dept + "' and College = '" + req.body.College + "'),'" + req.body.Course_ID + "','" + req.body.Class + "');"
    var sql = "select COUNT(*) as Count from Cart where Course_SID = CONCAT((select Offerring_Dept from Dept_Info where Dept = '" + req.body.Dept + "' and College = '" + req.body.College + "'),'" + req.body.Course_ID + "','" + req.body.Class + "')";
    var params = [req.body.Dept, req.body.College, req.body.Course_ID, req.body.Class];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    } // params에 값이 없으면 초기화

    con.query(sql, params, function (err,row) {
        if (err) { console.log(err) }
        else {
            con.query(sql2,params,function(err,row2){
                if(err){console.log(err)}
                else{
                    result.Capacity = row2[0].Capacity
                    result.Count = row[0].Count
                    res.send(result);
                }
            })
        }
    });
});

app.post('/cart_to_course', (req, res) => {
    var result = {isInsert: '0'};
    var sql = "DELETE FROM Cart WHERE Course_SID = CONCAT((SELECT Offerring_Dept from Dept_Info Where Dept = ? and College = ?),?,?) AND Stu_ID IN (SELECT Stu_ID from Student where Stu_Name = ?);";
    var params = [req.body.Dept, req.body.College, req.body.Course_ID, req.body.Class, req.body.Stu_Name];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    } // params에 값이 없으면 초기화

    con.query(sql, params, function (err) {
        if (err) { console.log(err) }
        else {
            result.isInsert = '1';
            res.send(result);
        }
    });
}); // 필터를 거쳐서 강의 조회

app.post('/course_to_cart', (req, res) => {
    var result = {isInsert: '0', regis:0};
    var sql_check_registering = "select Credit from Course where Course_ID = " + req.body.Course_ID + ";";
    var sql_check_registered = "select SUM(Credit) as Sum from Course_Info as CI, Course as C where CI.Course_ID = C.Course_ID AND Course_SID IN (select Course_SID from Cart where Stu_ID IN(select Stu_ID from Student where Stu_Name = '" + req.body.Stu_Name + "'))";
    var sql = "INSERT INTO Cart(Stu_ID,Course_SID,Auto_Apply_Flag) VALUES((SELECT Stu_ID from Student where Stu_Name = ?),CONCAT((SELECT Offerring_Dept from Dept_Info Where Dept = ? and College = ?),?,?),'F');";
    var params = [req.body.Stu_Name, req.body.Dept, req.body.College, req.body.Course_ID, req.body.Class];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    }
    con.query(sql_check_registered,function(err,row0){
        if(err){console.log(err)}
        else{
            con.query(sql_check_registering,function(err,row1){
                if(err){console.log(err)}
                else{
                    if(row0[0].Sum + row1[0].Credit > 24){
                        result.isInsert = '0';
                        res.send(result);
                    }
                    else{
                        con.query(sql, params, function (err) {
                            if (err) { console.log(err) }
                            else {
                                result.isInsert = '1';
                                result.regis = row0[0].Sum + row1[0].Credit;
                                res.send(result);
                            }
                        })
                    }
                }
            })
        }
    })
}); // 필터를 거쳐서 강의 조회

app.post('/auto_change', (req, res) => {
    var result = {isInsert: '0', regis:0 ,ava : 0};
    var sql_register = "select Credit from Course where Course_ID = " + req.body.Course_ID + ";";
    var sql_ava_credit = "select Ava_Credit from Student where Stu_Name = '" + req.body.Stu_Name + "';"
    var sql_check = "select SUM(Credit) as Sum from Course_Info as CI, Course as C where CI.Course_ID = C.Course_ID AND Course_SID IN (select Course_SID from Cart where Auto_Apply_Flag = 'T' and Stu_ID IN(select Stu_ID from Student where Stu_Name = '" + req.body.Stu_Name + "'))"
    var sql = "update Cart set Auto_Apply_Flag = ? where Stu_ID IN(select Stu_ID from Student where Stu_Name = ?) AND Course_SID = CONCAT((SELECT Offerring_Dept from Dept_Info Where Dept = ? and College = ?),?,?);";
    var params = [req.body.Auto_Apply_Flag, req.body.Stu_Name, req.body.Dept, req.body.College, req.body.Course_ID, req.body.Class];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    } // params에 값이 없으면 초기화

    con.query(sql_check,function(err,row1){
        if(err) {console.log(err)}
        else{
            con.query(sql_ava_credit,function(err,row2){
                if(err){console.log(err)}
                else{
                    con.query(sql_register,function(err,row3){
                        if(err){console.log(err)}
                        else{
                            if(req.body.Auto_Apply_Flag === 'F'){
                                con.query(sql, params, function (err) {
                                    if (err) { console.log(err) }
                                    else {
                                        result.isInsert = '1';
                                        result.regis = row1[0].Sum - row3[0].Credit
                                        result.ava = row2[0].Ava_Credit;
                                        res.send(result);
                                    }
                                });
                            }
                            else{
                                if(row1[0].Sum + row3[0].Credit > row2[0].Ava_Credit){
                                    result.isInsert = '0';
                                    res.send(result);
                                }
    
                                else{
                                    con.query(sql, params, function (err) {
                                        if (err) { console.log(err) }
                                        else {
                                            result.isInsert = '1';
                                            result.regis = row1[0].Sum + row3[0].Credit
                                            result.ava = row2[0].Ava_Credit;
                                            res.send(result);
                                        }
                                    });
                                }
                            }
                        }
                    })   
                }
            })
        }
    })
});

app.post('/credit_check', (req, res) => {
    var result = {regis : 0, auto : 0, ava : 0};
    var sql_registered = "select SUM(Credit) as Sum from Course as C, Course_Info as CI where C.Course_ID = CI.Course_ID and CI.Course_SID IN (select Course_SID from Cart where Stu_ID IN (select Stu_ID from Student where Stu_Name = '" + req.body.Stu_Name + "'))";
    var sql_auto = "select SUM(Credit) as Sum from Course as C, Course_Info as CI where C.Course_ID = CI.Course_ID and CI.Course_SID IN (select Course_SID from Cart where Auto_Apply_Flag = 'T' AND Stu_ID IN (select Stu_ID from Student where Stu_Name = '" + req.body.Stu_Name + "'))"
    var sql_ava = "select Ava_Credit from Student where Stu_Name = '" + req.body.Stu_Name + "'"
    var params = [req.body.Stu_Name];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    }
    con.query(sql_registered,function(err,row1){
        if(err){console.log(err)}
        else{
            con.query(sql_auto,function(err,row2){
                if(err){console.log(err)}
                else{
                    con.query(sql_ava,function(err,row3){
                        if(err){console.log(err)}
                        else{
                            result.regis = row1[0].Sum;
                            result.auto = row2[0].Sum;
                            result.ava = row3[0].Ava_Credit;
                            res.send(result)
                        }
                    })
                }
            })
        }
    })
}); // 필터를 거쳐서 강의 조회

app.post('/course_load', (req, res) => {
    var sql = "select C.Domain, CI.Course_SID, D.College, D.Dept, C.Course_Id, CI.Class, C.Course_Title, C.Completion_Type, D.Offerring_Dept, C.Credit, CI.Grade, P.Pro_Name, CI.Lab, CI.Language, CI.Course_Type, CI.Course_Time FROM Course as C, Course_Info as CI, Dept_Info as D, Professor as P WHERE C.Course_Id = CI.Course_Id AND CI.Offerring_Dept = D.Offerring_Dept AND CI.Pro_ID = P.Pro_ID AND P.Pro_Name LIKE CONCAT('%', '" + req.body.Pro_Name + "',  '%') AND C.Course_Title LIKE CONCAT('%', '" + req.body.Course_Title + "',  '%') AND D.Offerring_Dept LIKE CONCAT('%', '" + req.body.Offerring_Dept + "',  '%') AND C.Domain LIKE CONCAT('%', '" + req.body.Domain + "',  '%') AND C.Completion_Type LIKE CONCAT('%', '" + req.body.Completion_Type + "',  '%') AND CI.Course_SID NOT IN ( select Course_SID from Cart where Stu_ID IN ( select Stu_ID from Student where Stu_Name = '" + req.body.Stu_Name + "'))";
    var params = [req.body.Pro_Name, req.body.Course_Title, req.body.Offerring_Dept, req.body.Domain, req.body.Completion_Type, req.body.Stu_Name];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    }
    con.query(sql,function(err,row){
        if(err){console.log(err)}
        else{
            res.send(row);
        }
    })
}); // 필터를 거쳐서 강의 조회

 //수강신청 탭에서 강의 출력
 app.post('/course_search', (req, res) => {
    
    if (req.body.CourseType === '전체강의조회') {
        var sql_select = "SELECT C.Domain, CI.Course_SID, D.College, D.Dept, C.Course_Id, CI.Class, C.Course_Title, C.Completion_Type, D.Offerring_Dept, C.Credit, CI.Grade, P.Pro_Name, CI.Lab, CI.Language, CI.Course_Type, CI.Course_Time FROM Course as C, Course_Info as CI, Dept_Info as D, Professor as P WHERE C.Course_Id = CI.Course_Id AND CI.Offerring_Dept = D.Offerring_Dept AND CI.Pro_ID = P.Pro_ID AND P.Pro_Name LIKE CONCAT('%', ?,  '%') AND C.Course_Title LIKE CONCAT('%', ?,  '%') AND D.Offerring_Dept LIKE CONCAT('%', ?,  '%') AND C.Domain LIKE CONCAT('%', ?,  '%') AND C.Completion_Type LIKE CONCAT('%', ?,  '%') AND CI.Course_SID NOT IN(SELECT Course_SID FROM enrolment_"+req.body.Stu_ID+ ") AND CI.Course_SID NOT IN(SELECT Course_SID FROM reserve_"+req.body.Stu_ID+ ")";                    
        var params = [req.body.Pro_Name, req.body.Course_Title, req.body.Offerring_Dept, req.body.Domain, req.body.Completion_Type];
        
        for (var i = 0; i < params.length; i++) {
            if (params[i]===null || params[i]===undefined || params[i]==='0' || params[i]===0) {
                params[i] = '';
            }
        } // params에 값이 없으면 초기화

        con.query(sql_select, params, function(err, row) {
            if(err) {console.log(err)}
            else {
            res.send(row);
            }
        });
    }
    else if (req.body.CourseType === '관심과목강의조회'){
        var sql_select_cart = "SELECT C.Domain, CI.Course_SID, D.College, D.Dept, C.Course_Id, CI.Class, C.Course_Title, C.Completion_Type, D.Offerring_Dept, C.Credit, CI.Grade, P.Pro_Name, CI.Lab, CI.Language, CI.Course_Type, CI.Course_Time FROM Course as C, Course_Info as CI, Dept_Info as D, Professor as P, Cart as Ca WHERE Ca.Stu_ID = "+ req.body.Stu_ID +" AND CI.Course_SID = Ca.Course_SID AND C.Course_Id = CI.Course_Id AND CI.Offerring_Dept = D.Offerring_Dept AND CI.Pro_ID = P.Pro_ID AND P.Pro_Name LIKE CONCAT('%', ?,  '%') AND C.Course_Title LIKE CONCAT('%', ?,  '%') AND D.Offerring_Dept LIKE CONCAT('%', ?,  '%') AND C.Domain LIKE CONCAT('%', ?,  '%') AND C.Completion_Type LIKE CONCAT('%', ?,  '%') AND CI.Course_SID NOT IN(SELECT Course_SID FROM enrolment_"+req.body.Stu_ID+ ") AND CI.Course_SID NOT IN(SELECT Course_SID FROM reserve_"+req.body.Stu_ID+ ")";                    
        var params = [req.body.Pro_Name, req.body.Course_Title, req.body.Offerring_Dept, req.body.Domain, req.body.Completion_Type];

        for (var i = 0; i < params.length; i++) {
            if (params[i]===null || params[i]===undefined || params[i]==='0' || params[i]===0) {
                params[i] = '';
            }
        } // params에 값이 없으면 초기화

        con.query(sql_select_cart, params, function(err, row) {
            if(err) {console.log(err)}
            else {
            res.send(row);
            }
        });
    }
    
 }); // 필터를 거쳐서 강의 조회

 //신청 강의 뷰 'enrolment_학번'
 app.post('/enrolment_search', (req, res) => {
    var sql_select = "SELECT C.Domain, D.College, D.Dept, C.Course_Id, CI.Class, C.Course_Title, C.Completion_Type, CI.Offerring_Dept, C.Credit, CI.Grade, P.Pro_Name, CI.Lab, CI.Language, CI.Course_Type, CI.Course_Time FROM Course as C, Course_Info as CI, Dept_Info as D, enrolment_" + req.body.ID + " as E, Professor as P WHERE C.Course_Id = CI.Course_Id AND CI.Offerring_Dept = D.Offerring_Dept AND CI.Pro_ID = P.Pro_ID AND E.Course_SID = CI.Course_SID";
    
    con.query(sql_select, function(err, row) {
        if(err) {console.log(err)}
        else {
           res.send(row);
        }
    });
 });

 //예비 강의 뷰 'reserve_학번'
 app.post('/reserve_sugang', (req, res) => {  
    var sql_select = "SELECT C.Domain, D.College, D.Dept, C.Course_Id, CI.Class, C.Course_Title, C.Completion_Type, CI.Offerring_Dept, C.Credit, CI.Grade, P.Pro_Name, CI.Lab, CI.Language, CI.Course_Type, CI.Course_Time FROM Course as C, Course_Info as CI, Dept_Info as D, reserve_" + req.body.ID + " as R, Professor as P WHERE C.Course_Id = CI.Course_Id AND CI.Offerring_Dept = D.Offerring_Dept AND CI.Pro_ID = P.Pro_ID AND R.Course_SID = CI.Course_SID";
   
    con.query(sql_select, function(err, row4) {
        if(err) {console.log(err)}
        else {
           res.send(row4);
        }
    });
 });

 app.post('/check_number', (req, res) => { //강의 수강 인원, 강의 수용 인원, 사용자의 예비번호 추출
    var sql_select = "SELECT Offerring_Dept FROM Dept_Info WHERE College = ? AND Dept = ?";
    var params = [req.body.College, req.body.Dept];
    var result = {
        enrolment_number : 0,
        enrolment_capacity: 0,
        reserve_number : 0
    };
    con.query(sql_select, params, function(err, row1) {
        if(err) {console.log(err)}
        else {
            var SID = row1[0].Offerring_Dept + req.body.Course_Id + req.body.Class;
            var select_enrolment = "SELECT * FROM Enrolment WHERE Course_SID = " + SID;

            con.query(select_enrolment, function(err, row2) {
                if(err) {console.log(err)}
                else {
                    result.enrolment_number = row2.length;

                    var sql_capacity = "SELECT * FROM Course_Info WHERE Course_SID = " + SID;

                    con.query(sql_capacity, function(err, row3) {
                        if(err) {console.log(err)}
                        else {
                            result.enrolment_capacity = row3[0].Capacity;
                            
                            var select_reserve = "SELECT * FROM Reserve_Number WHERE Course_SID = " + SID + " ORDER BY Priority DESC";

                            con.query(select_reserve, function(err, row3) {
                                if(err) {console.log(err)}
                                else {
                                    
                                    for (var i = 0; i < row3.length; i++) {
                                        if(row3[i].Stu_ID === req.body.Stu_ID) {
                                            result.reserve_number = i + 1;
                                        }
                                    }
                                    res.send(result);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
 });

//enrolment 뷰 또는 reserve뷰에 레코드 삽입
app.post('/insert_course', (req, res) => {
    var result = {isInsert: ''}; 
    var sql_select = "SELECT Offerring_Dept FROM Dept_Info WHERE College = ? AND Dept = ?";
    var params = [req.body.College, req.body.Dept];
    con.query(sql_select, params, function(err, row2) { //Course_SID를 위한 Offerring_Dept 추출
        if (err) {console.log(err)}
        else {
            var SID = row2[0].Offerring_Dept + req.body.Course_Id + req.body.Class;
            var sql_enrolment_duplication = "SELECT * FROM enrolment_"+req.body.Stu_ID+" WHERE Course_SID = "+SID;
            con.query(sql_enrolment_duplication, function(err, row0) { // 이미 신청한 과목인지 확인
                if (err) {console.log(err)}
                else {
                    if(row0.length > 0){ // 이미 수강 신청한 과목이라면
                        result.isInsert = '4';
                        res.send(result); //중복신청 알림 띄우고 끗!
                    }
                    else{
                        var sql_reserve_duplication = "SELECT * FROM reserve_"+req.body.Stu_ID+" WHERE Course_SID = "+SID;
                        con.query(sql_reserve_duplication, function(err, row00) { // 이미 예비 신청한 과목인지 확인
                            if (err) {console.log(err)}
                            else {
                                if(row00.length > 0){ // 이미 예비 신청한 과목이라면 
                                    result.isInsert = '5';
                                    res.send(result); //중복 예비신청 알림 띄우고 끗!
                                }
                                else{ // 수강신청도 예비신청도 아닌 과목이면
                                    var sql_SID = "SELECT count(*) as Applicant FROM Enrolment WHERE Course_SID ="+ SID; 
                                    con.query(sql_SID, function(err,row6){ // Enrolment에 있는 해당 과목 신청자 수 검색
                                        if(err) {console.log(err)}
                                        else{
                                            var sql_Capacity = "SELECT Capacity FROM Course_Info WHERE Course_SID = "+SID;
                                            con.query(sql_Capacity, function(err,row7){ // Course_Info에 있는 해당 과목 수요인원 검색
                                                var num_applicant = Number(row6[0].Applicant);
                                                var num_capacity = Number(row7[0].Capacity);
                                                if(err){console.log(err)}
                                                else{
                                                    if(num_applicant<num_capacity){ // 강의 여석이 있다면
                                                        var sql_credit = "SELECT Ava_Credit, App_Credit FROM Student WHERE Stu_ID = "+ req.body.Stu_ID;
                                                        con.query(sql_credit, function(err, row1) { //사용자의 신청 가능 학점과 신청한 학점 추출
                                                            if (err) {console.log(err)}
                                                            else {
                                                                var cnt_Credit = Number(row1[0].App_Credit) + Number(req.body.Credit);
                                                                var sql_search_reserve = "SELECT SUM(C.Credit) as Sum FROM Course as C ,Course_Info as CI, reserve_"+req.body.Stu_ID+" as R WHERE C.Course_ID = CI.Course_ID AND R.Course_SID = CI.Course_SID";
                                                                con.query(sql_search_reserve,function(err,row9){ //해당 학생 예비 신청 학점 합 구하기
                                                                    if(err){console.log(err)}
                                                                    else{
                                                                        var num_reserve = Number(row9[0].Sum);               
                                                                        if((cnt_Credit+num_reserve)>24){ //예비+수강신청 학점이 24보다 크면 
                                                                            result.isInsert = '0'; 
                                                                            res.send(result);//신청못함 알림 띄우고 끗!
                                                                        }
                                                                        else{ //예비+수강신청 학점이 24보다 작으면
                                                                            if (cnt_Credit > row1[0].Ava_Credit) { //수강신청 학점이 18보다 크면, 남은 신청 학점 없음
                                                                                result.isInsert = '0';
                                                                                res.send(result);   //신청못함 알림 띄우고 끗!
                                                                            }
                                                                            else{ // 신청할 수 있는 경우, 남은 신청 학점 있음
                                                                                var sql_insert = "INSERT INTO enrolment_"+ req.body.Stu_ID + " (Stu_ID, Course_SID) VALUES ("+ req.body.Stu_ID + ","+ SID + " )";
                                                                                con.query(sql_insert, function(err, row3) { //해당 과목 뷰에 넣기
                                                                                    if (err) {console.log(err)}
                                                                                else {
                                                                                    var sql_update = "UPDATE Student SET App_Credit = "+ cnt_Credit + " WHERE Stu_ID = " + req.body.Stu_ID;
                                                                                    con.query(sql_update, function(err, row4) { //App_Credit 갱신
                                                                                        if (err) {console.log(err)}
                                                                                        else {
                                                                                        result.isInsert = '1';
                                                                                        res.send(result); //신청완료 알림 띄우고 끗!
                                                                                        }
                                                                                    });
                                                                                    }
                                                                                });
                                                                            }   
                                                                        }                           
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }   
                                                    else{//강의 여석이 없다면
                                                        var sql_search_reserve = "SELECT SUM(C.Credit) as Sum FROM Course as C ,Course_Info as CI, reserve_"+req.body.Stu_ID+" as R WHERE C.Course_ID = CI.Course_ID AND R.Course_SID = CI.Course_SID";
                                                        con.query(sql_search_reserve,function(err,row9){ //해당 학생 예비 신청 학점 합 구하기
                                                            if(err){console.log(err)}
                                                            else{
                                                                var sql_credit = "SELECT Ava_Credit, App_Credit FROM Student WHERE Stu_ID = "+ req.body.Stu_ID;
                                                                con.query(sql_credit, function(err, row1) { //사용자의 신청 가능 학점과 신청한 학점 추출
                                                                    if (err) {console.log(err)}
                                                                    else {
                                                                        var cnt_Credit = Number(row1[0].App_Credit) + Number(req.body.Credit);
                                                                        var num_reserve = Number(row9[0].Sum);               
                                                                        if((cnt_Credit+num_reserve)>24){ //예비+수강신청 학점이 24보다 크면 
                                                                            result.isInsert = '2'; 
                                                                            res.send(result);// 여석없음, 예비학점도 없음 알림 띄우고 끗!
                                                                        }
                                                                        else{ // 예비 신청이 가능하면
                                                                            var sql_insert_reserve = "INSERT INTO reserve_"+ req.body.Stu_ID + " (Stu_ID, Course_SID) VALUES ("+ req.body.Stu_ID + ","+ SID + " )";
                                                                            con.query(sql_insert_reserve,function(err, row8) { //해당 예비 뷰에 넣기
                                                                                if (err) {console.log(err)}
                                                                                else {
                                                                                    result.isInsert = '3';
                                                                                    res.send(result); //result에 3반환
                                                                                }
                                                                            });
                                                                        } 
                                                                    }       
                                                                });                       
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        }); 

                    }
                }
            });           
        }
    });
});

//강의 시간 비교(자동이관)
app.post('/check_time_cart', (req, res) => {
    var sql_select = "SELECT Offerring_Dept FROM Dept_Info WHERE College = ? AND Dept = ?";
    var params = [req.body.College, req.body.Dept];
    var result = {isInsert: '0'};
    var flag_overlap = '1';
    con.query(sql_select, params, function(err, row1) { //Course_SID를 위한 Offerring_Dept 추출
        if (err) {console.log(err)}
        else {
            var SID = row1[0].Offerring_Dept + req.body.Course_ID + req.body.Class;
            var sql_button = "SELECT Course_SID, Starting_Time_1 B_ST1, Ending_Time_1 B_ET1, Starting_Time_2 B_ST2, Ending_Time_2 B_ET2, Starting_Time_3 B_ST3, Ending_Time_3 B_ET3 FROM Course_Info WHERE Course_SID = " + SID;
            
            con.query(sql_button, function(err, row2) { //버튼 클릭한 강의의 시간표 정보 추출
                if (err) {console.log(err)}
                else {
                    var sql_course = "SELECT C.Course_SID, C.Starting_Time_1 ST1, C.Ending_Time_1 ET1, C.Starting_Time_2 ST2, C.Ending_Time_2 ET2, C.Starting_Time_3 ST3, C.Ending_Time_3 ET3 FROM Course_Info C inner join Cart E on C.Course_SID = E.Course_SID WHERE E.Auto_Apply_Flag = 'T' AND E.Stu_ID = "+req.session.user.id;
        
                    con.query(sql_course, function(err, row3) { //enrolment_사용자 view 강의들의 시간표 정보 추출
                        if (err) {console.log(err)}
                        else {
                            for(var i = 0; i < row3.length; i++) {
                                
                                if(row2[0].B_ST1 === null) {
                                    break;
                                }
                                if(row3[i].ST1 !== null) {
                                    //클릭한 강의의 첫번째 시간표와 비교
                                    
                                    if(row2[0].B_ST1 > row3[i].ET1 || row2[0].B_ET1 < row3[i].ST1) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST1 > row3[i].ET2 || row2[0].B_ET1 < row3[i].ST2) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST1 > row3[i].ET3 || row2[0].B_ET1 < row3[i].ST3) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }
                                }
                            }
                            for(var i = 0; i < row3.length; i++) {
                                if(flag_overlap === '0') {
                                    break;
                                }
                                if(row2[0].B_ST2 === null) {
                                    break;
                                }
                                if(row3[i].ST1 !== null) {
                                    //클릭한 강의의 첫번째 시간표와 비교
                                    if(row2[0].B_ST2 > row3[i].ET1 || row2[0].B_ET2 < row3[i].ST1) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST2 > row3[i].ET2 || row2[0].B_ET2 < row3[i].ST2) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST2 > row3[i].ET3 || row2[0].B_ET2 < row3[i].ST3) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }
                                }
                            }
                            for(var i = 0; i < row3.length; i++) {
                                if(flag_overlap === '0') {
                                    break;
                                }
                                if(row2[0].B_ST3 === null) {
                                    break;
                                }
                                if(row3[i].ST3 !== null) {
                                    //클릭한 강의의 첫번째 시간표와 비교
                                    if(row2[0].B_ST3 > row3[i].ET1 || row2[0].B_ET3 < row3[i].ST1) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST3 > row3[i].ET2 || row2[0].B_ET3 < row3[i].ST2) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST3 > row3[i].ET3 || row2[0].B_ET3 < row3[i].ST3) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }
                                }
                            }
                            result.isInsert = flag_overlap;
                            res.send(result);
                        }
                    });
                }
            });
        }
    });
});

 //강의 시간 비교(수강신청)
 app.post('/check_time_table', (req, res) => {
    var sql_select = "SELECT Offerring_Dept FROM Dept_Info WHERE College = ? AND Dept = ?";
    var params = [req.body.College, req.body.Dept];
    var result = {isInsert: '0'};
    var flag_overlap = '1';
    con.query(sql_select, params, function(err, row1) { //Course_SID를 위한 Offerring_Dept 추출
        if (err) {console.log(err)}
        else {
            var SID = row1[0].Offerring_Dept + req.body.Course_Id + req.body.Class;
            var sql_button = "SELECT Course_SID, Starting_Time_1 B_ST1, Ending_Time_1 B_ET1, Starting_Time_2 B_ST2, Ending_Time_2 B_ET2, Starting_Time_3 B_ST3, Ending_Time_3 B_ET3 FROM Course_Info WHERE Course_SID = " + SID;
            
            con.query(sql_button, function(err, row2) { //버튼 클릭한 강의의 시간표 정보 추출
                if (err) {console.log(err)}
                else {
                    var sql_course = "SELECT C.Course_SID, C.Starting_Time_1 ST1, C.Ending_Time_1 ET1, C.Starting_Time_2 ST2, C.Ending_Time_2 ET2, C.Starting_Time_3 ST3, C.Ending_Time_3 ET3 FROM Course_Info C inner join enrolment_" + req.body.Stu_ID + " E on C.Course_SID = E.Course_SID";
        
                    con.query(sql_course, function(err, row3) { //enrolment_사용자 view 강의들의 시간표 정보 추출
                        if (err) {console.log(err)}
                        else {
                            for(var i = 0; i < row3.length; i++) {
                                if(row2[0].B_ST1 === null) {
                                    break;
                                }
                                if(row3[i].ST1 !== null) {
                                    //클릭한 강의의 첫번째 시간표와 비교
                                    
                                    if(row2[0].B_ST1 > row3[i].ET1 || row2[0].B_ET1 < row3[i].ST1) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST1 > row3[i].ET2 || row2[0].B_ET1 < row3[i].ST2) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST1 > row3[i].ET3 || row2[0].B_ET1 < row3[i].ST3) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }
                                }
                            }
                            for(var i = 0; i < row3.length; i++) {
                                if(flag_overlap === '0') {
                                    break;
                                }
                                if(row2[0].B_ST2 === null) {
                                    break;
                                }
                                if(row3[i].ST1 !== null) {
                                    //클릭한 강의의 첫번째 시간표와 비교
                                    if(row2[0].B_ST2 > row3[i].ET1 || row2[0].B_ET2 < row3[i].ST1) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST2 > row3[i].ET2 || row2[0].B_ET2 < row3[i].ST2) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST2 > row3[i].ET3 || row2[0].B_ET2 < row3[i].ST3) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }
                                }
                            }
                            for(var i = 0; i < row3.length; i++) {
                                if(flag_overlap === '0') {
                                    break;
                                }
                                if(row2[0].B_ST3 === null) {
                                    break;
                                }
                                if(row3[i].ST3 !== null) {
                                    //클릭한 강의의 첫번째 시간표와 비교
                                    if(row2[0].B_ST3 > row3[i].ET1 || row2[0].B_ET3 < row3[i].ST1) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST3 > row3[i].ET2 || row2[0].B_ET3 < row3[i].ST2) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }

                                    if(row2[0].B_ST3 > row3[i].ET3 || row2[0].B_ET3 < row3[i].ST3) {
                                        //겹치지 않음
                                        flag_overlap = '1';
                                    }
                                    else {
                                        flag_overlap = '0';
                                        break;
                                    }
                                }
                            }
                            if(flag_overlap === '0') {
                                var sql_enrolment_duplication = "SELECT * FROM enrolment_"+req.body.Stu_ID+" WHERE Course_SID = "+SID;
                                con.query(sql_enrolment_duplication, function(err, row4) { // 이미 신청한 과목인지 확인
                                    if (err) {console.log(err)}
                                    else {
                                        if(row4.length > 0){ // 이미 수강 신청한 과목이라면
                                            result.isInsert = '4';
                                            res.send(result); //중복신청 알림 띄우고 끗!
                                        }
                                        else {
                                            var sql_reserve_duplication = "SELECT * FROM reserve_"+req.body.Stu_ID+" WHERE Course_SID = "+SID;
                                            con.query(sql_reserve_duplication, function(err, row5) { // 이미 예비 신청한 과목인지 확인
                                                if (err) {console.log(err)}
                                                else {
                                                    if(row5.length > 0){ // 이미 예비 신청한 과목이라면 
                                                        result.isInsert = '5';
                                                        res.send(result); //중복 예비신청 알림 띄우고 끗!
                                                    }
                                                    else {
                                                        result.isInsert = flag_overlap;
                                                        res.send(result);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            else {
                                result.isInsert = flag_overlap;
                                res.send(result);
                            }
                        }
                    });
                }
            });
        }
    });
});

app.post('/enrolment_to_reserve', (req, res) => {
    var sql_select = "SELECT Offerring_Dept FROM Dept_Info WHERE College = ? AND Dept = ?";
    var params = [req.body.College, req.body.Dept];
    var flag_overlap = '1';
    var ID = []; //해당 과목을 예비로 담은 사용자 배열
    var insert_ID; //신청 리스트로 이동하는 사용자 아이디
    var result = {
        isInsert: '0',
        Stu_ID: '', //메일 보내야하는 사용자 -> 예비 1번으로 바뀐 사용자
        Stu_Name: '',
        E_Mail: '',
        Course_Title: req.body.Course_Title
    };
    
    con.query(sql_select, params, function(err, row1) { //해당 과목의 SID 찾기
        if (err) {console.log(err)}
        else {
            var SID = row1[0].Offerring_Dept + req.body.Course_Id + req.body.Class;
            var sql_reserve_duplication = "SELECT R.Stu_ID Stu_ID, CI.Course_SID, CI.Starting_Time_1 B_ST1, CI.Ending_Time_1 B_ET1, CI.Starting_Time_2 B_ST2, CI.Ending_Time_2 B_ET2, CI.Starting_Time_3 B_ST3, CI.Ending_Time_3 B_ET3 FROM Reserve_Number R INNER JOIN Course_Info CI ON R.Course_SID = CI.Course_SID WHERE R.Course_SID = " + SID + " ORDER BY Priority DESC";

            con.query(sql_reserve_duplication, function(err, row2) { //해당 과목의 예비 리스트 추출
                if(err) {console.log(err)}
                else {
                    var sql_enrolment_student = '';
                    
                    if(row2.length > 0) {
                        for(var i = 0; i < row2.length; i++) { //예비 리스트 반복
                            ID[i] = row2[i].Stu_ID;
                            sql_enrolment_student += "SELECT E.Stu_ID Stu_ID, CI.Course_SID, CI.Starting_Time_1 ST1, CI.Ending_Time_1 ET1, CI.Starting_Time_2 ST2, CI.Ending_Time_2 ET2, CI.Starting_Time_3 ST3, CI.Ending_Time_3 ET3 FROM Enrolment E INNER JOIN Course_Info CI ON E.Course_SID = CI.Course_SID WHERE E.Stu_ID = " + row2[i].Stu_ID + ";";
                        }

                        con.query(sql_enrolment_student, function(err, row3) { //해당 과목의 예비 리스트 추출
                            if(err) {console.log(err)}
                            else {
                                console.log("길이"+row3.length)
                                insert_ID = ID[0];
                                for(var i = 0; i < row3.length; i++) {
                                    if(row3[i].length === 0) { //신청 과목 리스트가 비어있을 경우
                                        insert_ID = ID[i]; //해당 아이디 저장
                                        console.log("여기?")
                                        flag_overlap = '1';
                                        break;
                                    }
                                    else {
                                        for(var j = 0; j < row3[i].length; j++) {
                                            
                                        console.log(result.Stu_ID)
                                            if(row2[0].B_ST1 === null) {
                                                break;
                                            }
                                            if(row3[i][j].ST1 !== null) {
                                                //클릭한 강의의 첫번째 시간표와 비교
                                                
                                                if(row2[0].B_ST1 > row3[i][j].ET1 || row2[0].B_ET1 < row3[i][j].ST1) {
                                                    //겹치지 않음
                                                    flag_overlap = '1';
                                                    console.log("안겹침 1-1")
                                                }
                                                else {
                                                    flag_overlap = '0';
                                                    console.log("겹침 1-1")
                                                    break;
                                                }
            
                                                if(row2[0].B_ST1 > row3[i][j].ET2 || row2[0].B_ET1 < row3[i][j].ST2) {
                                                    //겹치지 않음
                                                    flag_overlap = '1';
                                                    console.log("안겹침 1-2")
                                                }
                                                else {
                                                    flag_overlap = '0';
                                                    console.log("겹침 1-2")
                                                    break;
                                                }
            
                                                if(row2[0].B_ST1 > row3[i][j].ET3 || row2[0].B_ET1 < row3[i][j].ST3) {
                                                    //겹치지 않음
                                                    flag_overlap = '1';
                                                    console.log("안겹침 1-3")
                                                }
                                                else {
                                                    flag_overlap = '0';
                                                    console.log("겹침 1-3")
                                                    break;
                                                }
                                            }
                                        }
                                        for(var j = 0; j < row3[i].length; j++) {
                                            if(flag_overlap === '0') {
                                                break;
                                            }
                                            if(row2[0].B_ST2 === null) {
                                                break;
                                            }
                                            if(row3[i][j].ST1 !== null) {
                                                //클릭한 강의의 첫번째 시간표와 비교
                                                if(row2[0].B_ST2 > row3[i][j].ET1 || row2[0].B_ET2 < row3[i][j].ST1) {
                                                    //겹치지 않음
                                                    flag_overlap = '1';
                                                    console.log("안겹침 2-1")
                                                }
                                                else {
                                                    flag_overlap = '0';
                                                    console.log("겹침 2-1")
                                                    break;
                                                }
            
                                                if(row2[0].B_ST2 > row3[i][j].ET2 || row2[0].B_ET2 < row3[i][j].ST2) {
                                                    //겹치지 않음
                                                    flag_overlap = '1';
                                                    console.log("안겹침 2-2")
                                                }
                                                else {
                                                    flag_overlap = '0';
                                                    console.log("겹침 2-2")
                                                    break;
                                                }
            
                                                if(row2[0].B_ST2 > row3[i][j].ET3 || row2[0].B_ET2 < row3[i][j].ST3) {
                                                    //겹치지 않음
                                                    flag_overlap = '1';
                                                    console.log("안겹침 2-3")
                                                }
                                                else {
                                                    flag_overlap = '0';
                                                    console.log("겹침 2-3")
                                                    break;
                                                }
                                            }
                                        }
                                        for(var j = 0; j < row3[i].length; j++) {
                                            if(flag_overlap === '0') {
                                                break;
                                            }
                                            if(row2[0].B_ST3 === null) {
                                                break;
                                            }
                                            if(row3[i][j].ST1 !== null) {
                                                //클릭한 강의의 첫번째 시간표와 비교
                                                if(row2[0].B_ST3 > row3[i][j].ET1 || row2[0].B_ET3 < row3[i][j].ST1) {
                                                    //겹치지 않음
                                                    flag_overlap = '1';
                                                    console.log("안겹침 3-1")
                                                }
                                                else {
                                                    flag_overlap = '0';
                                                    console.log("겹침 3-1")
                                                    break;
                                                }
            
                                                if(row2[0].B_ST3 > row3[i][j].ET2 || row2[0].B_ET3 < row3[i][j].ST2) {
                                                    //겹치지 않음
                                                    flag_overlap = '1';
                                                    console.log("안겹침 3-2")
                                                }
                                                else {
                                                    flag_overlap = '0';
                                                    console.log("겹침 3-2")
                                                    break;
                                                }
            
                                                if(row2[0].B_ST3 > row3[i][j].ET3 || row2[0].B_ET3 < row3[i][j].ST3) {
                                                    //겹치지 않음
                                                    flag_overlap = '1';
                                                    console.log("안겹침 3-3")
                                                }
                                                else {
                                                    flag_overlap = '0';
                                                    console.log("겹침 3-3")
                                                    break;
                                                }
                                            }
                                        }
                                        if(flag_overlap === '1') {          
                                            console.log(flag_overlap);
                                            console.log(ID[i]);                     
                                            insert_ID = ID[i];
                                            break;
                                        }
                                    }
                                }
                                if(flag_overlap === '1') {
                                    var sql_insert = "INSERT INTO Enrolment (Stu_ID, Course_SID) VALUES ("+ insert_ID + ","+ SID + " )";

                                    con.query(sql_insert, function(err, row4) { //해당 학생 신청 뷰에 넣기
                                        if (err) {console.log(err)}
                                        else {
                                            var sql_delete = "DELETE FROM Reserve_Number WHERE Stu_ID = " + insert_ID + " AND Course_SID = " + SID;
                                    
                                            con.query(sql_delete, function(err, row5) { //해당 학생 예비 뷰에 넣기
                                                if (err) {console.log(err)}
                                                else {
                                                    var sql_select_student = "SELECT * FROM Reserve_Number WHERE Course_SID = " + SID + " ORDER BY Priority DESC";

                                                    con.query(sql_select_student, function(err, row6) { //해당 학생 예비 뷰에 넣기
                                                        if (err) {console.log(err)}
                                                        else {
                                                            result.Stu_ID = row6[0].Stu_ID;
                                                            var sql_mail_student = "SELECT Stu_Name, E_Mail FROM Student WHERE Stu_ID = " + result.Stu_ID;

                                                            con.query(sql_mail_student, function(err, row7) { //해당 학생 예비 뷰에 넣기
                                                                if (err) {console.log(err)}
                                                                else {
                                                                    result.Stu_Name = row7[0].Stu_Name;
                                                                    result.E_Mail = row7[0].E_Mail;
                                                                    res.send(result);
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    });  
});

app.post('/reserve_to_reserve', (req, res) => {
    var sql_select = "SELECT Offerring_Dept FROM Dept_Info WHERE College = ? AND Dept = ?";
    var params = [req.body.College, req.body.Dept];
    var result = {
        Stu_ID: '',
        Stu_Name: '',
        E_Mail: '',
        Course_Title: req.body.Course_Title
    };

    con.query(sql_select, params, function(err, row1) { //해당 과목의 SID 찾기
        if (err) {console.log(err)}
        else {
            var SID = row1[0].Offerring_Dept + req.body.Course_Id + req.body.Class;
            var select_reserve = "SELECT R.Stu_ID, S.Stu_Name, S.E_Mail FROM Reserve_Number R INNER JOIN Student S ON R.Stu_ID = S.Stu_ID WHERE Course_SID = " + SID;

            con.query(select_reserve, function(err, row2) { //해당 과목의 예비 리스트 추출
                if(err) {console.log(err)}
                else {
                    if(row2.length > 0) { //해당 과목의 예비 리스트가 있을 경우
                        result.Stu_ID = row2[0].Stu_ID;
                        result.Stu_Name = row2[0].Stu_Name;
                        result.E_Mail = row2[0].E_Mail;
                        res.send(result);
                    }
                }
            });
        }
    });
});


app.post('/delete_cart_reserve', (req, res) => {
    var sql = "delete from Cart where Stu_ID = '" + req.body.Stu_ID + "' and Course_SID IN (CONCAT((select Offerring_Dept from Dept_Info where Dept = '" + req.body.Dept + "' and College = '" + req.body.College + "'),'" + req.body.Course_Id + "','" + req.body.Class + "'))";
    var params = [req.body.Stu_ID, req.body.Course_Id, req.body.College, req.body.Dept, req.body.Class];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    }
    con.query(sql,function(err){
        if(err){console.log(err)}
    });
});

 //enrolment 뷰에 레코드 삭제
app.post('/delete_enrolment', (req, res) => {
    var sql_credit = "SELECT Ava_Credit, App_Credit FROM Student WHERE Stu_ID = "+ req.body.Stu_ID;
    var result = {isDelete: '',
                    App_Credit: 0,
                    Ava_Credit: 0};
    con.query(sql_credit, function(err, row1) { //사용자의 신청 가능 학점과 신청한 학점 추출    
        var sql_select = "SELECT Offerring_Dept FROM Dept_Info WHERE College = ? AND Dept = ?";
        var params = [req.body.College, req.body.Dept];
        var cnt_Credit = Number(row1[0].App_Credit) - Number(req.body.Credit);
        
        con.query(sql_select, params, function(err, row2) { //Course_SID를 위한 Offerring_Dept 추출
            if (err) {console.log(err)}
            else {
                var SID = row2[0].Offerring_Dept + req.body.Course_Id + req.body.Class;
                var sql_enrolment_duplication = "SELECT * FROM enrolment_"+req.body.Stu_ID+" WHERE Course_SID = "+SID;
                
                con.query(sql_enrolment_duplication, function(err, row3) { // 이미 예비 신청한 과목인지 확인
                    if (err) {console.log(err)}
                    else {
                        if(row3.length === 0){ // 이미 예비 신청한 과목이라면 
                            result.isDelete = '1';
                            res.send(result); //중복 예비신청 알림 띄우고 끗!
                        }
                        else {
                            var sql_delete = "DELETE FROM enrolment_"+ req.body.Stu_ID + " WHERE Stu_ID = " + req.body.Stu_ID + " AND Course_SID = " + SID;
                
                            con.query(sql_delete, function(err, row4) {
                                if (err) {console.log(err)}
                                else {
                                    var sql_update = "UPDATE Student SET App_Credit = "+ cnt_Credit + " WHERE Stu_ID = " + req.body.Stu_ID;
                                    con.query(sql_update, function(err, row5) { //App_Credit 갱신
                                        if (err) {console.log(err)}
                                        else {
                                            var sql_print_credit = "SELECT App_Credit, Ava_Credit FROM Student WHERE Stu_ID = "+ req.body.Stu_ID;

                                            con.query(sql_print_credit, function(err, row6) { //App_Credit 갱신
                                                if (err) {console.log(err)}
                                                else {
                                                    result.App_Credit = row6[0].App_Credit;
                                                    result.Ava_Credit = row6[0].Ava_Credit;
                                                    result.isDelete = '0';
                                                    res.send(result);
                                                }
                                            });
                                        } 
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }); 
    });
});

 //reserve뷰에 레코드 삭제
app.post('/delete_reserve', (req, res) => {
    var sql_credit = "SELECT Ava_Credit, App_Credit FROM Student WHERE Stu_ID = "+ req.body.Stu_ID;
    var result = {isDelete: ''};
    con.query(sql_credit, function(err, row1) { //사용자의 신청 가능 학점과 신청한 학점 추출    
        var sql_select = "SELECT Offerring_Dept FROM Dept_Info WHERE College = ? AND Dept = ?";
        var params = [req.body.College, req.body.Dept];
        
        con.query(sql_select, params, function(err, row2) { //Course_SID를 위한 Offerring_Dept 추출
            if (err) {console.log(err)}
            else {
                var SID = row2[0].Offerring_Dept + req.body.Course_Id + req.body.Class;
                var sql_reserve_duplication = "SELECT * FROM reserve_"+req.body.Stu_ID+" WHERE Course_SID = "+SID;
                
                con.query(sql_reserve_duplication, function(err, row3) { // 이미 예비 삭제한 과목인지 확인
                    if (err) {console.log(err)}
                    else {
                        if(row3.length === 0){ // 이미 예비 삭제한 과목이라면 
                            result.isDelete = '1';
                            res.send(result); //중복 예비신청 알림 띄우고 끗!
                        }
                        else {
                            var sql_delete = "DELETE FROM reserve_"+ req.body.Stu_ID + " WHERE Stu_ID = " + req.body.Stu_ID + " AND Course_SID = " + SID;
                
                            con.query(sql_delete, function(err, row4) {
                                if (err) {console.log(err)}
                                else {
                                    result.isDelete = '0';
                                    res.send(result);
                                }
                            });
                        }
                    }
                });
            }
        }); 
    });
});

app.post('/print_credit', (req, res) => {
    var result = {
        App_Credit: 0,
        Ava_Credit: 0,
        App_Reserve_Credit: 0,
        Ava_Reserve_Credit: 0
    };

    var sql_enrolment_app_credit = "SELECT SUM(C.Credit) AS App_Credit FROM Course AS C ,Course_Info AS CI, enrolment_" + req.body.ID +" AS E WHERE C.Course_ID = CI.Course_ID AND E.Course_SID = CI.Course_SID";

    con.query(sql_enrolment_app_credit, function(err, row1) {
        if (err) {console.log(err)}
        else {
            if(row1[0].App_Credit === null) {
                result.App_Credit = 0;
            }
            else {
                result.App_Credit = row1[0].App_Credit;
            }
            result.Ava_Reserve_Credit = 24 - row1[0].App_Credit;

            var sql_enrolment_ava_credit = "SELECT Ava_Credit FROM Student WHERE Stu_ID = " + req.body.ID;

            con.query(sql_enrolment_ava_credit, function(err, row3) {
                if (err) {console.log(err)}
                else {
                    result.Ava_Credit = row3[0].Ava_Credit;

                    var sql_update_credit = "UPDATE Student SET App_Credit = " + result.App_Credit + " WHERE Stu_ID = " + req.body.ID;

                    con.query(sql_update_credit, function(err, row4) {
                        if (err) {console.log(err)}
                        else {
                            var sql_reserve_credit = "SELECT SUM(C.Credit) AS sum FROM Course AS C ,Course_Info AS CI, reserve_" + req.body.ID + " AS R WHERE C.Course_ID = CI.Course_ID AND R.Course_SID = CI.Course_SID";

                            con.query(sql_reserve_credit, function(err, row5) {
                                if (err) {console.log(err)}
                                else {
                                    if(row5[0].sum === null) {
                                        result.App_Reserve_Credit = 0;
                                    }
                                    else {
                                        result.App_Reserve_Credit = row5[0].sum;
                                    }
                                    res.send(result);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
})

app.post('/send_mail', (req, res) => {
    const name = "recaplus2019@gmail.com";
    const email = req.body.E_Mail;

    var mail = {
        from: name, //보내는 사람 이메일 => All-Clear 이메일
        to: email, //받는 사람 이메일
        subject: "[All-Clear] 예비번호 알람입니다.",
        text: req.body.Stu_ID + " " + req.body.Stu_Name + " 님,\n\n[" + req.body.Course_Title + "] 강의의 예비번호가 1번으로 갱신되었습니다!\n여석이 생기면 자동 신청 됩니다.\n해당 강의의 학점과 시간을 비워주시기 바랍니다."
    }

    transporter.sendMail(mail, (err, data) => {
        if(err) {
            res.json({
                msg: 'fail'
            })
        } else {
            res.json({
                msg: 'success'
            })
        }
    })
})

 app.post('/getSyllabus', (req, res) => {
    var SyllabusData = {
        title: '', professor: '', course_info: '', call: '',
        time_and_class: '', pre_subject: '', e_mail: '', lab: '', textbook: '',
        goal: '', // 교과목표
        capability: '', // 핵심역량
        assignment: '', // 과제물
        assessment: '', // 평가방법
        notice: '', // 추가 안내사항
        Course_Order: '', // 예비번호 우선순위
        filename: req.body.filename
    }
    var array;
    try { // 등록된 수업 계획서 존재 시
        array = fs.readFileSync('../src/syllabus/'+req.body.filename);
        array = array.toString().split("\n");
        var i = 0;
        for (key in SyllabusData) {
            SyllabusData[key] = array[i];
            i++;
        }
        res.send(SyllabusData);
    } catch (err) {
        res.send(SyllabusData);
    } // 수업 계획서 없을 때 데이터가 빈 SyllabusData 전송
 }); // 서버에 등록된 수업 계획서 출력

 app.post('/setSyllabus', (req, res) => {    
    var SyllabusData = {
        title: req.body.title, // 강의 이름
        professor: req.body.professor,
        course_info: req.body.course_info, // 예비번호 우선순위
        call: req.body.call,
        time_and_class: req.body.time_and_class, // 강의시간 및 강의실
        pre_subject: req.body.pre_subject, // 선수과목
        e_mail: req.body.e_mail,
        lab: req.body.lab, // 연구실
        textbook: req.body.textbook, // 교재
        goal: req.body.goal, // 교과목표
        capability: req.body.capability, // 핵심역량
        assignment: req.body.assignment, // 과제물
        assessment: req.body.assessment, // 평가방법
        notice: req.body.notice, // 추가 안내사항
        Course_Order: req.body.Course_Order,// 예비번호 우선순위
        filename: req.body.filename // 수업 계획서 이름
    }
    var contents = '';
    for (key in SyllabusData) {
        contents += SyllabusData[key];
    } // 파일에 쓸 내용
    fs.writeFileSync('../src/syllabus/'+SyllabusData.filename, contents);

    // 변경된 예비 순서는 db에도 업데이트
    var db_filename = SyllabusData.filename.split('.')[0];
    var db_order = SyllabusData.Course_Order.replace('\n','');
    var sql_udt = "UPDATE Course_Info SET Course_Order = ? WHERE Syllabus_File_Name = ?";
    var params = [db_order, db_filename];
    con.query(sql_udt, params, function (err, row) {
        if (err) {console.log(err)}
        else {res.send('true');}
    });
 }); // 서버에 등록된 수업 계획서를 수정

 app.post('/set_apply', (req, res) => {
     var apply_course = []; // 자동이관 후보 강의
     var j = 0;
     var sql_sel_cart = "SELECT CA.Course_SID, CI.Capacity, COUNT(*) 'AddCart' FROM Cart as CA INNER JOIN Course_Info as CI ON CA.Course_SID = CI.Course_SID GROUP BY CA.Course_SID";
     con.query(sql_sel_cart, function(err_sel_cart, row_sel_cart){
        if (err_sel_cart) {console.log(err_sel_cart)} 
        else {
            if (row_sel_cart[0] === undefined) {
                res.send('대상 없음');
                return;
            } // 자동이관 후보 강의가 없을 때
            for (var i = 0; i < row_sel_cart.length; i++) {
                if (row_sel_cart[i].AddCart <= row_sel_cart[i].Capacity) {
                    apply_course[j] = row_sel_cart[i].Course_SID;
                    j++;
                }
            }
            // apply_course : 자동이관 후보 강의 (신청 인원 < 정원)
            var sql_sel_apply = "SELECT Auto_Increment, Stu_ID, Course_SID FROM Cart WHERE Auto_Apply_Flag = 'T' AND Course_SID IN (";
            for (var i = 0; i < apply_course.length; i++) {
                if (i === apply_course.length-1) {
                    sql_sel_apply += (apply_course[i]+')');    
                } else {
                    sql_sel_apply += (apply_course[i]+', ');
                }
            }
            con.query(sql_sel_apply, function(err_sel_apply, row_sel_apply) {
                if (err_sel_apply) {console.log(err_sel_apply)}
                else {
                    if (row_sel_apply[0] === undefined) {
                        res.send('대상 없음');
                    } else {
                        res.send(row_sel_apply);
                    }
                }
            }); // 자동이관 후보 강의 중 flag='T' 로 설정한 강의 정보 반환
        }
    });    
}); // 자동이관 시작 -> 자동이관 대상 강의 정보 반환

app.post('/get_insert_info', (req, res) => {
    var sql_get = '';
    for (var i = 0; i < req.body.length; i++) {
        sql_get += "SELECT '"+req.body[i].Auto_Increment+"' as 'Auto_Increment', '"+req.body[i].Stu_ID+"' as 'Stu_ID', SUBSTRING('"+req.body[i].Course_SID+"', 5, 6) as 'Course_Id', D.College, D.Dept, CI.Class, C.Course_Title, C.Credit FROM Course_Info as CI INNER JOIN Dept_Info as D ON CI.Offerring_Dept = D.Offerring_Dept INNER JOIN Course as C ON CI.Course_ID = C.Course_ID WHERE CI.Course_SID = '"+req.body[i].Course_SID+"';";
    }
    con.query(sql_get, function(err_sel_get, row_sel_get) {
        if (err_sel_get) {console.log(err_sel_get)}
        else {
            res.send(row_sel_get);
        }
    });
}); // 자동이관 대상 강의 중 /insert_course에 필요한 강의 정보를 얻어옴

app.post('/delete_auto_cart', (req, res) => {
    var sql_del = "DELETE FROM Cart WHERE Auto_Increment = ?";
    con.query(sql_del, req.body.Auto_Increment, function(err_del) {
        if (err_del) {console.log(err_del)}
        else {
            res.send('자동이관 완료');
        }
    });
}); // 자동이관 된 강의를 관심과목에서 삭제

app.post('/regi_search', (req, res) => {
    var result = {Capacity:0, Count:0}
    var sql2 = "select Capacity from Course_Info where Course_SID = CONCAT((select Offerring_Dept from Dept_Info where Dept = '" + req.body.Dept + "' and College = '" + req.body.College + "'),'" + req.body.Course_ID + "','" + req.body.Class + "');"
    var sql = "select COUNT(*) as Count from Cart where Course_SID = CONCAT((select Offerring_Dept from Dept_Info where Dept = '" + req.body.Dept + "' and College = '" + req.body.College + "'),'" + req.body.Course_ID + "','" + req.body.Class + "')";
    var params = [req.body.Dept, req.body.College, req.body.Course_ID, req.body.Class];
    for (var i = 0; i < params.length; i++) {
        if (params[i] === null || params[i] === undefined || params[i] === '0' || params[i] === 0) {
            params[i] = '';
        }
    } // params에 값이 없으면 초기화

    con.query(sql, params, function (err,row) {
        if (err) { console.log(err) }
        else {
            con.query(sql2,params,function(err,row2){
                if(err){console.log(err)}
                else{
                    result.Capacity = row2[0].Capacity
                    result.Count = row[0].Count
                    res.send(result);
                }
            })
        }
    });
});

app.post('/set_auto_priority', (req, res) => {
    var sql_sel = "SELECT R.*, S.Grade as 'Student_Grade', CI.Grade as 'Course_Grade', S.Major as 'Student_Major', D.Dept as 'Course_Major', CI.Course_Order as Course_Order FROM Reserve_Number AS R INNER JOIN Course_Info AS CI ON R.Course_SID = CI.Course_SID INNER JOIN Student S ON S.Stu_ID = R.Stu_ID INNER JOIN Dept_Info D ON CI.Offerring_Dept = D.Offerring_Dept";
    con.query(sql_sel, function(err_sel, row_sel) {
        if (err_sel) {console.log(err_sql)}
        else {
            if (row_sel.length === 0) {
                res.send('예비 없음');
                return;
            } else {
                for (var i = 0; i < row_sel.length; i++) {
                    // 선착순 일 때는 계산 X (Default: 0 이므로)
                    var sql_udt = "";
                    var point = 0;
                    if (row_sel[i].Course_Order == '전공') { // 1. 전공 우선
                        if (row_sel[i].Student_Major === row_sel[i].Course_Major) {
                            point += 1;
                        } // 전공 같으면 1점, 전공 다르면 0점
                    }
                    else if (row_sel[i].Course_Order == '대상학년 우선') { // 2. 전공이고, 대상학년 우선
                        if (row_sel[i].Student_Major == row_sel[i].Course_Major) {
                            point += 1; // 전공 같으면 1점
                            if (row_sel[i].Student_Grade === row_sel[i].Course_Grade) {
                                point += 1;
                            } // 대상학년 같으면 2점
                        }
                    }
                    else if (row_sel[i].Course_Order == '졸업 우선') { // 3. 전공이고, 4학년 우선
                        if (row_sel[i].Student_Major == row_sel[i].Course_Major) {
                            point += 1; // 전공 같으면 1점
                            if (row_sel[i].Student_Grade == '4') {
                                point += 1;
                            } // 4학년이면 2점
                        }
                    }
                    sql_udt = "UPDATE Reserve_Number SET Priority = "+ point + " WHERE Auto_Increment = " + row_sel[i].Auto_Increment;
                    con.query(sql_udt, function(err_udt, row_udt) {
                        if (err_udt) {console.log(err_udt)}
                        else {
                        }
                    });
                }
            }
        }
    });
}); // 관리자가 예비 리스트를 정해진 우선순위대로 정렬

app.listen(PORT, (err) => {
    console.log(`server on: ${PORT}`);
});