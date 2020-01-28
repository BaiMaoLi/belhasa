<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;
use app\models\User;
use app\models\Usersession;

class UserController extends Controller
{
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    // 'logout' => ['post'],
                    'login' => ['post'],
                    'register' => ['post'],
                    'supervisor' => ['post']
                ],
            ],
        ];
    }

    public function beforeAction($action) {
        $this->enableCsrfValidation = false;
        return parent::beforeAction($action);
    }

    public function calculateAge($dob) {
        $dob = explode("-",$dob);
        $curMonth = date("m");
        $curDay = date("j");
        $curYear = date("Y");
        $age = $curYear - $dob[0];
        if($curMonth<$dob[1] || ($curMonth==$dob[1] && $curDay<$dob[2]))
                $age--;
        return $age;
    }

    public function actionRegister() {

        $request = Yii::$app->request;

        $model = new User;
        $model->studentId = $request->post('studentId');
//        $model->firstName = $request->post('firstName');
//        $model->lastName = $request->post('lastName');
        $model->name = $request->post('firstName')." ".$request->post('lastName');

        $model->email = $request->post('email');
        $model->password = sha1($request->post('password'));
        $model->confirmPassword = sha1($request->post('confirmPassword'));
        $model->gender = $request->post('gender');
        $model->maritalStatus = $request->post('maritalStatus');
        $model->nationality = $request->post('nationality');
        $model->dob = $request->post('dob');
        $model->photo = $request->post('photo') ? $request->post('photo') : '';
        $model->age = $this->calculateAge($request->post('dob'));
        $model->passport = $request->post('passport');
        $model->emirates = $request->post('emirates');

        if ($request->post('admin')) {
            $admin = User::findOne(['password' => sha1($request->post('admin')), 'isAdmin' => 1]);
            if (!$admin) {
                echo json_encode(array(
                        'success' => false,
                        'message' => 'Incorrect admin credentials'
                    ));
                return;
            } else {
                $model->status = 1;
            }
        }

        if ($model->save()) {
            if ($model->status) {
                $identity = User::findOne(['email' => $request->post('email')]);
                Yii::$app->user->login($identity);
                $result = array(
                    'success' => true,
                    'data' => $identity->attributes
                );
            } else {
                $result = array(
                    'success' => true,
                    'message' => 'Thank you, your registration is success. You will receive an activation email shortly.'
                );
            }
        } else {
            $result = array(
                'success' => false,
                'message' => 'Unable to create account, Please contact your Administrator',
            );
        }

        echo json_encode($result);
        return;
    }

    public function actionGetbyid() {
        if (Yii::$app->request->get('id')) {
            $user = User::findOne(['id' => Yii::$app->request->get('id')]);
            $result = $user->attributes;
            $result['password'] = null;
            $result['confirmPassword'] = null;
            echo json_encode(array(
                    'success' => true,
                    'data' => $result
                ));
        } else {
            echo json_encode(array(
                    'success' => false,
                    'message' => 'Invalid user'
                ));
        }
        return;
    }

    public function actionStudentlogin() {
            $input = array(
            'studentId' =>  Yii::$app->request->post('studentId'),
            // 'name' =>  Yii::$app->request->post('name'),
            //'password' => Yii::$app->request->post('password'),
            'status' => true
        );
        //$admin = User::findOne(['password' => Yii::$app->request->post('password'), 'isAdmin' => 1]);
        $admin = User::findOne(['password' => sha1(Yii::$app->request->post('password')), 'status' => 1, 'studentId' => Yii::$app->request->post('supervisorId')]);
        $result=array();
        if($admin){
            $model = new Usersession;
            $model->sid = Yii::$app->request->post('studentId');
            $model->name = ''.$admin->attributes['name'];
            $model->adminid = ''.$admin->attributes['id'];
            $flag  = $model->save();
            Yii::$app->user->login($admin);
            $result = array(
                'success' => true,
                'data' => $admin->attributes,
                'admin_id' => $admin->attributes['id'],
                'flag' => $flag
            );
        }
        else {
            $result = array(
                'success' => false,
                'message' => 'Incorrect Username / Password'
            );
        }
        echo json_encode($result);
        return;
    }

     public function actionLogin() {
        $input = array(
            'email' =>  Yii::$app->request->post('email'),
            'password' => sha1(Yii::$app->request->post('password')),
            'status' => true
        );
        $user = User::findOne($input);
        if (!is_null($user)) {
            Yii::$app->user->login($user);
            $result = array(
                'success' => true,
                'data' => $user->attributes
            );
        } else {
            $result = array(
                'success' => false,
                'message' => 'Incorrect Username / Password'
            );
        }
        echo json_encode($result);
        return;
    }


    public function actionLogout()
    {
        $id = Yii::$app->request->get('id');
        $row = User::findOne(['id' => $id]);
        $row->language = '';
        $row->update();
        Yii::$app->user->logout();

        echo json_encode(array(
                'success' => true
            ));
        return;
    }

    public function actionGetall() {
        $users = User::find()->all();
        $result = array(
            'success' => true,
            'data' => array()
        );
        foreach ($users as $row) {
            array_push($result['data'], $row->attributes);
        }
        rsort($result['data']);
        echo json_encode($result);
        return;
    }

    public function actionActivate() {
        $data = Yii::$app->request->post('id');
        $model = User::find()->where('id='.$data)->one();
        $model->status = $model->status ? 0 : 1;
        $result = $model->update();
        if ($result) {
            echo json_encode(array(
                'success' => true,
                'message' => 'User details updated.'
            ));
        } else {
            echo json_encode(array(
                'success' => false,
                'message' => 'User details already updated.'
            ));
        }

        /**Yii::$app->mail->compose()
            ->setFrom(Yii::$app->controller->module->params['defaultMail'])
            ->setTo($model->email)
            ->setSubject("Belhasa Student Account Activation")
            ->setTextBody("Dear <b>" . $model->firstName . "</b>,</br> </br> Your Account has been Activated sucessfully. Please login to your account using your Student id and password")
            ->send();**/
        return;
    }

    public function actionMe() {
        $userId = Yii::$app->user->getId();
        $user = User::findOne(['id' => $userId]);
        $result =  $user->attributes;
        unset($result['password']);
        unset($result['confirmPassword']);
        echo json_encode(array(
            'success' => true,
            'data' => $result
        ));
        return;
    }

    public function actionMail() {
        echo "<pre>";
        Yii::$app->mail->compose()
     ->setFrom(Yii::$app->controller->module->params['defaultMail'])
     ->setTo("aruljothi@cloudmaxis.com")
     ->setSubject("subject")
     ->setTextBody("text")
     ->send();
    }

    public function actionResetpassword() {
        $admin = User::findOne(['id' => Yii::$app->user->getId()]);
        $admin = $admin->attributes;
        $isAdmin = $admin['isAdmin'];

        $input = Yii::$app->request->post();
        $query = array(
            'id' => $input['id']
        );
        if (!$isAdmin) {
            $query['password'] = sha1($input['currentPassword']);
        }

        if ($isAdmin != '0') {
            //$password = User::findOne(['isAdmin' => $data['isAdmin'], 'password'=> $data['password']]);
            $password = User::findOne(['password'=> sha1($input['newPassword'])]);
            if($password) {
                echo json_encode(array(
                    "success" => false,
                    "message" => 'Passcode already exists. Please, try a different passcode'
                ));
                return;
            }
        }

        $user = User::findOne($query);
        if ($user) {
            $result = User::updateAll(['password'=> sha1($input['newPassword']), 'confirmPassword' => sha1($input['confirmPassword'])], 'id='.$input['id']);
            echo json_encode(array(
                    'success' => true,
                    'message' => 'updated'
                ));
        } else {
            echo json_encode(array(
                    'success' => false,
                    'message' => 'Incorrect user'
                ));
        }
        return;
    }

    public function actionUpdate() {
        $id = Yii::$app->request->get('id');
        $id = $id ? $id : Yii::$app->user->getId();

        $request = Yii::$app->request;

        $model = User::find()->where('id='.$id)->one();

        $model->name = $request->post('name');
        $model->email = $request->post('email');
        //$model->password = $request->post('password');
        $model->confirmPassword = sha1($request->post('confirmPassword'));
        $model->gender = $request->post('gender');
        $model->maritalStatus = $request->post('maritalStatus');
        $model->nationality = $request->post('nationality');
        $model->dob = $request->post('dob');
        $model->photo = $request->post('photo');
        //$model->age = $this->calculateAge($request->post('dob'));
        $model->passport = $request->post('passport');
        $model->emirates = $request->post('emirates');
        $model->isAdmin = $request->post('isAdmin');
        $model->category = $request->post('category');
        $result = $model->update();

        if ($result) {
            echo json_encode(array(
                'success' => true,
                'data' => $model->attributes
            ));
        } else {
            echo json_encode(array(
                'success' => false,
                'message' => 'User details already updated.'
            ));
        }
        return;
    }

    public function actionStudent() {
        $data = Yii::$app->request->post();
        if($data['isAdmin'] == '0'){
            $user = User::findOne(['studentId' => $data['studentId']]);
            if($user) {
                echo json_encode(array(
                    'success' => false,
                    'message' => 'Student Id already exist in App'
                ));
                return;
            }
        }

        if($data['isAdmin'] == '1'){
            $user = User::findOne(['studentId' => $data['studentId']]);
            if($user) {
                echo json_encode(array(
                    'success' => false,
                    'message' => 'Admin Id already exist in App'
                ));
                return;
            }
        }

        if($data['isAdmin'] == '2'){
            $user = User::findOne(['studentId' => $data['studentId']]);
            if($user) {
                echo json_encode(array(
                    'success' => false,
                    'message' => 'Supervisor Id already exist in App'
                ));
                return;
            }
        }

        if (isset($data['email'])){
            $user = User::findOne(['email' => $data['email']]);
            if($user) {
                echo json_encode(array(
                    'success' => false,
                    'message' => 'Email Id already exist in App'
                ));
                return;
            }
        }

        // if($data['isAdmin'] == '2'){
        //     $username = User::findOne(['name' => $data['name']]);
        //     if($username) {
        //         echo json_encode(array(
        //             'success' => false,
        //             'message' => 'Name already exist in App'
        //         ));
        //         return;
        //     }
        // }

        if ($data['isAdmin'] != '0') {
            //$password = User::findOne(['isAdmin' => $data['isAdmin'], 'password'=> $data['password']]);
            $password = User::findOne(['password'=> sha1($data['password'])]);
            if($password) {
                echo json_encode(array(
                    "success" => false,
                    "message" => 'Passcode already exists. Please, try a different passcode'
                ));
                return;
            }
        }

        $model = new User;
        $model->studentId = isset($data['studentId']) ? $data['studentId'] : '';
        // If studentId is not set then set name as studentID
        // if (isset($data['studentID'])){
        //     $model->studentId = $data['studentId'];
        // }
        // else {
        //     $model->studentId = $data['name'];
        // }
        $model->name = $data['name'];
        $model->password = isset($data['password']) ? sha1($data['password']) : '';
        $model->email = isset($data['email']) ? $data['email'] : '';
        $model->gender = isset($data['gender']) ? $data['gender'] : '';
        $model->maritalStatus = isset($data['maritalStatus']) ? $data['maritalStatus'] : '';
        $model->nationality = isset($data['nationality']) ? $data['nationality'] : '';
        $model->dob = isset($data['dob']) ? $data['dob'] : '';
        $model->category = isset($data['category']) ? $data['category'] : '';
        if(isset($data['dob'])) {
            $model->age = $this->calculateAge($data['dob']);
        }
        if(isset($data['isAdmin'])){
            $model->isAdmin = $data['isAdmin'];
        } else {
            $model->isAdmin = 0;
        }
        //$model->isAdmin = isset($data['isAdmin']) ? $data['isAdmin'] : 0;
        $model->photo = isset($data['photo']) ? $data['photo'] : '';
        $model->passport = isset($data['passport']) ? $data['passport'] : '';
        $model->emirates = isset($data['emirates']) ? $data['emirates'] : '';
        $model->status = TRUE;

        if ($model->save()) {
            echo json_encode(array(
                'success' => true,
                'message' => 'Done'
            ));
        } else {
            echo json_encode(array(
                'success' => false,
                'message' => 'Unable to create account for this Student'
            ));
        }
        return;
    }


    public function actionLanguage() {
        $data = Yii::$app->user->getId();
        $model = User::find()->where('id='.$data)->one();
        $model->language = Yii::$app->request->post('code');
        $result = $model->update();
        if ($result) {
            echo json_encode(array(
                'success' => true,
                'message' => 'User details updated.'
            ));
        } else {
            echo json_encode(array(
                'success' => false,
                'message' => 'User details already updated.'
            ));
        }
        return;
    }

    public function actionLogs() {
        $rows = Usersession::find()->all();
        $admins = User::find()->where('isAdmin != 0')->all();
        $students = User::find()->where('isAdmin = 0')->all();
        $result = array();
        $log = array();
        $adminarr = array();
        $studentarr = array();
        foreach($rows as $row){
            array_push($log, $row->attributes);
        }
        foreach($students as $student){
            array_push($studentarr, $student->attributes);
        }
        foreach($admins as $admin){
            array_push($adminarr, $admin->attributes);
        }
        rsort($log);
        array_push($result, $log);
        array_push($result, $studentarr);
        array_push($result, $adminarr);
		echo json_encode(array(
			'success' => true,
			'log' => $log,
            'student' => $studentarr,
            'admin' => $adminarr
		));
		return;
    }
    public function actionClearinsruction(){
        $show_instruction = Yii::$app->request->get('show_instruction');
        if ($show_instruction == 0){
            $show_instruction = 1;
        } else {
            $show_instruction = 0;
        }
        $user_id = Yii::$app->request->get('id');
        $row = User::findOne(['id' => $user_id]);
        $row->show_instruction = $show_instruction;
        $row->update();
    }
}
