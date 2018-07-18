/**
 * @authors fls
 * @date    2018-07-10 14:59:52
 * @version 1.0.0
 * 预览一个容器内的图片，可循环预览，下载（不支持IE），删除。
 */

 (function(win,doc){  
 	var Preview = function(boxId,openBoxId,closeId,size){//boxId是图片容器的id,openBoxId是预览弹框的id,size包含弹出框的最大最小宽，宽等高
 		this.box       = doc.getElementById(boxId) || doc.getElementById("imgLook");//图片容器
 		this.openBox   = doc.getElementById(openBoxId) || doc.getElementById("imgOpen");//弹框容器
 		this.minWidth  = size ? size.minWidth  : 200;//尺寸-最小宽(宽高比大于等于1起作用)
 		this.maxWidth  = size ? size.maxWidth  : window.innerWidth -50;//尺寸-最大宽
 		this.minHeight = size ? size.minHeight : 200;//尺寸-最小高(宽高比小于1起作用)
 		this.maxHeight = size ? size.maxHeight : window.innerHeight - 50;//尺寸-最大高
 		this.src       = "";//预览图片的路径
 		this.title     = "";//图片名称或描述
 		this.preBtn    = "previewBtn";//预览按钮
 		this.delBtn    = "deleteBtn";//删除按钮
        this.downBtn   = "downloadBtn";//下载按钮
        this.prevBtn   = "prevBtn";//上一张按钮
        this.nextBtn   = "nextBtn";//下一张按钮
 		this.imgList   = ".imgList";//可预览项
 		this.close     = doc.getElementById(closeId) || doc.getElementById("imgClose");//关闭弹框按钮
        this.index     = 0;//获取当前显示的是第几张
        this.init();
        this.n         = 0;//为IE下载所设变量
    }

    Preview.prototype = {
     constructor:Preview,
     init: function(){
        var _self = this;

        _self.box.onclick = function(ev){
 				// 触发预览事件
 				_self.open(ev);
 			};
 				//关闭按钮
                _self.close.onclick = function(ev){
                   _self.closeBox();
               }
           },
           open: function(ev){
              var _self = this;
              var ev = ev || window.event;
              var target = ev.target || ev.srcElement;
              var lis = _self.box.querySelectorAll(_self.imgList);

              for(var i=0;i<lis.length;i++){
                if(lis[i]===target.parentNode.parentNode){
                    _self.index = i;//获取显示的index
                }
            }

            if(target.className == _self.preBtn){
 				//预览
                // 获取src和文字描述
                _self.src = target.parentNode.parentNode.querySelector("img").src;

                _self.openBox.innerHTML = "";
                var previewImg = '<img src="'+_self.src+'" alt="">';
                _self.title = target.parentNode.parentNode.querySelector("span").innerHTML;
                var previewTitle = '<div class="imgLookTitle"><span>'+_self.title+'</span></div>';
                // 填充入弹出框内
                _self.openBox.innerHTML = previewImg + previewTitle ;

                //添加关闭按钮
                 var btn =document.createElement("i");           //createElement生成i对象
                 btn.innerHTML = '×'; 
                 btn.id = "imgClose";
                 btn.onclick = function () {                          //绑定点击事件
                    _self.closeBox();
                };

                  //添加上一张按钮
                 var prev =document.createElement("div");           //createElement生成div对象
                 prev.innerHTML = '<div class="arrLeft"></div>'; 
                 prev.className = "prevBtn";
                 prev.onclick = function () {                          //绑定点击事件
                    _self.prevImg();
                };

                  //添加下一张按钮
                 var next =document.createElement("div");           //createElement生成div对象
                 next.innerHTML = '<div class="arrRight"></div>'; 
                 next.className = "nextBtn";
                 next.onclick = function () {                          //绑定点击事件
                    _self.nextImg();
                };

                 _self.openBox.appendChild(btn);                         //添加到页面
                 _self.openBox.appendChild(prev);                         //添加到页面
                 _self.openBox.appendChild(next);                         //添加到页面
                // 显示弹出框
                _self.openBox.querySelector("img").removeAttribute("style");
                _self.openBox.style.display = "block";
                _self.openBox.parentNode.style.display = "block";

                //计算弹出框的尺寸
                _self.setSize();

            }else if(target.className == _self.downBtn){
				//下载
				_self.src = target.parentNode.parentNode.querySelector("img").src;

                var $a = document.createElement('a');
                $a.setAttribute("href", _self.src );
                $a.setAttribute("download", "");

                if(!!window.ActiveXObject || "ActiveXObject" in window)
                {
                    alert("下载功能不支持IE浏览器！"); 
                }
                else
                {  
                    var evt = document.createEvent("MouseEvents");
                    evt.initEvent("click", true, true);
                    $a.dispatchEvent(evt);  
                }  

            }else if(target.className == _self.delBtn){
				//删除
				_self.box.removeChild(target.parentNode.parentNode);
            }else{
            	return ;
            }
        },
        //计算弹出框的尺寸
        setSize: function(){
        	var image = new Image();
        	image.src = this.src;
        	var naturalWidth  = image.width;
        	var naturalHeight = image.height;
        	var open = this.openBox;
        	var img = open.querySelector("img");
        	var ratio = naturalWidth/naturalHeight;

        	// 如果ratio大于等于1，计算宽，否则计算高,20为padding
        	if(ratio >= 1){
        		//图片宽大于高
        		if(naturalWidth <= this.minWidth - 20){// 如果图片的宽小于最小宽
        			img.style.width = this.minWidth - 20 +"px";
        			img.style.height = (this.minWidth - 20)/ratio +"px";
        		}else if(naturalWidth > this.minWidth - 20 && naturalWidth < this.maxWidth - 20){// 如果图片的宽在最大最小宽之间
        			// 如果图片的高小于最大高之间
        			if(naturalHeight <= this.maxHeight - 20){
        				img.style.width = naturalWidth+"px";
        				img.style.height = naturalHeight +"px";
        			}else{// 如果图片的高大于最大高之间
        				img.style.width = (this.maxHeight - 20)*ratio +"px";
        				img.style.height = this.maxHeight - 20+"px";
        			}
        			
        		}else if(naturalWidth >= this.maxWidth - 20){// 如果图片的宽大于最大宽之间
        			// 如果缩放后图片的高小于最大高之间
        			var zoom = this.maxWidth/naturalWidth;
        			if(naturalHeight*zoom <= this.maxHeight - 20){
        				img.style.width = this.maxWidth - 20 +"px";
        				img.style.height = (this.maxWidth - 20)/ratio +"px";
        			}else{
        				img.style.width = (this.maxHeight - 20)*ratio +"px";
        				img.style.height = this.maxHeight - 20 +"px";
        			}
        		}
        	}else{
				//图片高大于宽
        		if(naturalHeight <= this.minHeight - 20){// 如果图片的高小于最小高
        			img.style.width = (this.minHeight - 20)*ratio +"px";
        			img.style.height = this.minHeight - 20 +"px";
        		}else if(naturalHeight > this.minWidth - 20 && naturalHeight < this.maxHeight - 20){// 如果图片的高在最大最小高之间
        			img.style.width = naturalWidth + "px";
        			img.style.height = naturalHeight +"px";
        		}else if(naturalHeight >= this.maxHeight){// 如果图片的高大于最大高之间
        			img.style.width = (this.maxHeight - 20)*ratio +"px";
        			img.style.height = this.maxHeight - 20 +"px";
        		}
        	}
        	// 容器居中
        	open.style.width = parseInt(img.style.width,10) +20 +"px";
        	open.style.height = parseInt(img.style.height,10) +20 +"px";
        	open.style.marginTop = -1 * parseInt(open.style.height,10)/2 +"px";
        	open.style.marginLeft = -1 * parseInt(open.style.width,10)/2 +"px";
        },
        //关闭
        closeBox: function(){
        	var _self = this;
        	_self.openBox.innerHTML = "";
        	_self.openBox.style.display = "none";
        	_self.openBox.parentNode.style.display = "none";

        },
        //上一张
        prevImg: function(){
            var _self = this;
            var lis   = _self.box.querySelectorAll(_self.imgList);
            //如果不是第一张
            if(_self.index != 0){
                _self.src   = lis[_self.index - 1].querySelector("img").src;
                _self.title = lis[_self.index - 1].querySelector("span").innerHTML;
                _self.index --;
            }else{
                //如果是第一张，转到最后一张
                _self.src   = lis[lis.length - 1].querySelector("img").src;
                _self.title = lis[lis.length - 1].querySelector("span").innerHTML;
                _self.index = lis.length - 1;
            }

            _self.openBox.querySelector("img").src = _self.src;
            _self.openBox.querySelector("span").innerHTML = _self.title;
            //计算弹出框的尺寸
            _self.setSize();
        },
        //下一张
        nextImg: function(){
            var _self = this;
            var lis     = _self.box.querySelectorAll(_self.imgList);
           //如果不是最后一张
           if(_self.index != lis.length - 1){
            _self.src   = lis[_self.index + 1].querySelector("img").src;
            _self.title = lis[_self.index + 1].querySelector("span").innerHTML;
            _self.index ++;
        }else{
                //如果是最后一张，转到第一张
                _self.src   = lis[0].querySelector("img").src;
                _self.title = lis[0].querySelector("span").innerHTML;
                _self.index = 0;
            }
            _self.openBox.querySelector("img").src = _self.src;
            _self.openBox.querySelector("span").innerHTML = _self.title;
            //计算弹出框的尺寸
            _self.setSize();
        }
    }


    win.Preview = Preview;
}(window,document))

