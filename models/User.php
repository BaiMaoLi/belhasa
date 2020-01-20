<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "user".
 *
 * @property integer $id
 * @property string $firstName
 * @property string $lastName
 * @property string $email
 * @property string $photo
 * @property string $gender
 * @property string $nationality
 * @property string $dob
 * @property integer $age
 * @property string $maritalStatus
 * @property string $password
 * @property string $confirmPassword
 */
class User extends \yii\db\ActiveRecord implements \yii\web\IdentityInterface {
	/**
	 * @inheritdoc
	 */
	public static function tableName() {
		return 'user';
	}

	/**
	 * @inheritdoc
	 */
	// public function rules()
	// {
	//     return [
	//         // [['firstName', 'lastName', 'email', 'photo', 'gender', 'nationality', 'dob', 'age', 'maritalStatus', 'password', 'confirmPassword'], 'required'],
	//         [['photo'], 'string'],
	//         [['dob'], 'safe'],
	//         [['age'], 'integer'],
	//         [['firstName', 'lastName'], 'string', 'max' => 150],
	//         [['email'], 'string', 'max' => 250],
	//         [['gender'], 'string', 'max' => 50],
	//         [['nationality'], 'string', 'max' => 75],
	//         [['maritalStatus'], 'string', 'max' => 40],
	//         [['password', 'confirmPassword'], 'string', 'max' => 100]
	//     ];
	// }

	/**
	 * @inheritdoc
	 */
	// public function attributeLabels()
	// {
	//     return [
	//         'id' => 'ID',
	//         'firstName' => 'First Name',
	//         'lastName' => 'Last Name',
	//         'email' => 'Email',
	//         'photo' => 'Photo',
	//         'gender' => 'Gender',
	//         'nationality' => 'Nationality',
	//         'dob' => 'Dob',
	//         'age' => 'Age',
	//         'maritalStatus' => 'Marital Status',
	//         'password' => 'Password',
	//         'confirmPassword' => 'Confirm Password',
	//     ];
	// }

	/**
	 * Finds an identity by the given ID.
	 *
	 * @param string|integer $id the ID to be looked for
	 * @return IdentityInterface|null the identity object that matches the given ID.
	 */
	public static function findIdentity($id) {
		return static::findOne($id);
	}

	/**
	 * Finds an identity by the given token.
	 *
	 * @param string $token the token to be looked for
	 * @return IdentityInterface|null the identity object that matches the given token.
	 */
	public static function findIdentityByAccessToken($token, $type = null) {
		return static::findOne(['access_token' => $token]);
	}

	/**
	 * @return int|string current user ID
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @return string current user auth key
	 */
	public function getAuthKey() {
		return $this->auth_key;
	}

	/**
	 * @param string $authKey
	 * @return boolean if auth key is valid for current user
	 */
	public function validateAuthKey($authKey) {
		return $this->getAuthKey() === $authKey;
	}
}
