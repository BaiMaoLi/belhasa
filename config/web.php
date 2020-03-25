
<?php
/* web configurations */

// App variables
if (YII_ENV === 'dev') {
    defined('YII_DEBUG') or define('YII_DEBUG', false);
}

// required files
$params = require(__DIR__ . '/env/dev.php');

// configs
$config = array(
    'id' => $params['app']['id'],
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'components' => array()
);

// request config
$config['components']['request'] = array(
    'cookieValidationKey' => $params['app']['id'],
    'parsers' => [
        'application/json' => 'yii\web\JsonParser', // required for POST input via `php://input
    ]
);

// cache
// $config['components']['cache'] = array(
//     'class' => 'yii\caching\FileCache'
// );

// user
$config['components']['user'] = array(
    'identityClass' => 'app\models\User',
    'enableAutoLogin' => true,
    'enableSession' => true
);

// errorHandler
$config['components']['errorHandler'] = array(
    'errorAction' => 'site/error',
);

// logs
$config['components']['log'] = array(
    'traceLevel' => YII_DEBUG ? 3 : 0,
    'targets' => [
        [
            'class' => 'yii\log\FileTarget',
            'levels' => ['error', 'warning'],
        ],
    ],
);

// assets
$config['components']['assetManager'] = array(
    'bundles' => array(
        'yii\bootstrap\BootstrapAsset' => false
    )
);

// databaase connection
$config['components']['db'] = $params['db'];

// urlmanager
$config['components']['urlManager'] = array(
    'enablePrettyUrl' => true,
    'showScriptName' => false,
    'rules' => [
        '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
        'api/<controller:\w+>/<action:\w+>' => '<controller>/<action>'
    ],
);

// sessions
$config['components']['session'] = array(
    'class' => 'yii\web\DbSession'
);

$config['components']['mail'] = [
    'class'            => 'zyx\phpmailer\Mailer',
    'useFileTransport' => false,
    'config'           => [
        'mailer'     => 'smtp',
        'host'       => 'smtp.gmail.com',
        'port'       => '465',
        'smtpsecure' => 'ssl',
        'smtpauth'   => true,
        'username'   => 'karthi.m@cloudmaxis.com',
        'password'   => '9790055969',
    ],
];

// app params
$config['params'] = $params;
$config['components']['defaultMail'] = $params['defaultMail'];

// Configuration adjustments for Development Environments
if (YII_ENV_DEV) {
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
    ];
}

ini_set('session.gc_maxlifetime', 86400);

// view configurations
/*
echo '<pre>';
print_r($config);
exit(0);
*/
return $config;
?>
