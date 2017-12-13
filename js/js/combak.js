//定义prototype
Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

var cli=0;//客户端元件id变量/总的个数
  //var ser=0;//服务器元件id变量/个数
  //var l2=0;
  //var l3=0;
  //var rou=0;
  //var fir=0;
  //var yun=0;
  //var sdnc=0;
  //var sdns=0;
  var tid='';
  var cli_num=0;//客户端
  var ser_num=0;
  var l2_num=0;
  var l3_num=0;
  var rou_num=0;
  var fir_num=0;
  var yun_num=0;
  var sdnc_num=0;
  var sdns_num=0;
  var dada=[];
  var time = null;//定时器
  var canvas = document.getElementById('target');
  var stage  = new JTopo.Stage(canvas);
  //显示工具栏
  showJTopoToobar(stage);
  var scene = new JTopo.Scene(stage);
  // var colors = ['0,0,255','144,238,144','255,165,0','255,0,0']; //蓝色、绿色、橙色、红色
  var currentNode = null;
  var currentLine = null;
  var currentDetail = {
    //'OS': "CentOS 7",
    //'RAM': "8GB",
    //'cpu': "四核",
    //"磁盘": "256GB"
  }
  // var currentType = '1';
  var beginNode = null;
  var tempNodeA = new JTopo.Node('tempA');
  tempNodeA.setSize(1, 1);
  var tempNodeZ = new JTopo.Node('tempZ');
  tempNodeZ.setSize(1, 1);
  var link = newLink(tempNodeA, tempNodeZ);  

  scene.mousemove(function(e){      
    tempNodeZ.setLocation(e.x, e.y);
    //console.log(e.x)
  }); 

  $(".coms").delegate(".component", "mousedown", function(md){   
    md.preventDefault();
    var mouseX = md.pageX;
    var mouseY = md.pageY;    
    var $this = $(this);        
    var $temp = $("<div id='temp'></div>").append($this.clone());
   console.log($this.context.id);
    //if($this.context.id=="u382"){
    //  alert(1)
    //}
    $("body").append($temp);
    $temp.css({"position" : "absolute",
               "top"      : mouseY - ($temp.height()/2) + "px",
               "left"     : mouseX - ($temp.width()/2) + "px",
               "opacity"  : "0.9"}).show();
    var half_box_height = ($temp.height()/2);
    var half_box_width = ($temp.width()/2);
    var $target = $("#target");

    $(document).delegate("body", "mousemove", function(mm){
      var mm_mouseX = mm.pageX;
      var mm_mouseY = mm.pageY;
      $temp.css({"top": mm_mouseY - half_box_height + "px" ,"left" : mm_mouseX - half_box_width  + "px"});

    });

    $("body").delegate("#temp", "mouseup", function(mu){
      mu.preventDefault();
      var mu_mouseX = mu.pageX;
      var mu_mouseY = mu.pageY;
      var tar_pos = $target.position();      

      if (mu_mouseX + half_box_width > tar_pos.left &&
        mu_mouseX - half_box_width < tar_pos.left + $target.width()&&
        mu_mouseY + half_box_height > tar_pos.top &&
        mu_mouseY - half_box_height < tar_pos.top + $target.height()
        ){   
          var child = $temp.children()[0];

          //var tmpnode = {
          //  name: child.title,
          //  left: parseInt($temp.css('left')) - tar_pos.left,
          //  top: parseInt($temp.css("top")) - tar_pos.top,
          //  type: child.id + '.svg',
          //  id:child.id+cli,
          //  ip:$('#cli-allocation-3').val(),
          //  netmask:'',
          //};

          var c_hosts={//初始化客户端
            hosts_name: child.title,
            host_type:'',
            ip_type:'',
            ip:'',
            netmask:'',
            gateway:'',
            first_dns:'',
            second_dns:'',
            left: parseInt($temp.css('left')) - tar_pos.left,
            top: parseInt($temp.css("top")) - tar_pos.top,
            type: child.id + '.svg',
            id:child.id+cli,
          };

        var c_servers={//初始化服务器
          server_name: child.title,
          dns_server:'',
          web_server:'',
          ip_type:'',
          ip:'',
          netmask:'',
          gateway:'',
          //web_config:'',
          //service_port:'',
          left: parseInt($temp.css('left')) - tar_pos.left,
          top: parseInt($temp.css("top")) - tar_pos.top,
          type: child.id + '.svg',
          id:child.id+cli,
        };

        var c_routers={//初始化路由器
          router_name:child.title,
          eth_list:[],
          static_route_list:[],
          nat_pool_list:[],
          port_mapping_list:[],
          rip_protocol:{},
          ospfv2_protocol:{},
          bgp_protocol:{},
          left: parseInt($temp.css('left')) - tar_pos.left,
          top: parseInt($temp.css("top")) - tar_pos.top,
          type: child.id + '.svg',
          id:child.id+cli,
        };

        var c_firewalls={//初始化防火墙
          firewall_name:child.title,
          eth_list:[],
          static_route_list:[],
          firewall_acls_list:[],
          firewall_service_type_list:[],
          nat_pool_list:[],
          left: parseInt($temp.css('left')) - tar_pos.left,
          top: parseInt($temp.css("top")) - tar_pos.top,
          type: child.id + '.svg',
          id:child.id+cli,
        };

        var c_sdn_switchs={//初始化sdn交换机
          switch_name:child.title,
          openflow_version:'',
          master_controller_ip:'',
          master_controller_port:'',
          slave_controller_ip:'',
          slave_controller_port:'',
          optical_port_num:'',
          electrical_interface_num:'',
          eth_list:[],
          left: parseInt($temp.css('left')) - tar_pos.left,
          top: parseInt($temp.css("top")) - tar_pos.top,
          type: child.id + '.svg',
          id:child.id+cli,

        };

        var c_sdn_controllers={//初始化sdn控制器
          controller_name:child.title,
          ip_addr:'',
          port:'',
          left: parseInt($temp.css('left')) - tar_pos.left,
          top: parseInt($temp.css("top")) - tar_pos.top,
          type: child.id + '.svg',
          id:child.id+cli,
        };
        var c_cloud={//初始化云
          cloud_name:child.title,
          eth_list:[],
          left: parseInt($temp.css('left')) - tar_pos.left,
          top: parseInt($temp.css("top")) - tar_pos.top,
          type: child.id + '.svg',
          id:child.id+cli,
        }

          //alert(child.id);
        if(child.id=='u380'){
          addNode(c_hosts);
        }else if(child.id=='u384'){
          addNode(c_servers);
        }else if(child.id=='u382'){
          addNode(c_routers);
        }else if(child.id=='u388'){
          addNode(c_firewalls);
        }else if(child.id=='u1811'){
          addNode(c_sdn_switchs);
        }else if(child.id=='u512'){
          addNode(c_sdn_controllers);
        }else if(child.id=='u378'){
          addNode(c_cloud);
        }

        }

      $temp.remove();
      $(document).undelegate("body", "mousemove");
      $("body").undelegate("#temp","mouseup");

    });       
  });  

   $(".coms .line").click(function(e){
     currentType = e.target.id;
   });

  function addNode(node) {
    if(node.type=='u380.svg'){
      var n = new JTopo.Node(node.hosts_name);
    }else if(node.type=='u384.svg'){
      var n = new JTopo.Node(node.server_name);
    }else if(node.type=='u382.svg'){
      var n = new JTopo.Node(node.router_name);
    }else if(node.type=='u388.svg'){
      var n = new JTopo.Node(node.firewall_name);
    }else if(node.type=='u1811.svg'){
      var n = new JTopo.Node(node.switch_name);
    }else if(node.type=='u512.svg'){
      var n = new JTopo.Node(node.controller_name);
    }else if(node.type=='u378.svg'){
      var n = new JTopo.Node(node.cloud_name);
    }

    n.type=node.type;
    n.iiid=node.id;
    //n.ip=node.ip;
    //n.netmask=node.netmask;
    if(node.type=='u380.svg'){

      hosts.push(node);

    }else if(node.type=='u384.svg'){
      servers.push(node);
    }else if(node.type=='u382.svg'){
      routers.push(node);
    }else if(node.type=='u388.svg'){
      firewalls.push(node);
    }else if(node.type=='u378.svg'){
      cloud.push(node);
    }else if(node.type=='u512.svg'){
      sdn_controllers.push(node);
    }else if(node.type=='u1811.svg'){
      sdn_switchs.push(node);
    }


      cli++;

    //else if(n.type=='u384.svg'){
    //  ser++;
    //
    //}
    //else if(n.type=='u382.svg'){
    //  rou++
    //}
    //else if(n.type=='u388.svg'){
    //  fir++
    //}else if(n.type=='u378.svg'){
    //  yun++
    //}else if(n.type=='u512.svg'){
    //  sdnc++
    //}else if(n.type=='u1811.svg'){
    // sdns++
    //}
    console.log(node.name);

  //  data = {}
  //  if (node.type == '30.sv'){
  //    data['客户端'][node.id].push() = {
  //      data: {},
  //      'id': 'dsad',
  //      'type': 'sad'
  //    }
  //  n.type1 = '客户端11'
  //}

    n.setLocation(node.left, node.top);

    n.setImage("../images/" + node.type);
    console.log(node.type);
    n.fontColor = '155,123,2';
    n.font = 'bold 12px 微软雅黑';
    scene.add(n);
    console.log(n);
    n.addEventListener('mouseup', function(e){
      currentNode = this;
      handler(e);
      cli_9=n.x;
      cli_10=n.y;

    });
    n.mousedown(function(e){
      if(e.target == null || e.target === beginNode || e.target === link){
          scene.remove(link);
      }
    });
  //  拿元件的名字
  //  console.log(n.text)
  }

  function newLink(nodeA, nodeZ){
    var linestyle = $("#linestyle").val(); 
    var l = null;
    if(linestyle == 'defaultline'){
      l = new JTopo.Link(nodeA, nodeZ);
      l.lineWidth   = 3;
      l.strokeColor = '0,153,204';
      //l.arrowsRadius = 12;
      l.shadow = false;
      l.bundleGap = 20;
    }
     else if (linestyle == "simpleline") {
      l = new JTopo.Link(nodeA, nodeZ);    
      l.lineWidth = 4;
      l.dashedPattern = 5;
      //l.arrowsRadius = 12;
      //l.bundleOffset = 60;
      l.bundleGap = 20; 
      l.textOffsetY = 3; 
      l.strokeColor = '0,153,204';
    }
    //else if (linestyle == "polyline") {
    //  l = new JTopo.FoldLink(nodeA, nodeZ);
    //  l.direction = 'horizontal';
    //  l.arrowsRadius = 12;
    //  l.lineWidth = 3;
    //  l.bundleOffset = 60; // 折线拐角处的长度
    //  l.bundleGap = 20; // 线条之间的间隔
    //  l.textOffsetY = 3; // 文本偏移量（向下3个像素）
    //  l.strokeColor = '255,165,0';
    //  l.dashedPattern = 5;
    //} else if (linestyle == "dbpolyline") {
    //  l = new JTopo.FlexionalLink(nodeA, nodeZ);
    //  l.direction = 'horizontal';
    //  l.arrowsRadius = 12;
    //  l.lineWidth = 3; // 线宽
    //  l.offsetGap = 35;
    //  l.bundleGap = 15; // 线条之间的间隔
    //  l.textOffsetY = 10; // 文本偏移量（向下15个像素）
    //  l.strokeColor = '0,250,0';
    //  l.dashedPattern = 3;
    //} else if (linestyle == "curve") {
    //  l = new JTopo.CurveLink(nodeA, nodeZ);
    //  l.lineWidth = 3; // 线宽
    //  l.arrowsRadius = 12;
    //  l.strokeColor = '255,0,0';
    //}
    
    return l;
  }

  function addLink(l){
    scene.add(l);
    l.addEventListener('mouseup', function (e) {
      alert(123)
      currentLine = this;
      handlerLine(e);
      console.log(e.x)
    });
  }

  function handlerLine(e) {
    if (e.button == 2) {// 右键        
      //当前位置弹出菜单（div）
      $("#linemenu").css({
          top: e.pageY,
          left: e.pageX
      }).show();
    } 
  }
  function handler(e){
    if(e.button == 2){// 右键
      //当前位置弹出菜单（div）
      alert(1);
      $("#contextmenu").css({
          top: e.pageY,
          left: e.pageX
      }).show();
        scene.remove(link);
    } else {
      if(e.target != null && e.target instanceof JTopo.Node && $("input[name='modeRadio']:checked").val() == "normal"){
        if(beginNode == null){
          beginNode = e.target;
          //选择接口
          //$("#chooseS").show();
          //console.log($('#choose-1').val());
          //$(document).on("change","#choose-1",function(){
          //  //alert('value：'+);//获取value
          //  //alert('text：'+$(this).find("option:selected").text());//获取选中文本
          //  if($(this).val()=='Eth1'){
          //    $("#chooseS").hide();
          //  }
          //});
          console.log(currentNode.x);
          addLink(link);
          tempNodeA.setLocation(e.x, e.y);
          tempNodeZ.setLocation(e.x, e.y);
        } else if(beginNode !== e.target){
          var endNode = e.target;
          var l = newLink(beginNode, endNode);
          //alert(111);选择接口2
          //$("#chooseE").show();
          //console.log($('#choose-2').val());
          //$(document).on("change","#choose-2",function(){
          //  //alert('value：'+);//获取value
          //  //alert('text：'+$(this).find("option:selected").text());//获取选中文本
          //  if($(this).val()=='Eth1'){
          //    $("#chooseE").hide();
          //  }
          //});
          addLink(l);

          beginNode = null;
          scene.remove(link);
        } else {
          beginNode = null;
        }
      }else{
          scene.remove(link);
      }
    }
  }

  stage.click(function(event){


    if(event.button == 0){
        // 关闭弹出菜单（div）
        $("#contextmenu").hide();   
        $("#linemenu").hide();      
    }
  });
  /* 节点右键菜单处理 */ 
  $("#contextmenu a").click(function(e,node){
    var text = $(this).text();
    //var n = new JTopo.Node(node.name);
    if(text == '删除该节点'){
      if (currentNode.type == 'u380.svg'){
        for(var i=0;i<hosts.length;i++){
          //console.log(hosts[i].id);
          if(hosts[i].id==currentNode.iiid){
            hosts.remove(hosts[i]);
          }
        }
      } else if (currentNode.type == 'u384.svg'){
        for(var i=0;i<servers.length;i++){
          //console.log(hosts[i].id);
          if(servers[i].id==currentNode.iiid){
            servers.remove(servers[i]);
          }
        }
      }else if (currentNode.type == 'u382.svg'){
        for(var i=0;i<routers.length;i++){
          //console.log(hosts[i].id);
          if(routers[i].id==currentNode.iiid){
            routers.remove(routers[i]);
          }
        }
      }else if (currentNode.type == 'u388.svg'){
        for(var i=0;i<firewalls.length;i++){
          //console.log(hosts[i].id);
          if(firewalls[i].id==currentNode.iiid){
            firewalls.remove(firewalls[i]);
          }
        }
      }else if (currentNode.type == 'u512.svg'){
        for(var i=0;i<sdn_controllers.length;i++){
          //console.log(hosts[i].id);
          if(sdn_controllers[i].id==currentNode.iiid){
            sdn_controllers.remove(sdn_controllers[i]);
          }
        }
      }else if (currentNode.type == 'u1811.svg'){
        for(var i=0;i<sdn_switchs.length;i++){
          //console.log(hosts[i].id);
          if(sdn_switchs[i].id==currentNode.iiid){
            sdn_switchs.remove(sdn_switchs[i]);
          }
        }
      }else if (currentNode.type == 'u378.svg'){
        for(var i=0;i<cloud.length;i++){
          //console.log(hosts[i].id);
          if(cloud[i].id==currentNode.iiid){
            cloud.remove(cloud[i]);
          }
        }
      }
      scene.remove(currentNode);
      currentNode = null;

    }else if(text == '撤销上一次操作'){
      currentNode.restore();
    }else if(text == '更改颜色'){
      currentNode.fillColor = JTopo.util.randomColor();
    }else if(text == '顺时针旋转'){
      currentNode.rotate += 0.5;
    }else if(text == '逆时针旋转'){
      currentNode.rotate -= 0.5;
    }else if(text == '放大'){
      currentNode.scaleX += 0.2;
      currentNode.scaleY += 0.2;
    }else if(text == '缩小'){
      currentNode.scaleX -= 0.2;
      currentNode.scaleY -= 0.2;
    }else if(text == '元件配置'){
      var detail = currentNode.detail || currentDetail;
      console.log(currentNode);

      if (currentNode.type == 'u380.svg'){
        console.log(currentNode.iiid);
        $('.modal-content input').val('');
//                        clearTimeout(time);
//                        time = setTimeout(function(){
//                            $("#modal1").show();
//                            console.log(time);
//
//                        },300);
//                        var isClick = true;
//                        $(currentNode2).on('touchstart', function(e){
//                            isClick = true;
//                        });
//                        $(currentNode2).on('touchmove', function(e){
//                            isClick = false;
//                        });
//                        $(currentNode2).on('touchend', function(e){
//                            if (isClick == true){
//                                console.log("触发点击事件");
//                            }
//                        })
        $("#modal7").show();
        $('#modal-cli-form-1-btn').click(
            function () {
              currentNode.text=$('#cli-allocation-1').val();
              //data.hosts[0].host_name=currentNode.text;
              //console.log(data.hosts[0].host_name);
              cli_1=currentNode.text;
              console.log(node);

              //n.type=node.type
              console.log(currentNode.text);
              for(var i=0;i<hosts.length;i++){
                //console.log(hosts[i].id);
                if(hosts[i].id==currentNode.iiid){
                  hosts[i].hosts_name=currentNode.text;
                }
              }

            }
        );
        $('#modal-cli-form-2-btn').click(
            function () {
              //cli_4=$('#cli-allocation-3').val();
              for(var i=0;i<hosts.length;i++){
                //console.log(hosts[i].id);
                if(hosts[i].id==currentNode.iiid){
                  hosts[i].ip=$('#cli-allocation-3').val();
                }
              }
              //cli_5=$('#cli-allocation-4').val();
              for(var i=0;i<hosts.length;i++){
                //console.log(hosts[i].id);
                if(hosts[i].id==currentNode.iiid){
                  hosts[i].netmask=$('#cli-allocation-4').val();
                }
              }

              //cli_6=$('#cli-allocation-5').val();
              for(var i=0;i<hosts.length;i++){
                //console.log(hosts[i].id);
                if(hosts[i].id==currentNode.iiid){
                  hosts[i].gateway=$('#cli-allocation-5').val();
                }
              }
              //cli_7=$('#cli-allocation-6').val();
              //cli_8=$('#cli-allocation-7').val();
              for(var i=0;i<hosts.length;i++){
                //console.log(hosts[i].id);
                if(hosts[i].id==currentNode.iiid){
                  hosts[i].first_dns=$('#cli-allocation-6').val();
                }
              }
              for(var i=0;i<hosts.length;i++){
                //console.log(hosts[i].id);
                if(hosts[i].id==currentNode.iiid){
                  hosts[i].second_dns=$('#cli-allocation-7').val();
                }
              }
              for(var i=0;i<hosts.length;i++){
                //console.log(hosts[i].id);
                if(hosts[i].id==currentNode.iiid){
                  hosts[i].ip_type=$('#cli-allocation-2').val();
                }
              }
            }
        )
      }
      else if(currentNode.type == 'u384.svg'){//服务器
        $('.modal-content input').val('');

        $("#modal1").show();


        $('#modal-form-1-btn').click(
            function () {
              currentNode.text=$('#server-allocation-1').val();
              //data.servers[0].server_name=currentNode.text;
              //console.log(data.servers[0].server_name);
              for(var i=0;i<servers.length;i++){
                //console.log(hosts[i].id);
                if(servers[i].id==currentNode.iiid){
                  servers[i].server_name=currentNode.text;
                }
              }
            }
        );
        $('#modal-form-2-btn').click(
            function () {
              //cli_4=$('#cli-allocation-3').val();
              for(var i=0;i<servers.length;i++){
                //console.log(hosts[i].id);
                if(servers[i].id==currentNode.iiid){
                  servers[i].ip=$('#cli-allocation-3').val();
                }
              }
              //cli_5=$('#cli-allocation-4').val();
              for(var i=0;i<servers.length;i++){
                //console.log(hosts[i].id);
                if(servers[i].id==currentNode.iiid){
                  servers[i].netmask=$('#server-allocation-4').val();
                }
              }

              //cli_6=$('#cli-allocation-5').val();
              for(var i=0;i<servers.length;i++){
                //console.log(hosts[i].id);
                if(servers[i].id==currentNode.iiid){
                  servers[i].gateway=$('#server-allocation-5').val();
                }
              }
              //cli_7=$('#cli-allocation-6').val();
              //cli_8=$('#cli-allocation-7').val();
              //for(var i=0;i<hosts.length;i++){
              //  //console.log(hosts[i].id);
              //  if(hosts[i].id==currentNode.iiid){
              //    hosts[i].first_dns=$('#cli-allocation-6').val();
              //  }
              //}
              //for(var i=0;i<hosts.length;i++){
              //  //console.log(hosts[i].id);
              //  if(hosts[i].id==currentNode.iiid){
              //    hosts[i].second_dns=$('#cli-allocation-7').val();
              //  }
              //}
              for(var i=0;i<servers.length;i++){
                //console.log(hosts[i].id);
                if(servers[i].id==currentNode.iiid){
                  servers[i].ip_type=$('#server-allocation-2').val();
                }
              }
            }
        )
      }
      else if(currentNode.text.trim() == 'L2交换机'){
        $("#modal2").show();
      }
      else if(currentNode.text.trim() == 'L3交换机'){

      }
      else if(currentNode.type == 'u382.svg'){
        $('.modal-content input').val('');
        $("#modal3").show();
        $('#modal-router-form-1-btn').click(
            function () {
              currentNode.text=$('#router-allocation-1').val();
              //data.routers[0].router_name=currentNode.text;
              //console.log(data.routers[0].router_name);
              for(var i=0;i<routers.length;i++){
                //console.log(hosts[i].id);
                if(routers[i].id==currentNode.iiid){
                  routers[i].router_name=currentNode.text;
                }
              }
            }
        )

      }
      else if(currentNode.type == 'u388.svg'){
        $('.modal-content input').val('');
        $("#modal4").show();
        $('#modal-firewall-form-1-btn').click(
            function () {
              currentNode.text=$('#firewall-allocation-1').val();
              //data.firewalls[0].firewall_name=currentNode.text;
              //console.log(data.firewalls[0].firewall_name);
              for(var i=0;i<firewalls.length;i++){
                //console.log(hosts[i].id);
                if(firewalls[i].id==currentNode.iiid){
                  firewalls[i].firewall_name=currentNode.text;
                }
              }
            }
        )

      }
      else if(currentNode.type == 'u378.svg'){
        $('.modal-content input').val('');
        $("#modal8").show();
        $('#modal-yun-form-1-btn').click(
            function () {
              currentNode.text=$('#yun-allocation-1').val();
              //data.firewalls[0].firewall_name=currentNode.text;
              //console.log(data.firewalls[0].firewall_name);
              for(var i=0;i<cloud.length;i++){
                //console.log(hosts[i].id);
                if(cloud[i].id==currentNode.iiid){
                  cloud[i].cloud_name=currentNode.text;
                }
              }
            }
        )

      }
      else if(currentNode.type == 'u512.svg'){
        $('.modal-content input').val('');
        $("#modal5").show();
        $('#modal-sdnC-form-1-btn').click(
            function () {
              currentNode.text=$('#sdnC-allocation-1').val();
              for(var i=0;i<sdn_controllers.length;i++){
                //console.log(hosts[i].id);
                if(sdn_controllers[i].id==currentNode.iiid){
                  sdn_controllers[i].controller_name=currentNode.text;
                }
              }

            }
        )

      }
      else if(currentNode.type == 'u1811.svg'){
        $('.modal-content input').val('');
        $("#modal6").show();
        $('#modal-sdnS-form-1-btn').click(
            function () {
              currentNode.text=$('#sdnS-allocation-1').val();
              for(var i=0;i<sdn_switchs.length;i++){
                //console.log(hosts[i].id);
                if(sdn_switchs[i].id==currentNode.iiid){
                  sdn_switchs[i].switch_name=currentNode.text;
                }
              }
            }
        )

      }
      var li = "";
      if(detail != '' && detail != undefined){
          $.each(detail,function(key,item){
              li += "<li>"+key+" : "+item+"</li>";
          });
      }else{
          li = "<li>暂无详细参数</li>";
      }
      $("#detail").html(li);
      $("#contextmenu").hide();
      $("#detail li").attr("style","padding:6px");
      $("#detail").css({
          top: currentNode.y,
          left: currentNode.x
      }).show();
    }else if(text == '前往机器管理平台'){
      var url = currentNode.url;
      if(url != '' && url != undefined){
          window.open(url);
      }else{
          $("#detail").html("<li>接口未给出机器管理平台地址，无法跳转</li>");
          $("#contextmenu").hide();
          $("#detail li").attr("style","padding:10px");
          $("#detail").css({
              top: currentNode.y-30,
              left: currentNode.x+40
          }).show();
      }
    }else{
      currentNode.save();
    }
    $("#contextmenu").hide();    
  });

  /* 连线右键菜单处理 */ 
  $("#linemenu a").click(function(){
    var text = $(this).text();    
    if(text == '删除该连线'){

      scene.remove(currentLine);
      currentLine = null;
    }
    $("#linemenu").hide();
  });

  //保存拓扑名称
  $('#keep-topoName').click(function () {
    $('#topo-span').html($('#topo-name').val());
    topoName=$('#topo-name').val();
    $('#topo-name').fadeOut();
    console.log(topoName);
  });

  //保存拓扑
  var topoName;
  var cli_1;//客户端名称
  var cli_2;//客户端类型 不填
  var cli_3;//ip_type 暂无
  var cli_4;//ip
  var cli_5;
  var cli_6;
  var cli_7;
  var cli_8;
  var cli_9;
  var cli_10;

  var hosts=[
    //{
    //  id:'',
    //  "host_name": "",
    //  "host_type": "",
    //  "ip_type": "",
    //  "ip": "",
    //  "netmask": "",
    //  "gateway": "",
    //  "first_dns": "",
    //  "second_dns": "",
    //  "pos_x": '',
    //  "pos_y":''
    //}
  ]
  ;
  var sdn_controllers=[];
  var sdn_switchs=[];
  var legacy_3_switchs=[];
  var legacy_2_switchs=[];
  var routers=[];
  var firewalls=[];
  var servers=[];
  var cloud=[];
  var links=[];
  var data={
    "topo_name":'',
    "cookie": "123456",
    "topo_type": "SDN",
    "sdn_controllers": sdn_controllers,
    "sdn_switchs": sdn_switchs,
    "legacy_3_switchs":legacy_3_switchs,
    "legacy_2_switchs": legacy_2_switchs,
    "routers": routers,
    "firewalls": firewalls,
    "hosts": hosts,
    "servers": servers,
    "cloud": cloud,
    "links": links,
    "internet": {
      "internet_name": "internet1",
      "pos_x": 2.3,
      "pos_y": 3.2
    }
  };

  $('#keep-topo').click(function () {
console.log(cli);
    console.log(data);

    //for(var i=0;i<dada.length;i++){
    //  console.log(hosts);
    //  if(dada[i].type=='u380.svg'){
    //    cli_num++;
    //    //hosts.push(dada[i]);
    //  }else if(dada[i].type=='u384.svg'){
    //    ser_num++
    //  }else if(dada[i].type=='u382.svg'){
    //    rou_num++
    //  }else if(dada[i].type=='u388.svg'){
    //    fir_num++
    //  }else if(dada[i].type=='u378.svg'){
    //    yun_num++
    //  }else if(dada[i].type=='u512.svg'){
    //    sdnc_num++
    //  }else if(dada[i].type=='u1811.svg'){
    //    sdns_num++
    //  }
    //}
    console.log("客户端"+cli_num);
    console.log('服务器有'+ser_num);
    console.log('yun有'+yun_num);
    console.log('sdc'+sdnc_num);
    console.log('sdns'+sdns_num);
    console.log('fir'+fir_num);
    console.log('rou'+rou_num);

    //function save_topo(){
    //  var topo_name = $("#show_topo_name").html();
    //  //调用topo.js 中保存数据的函数save();
    //  var topo_info  = save();
    //  console.log(topo_info);
    //  topo_info_arr = JSON.stringify(topo_info);
    //  $.post('http://10.10.1.67:8080/net/index.php/topo_manage/topo_manage/save_topo',{'topo_name':topo_name,'topo_info_arr':topo_info_arr},function(result) {
    //    reply_status(result,'http://10.10.1.67:8080/net/index.php/topo_manage/topo_manage');
    //  });
    //
    //}
    //save_topo();

  });

  //var aaa=[{name: "客户端", left: 103, top: 22, type: "u380.svg", id: "u3800"},{name: "客户端", left: 203, top: 82, type: "u380.svg", id: "u3800"}];
  //for(var r=0;r<aaa.length;r++){
  //  addNode(aaa[r]);
  //}
//addNode({name: "客户端", left: 39, top: 30, type: "u380.svg", id: "u3800"});
//console.log(hosts);


