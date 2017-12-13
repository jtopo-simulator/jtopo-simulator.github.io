/**
 * Created by Administrator on 2017/9/8.
 */


// 还原数据表单数据函数
function restoreFromData(){
    var element = current_element();
    if( element.formdata && element.formdata.length > 0 ) {
        for (var i = 0; i < element.formdata.length; i++) {
            var obj = $("[name='" + element.formdata[i]['name'] + "']");

            if (obj.is('input') && obj.attr('type').toLowerCase() == 'radio') {
                $("input[name='" + element.formdata[i]['name'] + "'][value=" + element.formdata[i]['value'] + "]").prop("checked", true);
            } else {
                obj.val(element.formdata[i]['value']);
            }
        }
    }

    restore.restore( element.type );
}

function savetable( obj ){
    var element = current_element();
    element.formdata = obj.parents('form').serializeArray();

    for( var i=0;i<element.formdata.length;i++ ){
        element.netdata.data[ element.formdata[i]['name'] ] = element.formdata[i]['value']
    }
}

$("form[id^=modal]").find('.modal-button').click(function(){
    savetable( $(this) );
});


// 网元名称修改
$(".netname").click(function(){
    var element = current_element();
    netnameclass = $($(this).parents('form').find('.tabs a').get(0)).attr('name');
    if( $(netnameclass).find('input').val() ){
        element.text = $(netnameclass).find('input').val();
    }
})

// 服务器 新建 DNS
// 页面
$('#modal-form-3-btn').click(function () {
    var element = current_element();
    element.server_dns_action = 'add';

    $('#new_server_dns').show()
});
// 服务器 编辑 DNS
// 页面
$("#modal-form-4-btn").click(function(){
    var element = current_element();
    var check_obj = editlist( 'dns_ser_checkbox' )
    if( !check_obj ){
        return;
    }

    var check_id = check_obj.val();
    element.server_dns_action = 'edit';
    element.server_dns_edit_id = check_id;

    $("#new_server_ids2").val(element.netdata['dnslist']['data'][check_id]['ip'])
    $("#new_server_des2").val(element.netdata['dnslist']['data'][check_id]['domain']);
    $('#new_server_dns').show();
})

// 服务器 新建 DNS
// 动作
$("#new_vlan_btn_sure2_dns").click(function(){

    var host = $("#server_dns_def").val();
    var ip = $("#new_server_ids2").val().trim();
    var domain = $("#new_server_des2").val().trim();
    if( !alertMsg(ip,'ip不能为空') )
        return;
    if( !alertMsg(domain,'域名不能为空') )
        return;

    // dns列表存到 网元对象中
    var element = current_element();
    if( !element.netdata['dnslist'] ){
        element.netdata['dnslist'] = { id:1 , data:{} };
    }

    var data_id = element.netdata['dnslist'].id;
    if( element.server_dns_action == 'edit' ){
        data_id = element.server_dns_edit_id
    }
    element.netdata['dnslist']['data'][ data_id ] = {
        ip:ip,
        domain:domain+'.'+host,
        id:element.netdata['dnslist'].id
    }


    // 将数据写到页面中
    var table_obj = $("#"+$(this).attr('data'));
    var str = '';
    if( element.server_dns_action == 'add' ) {
        str = '<tr>';
    }
    str += '<td style="width: 50px;" ><input type="checkbox" name="dns_ser_checkbox" value="'+data_id+'"></td>';
    str += '<td style="width: 50px;" >'+ip+'</td>';
    str += '<td style="width: 50px;" >'+domain+'.'+host+'</td>';

    if( element.server_dns_action == 'edit' ) {
        $('[name="dns_ser_checkbox"][value=' + data_id + ']').parents('tr').html(str);
    }else{
        str += '</tr>';
        table_obj.find('tbody').append( str )
    }


    // 记录tableid
    element.netdata['dnslist']['table_id'] = $(this).attr('data')

    if( element.server_dns_action == 'add' ){
        // id自增
        element.netdata['dnslist'].id++;
    }


    // 表单至空
    resetForm($(this).parents('form'));

    // 关闭页面
    $(this).parents('div').find('.modal_2_btn_exit').click()
})


// 服务器 DNS 删除
$("#modal-form-5-btn").click(function(){
    deletelist( 'dnslist' , 'dns_ser_checkbox' )
})


// 2层交换 添加 VLAN 页面展示
$('#modal-switchboard-form-2-btn2,#modal-switchboard-form-2-btn').click(
    function () {
        var element = current_element();
        element.vlan_action = 'add';

        if( element.type == 'usw1'
            || element.type == 'usw2'
        ){
            $('#new_vlan2').find('form').get(0).reset();
            $('#new_vlan2').show();
        }else{
            $('#new_vlan').find('form').get(0).reset();
            $('#new_vlan').show();
        }
    }
);

// 2层交换 编辑 VLAN 页面展示
// 页面
$("#modal-switchboard-form-3-btn2,#modal-switchboard-form-3-btn").click(function(){
    var element = current_element();
    var check_obj = editlist( element.vlan_checkbox_name )
    if( !check_obj ){
        return;
    }
    var check_id = check_obj.val();


    element.vlan_action = 'edit';
    element.vlan_edit_id = check_id;

    if( element.type == 'usw1'
        || element.type == 'usw2'
    ) {
        $("#new_vlan_ids2").val(element.netdata['vlan_list']['data'][check_id]['vlan_id'])
        $("#new_vlan_des2").val(element.netdata['vlan_list']['data'][check_id]['describe']);
        $('#new_vlan2').show();
    }else{
        $("#new_vlan_ids").val(element.netdata['vlan_list']['data'][check_id]['vlan_id'])
        $("#new_vlan_des").val(element.netdata['vlan_list']['data'][check_id]['describe']);
        $("#new_vlan_ipv4_add").val(element.netdata['vlan_list']['data'][check_id]['ip'])
        $("#new_vlan_ipv4_mask").val(element.netdata['vlan_list']['data'][check_id]['mask']);
        $('#new_vlan').show();
    }
})

// 2层交换 新建/修改 VLAN
//  动作
$("#new_vlan_btn_sure2,#new_vlan_btn_sure").click(function(){
    var element = current_element();
    if(
        element.type == 'usw1'
        || element.type == 'usw2'
    ){
        var table_data = {
            new_vlan_ids2:{
                msg:'vlan_id不能为空',
                key:'vlan_id',
            },
            new_vlan_des2:{
                msg:'描述不能为空',
                key:'describe'
            },
        }
        var list = [
            {
                type:'checkbox',
                name:element.vlan_checkbox_name,
                value:'vlan_list'
            },
            {
                value:'vlan_id'
            },
            {
                value:'describe'
            },
            {}
        ]

    }else{
        var table_data = {
            new_vlan_ids:{
                msg:'vlan_id不能为空',
                key:'vlan_id',
            },
            new_vlan_des:{
                msg:'描述不能为空',
                key:'describe'
            },
            new_vlan_ipv4_add:{
                msg:'IPv4地址',
                key:'ip'
            },
            new_vlan_ipv4_mask:{
                msg:'子网掩码',
                key:'mask'
            },
        }
        var list = [
            {
                type:'checkbox',
                name:element.vlan_checkbox_name,
                value:'vlan_list'
            },
            {
                value:'vlan_id'
            },
            {
                value:'describe'
            },
            {
                value:'ip'
            },
            {
                value:'mask'
            },
            {}
        ]
    }
    var data = {
        table_data:table_data,
        net_action:element.vlan_action,
        net_action_id:element.vlan_edit_id,
        net_action_name:element.vlan_checkbox_name,
        element_key:'vlan_list',
        list:list
    };
    dynamicAdd(data,$(this));

})



// 2层交换机 vlan 删除
$("#modal-switchboard-form-4-btn2,#modal-switchboard-form-4-btn").click(function(){
    var element = current_element();
    var check_obj = $('input:checkbox[name="'+element.vlan_checkbox_name+'"]:checked');
    if( check_obj.length == 0 ){
        alert('请选择');return;
    }
    check_obj.each(function(){
        var vlan_id  = $(this).val();
        if(
            element['netdata']['vlan_list']['interface_id_ed']
            && element['netdata']['vlan_list']['interface_id_ed'][vlan_id]
        ){
            if( JSON.stringify( element['netdata']['vlan_list']['interface_id_ed'][vlan_id]) != '{}' ){
                alert('存在成员端口，不可删除')
                return;
            }
        }

        $(this).parents('tr').remove();
        delete element.netdata['vlan_list']['data'][vlan_id];
    })
})


// 统一 添加 修改 函数 待用
function dynamicAdd( data , obj ){

    // 临时存储对象
    var element_data = {};

    // 当前网缘对象
    var element = current_element();

    // 判断表单值 并且 存入临时对象
    for( var table_id in data.table_data ){
        console.log(table_id)
        if( $("#"+table_id).attr('type') == 'checkbox' || data.table_data[table_id].type == 'checkbox' ){
            var val = 0;
            if( $("#"+table_id).is(':checked') ){
                var val = $("#"+table_id).val().trim();
            }
        }else if ( data.table_data[table_id].type == 'radio' ){
            var val = $("[name='"+table_id+"']:checked").val()
        }
        else{
            var val = $("#"+table_id).val().trim();
        }

        if( !data.table_data[table_id].empty ){
            if( !alertMsg(val,data.table_data[table_id].msg) )
                return;
        }
        element_data[ data.table_data[table_id].key ] = val;
    }
    if( !element.netdata[ data.element_key ] ){
        element.netdata[ data.element_key ] = { id:1 , data:{} };
    }

    if( data.net_action == 'edit'){
        element_data['id'] = data.net_action_id
        element.netdata[data.element_key]['data'][ data.net_action_id ] = element_data

    }else{
        // 数据添加到 网元对象中
        element.netdata[data.element_key]['data'][ element.netdata[data.element_key].id ] = element_data
        element.netdata[data.element_key]['data'][ element.netdata[data.element_key].id ]['id'] = element.netdata[data.element_key].id
    }

    // 将数据写到页面中
    var table_obj = $("#"+obj.attr('data'));

    if( data.net_action == 'edit'){
        var cid = data.net_action_id;
        var str = '';
    }else{
        var cid = element.netdata[data.element_key].id
        var str = '<tr>';
    }

    for( var i=0;i<data.list.length;i++){
        if( data.list[i].type && data.list[i].type=='checkbox'){
            str += '<td style="width: 50px;" ><input type="checkbox" name="'+data.list[i].name+'" value="'+cid+'"></td>';
        }else{
            if( element.netdata[data.element_key]['data'][ cid ][ data.list[i].value ] ){
                str += '<td style="width: 50px;" >'+element.netdata[data.element_key]['data'][ cid ][ data.list[i].value ]+'</td>';
            }else if( data.list[i].value ){
                str += '<td style="width: 50px;" >'+element_data[data.list[i].value]+'</td>';
            }else{
                str += '<td style="width: 50px;" ></td>';
            }
        }
    }

    if( data.net_action == 'edit' ){
        $('[name="'+data.net_action_name+'"][value='+data.net_action_id+']').parents('tr').html( str );
    }else{
        str += '</tr>';
        table_obj.find('tbody').append( str )
    }


    // 记录tableid
    element.netdata[data.element_key]['table_id'] = obj.attr('data')

    // id自增
    if( data.net_action == 'add' ){
        element.netdata[data.element_key].id++;
    }

    // 表单至空
    resetForm(obj.parents('form'));

    // 关闭页面
    obj.parents('div').find('.modal_2_btn_exit').click()
}


