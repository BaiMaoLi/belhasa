<?php
namespace app\controllers;

use app\models\Questions;
use app\models\QuestionsTranslations;
use app\models\Testquestions;
use app\models\Topicarea;
use Yii;
use yii\filters\VerbFilter;
use yii\web\Controller;

class TopicsController extends Controller {
	public function behaviors() {
		return [
			'verbs' => [
				'class' => VerbFilter::className(),
				'actions' => [
					'getall' => ['get'],
					'getById' => ['get'],
					'create' => ['post'],
					'update' => ['put'],
					'delete' => ['delete'],
				],
			],
		];
	}

	public function beforeAction($action) {
		$this->enableCsrfValidation = false;
		return parent::beforeAction($action);
	}

	public function actionGetall() {
		// $rows = Topicarea::findAll(['status' => TRUE]);
		$rows = Topicarea::find()->where('status = 1')->all();
		$result = array();
		foreach ($rows as $row) {
			$qrows = Questions::find()->where('status = 1 AND topicArea = \''.$row->attributes['id'].'\'')->all();
            $question = array();
            foreach ($qrows as $qrow) {
                $qresult = $qrow->attributes;
                array_push($question, $qresult);
            }
            $questionCount = count($question);
			$res = $row->attributes;
			$res['questionCount'] = $questionCount;
			array_push($result, $res);
		}
		rsort($result);
		echo json_encode(array(
			'success' => true,
			'data' => $result,
		));
		return;
	}

	public function actionCreate() {
		$topic = Yii::$app->request->post();

		$query = "name = '".$topic['name']."'";
		$query .= isset($topic['name_ta']) ? " OR name_ta = '".$topic['name_ta']."'" : '';
		$query .= isset($topic['name_ar']) ? " OR name_ar = '".$topic['name_ar']."'" : '';
		$query .= isset($topic['name_ur']) ? " OR name_ur = '".$topic['name_ur']."'" : '';
		$query .= isset($topic['name_hi']) ? " OR name_hi = '".$topic['name_hi']."'" : '';
		$query .= isset($topic['name_be']) ? " OR name_be = '".$topic['name_be']."'" : '';
		$query .= isset($topic['name_ma']) ? " OR name_ma = '".$topic['name_ma']."'" : '';
		$query .= isset($topic['name_fa']) ? " OR name_fa = '".$topic['name_fa']."'" : '';
		$query .= isset($topic['name_ch']) ? " OR name_ch = '".$topic['name_ch']."'" : '';
		$query .= isset($topic['name_ru']) ? " OR name_ru = '".$topic['name_ru']."'" : '';

		$rows = Topicarea::find()
                        ->where($query)
                        ->all();

        if(!count($rows)){
			$model = new Topicarea;
			$model->name = isset($topic['name']) ? $topic['name'] : '';
			$model->name_ta = isset($topic['name_ta']) ? $topic['name_ta'] : '';
			$model->name_ar = isset($topic['name_ar']) ? $topic['name_ar'] : '';
			$model->name_ur = isset($topic['name_ur']) ? $topic['name_ur'] : '';
			$model->name_hi = isset($topic['name_hi']) ? $topic['name_hi'] : '';
			$model->name_be = isset($topic['name_be']) ? $topic['name_be'] : '';
			$model->name_ma = isset($topic['name_ma']) ? $topic['name_ma'] : '';
			$model->name_fa = isset($topic['name_fa']) ? $topic['name_fa'] : '';
			$model->name_ch = isset($topic['name_ch']) ? $topic['name_ch'] : '';
			$model->name_ru = isset($topic['name_ru']) ? $topic['name_ru'] : '';
			if ($model->save()) {
				$result = array(
					'success' => true,
					'data' => $model->attributes,
				);
			} else {
				$result = array(
					'success' => false,
					'message' => 'Unable to create a new topic.',
				);
			}
			echo json_encode($result);
			return;
        }else{
            $result = array(
                'success' => false,
                'message' => 'Topic Area name already exists.'
            );
            echo json_encode($result);
    		return;
        }
	}

