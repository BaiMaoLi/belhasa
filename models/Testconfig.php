<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "testconfig".
 *
 * @property integer $id
 * @property string $name
 * @property string $category
 * @property integer $noofquestion
 * @property integer $reqnoofanswer
 * @property integer $noofspecificquestion
 * @property integer $noofcommonquestion
 * @property integer $noofreqspecificanswer
 * @property integer $noofreqcommonanswer
 * @property integer $duration
 */
class Testconfig extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'testconfig';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['noofquestion', 'reqnoofanswer', 'duration'], 'integer'],
            [['name'], 'string', 'max' => 100],
            [['category'], 'string', 'max' => 50]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'testcategory' => 'Testcategory',
            'category' => 'Category',
            'noofquestion' => 'Noofquestion',
            'reqnoofanswer'=> 'Reqnoofanswer',
            'noofspecificquestion'=>'Reqnospecificquestion',
            'noofcommonquestion'=>'Reqnocommonquestion',
            'noofreqspecificanswer' => 'Noofreqspecificanswer',
            'noofreqcommonanswer' => 'Noofreqcommonanswer',
            'duration' => 'Duration',
        ];
        
    }

}

