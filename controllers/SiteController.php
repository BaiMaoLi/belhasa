<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\User;
use app\models\Questions;
use app\models\QuestionChoices;
use app\models\QuestionsTranslations;
use app\models\Testresults;
use app\models\Testquestions;
use app\models\Topicarea;
use app\models\Testconfig;

class SiteController extends Controller {

    public function behaviors() {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    public function formatUser($user) {
        if ($user) {
            unset($user['password']);
            unset($user['confirmPassword']);
        }

        return $user;
    }

    public function getUserChoice($question, $choice) {
        switch ($choice) {
            case '1':
                return $question['choice1'];
                break;
            case '2':
                return $question['choice2'];
                break;
            case '3':
                return $question['choice3'];
                break;
            case '4':
                return $question['choice4'];
                break;

            default:
                # code...
                break;
        }
    }

    public function actions() {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
        ];
    }

    public function actionIndex() {
        if (Yii::$app->user->getId()) {
            $identity = User::findOne(['id' => Yii::$app->user->getId()]);
            $user = json_encode($identity->attributes);
        } else {
            $user = json_encode('');
        }
        return $this->render('index', [
                    'user' => $user
        ]);
    }

    public function actionLogin() {
        if (!\Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }
        return $this->render('login', [
                    'model' => $model,
        ]);
    }

    public function actionLogout() {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    public function actionContact() {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            Yii::$app->session->setFlash('contactFormSubmitted');

            return $this->refresh();
        }
        return $this->render('contact', [
                    'model' => $model,
        ]);
    }

