/**
 * Created by Administrator on 2016/3/28.
 */
var menu = document.getElementById("menu");

//ʵ�ֵ����ʱ��չ��
menu.onclick = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (/^span$/i.test(target.nodeName)) {
        showHide(target);
    } else if (/^em$/i.test(target.nodeName)) {
        showHide(target.parentNode);
    }
};
//��ʾ����
function showHide(curSpan) {
    var nex = utils.next(curSpan);
    if (nex && nex.nodeName.toLowerCase() === "ul") {
        var isBlock = utils.css(nex, "display");
        var oEm = curSpan.getElementsByTagName("em")[0];
        if (isBlock === "block") {//��ǰ��չ���ģ�����
            nex.style.display = "none";
            utils.removeClass(oEm, "open");

            //��ǰ�������ʱ��������������е��Ӽ�Ҳ�Զ���������
            var childUl = nex.getElementsByTagName("ul");
            for (var i = 0; i < childUl.length; i++) {
                childUl[i].style.display = "none";
                //������Ԫ�ؽڵ��е�em�Ƴ�open����ʽ
                var pre = utils.prev(childUl[i]);
                var preEm = pre.getElementsByTagName("em")[0];
                utils.removeClass(preEm, "open");
            }

        } else {//��ǰ�����صģ�չ��
            nex.style.display = "block";
            utils.addClass(oEm, "open");
        }
    }
}