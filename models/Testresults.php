<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "testresults".
 *
 * @property integer $id
 * @property integer $studentid
 * @property string $testdate
 */
class Testresults extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'testresults';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['studentid'], 'required'],
            [['studentid'], 'integer'],
            [['testdate'], 'safe']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'studentid' => 'Studentid',
            'testdate' => 'Testdate',
        ];
    }
}