	public function actionGetbyid() {
		$model = Topicarea::findOne(['id' => Yii::$app->request->get('id')]);
		$result = array(
			'success' => true,
			'data' => $model->attributes,
		);
		echo json_encode($result);
		return;
	}

	public function actionUpdate() {
		$topic = Yii::$app->request->post();

		$query = "name = '".$topic['name']."'";
		$query .= $topic['name_ta'] != '' ? " OR name_ta = '".$topic['name_ta']."'" : '';
		$query .= $topic['name_ar'] != '' ? " OR name_ar = '".$topic['name_ar']."'" : '';
		$query .= $topic['name_ur'] != '' ? " OR name_ur = '".$topic['name_ur']."'" : '';
		$query .= $topic['name_hi'] != '' ? " OR name_hi = '".$topic['name_hi']."'" : '';
		$query .= $topic['name_be'] != '' ? " OR name_be = '".$topic['name_be']."'" : '';
		$query .= $topic['name_ma'] != '' ? " OR name_ma = '".$topic['name_ma']."'" : '';
		$query .= $topic['name_fa'] != '' ? " OR name_fa = '".$topic['name_fa']."'" : '';
		$query .= $topic['name_ch'] != '' ? " OR name_ch = '".$topic['name_ch']."'" : '';
		$query .= $topic['name_ru'] != '' ? " OR name_ru = '".$topic['name_ru']."'" : '';

		$rows = Topicarea::find()
                        ->where($query)
                        ->all();

        if(!count($rows)){
			$model = Topicarea::findOne(['id' => Yii::$app->request->post('id')]);

			$model->name = isset($topic['name']) ? $topic['name'] : '';
			$model->name_ta = isset($topic['name_ta']) ? $topic['name_ta'] : '';
			$model->name_ar = isset($topic['name_ar']) ? $topic['name_ar'] : '';
			$model->name_ur = isset($topic['name_ur']) ? $topic['name_ur'] : '';
			$model->name_hi = isset($topic['name_hi']) ? $topic['name_hi'] : '';
			$model->name_be = isset($topic['name_be']) ? $topic['name_be'] : '';
			$model->name_ma = isset($topic['name_ma']) ? $topic['name_ma'] : '';
			$model->name_fa = isset($topic['name_fa']) ? $topic['name_fa'] : '';
			$model->name_ch = isset($topic['name_ch']) ? $topic['name_ch'] : '';
			$model->name_ru = isset($topic['name_ru']) ? $topic['name_ru'] : '';
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

        }else{
            $result = array(
                'success' => false,
                'message' => 'Topic Area name already exists.'
            );
            echo json_encode($result);
    		return;
        }
	}

	public function actionDelete() {
		$model = Topicarea::findOne(['id' => Yii::$app->request->get('id')]);

		$topic_id = Yii::$app->request->get('id');
		$rows = Questions::findAll(['topicArea' => $topic_id]);
		foreach ($rows as $row) {
			$result = $row->attributes;
			//print_r($result['id']);exit;
			// $qmodel = QuestionsTranslations::deleteAll(['questionid' => $result['id']]);
			// $qmodel = Questions::deleteAll(['id' => $result['id']]);
			// $qmodel = Testquestions::deleteAll(['questionid' => $result['id']]);
			$qmodel = Questions::findOne(['id' =>  $result['id']]);
	        $qmodel->status = 0;
	        $qresult = $qmodel->update();

		}
		// $response = array();
		// print_r($rows);exit;
		// $model = QuestionsTranslations::deleteAll(['questionid' => Yii::$app->request->get('id')]);
		// $model = Questions::deleteAll(['id' => Yii::$app->request->get('id')]);
		$model->status = 0;
		if ($model->update()) {
			$result = array(
				'success' => true,
			);
		} else {
			$result = array(
				'success' => false,
			);
		}
		echo json_encode($result);
		return;
	}
}
