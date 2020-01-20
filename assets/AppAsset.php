<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */

namespace app\assets;

use yii\web\AssetBundle;

/**
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
class AppAsset extends AssetBundle
{
    public $basePath = '@webroot/app_v1/assets';
    public $baseUrl = '@web/app_v1/assets';
    public $css = [
        // vendor files
        'css/bootstrap.min.css',
        'fonts/css/font-awesome.min.css',
        'css/animate.min.css',

        // custom plugin styles
        // 'css/custom.css',
        'css/icheck/flat/green.css',
        'vendor/ngImgCrop/compile/unminified/ng-img-crop.css',

        // Animation
        'css/animate.css'
    ];
    public $js = [
    ];
    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
