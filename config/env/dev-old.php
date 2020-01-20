<?php
/**
 * environment:dev
 */

return array(
	'app' => array(
		'id' => 'testing_app',
		'cookieKey' => 'app_belhasa',
	),
	'db' => array(
		'class' => 'yii\db\Connection',
		'dsn' => 'mysql:host=localhost;dbname=production',
		'username' => 'root',
		'password' => 'RGeG%(D)w7)0',
		'charset' => 'utf8',
	),
	'email' => array(
		'from' => 'info@mytest.com',
		'credentials' => array(
			'username' => 'demo',
			'password' => 'demo@123',
		),
	),
	'defaultMail' => "itsupport@saifbelhasagroup.com",
);

?>
