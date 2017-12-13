
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
    loading:function (){
        if(this.M['loading']){
            return this.M['loading'].show();
        }
        this.M['loading'] = jqueryAlert({
            'icon'    : window_topo_static_path+'images/timg.gif',
            'modal'   : true,
            'content' : '',
            'closeTime' : 9999999,
            'className' : "loading",
        });
        $('.loading').css({'width':'152px','height':'144px','margin-left':'-72px','margin-top':'-76px'});
        $('.loading>.alert-content').css({'padding-top':'10px','background':'url('+window_topo_static_path+'images/timg.gif) -90px -56px / auto 260px no-repeat','color':'#6CCDFF','font-weight':'bold','font-family':'Noto Sans S Chinese','font-size':'16px','margin-top':'0px'});

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

