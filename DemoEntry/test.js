// 原始数组
const originalArray = [
    {
        "icon": "icon_shanghaihezuozuzhi",
        "size": 0,
        "position": 1
    },
    {
        "icon": "icon_zhongguoshizheng",
        "size": 0,
        "position": 2
    },
    {
        "icon": "icon_gongluxuehui",
        "size": 0,
        "position": 3
    },
    {
        "icon": "icon_maoyishengjijinhui",
        "size": 0,
        "position": 4
    },
    {
        "icon": "icon_tuxuexuehui",
        "size": 0,
        "position": 5
    },
    {
        "icon": "icon_qinghuadaxue",
        "size": 0,
        "position": 6
    },
    {
        "icon": "icon_tongjidaxue",
        "size": 0,
        "position": 7
    },
    {
        "icon": "icon_changandaxue",
        "size": 0,
        "position": 8
    },
    {
        "icon": "icon_shenzhenjishudaxue",
        "size": 0,
        "position": 9
    },
    {
        "icon": "icon_kadifudaxue",
        "size": 0,
        "position": 10
    },
    {
        "icon": "icon_dianjian",
        "size": 0,
        "position": 11
    },
    {
        "icon": "icon_shanghaishizhenggongchengshejiyuan",
        "size": 1,
        "position": 12
    },
    {
        "icon": "icon_zhongyejingcheng",
        "size": 0,
        "position": 13
    },
    {
        "icon": "icon_huangkanceyanjiuyuan",
        "size": 0,
        "position": 14
    },
    {
        "icon": "icon_changjiangsheji",
        "size": 0,
        "position": 15
    },
    {
        "icon": "icon_luqiaojituan",
        "size": 0,
        "position": 16
    },
    {
        "icon": "icon_zhongchuanjiuyuan",
        "size": 0,
        "position": 17
    },
    {
        "icon": "icon_xiongan",
        "size": 1,
        "position": 18
    },
    {
        "icon": "icon_bosch",
        "size": 0,
        "position": 19
    },
    {
        "icon": "icon_zhongjiaoyihang",
        "size": 0,
        "position": 20
    },
    {
        "icon": "icon_zhongtieshibaju",
        "size": 1,
        "position": 21
    },
    {
        "icon": "icon_shanghaichengjianshizheng",
        "size": 0,
        "position": 22
    },
    {
        "icon": "icon_shanghaichengjianjituan",
        "size": 0,
        "position": 23
    },
    {
        "icon": "icon_zhongjizhonglian",
        "size": 0,
        "position": 24
    },
    {
        "icon": "icon_zhongguozhongtie",
        "size": 0,
        "position": 25
    },
    {
        "icon": "icon_zhongqigongcheng",
        "size": 0,
        "position": 26
    },
    {
        "icon": "icon_jiaojian",
        "size": 0,
        "position": 27
    },
    {
        "icon": "icon_fengjiang",
        "size": 0,
        "position": 28
    },
    {
        "icon": "icon_zhongguojianke",
        "size": 0,
        "position": 29
    },
    {
        "icon": "icon_zhongchuanghuike",
        "size": 0,
        "position": 30
    },
    {
        "icon": "icon_xiaotajituan",
        "size": 0,
        "position": 31
    },
    {
        "icon": "icon_shuyunkeji",
        "size": 0,
        "position": 32
    },
    {
        "icon": "icon_shanghaixiandaisheji",
        "size": 0,
        "position": 33
    },
    {
        "icon": "icon_zhongguoshizhonggongchengshejiyuan",
        "size": 1,
        "position": 34
    },
    {
        "icon": "icon_dongjiao",
        "size": 0,
        "position": 35
    },
    {
        "icon": "icon_pkpm",
        "size": 0,
        "position": 36
    },
    {
        "icon": "icon_yunlukeji",
        "size": 0,
        "position": 37
    },
    {
        "icon": "icon_zhejianggaoxin",
        "size": 0,
        "position": 38
    },
    {
        "icon": "icon_wuhanshizhengjianshe",
        "size": 1,
        "position": 39
    },
    {
        "icon": "icon_nantongsijianjituan",
        "size": 1,
        "position": 40
    },
    {
        "icon": "icon_zhongjiaowuhan",
        "size": 0,
        "position": 41
    },
    {
        "icon": "icon_dingdangkeji",
        "size": 0,
        "position": 42
    },
    {
        "icon": "icon_zhufengkeji",
        "size": 0,
        "position": 43
    },
    {
        "icon": "icon_weitakeji",
        "size": 0,
        "position": 44
    },
    {
        "icon": "icon_jizhishuke",
        "size": 0,
        "position": 45
    },
    {
        "icon": "icon_nantongliujian",
        "size": 0,
        "position": 46
    },
    {
        "icon": "icon_shanghaixinmin",
        "size": 0,
        "position": 47
    },
    {
        "icon": "icon_bima",
        "size": 0,
        "position": 48
    }
]
;
  
  // 使用 map() 方法创建不包含 positionss 属性的新数组
  const newArray = originalArray.map(item => {
    const { position, ...rest } = item;
    return rest;
  });
  
  console.log(newArray);
  // 输出: [
  //   { id: 1, title: 'Item 1' },
  //   { id: 2, title: 'Item 2' },
  //   { id: 3, title: 'Item 3' }
  // ]
  