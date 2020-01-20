<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\User;
use app\models\Language;

class LanguageController extends Controller
{
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'getall' => ['get'],
                    'getById' => ['post'],
                    'create' => ['post'],
                    'update' => ['put'],
                    'delete' => ['delete']
                ],
            ],
        ];
    }

    public function beforeAction($action) {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }

    public function actionGetall() {
        $rows = Language::findAll(['status' => TRUE]);
        $result = array();
        foreach($rows as $row) {
            array_push($result, $row->attributes);
        }
        echo json_encode(array(
                'success' => true,
                'data' => $result
            ));
        return;
    }

    public function actionCreate() {
        $model = new Language;
        $model->code = Yii::$app->request->post('code');
        $model->name = Yii::$app->request->post('name');
        if ($model->save()) {
            $result = array(
                'success' => true,
                'data' => $model->attributes
            );
        } else {
            $result = array(
                    'success' => false,
                    'message' => 'Unable to create a new language.'
                );
        }
        echo json_encode($result);
        return;
    }

    public function actionGetbyid() {
        $model = Language::findOne(['id' => Yii::$app->request->get('id')]);
        $result = array(
            'success' => true,
            'data' => $model->attributes
        );
        echo json_encode($result);
        return;
    }

    public function actionUpdate() {
        $model = Language::findOne(['id' => Yii::$app->request->post('id')]);
        $model->name = Yii::$app->request->post('name');
        $model->code = Yii::$app->request->post('code');
        if ($model->save()) {
            $result = array(
                'success' => true,
                'message' => 'saved'
            );
        } else {
            $result = array(
                'success' => true,
                'message' => 'saved'
            );
        }
        echo json_encode($result);
        return;
    }

    public function actionDelete() {
        $model = Language::findOne(['id' => Yii::$app->request->get('id')]);
        if ($model->delete()) {
            $result = array(
                    'success' => true
                );
        } else {
            $result = array(
                    'success' => false
                );
        }
        echo json_encode($result);
        return;
    }
}
