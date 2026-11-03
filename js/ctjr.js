(function () {
    'use strict';

    var festivals = [
        {
            key: 'chunjie',
            name: '春节',
            date: '正月初一',
            emoji: '🧧',
            desc: '爆竹声中一岁除，春风送暖入屠苏。阖家团圆，万象更新。',
            link: 'festival/webpage/chunjie_0217.html'
        },
        {
            key: 'yuanxiao',
            name: '元宵节',
            date: '正月十五',
            emoji: '🏮',
            desc: '去年元夜时，花市灯如昼。赏灯猜谜，月圆人圆。',
            link: 'festival/webpage/yuanxiao_0303.html'
        },
        {
            key: 'qingming',
            name: '清明节',
            date: '公历四月五日',
            emoji: '🌧️',
            desc: '清明时节雨纷纷，路上行人欲断魂。慎终追远，踏青迎春。',
            link: 'festival/webpage/qingming_0405.html'
        },
        {
            key: 'duanwu',
            name: '端午节',
            date: '五月初五',
            emoji: '🐉',
            desc: '节分端午自谁言，万古传闻为屈原。龙舟竞渡，粽叶飘香。',
            link: 'festival/webpage/duanwu_0619.html'
        },
        {
            key: 'zhongqiu',
            name: '中秋节',
            date: '八月十五',
            emoji: '🌕',
            desc: '但愿人长久，千里共婵娟。花好月圆，思乡团圆。',
            link: 'festival/webpage/zhongqiu_0925.html'
        },
        {
            key: 'guoqing',
            name: '国庆节',
            date: '十月一日',
            emoji: '🇨🇳',
            desc: '国泰民安，繁荣昌盛。盛世华诞，举国同庆。',
            link: 'festival/webpage/guoqing_1001.html'
        }
    ];

    function render() {
        var grid = document.getElementById('festivalGrid');
        if (!grid) return;

        festivals.forEach(function (f, i) {
            var card = document.createElement('a');
            card.className = 'festival-card liquid-glass ' + f.key;
            card.href = f.link;
            card.style.animationDelay = (i * 0.08) + 's';
            card.innerHTML =
                '<div class="card-arrow"><i class="fa fa-arrow-right"></i></div>' +
                '<div class="card-emoji">' + f.emoji + '</div>' +
                '<span class="card-date">' + f.date + '</span>' +
                '<h3 class="card-name">' + f.name + '</h3>' +
                '<p class="card-desc">' + f.desc + '</p>';
            grid.appendChild(card);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
