<?php

namespace app\controllers;

use app\models\Questions;
use app\models\QuestionsTranslations;
use app\models\Testquestions;
use app\models\Testresults;
use app\models\Topicarea;
use app\models\User;
use app\models\Questionstate;
use app\models\Testconfig;
use app\models\Category;
use app\models\Language;
use Yii;
use yii\filters\VerbFilter;
use yii\web\Controller;

class QuestionController extends Controller
{
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    // 'getall' => ['get'],
                    // 'getById' => ['post'],
                    // 'create' => ['post'],
                    // 'update' => ['put'],
                    // 'delete' => ['delete']
                ],
            ],
        ];
    }

    public function beforeAction($action) {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }


    public function insertQuestionTranslation($questionId, $question) {
        foreach ($question as $value) {
            $model = new QuestionsTranslations;
            $model->questionid = $questionId;
            $model->language = $value['language'];
            $model->question = $value['query'];
            $model->audio = isset($value['audioUrl']) ?  $value['audioUrl'] : '';
            $model->choice1 = isset($value['choice1']) ? $value['choice1'] : '';
            $model->choice2 = isset($value['choice2']) ? $value['choice2'] : '';
            $model->choice3 = isset($value['choice3']) ? $value['choice3'] : '';
            $model->option1audio = isset($value['option1audio']) ? $value['option1audio'] : '';
            $model->option2audio = isset($value['option2audio']) ? $value['option2audio'] : '';
            $model->option3audio = isset($value['option3audio']) ? $value['option3audio'] : '';
            $model->save();
        }
        return;
    }

    public function actionCreate() {
        $input = Yii::$app->request->post();
        // Question
        $question = new Questions;
        $question->answer = $input['answer'];
        $question->category = isset($input['category']) ? $input['category'] : 'LMV';
        $question->topicArea = $input['topicArea'];
        $question->photo = isset($input['photo']) ? $input['photo'] : '';
        $question->choice1photo = isset($input['choice1photo']) ? $input['choice1photo'] : '';
        $question->choice2photo = isset($input['choice2photo']) ? $input['choice2photo'] : '';
        $question->choice3photo = isset($input['choice3photo']) ? $input['choice3photo'] : '';

        if (isset($input['testType'])) {
            if ($input['testType'] == 'realtime') {
                $question->isRealtime = TRUE;
                $question->isPractise = TRUE;
                $question->parent = 'realtime';
            } else {
                 $question->isRealtime = TRUE;
                 $question->isPractise = TRUE;
                // if ($input['isCommon'] != TRUE) {
                //     $question->parent = 'specific';
                // } else {
                //    $question->parent = 'common';
                // }
            }
        } else {
            $question->isRealtime = TRUE;
            $question->isPractise = TRUE;
        }

        // if ($question->isPractise && $input['isCommon']) {
        //     $question->parent = 'common';
        // }


        $question->isCommon = isset($input['isCommon']) ? $input['isCommon'] : FALSE;
        $question->isSpecific = isset($input['isSpecific']) ? $input['isSpecific'] : FALSE;

        if ($question->isCommon && $question->isPractise) {
            $question->parent = 'common';
        } elseif ($question->isSpecific && $question->isPractise)  {
            $question->parent = 'specific';
        } else {
            //
        }

        $result = $question->save();

        if ($result) {
            $questionId = $question->primaryKey;
            $this->insertQuestionTranslation($questionId, $input['queries']);
            echo json_encode(array(
                'success' => true,
                'message' => 'Question created'
            ));
        } else {
            echo json_encode(array(
                'success' => false,
                'message' => 'Unable to create the question'
            ));
        }
        return;
    }

    public function actionBulk() {
        $rows = Language::findAll(['status' => TRUE]);
        $languages = array();
        foreach($rows as $row) {
            array_push($languages, $row->attributes);
        }

        $input = Yii::$app->request->post();
        $data=$input['data'];
        $question_type=$input['question_type'];
        $questionId=0;
        foreach ($data as $item){
            if(isset($item['No'])){
                $question = new Questions;
                $question->answer = $item['answer'];
                $question->category = isset($item['category']) ? $item['category'] : 'LMV';
                $question->topicArea = $item['topicArea'];
                $question->photo = isset($item['photo']) ? $item['photo'] : '';
                $question->choice1photo = isset($item['choice1photo']) ? $item['choice1photo'] : '';
                $question->choice2photo = isset($item['choice2photo']) ? $item['choice2photo'] : '';
                $question->choice3photo = isset($item['choice3photo']) ? $item['choice3photo'] : '';
                if (isset($question_type['testType'])) {
                    if ($question_type['testType'] == 'realtime') {
                        $question->isRealtime = TRUE;
                        $question->isPractise = TRUE;
                        $question->parent = 'realtime';
                    } else {
                        $question->isRealtime = TRUE;
                        $question->isPractise = TRUE;
                    }
                } else {
                    $question->isRealtime = TRUE;
                    $question->isPractise = TRUE;
                }
                $question->isCommon = isset($question_type['isCommon']) ? $question_type['isCommon'] : FALSE;
                $question->isSpecific = isset($question_type['isSpecific']) ? $question_type['isSpecific'] : FALSE;
                if ($question->isCommon && $question->isPractise) {
                    $question->parent = 'common';
                } elseif ($question->isSpecific && $question->isPractise)  {
                    $question->parent = 'specific';
                }
                $result = $question->save();
                if ($result) {
                    $questionId = $question->primaryKey;
                }
            }
            foreach ($languages as $language){
                if($item['language']==$language['name']){
                    $item['language']=$language['code'];
                    $this->insertQuestionTranslation($questionId,[$item]);
                    break;
                }
            }
        }
        echo json_encode(array(
            'success' => true,
            'message' => 'Question created'
        ));
        return;
    }

    public function getQuestionStmt($questionId, $language) {
        $rows = QuestionsTranslations::find()->where('questionid=' . $questionId)->all();
        foreach ($rows as $row) {
            $result = $row['attributes'];
            $result['translationId'] = $result['id'];
            unset($result['id']);
            if ($result['language'] === $language) {
                return $result;
            }
        }
        if(!is_null($rows) && isset($rows[0])){
            $result = $rows[0]['attributes'];
            $result['translationId'] = $result['id'];
            unset($result['id']);
            return $result;
        }else{
            return Array();
        }
    }

    public function actionGetall() {
        $language = Yii::$app->request->get('language');
        $rows = Questions::find()->where('status = 1')->all();
        $response = array();

        foreach ($rows as $row) {
            $result = $row['attributes'];
            $model = Topicarea::findOne(['id' => $result['topicArea']]);
            $topicArea = $model['attributes'];
            $result['topicArea'] = $topicArea['name'];

            $result = array_merge($result, $this->getQuestionStmt($result['id'], $language));
            array_push($response, $result);
        }
        // rsort($response);
        echo json_encode(array(
            'success' => true,
            'data' => $response
        ));
        return;
    }

    public function actionGetcount() {
        // $categories = ['LMV', 'MC', 'HVT and LB', 'FRLK', 'INSTRUCTOR'];
        $categories = array();
        $rows = Category::findAll(['status' => 1]);
        foreach($rows as $row) {
            array_push($categories, $row->attributes["name"]);
        }
        $count = array();
        foreach ($categories as $value) {
            $rows = Questions::find()->where('category = \''.$value.'\' AND isRealtime = 1 AND status = 1')->all();
            $realtime = array();
            foreach ($rows as $row) {
                $result = $row->attributes;
                array_push($realtime, $result);
            }
            $realCount = count($realtime);
            $rows = Questions::find()->where('category = \''.$value.'\' AND isSpecific = 1 AND isPractise = 1 AND status = 1')->all();
            $specific= array();
            foreach ($rows as $row) {
                $result = $row->attributes;
                array_push($specific, $result);
            }
            $specificCount = count($specific);
            $rows = Questions::find()->where('category = \''.$value.'\' AND isCommon = 1 AND isPractise = 1 AND status = 1')->all();
            $common= array();
            foreach ($rows as $row) {
                $result = $row->attributes;
                array_push($common, $result);
            }
            $commonCount = count($common);
            $rows = Questions::find()->where('category = \''.$value.'\' AND isCommon = 1 AND isRealtime = 1 AND status = 1')->all();
            $realtimeCommon = array();
            foreach ($rows as $row) {
                $result = $row->attributes;
                array_push($realtimeCommon, $result);
            }
            $realtimeCommonCount = count($realtimeCommon);
            $rows = Questions::find()->where('category = \''.$value.'\' AND isSpecific = 1 AND isRealtime = 1 AND status = 1')->all();
            $realtimeSpecific = array();
            foreach ($rows as $row) {
                $result = $row->attributes;
                array_push($realtimeSpecific, $result);
            }
            $realtimeSpecificCount = count($realtimeSpecific);
            array_push($count,  array('name'=>$value, 'realtime'=> $realCount, 'specific'=>$specificCount, 'common'=>$commonCount, 'realtimeCommon'=>$realtimeCommonCount, 'realtimeSpecific'=>$realtimeSpecificCount));
       }
        echo json_encode(array(
            'success' => true,
            'data' => $count
        ));
        return;
    }

    public function actionDelete() {
        // $model = QuestionsTranslations::deleteAll(['questionid' => Yii::$app->request->get('id')]);
        // $model = Questions::deleteAll(['id' => Yii::$app->request->get('id')]);
        $model = Questions::findOne(['id' =>  Yii::$app->request->get('id')]);
        $model->status = 0;
        $result = $model->update();
        echo json_encode(array(
            'success' => true,
            'message' => 'Question removed.'
        ));
        return;
    }
    public function actionTest() {
        $input = Yii::$app->request->post();
        $query = 'category="'. $input['category'] . '"';
       $response = array();
       if ($input['type'] == 'realtime') {
            $query .= ' AND isRealtime=TRUE';
            if($input['common'] > 0) {
                $rows = Questions::find()
                            ->where('isCommon = 1 AND status = 1')
                            ->orderBy('rand()')
                            ->limit($input['common'])
                            ->all();
                foreach ($rows as $row) {
                    $result =  $row->attributes;
                    $result = array_merge($result, $this->getQuestionStmt($result['id'], $input['language']));
                    array_push($response, $result);
                }

            }
            if($input['specific'] > 0) {
                $rows = Questions::find()
                            ->where($query.' AND isSpecific = 1 AND status = 1')
                            ->orderBy('rand()')
                            ->limit($input['specific'])
                            ->all();

                foreach ($rows as $row) {
                    $result =  $row->attributes;
                    $result = array_merge($result, $this->getQuestionStmt($result['id'], $input['language']));
                    array_push($response, $result);
                }
            }
       } elseif($input['type'] == 'practise') {
            $model = Questionstate::find()->where('user_id=' . $input['user_id'])->all();

            foreach ($model as $value) {
                $rows = Questions::find()->where('id = '.$value->attributes['question_id'])->all();
                foreach ($rows as $kvalue) {
                    $result =  $kvalue->attributes;
                    $result = array_merge($result, $this->getQuestionStmt($result['id'], $input['language']));
                    array_push($response, $result);
                }
            }
            //$deleteQuestion = Questionstate::deleteAll(['user_id=' . $input['user_id']]);
            $row = User::findOne(['id' => $input['user_id']]);
            $row->resume_test = 0;
            $row->time = '00:00:00';
            $row->update();
            $updateModel = Questionstate::deleteAll(['user_id' =>  $input['user_id']]);
       } else {
            $query .= ' AND isPractise=TRUE';
            switch ($input['type']) {
                case 'common':
                    $query = 'isCommon=TRUE';
                    break;

                case 'specific':
                    $query .= ' AND isSpecific=TRUE';
                    break;
            }
            $response = array();
            $rows = Questions::find()
                            ->where($query . ' AND status = 1')
                            // ->orderBy('rand()')
                            ->limit($input['limit'])
                            ->all();
            foreach ($rows as $row) {
                $result =  $row->attributes;
                $result = array_merge($result, $this->getQuestionStmt($result['id'], $input['language']));
                array_push($response, $result);
            }

       }
       $audiolang = isset($input['audiolang']) ? $input['audiolang'] : null;
       if($audiolang != null){
           $response = $this->getQuestionStmtAudio($response, $audiolang);
       }
        echo json_encode(array(
            'success' => true,
            'data' => $response
        ));

        return;
    }
    public function getQuestionStmtAudio($response, $audiolang){

        foreach ($response as $key => $row) {
            $rows = QuestionsTranslations::find()->where('questionid=' . $row['questionid'])->all();
            $status = false;
            $audio = [];
            foreach ($rows as $qkey => $qrow) {
                $result = $qrow->attributes;
                if ($result['language'] === $audiolang) {
                    $status = true;
                    $audio = $qrow->attributes;;
                }
            }
            if($status){
                $response[$key]['audio'] = $audio['audio'];
                $response[$key]['option1audio'] = $audio['option1audio'];
                $response[$key]['option2audio'] = $audio['option2audio'];
                $response[$key]['option3audio'] = $audio['option3audio'];
            }else{
                $response[$key]['audio'] = "";
                $response[$key]['option1audio'] = "";
                $response[$key]['option2audio'] = "";
                $response[$key]['option3audio'] = "";
            }
        }

        return $response;
    }
    public function getQuestionStmtAudioById($response, $audiolang){

        $rows = QuestionsTranslations::find()->where('questionid=' . $response['id'])->all();
        $status = false;
        $audio = [];
        foreach ($rows as $qkey => $qrow) {
            $result = $qrow->attributes;
            if ($result['language'] === $audiolang) {
                $status = true;
                $audio = $qrow->attributes;;
            }
        }
        if($status){
            $response['audio'] = $audio['audio'];
            $response['option1audio'] = $audio['option1audio'];
            $response['option2audio'] = $audio['option2audio'];
            $response['option3audio'] = $audio['option3audio'];
        }else{
            $response['audio'] = "";
            $response['option1audio'] = "";
            $response['option2audio'] = "";
            $response['option3audio'] = "";
        }

        return $response;
    }
    public function actionGetbyid() {
        $language = Yii::$app->request->get('language');
        $id = Yii::$app->request->get('id');

        $response = array();
        $question = Questions::find()
                        ->where('id=' . $id)
                        ->one();
        $response = $question->attributes;

        $model = Topicarea::findOne(['id' => $response['topicArea']]);
        $topicArea = $model->attributes;
        $response['topicArea'] = $topicArea['name'];

        $response = array_merge($response, $this->getQuestionStmt($id, $language));
        $audiolang = Yii::$app->request->get('audiolang');

        if($audiolang != null){
            $response = $this->getQuestionStmtAudioById($response, $audiolang);
        }

        echo json_encode(array(
            'success' => true,
            'data' => $response
        ));
        return;
    }

    public function actionTestcomplete() {
        $data = Yii::$app->request->post('result');
        $testResult = new Testresults;
        $testResult->studentid = Yii::$app->user->getId();
        $testResult->adminid = Yii::$app->request->post('admin_id');
        $testResult->category = Yii::$app->request->post('category');
        if (!$testResult->save()) {
            echo json_encode(array(
                'success' => false,
                'message' => 'Unable to save test results.'
            ));
            return;
        }
        $testId = $testResult->primaryKey;
        foreach ($data as $row) {
            $model = new Testquestions;
            $model->testid = $testId;
            $model->questionid = $row['question'];
            $model->input = $row['input'];
            $model->status = $row['status'];
            $model->save();
        }
        echo json_encode(array(
            'success' => true,
            'data' => $testId
        ));
        return;
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

    public function actionTestinfo() {
        $id = Yii::$app->request->get('id');
        $row =  Testresults::findOne(['id' => $id]);
        $response = $row->attributes;
        $user = User::findOne(['id' => $response['studentid']]);
        unset($response['studentid']);
        $response['student'] = $this->formatUser($user->attributes);
        $response['questions'] = array();
        $questions = Testquestions::findAll(['testid' => $response['id']]);

        $correctSpecificAnswers = 0;
        $correctCommonAnswers = 0;

        foreach ($questions as $row) {
            $record = $row->attributes;
            $question = QuestionsTranslations::findOne(['questionid' => $record['questionid']]);
            $record['question'] = $question['question'];

            $userQuestion = Questions::findOne(['id' => $record['questionid']]);
            $questionRow = $userQuestion->attributes;
            $model = Topicarea::findOne(['id' => $questionRow['topicArea']]);
            $topicArea = $model->attributes;
            $record['topicArea'] = $topicArea['name'];

            $record['option'] = $this->getUserChoice($question, $record['input']);
            array_push($response['questions'], $record);

            if($row->attributes['status'] == 1){
                $count = Questions::findOne(['isRealtime'=>1, 'id'=>$record['questionid']]);
                $count = $count->attributes;
                if ($count['isSpecific']) {
                   $correctSpecificAnswers = $correctSpecificAnswers+1;
                } elseif ($count['isCommon']) {
                    $correctCommonAnswers = $correctCommonAnswers+1;
                }
            }
        }
        $reqQuestions = Testconfig::findOne(['testcategory' => $response['category'], 'category' => 'realtime']);
        $reqQuestions = $reqQuestions->attributes;
        if ($correctSpecificAnswers >= $reqQuestions['noofreqspecificanswer']
            && $correctCommonAnswers >= $reqQuestions['noofreqcommonanswer']) {
            //print_r('Congratulations, you have passed your exam');
            $response['result_status'] = 1;
        } else {
            //print_r('Unfortunately, you have failed your exam');
            $response['result_status'] = 0;
        }

        echo json_encode(array(
            'success' => true,
            'data' => $response
        ));
        return;
    }

    public function actionTestall() {
        $userId = Yii::$app->request->get('userId');
        $adminId = Yii::$app->request->get('adminId');
        $from = Yii::$app->request->get('from');
        $to = Yii::$app->request->get('to');
        $page = Yii::$app->request->get('page');
        $pageSize = Yii::$app->request->get('pageSize');
        $studentId = Yii::$app->request->get('StudentId');
        $filterBy = Yii::$app->request->get('filterBy');
        $studentIdList = array();
        $userList = array();

        if($filterBy == "studentId"){
            $userList =  User::find()
                            ->where('studentId LIKE :substr', array(':substr' => '%'.$studentId.'%'))
                            ->orderBy(["id" => SORT_DESC])
                            ->all();
        }else if($filterBy == "student_name"){
            $userList =  User::find()
                            ->where('name LIKE :substr', array(':substr' => '%'.$studentId.'%'))
                            ->orderBy(["id" => SORT_DESC])
                            ->all();
        }else if($filterBy == "email"){
            $userList =  User::find()
                            ->where('email LIKE :substr', array(':substr' => '%'.$studentId.'%'))
                            ->orderBy(["id" => SORT_DESC])
                            ->all();
        }

        if(count($userList)){
            foreach ($userList as $key => $value) {
                $row = $value->attributes;
                array_push($studentIdList, $row['id']);
            }
        }
        $studentStr = implode(",",$studentIdList);

        if($studentId != null && $studentStr == "" && $filterBy != "category"){
            echo json_encode(array(
                'success' => true,
                'data' => [],
                'totalCount' => 0
            ));
            return;
        }

        $query = '';
        if ($userId) {
            $query = 'studentid='.$userId;
        }
        if ($adminId) {
            $query = 'adminid='.$adminId;
        }
        if($from && $to && $query != ''){
            $query .= "AND testdate >='".$from."' AND testdate <= '".$to."'";
        }else if($from && $to && $query == ''){
            $query .= "testdate >='".$from."' AND testdate <= '".$to."'";
        }

        if($studentStr != '' && $query != ''){
            $query .= "AND studentId IN (". $studentStr . ")";
        }else if($studentStr != '' && $query == ''){
            $query .= "studentId IN (". $studentStr . ")";
        }

        if($filterBy == 'category' && $query != ''){
            $query .= "AND category LIKE '%". $studentId . "%'";
        }else if($filterBy == 'category' && $query == ''){
            $query .= "category LIKE '%". $studentId . "%'";
        }

        $totalRecords =  Testresults::find()->where($query)->all();
        $totalCount = count ($totalRecords);

        $records =  Testresults::find()
                        ->where($query)
                        ->limit($pageSize)
                        ->offset($page * 10)
                        ->orderBy(["id" => SORT_DESC])
                        ->all();
        $result = array();

        foreach($records as $row) {
            $correctSpecificAnswers = 0;
            $correctCommonAnswers = 0;

            $response = $row->attributes;
            $user = User::findOne(['id' => $response['studentid']]);
            unset($response['studentid']);
            $response['student'] = $this->formatUser(isset($user->attributes) ? $user->attributes : null);
            // $response['questions'] = array();
            $questions = Testquestions::findAll(['testid' => $response['id']]);
            foreach ($questions as $qrow) {
                $record = $qrow->attributes;
                $question = QuestionsTranslations::findOne(['questionid' => $record['questionid']]);
                $record['question'] = $question['question'];
                $record['option'] = $this->getUserChoice($question, $record['input']);
                // array_push($response['questions'], $record);

                if($qrow->attributes['status']){
                    $count = Questions::findOne(['isRealtime'=>1, 'id'=>$record['questionid']]);
                    $count = $count->attributes;
                    if ($count['isSpecific']) {
                        $correctSpecificAnswers++;// = $correctSpecificAnswers+1;
                   } elseif($count['isCommon']) {
                       $correctCommonAnswers++;// = $correctCommonAnswers+1;
                    }
                }
            }
            $reqQuestions = Testconfig::findOne(['testcategory' => $response['category'], 'category' => 'realtime']);
            $reqQuestions = $reqQuestions->attributes;
            if ($correctSpecificAnswers >= $reqQuestions['noofreqspecificanswer']
                && $correctCommonAnswers >= $reqQuestions['noofreqcommonanswer']) {
                //print_r('Congratulations, you have passed your exam');
                $response['result_status'] = 1;
            } else {
                //print_r('Unfortunately, you have failed your exam');
                $response['result_status'] = 0;
            }

            array_push($result, $response);
            // rsort($result);
        }

        echo json_encode(array(
            'success' => true,
            'data' => $result,
            'totalCount' => $totalCount
        ));
        return;
    }

    public function actionAudioupload() {
        if(isset($_FILES)) {
            $key = '';
            $keys = array_merge(range(0, 9), range('a', 'z'));
            for ($i = 0; $i < 10; $i++) {
                $key .= $keys[array_rand($keys)];
            }
            $type = explode("/",$_FILES['file']['type']);
            //$new_file_name=$_REQUEST['question_name'].".".$type[1];
            $new_file_name=$key.".".$type[1];
            $target_path = realpath(Yii::$app->basePath)."/web/app_v1/assets/audio/".$new_file_name;
            if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
                echo json_encode(array(
                    'success' => true,
                    'url' => "app_v1/assets/audio/".$new_file_name
                ));
            } else {
                echo json_encode(array(
                    'success' => false,
                    'message' => 'Unable to save test results.'
                ));
            }
        }
        return;
    }

    public function getQuestionTranslation($questionId) {
        $rows = QuestionsTranslations::find()->where('questionid=' . $questionId)->all();
        $response = array();
        foreach ($rows as $row) {
            array_push($response, $row->attributes);
        }
        return $response;
    }

    public function actionGetinfo() {
        $id = Yii::$app->request->get('id');

        $response = array();
        $question = Questions::find()
                        ->where('id=' . $id)
                        ->one();
        $response = $question->attributes;
        $response['queries'] = $this->getQuestionTranslation($id);
        echo json_encode(array(
            'success' => true,
            'data' => $response
        ));
    }

    public function actionUpdate() {
        $data = Yii::$app->request->post();

        $model = Questions::findOne(['id' => $data['id']]);
        $model->answer = $data['answer'];
        $model->topicArea = $data['topicArea'];
        $model->photo = isset($data['photo']) ? $data['photo'] : '';
        $model->choice1photo = isset($data['choice1photo']) ? $data['choice1photo'] : '';
        $model->choice2photo = isset($data['choice2photo']) ? $data['choice2photo'] : '';
        $model->choice3photo = isset($data['choice3photo']) ? $data['choice3photo'] : '';

        if (isset($data['newTest']) && isset($data['newTest']['type'])) {
            if ($data['newTest']['type'] == 'realtime') {
                $model->isRealtime = TRUE;
                $model->isPractise = TRUE;
                $model->parent = "realtime";
            } else {
                $model->isRealtime = TRUE;
                $model->isPractise = TRUE;
                $model->parent = isset($data['newTest']['isCommon']) ? "common" : "specific";
                $model->parent = isset($data['newTest']['isSpecific']) ? "specific" : "common";

            }
        } else {
            $model->isRealtime = FALSE;
            $model->isPractise = FALSE;
        }

        $model->isCommon = isset($data['newTest']['isCommon']) ? $data['newTest']['isCommon'] : FALSE;
        $model->isSpecific = isset($data['newTest']['isSpecific']) ? $data['newTest']['isSpecific'] : FALSE;

        $model->answer = $data['answer'];
        $model->category = $data['category'];
        $result = $model->update();

        foreach ($data['queries'] as $query) {
            if (isset($query['id'])) {
                if (!isset($query['flag'])) {
                    $row = QuestionsTranslations::findOne(['id' => $query['id']]);
                    $row->language = $query['language'];
                    $row->question = $query['question'];
                    if (isset($query['audioUrl'])) {
                        $row->audio = $query['audioUrl'];
                    }
                    $row->choice1 = isset($query['choice1']) ? $query['choice1'] : '';
                    $row->choice2 = isset($query['choice2']) ? $query['choice2'] : '';
                    $row->choice3 = isset($query['choice3']) ? $query['choice3'] : '';
                    $row->option1audio = isset($query['option1audio']) ? $query['option1audio'] : '';
                    $row->option2audio = isset($query['option2audio']) ? $query['option2audio'] : '';
                    $row->option3audio = isset($query['option3audio']) ? $query['option3audio'] : '';
                    $row->update();
                } else {
                    if ($query['flag'] = 'deleted') {
                        $row = QuestionsTranslations::findOne(['id' => $query['id']]);
                        $row->delete();
                    }
                }
            } else {
                $model = new QuestionsTranslations;
                $model->questionid = $data['id'];
                $model->language = $query['language'];
                $model->question = $query['question'];
                if (isset($query['audioUrl'])) {
                    $model->audio = $query['audioUrl'];
                }
                $model->choice1 = isset($query['choice1']) ? $query['choice1'] : '';
                $model->choice2 = isset($query['choice2']) ? $query['choice2'] : '';
                $model->choice3 = isset($query['choice3']) ? $query['choice3'] : '';
                $model->option1audio = isset($query['option1audio']) ? $query['option1audio'] : '';
                $model->option2audio = isset($query['option2audio']) ? $query['option2audio'] : '';
                $model->option3audio = isset($query['option3audio']) ? $query['option3audio'] : '';
                $model->save();
            }
        }

        echo json_encode(array(
                'success' => true,
                'message' => 'Updated!'
            ));
        return;
    }

    public function actionTestiscomplete() {
        $category = Yii::$app->request->get('category');
        $user = Yii::$app->user->getId();

        $row = Testresults::findOne(['studentid' => $user, 'category' => $category]);

        if ($row) {
            echo json_encode(array(
                    'success' => true
                ));
        } else {
            echo json_encode(array(
                    'success' => false
                ));
        }
        return;
    }
    public function actionQuestionstate(){
        $data = Yii::$app->request->post();
        $user_id = '';
        $time = '';

        foreach ($data as $key) {
            $user_id = $key['user_id'];
            $time = $key['time'];
            $model = new Questionstate;
            $model->user_id = $key['user_id'];
            $model->question_id = $key['questionId'];
            $model->category = $key['category'];
            $model->save();
        }
        $row = User::findOne(['id' => $user_id]);
        $row->resume_test = 1;
        $row->time = $time;
        $row->update();
        return;
    }
    public function actionClearstate(){
        $user_id = Yii::$app->request->get('id');
        $row = User::findOne(['id' => $user_id]);
        $row->resume_test = 0;
        $row->time = '00:00:00';
        $row->update();

        $model = Questionstate::deleteAll(['user_id' => Yii::$app->request->get('id')]);
    }

    public function actionUpdatetime(){
        $user_id = Yii::$app->request->get('id');
        $time = Yii::$app->request->get('time');
        $row = User::findOne(['id'=> $user_id]);
        $row->time = $time;
        $row->update();
    }

    public function actionReport() {
        $supervisor = User::find()->where('isAdmin=2')->all();
        $sresult = array();
        foreach ($supervisor as $srow) {

            $records =  Testresults::find()->where('adminid='.$srow->attributes['id'])->all();
            $result = array();

            foreach($records as $row) {
                $correctSpecificAnswers = 0;
                $correctCommonAnswers = 0;

                $response = $row->attributes;
                $user = User::findOne(['id' => $response['studentid']]);
                unset($response['studentid']);
                $response['student'] = $this->formatUser(isset($user->attributes) ? $user->attributes : null);
                $response['questions'] = array();
                $questions = Testquestions::findAll(['testid' => $response['id']]);
                foreach ($questions as $qrow) {
                    $record = $qrow->attributes;
                    $question = QuestionsTranslations::findOne(['questionid' => $record['questionid']]);
                    $record['question'] = $question['question'];
                    $record['option'] = $this->getUserChoice($question, $record['input']);
                    array_push($response['questions'], $record);

                    if($qrow->attributes['status']){
                        $count = Questions::findOne(['isRealtime'=>1, 'id'=>$record['questionid']]);
                        $count = $count->attributes;
                        if ($count['isSpecific']) {
                            $correctSpecificAnswers++;// = $correctSpecificAnswers+1;
                       } elseif($count['isCommon']) {
                           $correctCommonAnswers++;// = $correctCommonAnswers+1;
                        }
                    }
                }
                $reqQuestions = Testconfig::findOne(['testcategory' => $response['category'], 'category' => 'realtime']);
                $reqQuestions = $reqQuestions->attributes;
                if ($correctSpecificAnswers >= $reqQuestions['noofreqspecificanswer']
                    && $correctCommonAnswers >= $reqQuestions['noofreqcommonanswer']) {
                    //print_r('Congratulations, you have passed your exam');
                    $response['result_status'] = 1;
                } else {
                    //print_r('Unfortunately, you have failed your exam');
                    $response['result_status'] = 0;
                }

                array_push($result, $response);
                rsort($result);
            }
            array_push($sresult, array('id' => $srow->attributes['studentId'], 'result' => $result));
        }
        $report = array();
        foreach ($sresult as $value) {
            if(count($value['result'])){
                $count = 0;
                $pass = 0;
                foreach ($value['result'] as $rvalue){
                    $count++;
                    if($rvalue['result_status'] == 1){
                        $pass++;
                    }
                }
                array_push($report, array('id' => $value['id'],'total' => $count,'passed' => $pass, 'percent' => round(($pass/$count) * 100 )));
            }else{
                array_push($report, array('id' => $value['id'],'total' => 0,'passed' => 0, 'percent' => 0 ));
            }

        }
        sort($report);
        echo json_encode(array(
            'success' => true,
            'data' => $report
        ));
        return;
    }
}
