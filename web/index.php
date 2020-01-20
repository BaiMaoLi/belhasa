<?php

// comment out the following two lines when deployed to production
defined('YII_ENV') or define('YII_ENV', 'dev'); // 'prod'

require(__DIR__ . '/../vendor/autoload.php');
require(__DIR__ . '/../vendor/yiisoft/yii2/Yii.php');

$config = require(__DIR__ . '/../config/web.php');

Yii::error('Error');
(new yii\web\Application($config))->run();
