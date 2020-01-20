-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2016 at 05:40 PM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `testingapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `language`
--

CREATE TABLE IF NOT EXISTS `language` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `language`
--

INSERT INTO `language` (`id`, `code`, `name`, `status`) VALUES
(1, 'en-en', 'English', 1),
(6, 'ta-ta', 'Tamil', 0),
(7, 'ar-ar', 'Arabic', 1),
(8, 'ur-ur', 'Urdu', 1),
(9, 'hi-hi', 'Hindi', 0),
(10, 'be-be', 'Bengali', 0),
(11, 'ma-ma', 'Malayalam', 0),
(12, 'fa-fa', 'Farsi', 0),
(13, 'ch-ch', 'Chinese', 0),
(14, 'ru-ru', 'Russian', 0);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE IF NOT EXISTS `questions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `answer` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `photo` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `topicArea` varchar(100) NOT NULL,
  `parent` varchar(15) NOT NULL,
  `isRealtime` tinyint(1) NOT NULL DEFAULT '0',
  `isPractise` tinyint(1) NOT NULL DEFAULT '0',
  `isCommon` tinyint(1) NOT NULL DEFAULT '0',
  `isSpecific` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `answer`, `category`, `photo`, `created`, `topicArea`, `parent`, `isRealtime`, `isPractise`, `isCommon`, `isSpecific`) VALUES