// 2层交换 接口编辑
// 页面
$("#modal-switchboard-form-6-btn2,#modal-switchboard-form-6-btn").click(function(){

    var element = current_element();
    var check_obj = editlist( element.interface_checkbox_name )
    if( !check_obj ){
        return;
    }
    var check_id = check_obj.val();

    // 记录修改的ID
    element.interface_edit_id = check_id;

    // 获取对象中的值
    var data = element.netdata['interface_list'].data[check_id];

    if(
        element.type == 'usw1'
        || element.type == 'usw2'
    ){
        var key = 0;
    }else{
        var key = 1;
    }

    form = {
        speed:['port_rate2','port_rate'],
        status:[ ['port12','port22'], ['port1','port2']],
        duplex:['port_status2','port_status'],
        vlan_select:['new_port_ids_last2','new_port_ids_last'],
        link_type:['port_link_type2','port_link_type'],
        vlan_id:['new_port_ids_last2','new_port_ids_last'],
        html:['new_port2','new_port']
    }
    // 填充表单
    $("#"+form['speed'][key] ).val( data['speed'] );


    if( data['status'] == 'up' ){
        $("#"+form['status'][key][0]).prop('checked',true);
    }else{
        $("#"+form['status'][key][1]).prop('checked',true);
    }
    $("#"+form['duplex'][key]).val(data['duplex'].toLowerCase())

    // 获取 vlan id 列表
    if( element['netdata'] && element['netdata']['vlan_list'] && element['netdata']['vlan_list']['data'] ){
        var str = '<option value="false">请选择</option>';
        for( var i in element['netdata']['vlan_list']['data']){
            str+="<option value='"+i+"'>"+element['netdata']['vlan_list']['data'][i].vlan_id+"</option>"
        }
        $("#"+form['vlan_select'][key]).html(str)

        if( data['link_type'] ){
            $("#"+form['link_type'][key]).val( data['link_type'] )
        }

        if( data['vlan_id'] ){
            $("#"+form['vlan_id'][key]).val( data['vlan_id'] )
        }
    }

    $('#'+form['html'][key]).show();
})

// 2层交换 接口编辑
// 动作
$("#new_port_btn_sure2,#new_port_btn_sure").click(function(){
    var element = current_element();

    if(
        element.type == 'usw1'
        || element.type == 'usw2'
    ){
        var key = 0;
    }else{
        var key = 1;
    }
    form = {
        co:['new_port_kg2','new_port_kg'],
        speed:['port_rate2','port_rate'],
        status:[ ['port12','port22'], ['port1','port2']],
        duplex:['port_status2','port_status'],
        vlan_select:['new_port_ids_last2','new_port_ids_last'],
        link_type:['port_link_type2','port_link_type'],
        vlan_id:['new_port_ids_last2','new_port_ids_last'],
        html:['new_port2','new_port']
    }

    var co = 'down';
    if( $("[name='"+form['co'][key]+"']:checked").val() == '1' ){
         co = 'up';
    }
    var saveobj = element['netdata']['interface_list']['data'][element.interface_edit_id]

    var old_vlan_id = saveobj.vlan_id;
    // 删除之前的 vlanid 关系
    if( old_vlan_id ){
        delete element['netdata']['vlan_list']['interface_id_ed'][old_vlan_id][element.interface_edit_id]
    }

    saveobj.status = co
    saveobj.speed = $("#"+form['speed'][key]).val()
    saveobj.duplex = $("#"+form['duplex'][key]).val()
    saveobj.link_type = $("#"+form['link_type'][key]).val()
    saveobj.vlan_id = $("#"+form['vlan_id'][key]).val();

    if( saveobj.duplex.toLowerCase() == 'full' ){
        var duplex = '全双工';
    }else if ( saveobj.duplex.toLowerCase() == 'falf' ) {
        var duplex = '半双工';
    }else{
        var duplex = '自适应';
    }

    var str = '';
    str += '<td style="width: 50px;" ><input type="checkbox" name="'+element.interface_checkbox_name+'" value="'+element.interface_edit_id+'"></td>';
    str += '<td style="width: 50px;" >'+element.interface_edit_id+'</td>';
    str += '<td style="width: 50px;" >'+co+'</td>';
    str += '<td style="width: 50px;" >'+saveobj.speed+'</td>';
    str += '<td style="width: 50px;" >'+duplex+'</td>';
    str += '<td style="width: 50px;" >'+saveobj.link_type+'</td>';

    if( element['netdata']['vlan_list'] && element['netdata']['vlan_list']['data'][saveobj.vlan_id] ){
        str += '<td style="width: 50px;" >'+element['netdata']['vlan_list']['data'][saveobj.vlan_id]['vlan_id']+'</td>';

        if( !element['netdata']['vlan_list']['interface_id_ed'] ){
            element['netdata']['vlan_list']['interface_id_ed'] = {};
        }

        if( !element['netdata']['vlan_list']['interface_id_ed'][saveobj.vlan_id] ){
            element['netdata']['vlan_list']['interface_id_ed'][saveobj.vlan_id]={};
        }

        element['netdata']['vlan_list']['interface_id_ed'][saveobj.vlan_id][element.interface_edit_id] = 1;

    }else{
        str += '<td style="width: 50px;" ></td>';
    }


    // 修改接口时 修改vlan展示列表
    if( element['netdata']['vlan_list'] && element['netdata']['vlan_list']['interface_id_ed'] ){

        var text = '';
        for( interface_name in element['netdata']['vlan_list']['interface_id_ed'][saveobj.vlan_id] ){
            text += interface_name + '/'
        }

        if( saveobj.vlan_id && saveobj.vlan_id != 'false' ){
            $('[name="'+element.vlan_checkbox_name+'"][value="'+saveobj.vlan_id+'"]').parents('tr').find('td:last').text( text )
        }else{
            if( old_vlan_id ){
                $('[name="'+element.vlan_checkbox_name+'"][value="'+old_vlan_id+'"]').parents('tr').find('td:last').text( text )
            }
        }
    }

    $('[name="'+element.interface_checkbox_name+'"][value="'+element.interface_edit_id+'"]').parents('tr').html(str);

    $(this).parents('div').find('.modal_2_btn_exit').click()
})

// 2层交换机 建新 镜像设置
// 页面
$('#modal-switchboard-form-8-btn2,#modal-switchboard-form-8-btn').click(
    function () {

        var element = current_element();
        element.mirror_action = 'add';
        delete element.mirror_edit_id

        restore.switch_mirror_edit();

        if(
            element.type == 'usw1'
            || element.type == 'usw2'
        ){
            $('#new_mi2').show();
        }else{
            $('#new_mi').show();
        }

    }
);

// 2层交换机 编辑 镜像
// 页面
$('#modal-switchboard-form-9-btn2,#modal-switchboard-form-9-btn').click(//编辑
    function () {
        var element = current_element();
        var check_obj = editlist( element.mirror_list_name )
        if( !check_obj ){
            return;
        }

        var check_id = check_obj.val();

        // 记录修改的ID
        element.mirror_edit_id = check_id;
        element.mirror_action = 'edit';

        restore.switch_mirror_edit();
        if(
            element.type == 'usw1'
            || element.type == 'usw2'
        ){
            $('#new_mi2').show();
        }else{
            $('#new_mi').show();
        }

    }
);

// 2层交换机  建新 修改 镜像
// 动作
$("#new_mi_btn_sure2,#new_mi_btn_sure").click(function(){
    var element = current_element();
    //
    if(
        element.type == 'usw1'
        || element.type == 'usw2'
    ){
        var mirror_id = $("#new_mi_id2").val();
        var flow_type = $("#new_mi_flux_node2").val()
        var mirror_port = $("[name='"+element.mirror_mirror_port_name+"']:checked")
        var monitor_port = $("[name='"+element.mirror_monitor_port_name+"']:checked")
    }else{
        var mirror_id = $("#new_mi_id").val();
        var flow_type = $("#new_mi_flux_node").val()
        var mirror_port = $("[name='"+element.mirror_mirror_port_name+"']:checked")
        var monitor_port = $("[name='"+element.mirror_monitor_port_name+"']:checked")
    }


    if( mirror_id == '0' ){
        alert('请选择镜像组ID');
        return;
    }
    if( monitor_port.length == 0 ){
        alert('请选择 monitor port');
        return;
    }
    if( mirror_port.length == 0 ){
        alert('请选择 mirror port');
        return;
    }

    if( !element.netdata['mirror'] ){
        element.netdata['mirror'] = { id:1 , data:{  } };
    }
    var data_id = element.netdata['mirror'].id;
    if( element.mirror_action == 'edit' ){
        data_id = element.mirror_edit_id
        var old_mirror_id = element.netdata['mirror']['data'][ data_id ].mirror_id
        if( element.netdata['mirror']['ids'][ old_mirror_id ] ){
            delete  element.netdata['mirror']['ids'][ old_mirror_id ]
        }
    }
    element.netdata['mirror']['data'][ data_id ] = {
        mirror_id:mirror_id,
        flow_type:flow_type,
        id:data_id,
        monitor_port:{},
        mirror_port:{}
    }

    if( !element.netdata['mirror']['ids'] ){
        element.netdata['mirror']['ids']={};
    }
    element.netdata['mirror']['ids'][mirror_id] = mirror_id;


    var show_monitor_port='';
    for ( var i=0;i<monitor_port.length;i++ ){
        element.netdata['mirror']['data'][ data_id ]['monitor_port'][ monitor_port[i].value ] =  monitor_port[i].value
        show_monitor_port += monitor_port[i].value+'/'
    }

    var show_mirror_port='';
    for ( var i=0;i<mirror_port.length;i++ ){
        element.netdata['mirror']['data'][ data_id ]['mirror_port'][ mirror_port[i].value ] =  mirror_port[i].value
        show_mirror_port += mirror_port[i].value+'/'
    }

    // 将数据写到页面中
    var table_obj = $("#"+$(this).attr('data'));
    var str = '';
    if( element.mirror_action == 'add' ){
        str = '<tr>';
    }

    str += '<td style="width: 50px;"><input type="checkbox" name="'+element.mirror_list_name+'" value="'+data_id+'"></td>';
    str += '<td style="width: 50px;" >'+mirror_id+'</td>'
    str += '<td style="width: 50px;" >Active</td>';
    str += '<td style="width: 50px;">'+show_monitor_port+'</td>';
    str += '<td style="width: 50px;" >'+show_mirror_port+'</td>';
    str += '<td style="width: 50px;">'+flow_type+'</td>';
    str += '</tr>';

    if( element.mirror_action == 'edit' ){
        $('[name="'+element.mirror_list_name+'"][value='+element.mirror_edit_id+']').parents('tr').html( str );
    }else{
        str += '</tr>';
        table_obj.find('tbody').append( str )
    }

    // 记录tableid
    element.netdata['mirror']['table_id'] = $(this).attr('data')

    if( element.mirror_action == 'add' ){
        // id自增
        element.netdata['mirror'].id++;
    }

    // 表单至空
    resetForm($(this).parents('form'));

    // 关闭页面
    $(this).parents('div').find('.modal_2_btn_exit').click()

})

// 2层交换机 删除 镜像
// 动作
$("#modal-switchboard-form-10-btn2").click(function(){
    var element = current_element();
    var check_obj = $('input:checkbox[name="'+element.mirror_list_name+'"]:checked');
    if( check_obj.length == 0 ){
        alert('请选择');return;
    }

    check_obj.each(function(){

        var mirror_id  = $(this).val();
        var type_id = element.netdata['mirror']['data'][mirror_id]['mirror_id'];
        delete element['netdata']['mirror']['ids'][type_id];
        delete element.netdata['mirror']['data'][mirror_id];
        $(this).parents('tr').remove();
    })

})

// 3层交换机 静态路由 建新
// 页面
$('#modal-switchboard-form-11-btn').click(
    function () {
        var element = current_element();
        element.static_route_action = 'add';
        resetForm($('#new_router_mb').parents('form'));
        $('#new_router').show();
    }
);
// 3层交换机 静态路由 建新 编辑
// 动作
$('#new_router_btn_sure').click(
    function () {
        var net_duan = $("#new_router_mb").val();
        var mask_leng = $("#new_router_ymcd").val().trim();
        var next = $("#new_router_yyt").val().trim();
        if( !alertMsg(net_duan,'目标网段') )
            return;
        if( !alertMsg(mask_leng,'掩码长度') )
            return;
        if( !alertMsg(next,'下一跳') )
            return;

        // dns列表存到 网元对象中
        var element = current_element();
        if( !element.netdata['static_route'] ){
            element.netdata['static_route'] = { id:1 , data:{} };
        }

        var data_id = element.netdata['static_route'].id;
        if( element.static_route_action == 'edit' ){
            data_id = element.static_route_id
        }
        element.netdata['static_route']['data'][ data_id ] = {
            net_duan:net_duan,
            mask_leng:mask_leng,
            next:next,
            id:element.netdata['static_route'].id
        }


        // 将数据写到页面中
        var table_obj = $("#"+$(this).attr('data'));
        var str = '';
        if( element.static_route_action == 'add' ) {
            str = '<tr>';
        }
        str += '<td style="width: 50px;" ><input type="checkbox" name="static_route_list" value="'+data_id+'"></td>';
        str += '<td style="width: 50px;" >'+net_duan+'</td>';
        str += '<td style="width: 50px;" >'+mask_leng+'</td>';
        str += '<td style="width: 50px;" >'+next+'</td>';

        if( element.static_route_action == 'edit' ) {
            $('[name="static_route_list"][value=' + data_id + ']').parents('tr').html(str);
        }else{
            str += '</tr>';
            table_obj.find('tbody').append( str )
        }


        // 记录tableid
        element.netdata['static_route']['table_id'] = $(this).attr('data')

        if( element.static_route_action == 'add' ){
            // id自增
            element.netdata['static_route'].id++;
        }

        // 表单至空
        resetForm($(this).parents('form'));

        // 关闭页面
        $(this).parents('div').find('.modal_2_btn_exit').click()
    }
);


