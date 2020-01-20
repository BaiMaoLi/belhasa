<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "topicarea".
 *
 * @property integer $id
 * @property string $name
 * @property string $name_ta
 * @property string $name_ar
 * @property string $name_ur
 * @property string $name_hi
 * @property string $name_be
 * @property string $name_ma
 * @property string $name_fa
 * @property string $name_ch
 * @property string $name_ru
 * @property integer $status
 */
class Topicarea extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'topicarea';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['name'], 'string'],
            [['status'], 'integer']
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
            'name_ta' => 'Name_ta',
            'name_ar' => 'Name_ar',
            'name_ur' => 'Name_ur',
            'name_hi' => 'Name_hi',
            'name_be' => 'Name_be',
            'name_ma' => 'Name_ma',
            'name_fa' => 'Name_fa',
            'name_ch' => 'Name_ch',
            'name_ru' => 'Name_ru',
            'status' => 'Status',
        ];
    }
}
