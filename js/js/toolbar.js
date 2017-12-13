

// 页面工具栏
function showJTopoToobar(stage){
    var toobarDiv = $('<div class="jtopo_toolbar">').html(''
    // +'<input type="radio" name="modeRadio" value="normal" checked id="r1"/>'
    //+'<label for=""> 鼠标选项：</label>'
    +'&nbsp;<input type="radio" name="modeRadio" value="drag" id="r3"/><label for="r3" id="label-r3" "><span > <span class="glyphicon glyphicon-wrench" style="font-size: 22px;display: inline-block;transform: translate(35px,-25px);"></span>拖动画布</span></label>'
    +'&nbsp;<input type="radio" name="modeRadio" value="select" id="r2"/><label for="r2" id="label-r2" title="框选元素" ><span > <span class="glyphicon glyphicon-ok" style="font-size: 22px"></span>选取</span></label>'
    +'&nbsp;<input type="radio" name="modeRadio" value="normal" id="r4"/><label for="r4" id="label-r4" title="添加节点连线"  ><span> <span  class="glyphicon glyphicon-random" style="font-size: 22px"></span>链路</span></label>'
    +'&nbsp;&nbsp;<select name="linestyle" id="linestyle" style="display: none" class="animated slideInUp">'
    +'<option value="defaultline" >传统拓扑链路</option><option value="simpleline" id="sdn_line">SDN拓扑链路</option>'
    //+'<option value="polyline">百兆网线</option><option value="dbpolyline">千兆网线</option><option value="curve">千兆光纤</option>'
    +'</select>&nbsp;&nbsp;'
    +'<div id="section-top-bar">'
        +'<div class="icon"  id="start">'
        +'<span class="glyphicon glyphicon-expand" style="font-size: 22px;    display: inline-block;transform:  translate(34px,-25px);"></span width="22px"><span class="kaiq_txt"> 开启流量</span>'
        +'</div>'
        +'<div class="icon" id="catch">'
        +'<span class="glyphicon glyphicon-picture" style="font-size: 22px;display: inline-block;transform:  translate(31px,-25px);"></span>抓包分析</span>'
        +'</div>'
        +'</div>'
    //+'<input type="button" id="fullScreenButton" value="全屏显示"/>'
        +'<input type="button" class="btn" id="shengc" value=" 生成 " style="display: none"/>&nbsp;&nbsp;'
    +'<input type="button" class="btn" id="zoomOutButton" value="" style="display: none"/><label for="zoomOutButton" id="zoomOutButton_label" title="放大"><span> <span  class="glyphicon glyphicon-zoom-in" style="font-size: 22px;display: inline-block;transform:  translate(23px,-24px)"></span>放大</span></label>'
    +'<input type="button" class="btn" id="zoomInButton" value="" style="display: none"/><label for="zoomInButton" id="zoomInButton_label" title="缩小"><span> <span  class="glyphicon glyphicon-zoom-out" style="font-size: 22px;display: inline-block;transform:  translate(23px,-24px)"></span>缩小</span></label>'
    //+'&nbsp;&nbsp;<input type="text" id="findText" style="width: 100px;" value="" onkeydown="enterPressHandler(event)">'
    //+ '<input type="button" id="findButton" value=" 查 询 ">'
    // + '&nbsp;&nbsp;<input type="button" id="cloneButton" value="选中克隆">&nbsp;&nbsp;'
    +'<input type="button" class="btn btn-info" id="exportButton" value="" style="display: none"><label for="exportButton" id="exportButton_label" title="导出PNG"><span> <span  class="glyphicon glyphicon-camera" style="font-size: 22px;display: inline-block;transform:  translate(24px,-25px)"></span>快照</span></label>'
    +'<input type="checkbox" id="zoomCheckbox" style="display: none"/><label for="zoomCheckbox" id="zoomCheckbox-label"><span> <span  class="glyphicon glyphicon-fullscreen" style="font-size: 22px;display: inline-block;transform:  translate(34px,-25px)"></span>鼠标缩放</span></label>'
    //+ '&nbsp;&nbsp;<input type="button" id="printButton" value="导出PDF">'
    );

    $('#content').prepend(toobarDiv);

    // 工具栏按钮处理
    $("input[name='modeRadio']").click(function(){
        stage.mode = $("input[name='modeRadio']:checked").val();      
    });
    $('#centerButton').click(function(){
        stage.centerAndZoom(); //缩放并居中显示
    });
    $('#zoomOutButton').click(function(){
        stage.zoomOut();
    });
    $('#zoomInButton').click(function(){
        stage.zoomIn();
    });
    $('#cloneButton').click(function(){
        stage.saveImageInfo();
    });
    $('#exportButton').click(function() {
        stage.saveImageInfo();
    });
    $('#printButton').click(function() {
        stage.saveAsLocalImage();
    });
    $('#zoomCheckbox').click(function(){
        if($('#zoomCheckbox').is(':checked')){
            stage.wheelZoom = 1.2; // 设置鼠标缩放比例
        }else{
            stage.wheelZoom = null; // 取消鼠标缩放比例
        }
    });

    var $vv=$('input:radio[name="modeRadio"]:checked').val();

    $('#label-r2').click( JTopoToobarEvent.label_r2 );

    $('#label-r4').click( JTopoToobarEvent.label_r4 );
    $('#label-r3').click( JTopoToobarEvent.label_r3 );
    $('#zoomCheckbox-label').click(
       function(){
           $('#zoomCheckbox-label span').toggleClass('toolclass')
       }

    )

}