// 3层交换机 静态路由 编辑
// 页面
$('#modal-switchboard-form-12-btn').click(//编辑
    function () {
        var check_obj = editlist('static_route_list')
        if( !check_obj ){
            return;
        }
        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.static_route_id = check_id;
        element.static_route_action = 'edit';

        $("#new_router_mb").val( element.netdata['static_route']['data'][check_id].net_duan );
        $("#new_router_ymcd").val( element.netdata['static_route']['data'][check_id].mask_leng )
        $("#new_router_yyt").val( element.netdata['static_route']['data'][check_id].next )

        $('#new_router').show();
    }
);

// 3层交换机 静态路由 删除
// 动作
$("#modal-switchboard-form-13-btn").click(function(){
    deletelist( 'static_route' , 'static_route_list' )
})


// 路由器 静态路由 建新
// 页面
$('#modal-router-form-5-btn').click(
    function () {
        var element = current_element();
        element.static_route_action = 'add';
        resetForm($('#new_router_status_mbwd').parents('form'));
        $('#new_router_status').show();
    }
);

// 路由器 静态路由 编辑
// 页面
$('#modal-router-form-6-btn').click(//编辑
    function () {

        var check_obj = editlist('route_static_route_list')
        if( !check_obj ){
            return;
        }

        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.static_route_id = check_id;
        element.static_route_action = 'edit';

        $("#new_router_status_mbwd").val( element.netdata['static_route']['data'][check_id].net_duan );
        $("#new_router_status_ymcd").val( element.netdata['static_route']['data'][check_id].mask_leng )
        $("#new_router_status_xyt").val( element.netdata['static_route']['data'][check_id].next )

        $('#new_router_status').show();
    }
);

// 路由器 静态路由 删除
// 动作
$("#modal-router-form-7-btn").click(function(){
    deletelist( 'static_route' , 'route_static_route_list' )
})

// 路由器 静态路由 新建/修改
//  动作
$("#new_router_status_btn_sure").click(function(){
    var element = current_element();
    var table_data = {
        new_router_status_mbwd:{
            msg:'目标网段不能为空',
            key:'net_duan',
        },
        new_router_status_ymcd:{
            msg:'掩码长度不能为空',
            key:'mask_leng'
        },
        new_router_status_xyt:{
            msg:'下一跳不能为空',
            key:'next'
        },
    }
    var list = [
        {
            type:'checkbox',
            name:'route_static_route_list',
        },
        {
            value:'net_duan'
        },
        {
            value:'mask_leng'
        },
        {
            value:'next'
        },
    ]
    var data = {
        table_data:table_data,
        net_action:element.static_route_action,
        net_action_id:element.static_route_id,
        net_action_name:'route_static_route_list',
        element_key:'static_route',
        list:list
    };
    dynamicAdd(data,$(this));

})







// 路由器 NET 建新
// 页面
$('#modal-router-form-8-btn').click(
    function () {
        var element = current_element();
        element.route_net_action = 'add';
        resetForm($('#new_router_nat_addp').parents('form'));
        $('#new_router_nat').show();
    }
);

// 路由器 NET 编辑
// 页面
$('#modal-router-form-9-btn').click(//编辑
    function () {
        var check_obj = editlist('route_net_list')
        if( !check_obj ){
            return;
        }
        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.route_net_id = check_id;
        element.route_net_action = 'edit';

        $("#new_router_nat_addp").val( element.netdata['route_net']['data'][check_id].address_pool );
        $("#new_router_nat_yyjk").val( element.netdata['route_net']['data'][check_id].net )
        $("#new_router_nat_start").val( element.netdata['route_net']['data'][check_id].start_ip )
        $("#new_router_nat_end").val( element.netdata['route_net']['data'][check_id].end_ip )

        $('#new_router_nat').show();
    }
);


// 路由器 NET 删除
// 动作
$("#modal-router-form-10-btn").click(function(){
    deletelist( 'route_net' , 'route_net_list' )
})


// 路由器 NET 新建/修改
// 动作
$("#new_router_nat_btn_sure").click(function(){
    var element = current_element();
    var table_data = {
        new_router_nat_addp:{
            msg:'地址池名称不能为空',
            key:'address_pool',
        },
        new_router_nat_yyjk:{
            msg:'应用接口',
            key:'net',
            empty:true
        },
        new_router_nat_start:{
            msg:'起始地址不能为空',
            key:'start_ip'
        },
        new_router_nat_end:{
            msg:'结束地址不能为空',
            key:'end_ip'
        },
    }
    var list = [
        {
            type:'checkbox',
            name:'route_net_list',
        },
        {
            value:'address_pool'
        },
        {
            value:'net'
        },
        {
            value:'start_ip'
        },
        {
            value:'end_ip'
        },
    ]
    var data = {
        table_data:table_data,
        net_action:element.route_net_action,
        net_action_id:element.route_net_id,
        net_action_name:'route_net_list',
        element_key:'route_net',
        list:list
    };
    dynamicAdd(data,$(this));

})




// 路由器 动态路由 内网网段 添加
// 页面
$('#new_rip_btn,#new_OSPF_btn,#new_bgp_btn').click(function () {


    if( $(this).attr('id') == 'new_rip_btn' ){
        $('#new_router_rip>div>p').html('新建bgp路由');
    }else if( $(this).attr('id') == 'new_OSPF_btn' ){
        $('#new_router_rip>div>p').html('新建OSPF路由');
    }else if( $(this).attr('id') == 'new_rip_btn' ){
        $('#new_router_rip>div>p').html('新建rip路由');
    }

    resetForm($('#new_router_rip_nwwd').parents('form'));

    var element = current_element();
    var dynamic_type = element.dynamic_type
    var str = '';
    if( element['netdata']['route_dynamic']
        && element['netdata']['route_dynamic'][dynamic_type]
        && element['netdata']['route_dynamic'][dynamic_type]['data']
    ){
        for( i in element['netdata']['route_dynamic'][dynamic_type]['data'] ){
            str +="<tr id='"+dynamic_type+"-"+i+"'>";
            str += '<td >'+i+'</td>';
            str += '<td >'+element['netdata']['route_dynamic'][dynamic_type]['data'][i].net_duan+'/'+element['netdata']['route_dynamic'][dynamic_type]['data'][i].mask+'</td>';
            str += '<td ><button class="modal-button delete_dynamic_net" style="width:100px;" data_id="'+i+'" >删除</button></td>';
            str +="</tr>";
        }
    }
    $("#new_router_rip_table_f").find('tbody tr').not(":first").remove();
    $("#new_router_rip_table_f").append(str)
    $('#new_router_rip').show();

});
// 路由器 动态路由 内网网段 添加
// 动作
$("#add_route_route").click(function(){

    var element = current_element();

    var net_duan = $('#new_router_rip_nwwd').val();
    var mask = $("#new_router_rip_ymcd").val();
    if( !alertMsg(net_duan,'内网网段不能为空') ){
        return ;
    }
    if( !alertMsg(mask,'掩码') ){
        return ;
    }

    var dynamic_type = element.dynamic_type

    if( !element['netdata']['route_dynamic'][dynamic_type] ){
        element['netdata']['route_dynamic'][dynamic_type] = {
            id:1,data:{}
        }
    }
    var id = element['netdata']['route_dynamic'][dynamic_type].id;
    element['netdata']['route_dynamic'][dynamic_type]['data'][id] = {
        net_duan:net_duan,
        mask:mask,
        id:id
    }

    var str="<tr id='"+dynamic_type+"-"+id+"'>";
    str += '<td >'+id+'</td>';
    str += '<td >'+net_duan+'/'+mask+'</td>';
    str += '<td ><button class="modal-button delete_dynamic_net" style="width:100px;" data_id="'+id+'" >删除</button></td>';
    str +="</tr>";

    element['netdata']['route_dynamic'][dynamic_type].id++;

    $("#new_router_rip_table_f").append(str);
    resetForm($('#new_router_rip_nwwd').parents('form'));

    restore.route_dynamic_data();
})
// 路由器 动态路由 内网网段 添加页面 确定 按钮
$("#new_router_rip_btn_sure").click(function(){
    $('#new_router_rip').hide();
})

$(document).on('click','.delete_dynamic_net',function(){
    var element = current_element();
    var dynamic_type = element.dynamic_type
    var id = $(this).attr('data_id');
    $("#"+dynamic_type+'-'+id).remove();
    delete element['netdata']['route_dynamic'][dynamic_type]['data'][id];

    restore.route_dynamic_data();
})





//===========================路由器 端口映射=====================================

// 路由器 端口映射 建新
// 页面
$('#modal-router-form-11-btn').click(
    function () {
        var element = current_element();
        element.route_prot_mapping_action = 'add';
        resetForm($('#new_router_map_name').parents('form'));
        $('#new_router_map').show();
    }
);

// 路由器 端口映射 编辑
// 页面
$('#modal-router-form-12-btn').click(//编辑
    function () {
        var check_obj = editlist('route_prot_mapping_list')
        if( !check_obj ){
            return;
        }
        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.route_prot_mapping_id = check_id;
        element.route_prot_mapping_action = 'edit';

        $("#new_router_map_name").val( element.netdata['route_prot_mapping']['data'][check_id].mapping_name );
        $("#new_router_map_gwdz").val( element.netdata['route_prot_mapping']['data'][check_id].pub_net_address )
        $("#new_router_map_swdz").val( element.netdata['route_prot_mapping']['data'][check_id].pri_net_address )

        if( element.netdata['route_prot_mapping']['data'][check_id].is_convert == 1 ){
            $("#new_router_map_dkzz").prop('checked',true)
        }
        $("#new_router_map_select").val( element.netdata['route_prot_mapping']['data'][check_id].protocol )
        $("#new_router_map_gwdk").val( element.netdata['route_prot_mapping']['data'][check_id].pub_net_port )
        $("#new_router_map_swdk").val( element.netdata['route_prot_mapping']['data'][check_id].pri_net_port )

        $('#new_router_map').show();
    }
);


// 路由器 端口映射 删除
// 动作
$("#modal-router-form-13-btn").click(function(){
    deletelist( 'route_prot_mapping' , 'route_prot_mapping_list' )
})


// 路由器 端口映射 新建/修改
// 动作
$("#ew_router_map_btn_sure").click(function(){
    var element = current_element();
    var table_data = {
        new_router_map_name:{
            msg:'映射名称不能为空',
            key:'mapping_name',
        },
        new_router_map_gwdz:{
            msg:'公网地址不能为空',
            key:'pub_net_address'
        },
        new_router_map_swdz:{
            msg:'私网地址不能为空',
            key:'pri_net_address'
        },
        new_router_map_dkzz:{
            msg:'端口转换不能为空',
            key:'is_convert',
            empty:true
        },
        new_router_map_select:{
            msg:'协议不能为空',
            key:'protocol',
            empty:true
        },
        new_router_map_gwdk:{
            msg:'公网端口不能为空',
            key:'pub_net_port'
        },
        new_router_map_swdk:{
            msg:'私网端口不能为空',
            key:'pri_net_port'
        }
    }
    var list = [
        {
            type:'checkbox',
            name:'route_prot_mapping_list',
        },
        {
            value:'mapping_name'
        },
        {
            value:'pub_net_address'
        },
        {
            value:'pri_net_address'
        },
        {
            value:'protocol'
        },
        {
            value:'pub_net_port'
        },
        {
            value:'pri_net_port'
        },
    ]
    var data = {
        table_data:table_data,
        net_action:element.route_prot_mapping_action,
        net_action_id:element.route_prot_mapping_id,
        net_action_name:'route_prot_mapping_list',
        element_key:'route_prot_mapping',
        list:list
    };
    dynamicAdd(data,$(this));

})




