
function pingdata(){
    var poo=null;
    var lastData={};
    lastData.hosts=[];
    lastData.servers=[];
    lastData.legacy_2_switchs=[];
    lastData.legacy_3_switchs=[];
    lastData.sdn_controllers=[];
    lastData.sdn_switchs=[];
    lastData.routers=[];
    lastData.firewalls=[];
    lastData.internet=[];
    lastData.links=[];

    lastData.topo_name=topo_allElement_data.topo_name;

    lastData.topo_type=topo_allElement_data.topo_type;

    for (  i in topo_allElement_data){
        if( i == 'u380'){
            for(  kk in topo_allElement_data[i] ){
                //console.log( topo_allElement_data[i][kk] );
                //console.log(kk);
                a= {
                    host_name: kk,
                    //host_type:'',
                    ip_type:topo_allElement_data[i][kk].netdata.data['cli-allocation-2']||"",
                    ip:topo_allElement_data[i][kk].netdata.data['cli-allocation-3']||"",
                    netmask:topo_allElement_data[i][kk].netdata.data['cli-allocation-4']||"",
                    gateway:topo_allElement_data[i][kk].netdata.data['cli-allocation-5']||"",
                    first_dns:topo_allElement_data[i][kk].netdata.data['cli-allocation-6']||"",
                    second_dns:topo_allElement_data[i][kk].netdata.data['cli-allocation-7']||"",
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y,
                }
                lastData.hosts.push(a);

            }
        }
        else if( i == 'u384'){
            for(  kk in topo_allElement_data[i] ){
                b= {
                    server_name: kk,
                    dns_server:topo_allElement_data[i][kk].netdata.data['input2']||false,
                    web_server:topo_allElement_data[i][kk].netdata.data['input1']||false,
                    ip_type:topo_allElement_data[i][kk].netdata.data['server-allocation-2']||"",
                    ip:topo_allElement_data[i][kk].netdata.data['server-allocation-3']||"",
                    netmask:topo_allElement_data[i][kk].netdata.data['server-allocation-4']||"",
                    gateway:topo_allElement_data[i][kk].netdata.data['server-allocation-5']||"",
                    web_config:{service_port:topo_allElement_data[i][kk].netdata.data['ser_port_1']},
                    dns_config:[],
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y,
                };
                if(topo_allElement_data[i][kk].netdata.dnslist==undefined){
                    b.server_name=kk
                }else{
                    for(dnsk in topo_allElement_data[i][kk].netdata.dnslist.data){
                        bdns={
                            domain_id:"NS"+topo_allElement_data[i][kk].netdata.dnslist.data[dnsk]['id'],
                            domain_name:topo_allElement_data[i][kk].netdata.dnslist.data[dnsk]['domain']+'.testdomain.com',
                            ip:topo_allElement_data[i][kk].netdata.dnslist.data[dnsk]['ip']
                        };

                        b.dns_config.push(bdns);
                    }
                }


                if(b.web_config.service_port==undefined||b.web_config.service_port==''){
                    b.web_config={}
                }
                lastData.servers.push(b)
            }
        }
        else if(i=='usw1'){
            for(  kk in topo_allElement_data[i] ){
                c1={
                    switch_name:kk,
                    optical_port_num:0,
                    electrical_interface_num:48,
                    eth_list:[],
                    mirror_list:[],
                    vlan_list:[],
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y

                }
                if(topo_allElement_data[i][kk].netdata.vlan_list==undefined){
                    c1.switch_name=kk
                }else{
                    for(dnsk in topo_allElement_data[i][kk].netdata.vlan_list.data){
                        var port_list='';
                        if( topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed ){
                            for(var net_id in topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed[dnsk] ){
                                port_list+=net_id+'#'
                            }
                        }

                        vlanlists={
                            vlan_id:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['vlan_id'],
                            port_list:port_list.substring(0,port_list.length - 1),
                            vlan_info:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['describe']
                        }
                        c1.vlan_list.push(vlanlists);
                    }
                }
                    for( eth in topo_allElement_data[i][kk].netdata.interface_list.data){
                        var vlan_1='';
                        for(var vlan_id in topo_allElement_data[i][kk].netdata.interface_list.data[eth].vlan_id_all){
                            vlan_1+=topo_allElement_data[i][kk].netdata.vlan_list.data[vlan_id].vlan_id+"#"
                        }
                        var vada = {
                            duplex:topo_allElement_data[i][kk].netdata.interface_list.data[eth].duplex,
                            interface:topo_allElement_data[i][kk].netdata.interface_list.data[eth].interface,
                            link_type:topo_allElement_data[i][kk].netdata.interface_list.data[eth].link_type||'',
                            speed:topo_allElement_data[i][kk].netdata.interface_list.data[eth].speed,
                            status:topo_allElement_data[i][kk].netdata.interface_list.data[eth].status,
                            //type:topo_allElement_data[i][kk].netdata.interface_list.data[eth].type
                            vlan:vlan_1.substring(0,vlan_1.length - 1)
                        }
                        if( topo_allElement_data[i][kk].netdata.interface_list.data[eth].vlan_id ){
                            var vid = topo_allElement_data[i][kk].netdata.interface_list.data[eth].vlan_id;
                            vada.vlan_id = topo_allElement_data[i][kk].netdata.vlan_list.data[vid].vlan_id
                        }
                        c1.eth_list.push(vada);
                        //c1.eth_list.push(topo_allElement_data[i][kk].netdata.interface_list.data[eth]);
                    }
                    if( topo_allElement_data[i][kk].netdata.mirror ){
                        for(mir in topo_allElement_data[i][kk].netdata.mirror.data){
                            var data_port_list='';
                            var mirror_port_list='';
                            for(var yuan in topo_allElement_data[i][kk].netdata.mirror.data[mir].mirror_port ){
                                mirror_port_list+=yuan+'#'
                            }
                            for(var mudi in topo_allElement_data[i][kk].netdata.mirror.data[mir].monitor_port ){
                                data_port_list +=mudi+'#'
                            }
                            mirrors={
                                mirror_id:topo_allElement_data[i][kk].netdata.mirror.data[mir]['mirror_id'],
                                mirror_status:'true',
                                data_port_list:data_port_list.substring(0,data_port_list.length - 1),
                                mirror_port_list:mirror_port_list.substring(0,mirror_port_list.length - 1),
                                mirror_direction:topo_allElement_data[i][kk].netdata.mirror.data[mir]['flow_type']
                            }
                            c1.mirror_list.push(mirrors);
                        }
                    }





                lastData.legacy_2_switchs.push(c1)
            }
        }
        else if(i=='usw2'){
            for(  kk in topo_allElement_data[i] ){
                c2={
                    switch_name:kk,
                    optical_port_num:48,
                    electrical_interface_num:0,
                    eth_list:[],
                    mirror_list:[],
                    vlan_list:[],
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y

                }
                if(topo_allElement_data[i][kk].netdata.vlan_list==undefined){
                    c2.switch_name=kk
                }else {
                    for (dnsk in topo_allElement_data[i][kk].netdata.vlan_list.data) {
                        var port_list = '';
                        if (topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed) {
                            for (var net_id in topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed[dnsk]) {
                                port_list += net_id + '#'
                            }
                        }

                        vlanlists2 = {
                            vlan_id: topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['vlan_id'],
                            port_list: port_list.substring(0, port_list.length - 1),
                            vlan_info: topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['describe']
                        }
                        c2.vlan_list.push(vlanlists2);
                    }
                }
                    for( eth in topo_allElement_data[i][kk].netdata.interface_list.data){
                        var vlan_2='';
                        for(var vlan_id in topo_allElement_data[i][kk].netdata.interface_list.data[eth].vlan_id_all){
                            vlan_2+=topo_allElement_data[i][kk].netdata.vlan_list.data[vlan_id].vlan_id+"#"
                        }
                        var vada = {
                            duplex:topo_allElement_data[i][kk].netdata.interface_list.data[eth].duplex,
                            interface:topo_allElement_data[i][kk].netdata.interface_list.data[eth].interface,
                            link_type:topo_allElement_data[i][kk].netdata.interface_list.data[eth].link_type||'',
                            speed:topo_allElement_data[i][kk].netdata.interface_list.data[eth].speed,
                            status:topo_allElement_data[i][kk].netdata.interface_list.data[eth].status,
                            //type:topo_allElement_data[i][kk].netdata.interface_list.data[eth].type
                            vlan:vlan_2.substring(0,vlan_2.length - 1)
                        }
                        if( topo_allElement_data[i][kk].netdata.interface_list.data[eth].vlan_id ){
                            var vid = topo_allElement_data[i][kk].netdata.interface_list.data[eth].vlan_id;
                            vada.vlan_id = topo_allElement_data[i][kk].netdata.vlan_list.data[vid].vlan_id
                        }
                        c2.eth_list.push(vada);
                        //c2.eth_list.push(topo_allElement_data[i][kk].netdata.interface_list.data[eth]);
                    }
                    if( topo_allElement_data[i][kk].netdata.mirror ){
                        for(mir in topo_allElement_data[i][kk].netdata.mirror.data){
                            var data_port_list='';
                            var mirror_port_list='';
                            for(var yuan in topo_allElement_data[i][kk].netdata.mirror.data[mir].mirror_port ){
                                mirror_port_list+=yuan+'#'
                            }
                            for(var mudi in topo_allElement_data[i][kk].netdata.mirror.data[mir].monitor_port ){
                                data_port_list+=mudi+'#'
                            }
                            mirrors2={
                                mirror_id:topo_allElement_data[i][kk].netdata.mirror.data[mir]['mirror_id'],
                                mirror_status:'true',
                                data_port_list:data_port_list,
                                mirror_port_list:mirror_port_list,
                                mirror_direction:topo_allElement_data[i][kk].netdata.mirror.data[mir]['flow_type']
                            }
                            c2.mirror_list.push(mirrors2);
                        }
                    }




                lastData.legacy_2_switchs.push(c2)
            }
        }
        else if(i=='usw3'){
            for( kk in topo_allElement_data[i] ){
                c3={
                    switch_name:kk,
                    optical_port_num:0,
                    electrical_interface_num:48,
                    eth_list:[],
                    static_route_list:[],
                    mirror_list:[],
                    vlan_list:[],
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y

                }
                if(topo_allElement_data[i][kk].netdata.vlan_list==undefined){
                    c3.switch_name=kk
                }else {
                    for (eth3 in topo_allElement_data[i][kk].netdata.interface_list.data) {
                        var vlan_6 = '';
                        for (var vlan_id in topo_allElement_data[i][kk].netdata.interface_list.data[eth3].vlan_id_all) {
                            vlan_6 += topo_allElement_data[i][kk].netdata.vlan_list.data[vlan_id].vlan_id + "#"
                        }


                        var vada = {
                            duplex: topo_allElement_data[i][kk].netdata.interface_list.data[eth3].duplex,
                            interface: topo_allElement_data[i][kk].netdata.interface_list.data[eth3].interface,
                            link_type: topo_allElement_data[i][kk].netdata.interface_list.data[eth3].link_type || '',
                            speed: topo_allElement_data[i][kk].netdata.interface_list.data[eth3].speed,
                            status: topo_allElement_data[i][kk].netdata.interface_list.data[eth3].status,
                            //type:topo_allElement_data[i][kk].netdata.interface_list.data[eth3].type
                            vlan: vlan_6.substring(0, vlan_6.length - 1)
                        }
                        if (topo_allElement_data[i][kk].netdata.interface_list.data[eth3].vlan_id) {
                            var vid = topo_allElement_data[i][kk].netdata.interface_list.data[eth3].vlan_id;
                            vada.vlan_id = topo_allElement_data[i][kk].netdata.vlan_list.data[vid].vlan_id
                        }
                        c3.eth_list.push(vada);
                        //c3.eth_list.push(topo_allElement_data[i][kk].netdata.interface_list.data[eth]);
                    }
                }
                    if( topo_allElement_data[i][kk].netdata.vlan_list ){
                        for(dnsk in topo_allElement_data[i][kk].netdata.vlan_list.data){
                            var port_list2='';
                            if( topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed ){
                                    for(var net_id in topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed[dnsk] ){
                                    port_list2+=net_id+'#'
                                }
                            }

                            vlanlists3={
                                vlan_id:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['vlan_id'],
                                port_list:port_list2.substring(0,port_list2.length - 1),
                                vlan_info:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['describe'],
                                ip_addr:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['ip'],
                                netmask:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['mask']
                            }

                            c3.vlan_list.push(vlanlists3);
                        }
                    }

                    if( topo_allElement_data[i][kk].netdata.mirror ){
                        for(mir in topo_allElement_data[i][kk].netdata.mirror.data){
                            var data_port_list2='';
                            var mirror_port_list2='';
                            for(var yuan in topo_allElement_data[i][kk].netdata.mirror.data[mir].mirror_port ){
                                mirror_port_list2+=yuan+'#'
                            }
                            for(var mudi in topo_allElement_data[i][kk].netdata.mirror.data[mir].monitor_port ){
                                data_port_list2+=mudi+'#'
                            }
                            mirrors3={
                                mirror_id:topo_allElement_data[i][kk].netdata.mirror.data[mir]['mirror_id'],
                                mirror_status:'true',
                                data_port_list:data_port_list2.substring(0,data_port_list2.length - 1),
                                mirror_port_list:mirror_port_list2.substring(0,mirror_port_list2.length - 1),
                                mirror_direction:topo_allElement_data[i][kk].netdata.mirror.data[mir]['flow_type']
                            }
                            c3.mirror_list.push(mirrors3);
                        }
                    }

                    if( topo_allElement_data[i][kk].netdata.static_route ){
                        for(sta in topo_allElement_data[i][kk].netdata.static_route.data){
                            statuss={
                                route_id:'id'+topo_allElement_data[i][kk].netdata.static_route.data[sta]['id'],
                                subnet:topo_allElement_data[i][kk].netdata.static_route.data[sta]['net_duan'],
                                next_hop:topo_allElement_data[i][kk].netdata.static_route.data[sta]['next'],
                                netmask:topo_allElement_data[i][kk].netdata.static_route.data[sta]['mask_leng'],
                            }
                            c3.static_route_list.push(statuss);

                        }
                    }








                lastData.legacy_3_switchs.push(c3)
            }
        }
        else if(i=='usw4'){
            for(  kk in topo_allElement_data[i] ) {
                c4 = {
                    switch_name: kk,
                    optical_port_num: 4,
                    electrical_interface_num: 48,
                    eth_list: [],
                    static_route_list: [],
                    mirror_list: [],
                    vlan_list: [],
                    pos_x: topo_allElement_data[i][kk].x,
                    pos_y: topo_allElement_data[i][kk].y

                }
                if(topo_allElement_data[i][kk].netdata.vlan_list==undefined){
                    c4.switch_name=kk
                }else {
                    for (eth4 in topo_allElement_data[i][kk].netdata.interface_list.data) {
                        var vlan_7 = '';
                        for (var vlan_id in topo_allElement_data[i][kk].netdata.interface_list.data[eth4].vlan_id_all) {
                            vlan_7 += topo_allElement_data[i][kk].netdata.vlan_list.data[vlan_id].vlan_id + "#"
                        }
                        var vada = {
                            duplex: topo_allElement_data[i][kk].netdata.interface_list.data[eth4].duplex,
                            interface: topo_allElement_data[i][kk].netdata.interface_list.data[eth4].interface,
                            link_type: topo_allElement_data[i][kk].netdata.interface_list.data[eth4].link_type || '',
                            speed: topo_allElement_data[i][kk].netdata.interface_list.data[eth4].speed,
                            status: topo_allElement_data[i][kk].netdata.interface_list.data[eth4].status,
                            //type:topo_allElement_data[i][kk].netdata.interface_list.data[eth4].type
                            vlan: vlan_7.substring(0, vlan_7.length - 1)
                        }
                        if (topo_allElement_data[i][kk].netdata.interface_list.data[eth4].vlan_id) {
                            var vid = topo_allElement_data[i][kk].netdata.interface_list.data[eth4].vlan_id;
                            vada.vlan_id = topo_allElement_data[i][kk].netdata.vlan_list.data[vid].vlan_id
                        }
                        c4.eth_list.push(vada);
                        //c4.eth_list.push(topo_allElement_data[i][kk].netdata.interface_list.data[eth]);
                    }
                }
                    for(dnsk in topo_allElement_data[i][kk].netdata.vlan_list.data){
                        var port_list2='';
                        if( topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed ){
                            for(var net_id in topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed[dnsk] ){
                                port_list2+=net_id+'#'
                            }
                        }

                        vlanlists4={
                            vlan_id:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['vlan_id'],
                            port_list:port_list2.substring(0,port_list2.length - 1),
                            vlan_info:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['describe'],
                            ip_addr:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['ip'],
                            netmask:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['mask']
                        }
                        c4.vlan_list.push(vlanlists4);
                    }
                    if( topo_allElement_data[i][kk].netdata.mirror ){
                        for(mir in topo_allElement_data[i][kk].netdata.mirror.data){
                            var data_port_list3='';
                            var mirror_port_list3='';
                            for(var yuan in topo_allElement_data[i][kk].netdata.mirror.data[mir].mirror_port ){
                                mirror_port_list3+=yuan+'#'
                            }
                            for(var mudi in topo_allElement_data[i][kk].netdata.mirror.data[mir].monitor_port ){
                                data_port_list3+=mudi+'#'
                            }
                            mirrors4={
                                mirror_id:topo_allElement_data[i][kk].netdata.mirror.data[mir]['mirror_id'],
                                mirror_status:'true',
                                data_port_list:data_port_list3.substring(0,data_port_list3.length - 1),
                                mirror_port_list:mirror_port_list3.substring(0,mirror_port_list3.length - 1),
                                mirror_direction:topo_allElement_data[i][kk].netdata.mirror.data[mir]['flow_type']
                            }
                            c4.mirror_list.push(mirrors4);
                        }
                    }

                    if( topo_allElement_data[i][kk].netdata.static_route ){
                        for(sta in topo_allElement_data[i][kk].netdata.static_route.data){
                            statuss2={
                                route_id:'id'+topo_allElement_data[i][kk].netdata.static_route.data[sta]['id'],
                                subnet:topo_allElement_data[i][kk].netdata.static_route.data[sta]['net_duan'],
                                next_hop:topo_allElement_data[i][kk].netdata.static_route.data[sta]['next'],
                                netmask:topo_allElement_data[i][kk].netdata.static_route.data[sta]['mask_leng'],
                            }
                            c4.static_route_list.push(statuss2);

                        }
                    }



                lastData.legacy_3_switchs.push(c4)
            }
        }
        else if(i=='usw5'){
            for(  kk in topo_allElement_data[i] ) {
                c5 = {
                    switch_name: kk,
                    optical_port_num: 24,
                    electrical_interface_num: 0,
                    eth_list: [],
                    static_route_list: [],
                    mirror_list: [],
                    vlan_list: [],
                    pos_x: topo_allElement_data[i][kk].x,
                    pos_y: topo_allElement_data[i][kk].y

                }
                if(topo_allElement_data[i][kk].netdata.vlan_list==undefined){
                    c5.switch_name=kk
                }else {
                    for (eth5 in topo_allElement_data[i][kk].netdata.interface_list.data) {
                        var vlan_8 = '';
                        for (var vlan_id in topo_allElement_data[i][kk].netdata.interface_list.data[eth5].vlan_id_all) {
                            vlan_8 += topo_allElement_data[i][kk].netdata.vlan_list.data[vlan_id].vlan_id + "#"
                        }
                        var vada = {
                            duplex: topo_allElement_data[i][kk].netdata.interface_list.data[eth5].duplex,
                            interface: topo_allElement_data[i][kk].netdata.interface_list.data[eth5].interface,
                            link_type: topo_allElement_data[i][kk].netdata.interface_list.data[eth5].link_type || '',
                            speed: topo_allElement_data[i][kk].netdata.interface_list.data[eth5].speed,
                            status: topo_allElement_data[i][kk].netdata.interface_list.data[eth5].status,
                            //type:topo_allElement_data[i][kk].netdata.interface_list.data[eth5].type
                            vlan: vlan_8.substring(0, vlan_8.length - 1)
                        }
                        if (topo_allElement_data[i][kk].netdata.interface_list.data[eth5].vlan_id) {
                            var vid = topo_allElement_data[i][kk].netdata.interface_list.data[eth5].vlan_id;
                            vada.vlan_id = topo_allElement_data[i][kk].netdata.vlan_list.data[vid].vlan_id
                        }
                        c5.eth_list.push(vada);
                        //c5.eth_list.push(topo_allElement_data[i][kk].netdata.interface_list.data[eth]);
                    }
                }
                    if( topo_allElement_data[i][kk].netdata.vlan_list ){
                        for(dnsk in topo_allElement_data[i][kk].netdata.vlan_list.data){
                            var port_list5='';
                            if( topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed ){
                                for(var net_id in topo_allElement_data[i][kk].netdata.vlan_list.interface_id_ed[dnsk] ){
                                    port_list5+=net_id+'#'
                                }
                            }

                            vlanlists5={
                                vlan_id:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['vlan_id'],
                                port_list:port_list5.substring(0,port_list5.length - 1),
                                vlan_info:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['describe'],
                                ip_addr:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['ip'],
                                netmask:topo_allElement_data[i][kk].netdata.vlan_list.data[dnsk]['mask']
                            }
                            c5.vlan_list.push(vlanlists5);
                        }
                    }

                    if( topo_allElement_data[i][kk].netdata.mirror ){
                        for(mir in topo_allElement_data[i][kk].netdata.mirror.data){
                            var data_port_list5='';
                            var mirror_port_list5='';
                            for(var yuan in topo_allElement_data[i][kk].netdata.mirror.data[mir].mirror_port ){
                                mirror_port_list5+=yuan+'#'
                            }
                            for(var mudi in topo_allElement_data[i][kk].netdata.mirror.data[mir].monitor_port ){
                                data_port_list5+=mudi+'#'
                            }
                            mirrors5={
                                mirror_id:topo_allElement_data[i][kk].netdata.mirror.data[mir]['mirror_id'],
                                mirror_status:'true',
                                data_port_list:data_port_list5.substring(0,data_port_list5.length - 1),
                                mirror_port_list:mirror_port_list5.substring(0,mirror_port_list5.length - 1),
                                mirror_direction:topo_allElement_data[i][kk].netdata.mirror.data[mir]['flow_type']
                            }
                            c5.mirror_list.push(mirrors5);
                        }
                    }

                    if( topo_allElement_data[i][kk].netdata.static_route ){
                        for(sta in topo_allElement_data[i][kk].netdata.static_route.data){
                            statuss5={
                                route_id:'id'+topo_allElement_data[i][kk].netdata.static_route.data[sta]['id'],
                                subnet:topo_allElement_data[i][kk].netdata.static_route.data[sta]['net_duan'],
                                next_hop:topo_allElement_data[i][kk].netdata.static_route.data[sta]['next'],
                                netmask:topo_allElement_data[i][kk].netdata.static_route.data[sta]['mask_leng'],
                            }
                            c5.static_route_list.push(statuss5);

                        }
                    }



                lastData.legacy_3_switchs.push(c5)
            }
        }
        else if(i=='u382'){
            for(  kk in topo_allElement_data[i] ){
                d={
                    router_name: kk,
                    eth_list:[],//
                    static_route_list:[],//1
                    nat_pool_list:[],//1
                    port_mapping_list:[],//1
                    rip_protocol:{},
                    ospfv2_protocol:{},
                    bgp_protocol:{},
                    //rip_protocol.network_list=[],
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y
                }
                    if(topo_allElement_data[i][kk].netdata.static_route==undefined){
                        staticroutes={
                            route_id:'',
                            subnet:'',
                            next_hop:'',
                            netmask:''
                        }
                        //d.static_route_list.push(staticroutes);
                        d.static_route_list=[]
                    }else{
                        for( var key1 in topo_allElement_data[i][kk].netdata.static_route.data){
                            staticroutes={
                                route_id:'id'+ topo_allElement_data[i][kk].netdata.static_route.data[key1]['id'],
                                subnet:topo_allElement_data[i][kk].netdata.static_route.data[key1]['net_duan'],
                                next_hop:topo_allElement_data[i][kk].netdata.static_route.data[key1]['next'],
                                netmask:topo_allElement_data[i][kk].netdata.static_route.data[key1]['mask_leng']
                            }
                            d.static_route_list.push(staticroutes);
                        }
                    }
                    if(topo_allElement_data[i][kk].netdata.route_prot_mapping==undefined){
                        maps={
                            mapping_name:'',
                            public_ip:'',
                            private_ip:'',
                            is_port_transform:1,
                            public_port:'',
                            private_port:'',
                            proto:''

                        }
                        //d.port_mapping_list.push(maps)
                        d.port_mapping_list=[]
                    }else{
                        for(var  map in topo_allElement_data[i][kk].netdata.route_prot_mapping.data){
                            maps={
                                mapping_name:topo_allElement_data[i][kk].netdata.route_prot_mapping.data[map]['mapping_name'],
                                public_ip:topo_allElement_data[i][kk].netdata.route_prot_mapping.data[map]['pub_net_address'],
                                private_ip:topo_allElement_data[i][kk].netdata.route_prot_mapping.data[map]['pri_net_address'],
                                is_port_transform:topo_allElement_data[i][kk].netdata.route_prot_mapping.data[map]['is_convert']||0,
                                public_port:topo_allElement_data[i][kk].netdata.route_prot_mapping.data[map]['pub_net_port'],
                                private_port:topo_allElement_data[i][kk].netdata.route_prot_mapping.data[map]['pri_net_port'],
                                proto:topo_allElement_data[i][kk].netdata.route_prot_mapping.data[map]['protocol']

                            }
                            d.port_mapping_list.push(maps)
                        }
                    }
                    if(topo_allElement_data[i][kk].netdata.route_net==undefined){
                        pools={
                            nat_pool_name:'',
                            start_ip:'',
                            end_ip:'',
                            port:'',
                        }
                        //d.nat_pool_list.push(pools);
                        d.nat_pool_list=[]
                    }else{
                        for(var pool in topo_allElement_data[i][kk].netdata.route_net.data){
                            pools={
                                nat_pool_name:topo_allElement_data[i][kk].netdata.route_net.data[pool]['address_pool'],
                                start_ip:topo_allElement_data[i][kk].netdata.route_net.data[pool]['start_ip'],
                                end_ip:topo_allElement_data[i][kk].netdata.route_net.data[pool]['end_ip'],
                                port:topo_allElement_data[i][kk].netdata.route_net.data[pool]['net'],
                            }
                            d.nat_pool_list.push(pools);
                        }
                    }

                if(topo_allElement_data[i][kk].netdata.interface_list==undefined){
                    d.eth_list=[]
                }else{
                    for( ethr in topo_allElement_data[i][kk].netdata.interface_list.data){
                        d.eth_list.push(topo_allElement_data[i][kk].netdata.interface_list.data[ethr]);
                    }
                }


                    d.rip_protocol.status=topo_allElement_data[i][kk].netdata.data['input6']||false;
                    d.rip_protocol.version=topo_allElement_data[i][kk].netdata.data['rip_banbenhao']||"";
                    d.rip_protocol.update_time=topo_allElement_data[i][kk].netdata.data['rip_gengxinshijian']||"";
                    d.rip_protocol.timeout_time=topo_allElement_data[i][kk].netdata.data['rip_chaoshijiange']||"";
                    d.rip_protocol.garbage_time=topo_allElement_data[i][kk].netdata.data['rip_lajihuishou']||"";
                    d.ospfv2_protocol.status=topo_allElement_data[i][kk].netdata.data['input7']||false;
                    d.ospfv2_protocol.router_id=topo_allElement_data[i][kk].netdata.data['OSPF_luyid']||"";
                    d.ospfv2_protocol.delay=topo_allElement_data[i][kk].netdata.data['OSPF_spfys']||"";
                    d.ospfv2_protocol.init_holdtime=topo_allElement_data[i][kk].netdata.data['OSPF_whsj']||"";
                    d.ospfv2_protocol.max_holdtime=topo_allElement_data[i][kk].netdata.data['OSPF_zdwh']||"";
                    //d.ospfv2_protocol.priority=topo_allElement_data[i][kk].netdata.data['OSPF_leix']||"";
                    d.bgp_protocol.status=topo_allElement_data[i][kk].netdata.data['input8']||false;
                    d.bgp_protocol.router_id=topo_allElement_data[i][kk].netdata.data['bgp_lyid']||"";
                    d.bgp_protocol.local_asn=topo_allElement_data[i][kk].netdata.data['bgp_leix']||"";
                    d.bgp_protocol.remote_asn=topo_allElement_data[i][kk].netdata.data['bgp_spfsy']||"";
                    d.bgp_protocol.neighbor=topo_allElement_data[i][kk].netdata.data['bgp_spfjs']||"";

                d.rip_protocol.network_list=[];
                d.ospfv2_protocol.network_list=[];
                d.bgp_protocol.network_list=[];
                var ss= topo_allElement_data[i][kk].netdata.route_dynamic
                if(ss==undefined){
                    dx2={
                        network_id:'',
                        network:'',
                        netmask:'',
                    }

                    d.ospfv2_protocol.network_list=[]
                }else{
                    if( ss['r1-OSPF'] && ss['r1-OSPF'].data ){
                        for(rtta in topo_allElement_data[i][kk].netdata.route_dynamic['r1-OSPF'].data){


                            dx2={
                                network_id:topo_allElement_data[i][kk].netdata.route_dynamic['r1-OSPF'].data [rtta]['id']||'',
                                network:topo_allElement_data[i][kk].netdata.route_dynamic['r1-OSPF'].data [rtta]['net_duan']||'',
                                netmask:topo_allElement_data[i][kk].netdata.route_dynamic['r1-OSPF'].data [rtta]['mask']||'',
                                area:topo_allElement_data[i][kk].netdata.route_dynamic['r1-OSPF'].data [rtta]['area']||""
                            }

                            d.ospfv2_protocol.network_list.push(dx2)
                        }
                    }

                }
                if(topo_allElement_data[i][kk].netdata.route_dynamic==undefined){
                    dx1={
                        network_id:'',
                        network:'',
                        netmask:'',
                    }
                    d.rip_protocol.network_list=[]
                }else{
                    if( ss['r1-RIP'] && ss['r1-RIP'].data ){
                        for(rtta2 in topo_allElement_data[i][kk].netdata.route_dynamic['r1-RIP'].data){
                            dx1={
                                network_id:topo_allElement_data[i][kk].netdata.route_dynamic['r1-RIP'].data[rtta2]['id']||'',
                                network:topo_allElement_data[i][kk].netdata.route_dynamic['r1-RIP'].data[rtta2]['net_duan']||'',
                                netmask:topo_allElement_data[i][kk].netdata.route_dynamic['r1-RIP'].data [rtta2]['mask']||'',
                            }
                            d.rip_protocol.network_list.push(dx1)
                        }
                    }

                }
                if(topo_allElement_data[i][kk].netdata.route_dynamic==undefined){
                    dx3={
                        network_id:'',
                        network:'',
                        netmask:'',
                    }
                    d.bgp_protocol.network_list=[]
                }else{
                    if( ss['r2-bgp'] && ss['r2-bgp'].data ){
                        for( rtta3 in topo_allElement_data[i][kk].netdata.route_dynamic['r2-bgp'].data){
                            dx3={
                                network_id:topo_allElement_data[i][kk].netdata.route_dynamic['r2-bgp'].data[rtta3]['id']||'',
                                network:topo_allElement_data[i][kk].netdata.route_dynamic['r2-bgp'].data[rtta3]['net_duan']||'',
                                netmask:topo_allElement_data[i][kk].netdata.route_dynamic['r2-bgp'].data [rtta3]['mask']||'',
                            }
                            d.bgp_protocol.network_list.push(dx3)
                        }
                    }

                }



                lastData.routers.push(d)
            }
        }
        else if(i=='u388'){
            for(  kk in topo_allElement_data[i] ){
                e={
                    firewall_name:kk,
                    eth_list:[],//1
                    static_route_list:[],//1
                    firewall_acls_list:[],
                    firewall_service_type_list:[],//1
                    nat_pool_list:[],//1
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y
                }
                if(topo_allElement_data[i][kk].netdata.firewall_static_route==undefined){
                    static_route_lists={
                        route_id:'',
                        subnet:'',
                        next_hop:'',
                        netmask:''
                    }
                    e.static_route_list=[];
                }else{
                    for( fira in  topo_allElement_data[i][kk].netdata.firewall_static_route.data){
                        static_route_lists={
                            route_id:'id'+ topo_allElement_data[i][kk].netdata.firewall_static_route.data[fira]['id']||'',
                            subnet:topo_allElement_data[i][kk].netdata.firewall_static_route.data[fira]['net_duan']||'',
                            next_hop:topo_allElement_data[i][kk].netdata.firewall_static_route.data[fira]['next']||'',
                            netmask:topo_allElement_data[i][kk].netdata.firewall_static_route.data[fira]['mask_leng']||''
                        }
                        e.static_route_list.push(static_route_lists);
                    }
                }



                if(topo_allElement_data[i][kk].netdata.interface_list==undefined){
                    e.eth_list=[]
                }else{
                    for( firb in topo_allElement_data[i][kk].netdata.interface_list.data){
                        e.eth_list.push(topo_allElement_data[i][kk].netdata.interface_list.data[firb ]);
                    }
                }

                if(topo_allElement_data[i][kk].netdata.firewall_net==undefined){
                    firepools={
                        nat_pool_name:'',
                        start_ip:'',
                        end_ip:'',
                        port:'',
                    }
                    e.nat_pool_list=[];
                }else{
                    for(var firpool in topo_allElement_data[i][kk].netdata.firewall_net.data){
                        firepools={
                            nat_pool_name:topo_allElement_data[i][kk].netdata.firewall_net.data[firpool]['address_pool']||'',
                            start_ip:topo_allElement_data[i][kk].netdata.firewall_net.data[firpool]['start_ip']||'',
                            end_ip:topo_allElement_data[i][kk].netdata.firewall_net.data[firpool]['end_ip']||'',
                            port:topo_allElement_data[i][kk].netdata.firewall_net.data[firpool]['net']||'',
                        }
                        e.nat_pool_list.push(firepools);
                    }
                }

                if(topo_allElement_data[i][kk].netdata.firewall_service==undefined){
                    firewall_service_type_lists={
                        service_type:'',
                        start_port:'',
                        end_port:'',
                        proto:''
                    }
                    e.firewall_service_type_list=[]
                }else{
                    for(var firsvi in topo_allElement_data[i][kk].netdata.firewall_service.data){
                        firewall_service_type_lists={
                            service_type:topo_allElement_data[i][kk].netdata.firewall_service.data[firsvi]['service_type']||'',
                            start_port:topo_allElement_data[i][kk].netdata.firewall_service.data[firsvi]['port_1']||'',
                            end_port:topo_allElement_data[i][kk].netdata.firewall_service.data[firsvi]['port_2']||'',
                            proto:topo_allElement_data[i][kk].netdata.firewall_service.data[firsvi]['protocol_type']||''
                        }
                        e.firewall_service_type_list.push(firewall_service_type_lists)
                    }
                }

                if(topo_allElement_data[i][kk].netdata.firewall_safe==undefined){
                    firewall_acls_lists={
                        acls_name:'',
                        acl_status:'',
                        direction:'',
                        src_ip:'',
                        dst_ip:'',
                        src_s_port:'',
                        src_e_port:'',
                        server_type:'',
                        action:''
                    }
                    e.firewall_acls_list=[]
                }else{
                    for(var aclss in topo_allElement_data[i][kk].netdata.firewall_safe.data){
                        firewall_acls_lists={
                            acls_name:topo_allElement_data[i][kk].netdata.firewall_safe.data[aclss]['name']||'',
                            acl_status:topo_allElement_data[i][kk].netdata.firewall_safe.data[aclss]['status']||'',
                            direction:topo_allElement_data[i][kk].netdata.firewall_safe.data[aclss]['direction']||'',
                            src_ip:topo_allElement_data[i][kk].netdata.firewall_safe.data[aclss]['source_add']||'',
                            dst_ip:topo_allElement_data[i][kk].netdata.firewall_safe.data[aclss]['target_add']||'',
                            src_s_port:topo_allElement_data[i][kk].netdata.firewall_safe.data[aclss]['source_port']||'',
                            src_e_port:topo_allElement_data[i][kk].netdata.firewall_safe.data[aclss]['source_port_end']||'',
                            server_type:topo_allElement_data[i][kk].netdata.firewall_safe.data[aclss]['service']||'',
                            action:topo_allElement_data[i][kk].netdata.firewall_safe.data[aclss]['policy']||''
                        }
                        e.firewall_acls_list.push(firewall_acls_lists)
                    }
                }




                lastData.firewalls.push(e)
            }
        }
        else if(i=='u378'){
            for(  kk in topo_allElement_data[i] ){
                f={
                    internet_name: kk,
                    interface:'',
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y
                }

                if(topo_allElement_data[i][kk].formdata)
                {
                    for(var szj in topo_allElement_data[i][kk].formdata){
                        f.interface=topo_allElement_data[i][kk].formdata[1].value

                    }
                }

                lastData.internet.push(f)
            }
        }
        else if(i=='u512'){
            for(  kk in topo_allElement_data[i] ){
                g={
                    controller_name:kk,
                    ip_addr:topo_allElement_data[i][kk].netdata.data['sdnC-2']||"",
                    port:topo_allElement_data[i][kk].netdata.data['sdnC-3']||"",
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y
                }



                lastData.sdn_controllers.push(g)
            }
        }
        else if(i=='u1811'){
            for(  kk in topo_allElement_data[i] ){
                h={
                    switch_name:kk,
                    openflow_version:topo_allElement_data[i][kk].netdata.data['sdnS-2'] || '',
                    master_controller_ip:topo_allElement_data[i][kk].netdata.data['sdnS-3'] || '',
                    master_controller_port:topo_allElement_data[i][kk].netdata.data['sdnS-4'] || '',
                    slave_controller_ip:topo_allElement_data[i][kk].netdata.data['sdnS-5'] || '',
                    slave_controller_port:topo_allElement_data[i][kk].netdata.data['sdnS-6'] || '',
                    optical_port_num:24,
                    electrical_interface_num:24,
                    eth_list:[],
                    pos_x:topo_allElement_data[i][kk].x,
                    pos_y:topo_allElement_data[i][kk].y
                }
                if(topo_allElement_data[i][kk].netdata.interface_list==undefined){
                    h.eth_list=[]
                }else{
                    for( ethrsst in topo_allElement_data[i][kk].netdata.interface_list.data){
                        h.eth_list.push(topo_allElement_data[i][kk].netdata.interface_list.data[ethrsst]);
                    }
                }




                lastData.sdn_switchs.push(h)
            }
        }
    }

    for(var link_id in link_obj.links){

        //console.log(link_obj.links[link_id]);
        if(link_obj.links[link_id].dashedPattern){
            var  link_type = 'imaginary_line';
        }else{
            var  link_type = 'full_line';
        }

        var auto_links={
            link_name:link_obj.links[link_id].link_id,
            src:link_obj.links[link_id].nodeA.data.id+":"+link_obj.links[link_id].link_net1,
            dst:link_obj.links[link_id].nodeZ.data.id+":"+link_obj.links[link_id].link_net2,
            link_type:link_type,
            bw:'',
            loss:'',
            delay:''
        }
        lastData.links.push(auto_links)
    }

    return lastData;
}



//保存