(20, '1', 'LMV', '', '2016-04-18 13:59:33', '2', 'realtime', 1, 0, 1, 0),
(21, '1', 'LMV', '', '2016-04-18 14:01:13', '2', 'common', 0, 1, 1, 0),
(23, '1', 'LMV', '', '2016-04-18 14:11:30', '2', 'common', 0, 1, 1, 0),
(27, '1', 'LMV', '', '2016-04-18 14:27:06', '2', 'specific', 0, 1, 0, 1),
(30, '1', 'LMV', '', '2016-04-18 14:30:26', '2', 'specific', 0, 1, 0, 1),
(31, '1', 'LMV', '', '2016-04-18 14:31:09', '2', 'realtime', 1, 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `questions_translations`
--

CREATE TABLE IF NOT EXISTS `questions_translations` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `questionid` int(10) NOT NULL,
  `language` varchar(50) NOT NULL,
  `question` text NOT NULL,
  `choice1` text NOT NULL,
  `choice2` text NOT NULL,
  `choice3` text NOT NULL,
  `audio` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=45 ;

--
-- Dumping data for table `questions_translations`
--

INSERT INTO `questions_translations` (`id`, `questionid`, `language`, `question`, `choice1`, `choice2`, `choice3`, `audio`) VALUES
(27, 17, 'en-en', 'Capital of India?', 'Delhi', 'Chennai', 'Bangalore', ''),
(28, 17, 'en-en', 'Capital of India?', 'Delhi', 'Chennai', 'Bangalore', ''),
(29, 18, 'en-en', 'dsjfalkdfl;ajsldk', 'fasfa', 'dfasdfasf', 'fasdfasfasdf', ''),
(30, 19, 'en-en', 'test', '1', '2', '3', ''),
(31, 20, 'en-en', 'Capital of India?', 'Delhi', 'Mumbai', 'Nagpur', ''),
(32, 20, 'en-en', 'Capital of Delhi', 'Delhi', 'Mumbai', 'Nagpur', ''),
(33, 21, 'en-en', 'Capital of Tamilnadu?', 'Chennai', 'Madurai', 'Trichy', ''),
(34, 21, 'ar-ar', 'Capital of Tamilnadu?', 'Chennai', 'Madurai', 'Trichy', ''),
(35, 22, 'en-en', 'Capital of Karnataka?', 'Mysur', 'Bangalore', 'Kochi', ''),
(36, 23, 'en-en', 'Capital of Karnataka?', 'Bangalore', 'Trichy', 'Mysur', ''),
(37, 24, 'en-en', 'Common Test Question', '1', '3', '4', ''),
(38, 25, 'en-en', 'heut', 'd', 'd', 'd', ''),
(39, 26, 'en-en', 'dgsgw', 'gww', 'yry', 'ywry', ''),
(40, 27, 'en-en', 'dgsre', 'wetwt', 'weyw', 'weywe', ''),
(41, 28, 'en-en', 'dgwegww', 'tqtq', 'eqet', 'eqetq', ''),
(42, 29, 'en-en', 'shdjtj', 'twy', 'yweywy', 'weywey', ''),
(43, 30, 'en-en', 'hdfdfjdgj', 'ryryre', 'yeryey', 'yryey', ''),
(44, 31, 'en-en', 'gwrreyre', 'etwetew', 'twetwe', 'twetew', '');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE IF NOT EXISTS `session` (
  `id` char(40) NOT NULL,
  `expire` int(11) DEFAULT NULL,
  `data` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `expire`, `data`) VALUES
('0knocs3keqte09bphq4q9kn0l4', 1460986608, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('1dril2jf6fffh83tmaclr9gcs4', 1460728618, 0x5f5f666c6173687c613a303a7b7d),
('28sgl6e5e2cl1c53ifotisuob4', 1460754548, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('29s0c5d8cjqs0sep4tu1bou284', 1460728600, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('2e82a3rdnl064qel7q4o3ibm77', 1460977739, 0x5f5f666c6173687c613a303a7b7d),
('3b65aad1e405ibkc9efnqol0p0', 1460736674, 0x5f5f666c6173687c613a303a7b7d),
('4edfu767f3reqjpfmll4bfaeg1', 1460977249, 0x5f5f666c6173687c613a303a7b7d),
('4ril20aims8gqrj9cvbaeiks50', 1460994596, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('4vcbie1sidf3kba8td5h3h5ia4', 1460728660, 0x5f5f666c6173687c613a303a7b7d),
('54jm5fd2d98oecfjqr48ttcjf7', 1460814034, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('5rtijgp8c3lqh6p73efrohti24', 1460754649, 0x5f5f666c6173687c613a303a7b7d),
('6qaapubag2nltqg6l48cnppvf4', 1460730797, 0x5f5f666c6173687c613a303a7b7d),
('6rqdbo6u3hratgg8hr7tf2lf13', 1460735632, 0x5f5f666c6173687c613a303a7b7d),
('7eurri5af45fbc805eo2scchn5', 1460895815, 0x5f5f666c6173687c613a303a7b7d),
('7fmjch8tequsqvitpbhc91d0q0', 1460730766, 0x5f5f666c6173687c613a303a7b7d),
('8ao5b6vggi3qas4nf17i674p76', 1460728640, 0x5f5f666c6173687c613a303a7b7d),
('8cb7tqf9n77sl5j6jib3cno5j5', 1460787222, 0x5f5f666c6173687c613a303a7b7d),
('8cm8n3bthot2acroj2qjmt0vd5', 1460977256, 0x5f5f666c6173687c613a303a7b7d),
('8mkmo6q17rnrl8vbqi68ei0jj1', 1460787231, 0x5f5f666c6173687c613a303a7b7d),
('8p94eunajr0s3rfta7ar97n4c0', 1460735624, 0x5f5f666c6173687c613a303a7b7d),
('9a77m8lhlukms1q6c02b99rvq1', 1460752523, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('9b1c4i6ctq01ro4sbl7p5ggg80', 1460755387, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('a4vfnf6n3qbuut22qd1tv8v0o2', 1460789089, 0x5f5f666c6173687c613a303a7b7d),
('an1jcp0p5sph88adcr6682enn0', 1460898853, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('b7dokulrvopc43rcphv6ch0p20', 1460898844, 0x5f5f666c6173687c613a303a7b7d),
('be8hmevblj7430a8l3ilc5vhk3', 1460736667, 0x5f5f666c6173687c613a303a7b7d),
('bo1e0sju4ksrq2546ro4dfvrt5', 1460796515, 0x5f5f666c6173687c613a303a7b7d),
('bu624b371crbodejifmrq4opg4', 1460752267, 0x5f5f666c6173687c613a303a7b7d),
('c9ubs5ur2j161heubrob10i4l6', 1460735969, 0x5f5f666c6173687c613a303a7b7d),
('cfd42esirtufsd09mqp9lk03q4', 1460730261, 0x5f5f666c6173687c613a303a7b7d),
('cugvg60tps7lcp3l165hsj4t11', 1460752239, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('d21loq72j5k1ok2mh7tl81g5k2', 1460990710, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('diopu4snh7st9k8hfa70nt64h0', 1460752212, 0x5f5f666c6173687c613a303a7b7d),
('dqdnkf59unr4n6eigm56snhnm6', 1460735936, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('e2l4bta5714bbvn14pu4b401a3', 1460895828, 0x5f5f666c6173687c613a303a7b7d),
('evtsgnq2l2v0av023ijnvoifi1', 1460897456, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('f1164kuad4a1jcmnqagp2cgv47', 1460897416, 0x5f5f666c6173687c613a303a7b7d),
('f12ju7g9til8r0dvhos8blajn4', 1460976051, 0x5f5f666c6173687c613a303a7b7d),
('fk355804j2vnkmgpcrlc3oei24', 1460730592, 0x5f5f666c6173687c613a303a7b7d),
('fujtiotqku481vba8vd7t4kik6', 1460990706, 0x5f5f666c6173687c613a303a7b7d),
('gh1e295k0evl1naefrfjb2dr50', 1460898704, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('gsr417nuadrrqqgjbih7lrg2h7', 1460976041, 0x5f5f666c6173687c613a303a7b7d),
('h9g4g38f30ptdp5vd67sl6igk5', 1460731048, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('i938a38gvdfqdddkel23i4sqi5', 1460980722, 0x5f5f666c6173687c613a303a7b7d),
('iiica8o88k4vpac2m6s65luf12', 1460728779, 0x5f5f666c6173687c613a303a7b7d),
('io1v6q8i5ip6nn7jggugv9ic33', 1460984922, 0x5f5f666c6173687c613a303a7b7d),
('kbmi81sacuikluvaekot1k8d10', 1460977769, 0x5f5f666c6173687c613a303a7b7d),
('mcohv7004a426d42bs92hm7qt1', 1460787231, 0x5f5f666c6173687c613a303a7b7d),
('mhrbfpc8sj5h61l2bg7mjjhlk5', 1460897473, 0x5f5f666c6173687c613a303a7b7d),
('mkgvvmad8vhf5d2bhrvdk57dm0', 1460786769, 0x5f5f666c6173687c613a303a7b7d),
('n1vc8gbr4shp1ov20tc2phhsk3', 1460729165, 0x5f5f666c6173687c613a303a7b7d),
('o22gpb7gp3uok533ojj38ijlg0', 1460729148, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('odgsjms4fvvemuu9d88aba7lt0', 1460817602, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('oihrnefjpmrf2b792va0hi5c86', 1460736824, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('oj8ka9kk1u205jcn35dgsqtun3', 1460728446, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('pbnep7oc6q0iqtfjht3731r1p3', 1460754029, 0x5f5f666c6173687c613a303a7b7d),
('pqbhf8lctubp69vf3nq1kk42i0', 1460751449, 0x5f5f666c6173687c613a303a7b7d),
('q0tmasbo50t0osm3tv1oftsu93', 1460805194, 0x5f5f666c6173687c613a303a7b7d),
('q1ol9tcho1pj1h4i2iilgeko27', 1460789075, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('qamhfcvti6h29125uudoh951f0', 1460980685, 0x5f5f666c6173687c613a303a7b7d),
('qhvv361ggjcnjmarlnea8j3i21', 1460752534, 0x5f5f666c6173687c613a303a7b7d),
('r7h2ncn56n3mmf7q7tapefbk42', 1460793341, 0x5f5f666c6173687c613a303a7b7d),
('rpp5f662qbsbq1pvgqv1gq1tp3', 1460730771, 0x5f5f666c6173687c613a303a7b7d),
('rqb063a44vstl2253mbvdiob97', 1460752202, 0x5f5f666c6173687c613a303a7b7d),
('rru7ics0c6cd6eugq6410b8b73', 1460792921, 0x5f5f666c6173687c613a303a7b7d),
('rrv794r726nqgmg8mtbolqf746', 1460896317, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('s9b1gu70tfo3sem6hctohjnif2', 1460984933, 0x5f5f666c6173687c613a303a7b7d),
('srpooj4r12m7nft6qnfup08nv1', 1460897380, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b),
('t5pfsl1e19fa2dpb03be2oj5n5', 1460730581, 0x5f5f666c6173687c613a303a7b7d),
('t697siopq342nb0ha5rp3d49e5', 1460792870, 0x5f5f666c6173687c613a303a7b7d),
('t96p1a3c8t61v37alo7ob5do80', 1460896337, 0x5f5f666c6173687c613a303a7b7d),
('upnbho5fpsrib81k1cpc4gt4a1', 1460753981, 0x5f5f666c6173687c613a303a7b7d5f5f69647c693a31353b);

-- --------------------------------------------------------

--
-- Table structure for table `testconfig`
--

CREATE TABLE IF NOT EXISTS `testconfig` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `testcategory` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `noofquestion` int(10) NOT NULL DEFAULT '0',
  `reqnoofanswer` int(10) NOT NULL DEFAULT '0',
  `noofspecificquestion` int(10) NOT NULL DEFAULT '0',
  `noofcommonquestion` int(10) NOT NULL DEFAULT '0',
  `noofreqspecificanswer` int(10) NOT NULL DEFAULT '0',
  `noofreqcommonanswer` int(10) NOT NULL DEFAULT '0',
  `duration` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `testconfig`
--

INSERT INTO `testconfig` (`id`, `name`, `testcategory`, `category`, `noofquestion`, `reqnoofanswer`, `noofspecificquestion`, `noofcommonquestion`, `noofreqspecificanswer`, `noofreqcommonanswer`, `duration`) VALUES
(1, 'Realtime Question', 'LMV', 'realtime', 0, 0, 0, 1, 0, 1, 5),
(2, 'Common Question', 'LMV', 'common', 0, 0, 0, 0, 0, 0, 30),
(3, 'Specific Question', 'LMV', 'specific', 0, 0, 0, 0, 0, 0, 120);

-- --------------------------------------------------------

--
-- Table structure for table `testquestions`
--

CREATE TABLE IF NOT EXISTS `testquestions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `testid` int(10) NOT NULL,
  `questionid` int(10) NOT NULL,
  `input` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `testquestions`
--

INSERT INTO `testquestions` (`id`, `testid`, `questionid`, `input`, `status`) VALUES
(1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `testresults`
--

CREATE TABLE IF NOT EXISTS `testresults` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `studentid` int(10) NOT NULL,
  `category` varchar(100) NOT NULL,
  `testdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `testresults`
--

INSERT INTO `testresults` (`id`, `studentid`, `category`, `testdate`) VALUES
(1, 35, 'LMV', '2016-04-12 05:02:33');

-- --------------------------------------------------------

--
-- Table structure for table `topicarea`
--

CREATE TABLE IF NOT EXISTS `topicarea` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `topicarea`
--

INSERT INTO `topicarea` (`id`, `name`, `status`) VALUES
(2, 'test topic', 1),
(3, 'Test Topic', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `studentId` text NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(250) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `photo` text NOT NULL,
  `gender` varchar(50) NOT NULL,
  `nationality` varchar(75) NOT NULL,
  `dob` date NOT NULL,
  `age` int(10) NOT NULL,
  `maritalStatus` varchar(40) NOT NULL,
  `password` varchar(100) NOT NULL,
  `confirmPassword` varchar(100) NOT NULL,
  `passport` text NOT NULL,
  `emirates` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `language` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=38 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `studentId`, `name`, `email`, `isAdmin`, `photo`, `gender`, `nationality`, `dob`, `age`, `maritalStatus`, `password`, `confirmPassword`, `passport`, `emirates`, `status`, `language`) VALUES
(15, 'Admin', 'Admin', 'admin@cm.com', 1, 'data:image/jpeg;base64,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', 'Male', 'India', '1988-05-24', 27, 'Single', '111', '111', '764565ID', 'Passport5467', 1, 'en-en'),
(35, 'dass', 'prabu', 'prabumail4u@gmail.com', 0, '', '', '', '1950-01-01', 0, '', '123', '123', '', '', 1, 'en-en'),
(36, 'STUD111', 'RaviTeja', 'jeevitha@cloudmaxis.com', 0, 'data:image/jpeg;base64,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', 'Male', 'IND', '1993-08-30', 22, 'Single', '123456', '', 'hhjjj', 'hgfcdghh', 1, ''),
(37, '123', 'madhan', 'madhankumar@cloudmaxis.com', 0, '', 'Male', 'Indian', '1992-12-21', 23, 'Single', '123', '', '123456', '123456', 1, 'en-en');

-- --------------------------------------------------------

--
-- Table structure for table `usersession`
--

CREATE TABLE IF NOT EXISTS `usersession` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` text NOT NULL,
  `name` text NOT NULL,
  `adminid` varchar(100) NOT NULL,
  `login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `usersession`
--

INSERT INTO `usersession` (`id`, `sid`, `name`, `adminid`, `login_time`) VALUES
(1, 'testuser', 'testname', 'password', '2016-04-16 08:50:06');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
