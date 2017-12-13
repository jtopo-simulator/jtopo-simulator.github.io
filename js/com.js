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


  //scene.mousemove(function(e){
  //  tempNodeZ.setLocation(e.x, e.y);
  //});

  $(".coms").delegate(".component", "mousedown", function(md){
    md.preventDefault();
    var mouseX = md.pageX;
    var mouseY = md.pageY;
    var $this = $(this);
    var $temp = $("<div id='temp'></div>").append($this.clone());
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

        var left = parseInt($temp.css('left')) - tar_pos.left;
        var top  = parseInt($temp.css("top")) - tar_pos.top;

        create_element(child,left,top)

      }

      $temp.remove();
      $(document).undelegate("body", "mousemove");
      $("body").undelegate("#temp","mouseup");

    });
  });

   $(".coms .line").click(function(e){
     currentType = e.target.id;
   });







  function handlerLine(e) {
    if (e.button == 2) {// 右键
      //当前位置弹出菜单（div）
      $("#linemenu").css({
          top: e.pageY,
          left: e.pageX
      }).show();
    }
  }


  stage.click(function(event){


    if(event.button == 0){
        // 关闭弹出菜单（div）
        $("#contextmenu").hide();
        $("#linemenu").hide();

    }

      if(event.button == 2){
          // 关闭弹出菜单（div）
         alert(2)
      }
  });
//
stage.addEventListener('mouseup', function(e){

    if( e.button == 2 && $("input[name='modeRadio']:checked").val() == "normal" ){
        link_obj.remove_virtual_link()
    }
});

  /* 节点右键菜单处理 */


  /* 连线右键菜单处理 */


$("#linemenu a").click(function(){

    link_obj.remove_link()
    $("#linemenu").hide();
});



