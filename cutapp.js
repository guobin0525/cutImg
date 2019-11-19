//1.express三步创建服务器基本构架
const express=require("express");
const app=express();
app.listen(3333,function () {
    console.log("3333 server is running");
});
//2.引入node系统模块
const path=require("path");
const fs=require("fs");
//3.引入第三方模块
const formidable=require("formidable");
const sd=require("silly-datetime");
const gm=require("gm");

//4.设置ejs模板引擎
app.set("view engine","ejs");

//5.设置静态资源目录
//1）加载ejs文件中的css,js等静态资源
app.use("/public",express.static("./public"));
//2）加载uploads文件夹中上传的图片
app.use("/uploads",express.static("./uploads"));
//3）加载avatar文件夹上的裁切后的图片
app.use("/avatar",express.static("./avatar"));

//6.设置路由
//1）加载上传文件目录
app.get('/tofile',function (req, res, next) {
    res.render('tofile',{});
});
//2）提交上传文件数据
app.post('/todata',function (req, res, next) {
    //新建form对象
    var form=new formidable.IncomingForm();
    //设置文件上传路径
    form.uploadDir="./uploads/";
    //解析上传的文件参数
    form.parse(req,function (err, fields, files) {
        if(err){
            console.log('formidble错误');
            return;
        }
        var oldPath=files.myfile.path;
        var originName=files.myfile.name;
        var originNameObj=path.parse(originName);
        var newName="gms"+sd.format(new Date(),"YYYYMMDD_HHmmss")+originNameObj.ext;
        var newPath=form.uploadDir+newName;
        //更换上传的文件路径和名字
        fs.rename(oldPath,newPath,function (err) {
            if(err){
                console.log('图片重命名失败');
                return;
            }
            res.send({'bok':true,'msg':'上传图片成功！！！','imgsrc':newName});
        });
    })
});
//3）渲染裁切图页面
app.get('/showcutimg',function (req, res, next) {
    var cutimgSrc=req.query.cursrc;
    res.render('mycut',{
        imgsrc:cutimgSrc
    })
});
//4）裁切图片
app.get('/cutimg',function (req, res, next) {
    var curobj=req.query;
    gm("./uploads/"+curobj.imgsrc)
        .crop(curobj.w,curobj.h,curobj.x,curobj.y)
        .resize(curobj.xsize,curobj.ysize,"!")
        .write("./avatar/"+curobj.imgsrc,function (err) {
            if(err){
                res.send({"bok":false,"msg":err});
            }else{
                res.send({"bok":true,"msg":"截图成功"})
            }
        });
});