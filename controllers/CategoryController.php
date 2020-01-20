<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\User;
use app\models\Language;
use app\models\Category;
use app\models\Testconfig;
use app\models\Testresults;
use app\models\Questions;

class CategoryController extends Controller
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

    public function actionGetall() {
        // $rows = Category::findAll(['status' => 1]);
        $rows = Category::find()->all();
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
		$topic = Yii::$app->request->post();
        $rows = Category::findAll(['name' => $topic['name']]);

        if(!count($rows)){
            $model = new Category;
    		$model->name = isset($topic['name']) ? $topic['name'] : '';
    		if ($model->save()) {
                $testcategory = isset($topic['name']) ? $topic['name'] : '';
                $status = $this->insertCategory("Realtime Question",$testcategory,"realtime");
                $status = $this->insertCategory("Common Question",$testcategory,"common");
                $status = $this->insertCategory("Specific Question",$testcategory,"specific");
    			$result = array(
    				'success' => true,
    				'data' => $model->attributes
    			);
    		} else {
    			$result = array(
    				'success' => false,
    				'message' => 'Unable to create a new category.'
    			);
    		}
    		echo json_encode($result);
    		return;
        }else{
            $result = array(
                'success' => false,
                'message' => 'Category name already exists.'
            );
            echo json_encode($result);
    		return;
        }
	}

    function insertCategory($name, $testcategory, $category){
        $category_model = new Testconfig;
        $category_model->name = $name;
        $category_model->testcategory = $testcategory;
        $category_model->category = $category;
        $category_model->noofquestion = 0;
        $category_model->reqnoofanswer = 0;
        $category_model->noofspecificquestion = 0;
        $category_model->noofcommonquestion = 0;
        $category_model->noofreqspecificanswer = 0;
        $category_model->noofreqcommonanswer = 0;
        $category_model->duration = 0;
        $category_model->save();
        return ;
    }

    public function actionGetbyid() {
        $model = Category::findOne(['id' => Yii::$app->request->get('id')]);
        $result = array(
            'success' => true,
            'data' => $model->attributes
        );
        echo json_encode($result);
        return;
    }

    public function actionUpdatestatus() {
        $model = Category::findOne(['id' => Yii::$app->request->post('id')]);
        $topic = Yii::$app->request->post();
        $model->status = isset($topic['status']) ? $topic['status'] : '1';
        if ($model->save()) {
            $result = array(
                'success' => true,
                'message' => 'saved',
            );
        } else {
            $result = array(
                'success' => true,
                'message' => 'saved',
            );
        }
        echo json_encode($result);
        return;
    }

    public function actionUpdate() {
        $topic = Yii::$app->request->post();
        $rows = Category::findAll(['name' => $topic['name']]);

        if(!count($rows)){
            $model = Category::findOne(['id' => Yii::$app->request->post('id')]);

            $name = $model->attributes['name'];
            $model->name = isset($topic['name']) ? $topic['name'] : '';
            if ($model->save()) {
                $model_users =  User::findAll(['category' => $name]);
                foreach ($model_users as $key => $value) {
                    $this->updateUserCategory($value->attributes, $topic['name']);
                }
                $model_result = Testresults::findAll(['category' => $name]);
                foreach ($model_result as $key => $value) {
                    $this->updateUserResult($value->attributes, $topic['name']);
                }
                $model_category = Testconfig::findAll(['testcategory' => $name]);
                foreach ($model_category as $key => $value) {
                    $this->updateCategoryConfig($value->attributes, $topic['name']);
                }
                $result = array(
                    'success' => true,
                    'message' => 'saved',
                );
            } else {
                $result = array(
                    'success' => true,
                    'message' => 'saved',
                );
            }
            echo json_encode($result);
            return;
        }else{
            $result = array(
                'success' => false,
                'message' => 'Category name already exists.'
            );
            echo json_encode($result);
    		return;
        }
    }

    public function updateUserCategory($users, $category){
        $model = User::findOne(['id' => $users['id']]);
        $model->category = $category;
        $model->save();
    }

    public function updateUserResult($users, $category){
        $model = Testresults::findOne(['id' => $users['id']]);
        $model->category = $category;
        $model->save();
    }

    public function updateCategoryConfig($users, $category){
        $model = Testconfig::findOne(['id' => $users['id']]);
        $model->testcategory = $category;
        $model->save();
    }

    public function actionDelete() {
        $model = Category::findOne(['id' => Yii::$app->request->get('id')]);
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
