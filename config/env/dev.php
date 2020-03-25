<?php
/**
 * environment:dev
 */

return array(
	'app' => array(
		'id' => 'testing_app',
		'cookieKey' => 'app_testing',
	),
	'db' => array(
		'class' => 'yii\db\Connection',
		'dsn' => 'mysql:host=127.0.0.1;dbname=production_origin',
		'username' => 'root',
		'password' => '',
		'charset' => 'utf8',
	),
	'email' => array(
		'from' => 'info@mytest.com',
		'credentials' => array(
			'username' => 'demo',
			'password' => 'demo@123',
		),
	),
	'defaultMail' => "karthi.m@cloudmaxis.com",
//	'baseUrl' => 'https://tecnicocerca.com/belhasa/web'
	'baseUrl' => 'http://localhost/belhasa/web'
);

?>