    public function actionTestprint() {
        $this->layout = 'print';
        $id = Yii::$app->request->get('id');
        $user_lang = Yii::$app->request->get('lang');
        $page = array("en-en"
            => array("Date Tested" => "Test Date",
                "Student Id" => "Student Id",
                "Student Name" => "Student Name",
                "Category" => "Category",
                "Topic Area" => "Topic Area",
                "No of Incorrect Answers" => "No of Incorrect Answers",
                "Questions" => "Questions Type",
                "Number of Questions per Test" => "Total Questions",
                "Minimum Correct Answers Required" => "Minimum Correct Answers Required",
                "Correct Answers" => "Correct Answers",
                "Specific Questions" => "Specific Questions",
                "Common Questions" => "Common Questions",
                "Print" => "Print",
                "Close" => "Close",
                "fail" => "Unfortunately, you failed your theory test",
                "pass" => "Congratulations, you passed your theory test",
                "download" => "Download",
                "Test Result"=>"Test Result",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"

            ),
            "ar-ar"
            => array("Date Tested" => "تاریخ اإلختبار",
                "Student Id" => "رقم الملف المرورى",
                "Student Name" => "إسم الطالب",
                "Category" => "الفئــة",
                "Topic Area" => "مضمون الإسئلة",
                "No of Incorrect Answers" => "الاخطاء",
                "Questions" => "الأسئلة ",
                "Number of Questions per Test" => "عدد الأسئلة",
                "Minimum Correct Answers Required" => "الحد الأدنى للإجابات الصحيحة",
                "Correct Answers" => "الأسئلة ",
                "Specific Questions" => "الأسئلة الخاصة",
                "Common Questions" => " الأسئلة العامة",
                "Print" => "طباعة",
                "Close" => "قريب",
                "fail" => "نأسف لقد رسبت فى الإختبار ",
                "pass" => "مبروك لقد نجحت فى الإختبار ",
                "download" => "تحميل",
                "Test Result"=>"نتيجة الاختبار",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"
            ),
            "ur-ur"
            => array("Date Tested" => "امتحان کی تاریخ",
                "Student Id" => "ٹریفک فائل نمبر",
                "Student Name" => "امیدوار کا نام",
                "Category" => "گاڑی کی قسم",
                "Topic Area" => "موضوعات",
                "No of Incorrect Answers" => "غلط جوابات",
                "Questions" => "سوالات کی قسم",
                "Number of Questions per Test" => "ٹیسٹ فی سوالات کی تعداد",
                "Minimum Correct Answers Required" => "کم از کم مطلوبہ درست جوابات",
                "Correct Answers" => "درست جوابات",
                "Specific Questions" => "مخصوص سوالات",
                "Common Questions" => "عام سوالات ",
                "Print" => "پرنٹ",
                "Close" => "بند کریں",
                "fail" => "بد قسمتی،  سے آپ اس امتحان میں ناکام ہوگئے ہیں",
                "pass" => "مبارک ہو، آپ اس امتحان میں کامیاب  ہوگئے ہیں",
                "download" => "ڈاؤن لوڈ",
                "Test Result"=>"نتيجة الاختبار",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"
            ),
            "ta-ta"
            => array("Date Tested" => "தேர்வு தேதி",
                "Student Id" => "மாணவர் அடையாளம்",
                "Student Name" => "மாணவர் பெயர்",
                "Category" => "பகுப்பு",
                "Topic Area" => "தலைப்பு பகுதி",
                "No of Incorrect Answers" => "தவறான பதில்களை எண்ணிக்கை",
                "Questions" => "கேள்விகள்",
                "Number of Questions per Test" => "பிரதி தேர்வுக்கான வினாக்கள்",
                "Minimum Correct Answers Required" => "குறைந்தபட்ச் சரியான விடைகள்",
                "Correct Answers" => "சரியான பதில்களை",
                "Specific Questions" => "குறிப்பிட்ட கேள்விகள்",
                "Common Questions" => "பொதுவான கேள்விகள்",
                "Print" => "அச்சிடு",
                "Close" => "மூடு",
                "fail" => "துரதிருஷ்டவசமாக, நீங்கள் உங்கள் தேர்வில் தோல்வி அடைந்தீர்கள்",
                "pass" => "வாழ்த்துக்கள், நீங்கள் உங்கள் தேர்வில் தேர்சியடைன்தீர்கள்",
                "download" => "பதிவிறக்கம்",
                "Test Result"=>"نتيجة الاختبار",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"
            ),
            "hi-hi"
            => array("Date Tested" => "परीक्षा की तारीख",
                "Student Id" => "ट्रैफिक फाइल नमबर",
                "Student Name" => "प्रत्याशी का नाम",
                "Category" => "वाहन श्रेणी",
                "Topic Area" => "विषय",
                "No of Incorrect Answers" => "गलत जवाब",
                "Questions" => "प्रशन",
                "Number of Questions per Test" => "कुल सवाल",
                "Minimum Correct Answers Required" => "न्यूनतम सही उत्तर",
                "Correct Answers" => "सही उत्तर",
                "Specific Questions" => "विशिष्ट प्रश्न",
                "Common Questions" => "आम सवाल",
                "Print" => "छाप",
                "Close" => "बंद करे",
                "fail" => "अफसोस, आप इस परीक्षा में फेल हुएं हैं",
                "pass" => "बधाई हो, आप इस परीक्षा में पास हुएं हैं",
                "download" => "डाउनलोड",
                "Test Result"=>"परीक्षा परिणाम",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"
            ),
            "be-be"
            => array("Date Tested" => "তারিখ পরিক্ষিত",
                "Student Id" => "শিক্ষার্থী আইডি",
                "Student Name" => "শিক্ষার্থীর নাম",
                "Category" => "বিভাগ",
                "Topic Area" => "টপিক ফোন",
                "No of Incorrect Answers" => "ভুল উত্তরের সংখ্যা",
                "Questions" => "প্রশ্ন",
                "Number of Questions per Test" => "টেস্ট প্রতি প্রশ্নের সংখ্যা",
                "Minimum Correct Answers Required" => "নূন্যতম সঠিক উত্তরের প্রয়োজনীয়",
                "Correct Answers" => "সঠিক উত্তরসমূহ",
                "Specific Questions" => "নির্দিষ্ট প্রশ্নের",
                "Common Questions" => "প্রচলিত প্রশ্নাবলি",
                "Print" => "ছাপানো",
                "Close" => "ঘনিষ্ঠ",
                "fail" => "দুর্ভাগ্যবশত, আপনি আপনার পরীক্ষার ব্যর্থ হয়েছে",
                "pass" => "অভিনন্দন, আপনি আপনার পরীক্ষায় পাশ করেছি",
                "download" => "ডাউনলোড",
                "Test Result"=>"نتيجة الاختبار",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"
            ),
            "ma-ma"
            => array("Date Tested" => "തീയതി യാഥാർത്ഥ്യം",
                "Student Id" => "സ്റ്റുഡന്റ് ഐഡി",
                "Student Name" => "വിദ്യാർഥിയുടെ പേര്",
                "Category" => "വർഗ്ഗം",
                "Topic Area" => "ഏരിയ വിഷയം",
                "No of Incorrect Answers" => "തെറ്റായ ഉത്തരം എണ്ണം",
                "Questions" => "ചോദ്യങ്ങൾ",
                "Number of Questions per Test" => "ടെസ്റ്റ് ഓരോ ചോദ്യങ്ങളുടെ എണ്ണം",
                "Minimum Correct Answers Required" => "ആവശ്യമായ ശരിയായ ഉത്തരങ്ങൾ",
                "Correct Answers" => "ശരിയായ ഉത്തരങ്ങൾ",
                "Specific Questions" => "പ്രത്യേക ചോദ്യങ്ങൾ",
                "Common Questions" => "സാധാരണ ചോദ്യങ്ങൾ",
                "Print" => "അച്ചടിക്കുക",
                "Close" => "അടയ്ക്കുക",
                "fail" => "നിർഭാഗ്യവശാൽ, നിങ്ങളുടെ പരീക്ഷ വിജയിച്ചിരുന്നില്ല",
                "pass" => "അഭിനന്ദനങ്ങൾ, നിങ്ങളുടെ പരീക്ഷ പാസായത് ഞങ്ങൾ",
                "download" => "ഡൗൺലോഡ്",
                "Test Result"=>"പരീക്ഷാഫലം",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"
            ),
            "fa-fa"
            => array("Date Tested" => "تاریخ تست شده",
                "Student Id" => "هویت دانشجو",
                "Student Name" => "نام دانش آموز",
                "Category" => "دسته بندی",
                "Topic Area" => "موضوع منطقه",
                "No of Incorrect Answers" => "تعداد پاسخ های نادرست",
                "Questions" => "سوالات",
                "Number of Questions per Test" => "تعدادی از سوالات در هر آزمون",
                "Minimum Correct Answers Required" => "حداقل پاسخ صحیح مورد نیاز",
                "Correct Answers" => "پاسخ های صحیح",
                "Specific Questions" => "سوالات خاص",
                "Common Questions" => "سوالات رایج",
                "Print" => "چاپ",
                "Close" => "نزدیک",
                "fail" => "متاسفانه، شما امتحان خود را شکست خورده اند",
                "pass" => "تبریک می گویم، شما امتحان خود را پشت سر گذاشته",
                "download" => "دانلود",
                "Test Result"=>"نتيجة الاختبار",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"
            ),
            "ch-ch"
            => array("Date Tested" => "測試日期",
                "Student Id" => "學生卡",
                "Student Name" => "學生姓名",
                "Category" => "類別",
                "Topic Area" => "主題區",
                "No of Incorrect Answers" => "不正確的答案的數目",
                "Questions" => "問題",
                "Number of Questions per Test" => "每試題數",
                "Minimum Correct Answers Required" => "最小正確答案必",
                "Correct Answers" => "正確答案",
                "Specific Questions" => "具體問題",
                "Common Questions" => "常見問題",
                "Print" => "打印",
                "Close" => "關",
                "fail" => "不幸的是，你沒有你的考試",
                "pass" => "恭喜你，你已經通過考試",
                "download" => "下載",
                "Test Result"=>"نتيجة الاختبار",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"
            ),
            "ru-ru"
            => array("Date Tested" => "Дата Испытано",
                "Student Id" => "Студенческий билет",
                "Student Name" => "Имя ученика",
                "Category" => "категория",
                "Topic Area" => "тема Площадь",
                "No of Incorrect Answers" => "Количество неправильных ответов",
                "Questions" => "Вопросов",
                "Number of Questions per Test" => "Количество вопросов в тесте",
                "Minimum Correct Answers Required" => "Требуемые минимальные правильные ответы",
                "Correct Answers" => "Правильные ответы",
                "Specific Questions" => "Конкретные вопросы",
                "Common Questions" => "Общие вопросы",
                "Print" => "Распечатать",
                "Close" => "Закрыть",
                "fail" => "К сожалению, вы не смогли экзамен",
                "pass" => "Поздравляю, вы прошли экзамен",
                "download" => "скачать",
                "Test Result"=>"ٹیسٹ کا نتیجہ",
                "Test Pass"=>"Pass",
                "Test Fail"=>"Fail"
            )
        );
        if ($id) {
            $row = Testresults::findOne(['id' => $id]);
            $response = $row->attributes;

            $user = User::findOne(['id' => $response['studentid']]);


            unset($response['studentid']);
            $response['student'] = $this->formatUser($user->attributes);
            $response['questions'] = array();
            $questions = Testquestions::findAll(['testid' => $response['id']]);

            foreach ($questions as $row) {
                $record = $row->attributes;
                $question = QuestionsTranslations::findOne(['questionid' => $record['questionid']]);
                $record['question'] = $question['question'];

                $userQuestion = Questions::findOne(['id' => $record['questionid']]);
                $questionRow = $userQuestion->attributes;
                $model = Topicarea::findOne(['id' => $questionRow['topicArea']]);

//******************************  Original Part  *************************************//
//                $topicArea = $model->attributes;
//                if ($user_lang == "en-en") {
//                    $record['topicArea'] = $topicArea['name'];
//                } else {
//                    $temp = $topicArea['name_' . substr($user_lang, 0, 2)];
//                    if ($temp) {
//                        $record['topicArea'] = $temp;
//                    } else {
//                        $record['topicArea'] = $topicArea['name'];
//                    }
//                }
//****************************  End Original Part *********************************//


//****************************  Updated Part  ****************************************//
                if(!is_null($model)){   // My changing part
                    $topicArea = $model->attributes;
                    if ($user_lang == "en-en") {
                        $record['topicArea'] = $topicArea['name'];
                    } else {
                        $temp = $topicArea['name_' . substr($user_lang, 0, 2)];
                        if ($temp) {
                            $record['topicArea'] = $temp;
                        } else {
                            $record['topicArea'] = $topicArea['name'];
                        }
                    }
                }
                else{
                    $record['topicArea'] = "Unknown";
                }
//*************************** End Updated part By Bai ***********************************//



                $record['option'] = $this->getUserChoice($question, $record['input']);
                array_push($response['questions'], $record);
            }
            $topics = array();
            foreach ($response['questions'] as $record) {
                if (!isset($topics[$record['topicArea']])) {
                    $topics[$record['topicArea']] = 0;
                }
                if (!$record['status']) {
                    $topics[$record['topicArea']] = ($topics[$record['topicArea']] + 1);
                }
            }

            $response['topics'] = $topics;


//            echo "<pre>";



            $reqQuestions = Testconfig::findOne(['id' => 1]);
            $reqQuestions = $reqQuestions->attributes;
            $response['reqQuestions'] = $reqQuestions;
            $reqQuestions = Testconfig::findOne(['testcategory' => $response['category'], 'category' => 'realtime']);
//            print_r( $reqQuestions);
//            exit;

            $response['noofcommonquestion'] = $reqQuestions['noofcommonquestion'];
            $response['noofspecificquestion'] = $reqQuestions['noofspecificquestion'];
            $response['noofreqspecificanswer'] = $reqQuestions['noofreqspecificanswer'];
            $response['noofreqcommonanswer'] = $reqQuestions['noofreqcommonanswer'];


            $response['correctSpecificAnswers'] = 0;
            $response['correctCommonAnswers'] = 0;
            $questionList = Testquestions::findAll(['status' => 1, 'testid' => $response['id']]);



            foreach ($questionList as $value) {
                $record = $value->attributes;
                $count = Questions::findOne(['isRealtime' => 1, 'id' => $record['questionid']]);
                $count = $count->attributes;
                if ($count['isSpecific']) {
                    $response['correctSpecificAnswers'] = $response['correctSpecificAnswers'] + 1;
                } elseif ($count['isCommon']) {
                    $response['correctCommonAnswers'] = $response['correctCommonAnswers'] + 1;
                }
            }


//            if ($response['correctSpecificAnswers'] >= $response['reqQuestions']['noofreqspecificanswer'] && $response['correctCommonAnswers'] >= $response['reqQuestions']['noofreqcommonanswer']) {
//                $response['result'] = $page[$user_lang]["pass"];
//                $response['user_result'] = 1;
//            } else {
//                $response['result'] = $page[$user_lang]["fail"];
//                $response['user_result'] = 0;
//            }
            if ($response['correctSpecificAnswers'] + $response['correctCommonAnswers'] >= $response['reqQuestions']['noofreqspecificanswer'] + $response['reqQuestions']['noofreqcommonanswer']) {
                $response['result'] = $page[$user_lang]["pass"];
                $response['user_result'] = 1;
            } else {
                $response['result'] = $page[$user_lang]["fail"];
                $response['user_result'] = 0;
            }


            $response['page'] = $page[$user_lang];
            $response['user_lang'] = $user_lang;
            $response['content'] = $page[$user_lang];

//            echo "<pre>";
//            echo "$response[correctSpecificAnswers]    $response[noofreqspecificanswer]<br>";
//
//            echo "result1    ".$response['correctSpecificAnswers']."     ".$response['noofreqspecificanswer']."     ".$response['correctSpecificAnswers']>=$response['noofreqspecificanswer'];
//            echo "result2    ".$response['correctCommonAnswers']."  ".$response['noofreqcommonanswer']."   ".$response['correctCommonAnswers']>=$response['noofreqcommonanswer'];
//            print_r($response);
//            exit;

            return $this->render('test', [
                        'result' => $response
            ]);
        } else {
            echo json_encode(array(
                'message' => 'Please provide a valid arguments'
            ));

            exit(0);
        }
    }

    public function actionAbout() {
        return $this->render('about');
    }

}
