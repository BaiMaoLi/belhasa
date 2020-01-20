<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "question_choices".
 *
 * @property integer $id
 * @property integer $questionid
 * @property string $value
 */
class QuestionChoices extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'question_choices';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['questionid', 'value'], 'required'],
            [['questionid'], 'integer'],
            [['value'], 'string']
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
            'value' => 'Value',
        ];
    }
}
