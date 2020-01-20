<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "questions_translations".
 *
 * @property integer $id
 * @property integer $questionid
 * @property string $languageCode
 * @property string $question
 */
class QuestionsTranslations extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'questions_translations';
    }

    /**
     * @inheritdoc
     */
    // public function rules()
    // {
    //     return [
    //         [['questionid', 'languageCode', 'question'], 'required'],
    //         [['questionid'], 'integer'],
    //         [['question'], 'string'],
    //         [['languageCode'], 'string', 'max' => 50]
    //     ];
    // }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'questionid' => 'Questionid',
            'languageCode' => 'Language Code',
            'question' => 'Question',
        ];
    }
}
