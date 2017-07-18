<?php

namespace app\controllers;

use yii\web\Controller;
use app\models\Documents;
use Yii;

class DocsController extends Controller
{

    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => \yii\filters\VerbFilter::className(),
                'actions' => [
                    'index' => ['get'],
                    'get' => ['get'],
                    'add' => ['post'],
                    'edit' => ['put'],
                    'del' => ['post'],
                ],
            ],
        ];
    }

    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
        ];
    }

    public function actionIndex() {
        return $this->render('index');
    }

    public function actionGet() {
        $items = Documents::find()->all();
        $ret_arr = [];
        foreach( $items as $item ) {
            $ret_arr[] = [
                'id' => $item->ID,
                'title' => $item->title,
                'body' => $item->body,
            ];
        }
        die( json_encode( $ret_arr ) );
    }

    public function actionAdd() {
        $post = Yii::$app->request->post();
        if( isset( $post['title'] ) && isset( $post['body'] ) ) {
            $model = new Documents();
            $model->title = $post['title'];
            $model->body = $post['body'];
            $model->save();
            echo $model->getPrimaryKey();
            die();
        } else {
            die( 'err' );
        }
    }

    public function actionEdit() {
        $put = Yii::$app->request->post();
        if( isset( $put['title'] ) && isset( $put['body'] ) && isset( $put['id'] ) ) {
            $model = Documents::findOne($put['id']);
            $model->title = $put['title'];
            $model->body = $put['body'];
            $model->save();
            die( 'ok' );
        } else {
            die( 'err' );
        }
    }

    public function actionDel() {
        $del = Yii::$app->request->post();
        if( isset( $del['id'] ) ) {
            $model = Documents::findOne($del['id']);
            $model->delete();
            die( 'ok' );
        }
    }

}
