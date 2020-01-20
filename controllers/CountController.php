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
use app\models\Testconfig;

class CountController extends Controller
{
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    // 'logout' => ['post'],
                    'login' => ['post'],
                    'register' => ['post']
                ],
            ],
        ];
    }

    public function actionTestconfig() {
        $category = Yii::$app->request->get('category');
        if (!empty($category)) {
            $rows = Testconfig::findAll(['testcategory'=>$category]);
            //$rows = Testconfig::findAll(['testcategory'=>$category, 'category'=>'realtime']);
            $record = array();
            foreach ($rows as $row) {
                array_push($record, $row->attributes);
            }
            echo json_encode(array(
                'success' => true,
                'data' => $record
            ));
        } else {
            $rows = Testconfig::find()->all();
            $record = array();
            foreach ($rows as $row) {
                array_push($record, $row->attributes);
            }
            echo json_encode(array(
                'success' => true,
                'data' => $record
            ));
        }
        // $rows = Testconfig::find()->all();
        // $record = array();
        // foreach ($rows as $row) {
        //     array_push($record, $row->attributes);
        // }
        // echo json_encode(array(
        //     'success' => true,
        //     'data' => $record
        // ));

    }

    public function actionTestconfigbycategory() {
        $row = Testconfig::findOne([
            'testcategory' => Yii::$app->request->get('category'),
            'category' => Yii::$app->request->get('type')
        ]);
        $result = [];
        if ($row) {
            $result = $row->attributes;
            echo json_encode(array(
                'success' => true,
                'data' => $result
            ));
        } else {
            echo json_encode(array(
                'success' => false,
                'message' => 'Invalid category'
            ));
        }


        return;
    }

    // No of question should be same to both common and specific in practice test
    public function actionTestconfigsave() {
        $category = '';
        $row = Testconfig::findOne(['id' => Yii::$app->request->post('id')]);
        $data = Yii::$app->request->post();
        if ($data['category'] == 'common'){
            $category = 'specific';
        } elseif ($data['category'] == 'specific') {
            $category = 'common';
        } else {}
        if($category == 'specific' || $category == 'common') {
            $practice = Testconfig::findOne(['category'=>$category, 'testcategory' => $data['testcategory']]);
            $practice->duration = $data['duration'];
            $practice->update();
        }
        $row->name = $data['name'];
        $row->category = $data['category'];
        $row->noofquestion = $data['noofspecificquestion'] + $data['noofcommonquestion'];
        $row->reqnoofanswer = $data['noofreqspecificanswer'] + $data['noofreqcommonanswer'];
        $row->noofspecificquestion = $data['noofspecificquestion'];
        $row->noofcommonquestion = $data['noofcommonquestion'];
        $row->noofreqspecificanswer = $data['noofreqspecificanswer'];
        $row->noofreqcommonanswer = $data['noofreqcommonanswer'];
        $row->duration =  $data['duration'];
        $row->update();

        echo json_encode(array(
                'success' => true,
                'message' => 'done'
            ));
    }

    // public function actionTestconfigsave() {

    //     $row = Testconfig::findOne(['id' => Yii::$app->request->post('id')]);
    //     $data = Yii::$app->request->post();
    //     $row->name = $data['name'];
    //     $row->category = $data['category'];
    //     $row->noofquestion = $data['noofspecificquestion'] + $data['noofcommonquestion'];
    //     $row->reqnoofanswer = $data['noofreqspecificanswer'] + $data['noofreqcommonanswer'];
    //     $row->noofspecificquestion = $data['noofspecificquestion'];
    //     $row->noofcommonquestion = $data['noofcommonquestion'];
    //     $row->noofreqspecificanswer = $data['noofreqspecificanswer'];
    //     $row->noofreqcommonanswer = $data['noofreqcommonanswer'];
    //     $row->duration =  $data['duration'];
    //     //$row->instruction = $data['instruction'];
    //     $row->update();
    //     echo json_encode(array(
    //             'success' => true,
    //             'message' => 'done'
    //         ));
    // }

    public function beforeAction($action) {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }

    public function actionUser() {
        $query = 'isAdmin<>true';
        $value = 0;
        if (Yii::$app->request->get('field')) {
            $query .= ' AND '.Yii::$app->request->get('field'). '=' . $value;
        }
        $result = User::find()->where($query)->all();
        echo json_encode(array(
                'success' => true,
                'data' => count($result)
            ));
        return;
    }

    public function actionQuestions() {
        $result = Questions::find()->where('status = 1')->all();
        echo json_encode(array(
                'success' => true,
                'data' => count($result)
            ));
        return;
    }

    public function actionTests() {
        $result = Testresults::find()->all();
        echo json_encode(array(
                'success' => true,
                'data' => count($result)
            ));
        return;
    }
}
