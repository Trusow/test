<?php

$this->registerJsFile( Yii::$app->request->baseUrl . '/js/axios.min.js');
$this->registerJsFile( Yii::$app->request->baseUrl . '/js/vue.min.js');
$this->registerJsFile( Yii::$app->request->baseUrl . '/js/docs/docs.js');
$this->registerCssFile( Yii::$app->request->baseUrl . '/css/docs/docs.css');

?>

<div id="docs" v-cloak>

    <div class="docs_body">
        <div v-for="doc in docs" class="docs_item" :class="{ docs_item_edit: info_edit.mode && doc.id == info_edit.id }">
            <div v-show="info_edit.mode && doc.id == info_edit.id">
                <input class="form-control docs_input" type="text" placeholder="Название документа" v-model="doc.title" v-focus="info_edit.empty_title">
                <textarea class="form-control docs_input" placeholder="Содержание документа" v-model="doc.body" v-focus="info_edit.empty_body"></textarea>
            </div>
            <div v-show="doc.id != info_edit.id">
                <div class="docs_item_title">
                    {{ doc.title }}
                </div>
                <div class="docs_item_body">
                    {{ doc.body }}
                </div>
            </div>
            <div v-if="status.err_save && doc.id == info_edit.id" class="docs_err">
                Ошибка сохранения документа
            </div>
            <div v-if="status.err_delete && doc.id == info_del.id" class="docs_err">
                Ошибка удаления документа
            </div>
            <div class="docs_item_buttons">
                <button @click="show_edit(doc.id)" v-show="doc.id != info_edit.id" class="btn btn-default">Редактировать</button>
                <button @click="save(doc.id, doc)" v-show="info_edit.mode && doc.id == info_edit.id" class="btn btn-success" :disabled="status.process">Сохранить</button>
                <button class="btn btn-danger docs_remove_button" @click="remove(doc.id)" :disabled="status.process">Удалить</button>
            </div>
        </div>
        <div v-show="status.load" class="docs_empty">
            Загрузка документов
        </div>
        <div v-show="docs.length == 0 && !status.load && !status.err_load" class="docs_empty">
            Документов не найдено
        </div>
        <div v-if="status.err_load" class="docs_err">
            Ошибка получения данных
        </div>
    </div>
    
    <div class="docs_add_block">
        <div v-if="status.err_add" class="docs_err">
            Ошибка добавления документа
        </div>
        <input class="form-control docs_input" type="text" placeholder="Название документа" v-model="info_add.title" v-focus="info_add.empty_title">
        <textarea class="form-control docs_input" placeholder="Содержание документа" v-model="info_add.body" v-focus="info_add.empty_body"></textarea>
        <button type="button" class="btn btn-primary" @click="add()" :disabled="status.process">Добавить</button>
    </div>
</div>
