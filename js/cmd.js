var cmdTxt='';
//String.prototype.trim = function() {
//    return this.replace(/^\s\s*/, '');
//}


// 自动获取焦点
$('.panel-shell').click(function(){
    (function(obj){
        setTimeout(function(){
            if( obj.find('input:last').length >= 1 ){
                obj.find('input:last')[0].focus();
            }
        },2000)
    })($(this))
})

// 页面切换到 控制台操作
$(document).on('click','.all_con',function(){

    var this_input = $(this).parents('form').find('.cmd_box');
    this_input.html('');
    // 多个控制台切换 还原历史操作
    ConsoleCommand.restore_cmd( this_input );


    // 当前控制台 没有命令行 则创建一个
    if( this_input.find('input:last').length == 0 ){
        ConsoleCommand.create_input_command( this_input )
    }else{
    // 获得焦点
        setTimeout(function(){
            this_input.find('input:last')[0].focus();
        },100)
    }
})

// 命令行 键盘事件
$(document).on( 'keydown' , '.cmd_input',function( event ){
    var element = current_element();

    // 回车发送命令
    if( event.keyCode == 13 ){
        var obj = $(this).parents('.cmd_box');
        // 命令
        var command = $(this).val();

        // 历史命令
        if( command == 'history' ){
            ConsoleCommand.history( obj )
            return;
        }

        // 执行命令
        ConsoleCommand.exec( command ,obj );
        $(this).parent().html( command );
    }

    // 上
    if( event.keyCode == 38 ){

        if( !element.history_command ){
            element.history_command=[];
        }
        // 历史命令=0
        if( element.history_command.length == 0 ){
            return ;
        }

        // 历史命令是否到第一个
        if( ConsoleCommand.history_command_top == true ){
            return;
        }

        // 初始历史命令长度
        if( ConsoleCommand.history_command_index == -1 ){
            ConsoleCommand.history_command_index = element.history_command.length
        }

        // 当前索引
        var index = ConsoleCommand.history_command_index-1;

        // 如果等于-1 到了第一个命令
        if( index == -1 ){
            ConsoleCommand.history_command_top = true;
            return;
        }

        // 设置索引
        ConsoleCommand.history_command_index = index;

        // 恢复命令
        $(this).val( element.history_command[index] );
    }
    // 下
    if( event.keyCode == 40 ){

        // 按下 就不是第一个命令
        ConsoleCommand.history_command_top = false;

        // 为初始化
        if( ConsoleCommand.history_command_index == -1 ){
            return;
        }

        // 索引长度=命令长度 最后一个命令
        if( ConsoleCommand.history_command_index == element.history_command.length ){
            return;
        }

        var index = ConsoleCommand.history_command_index+1;
        ConsoleCommand.history_command_index++;

        $(this).val( element.history_command[index] );
    }
})
// 汇车等待提示符时
$(document).on( 'keypress' , '.cmd_wait',function( event ){
    if( event.keyCode == 13 ){
        var obj = $(this).parents('.cmd_box');
        $(this).parent().html('　');
        ConsoleCommand.create_input_wait( obj , 1 );
    }
})

// 关闭页面弹窗 停止后续的请求
$("[id^=modal-btn-]").click(function(){
    var this_input = $(this).parents('form').find('.cmd_box');
    ConsoleCommand.close( this_input );
});