// ====================================== 路由器 接口 ======================================

// 路由器 获取接口信息
$('#router_wan_lan_hold').click(function(){
    var wan = $("#router_zero_wan").val()
    var lan = $("#router_zero_lan").val()

})



// 路由器 接口配置 编辑
// 页面
$('#modal-router-form-3-btn').click(//编辑
    function () {
        var check_obj = editlist('route_interface_list')
        if( !check_obj ){
            return;
        }
        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.route_interface_id = check_id;

        if( element.netdata['interface_list']['data'][check_id]['status'] == 'up' ){
            $("#router_port1").prop('checked',true);
        }else{
            $("#router_port2").prop('checked',true);
        }

        $("#router_port_rate").val( element.netdata['interface_list']['data'][check_id].speed );
        $("#routert_port_status").val( element.netdata['interface_list']['data'][check_id].duplex )
        $("#new_router_port_ipadd").val( element.netdata['interface_list']['data'][check_id].ip_addr )
        $("#new_router_port_zwym").val( element.netdata['interface_list']['data'][check_id].netmask )
        $("#new_router_port_wg").val( element.netdata['interface_list']['data'][check_id].gateway )
        $('#new_router_port').show();
    }
);


// 路由器 接口 编辑
// 动作
$("#new_router_port_btn_sure").click(function(){
    var element = current_element();
    var co = 'down';
    if( $("[name='new_router_port_kg']:checked").val() == '1' ){
        co = 'up';
    }
    var saveobj = element['netdata']['interface_list']['data'][element.route_interface_id]
    saveobj.status = co
    saveobj.speed = $("#router_port_rate").val()
    saveobj.duplex = $("#routert_port_status").val()
    saveobj.ip_addr = $("#new_router_port_ipadd").val()
    saveobj.netmask = $("#new_router_port_zwym").val()
    saveobj.gateway = $("#new_router_port_wg").val()
    if( saveobj.duplex.toLowerCase() == 'full' ){
        var duplex = '全双工';
    }else if ( saveobj.duplex.toLowerCase() == 'falf' ) {
        var duplex = '半双工';
    }else{
        var duplex = '自适应';
    }
    var str = '';
    str += '<td style="width: 50px;" ><input type="checkbox" name="route_interface_list" value="'+element.route_interface_id+'"></td>';
    str += '<td style="width: 50px;" >'+element.route_interface_id+'</td>';
    str += '<td style="width: 50px;" >'+co+'</td>';
    str += '<td style="width: 50px;" >'+saveobj.speed+'</td>';
    str += '<td style="width: 50px;" >'+duplex+'</td>';
    str += '<td style="width: 50px;" >none</td>';
    str += '<td style="width: 50px;" >' + saveobj.ip_addr + '</td>';
    str += '<td style="width: 50px;" >' + saveobj.netmask + '</td>';
    str += '<td style="width: 50px;" >' + saveobj.gateway + '</td>';
    $('[name="route_interface_list"][value="'+element.route_interface_id+'"]').parents('tr').html(str);
    $(this).parents('div').find('.modal_2_btn_exit').click()
})


// ====================================== 防火墙 ======================================

// 防火墙 接口配置 编辑
// 页面
$('#modal-firewall-form-3-btn').click(//编辑
    function () {
        var check_obj = editlist('firewall_interface_list')
        if( !check_obj ){
            return;
        }
        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.firewall_interface_id = check_id;

        if( element.netdata['interface_list']['data'][check_id]['status'] == 'up' ){
            $("#new_firewall_port_1").prop('checked',true);
        }else{
            $("#new_firewall_port_2").prop('checked',true);
        }

        $("#firewall_port_rate").val( element.netdata['interface_list']['data'][check_id].speed );
        $("#firewall_port_status_type").val( element.netdata['interface_list']['data'][check_id].duplex )
        $("#firewall_port_link_type").val( element.netdata['interface_list']['data'][check_id].link_type )
        $("#firewall_port_ip").val( element.netdata['interface_list']['data'][check_id].ip_addr )
        $("#firewall_port_mask").val( element.netdata['interface_list']['data'][check_id].netmask )
        $("#firewall_port_status").val( element.netdata['interface_list']['data'][check_id].gateway )

        $('#new_firewall_port').show();
    }
);


// 防火墙 接口 编辑
// 动作
$("#firewall_modal2_s").click(function(){
    var element = current_element();
    var co = 'down';
    if( $("[name='firewall_kg']:checked").val() == '1' ){
        co = 'up';
    }
    var saveobj = element['netdata']['interface_list']['data'][element.firewall_interface_id]

    saveobj.status = co
    saveobj.speed = $("#firewall_port_rate").val()
    saveobj.duplex = $("#firewall_port_status_type").val()
    saveobj.ip_addr = $("#firewall_port_ip").val()
    saveobj.netmask = $("#firewall_port_mask").val()
    saveobj.gateway = $("#firewall_port_status").val()

    if( saveobj.duplex.toLowerCase() == 'full' ){
        var duplex = '全双工';
    }else if ( saveobj.duplex.toLowerCase() == 'falf' ) {
        var duplex = '半双工';
    }else{
        var duplex = '自适应';
    }
    var str = '';
    str += '<td style="width: 50px;" ><input type="checkbox" name="firewall_interface_list" value="'+element.firewall_interface_id+'"></td>';
    str += '<td style="width: 50px;" >'+element.firewall_interface_id+'</td>';
    str += '<td style="width: 50px;" >'+co+'</td>';
    str += '<td style="width: 50px;" >'+saveobj.speed+'</td>';
    str += '<td style="width: 50px;" >'+duplex+'</td>';
    str += '<td style="width: 50px;" >'+saveobj.type+'</td>';
    str += '<td style="width: 50px;" >' + saveobj.ip_addr + '</td>';
    str += '<td style="width: 50px;" >' + saveobj.netmask + '</td>';
    str += '<td style="width: 50px;" >' + saveobj.gateway + '</td>';
    $('[name="firewall_interface_list"][value="'+element.firewall_interface_id+'"]').parents('tr').html(str);
    $(this).parents('div').find('.modal_2_btn_exit').click()
})



// ---------------------------------- 防火墙 NET --------------------------------------------

// 防火墙 NET 建新
// 页面
$('#modal-firewall-form-11-btn').click(
    function () {
        var element = current_element();
        element.firewall_net_action = 'add';
        resetForm($('#new_firewall_nat_dzc').parents('form'));
        $('#new_firewall_nat').show();
    }
);

// 防火墙 NET 编辑
// 页面
$('#modal-firewall-form-12-btn').click(//编辑
    function () {
        var check_obj = editlist('firewall_net_list')
        if( !check_obj ){
            return;
        }
        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.firewall_net_id = check_id;
        element.firewall_net_action = 'edit';

        $("#new_firewall_nat_dzc").val( element.netdata['firewall_net']['data'][check_id].address_pool );
        $("#new_firewall_nat_yyjk_f").val( element.netdata['firewall_net']['data'][check_id].net )
        $("#firewall_nat_input1").val( element.netdata['firewall_net']['data'][check_id].start_ip )
        $("#firewall_nat_input2").val( element.netdata['firewall_net']['data'][check_id].end_ip )

        $('#new_firewall_nat').show();
    }
);


// 防火墙 NET 删除
// 动作
$("#modal-firewall-form-13-btn").click(function(){
    deletelist( 'firewall_net' , 'firewall_net_list' )
})


// 防火墙 NET 新建/修改
// 动作
$("#new_firewall_nat_btn_sure").click(function(){
    var element = current_element();
    var table_data = {
        new_firewall_nat_dzc:{
            msg:'地址池名称不能为空',
            key:'address_pool',
        },
        new_firewall_nat_yyjk_f:{
            msg:'应用接口',
            key:'net',
            empty:true
        },
        firewall_nat_input1:{
            msg:'起始地址不能为空',
            key:'start_ip'
        },
        firewall_nat_input2:{
            msg:'结束地址不能为空',
            key:'end_ip'
        },
    }
    var list = [
        {
            type:'checkbox',
            name:'firewall_net_list',
        },
        {
            value:'address_pool'
        },
        {
            value:'net'
        },
        {
            value:'start_ip'
        },
        {
            value:'end_ip'
        },
    ]
    var data = {
        table_data:table_data,
        net_action:element.firewall_net_action,
        net_action_id:element.firewall_net_id,
        net_action_name:'firewall_net_list',
        element_key:'firewall_net',
        list:list
    };
    dynamicAdd(data,$(this));

})





// ---------------------------------- 防火墙 静态路由 --------------------------------------------



// 防火墙 静态路由 建新
// 页面
$('#modal-router-form-5-btn-firewall').click(
    function () {
        var element = current_element();
        element.firewall_static_route_action = 'add';
        resetForm($('#new_firewall_status_mbwd').parents('form'));
        $('#new_firewall_status').show();
    }
);

// 防火墙 静态路由 编辑
// 页面
$('#modal-router-form-6-btn-firewall').click(//编辑
    function () {

        var check_obj = editlist('firewall_static_route_list')
        if( !check_obj ){
            return;
        }

        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.firewall_static_route_id = check_id;
        element.firewall_static_route_action = 'edit';

        $("#new_firewall_status_mbwd").val( element.netdata['firewall_static_route']['data'][check_id].net_duan );
        $("#new_firewall_status_ymcd").val( element.netdata['firewall_static_route']['data'][check_id].mask_leng )
        $("#new_firewall_status_xyt").val( element.netdata['firewall_static_route']['data'][check_id].next )

        $('#new_firewall_status').show();
    }
);

// 防火墙 静态路由 删除
// 动作
$("#modal-router-form-7-btn-firewall").click(function(){
    deletelist( 'firewall_static_route' , 'firewall_static_route_list' )
})

// 防火墙 静态路由 新建/修改
//  动作
$("#new_firewall_status_btn_sure").click(function(){
    var element = current_element();
    var table_data = {
        new_firewall_status_mbwd:{
            msg:'目标网段不能为空',
            key:'net_duan',
        },
        new_firewall_status_ymcd:{
            msg:'掩码长度不能为空',
            key:'mask_leng'
        },
        new_firewall_status_xyt:{
            msg:'下一跳不能为空',
            key:'next'
        },
    }
    var list = [
        {
            type:'checkbox',
            name:'firewall_static_route_list',
        },
        {
            value:'net_duan'
        },
        {
            value:'mask_leng'
        },
        {
            value:'next'
        },
    ]
    var data = {
        table_data:table_data,
        net_action:element.firewall_static_route_action,
        net_action_id:element.firewall_static_route_id,
        net_action_name:'firewall_static_route_list',
        element_key:'firewall_static_route',
        list:list
    };
    dynamicAdd(data,$(this));

})





// ---------------------------------- 防火墙 安全策略 --------------------------------------------



// 安全策略 静态路由 建新
// 页面
$('#modal-firewall-form-5-btn').click(
    function () {
        var element = current_element();
        element.firewall_safe_action = 'add';
        resetForm($('#new_firewall_saf_name').parents('form'));
        $('#new_firewall_saf').show();
    }
);

