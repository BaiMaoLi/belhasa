<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "questions".
 *
 * @property integer $id
 * @property string $answer
 * @property string $created
 */
class Questions extends \yii\db\ActiveRecord
{
    /*
    *@inheritdoc
    */
    public static function tableName()
    {
        return 'questions';
    }

    /*
     *@inheritdoc
    */
    public function rules()
    {
        return [
            [['answer'], 'required'],
            [['answer'], 'string'],
            [['created'], 'safe']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'answer' => 'Answer',
            'created' => 'Created',
            'photo' => 'Photo',
            'audio' => 'Audio',
            'choice1photo' => 'Choice1photo',
            'choice2photo' => 'Choice2photo',
            'choice3photo' => 'Choice3photo'
        ];
    }
}
