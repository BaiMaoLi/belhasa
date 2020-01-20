<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;

AppAsset::register($this);
?>

<?php $this->beginPage() ?>

<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
      <!-- <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min.css"> -->
      <link rel="stylesheet" href="/app_v1/assets/css/angular-material.css">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?= Html::csrfMetaTags() ?>

    <title><?= Html::encode($this->title) ?></title>
    <style>
        .cropArea {
            background: #E4E4E4;
            overflow: hidden;
            padding-top: 20px;
            width:320px;
            height:320px;
        }
        .test-option {
            padding-top: 10px;
            padding-bottom: 5px;
            font-size: 20px;
            cursor: pointer;
        }
        .test-option i{
            font-size: 30px;
        }
        .test-option label{
            cursor: pointer;
        }
        .modal-lg {
            width: 100% !important;
        }
        .modal-dialog {
            margin: 0px 0px !important;
        }
    </style>

    <?php $this->head() ?>
    <link id="ltr" rel="stylesheet" href="/app_v1/assets/css/custom.css">
    <link id="rtl" rel="stylesheet" href="/app_v1/assets/css/custom_rtl.css">
    <link id="rtl2" rel="stylesheet" href="/app_v1/assets/css/bootstrap-rtl.css">
    <script>
        var script = document.createElement('script');
        var lang = localStorage.getItem('user_lang');
        if (lang == 'ar-ar' || lang == 'fa-fa' || lang == 'ur-ur'){
            // post your code
            document.getElementById("ltr").disabled=true;
        } else {
            document.getElementById("rtl").disabled=true;
            document.getElementById("rtl2").disabled=true;
        }
    </script>
</head>

<body  style="background:#F7F7F7;" class='nav-md'>

<?php $this->beginBody() ?>
    <!-- Body content -->
    <?= $content ?>

    <!-- Script Section -->
    <script type="text/javascript">
        var module = 'TestingApp';
        var csrf = '<?=Yii::$app->request->getCsrfToken()?>';
    </script>

    <!-- Angular Material popup plugins -->
    <!--<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>-->
    <!--<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-animate.min.js"></script>-->
    <!--<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-aria.min.js"></script>-->
    <!--<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular-messages.min.js"></script>-->
    <!--<script src="http://ajax.googleapis.com/ajax/libs/angular_material/1.0.0/angular-material.min.js"></script>-->

    <!-- vendor files -->
    <script type="text/javascript" src='app_v1/assets/vendor/jquery.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/bootstrap.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/nprogress.js'></script>


    <script type="text/javascript" src='app_v1/assets/vendor/angular/angular.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/ui-bootstrap-tpls-1.2.5.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/angular-ui-router/release/angular-ui-router.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/bower-angular-translate-2.9.0.1/angular-translate.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/bower-angular-translate-loader-static-files-master/angular-translate-loader-static-files.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/ngImgCrop/compile/unminified/ng-img-crop.js'></script>

    <script type="text/javascript" src='app_v1/assets/vendor/angular-animate.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/angular-aria.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/angular-messages.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/angular-material.min.js'></script>

    <!-- Export Excel -->
    <script type="text/javascript" src='app_v1/assets/vendor/alasql.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/xlsx.core.min.js'></script>

    <!-- Export PDF -->
    <script type="text/javascript" src='app_v1/assets/vendor/jspdf.min.js'></script>
    <script type="text/javascript" src='app_v1/assets/vendor/jspdf.plugin.autotable.js'></script>



    <!-- app files -->
    <script type="text/javascript" src='app_v1/app.js'></script>
    <script type="text/javascript" src='app_v1/controllers/loading.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/login.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/customize.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/home.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/header.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/topics.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/question.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/upload.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/profile.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/admin_students.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/test.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/result.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/logs.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/instruction.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/resumetest.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/reports.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/review.controller.js'></script>
    <script type="text/javascript" src='app_v1/controllers/category.controller.js'></script>
    <script type="text/javascript">
        NProgress.done();
    </script>

<?php $this->endBody() ?>

</body>
</html>

<?php $this->endPage() ?>