// 安全策略 静态路由 编辑
// 页面
$('#modal-firewall-form-6-btn').click(//编辑
    function () {

        var check_obj = editlist('firewall_safe_list')
        if( !check_obj ){
            return;
        }

        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.firewall_safe_id = check_id;
        element.firewall_safe_action = 'edit';

        if( element.netdata['firewall_safe']['data'][check_id].stauts == 'on' ){
            $("#port1_saf").prop('checked',true)
        }else{
            $("#port2_saf").prop('checked',true)
        }
        // 策略名称
        $("#new_firewall_saf_name").val( element.netdata['firewall_safe']['data'][check_id].name );
        // 流量方向
        $("#firewall_port_status_llfx").val( element.netdata['firewall_safe']['data'][check_id].direction )
        // 源地址
        $("#new_firewall_saf_yuan").val( element.netdata['firewall_safe']['data'][check_id].source_add )
        // 源端口范围
        $("#new_firewall_saf_yuan_rate").val( element.netdata['firewall_safe']['data'][check_id].source_port );
        // 目的地址
        $("#new_firewall_saf_yuan_add").val( element.netdata['firewall_safe']['data'][check_id].target_add )
        // 服务类型
        $("#new_firewall_saf_stype").val( element.netdata['firewall_safe']['data'][check_id].service )
        // 策略动作
        $("#firewall_port_status_d").val( element.netdata['firewall_safe']['data'][check_id].policy );

        $('#new_firewall_saf').show();
    }
);

// 安全策略 静态路由 删除
// 动作
$("#modal-firewall-form-7-btn").click(function(){
    deletelist( 'firewall_safe' , 'firewall_safe_list' )
})

// 安全策略 静态路由 新建/修改
//  动作
$("#new_firewall_saf_btn_sure").click(function(){
    var element = current_element();
    var table_data = {
        new_firewall_saf_kg:{
            type:'radio',
            key:'status',
            empty:true
        },
        new_firewall_saf_name:{
            msg:'策略名称不能为空',
            key:'name',
        },
        firewall_port_status_llfx:{
            msg:'流量方向不能为空',
            key:'direction'
        },
        new_firewall_saf_yuan:{
            msg:'源地址不能为空',
            key:'source_add'
        },
        new_firewall_saf_yuan_rate:{
            msg:'源端口范围不能为空',
            key:'source_port',
        },
        new_firewall_saf_yuan_add:{
            msg:'目的地址不能为空',
            key:'target_add'
        },
        new_firewall_saf_stype:{
            msg:'服务类型不能为空',
            key:'service'
        },
        firewall_port_status_d:{
            msg:'选择策略动作',
            key:'policy'
        },
    }
    var list = [
        {
            type:'checkbox',
            name:'firewall_safe_list',
        },
        {
            value:'name'
        },
        {
            value:'status'
        },
        {
            value:'direction'
        },
        {
            value:'source_add'
        },
        {
            value:'source_port'
        },
        {
            value:'target_add'
        },
        {
            value:'service'
        },
        {
            value:'policy'
        },
    ]
    var data = {
        table_data:table_data,
        net_action:element.firewall_safe_action,
        net_action_id:element.firewall_safe_id,
        net_action_name:'firewall_safe_list',
        element_key:'firewall_safe',
        list:list
    };
    dynamicAdd(data,$(this));

})





// ---------------------------------- 防火墙 服务类型 --------------------------------------------



// 防火墙 服务类型 建新
// 页面
$('#modal-firewall-form-8-btn').click(function () {
        var element = current_element();
        element.firewall_service_action = 'add';
        resetForm($('#new_firewall_sertype_lx').parents('form'));
        $('#new_firewall_sertype').show();
});

// 防火墙 服务类型 编辑
// 页面
$('#modal-firewall-form-9-btn').click(//编辑
    function () {

        var check_obj = editlist('firewall_service_list')
        if( !check_obj ){
            return;
        }

        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.firewall_service_id = check_id;
        element.firewall_service_action = 'edit';

        // 服务类型
        $("#new_firewall_sertype_lx").val( element.netdata['firewall_service']['data'][check_id].service_type );
        // 协议类型
        $("#firewall_type2").val( element.netdata['firewall_service']['data'][check_id].protocol_type )

        $("#firewall_type_input1").val( element.netdata['firewall_service']['data'][check_id].port_1 )

        $("#firewall_type_input2").val( element.netdata['firewall_service']['data'][check_id].port_2 );

        $('#new_firewall_sertype').show();
    }
);

// 防火墙 服务类型 删除
// 动作
$("#modal-firewall-form-10-btn").click(function(){
    deletelist( 'firewall_service' , 'firewall_service_list' )
})

// 防火墙 服务类型 新建/修改
//  动作
$("#new_firewall_sertype_btn_sure").click(function(){
    var element = current_element();
    var table_data = {
        new_firewall_sertype_lx:{
            msg:'服务类型不能为空',
            key:'service_type',
        },
        firewall_type2:{
            msg:'协议类型不能为空',
            key:'protocol_type'
        },
        firewall_type_input1:{
            msg:'端口不能为空',
            key:'port_1'
        },
        firewall_type_input2:{
            msg:'端口不能为空',
            key:'port_2',
        },
    }
    var list = [
        {
            type:'checkbox',
            name:'firewall_service_list',
        },
        {
            value:'id'
        },
        {
            value:'service_type'
        },
        {
            value:'protocol_type'
        },
        {
            value:'port_1'
        },
        {
            value:'port_2'
        },
    ]
    var data = {
        table_data:table_data,
        net_action:element.firewall_service_action,
        net_action_id:element.firewall_service_id,
        net_action_name:'firewall_service_list',
        element_key:'firewall_service',
        list:list
    };
    dynamicAdd(data,$(this));

})





// ====================================== SND交换机 ======================================


// ---------------------------------- SND交换机 接口 --------------------------------------------


// 防火墙 接口配置 编辑
// 页面
$('#modal-switchboard-sdn-form-6-btn').click(function () {
        var check_obj = editlist('sdn_interface_list')
        if( !check_obj ){
            return;
        }
        var element = current_element();
        var check_id = check_obj.val();

        // 记录修改的ID
        element.sdn_interface_id = check_id;

        if( element.netdata['interface_list']['data'][check_id]['status'] == 'up' ){
            $("#sdn_port12").prop('checked',true);
        }else{
            $("#sdn_port22").prop('checked',true);
        }

        $("#sdn_port_rate2").val( element.netdata['interface_list']['data'][check_id].speed );
        $("#sdn_port_status2").val( element.netdata['interface_list']['data'][check_id].duplex )
        $('#sdn_new_port2').show();
});


// 防火墙 接口 编辑
// 动作
$("#sdn_new_port_btn_sure2").click(function(){
    var element = current_element();
    var co = 'down';
    if( $("[name='sdn_port_kg2']:checked").val() == '1' ){
        co = 'up';
    }

    var saveobj = element['netdata']['interface_list']['data'][element.sdn_interface_id]

    saveobj.status = co
    saveobj.speed = $("#sdn_port_rate2").val()
    saveobj.duplex = $("#sdn_port_status2").val()


    if( saveobj.duplex.toLowerCase() == 'full' ){
        var duplex = '全双工';
    }else if ( saveobj.duplex.toLowerCase() == 'falf' ) {
        var duplex = '半双工';
    }else{
        var duplex = '自适应';
    }
    var str = '';
    str += '<td style="width: 50px;" ><input type="checkbox" name="sdn_interface_list" value="'+element.sdn_interface_id+'"></td>';
    str += '<td style="width: 50px;" >'+element.sdn_interface_id+'</td>';
    str += '<td style="width: 50px;" >'+co+'</td>';
    str += '<td style="width: 50px;" >'+saveobj.speed+'</td>';
    str += '<td style="width: 50px;" >'+duplex+'</td>';
    $('[name="sdn_interface_list"][value="'+element.sdn_interface_id+'"]').parents('tr').html(str);
    $(this).parents('div').find('.modal_2_btn_exit').click()
})




// 编辑 公共 函数
function editlist( name ){
    var check_obj = $('input:checkbox[name="'+name+'"]:checked');
    if( check_obj.length == 0 ){
        alert('请选择');
        return false;
    }
    if( check_obj.length > 1 ){
        alert('一次只能编辑一条记录');
        return false;
    }
    return check_obj;
}

// 删除 公共 函数
function deletelist( node,name ){
    // node 对象key名称
    // name inputcheckbox name
    var element = current_element();
    var check_obj = $('input:checkbox[name="'+name+'"]:checked');
    if( check_obj.length == 0 ){
        alert('请选择');return;
    }

    check_obj.each(function(){
        var id  = $(this).val();
        delete element.netdata[node]['data'][id];
        $(this).parents('tr').remove();
    })
}


// 判断字符是否为空 并提示
function alertMsg( str , msg ){
    if( str )
        return true;
    alert(msg);
    return false;
}

// 重设表单 resetForm()
function resetForm( obj ){
    obj.get(0).reset()
}