var JTopoToobarEvent={
    "label_r2":function(){

        $('#label-r2 span').addClass('toolclass');
        $('#label-r4 span').removeClass('toolclass');
        $('#label-r3 span').removeClass('toolclass');
        // 删除虚拟线
        link_obj.remove_virtual_link()
        $("input[name='modeRadio'][value=drag]:radio").prop("checked", true);

    },
    "label_r4":function(){
        //$('#label-r4').css('background','url("http://10.10.1.67:8080/net/images/2017-08-28_161410.png")');
        //$('#label-r2').css('background','url("http://10.10.1.67:8080/net/images/2017-08-28_153715.png")');
        ////$('#linestyle').fadeIn();
        $('#label-r4 span').addClass('toolclass')
        $('#label-r2 span').removeClass('toolclass');
        $('#label-r3 span').removeClass('toolclass');
    },
    "label_r3":function(){
        $('#label-r3 span').addClass('toolclass');
        $('#label-r4 span').removeClass('toolclass');
        $('#label-r2 span').removeClass('toolclass')
    }
}

//$("#shengc").click(function(){

$(document).on("click","#shengc",function(){
    var s = {
        data:{},
        links:[],
        self_add_id:self_add_id,
        topo_type:topo_allElement_data['topo_type']
    };

    for ( var type in topo_allElement_data ){
        if( type == 'topo_name'|| type == 'topo_type' ){
            continue;
        }
        if(!s['data'][type]){
            s['data'][type]=[];
        }
        for( var info in topo_allElement_data[type] ){
            var links=[];
            for( var link_id in topo_allElement_data[type][info]['link_ed'] ){
                links.push(link_id);
            }
            s['data'][type].push(
                {
                    id:topo_allElement_data[type][info]['element_id'].split('_').pop(),
                    name:topo_allElement_data[type][info]['text'],
                    x:topo_allElement_data[type][info]['x'],
                    y:topo_allElement_data[type][info]['y'],
                    data:topo_allElement_data[type][info]['data'],
                    formdata:topo_allElement_data[type][info]['formdata'],
                    link_ed:links,
                    netdata:topo_allElement_data[type][info]['netdata']
                }
            )
        }
    }
    for( var net in link_obj.links ){
        s['links'].push(
            {
                link_net1:link_obj.links[net].link_net1,
                link_net2:link_obj.links[net].link_net2,
                id: net.split('_').pop(),
                interface_1:{
                    type:link_obj.links[net].nodeA.type,
                    id:link_obj.links[net].nodeA.element_id
                },
                interface_2:{
                    type:link_obj.links[net].nodeZ.type,
                    id:link_obj.links[net].nodeZ.element_id
                }
            }
        )
    }
    $.post("",{"data":JSON.stringify(s)},function(){

    })
})



