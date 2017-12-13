/**
 * Created by Administrator on 2017/8/2.
 */
$(document).ready(function(){
    $("#txt").focus(function(){

        $("#txt").css("border-bottom","1px solid #0288D1");
    });
    $("#txt").blur(function(){
        $("#txt").css("border-bottom","1px solid #dddddd");
    });

    $("#pwd").focus(function(){

        $("#pwd").css("border-bottom","1px solid #0288D1");
    });
    $("#pwd").blur(function(){
        $("#pwd").css("border-bottom","1px solid #dddddd");
    });
    //$("#login").click(function () {
    //    window.window.location.href='panel.html';
    //});
})