// 恢复数据
var restore = {
    init_interface:function(type){
        if(
            type == 'u380'
            || type == 'u384'
        ){
            this.client_server_interface();
        }
        if(
            type == 'usw3'
            || type == 'usw2'
            || type == 'usw1'
        ){
            this.switch_vlan_show( type );
            this.switch_48_optical();
        }
        if( type == 'usw4' ){
            this.switch_vlan_show( type );
            this.switch_48_electrical_4_optical();
        }
        if( type == 'usw5' ){
            this.switch_vlan_show( type );
            this.switch_24_optical();
        }
        // 路由器
        if( type == 'u382' ){
            this.route_interface();
        }
        // 防火墙
        if( type == 'u388' ){
            this.firewall_interface()
        }
        // SDN 交换机
        if( type == 'u1811' ){
            this.sdn_interface()
        }
    },
    restore:function( type ){
        this.init_data()

        if( type == 'u384' ){
            this.server_web();
            this.server_dns();
        }

        if( type == 'usw1' ){
            this.switch_vlan_show( type );
            this.switch_48_electrical();
            this.switch_mirror();
        }
        if( type == 'usw2' ){
            this.switch_vlan_show( type );
            this.switch_48_optical();
            this.switch_mirror();
        }
        if( type == 'usw3' ){
            this.switch_vlan_show( type );
            this.switch_48_optical();
            this.switch_mirror();
            this.switch_static_route();
        }
        if( type == 'usw4' ){
            this.switch_vlan_show( type );
            this.switch_48_electrical_4_optical();
            this.switch_mirror();
            this.switch_static_route();
        }
        if( type == 'usw5' ){
            this.switch_vlan_show( type );
            this.switch_24_optical();
            this.switch_mirror();
            this.switch_static_route();
        }
        // 路由器
        if( type == 'u382' ){
            this.route_interface();
            this.route_static_route();
            this.route_net();
            this.route_dynamic();
            this.route_port_mapping()
        }

        // 防火墙
        if( type == 'u388' ){

            this.firewall_interface()
            this.firewall_net();
            this.firewall_static_route();
            this.firewall_safe()
            this.firewall_service()
        }

        // SDN 交换机
        if( type == 'u1811' ){
            this.sdn_interface()
        }
    },
    client_server_interface:function(){
        var element = current_element();
        if( !element.netdata['interface_list'] ){
            element.netdata['interface_list'] = {data:{}};
        }
        element.netdata['interface_list']['data'][ 'eth0' ] = {
            interface:'eth0',
        }
    },
    server_web:function(){
        if( $("#web2").is(':checked') ){
            $("#ser_port").hide()
        }else{
            $("#ser_port").show()
        }
    },
    init_data:function(){
        var element = current_element();
        if(
            element.type == 'usw1'
            || element.type == 'usw2'
        ){
            element.vlan_checkbox_name = 'switch_2_electrical_checkbox';
            element.interface_checkbox_name = 'switch_2layer_checkbox';
            element.interface_table_id = 'modal-switchboard-form-2-table2'

            element.mirror_monitor_port_name = 'monitor_port_check_2c'
            element.mirror_mirror_port_name = 'mirror_port_check_2c'
            element.mirror_list_name = 'monitor_list_name_2c'
            element.mirror_table_id = 'modal-switchboard-form-3-table2'
        }else if(
            element.type == 'usw3'
            || element.type == 'usw4'
            || element.type == 'usw5'
        ){
            element.vlan_checkbox_name = 'switch_3_electrical_checkbox';
            element.interface_checkbox_name = 'switch_3layer_checkbox';
            element.interface_table_id = 'modal-switchboard-form-2-table'

            element.mirror_monitor_port_name = 'monitor_port_check_3c'
            element.mirror_mirror_port_name = 'mirror_port_check_3c'
            element.mirror_list_name = 'monitor_list_name_3c'
            element.mirror_table_id = 'modal-switchboard-form-3-table'
        }
    },
    server_dns:function() {
        if( $("#DNS2").is(':checked') ){
            $("#sdn_port").hide()
        }else{
            $("#sdn_port").show()
        }
        var element = current_element();
        if (!element.netdata['dnslist'] || JSON.stringify(element.netdata['dnslist'].data) == '{}'){
            $("#modal-form-1-table").find('tbody tr').not(":first").remove();
            return;
        }
        var table_obj = $("#"+element.netdata['dnslist']['table_id']);
        table_obj.find('tbody tr').not(":first").remove();

        for( var i in element.netdata['dnslist'].data ){
            var str = '<tr>';
            str += '<td style="width: 50px;" ><input type="checkbox" name="dns_ser_checkbox" value="'+element.netdata['dnslist'].data[i].id+'"></td>';
            str += '<td style="width: 50px;" >'+element.netdata['dnslist'].data[i].ip+'</td>';
            str += '<td style="width: 50px;" >'+element.netdata['dnslist'].data[i].domain+'</td>';
            str += '</tr>';
            table_obj.find('tbody').append( str )
        }
    },
    // vlan 展示页面
    switch_vlan_show:function( type ){
        var element = current_element();

        if (!element.netdata['vlan_list'] || JSON.stringify(element.netdata['vlan_list'].data) == '{}'){

            if(
                type == 'usw1'
                || type == 'usw2'
            ){
                $("#modal-switchboard-form-1-table2").find('tbody tr').not(":first").remove();
            }else{
                $("#modal-switchboard-form-1-table").find('tbody tr').not(":first").remove();
            }
            return;
        }

        var table_obj = $("#"+element.netdata['vlan_list']['table_id']);
        table_obj.find('tbody tr').not(":first").remove();

        for( var i in element.netdata['vlan_list'].data ){
            var str = '<tr>';
            str += '<td style="width: 50px;"><input type="checkbox" name="'+element.vlan_checkbox_name+'" value="'+element.netdata['vlan_list'].data[i].id+'"></td>';
            str += '<td style="width: 50px;">'+element.netdata['vlan_list'].data[i].vlan_id+'</td>';
            str += '<td style="width: 50px;">'+element.netdata['vlan_list'].data[i].describe+'</td>';
            if(
                element.type == 'usw3'
                || element.type == 'usw4'
                || element.type == 'usw5'
            ){
                str += '<td style="width: 50px;">'+element.netdata['vlan_list'].data[i].ip+'</td>';
                str += '<td style="width: 50px;">'+element.netdata['vlan_list'].data[i].mask+'</td>';
            }

            if( element['netdata']['vlan_list']['interface_id_ed'] && element['netdata']['vlan_list']['interface_id_ed'][ element.netdata['vlan_list'].data[i].id ] ){
                var text = '';
                for( interface_name in element['netdata']['vlan_list']['interface_id_ed'][ element.netdata['vlan_list'].data[i].id ] ){
                    text += interface_name + '/'
                }
                str += '<td style="width: 50px;">'+text+'</td>';
            }else{
                str += '<td style="width: 50px;"></td>';
            }

            str += '</tr>';
            table_obj.find('tbody').append( str )
        }
    },
    switch_48_electrical:function(){
        this.switch_restore({
            electrical_port_num:48,
            optical_port_num:0
        })
    },
    switch_48_optical:function(){
        this.switch_restore({
            electrical_port_num:0,
            optical_port_num:48
        })
    },
    switch_48_electrical_4_optical:function(){
        this.switch_restore({
            electrical_port_num:48,
            optical_port_num:4
        })
    },
    switch_24_optical:function(){
        this.switch_restore({
            electrical_port_num:0,
            optical_port_num:24
        })
    },
    switch_restore:function(data){
        var element = current_element();

        if( element.netdata['interface_list'] ){
            var data = [];
            for( var i in element.netdata['interface_list'].data ){
                data.push(element.netdata['interface_list'].data[i] )
            }
            restore.switch_2layer_html( data );
            return;
        }

        $.getJSON('http://10.10.1.67:8080/net/index.php/topo_manage/topo_manage/produce_switch_port_info?callback=?',data,function(data){
            if( data.retCode == 0 && data.eth_list ){
                restore.switch_2layer_html( data.eth_list );
                restore.switch_2layer_addnetobj( data.eth_list );
            }
        }).error(function () {
            alert( '获取接口失败' )
        })
    },
    switch_2layer_html:function(data){
        var element = current_element();
        var table_obj = $("#"+element.interface_table_id);
        table_obj.find('tbody tr').not(":first").remove();
        for(var i=0;i<data.length;i++){
            if( data[i].duplex.toLowerCase() == 'full' ){
                var duplex = '全双工';
            }else if ( data[i].duplex.toLowerCase() == 'falf' ) {
                var duplex = '半双工';
            }else{
                var duplex = '自适应';
            }
            var str = '<tr>';
            str += '<td style="width: 50px;" ><input type="checkbox" name="'+element.interface_checkbox_name+'" value="'+data[i].interface+'"></td>';
            str += '<td style="width: 50px;" >'+data[i].interface+'</td>';
            str += '<td style="width: 50px;" >'+data[i].status+'</td>';
            str += '<td style="width: 50px;" >'+data[i].speed+'</td>';
            str += '<td style="width: 50px;" >'+duplex+'</td>';

            if( data[i].link_type ){
                str += '<td style="width: 50px;" >'+data[i].link_type+'</td>';
            }else{
                str += '<td style="width: 50px;" ></td>';
            }

            if( data[i].vlan_id && element['netdata']['vlan_list']['data'][data[i].vlan_id]  ){
                str += '<td style="width: 50px;" >'+element['netdata']['vlan_list']['data'][data[i].vlan_id].vlan_id+'</td>';
            }else{
                str += '<td style="width: 50px;" ></td>';
            }


            str += '</tr>';
            table_obj.find('tbody').append( str );
        }
    },
    switch_2layer_addnetobj:function(data){
        var element = current_element();
        for(var i=0;i<data.length;i++){
            // 把接口信息添加到对象中
            if( !element.netdata['interface_list'] ){
                element.netdata['interface_list'] = {data:{}};
            }
            element.netdata['interface_list']['data'][ data[i].interface ] = {
                duplex:data[i].duplex,
                interface:data[i].interface,
                speed:data[i].speed,
                status:data[i].status,
                type:data[i].type,
            }
        }
    },
    switch_mirror:function(){
        var element = current_element();
        var table_obj = $("#"+element.mirror_table_id)

        table_obj.find('tbody tr').not(":first").remove();

        if( element.netdata['mirror'] && element.netdata['mirror']['data' ] ){
            var str = '';
            for( var i in element.netdata['mirror']['data'] ){
                var monitor_port_str = '';
                var mirror_port_str = '';
                for( var net in element.netdata['mirror']['data'][i]['monitor_port'] ){
                    monitor_port_str+=net+'/'
                }
                for( var net in element.netdata['mirror']['data'][i]['mirror_port'] ){
                    mirror_port_str+=net+'/'
                }
                str += '<tr>'
                str += '<td><input type="checkbox" name="'+element.mirror_list_name+'" value="'+element.netdata['mirror']['data'][i].id+'"></td>'
                str += '<td>'+element.netdata['mirror']['data'][i].mirror_id+'</td>'
                str += '<td>Active</td>'
                str += '<td>'+monitor_port_str+'</td>'
                str += '<td>'+mirror_port_str+'</td>'
                str += '<td>'+element.netdata['mirror']['data'][i].flow_type+'</td>'
                str += '</tr>'
            }
            table_obj.append( str );
        }
    },
    // 交换机 镜像页面 数据恢复
    switch_mirror_edit:function(){
        var element = current_element();

        if( !element.netdata['mirror'] ){
            element.netdata['mirror'] = { id:1 , data:{} , interface:{} };
        }

        var key = 1;
        if(
            element.type == 'usw1'
            || element.type == 'usw2'
        ){
            var key = 0;
        }

        form = {
            mirror_group:['new_mi_id2','new_mi_id'],
            html_id:['new_mi2','new_mi'],
            flow:[ 'new_mi_flux_node2','new_mi_flux_node' ],
            duplex:['port_status2','port_status'],
        }


        var str = '<option value="0">请选择</option>'
        for( var i=1;i<5;i++ ){
            if(
                element['netdata']['mirror']
                && element['netdata']['mirror']['ids']
                && element['netdata']['mirror']['ids'][i]
            ){
                if(  element.mirror_action == 'edit'
                    && element['netdata']['mirror']['data'][element.mirror_edit_id ]['mirror_id'] == i
                ){
                    str+='<option value="'+i+'">'+i+'</option>';
                }
            }else{

                str+='<option value="'+i+'">'+i+'</option>';
            }
        }

        $("#"+form['mirror_group'][key]).html('').append( str );
        $("#"+form['html_id'][key]+" .monitor_port,#"+form['html_id'][key]+" .mirror_port").html('');

        if( element.mirror_action == 'edit' ){
            var mirror_id = element['netdata']['mirror']['data'][element.mirror_edit_id]['mirror_id']
            var flow_type = element['netdata']['mirror']['data'][element.mirror_edit_id]['flow_type']
            $("#"+form['mirror_group'][key]).val ( mirror_id );
            $("#"+form['flow'][key]).val( flow_type );
        }

        if( element['netdata']['interface_list'] && element['netdata']['interface_list']['data']){
            var data = element['netdata']['interface_list']['data'];
            for ( i in data ){
                var str = '<span style="width:50px;display: inline-block;" ><input type="checkbox" name="'+element.mirror_monitor_port_name+'" class="m_monitor_port" value="'+data[i].interface+'" >'+data[i].interface+"</span>";
                $("#"+form['html_id'][key]+" .monitor_port").append( str );
            }

            for ( i in data ){
                var str = '<span style="width:50px;display: inline-block;" ><input type="checkbox" name="'+element.mirror_mirror_port_name+'" class="m_mirror_port" value="'+data[i].interface+'" >'+data[i].interface+"</span>";
                $("#"+form['html_id'][key]+" .mirror_port").append( str );
            }
        }

        if( element['netdata']['mirror']['data'] ){
            for( var data_id in element['netdata']['mirror']['data'] ){
                if( element.mirror_edit_id && element.mirror_edit_id==data_id ){
                    continue;
                }
                for( var mirror_ed in element['netdata']['mirror']['data'][data_id]['mirror_port'] ){
                    $('[name="'+element.mirror_mirror_port_name+'"][value="'+mirror_ed+'"]').attr('disabled','disabled')
                    $('[name="'+element.mirror_monitor_port_name+'"][value="'+mirror_ed+'"]').attr('disabled','disabled')
                }
                for( var monitor_ed in element['netdata']['mirror']['data'][data_id]['monitor_port'] ){
                    $('[name="'+element.mirror_monitor_port_name+'"][value="'+monitor_ed+'"]').attr('disabled','disabled')
                    $('[name="'+element.mirror_mirror_port_name+'"][value="'+monitor_ed+'"]').attr('disabled','disabled')
                }
            }
        }

        if( element.mirror_edit_id ){
            for( intface in element['netdata']['mirror']['data'][element.mirror_edit_id]['monitor_port'] ){
                $('[name="'+element.mirror_monitor_port_name+'"][value="'+intface+'"]').click()
            }
            for( intface in element['netdata']['mirror']['data'][element.mirror_edit_id]['mirror_port'] ){
                $('[name="'+element.mirror_mirror_port_name+'"][value="'+intface+'"]').click()
            }
        }

    },
    switch_static_route:function(){
        var element = current_element();
        var table_obj = $("#modal-switchboard-form-4-table")
        table_obj.find('tbody tr').not(":first").remove();

        if( element.netdata['static_route'] && element.netdata['static_route']['data' ] ){
            var str = '';
            for( var i in element.netdata['static_route']['data'] ){
                str += '<tr>'
                str += '<td><input type="checkbox" name="static_route_list" value="'+element.netdata['static_route']['data'][i].id+'"></td>'
                str += '<td>'+element.netdata['static_route']['data'][i].net_duan+'</td>'
                str += '<td>'+element.netdata['static_route']['data'][i].mask_leng+'</td>'
                str += '<td>'+element.netdata['static_route']['data'][i].next+'</td>'
                str += '</tr>'
            }
            table_obj.append( str );
        }
    },
    route_interface:function(){
        var element = current_element();
        var table_obj = $("#modal-router-form-1-table")
        table_obj.find('tbody tr').not(":first").remove();
        if( element.netdata['interface_list'] && element.netdata['interface_list']['data'] ){

            var str = '';
            for( var i in element.netdata['interface_list']['data'] ){
                str += '<tr>'
                str += '<td style="width: 50px;" ><input type="checkbox" name="route_interface_list" value="'+i+'"></td>';
                str += '<td style="width: 50px;" >'+i+'</td>';
                str += '<td style="width: 50px;" >'+element.netdata['interface_list']['data'][i].status+'</td>';

                if (element.netdata['interface_list']['data'][i].duplex.toLowerCase() == 'full') {
                    var duplex = '全双工';
                } else if (element.netdata['interface_list']['data'][i].duplex.toLowerCase() == 'falf') {
                    var duplex = '半双工';
                } else {
                    var duplex = '自适应';
                }
                str += '<td style="width: 50px;" >'+element.netdata['interface_list']['data'][i].speed+'</td>';
                str += '<td style="width: 50px;" >'+duplex+'</td>';
                str += '<td style="width: 50px;" >' + element.netdata['interface_list']['data'][i].type + '</td>';
                str += '<td style="width: 50px;" >' + element.netdata['interface_list']['data'][i].ip_addr + '</td>';
                str += '<td style="width: 50px;" >' + element.netdata['interface_list']['data'][i].netmask + '</td>';
                str += '<td style="width: 50px;" >' + element.netdata['interface_list']['data'][i].gateway + '</td>';
                str += '</tr>'
            }
            table_obj.append( str );
        }else{
            var data = {
                wan_num:8,
                lan_num:8
            }
            $.getJSON('http://10.10.1.67:8080/net/index.php/topo_manage/topo_manage/produce_router_port_info?callback=?',data,function(re_data){
                if( re_data.retCode == 0 && re_data.eth_list ){
                    var data = re_data.eth_list;
                    var element = current_element();
                    var table_obj = $("#modal-router-form-1-table");
                    table_obj.find('tbody tr').not(":first").remove();
                    for(var i=0;i<data.length;i++) {
                        if (data[i].duplex.toLowerCase() == 'full') {
                            var duplex = '全双工';
                        } else if (data[i].duplex.toLowerCase() == 'falf') {
                            var duplex = '半双工';
                        } else {
                            var duplex = '自适应';
                        }

                        var str = '<tr>';
                        str += '<td style="width: 50px;" ><input type="checkbox" name="route_interface_list" value="' + data[i].interface + '"></td>';
                        str += '<td style="width: 50px;" >' + data[i].interface + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].status + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].speed + '</td>';
                        str += '<td style="width: 50px;" >' + duplex + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].type + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].ip_addr + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].netmask + '</td>';
                        str += '<td style="width: 50px;" ></td>';

                        str += '</tr>';
                        table_obj.find('tbody').append(str);

                        $('#modal-router-form-1-table').fadeIn();


                        if( !element.netdata['interface_list'] ){
                            element.netdata['interface_list'] = {data:{}};
                        }
                        element.netdata['interface_list']['data'][ data[i].interface ] = {
                            duplex:data[i].duplex.toLowerCase(),
                            interface:data[i].interface,
                            speed:data[i].speed,
                            status:data[i].status,
                            type:data[i].type,
                            ip_addr:data[i].ip_addr,
                            netmask:data[i].netmask,
                            gateway:''
                        }
                    }
                }
            }).error(function () {
                alert( '获取接口失败' )
            })

        }
    },
    route_static_route:function(){
        var element = current_element();
        var table_obj = $("#modal-router-form-2-table")
        table_obj.find('tbody tr').not(":first").remove();

        if( element.netdata['static_route'] && element.netdata['static_route']['data' ] ){
            var str = '';
            for( var i in element.netdata['static_route']['data'] ){
                str += '<tr>'
                str += '<td><input type="checkbox" name="route_static_route_list" value="'+element.netdata['static_route']['data'][i].id+'"></td>'
                str += '<td>'+element.netdata['static_route']['data'][i].net_duan+'</td>'
                str += '<td>'+element.netdata['static_route']['data'][i].mask_leng+'</td>'
                str += '<td>'+element.netdata['static_route']['data'][i].next+'</td>'
                str += '</tr>'
            }
            table_obj.append( str );
        }
    },
    route_net:function(){
        var element = current_element();
        var table_obj = $("#modal-router-form-3-table")
        table_obj.find('tbody tr').not(":first").remove();

        if( element.netdata['route_net'] && element.netdata['route_net']['data' ] ){
            var str = '';
            for( var i in element.netdata['route_net']['data'] ){
                str += '<tr>'
                str += '<td><input type="checkbox" name="route_net_list" value="'+element.netdata['route_net']['data'][i].id+'"></td>'
                str += '<td>'+element.netdata['route_net']['data'][i].address_pool+'</td>'
                str += '<td>'+element.netdata['route_net']['data'][i].net+'</td>'
                str += '<td>'+element.netdata['route_net']['data'][i].start_ip+'</td>'
                str += '<td>'+element.netdata['route_net']['data'][i].end_ip+'</td>'
                str += '</tr>'
            }
            table_obj.append( str );
        }
    },
    route_dynamic:function(){
        var element = current_element();
        if( !element['netdata']['route_dynamic'] ){
            element['netdata']['route_dynamic'] = {  }
        }
        if( !element.dynamic_type ){
            element.dynamic_type = 'r1-RIP'
        }
        $("#dynamic_router_select1").val('r1')
        var st = document.getElementById("dynamic_router_select1");
        var ev = document.createEvent("HTMLEvents");
        ev.initEvent("change", false, true);
        st.dispatchEvent(ev);

        this.route_dynamic_data();
    },
    route_dynamic_data:function(){
        var element = current_element();
        var dynamic_type = element.dynamic_type
        var str = '';
        if( element['netdata']['route_dynamic']
            && element['netdata']['route_dynamic'][dynamic_type]
            && element['netdata']['route_dynamic'][dynamic_type]['data']
        ){
            for( i in element['netdata']['route_dynamic'][dynamic_type]['data'] ){
                str +="<tr>";
                str += '<td >'+i+'</td>';
                str += '<td >'+element['netdata']['route_dynamic'][dynamic_type]['data'][i].net_duan+'/'+element['netdata']['route_dynamic'][dynamic_type]['data'][i].mask+'</td>';
                str +="</tr>";
            }
        }
        if( dynamic_type == 'r1-RIP' ){
            var table_id = 'dynamic_router_table1'
        }else if( dynamic_type == 'r1-OSPF' ){
            var table_id = 'dynamic_router_table2'
        }else if( dynamic_type == 'r2-bgp' ){
            var table_id = 'dynamic_router_table3_table'
        }

        $("#"+table_id).find('tbody tr').not(":first").remove();
        $("#"+table_id).append(str)
    },
    route_port_mapping:function(){

        var element = current_element();
        var table_obj = $("#modal-router-form-4-table")
        table_obj.find('tbody tr').not(":first").remove();

        if( element.netdata['route_prot_mapping'] && element.netdata['route_prot_mapping']['data' ] ){
            var str = '';
            for( var i in element.netdata['route_prot_mapping']['data'] ){
                str += '<tr>'
                str += '<td><input type="checkbox" name="route_prot_mapping_list" value="'+element.netdata['route_prot_mapping']['data'][i].id+'"></td>'
                str += '<td>'+element.netdata['route_prot_mapping']['data'][i].mapping_name+'</td>'
                str += '<td>'+element.netdata['route_prot_mapping']['data'][i].pub_net_address+'</td>'
                str += '<td>'+element.netdata['route_prot_mapping']['data'][i].pri_net_address+'</td>'
                str += '<td>'+element.netdata['route_prot_mapping']['data'][i].protocol+'</td>'
                str += '<td>'+element.netdata['route_prot_mapping']['data'][i].pub_net_port+'</td>'
                str += '<td>'+element.netdata['route_prot_mapping']['data'][i].pri_net_port+'</td>'
                str += '</tr>'
            }
            table_obj.append( str );
        }
    },
    //防火墙
    firewall_interface:function(){
        var element = current_element();
        var table_obj = $("#modal-firewall-form-1-table")
        table_obj.find('tbody tr').not(":first").remove();
        if( element.netdata['interface_list'] && element.netdata['interface_list']['data'] ){
            var str = '';
            for( var i in element.netdata['interface_list']['data'] ){
                str += '<tr>'
                str += '<td style="width: 50px;" ><input type="checkbox" name="firewall_interface_list" value="'+i+'"></td>';
                str += '<td style="width: 50px;" >'+i+'</td>';
                str += '<td style="width: 50px;" >'+element.netdata['interface_list']['data'][i].status+'</td>';

                if (element.netdata['interface_list']['data'][i].duplex.toLowerCase() == 'full') {
                    var duplex = '全双工';
                } else if (element.netdata['interface_list']['data'][i].duplex.toLowerCase() == 'falf') {
                    var duplex = '半双工';
                } else {
                    var duplex = '自适应';
                }
                str += '<td style="width: 50px;" >'+element.netdata['interface_list']['data'][i].speed+'</td>';
                str += '<td style="width: 50px;" >'+duplex+'</td>';
                str += '<td style="width: 50px;" >'+element.netdata['interface_list']['data'][i].type+'</td>';
                str += '<td style="width: 50px;" >' + element.netdata['interface_list']['data'][i].ip_addr + '</td>';
                str += '<td style="width: 50px;" >' + element.netdata['interface_list']['data'][i].netmask + '</td>';
                str += '<td style="width: 50px;" >' + element.netdata['interface_list']['data'][i].gateway + '</td>';
                str += '</tr>'
            }
            table_obj.append( str );
        }else{
            var data = {
                wan_num:1,
                lan_num:1
            }
            $.getJSON('http://10.10.1.67:8080/net/index.php/topo_manage/topo_manage/produce_router_port_info?callback=?',data,function(re_data){
                if( re_data.retCode == 0 && re_data.eth_list ){
                    var data = re_data.eth_list;
                    var element = current_element();
                    table_obj.find('tbody tr').not(":first").remove();
                    for(var i=0;i<data.length;i++) {
                        if (data[i].duplex.toLowerCase() == 'full') {
                            var duplex = '全双工';
                        } else if (data[i].duplex.toLowerCase() == 'falf') {
                            var duplex = '半双工';
                        } else {
                            var duplex = '自适应';
                        }
                        var str = '<tr>';
                        str += '<td style="width: 50px;" ><input type="checkbox" name="firewall_interface_list" value="' + data[i].interface + '"></td>';
                        str += '<td style="width: 50px;" >' + data[i].interface + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].status + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].speed + '</td>';
                        str += '<td style="width: 50px;" >' + duplex + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].type + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].ip_addr + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].netmask + '</td>';
                        str += '<td style="width: 50px;" ></td>';

                        str += '</tr>';
                        table_obj.find('tbody').append(str);

                        if( !element.netdata['interface_list'] ){
                            element.netdata['interface_list'] = {data:{}};
                        }
                        element.netdata['interface_list']['data'][ data[i].interface ] = {
                            duplex:data[i].duplex.toLowerCase(),
                            interface:data[i].interface,
                            speed:data[i].speed,
                            status:data[i].status,
                            type: data[i].type,
                            ip_addr:data[i].ip_addr,
                            netmask:data[i].netmask,
                            gateway:''
                        }
                    }
                }
            }).error(function () {
                alert( '获取接口失败' )
            })
        }

    },
    firewall_net:function(){
        var element = current_element();
        var table_obj = $("#modal-firewall-form-4-table")
        table_obj.find('tbody tr').not(":first").remove();

        if( element.netdata['firewall_net'] && element.netdata['firewall_net']['data' ] ){
            var str = '';
            for( var i in element.netdata['firewall_net']['data'] ){
                str += '<tr>'
                str += '<td><input type="checkbox" name="firewall_net_list" value="'+element.netdata['firewall_net']['data'][i].id+'"></td>'
                str += '<td>'+element.netdata['firewall_net']['data'][i].address_pool+'</td>'
                str += '<td>'+element.netdata['firewall_net']['data'][i].net+'</td>'
                str += '<td>'+element.netdata['firewall_net']['data'][i].start_ip+'</td>'
                str += '<td>'+element.netdata['firewall_net']['data'][i].end_ip+'</td>'
                str += '</tr>'
            }
            table_obj.append( str );
        }
    },
    firewall_static_route:function(){
        var element = current_element();
        var table_obj = $("#modal-router-form-2-table-firewall")
        table_obj.find('tbody tr').not(":first").remove();

        if( element.netdata['firewall_static_route'] && element.netdata['firewall_static_route']['data' ] ){
            var str = '';
            for( var i in element.netdata['firewall_static_route']['data'] ){
                str += '<tr>'
                str += '<td><input type="checkbox" name="firewall_static_route_list" value="'+element.netdata['firewall_static_route']['data'][i].id+'"></td>'
                str += '<td>'+element.netdata['firewall_static_route']['data'][i].net_duan+'</td>'
                str += '<td>'+element.netdata['firewall_static_route']['data'][i].mask_leng+'</td>'
                str += '<td>'+element.netdata['firewall_static_route']['data'][i].next+'</td>'
                str += '</tr>'
            }
            table_obj.append( str );
        }
    },
    firewall_safe:function(){
        var element = current_element();
        var table_obj = $("#modal-firewall-form-2-table")
        table_obj.find('tbody tr').not(":first").remove();

        if( element.netdata['firewall_safe'] && element.netdata['firewall_safe']['data' ] ){
            var str = '';
            for( var i in element.netdata['firewall_safe']['data'] ){
                str += '<tr>'
                str += '<td><input type="checkbox" name="firewall_safe_list" value="'+element.netdata['firewall_safe']['data'][i].id+'"></td>'
                str += '<td>'+element.netdata['firewall_safe']['data'][i].name+'</td>'
                str += '<td>'+element.netdata['firewall_safe']['data'][i].status+'</td>'
                str += '<td>'+element.netdata['firewall_safe']['data'][i].direction+'</td>'
                str += '<td>'+element.netdata['firewall_safe']['data'][i].source_add+'</td>'
                str += '<td>'+element.netdata['firewall_safe']['data'][i].source_port+'</td>'
                str += '<td>'+element.netdata['firewall_safe']['data'][i].target_add+'</td>'
                str += '<td>'+element.netdata['firewall_safe']['data'][i].service+'</td>'
                str += '<td>'+element.netdata['firewall_safe']['data'][i].policy+'</td>'
                str += '</tr>'
            }
            table_obj.append( str );
        }
    },
    firewall_service:function(){
        var element = current_element();
        var table_obj = $("#modal-firewall-form-3-table")
        table_obj.find('tbody tr').not(":first").remove();

        if( element.netdata['firewall_service'] && element.netdata['firewall_service']['data' ] ){
            var str = '';
            for( var i in element.netdata['firewall_service']['data'] ){
                str += '<tr>'
                str += '<td><input type="checkbox" name="firewall_service_list" value="'+element.netdata['firewall_service']['data'][i].id+'"></td>'
                str += '<td>'+element.netdata['firewall_service']['data'][i].id+'</td>'
                str += '<td>'+element.netdata['firewall_service']['data'][i].service_type+'</td>'
                str += '<td>'+element.netdata['firewall_service']['data'][i].protocol_type+'</td>'
                str += '<td>'+element.netdata['firewall_service']['data'][i].port_1+'-'+element.netdata['firewall_service']['data'][i].port_2+'</td>'
                str += '</tr>'
            }
            table_obj.append( str );
        }
    },
    sdn_interface:function(){
        var element = current_element();
        var table_obj = $("#modal-switchboard-sdn-form-2-table")
        table_obj.find('tbody tr').not(":first").remove();
        if( element.netdata['interface_list'] && element.netdata['interface_list']['data'] ){
            var str = '';
            for( var i in element.netdata['interface_list']['data'] ){
                str += '<tr>'
                str += '<td style="width: 50px;" ><input type="checkbox" name="sdn_interface_list" value="'+i+'"></td>';
                str += '<td style="width: 50px;" >'+i+'</td>';
                str += '<td style="width: 50px;" >'+element.netdata['interface_list']['data'][i].status+'</td>';

                if (element.netdata['interface_list']['data'][i].duplex.toLowerCase() == 'full') {
                    var duplex = '全双工';
                } else if (element.netdata['interface_list']['data'][i].duplex.toLowerCase() == 'falf') {
                    var duplex = '半双工';
                } else {
                    var duplex = '自适应';
                }
                str += '<td style="width: 50px;" >'+element.netdata['interface_list']['data'][i].speed+'</td>';
                str += '<td style="width: 50px;" >'+duplex+'</td>';
                str += '</tr>'
            }
            table_obj.append( str );
        }else{
            var data = {
                electrical_port_num:24,
                optical_port_num:24
            }
            $.getJSON('http://10.10.1.67:8080/net/index.php/topo_manage/topo_manage/produce_switch_port_info?callback=?',data,function(re_data){
                if( re_data.retCode == 0 && re_data.eth_list ){
                    var data = re_data.eth_list;
                    var element = current_element();
                    table_obj.find('tbody tr').not(":first").remove();
                    for(var i=0;i<data.length;i++) {
                        if (data[i].duplex.toLowerCase() == 'full') {
                            var duplex = '全双工';
                        } else if (data[i].duplex.toLowerCase() == 'falf') {
                            var duplex = '半双工';
                        } else {
                            var duplex = '自适应';
                        }

                        var str = '<tr>';
                        str += '<td style="width: 50px;" ><input type="checkbox" name="sdn_interface_list" value="' + data[i].interface + '"></td>';
                        str += '<td style="width: 50px;" >' + data[i].interface + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].status + '</td>';
                        str += '<td style="width: 50px;" >' + data[i].speed + '</td>';
                        str += '<td style="width: 50px;" >' + duplex + '</td>';
                        str += '</tr>';
                        table_obj.find('tbody').append(str);

                        if( !element.netdata['interface_list'] ){
                            element.netdata['interface_list'] = {data:{}};
                        }
                        element.netdata['interface_list']['data'][ data[i].interface ] = {
                            duplex:data[i].duplex.toLowerCase(),
                            interface:data[i].interface,
                            speed:data[i].speed,
                            status:data[i].status,
                        }
                    }
                }
            }).error(function () {
                alert( '获取接口失败' )
            })
        }
    },

}

