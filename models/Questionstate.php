<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "questionstate".
 *
 * @property integer $id
 * @property integer $user_id
 * @property integer $question_id
 * @property string $category
 */
class Questionstate extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'questionstate';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'question_id', 'category'], 'required'],
            [['user_id', 'question_id'], 'integer'],
            [['category'], 'string', 'max' => 100]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'user_id' => 'User ID',
            'question_id' => 'Question ID',
            'category' => 'Category',
        ];
    }
}
