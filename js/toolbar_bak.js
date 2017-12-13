

// 页面工具栏
function showJTopoToobar(stage){
    var toobarDiv = $('<div class="jtopo_toolbar">').html(''
    // +'<input type="radio" name="modeRadio" value="normal" checked id="r1"/>'
    //+'<label for=""> 鼠标选项：</label>'
    +'&nbsp;<input type="radio" name="modeRadio" value="drag" id="r3"/><label for="r3" id="label-r3" "><span>拖动画布</span></label>'
    +'&nbsp;<input type="radio" name="modeRadio" value="select" id="r2"/><label for="r2" id="label-r2" title="框选元素" ><span>选取</span></label>'
    +'&nbsp;<input type="radio" name="modeRadio" value="normal" id="r4"/><label for="r4" id="label-r4" title="添加节点连线"  ><span>链路</span></label>'
    +'&nbsp;&nbsp;<select name="linestyle" id="linestyle" style="display: none" class="animated slideInUp">'
    +'<option value="defaultline" >传统拓扑链路</option><option value="simpleline" id="sdn_line">SDN拓扑链路</option>'
    //+'<option value="polyline">百兆网线</option><option value="dbpolyline">千兆网线</option><option value="curve">千兆光纤</option>'
    +'</select>&nbsp;&nbsp;'
    +'<div id="section-top-bar">'
        +'<div class="icon"  id="start">'
        +'<img src="http://10.10.1.67:8080/net/images/2017-08-25_105716.png" title="点击开启流量" />'
        +'</div>'
        +'<div class="icon" id="catch">'
        +'<img src="http://10.10.1.67:8080/net/images/2017-08-25_105802.png" title="抓包分析" />'
        +'</div>'
        +'</div>'
    //+'<input type="button" id="fullScreenButton" value="全屏显示"/>'
        +'<input type="button" class="btn" id="shengc" value=" 生成 " style=""/>&nbsp;&nbsp;'
    +'<input type="button" class="btn" id="zoomOutButton" value=" 放 大 " />&nbsp;&nbsp;'
    +'<input type="button" class="btn" id="zoomInButton" value=" 缩 小 " />&nbsp;&nbsp;'
    //+'&nbsp;&nbsp;<input type="text" id="findText" style="width: 100px;" value="" onkeydown="enterPressHandler(event)">'
    //+ '<input type="button" id="findButton" value=" 查 询 ">'
    // + '&nbsp;&nbsp;<input type="button" id="cloneButton" value="选中克隆">&nbsp;&nbsp;'
    +'&nbsp;&nbsp;<input type="button" class="btn btn-info" id="exportButton" value="导出PNG" style="background: #199ED8">&nbsp;&nbsp;'
    +'&nbsp;&nbsp;<input type="checkbox" id="zoomCheckbox"/><label for="zoomCheckbox" id="zoomCheckbox-label">鼠标缩放</label>'
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


}

var JTopoToobarEvent={
    "label_r2":function(){
        $('#label-r2').css('background','url("http://10.10.1.67:8080/net/images/2017-08-28_155121.png")');
        $('#label-r4').css('background','url("http://10.10.1.67:8080/net/images/2017-08-28_161426.png")');
        // 删除虚拟线
        link_obj.remove_virtual_link()
        $("input[name='modeRadio'][value=drag]:radio").prop("checked", true);
        //$('#linestyle').fadeOut();
    },
    "label_r4":function(){
        $('#label-r4').css('background','url("http://10.10.1.67:8080/net/images/2017-08-28_161410.png")');
        $('#label-r2').css('background','url("http://10.10.1.67:8080/net/images/2017-08-28_153715.png")');
        //$('#linestyle').fadeIn();
    },
    "label_r3":function(){
        $('#label-r2').css('background','url("http://10.10.1.67:8080/net/images/2017-08-28_153715.png")');
        $('#label-r4').css('background','url("http://10.10.1.67:8080/net/images/2017-08-28_161426.png")');
        //$('#linestyle').fadeOut();
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