var net_interface = {
    display:function(){
        var element = current_element();
        if(
            element['netdata']
            && element['netdata']['interface_list']
        ){
            for( var net_id in element['netdata']['interface_list']['data'] ){

                if( element['netdata']['used_interface'] && element['netdata']['used_interface'][net_id]  ){
                    continue;
                }
                var type = '';
                // 路由器
                // 防火墙
                if( element.type == 'u388' || element.type == 'u382' ){
                    type = '-'+element['netdata']['interface_list']['data'][net_id].type
                }
                $("#eth_port_list>select").append("<option value='"+net_id+"'>"+net_id+type+"</option>");
            }
        }
    },
    save:function( node, net ){
        if( !node['netdata']['used_interface'] ){
            node['netdata']['used_interface']={}
        }
        node['netdata']['used_interface'][ net ] = net;
    },
    del: function(  node , net  ){

        if( node['netdata']['used_interface'] ){
            delete node['netdata']['used_interface'][net]
        }
    }

}




$(document).on("click",'.m_monitor_port',function(){
    var element = current_element();
    var val = $(this).val();
    if( $(this).prop('checked') ){
        $('[name="'+element.mirror_mirror_port_name+'"][value="'+val+'"]').attr('disabled','disabled')
    }else{
        $('[name="'+element.mirror_mirror_port_name+'"][value="'+val+'"]').removeAttr('disabled')
    }
})

