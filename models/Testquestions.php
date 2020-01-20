<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "testquestions".
 *
 * @property integer $id
 * @property integer $questionid
 * @property integer $input
 * @property integer $status
 */
class Testquestions extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'testquestions';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['questionid', 'input'], 'required'],
            [['questionid', 'input'], 'integer']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'questionid' => 'Questionid',
            'input' => 'Input',
            'status' => 'Status',
        ];
    }
}
