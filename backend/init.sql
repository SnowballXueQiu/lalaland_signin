-- Initialize Database Tables
CREATE TABLE IF NOT EXISTS student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_no VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    group_name VARCHAR(50),
    status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    group_name VARCHAR(50) NOT NULL,
    teacher VARCHAR(50),
    start_date DATE,
    total_lessons INTEGER DEFAULT 20,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    used_lessons INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    attend_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, attend_date)
);

CREATE TABLE IF NOT EXISTS parent (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openid VARCHAR(100) UNIQUE,
    name VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parent_student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    UNIQUE(parent_id, student_id)
);

CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openid VARCHAR(100) UNIQUE,
    name VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin Data
INSERT INTO admin (openid, name) VALUES ('mock_admin_code', 'Admin')
ON CONFLICT(openid) DO NOTHING;

-- Insert Initial Students
INSERT INTO student (student_no, name, group_name) VALUES ('240159', '郑景腾', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240003', '齐家', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250275', '李嫄', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240005', '胡欣然', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250396', '陈艺丹', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250416', '赵朗清', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250448', '张艺泷', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260526', '贾钧丞', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240119', '张瀚一', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240114', '张沐琪', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260578', '朱家淇', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260579', '陈泓儒', '少年团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240095', '闻芳菲', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250263', '刘惠玲', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250344', '温力', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250352', '晏冰', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240213', '卢启会', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240094', '朱煜', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240099', '张展菱', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240214', '徐研', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240181', '薛宇', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240228', '陈杏', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250468', '刘爽', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260474', '李亚炜', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240101', '李晶', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240224', '潘捷', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260493', '鲍德颖', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250348', '邓莹', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250383', '周悦怡', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260522', '马卉', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240222', '姜红军', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240170', '田芳', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260537', '章晓丽', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260548', '孙宁', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260549', '陈薇依', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260558', '张驰月', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260551', '袁琳', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260553', '王玉华', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260558', '时洋', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240197', '张瑛', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250285', '王凤媛', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260570', '李崑', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260572', '张彩恩', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240202', '张薇', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260583', '张雅淇', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260592', '凌晨', '女声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250347', '梅丽文', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250276', '吕芳', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250267', '宋杨', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250273', '王晓晶', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250300', '武士锋', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240219', '苏鑫芮', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250342', '李明', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250355', '贾恒', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250351', '吕华', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250260', '马淑华', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250363', '杨青', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250261', '荣雁', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250423', '刘奕雯', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240212', '阮南', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240195', '潘雅', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250443', '刘佳', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240100', '齐璐', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250447', '张学岩', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250476', '邱红', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250477', '王医', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250472', '徐琳', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260498', '马广庆', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250330', '李娟', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240093', '郭维维', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240089', '王晶莹', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260520', '李天天', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260525', '王静', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260527', '孟夏', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260531', '任倩', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260545', '梁攀攀', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260547', '于永坤', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260557', '杨梅', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260560', '韩健', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260559', '宫春虹', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250381', '刘丽丽', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250341', '魏娓', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260574', '刘建', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260584', '刘炳森', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250268', '崔靖', '混声团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240028', '朱玥菡', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240046', '冯易葳', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240031', '李艾霖', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240215', '裴梓珊', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240041', '赵宇晴', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240124', '王释平', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240160', '李载誉', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240040', '王莞侨', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240030', '刘雪莲', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240029', '孙鼎尧', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240008', '刘翔宇', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240027', '孙暖泠', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240037', '杨芊筱', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240226', '高婧雯', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240023', '李泽轩', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240139', '马楚砚', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240019', '张睿甯', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250335', '张梦琪', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240235', '张润坤', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240234', '张骞予', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250313', '魏祎诺', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240017', '苏子齐', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250473', '赵翌君', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250475', '张潇翯', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240181', '薛沐恬', 'Dreamers') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240164', '赵奕彤', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240079', '李芝硕', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250326', '连沐熙', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250309', '张熠飞', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240131', '刘骏壹', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240171', '吴思洁', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250365', '龙正妍', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240220', '武天烁', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240068', '徐庆豪', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240045', '席沐恩', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240246', '张骞一', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250393', '宋禹翰', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250414', '孙诗尧', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250385', '乔祎澈', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240146', '邢溢娓', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250434', '杨劭然', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250322', '白宸源', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250446', '魏莱', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260521', '卢宥杉', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250404', '邢安歌', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250405', '邢嘉澍', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240172', '李思源', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240060', '宋雨恬', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250449', '钱孟瑜', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250331', '董耘畅', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240188', '董泽霖', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260530', '褚相谷', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260540', '李禹彤', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260555', '仝惠铭', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260556', '吴瑾菡', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250439', '甄珞彤', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260571', '郝若妍', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260561', '胡宇墨', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260575', '姚朵多', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260577', '郝韵祺', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260586', '田佳澍', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260587', '詹槐歆玥', '童声2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240122', '孙景研', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240064', '赵沐庭', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240236', '白宇庭', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240016', '王宫钰', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240104', '王宫荃', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240002', '王跃辰', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250311', '王亦奇', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240223', '苗艾青', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240232', '周逸凡', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240166', '计何暐晔', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250442', '阎嘉呈', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240070', '张丁懿', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260499', '黄萨霖', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240190', '庞伊然', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250457', '张小婉', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260529', '刘沐熙', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240067', '侯伊澄', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240185', '方奕然', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260534', '方羿洋', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260500', '刘栩辰', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250308', '宋瑾萱', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240076', '李慕玖', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260552', '郑允迪', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240058', '魏莱', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240178', '汪一尘', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250259', '朱宝晨', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260562', '庞新弋', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240066', '邢胜言', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260566', '陈慕岩', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240250', '戈梓熙', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260492', '陈奕卓', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260576', '林洛依', '童声3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240087', '吕晨铄', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240088', '李宁鑫', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250301', '康慨', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250454', '石柏瀚', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250390', '刘仕坤', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250401', '王智敏', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250419', '刘宸希', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250421', '杨晓琳', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250379', '赵禹桥', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250462', '杨莞然', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260543', '李昱灿', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260541', '宿恩苒', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260544', '庞苏浩', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260546', '张蓝予', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260554', '胡宸歌', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260573', '刘瑞诚', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260582', '穆鸣谦', '启蒙1团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240057', '杨沐瑶', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240061', '静永怡', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240247', '林煜宸', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250411', '郝轶桐', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240072', '刘禹舒', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240074', '杨荞伊', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250310', '刘梓墨', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250269', '岳沁初', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250370', '邱爽', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250386', '白瑾然', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250316', '张婉宁', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250445', '裴梓安', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240205', '王润', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250407', '刘南嘉', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250318', '常云谦', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250438', '刘苡沫', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250413', '宋唯歌', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240085', '李洛伊', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260536', '何沐霏', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260569', '尹乐佳', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250430', '孙翊菲', '启蒙2团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250271', '杨阗阗', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250332', '张祎晨', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250408', '宋可艻', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250417', '高瑾言', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250429', '原铭泽', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250431', '李沐柔', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250433', '王奕诺', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250402', '余骅霖', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250452', '张嘉琳', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250463', '冀念', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250467', '徐皓卿', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260486', '任芷昕', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260538', '宋欣颐', '启蒙3团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250306', '赵诺拉', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250328', '陈卓', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240237', '林仲凯', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250334', '汪乐其', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250359', '马之远', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250387', '殷子青', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250388', '么政承', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250398', '岳嘉恩', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250399', '郭一格', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250403', '刘翊澄', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250410', '王楠', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250409', '李柯萱', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250451', '刘奕彤', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250478', '王语萱', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('240218', '杨雯婷', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260488', '任奕霏', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260487', '赵禾翊', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260519', '孔熙雯', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250383A', '徐珞晴', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260535', '马睿澄', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260542', '杨子珅', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260565', '张纭歌', '启蒙4团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250426', '强梓萌', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250440', '李辰心', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250458', '陈奕博', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250461', '李沐莳', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250422', '冷思琪', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260485', '王若灵', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260585', '马烁辰', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250453', '闫柏宁', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260523', '刘朔兮', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260524', '张凇源', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260528', '张亦可', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260533', '黄青阳', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260532', '臧伊瑞', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260563', '蔺泽铭', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260564', '蔺泽玥', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260568', '杨延鋆', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260567', '王澍艺', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260581', '张靖瑶', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250369', '潘茁', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('250371', '杨惜婷', '启蒙5团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260590', '许宸语', '启蒙六团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260591', '许雍卓', '启蒙六团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260580', '孙笑鸿', '启蒙六团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260588', '李宥岐', '启蒙六团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
INSERT INTO student (student_no, name, group_name) VALUES ('260589', '李宥麟', '启蒙六团') ON CONFLICT(student_no) DO UPDATE SET name=excluded.name, group_name=excluded.group_name;