$(document).on("click",'.m_mirror_port',function(){
    var element = current_element();
    var val = $(this).val();
    if( $(this).prop('checked') ){
        $('[name="'+element.mirror_monitor_port_name+'"][value="'+val+'"]').attr('disabled','disabled')
    }else{
        $('[name="'+element.mirror_monitor_port_name+'"][value="'+val+'"]').removeAttr('disabled')
    }
})

// 服务器 web设置 dns设置 自动保存
$(".ocbutton").click(function(){
    savetable($(this));
})

$('#keep-topo').click(function () {
    keep_topo(0);
});

// 保存 topo 请求
function keep_topo( is_prompt ){
    var lastData = pingdata();

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
    

    var current_id = $("#current_topo_id").val()
    if( !current_id ){
        if( is_prompt != 1 ){
            alert('无效ID');
        }
        return ;
    }
    lastData.topo_name_id = current_id;
    lastData.web_info = JSON.stringify(s);
    $.post( 'http://10.10.1.67:8080/net/index.php/topo_manage/topo_manage/save_topo' , lastData , function(msg){
    	console.log(msg)
        if( msg && msg.retCode == "0" ){
            if( is_prompt != 1 ){
                alert('保存成功')
            }
        }else{
            if( is_prompt != 1 ){
                alert('保存失败')
            }
        }
    }).error(function(){
        if( is_prompt != 1 ){
            alert('保存失败')
        }
    },'json')

}

// 10秒钟 自动保存一次 topo
//setInterval(function(){
//    keep_topo(1);
//},10000);


// =========================================  还原topo ===============================================

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

// 还原topo
//function restore_img1( topoys ){
//    setTopoType( topoys.topo_type )
//    for( var to in topoys ){
//        if( to == 'topo_type'){
//            setTopoType( topoys[to] )
//            continue;
//        }
//        for( var i=0; i<topoys[to].length;i++ ){
//            create_element(
//                {id:to,title:topoys[to][i].name} ,
//                topoys[to][i].x ,
//                topoys[to][i].y ,
//                topoys[to][i].id ,
//                topoys[to][i].data ,
//                topoys[to][i].formdata ,
//                topoys[to][i].netdata
//            );
//        }
//    }
//    for( var to in topoys ){
//        if( to == 'topo_type'){
//            setTopoType( topoys[to] )
//            continue;
//        }
//
//        for( var i=0; i<topoys[to].length;i++ ){
//            for( var k=0;k<topoys[to][i].link_ed.length;k++ ){
//                var f_id = topoys[to][i]["link_ed"][k];
//                link_obj.actual_link( topo_allElement_data[to][ 'net_element_id_'+topoys[to][i].id ] ,topo_allElement_data[ topo_id_type[f_id] ][ f_id ] , 1 )
//            }
//        }
//    }
//}

function restore_img( topoys ){

    setTopoType( topoys.topo_type )

    for( var to in topoys.data ){

        for( var i=0; i<topoys['data'][to].length;i++ ){
            create_element(
                {id:to,title:topoys['data'][to][i].name} ,
                topoys['data'][to][i].x ,
                topoys['data'][to][i].y ,
                topoys['data'][to][i].id ,
                topoys['data'][to][i].data ,
                topoys['data'][to][i].formdata ,
                topoys['data'][to][i].netdata
            );
        }
    }
    for( var i=0 ; i<topoys.links.length;i++ ){
        var net_1_id = topoys.links[i]['interface_1']['id']
        var net_2_id = topoys.links[i]['interface_2']['id']
        var net_1_type = topoys.links[i]['interface_1']['type']
        var net_2_type = topoys.links[i]['interface_2']['type']

        if( topoys.links[i].link_net1 ){
            link_obj.net_1 = topoys.links[i].link_net1
        }
        if( topoys.links[i].link_net2 ){
            link_obj.net_2 = topoys.links[i].link_net2
        }
        var id = topoys.links[i].id;
        link_obj.actual_link(
            topo_allElement_data[ net_1_type ][ net_1_id ] ,
            topo_allElement_data[ net_2_type ][ net_2_id ] ,
            id
        )
    }

    self_add_id = topoys.self_add_id
}

if( restore_topo_img_data && restore_topo_img_data!='' ){
    restore_img( restore_topo_img_data )
}else{
    var urlpar = GetRequest();
    if( urlpar['create_id'] && topoimgconf[urlpar['create_id']] ){
        var restore_topo_img_data = topoimgconf[urlpar['create_id']];
        restore_img( restore_topo_img_data )
    }
}
