//
// fuseji.js - なぞなぞ伏字サービス(http://fuseji.com/)
//
// $Date: 2008-11-16 11:00:15 +0900 (日, 16 11月 2008) $
// $Revision: 3088 $
// Toshiyuki Masui @ Pitecan.com
//

var id = '';
var newid = '';
var input = '';
var submitTimer;

function result(s){
  //
  // check.cgi が返す文字列によって呼び出される。
  // 認証が成功したときは s として空でない文字列が返る。
  //
  if(s != ''){
    var element;
    var elements;
    elements = getElementsByClassName('fuseji');
    for(var i=0;i<elements.length;i++){
      element = elements[i];
      if(element.id.substring(0,id.length) == id){
        var postfix = element.id.substring(id.length);
        if(postfix.match(/^[0-9]*$/)){
	    element.innerHTML = decodeURIComponent(s);
        }
      }
    }
  }
  reset();
}

function reset(){
  id = '';
  input = '';
}

//
// fuseji.com の check.cgi を呼ぶ必要があるので
// http://webtips.open-log.net/index.php?JavaScript/クロスドメイン制限の解除
// に記述されているような工夫をする。
//
function check(){
  //
  // fuseji.com/check.cgi を呼ぶスクリプトを body に追加することにより
  // クロスドメイン呼び出しを実現。
  // check.cgi は 'result(文字列)' という文字列を返す。
  //
  var url = 'http://fuseji.com/check.cgi?id='+id+'&sequence='+input;
  var sc = document.createElement("script");
  sc.setAttribute("type","text/javascript");
  sc.setAttribute("src", url );
  document.getElementsByTagName("body").item(0).appendChild(sc);
}

function click(e){
  // IEの場合 e.srcElement, それ以外の場合 e.target
  var srcid = (e.srcElement || e.target);
  if(srcid.id.match(/^(.*)\-(.)$/)){
    newid = RegExp.$1;
    if(newid != id){
      input = '';
    }
    input = input + RegExp.$2;
    id = newid;
  }
  clearTimeout(submitTimer);
  submitTimer = setTimeout('check()',3000);
}

function init(){
  reset();
  var elements = getElementsByClassName('fuseji');
  for(var i=0;i<elements.length;i++){
    var element = elements[i];
    while(element.childNodes[0]){
      element.removeChild(element.childNodes[0]);
    }
    for(var j=0;j<4;j++){
      var r = document.createElement('span');
      r.id = element.id + '-' + (j+1);
      r.innerHTML = '■';
      if(r.addEventListener) { // W3C
        r.addEventListener('mousedown', click, true);
      }
      else {
        r.attachEvent('onmousedown', click);
      }
      element.appendChild(r);
    }
  }
}

if(document.addEventListener) { // W3C
  addEventListener('load', init, true);
}
else { // IE
  window.onload = init;
}

//
// getElementsByClassName() がIEで使えないので
// http://www.robertnyman.com/2008/05/27/the-ultimate-getelementsbyclassname-anno-2008/
// で紹介されている以下のコードを利用する。

//
// Developed by Robert Nyman, http://www.robertnyman.com
// Code/licensing: http://code.google.com/p/getelementsbyclassname/
//
var getElementsByClassName = function (className, tag, elm){
  if (document.getElementsByClassName) {
    getElementsByClassName = function (className, tag, elm) {
      elm = elm || document;
      var elements = elm.getElementsByClassName(className),
        nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
        returnElements = [],
        current;
      for(var i=0, il=elements.length; i<il; i+=1){
        current = elements[i];
        if(!nodeName || nodeName.test(current.nodeName)) {
          returnElements.push(current);
        }
      }
      return returnElements;
    };
  }
  else if (document.evaluate) {
    getElementsByClassName = function (className, tag, elm) {
      tag = tag || "*";
      elm = elm || document;
      var classes = className.split(" "),
        classesToCheck = "",
        xhtmlNamespace = "http://www.w3.org/1999/xhtml",
        namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
        returnElements = [],
        elements,
        node;
      for(var j=0, jl=classes.length; j<jl; j+=1){
        classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
      }
      try  {
        elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
      }
      catch (e) {
        elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
      }
      while ((node = elements.iterateNext())) {
        returnElements.push(node);
      }
      return returnElements;
    };
  }
  else {
    getElementsByClassName = function (className, tag, elm) {
      tag = tag || "*";
      elm = elm || document;
      var classes = className.split(" "),
        classesToCheck = [],
        elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
        current,
        returnElements = [],
        match;
      for(var k=0, kl=classes.length; k<kl; k+=1){
        classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
      }
      for(var l=0, ll=elements.length; l<ll; l+=1){
        current = elements[l];
        match = false;
        for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
          match = classesToCheck[m].test(current.className);
          if (!match) {
            break;
          }
        }
        if (match) {
          returnElements.push(current);
        }
      }
      return returnElements;
    };
  }
  return getElementsByClassName(className, tag, elm);
};


