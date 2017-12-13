
var alert_func={
     M:{},
    success:function (msg,time){
        if(this.M[msg]){
            return this.M[msg].show();
        }
        this.M[msg] = jqueryAlert({
            'icon'    : window_topo_static_path+'images/alert_right.png',
            'content' : msg,
            'closeTime' : time,
        })
    },
    error:function (msg,time){
        if(this.M[msg]){
            return this.M[msg].show();
        }
        this.M[msg] = jqueryAlert({
            'icon'    : window_topo_static_path+'images/alert_error.png',
            'content' : msg,
            'closeTime' : time,
        })
    },
    loading:function (msg){
        if(this.M['loading']){
            return this.M['loading'].show();
        }
        this.M['loading'] = jqueryAlert({
            'icon'    : window_topo_static_path+'images/timg.gif',
            'modal'   : true,
            'content' : msg,
            'closeTime' : 9999999,
            'className' : "loading",
        });
        $('.loading').css({'width':'152px','height':'144px','margin-left':'-72px','margin-top':'-76px'});
        $('.loading>.alert-content').css({'padding-top':'10px','background':'url('+window_topo_static_path+'images/timg.gif) -90px -56px / auto 260px no-repeat','color':'#6CCDFF','font-weight':'bold','font-family':'Noto Sans S Chinese','font-size':'16px','margin-top':'0px'});

    },
    sure:function(msg){
        if(this.M['msg']){
            return this.M['msg'].show();
        }
        this.M['msg'] = jqueryAlert({
            'content' : msg,
            'modal'   : true,
            'buttons' :{
                '确定' : function(){
                    this.M['msg'].close();
                    makeSure=true;
                },
                '取消' : function(){
                    this.M['msg'].close();
                }
            }
        })
    },
    close_loading:function(){
        $('.alert-modal,.alert-container').hide()
    },
    drag_return:function(){
        $('.modal_all_2_m').css({'position':'absolute','top':'50%','left':'50%','transform':'translate(-50%,-50%)'});
    }
}



var Ajax$ = {
    jsonp: function ( config ) {
        this.ajax('get','jsonp', config  )
    },
    post: function ( config ) {
        this.ajax('post','json', config )
    },
    get:function( config ){
        this.ajax('get','json', config )
    },
    ajax:function( type ,datatype,config  ){
        var ajax = {
            type    :type,
            url     :config.url,
            data    :config.data,
            dataType:datatype,
            timeout :2200
        }
        if( config.ok ){
            ajax.success = config.ok
        }
        if( config.error ){
            ajax.error = config.error
        }
        if( config.timeout ){
            ajax.timeout = config.timeout
        }
        $.ajax( ajax );
    }
}

$(function(){
    var data={};

    $(document).on('click','#para-host',function(){
        $(document).off('click','#para-host')
        Ajax$.jsonp({
            url:window_topo_web_path+'/topo_manage/topo_manage/master_dev_list?callback=?',
            data:data,
            ok:function(result){
                if( result){
                    var ggj='';
                    for (var lihh in result.dev_list){


                        var ggd=result.dev_list[lihh].interface;
                        if(ggd !== undefined)
                            ggj+=`<option value='${ggd}'>${ggd}</option>`
                    }
                    console.log(ggj)
                    $('#yun-allocation-szj').append(ggj).val(restore_topo_img_data.data.u378[0].netdata.data['yun-allocation-szj']);

                }else{
                    alert_func.error( '获取接口失败' , 1200)
                }
            },
            error:function(){
                alert_func.error( '获取接口失败' , 1200)
            }
        })
    })

    $('.drag-box-1 .drag').each(function(index){
        $(this).myDrag({
            direction:'x'
        });
    });
    $('.drag-box-2 .drag').each(function(index){
        $(this).myDrag({
            randomPosition:true,
            direction:'y',
            handler:false
        });
    });
    $('.drag-box-3 .drag').each(function(index){
        $(this).myDrag({
            randomPosition:true,
            direction:'all',
            handler:false
        });
    });
    $('.drag-box-4 .drag').each(function(index){
        $(this).myDrag({
            randomPosition:true,
            direction:'all',
            handler:'.handler'
        });
    });
    $('.drag-box-5 .drag').each(function(index){
        $(this).myDrag({
            parent:'.test',
            randomPosition:false,
            direction:'all'
        });
    });

    $('.drag-box-6 .drag').each(function(index){
        $(this).myDrag({
            dragStart:function(x,y){
                $('.lg span').html('').eq(0).html('开始拖动了! — 坐标 x：'+x+' y：'+y);
            },
            dragEnd:function(x,y){
                $('.lg span').html('').eq(1).html('停止拖动了! — 坐标 x：'+x+' y：'+y);
            },
            dragMove:function(x,y){
                $('.lg span').html('').eq(2).html('拖动中! — 坐标 x：'+x+' y：'+y);
            }
        });
    });
    //一级弹窗
    var Dragging=function(validateHandler){
        var draggingObj=null;
        var diffX=0;
        var diffY=0;

        function mouseHandler(e){
            switch(e.type){
                case 'mousedown':
                    draggingObj=validateHandler(e);
                    if(draggingObj!=null){
                        diffX=e.clientX-draggingObj.offsetLeft;
                        diffY=e.clientY-draggingObj.offsetTop;
                    }
                    break;

                case 'mousemove':
                    if(draggingObj){
                        draggingObj.style.left=(e.clientX-diffX)+'px';
                        draggingObj.style.top=(e.clientY-diffY)+'px';
                    }
                    break;

                case 'mouseup':
                    draggingObj =null;
                    diffX=0;
                    diffY=0;
                    break;
            }
        };

        return {
            enable:function(){
                document.addEventListener('mousedown',mouseHandler);
                document.addEventListener('mousemove',mouseHandler);
                document.addEventListener('mouseup',mouseHandler);
            },
            disable:function(){
                document.removeEventListener('mousedown',mouseHandler);
                document.removeEventListener('mousemove',mouseHandler);
                document.removeEventListener('mouseup',mouseHandler);
            }
        }
    }

    function getDraggingDialog(e){
        var target=e.target;
        while(target && target.className.indexOf('dialog-title')==-1){
            target=target.offsetParent;
        }
        if(target!=null){
            return target.offsetParent;
        }else{
            return null;
        }
    }

    Dragging(getDraggingDialog).enable();

})


$(document).on('click','#create-newUsers>ul a',function(){
    var chart_type=$(this)[0].id;
    var chart_name=$(this).find('p').text();
    $('#create-newUsers').animate({'left':'-726'}, 'slow');

    if( $('#main').animate({'left':'0','top':'48'},'slow')){
        console.log(chart_type);
        console.log(chart_name)
        $('#chart_right').css('visibility','visible')

    }
});
$(document).on('click','#chart_right', function () {
    $('#create-newUsers').animate({'left':'0'}, 'slow');
    $('#main').animate({'left':'726'},'slow')
    $('#chart_right').css('visibility','hidden')
});

