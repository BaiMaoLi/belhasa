<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "usersession".
 *
 * @property integer $id
 * @property string $sid
 * @property string $name
 * @property string $login_time
 */
class Usersession extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'usersession';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['sid', 'name', 'adminid'], 'required'],
            [['sid', 'name'], 'string'],
            [['login_time'], 'safe'],
            [['adminid'], 'string', 'max' => 100]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'sid' => 'Sid',
            'name' => 'Name',
            'login_time' => 'Login Time',
        ];
    }
}
