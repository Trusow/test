(function() {
    function getPath() {
        return location.href.split( '?' )[0];
    }

    function getCSRF() {
        var csrf_name = document.querySelectorAll( '[name="csrf-param"]' );
        if( csrf_name.length == 0 ) {
            return false;
        }
        var csrf_name_str = csrf_name[0].content;
        var csrf_token = document.querySelectorAll( '[name="csrf-token"]' );
        var csrf_token_str = csrf_token[0].content;
        return {
            name: csrf_name_str,
            val: csrf_token_str,
        }
    }
    var global_csrf = getCSRF();

    function getDocs( data ) {
        axios( getPath() + '?r=docs/get' )
        .then( function(response) {
            data.status.load = false;
            data.docs = response.data;
        })
        .catch( function(error) {
            data.status.load = false;
            data.status.err_load = true;
        });
    }

    function add( data, title, body ) {
        data.status.process = true;
        data.status.err_add = false;
        var send_data = new URLSearchParams();
        send_data.append( 'title', title );
        send_data.append( 'body', body );
        if( global_csrf !== false ) {
            send_data.append( global_csrf.name, global_csrf.val );
        }
        axios.post( getPath() + '?r=docs/add', send_data )
        .then( function(response) {
            var info = data.info_add;
            if( !isNaN(parseFloat(response.data)) && isFinite(response.data) ) {
                data.docs.push( { id: response.data, title: info.title, body: info.body } );
                info.title = '';
                info.body = '';
                info.empty_title = false;
                info.empty_body = false;
                data.status.process = false;
            } else {
                data.status.err_add = true;
                data.status.process = false;
            }
        })
        .catch( function(error) {
            data.status.err_add = true;
            data.status.process = false;
        });
    }

    function edit( data, doc ) {
        data.status.process = true;
        data.status.err_save = false;
        var send_data = new URLSearchParams();
        send_data.append( 'id', doc.id );
        send_data.append( 'title', doc.title );
        send_data.append( 'body', doc.body );
        if( global_csrf !== false ) {
            send_data.append( global_csrf.name, global_csrf.val );
        }
        axios.put( getPath() + '?r=docs/edit', send_data )
        .then( function(response) {
            var info = data.info_edit;
            if( response.data == 'ok' ) {
                info.mode = false;
                info.empty_title = false;
                info.empty_body = false;
                data.status.process = false;
                info.id = 0;
            } else {
                data.status.err_save = true;
                data.status.process = false;
            }
        })
        .catch( function(error) {
            data.status.err_save = true;
            data.status.process = false;
        });
    }

    function remove( data, doc_id ) {
        if( confirm( 'Точно удалить?' ) ) {
            data.info_del.id = doc_id;
            data.status.err_delete = false;
            var pos = -1;
            for( var i_doc = 0; i_doc < data.docs.length; i_doc++ ) {
                if( data.docs[i_doc].id == doc_id ) {
                    pos = i_doc;
                }
            }
            if( pos != -1 ) {
                var send_data = new URLSearchParams();
                send_data.append( 'id', doc_id );
                if( global_csrf !== false ) {
                    send_data.append( global_csrf.name, global_csrf.val );
                }
                console.log( send_data );
                axios.post( getPath() + '?r=docs/del', send_data )
                .then( function(response) {
                    data.docs.splice( pos, 1 );
                    data.info_del.id = 0;
                })
                .catch( function(error) {
                    data.status.err_delete = true;
                });
            }
        }
    }

    var app = new Vue({
        el: '#docs',
        data: {
            info_edit: {
                id: 0,
                mode: false,
                empty_title: false,
                empty_body: false,
            },
            info_add: {
                title: '',
                body: '',
                empty_title: false,
                empty_body: false,
            },
            info_del: {
                id: 0,
            },
            docs: [],
            status: {
                load: true,
                process: false,
                err_add: false,
                err_load: false,
                err_save: false,
                err_delete: false,
            }
        },
        mounted: function() {
            var data = getDocs( this );
        },
        directives: {
            focus: {
                update: function( el, val ) {
                    if( val.value == true ) {
                        el.focus();
                    }
                }
            }
        },
        methods: {
            show_edit: function( doc_id ) {
                this.info_edit.id = doc_id;
                this.info_edit.mode = true;
                this.status.err_save = false;
            },
            save: function( doc_id, doc ) {
                if( doc.title != '' && doc.body != '' ) {
                    edit( this, doc );
                } else if( doc.title == '' ) {
                    this.info_edit.empty_title = false;
                    this.info_edit.empty_title = true;
                } else {
                    this.info_edit.empty_body = false;
                    this.info_edit.empty_body = true;
                }
            },
            remove: function( doc_id ) {
                remove( this, doc_id );
            },
            add: function() {
                var info = this.info_add;
                if( info.title != '' && info.body != '' ) {
                    add( this, info.title, info.body );
                } else if( info.title == '' ) {
                    info.empty_title = false;
                    info.empty_title = true;
                } else {
                    info.empty_body = false;
                    info.empty_body = true;
                }
            }
        }
    });
})();