// 命令对象
var ConsoleCommand = {
    command_id : 0,
    ctrl_c:0,
    history_command_index:-1,
    history_command_top:false,
    setTimeout:[],
    add_command:function( command ){
        var element = current_element();
        if( !element.net_command ){
            element.net_command=[];
        }
        this.command_id++;

        element.net_command.push({
            'id':this.command_id,
            'type':'command',
            'info':command
        })


        if( !element.history_command ){
            element.history_command=[];
        }
        if( command ){
            element.history_command.push(
                command
            )
        }

    },
    add_wait:function(){
        var element = current_element();
        if( !element.net_command ){
            element.net_command=[];
        }
        element.net_command.push({
            'type':'wait',
            'info':''
        })
    },
    add_response:function( str ){
        var element = current_element();
        if( !element.net_command ){
            element.net_command=[];
        }
        element.net_command.push({
            'type':'response',
            'info':str
        })
    },
    exec:function( command , obj , on ){

        // 命令开启状态
        ConsoleCommand.ctrl_c = 0;

        if( !on ){
            // 记录命令
            this.add_command( command );
        }

        // 判断命令如果为空
        if( !command ){
            ConsoleCommand.create_input_command( obj )
            return;
        }
        var element = current_element();

        // 创建等待提示符
        this.create_input_wait( obj )

        var data = {
            "topo_name_id": $("#current_topo_id").val(),
            "dev_name": element.element_id,
            "cmd_status": "on",
            "cmd_id": "c_"+this.command_id,
            "cmd": command
        }

        $.getJSON(window_topo_web_path+'/topo_manage/topo_manage/exec_cmd?callback=?',data,function(msg){

            if( msg && msg.retCode==0 || msg.retCode==10){

                if( msg.cmd_result ){

                    if( msg.cmd_result.length > 0 ){
                        // 移除等待提示符
                        obj.find('.cmd_wait').remove();
                    }

                    for( i =0 ;i<msg.cmd_result.length ; i++ ){
                        // 打印消息
                        ConsoleCommand.add_response( msg.cmd_result[i].info );
                        // 记录消息
                        ConsoleCommand.create_info( msg.cmd_result[i].info ,obj )
                    }
                }
                // 判断是否有后续命令，并且是否可以继续请求
                if( msg.retCode==10 && ConsoleCommand.ctrl_c == 0 ){

                    if( obj.find('.cmd_wait').length > 0 ){
                        obj.find('.cmd_wait').remove();
                        console.log(1)
                    }
                    if( obj.find('.cmd_wait').length == 0 ){
                        // 创建等待提示符
                        ConsoleCommand.create_input_wait( obj )
                    }


                    (function( command , obj ){
                        var t = setTimeout(function(){
                            ConsoleCommand.exec( command, obj , 1 );
                        },900)
                        ConsoleCommand.setTimeout.push( t )
                    })( command ,obj )

                }

                // 判断返回结果是否返回完毕
                if( msg.retCode==0 ){
                    if(  msg.cmd_result.length == 0 ){
                        obj.find('.cmd_wait').remove();
                    }
                    ConsoleCommand.create_input_command( obj )
                }

            }else{
                // 移除等待提示符
                obj.find('.cmd_wait').remove();
                var  tis = 'Error: command failed'
                if( msg && msg.retMsg ){
                    tis = msg.retMsg;
                }
                // 打印消息
                ConsoleCommand.create_info( tis , obj )
                // 记录消息
                ConsoleCommand.add_response( tis );
                // 创建命令行
                ConsoleCommand.create_input_command( obj )
            }
        }).error(function(){
            // 移除等待提示符
            obj.find('.cmd_wait').remove();
            var  tis = 'Error: command failed'
            // 打印消息
            ConsoleCommand.create_info( tis , obj )
            // 记录消息
            ConsoleCommand.add_response( tis );
            // 创建命令行
            ConsoleCommand.create_input_command( obj )
        })

    },
    // 创建消息

    create_info:function( str,obj ){
        var p = '<pre class="shell_content_info" >'+str+'</pre>';
        obj.append( p )
    },
    // 创建新命令行
    create_input_command:function( obj ){
        var element = current_element();
        var name = element.text + "#";
        var str = '<p><span class="prompt">'+name+'</span><span class="left_jing"><input class="cmd_input" name="cmd_shell" type="text" spellcheck="false" data-options="required:true" autocomplete="off" /></span></p>';
        obj.append( str )

        setTimeout(function(){
            obj.find('input:last')[0].focus();
        },100)

        // 还原参数
        this.history_command_index = -1;
        this.history_command_top = false;
    },
    // 创建等待提示符
    create_input_wait:function( obj , insert ){
        // 手动出发 记录命令
        if( insert == 1 ){
            this.add_wait();
        }
        var str = '<p><input class="cmd_wait"  onkeyup="value=value.replace(/.*/g,\'\')" onbeforepaste="clipboardData.setData(\'text\',clipboardData.getData(\'text\').replace(/.*/g,\'\'))" name="cmd_shell" type="text" spellcheck="false" data-options="required:true" autocomplete="off" /></p>';
        obj.append( str )

        setTimeout(function(){
            obj.find('input:last')[0].focus();
        },100)
    },
    // 历史命令
    history:function( obj ){
        var element = current_element();
        for( var i = 0;i<element.history_command.length;i++ ){
            ConsoleCommand.add_response( element.history_command[i] );
            ConsoleCommand.create_info( element.history_command[i] ,obj )
        }
        ConsoleCommand.create_input_command( obj )
    },
    // 多终端还原数据
    restore_cmd:function( obj ){
        var element = current_element();
        if( element.net_command && element.net_command.length > 0 ){
            // 先清空控制台
            for( var i=0;i<element.net_command.length;i++ ){
                var name = element.text + "#";
                if( element.net_command[i].type == 'command' ){
                    var p = '<p><span class="prompt">'+name+'</span><span class="left_jing">'+element.net_command[i].info+'</span></p>';
                }
                if( element.net_command[i].type == 'response' ){
                    var p = '<p class="shell_content_info" >'+element.net_command[i].info+'</p>';
                }
                if( element.net_command[i].type == 'wait' ){
                    var p = '<p>'+element.net_command[i].info+'</p>';
                }
                obj.append( p )
            }
            // 创建命令行
            this.create_input_command( obj )
        }
    },
    close:function( obj ){
        ConsoleCommand.ctrl_c = 1;
        obj = obj.parents('form').find('.cmd_box')
        obj.find('.cmd_wait').remove();
        ConsoleCommand.create_input_command( obj )
        if( ConsoleCommand.setTimeout ){
            for( var i=0;i<=ConsoleCommand.setTimeout.length;i++ ){
                clearTimeout( ConsoleCommand.setTimeout[i] )
            }
        }
    }
}

// Ctrl+C对象
var HotKeyHandler={
    currentMainKey:null,
    currentValueKey:null,
    Init:function(){
        HotKeyHandler.Register(0,"C",function( obj ){
            ConsoleCommand.close( obj )
        });
    },
    Register:function(tag,value,func){
        var MainKey="";
        switch(tag){
            case 0:
                MainKey=17; //Ctrl
                break;
            case 1:
                MainKey=16; //Shift
                break;
            case 2:
                MainKey="18"; //Alt
                break;
        }
        $(document).on('keyup','.cmd_wait,.cmd_input',function(event){
            HotKeyHandler.currentMainKey=null;
        })
        $(document).on('keydown','.cmd_wait,.cmd_input',function(event){
            //获取键值
            var keyCode= event.keyCode ;
            var keyValue = String.fromCharCode(event.keyCode);

            if(HotKeyHandler.currentMainKey!=null){
                if(keyValue==value){
                    HotKeyHandler.currentMainKey=null;
                    if(func!=null)func($(this));
                }
            }
            if(keyCode==MainKey)
                HotKeyHandler.currentMainKey=keyCode;
        })

    }
}
HotKeyHandler.Init()



