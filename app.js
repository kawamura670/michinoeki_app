// ===== 収益化設定（各サービス登録後にIDを入れる） =====
const REVENUE_CONFIG = {
  // Stripe Payment Link — https://dashboard.stripe.com/payment-links で作成
  // 作成時 "決済後のリダイレクト先" に ?premium=activated を付けたURLを設定
  stripePaymentLink: "", // 例: "https://buy.stripe.com/xxxxx"

  // 楽天アフィリエイトID — https://affiliate.rakuten.co.jp/ で取得
  rakutenAffiliateId: "", // 例: "1234abcd.5678efgh.9012ijkl"

  // Amazonアソシエイト タグ — https://affiliate.amazon.co.jp/ で取得
  amazonTag: "", // 例: "michinoeki-22"
};

// ===== 定数 =====
const PREF_ORDER = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県",
  "三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県",
  "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"
];

const REGIONS = {
  "北海道":["北海道"],"東北":["青森県","岩手県","宮城県","秋田県","山形県","福島県"],
  "関東":["茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県"],
  "中部":["新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県"],
  "近畿":["三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県"],
  "中国":["鳥取県","島根県","岡山県","広島県","山口県"],
  "四国":["徳島県","香川県","愛媛県","高知県"],
  "九州沖縄":["福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"]
};

const PREF_EMOJI = {
  "北海道":"🦌","青森県":"🍎","岩手県":"⛩️","宮城県":"🐄","秋田県":"🌾","山形県":"🍒","福島県":"🍑",
  "茨城県":"🌹","栃木県":"🍓","群馬県":"♨️","埼玉県":"🏯","千葉県":"🥜","東京都":"🗼","神奈川県":"⛵",
  "新潟県":"🍚","富山県":"🏔️","石川県":"🎣","福井県":"🦀","山梨県":"🍇","長野県":"🍎","岐阜県":"🏯","静岡県":"🗻","愛知県":"🏭",
  "三重県":"🦐","滋賀県":"🛶","京都府":"⛩️","大阪府":"🏙️","兵庫県":"🐮","奈良県":"🦌","和歌山県":"🍊",
  "鳥取県":"🏜️","島根県":"⛩️","岡山県":"🍑","広島県":"🍁","山口県":"🐡",
  "徳島県":"🌀","香川県":"🍜","愛媛県":"🍊","高知県":"🐋",
  "福岡県":"🍜","佐賀県":"🏺","長崎県":"⛪","熊本県":"🐻","大分県":"♨️","宮崎県":"🌴","鹿児島県":"🌋","沖縄県":"🌺"
};

const LEVELS = [
  { min: 0,    title: "未踏の旅人",   emoji: "🗾" },
  { min: 1,    title: "はじめの一歩",  emoji: "🎯" },
  { min: 10,   title: "駆け出し旅人",  emoji: "⭐" },
  { min: 50,   title: "探検家",       emoji: "🌟" },
  { min: 100,  title: "みちのわんマスター", emoji: "💫" },
  { min: 200,  title: "ベテラン旅人",  emoji: "🔥" },
  { min: 500,  title: "みちのわんの達人",  emoji: "👑" },
  { min: 1000, title: "全国制覇レジェンド", emoji: "🏆" }
];

const BADGES = [
  { id:"first",  emoji:"🐾", title:"はじめの一歩",    desc:"愛犬と最初の道の駅を訪問",check:v=>v>=1,   max:1 },
  { id:"b10",    emoji:"⭐", title:"10駅達成",        desc:"愛犬と10駅を訪問",       check:v=>v>=10,  max:10 },
  { id:"b50",    emoji:"🌟", title:"50駅達成",        desc:"愛犬と50駅を訪問",       check:v=>v>=50,  max:50 },
  { id:"b100",   emoji:"💫", title:"100駅マスター",   desc:"愛犬と100駅を訪問",      check:v=>v>=100, max:100 },
  { id:"b200",   emoji:"🔥", title:"200駅制覇",       desc:"愛犬と200駅を訪問",      check:v=>v>=200, max:200 },
  { id:"b500",   emoji:"👑", title:"500駅の達人",     desc:"愛犬と500駅を訪問",      check:v=>v>=500, max:500 },
  { id:"b1000",  emoji:"🏆", title:"1000駅レジェンド", desc:"愛犬と1000駅を訪問",     check:v=>v>=1000,max:1000 },
  { id:"complete",emoji:"🎊",title:"全駅制覇",        desc:"愛犬と全ての道の駅を制覇",check:(v,t)=>v>=t, max:null },
  { id:"pref1",  emoji:"🗾", title:"県制覇デビュー",   desc:"1つの都道府県を全駅訪問",check:(_,__,pc)=>pc>=1, max:1, type:"pref" },
  { id:"pref5",  emoji:"🏅", title:"5県制覇",         desc:"5つの都道府県を全駅訪問", check:(_,__,pc)=>pc>=5, max:5, type:"pref" },
  { id:"pref10", emoji:"🎖️", title:"10県マスター",    desc:"10都道府県を全駅訪問",   check:(_,__,pc)=>pc>=10,max:10,type:"pref" },
  { id:"photo",  emoji:"📸", title:"カメラマン",       desc:"スタンプ写真を5枚記録",  check:(_,__,___,ph)=>ph>=5, max:5, type:"photo" }
];

const QUESTS = [
  { id:"q1",    name:"旅のはじまり",  desc:"初めての道の駅を訪問", reward:"旅ビギナー",     type:"visit", target:1 },
  { id:"q10",   name:"10駅の旅人",   desc:"累計10駅を訪問",      reward:"スタンプ収集家",  type:"visit", target:10 },
  { id:"q50",   name:"50駅の冒険者",  desc:"累計50駅を訪問",      reward:"道の駅ハンター",  type:"visit", target:50 },
  { id:"q100",  name:"100駅の探検家", desc:"累計100駅を訪問",     reward:"百駅探検家",     type:"visit", target:100 },
  { id:"q300",  name:"300駅の猛者",  desc:"累計300駅を訪問",     reward:"旅の猛者",       type:"visit", target:300 },
  { id:"q500",  name:"500駅の伝説",  desc:"累計500駅を訪問",     reward:"ハーフ旅人",     type:"visit", target:500 },
  { id:"qr_hokkaido",  name:"北海道王",   desc:"北海道の全駅を制覇",   reward:"北海道王",   type:"region", region:"北海道" },
  { id:"qr_tohoku",    name:"東北王",     desc:"東北地方の全駅を制覇",  reward:"東北王",     type:"region", region:"東北" },
  { id:"qr_kanto",     name:"関東王",     desc:"関東地方の全駅を制覇",  reward:"関東王",     type:"region", region:"関東" },
  { id:"qr_chubu",     name:"中部王",     desc:"中部地方の全駅を制覇",  reward:"中部王",     type:"region", region:"中部" },
  { id:"qr_kinki",     name:"近畿王",     desc:"近畿地方の全駅を制覇",  reward:"近畿王",     type:"region", region:"近畿" },
  { id:"qr_chugoku",   name:"中国王",     desc:"中国地方の全駅を制覇",  reward:"中国王",     type:"region", region:"中国" },
  { id:"qr_shikoku",   name:"四国王",     desc:"四国地方の全駅を制覇",  reward:"四国王",     type:"region", region:"四国" },
  { id:"qr_kyushu",    name:"九州沖縄王",  desc:"九州沖縄の全駅を制覇",  reward:"九州沖縄王", type:"region", region:"九州沖縄" },
  { id:"qall",  name:"全国制覇",     desc:"全1231駅を訪問",      reward:"レジェンド旅人",  type:"visit", target:1231 },
  { id:"qpref", name:"全県制覇",     desc:"47都道府県で各1駅以上", reward:"全県踏破者",     type:"allpref", target:47 },
];

const PREF_SPECIALTIES = {
  "北海道":[{emoji:"🦀",name:"カニ"},{emoji:"🍦",name:"ソフトクリーム"},{emoji:"🐟",name:"鮭"},{emoji:"🧈",name:"バター"},{emoji:"🥔",name:"じゃがいも"},{emoji:"🌽",name:"とうもろこし"},{emoji:"🍈",name:"メロン"},{emoji:"🐑",name:"ジンギスカン"},{emoji:"🦑",name:"イカ"},{emoji:"🧀",name:"チーズ"}],
  "青森県":[{emoji:"🍎",name:"りんご"},{emoji:"🐟",name:"大間マグロ"},{emoji:"🧄",name:"にんにく"},{emoji:"🍶",name:"田酒"},{emoji:"🌸",name:"桜餅"}],
  "岩手県":[{emoji:"🥩",name:"前沢牛"},{emoji:"🍜",name:"わんこそば"},{emoji:"🫘",name:"南部せんべい"},{emoji:"🐚",name:"ホヤ"},{emoji:"🍶",name:"南部美人"}],
  "宮城県":[{emoji:"👅",name:"牛タン"},{emoji:"🍚",name:"ずんだ餅"},{emoji:"🦪",name:"松島牡蠣"},{emoji:"🍣",name:"笹かまぼこ"},{emoji:"🐟",name:"ホヤ"}],
  "秋田県":[{emoji:"🌾",name:"きりたんぽ"},{emoji:"🍚",name:"あきたこまち"},{emoji:"🥒",name:"いぶりがっこ"},{emoji:"🍶",name:"日本酒"},{emoji:"🐶",name:"秋田犬もなか"}],
  "山形県":[{emoji:"🍒",name:"さくらんぼ"},{emoji:"🍜",name:"米沢ラーメン"},{emoji:"🥩",name:"米沢牛"},{emoji:"🍇",name:"ぶどう"},{emoji:"🍐",name:"ラ・フランス"}],
  "福島県":[{emoji:"🍑",name:"桃"},{emoji:"🐴",name:"馬刺し"},{emoji:"🍜",name:"喜多方ラーメン"},{emoji:"🥟",name:"円盤餃子"},{emoji:"🍶",name:"日本酒"}],
  "茨城県":[{emoji:"🍠",name:"干し芋"},{emoji:"🫘",name:"納豆"},{emoji:"🍈",name:"メロン"},{emoji:"🐟",name:"あんこう"},{emoji:"🌰",name:"栗"}],
  "栃木県":[{emoji:"🍓",name:"とちおとめ"},{emoji:"🥟",name:"宇都宮餃子"},{emoji:"🧀",name:"日光ゆば"},{emoji:"🍜",name:"佐野ラーメン"},{emoji:"🍶",name:"益子焼酒器"}],
  "群馬県":[{emoji:"🥬",name:"こんにゃく"},{emoji:"♨️",name:"温泉まんじゅう"},{emoji:"🍜",name:"水沢うどん"},{emoji:"🥬",name:"下仁田ネギ"},{emoji:"🍖",name:"焼きまんじゅう"}],
  "埼玉県":[{emoji:"🍵",name:"狭山茶"},{emoji:"🍜",name:"武蔵野うどん"},{emoji:"🍠",name:"川越芋"},{emoji:"🥜",name:"五家宝"},{emoji:"🧅",name:"深谷ネギ"}],
  "千葉県":[{emoji:"🥜",name:"落花生"},{emoji:"🐟",name:"なめろう"},{emoji:"🍓",name:"いちご"},{emoji:"🦪",name:"はまぐり"},{emoji:"🌸",name:"びわ"}],
  "東京都":[{emoji:"🥘",name:"もんじゃ焼き"},{emoji:"🍣",name:"江戸前寿司"},{emoji:"🍘",name:"雷おこし"},{emoji:"🍡",name:"人形焼"},{emoji:"🥚",name:"玉子焼き"}],
  "神奈川県":[{emoji:"🥟",name:"シウマイ"},{emoji:"🍜",name:"家系ラーメン"},{emoji:"🧁",name:"鎌倉カスター"},{emoji:"🐟",name:"しらす"},{emoji:"🍖",name:"厚木シロコロ"}],
  "新潟県":[{emoji:"🍚",name:"コシヒカリ"},{emoji:"🍘",name:"笹団子"},{emoji:"🍶",name:"日本酒"},{emoji:"🦀",name:"紅ズワイガニ"},{emoji:"🍜",name:"へぎそば"}],
  "富山県":[{emoji:"🍣",name:"ます寿司"},{emoji:"🦐",name:"白エビ"},{emoji:"🐟",name:"ホタルイカ"},{emoji:"🍚",name:"富山ブラック"},{emoji:"🧊",name:"氷見うどん"}],
  "石川県":[{emoji:"🦀",name:"加能ガニ"},{emoji:"🍣",name:"回転寿司"},{emoji:"🍵",name:"加賀棒茶"},{emoji:"🐟",name:"のどぐろ"},{emoji:"🍡",name:"きんつば"}],
  "福井県":[{emoji:"🦀",name:"越前ガニ"},{emoji:"🍜",name:"越前おろしそば"},{emoji:"🥜",name:"羽二重餅"},{emoji:"🐟",name:"へしこ"},{emoji:"🍖",name:"ソースカツ丼"}],
  "山梨県":[{emoji:"🍇",name:"ぶどう"},{emoji:"🍑",name:"もも"},{emoji:"🍜",name:"ほうとう"},{emoji:"🍷",name:"ワイン"},{emoji:"🥩",name:"甲州地鶏"}],
  "長野県":[{emoji:"🍎",name:"りんご"},{emoji:"🍜",name:"信州そば"},{emoji:"🐛",name:"蜂の子"},{emoji:"🥬",name:"野沢菜"},{emoji:"🧀",name:"おやき"}],
  "岐阜県":[{emoji:"🥩",name:"飛騨牛"},{emoji:"🍡",name:"五平餅"},{emoji:"🐟",name:"鮎"},{emoji:"🥬",name:"漬物ステーキ"},{emoji:"🍶",name:"地酒"}],
  "静岡県":[{emoji:"🍵",name:"お茶"},{emoji:"🐟",name:"桜エビ"},{emoji:"🦐",name:"しらす"},{emoji:"🍊",name:"みかん"},{emoji:"🍢",name:"静岡おでん"}],
  "愛知県":[{emoji:"🐔",name:"手羽先"},{emoji:"🍜",name:"味噌煮込み"},{emoji:"🦐",name:"えびせんべい"},{emoji:"🍡",name:"ういろう"},{emoji:"🐙",name:"たこ焼き"}],
  "三重県":[{emoji:"🦐",name:"伊勢エビ"},{emoji:"🐮",name:"松阪牛"},{emoji:"🦪",name:"的矢牡蠣"},{emoji:"🍡",name:"赤福"},{emoji:"🐟",name:"あわび"}],
  "滋賀県":[{emoji:"🐟",name:"鮒寿司"},{emoji:"🥩",name:"近江牛"},{emoji:"🍵",name:"朝宮茶"},{emoji:"🧅",name:"赤こんにゃく"},{emoji:"🍘",name:"丁稚羊羹"}],
  "京都府":[{emoji:"🍵",name:"宇治抹茶"},{emoji:"🥒",name:"京漬物"},{emoji:"🍡",name:"八つ橋"},{emoji:"🧈",name:"湯葉"},{emoji:"🐟",name:"鯖寿司"}],
  "大阪府":[{emoji:"🐙",name:"たこ焼き"},{emoji:"🍖",name:"串カツ"},{emoji:"🍜",name:"お好み焼き"},{emoji:"🍘",name:"おこし"},{emoji:"🦑",name:"イカ焼き"}],
  "兵庫県":[{emoji:"🐮",name:"神戸牛"},{emoji:"🐙",name:"明石焼き"},{emoji:"🧅",name:"淡路島玉ねぎ"},{emoji:"🍶",name:"灘の酒"},{emoji:"🦐",name:"香住ガニ"}],
  "奈良県":[{emoji:"🦌",name:"柿の葉寿司"},{emoji:"🍡",name:"よもぎ餅"},{emoji:"🍜",name:"三輪そうめん"},{emoji:"🥒",name:"奈良漬"},{emoji:"🍵",name:"大和茶"}],
  "和歌山県":[{emoji:"🍊",name:"みかん"},{emoji:"🍑",name:"桃"},{emoji:"🐟",name:"しらす"},{emoji:"🍶",name:"梅酒"},{emoji:"🥜",name:"南高梅"}],
  "鳥取県":[{emoji:"🍐",name:"二十世紀梨"},{emoji:"🦀",name:"松葉ガニ"},{emoji:"🐟",name:"白いか"},{emoji:"🍈",name:"スイカ"},{emoji:"🥜",name:"らっきょう"}],
  "島根県":[{emoji:"🍜",name:"出雲そば"},{emoji:"🐚",name:"しじみ"},{emoji:"🍶",name:"地酒"},{emoji:"🥩",name:"しまね和牛"},{emoji:"🍡",name:"ぜんざい"}],
  "岡山県":[{emoji:"🍑",name:"白桃"},{emoji:"🍇",name:"マスカット"},{emoji:"🍜",name:"ままかり寿司"},{emoji:"🐟",name:"サワラ"},{emoji:"🍘",name:"きびだんご"}],
  "広島県":[{emoji:"🦪",name:"牡蠣"},{emoji:"🍜",name:"お好み焼き"},{emoji:"🍋",name:"レモン"},{emoji:"🍡",name:"もみじ饅頭"},{emoji:"🐟",name:"あなご"}],
  "山口県":[{emoji:"🐡",name:"ふぐ"},{emoji:"🦐",name:"車エビ"},{emoji:"🍊",name:"夏みかん"},{emoji:"🍘",name:"外郎"},{emoji:"🐟",name:"甘鯛"}],
  "徳島県":[{emoji:"🌊",name:"鳴門わかめ"},{emoji:"🍠",name:"鳴門金時"},{emoji:"🍜",name:"徳島ラーメン"},{emoji:"🐟",name:"鯛"},{emoji:"🍊",name:"すだち"}],
  "香川県":[{emoji:"🍜",name:"讃岐うどん"},{emoji:"🫒",name:"オリーブ"},{emoji:"🐟",name:"いりこ"},{emoji:"🥬",name:"金時にんじん"},{emoji:"🍡",name:"おいり"}],
  "愛媛県":[{emoji:"🍊",name:"みかん"},{emoji:"🐟",name:"鯛めし"},{emoji:"🍋",name:"レモン"},{emoji:"🥩",name:"じゃこ天"},{emoji:"🧁",name:"タルト"}],
  "高知県":[{emoji:"🐟",name:"カツオ"},{emoji:"🍊",name:"ゆず"},{emoji:"🐋",name:"くじら"},{emoji:"🍶",name:"地酒"},{emoji:"🍅",name:"フルーツトマト"}],
  "福岡県":[{emoji:"🍜",name:"博多ラーメン"},{emoji:"🍢",name:"もつ鍋"},{emoji:"🍓",name:"あまおう"},{emoji:"🐙",name:"明太子"},{emoji:"🍡",name:"梅ヶ枝餅"}],
  "佐賀県":[{emoji:"🥩",name:"佐賀牛"},{emoji:"🦑",name:"イカ"},{emoji:"🍊",name:"みかん"},{emoji:"🐟",name:"ムツゴロウ"},{emoji:"🧁",name:"小城羊羹"}],
  "長崎県":[{emoji:"🍰",name:"カステラ"},{emoji:"🍜",name:"ちゃんぽん"},{emoji:"🥩",name:"角煮まん"},{emoji:"🐟",name:"アジ"},{emoji:"🥚",name:"皿うどん"}],
  "熊本県":[{emoji:"🐴",name:"馬刺し"},{emoji:"🍜",name:"太平燕"},{emoji:"🍊",name:"デコポン"},{emoji:"🥩",name:"あか牛"},{emoji:"🍘",name:"いきなり団子"}],
  "大分県":[{emoji:"🐔",name:"とり天"},{emoji:"🐟",name:"関あじ"},{emoji:"♨️",name:"地獄蒸し"},{emoji:"🦐",name:"城下かれい"},{emoji:"🍜",name:"だんご汁"}],
  "宮崎県":[{emoji:"🥭",name:"マンゴー"},{emoji:"🐔",name:"チキン南蛮"},{emoji:"🥩",name:"宮崎牛"},{emoji:"🍖",name:"地鶏炭火焼"},{emoji:"🧀",name:"チーズ饅頭"}],
  "鹿児島県":[{emoji:"🍠",name:"さつまいも"},{emoji:"🐷",name:"黒豚"},{emoji:"🍶",name:"芋焼酎"},{emoji:"🥩",name:"鹿児島黒牛"},{emoji:"🍊",name:"たんかん"}],
  "沖縄県":[{emoji:"🍍",name:"パイナップル"},{emoji:"🐷",name:"ラフテー"},{emoji:"🌺",name:"ちんすこう"},{emoji:"🍹",name:"泡盛"},{emoji:"🥭",name:"マンゴー"}]
};

function getStationSpecialty(stationId, pref) {
  const pool = PREF_SPECIALTIES[pref];
  if (!pool || pool.length === 0) return { emoji: "🎁", name: "お土産" };
  return pool[stationId % pool.length];
}

// ===== ジブリ風スタンプ絵 =====
const STAMP_SCENES = {
  "北海道":"🌲🦌","青森県":"🍎🏔️","岩手県":"⛰️🌾","宮城県":"🌊🐄","秋田県":"🌾🏔️",
  "山形県":"🍒⛰️","福島県":"🍑🌸","茨城県":"🌹🌊","栃木県":"🍓⛰️","群馬県":"♨️🏔️",
  "埼玉県":"🌸🏯","千葉県":"🌊🥜","東京都":"🗼🌳","神奈川県":"⛵🌊","新潟県":"🌾🏔️",
  "富山県":"🏔️🌷","石川県":"🌊🎣","福井県":"🦀🌊","山梨県":"🍇🗻","長野県":"🏔️🌲",
  "岐阜県":"🏯🌲","静岡県":"🗻🍵","愛知県":"🌸🏯","三重県":"🦐🌊","滋賀県":"🛶🌿",
  "京都府":"⛩️🍁","大阪府":"🏙️🌉","兵庫県":"🐮🌸","奈良県":"🦌🌸","和歌山県":"🍊🌊",
  "鳥取県":"🏜️🌊","島根県":"⛩️🌿","岡山県":"🍑🌸","広島県":"🍁⛩️","山口県":"🐡🌊",
  "徳島県":"🌀🌊","香川県":"🍜🫒","愛媛県":"🍊🌸","高知県":"🐋🌊","福岡県":"🍜🌸",
  "佐賀県":"🏺🌾","長崎県":"⛪🌊","熊本県":"🌋🐻","大分県":"♨️🌲","宮崎県":"🌴🌺",
  "鹿児島県":"🌋🌺","沖縄県":"🌺🏖️"
};

const STAMP_KEYWORDS = [
  {words:["温泉","湯","spa"],art:"♨️🌫️"},
  {words:["山","峠","高原","岳"],art:"⛰️🌲"},
  {words:["海","浜","港","潮","岬","灯台"],art:"🌊🐚"},
  {words:["川","渓","滝","清流","水"],art:"💧🌿"},
  {words:["湖","池","沼"],art:"🛶🌅"},
  {words:["花","桜","梅","菜の花","ひまわり","ラベンダー"],art:"🌸🌿"},
  {words:["森","林","杉","木"],art:"🌲🍃"},
  {words:["田","里","棚田","農"],art:"🌾🏡"},
  {words:["雪","氷","スキー"],art:"❄️🏔️"},
  {words:["島","諸島"],art:"🏝️🌺"},
  {words:["城","館"],art:"🏯🍁"},
  {words:["風","空","星","月"],art:"🌙✨"},
];

function getStampArt(station){
  if(typeof STAMP_CATALOG!=="undefined" && STAMP_CATALOG[station.id]){
    return STAMP_CATALOG[station.id].stamp_art;
  }
  for(const kw of STAMP_KEYWORDS){
    if(kw.words.some(w=>station.name.includes(w)||station.location.includes(w))){
      return kw.art;
    }
  }
  return STAMP_SCENES[station.pref]||"🌿🛤️";
}

function getStampData(stationId){
  if(typeof STAMP_CATALOG!=="undefined" && STAMP_CATALOG[stationId]){
    return STAMP_CATALOG[stationId];
  }
  return null;
}

const REGION_COLORS = {
  "北海道":{key:"hokkaido"},"東北":{key:"tohoku"},"関東":{key:"kanto"},"中部":{key:"chubu"},
  "近畿":{key:"kinki"},"中国":{key:"chugoku"},"四国":{key:"shikoku"},"九州沖縄":{key:"kyushu"}
};
function getRegionKey(pref){ for(const [rn,prefs] of Object.entries(REGIONS)){ if(prefs.includes(pref)) return REGION_COLORS[rn]?.key||null; } return null; }

const MILESTONES = [1,10,25,50,75,100,150,200,300,500,750,1000];

const MANUAL_KEY = "michinoeki_manual_progress";
const DISMISS_KEY = "michinoeki_dismissed_new";
const SETTINGS_KEY = "michinoeki_settings";
const RING_CIRCUMFERENCE = 326.7;

// ===== データ =====
function loadManual() { try { return JSON.parse(localStorage.getItem(MANUAL_KEY)||"{}"); } catch { return {}; } }
function saveManual(d) { try { localStorage.setItem(MANUAL_KEY, JSON.stringify(d)); } catch(e) { if(e.name==="QuotaExceededError"||e.code===22) alert("ストレージ容量が不足しています。バックアップ後、不要なデータを削除してください。"); } }
function loadDismissed() { try { return JSON.parse(localStorage.getItem(DISMISS_KEY)||"[]"); } catch { return []; } }
function saveDismissed(a) { try { localStorage.setItem(DISMISS_KEY, JSON.stringify(a)); } catch(e) { if(e.name==="QuotaExceededError"||e.code===22) alert("ストレージ容量が不足しています。バックアップをお勧めします。"); } }
function loadSettings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)||"{}"); } catch { return {}; } }
function saveSettings(s) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch(e) { if(e.name==="QuotaExceededError"||e.code===22) alert("ストレージ容量が不足しています。バックアップをお勧めします。"); } }

function getVisitInfo(id) { const m=loadManual(); return m[id] || PROGRESS_DATA[id] || null; }
function setVisited(id, visited, photo) {
  const m=loadManual();
  if(visited){ const d=new Date().toISOString().slice(0,10); const e={visited:true,date:d,note:""}; if(photo)e.photo=photo; else if(m[id]&&m[id].photo)e.photo=m[id].photo; m[id]=e; }
  else { m[id]={visited:false}; }
  saveManual(m);
}

function getLevel(visited) { let lv=LEVELS[0]; for(const l of LEVELS){ if(visited>=l.min) lv=l; } return lv; }

// ===== アフィリエイトリンク =====
function buildAffiliateSection(station){
  const prefShort=station.pref.replace(/[都道府県]$/,"");
  const rakutenId=REVENUE_CONFIG.rakutenAffiliateId;
  const amazonTag=REVENUE_CONFIG.amazonTag;

  const travelQuery=encodeURIComponent(prefShort+" "+station.location);
  const productQuery=encodeURIComponent("道の駅 "+prefShort+" 名産");

  let travelUrl=`https://travel.rakuten.co.jp/search/?f_keyword=${travelQuery}`;
  if(rakutenId) travelUrl+=`&af_id=${rakutenId}`;

  let shopUrl=`https://search.rakuten.co.jp/search/mall/${encodeURIComponent("道の駅 "+prefShort)}/?scid=af_pc_etc&sc2id=af_101_0_0`;
  if(rakutenId) shopUrl+=`&af_id=${rakutenId}`;

  let amazonUrl=`https://www.amazon.co.jp/s?k=${productQuery}`;
  if(amazonTag) amazonUrl+=`&tag=${amazonTag}`;

  return `<div class="sd-section sd-affiliate">`+
    `<div class="sd-section-title">🚗 旅のおともに</div>`+
    `<div class="sd-affiliate-links">`+
      `<a href="${travelUrl}" target="_blank" rel="noopener" class="sd-aff-link sd-aff-hotel">`+
        `<span class="sd-aff-icon">🏨</span>`+
        `<span class="sd-aff-text">`+
          `<span class="sd-aff-title">${prefShort}の宿を探す</span>`+
          `<span class="sd-aff-sub">楽天トラベル</span>`+
        `</span>`+
        `<span class="sd-aff-arrow">›</span>`+
      `</a>`+
      `<a href="${shopUrl}" target="_blank" rel="noopener" class="sd-aff-link sd-aff-shop">`+
        `<span class="sd-aff-icon">🛒</span>`+
        `<span class="sd-aff-text">`+
          `<span class="sd-aff-title">${prefShort}の名産品</span>`+
          `<span class="sd-aff-sub">お取り寄せ</span>`+
        `</span>`+
        `<span class="sd-aff-arrow">›</span>`+
      `</a>`+
    `</div>`+
  `</div>`;
}

function compressAndSavePhoto(stationId, file, callback){
  const reader=new FileReader(), img=new Image();
  reader.onload=ev=>{
    img.onload=()=>{
      const mx=800, sc=Math.min(1, mx/Math.max(img.width,img.height));
      const cv=document.createElement("canvas");
      cv.width=img.width*sc; cv.height=img.height*sc;
      cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
      const dataUrl=cv.toDataURL("image/jpeg",0.75);
      addPhotoToStation(stationId, dataUrl);
      if(callback) callback();
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}

function calcStats() {
  const total=MICHINOEKI_DATA.length; let visited=0, photoCount=0;
  const prefStats={}; const visitDates=[];
  MICHINOEKI_DATA.forEach(s=>{
    if(!prefStats[s.pref]) prefStats[s.pref]={total:0,visited:0};
    prefStats[s.pref].total++;
    const i=getVisitInfo(s.id);
    if(i&&i.visited){ visited++; prefStats[s.pref].visited++; if(i.date)visitDates.push({date:i.date,name:s.name,pref:s.pref,id:s.id}); if(i.photo)photoCount++; }
  });
  let prefComplete=0;
  Object.values(prefStats).forEach(p=>{ if(p.visited>=p.total&&p.total>0) prefComplete++; });
  visitDates.sort((a,b)=>b.date.localeCompare(a.date));
  return {total,visited,prefStats,prefComplete,photoCount,recentVisits:visitDates.slice(0,10)};
}

// ===== エフェクト =====
function triggerStampAnimation(row) {
  row.classList.add('stamp-flash');
  setTimeout(()=>row.classList.remove('stamp-flash'),800);
}

// ===== スタンプ獲得演出 =====
const RARITY_STYLE = {
  common:   {label:"COMMON",bg:"#2D5A3D",border:"#4A8B5E",glow:"rgba(45,90,61,0.3)",star:""},
  rare:     {label:"RARE",bg:"#1B4F72",border:"#3A8EC4",glow:"rgba(58,142,196,0.4)",star:"⭐"},
  epic:     {label:"EPIC",bg:"#6A3D9A",border:"#9B6DD7",glow:"rgba(155,109,215,0.5)",star:"⭐⭐"},
  legendary:{label:"LEGENDARY",bg:"#8B6914",border:"#D4A017",glow:"rgba(212,160,23,0.6)",star:"⭐⭐⭐"},
};

function getStampImageUrl(stationId) {
  return `stamp_images/stamp_${stationId}.png`;
}

function buildStampImage(station) {
  return `<img src="${getStampImageUrl(station.id)}" alt="${station.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
}

function buildStampSVG(station, stampData) {
  return buildStampImage(station);
}

function showStampReveal(station, isReview) {
  const sData = getStampData(station.id);
  const rarity = sData ? sData.rarity : "common";
  const rs = RARITY_STYLE[rarity];

  if (!isReview) triggerConfetti(rarity==="legendary"?50:rarity==="epic"?35:rarity==="rare"?20:12);

  const overlay = document.createElement("div");
  overlay.className = "stamp-reveal-overlay";

  const cancelBtn = isReview ?
    `<button class="stamp-reveal-cancel" data-id="${station.id}">スタンプを取り消す</button>` : "";

  overlay.innerHTML =
    `<div class="stamp-reveal">` +
      `<div class="stamp-reveal-label" style="color:${rs.border}">${isReview?"":rs.star+" "}${isReview?"コレクション":"GET!"}${isReview?"":" "+rs.star}</div>` +
      `<div class="stamp-reveal-svg" style="filter:drop-shadow(0 8px 30px ${rs.glow})">${buildStampSVG(station, sData)}</div>` +
      `<div class="stamp-reveal-name">${station.pref} ${station.name}</div>` +
      (sData && sData.art_theme ? `<div class="stamp-reveal-theme">${sData.art_theme}</div>` : "") +
      `<div class="stamp-reveal-rarity" style="background:${rs.bg}">${rs.label}</div>` +
      cancelBtn +
      `<div class="stamp-reveal-tap">タップして閉じる</div>` +
    `</div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));

  const close = () => {
    overlay.classList.remove("show");
    setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 400);
  };

  overlay.addEventListener("click", (e) => {
    if (e.target.closest(".stamp-reveal-cancel")) return;
    close();
  });

  const cancelEl = overlay.querySelector(".stamp-reveal-cancel");
  if (cancelEl) {
    cancelEl.addEventListener("click", () => {
      if (confirm(`「${station.name}」のスタンプを取り消しますか？`)) {
        _completedPrefs.delete(station.pref);
        setVisited(station.id, false);
        close();
        render();
      }
    });
  }

  if (!isReview) {
    setTimeout(() => { if(overlay.parentNode) close(); }, 8000);
  }
}

function triggerConfetti() {}

function animateCountUp(el,from,to) {
  if(from===to){ el.textContent=to; return; }
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){ el.textContent=to; return; }
  const start=performance.now(), dur=500, diff=to-from;
  function tick(now){
    const p=Math.min((now-start)/dur,1), eased=1-Math.pow(1-p,3);
    el.textContent=Math.round(from+diff*eased);
    if(p<1) requestAnimationFrame(tick);
    else { el.textContent=to; el.classList.add('count-up-active'); el.addEventListener('animationend',()=>el.classList.remove('count-up-active'),{once:true}); }
  }
  requestAnimationFrame(tick);
}

function triggerSpecialtyPopup(row, stationId, stationName, pref){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const sp=getStationSpecialty(stationId, pref);
  const rk=getRegionKey(pref);
  if(!row.querySelector('.specialty-emoji')){
    const em=document.createElement('span'); em.className='specialty-emoji'; em.textContent=sp.emoji;
    const btn=row.querySelector('.stamp-btn');
    if(btn&&btn.nextSibling) row.insertBefore(em,btn.nextSibling); else row.appendChild(em);
    requestAnimationFrame(()=>em.classList.add('pop-in'));
    em.addEventListener('animationend',()=>{em.classList.remove('pop-in');em.classList.add('shown');},{once:true});
  }
  if(rk){row.classList.add('region-flash-'+rk);setTimeout(()=>row.classList.remove('region-flash-'+rk),900);}
  const old=document.querySelector('.specialty-toast'); if(old)old.remove();
  const t=document.createElement('div'); t.className='specialty-toast';
  if(rk)t.setAttribute('data-region',rk);
  t.innerHTML=`<span class="toast-emoji">${sp.emoji}</span>${stationName}の名物: ${sp.name}！`;
  t.style.cursor="pointer";
  t.addEventListener("click",()=>{ if(t.parentNode)t.remove(); openStationDetail(stationId); });
  document.body.appendChild(t);
  setTimeout(()=>{if(t.parentNode)t.remove();},4000);
}

let _earnedBadges=new Set(), _badgeQueue=[], _badgeShowing=false;
function initBadges(){ const s=calcStats(); BADGES.forEach(b=>{ if(b.check(s.visited,s.total,s.prefComplete,s.photoCount)) _earnedBadges.add(b.id); }); }
function checkNewBadges(){
  const s=calcStats();
  BADGES.forEach(b=>{
    if(b.check(s.visited,s.total,s.prefComplete,s.photoCount)&&!_earnedBadges.has(b.id)){
      _earnedBadges.add(b.id); _badgeQueue.push(b);
    }
  });
  if(!_badgeShowing&&_badgeQueue.length>0) showBadgePopup();
}
function showBadgePopup(){
  if(_badgeQueue.length===0){ _badgeShowing=false; return; }
  _badgeShowing=true; const b=_badgeQueue.shift();
  const o=document.createElement('div'); o.className='badge-popup-overlay';
  o.innerHTML=`<div class="badge-popup"><div class="badge-popup-emoji">${b.emoji}</div><div class="badge-popup-title">🎉 実績解除！</div><div class="badge-popup-desc"><strong>${b.title}</strong><br>${b.desc}</div><button class="badge-popup-close">やったね！</button></div>`;
  document.body.appendChild(o); triggerConfetti(30);
  const close=()=>{ o.style.opacity='0'; o.style.transition='opacity 0.3s'; setTimeout(()=>{ if(o.parentNode)o.remove(); showBadgePopup(); },300); };
  o.querySelector('.badge-popup-close').addEventListener('click',close,{once:true});
  o.addEventListener('click',e=>{ if(e.target===o) close(); });
}

let _completedPrefs=new Set();
function initCompletedPrefs(){ const s=calcStats(); Object.entries(s.prefStats).forEach(([p,d])=>{ if(d.visited>=d.total&&d.total>0) _completedPrefs.add(p); }); }

// ===== 描画 =====
const openPrefs=new Set();
let _prevCount=0;
let _prevLevelIdx=-1;
let currentFilter="all";

function render(){
  const s=calcStats();
  _lsInitialized=false; _rvInitialized=false; _vetInitialized=false;
  renderWelcomeBar(s); renderDashSummary(s); renderNextQuest(s); renderPremiumNudge(s); renderHomeRecent(s); renderAchievedTitles(s); renderDogFriendlySection(s); renderVanlifeSection(s); renderRVParkSection(); renderVetSection(); renderLifestyleSearch(); renderAlmostComplete(s);
  renderList(s); renderStampbook(s); renderMap(s); renderStats(s); renderStatsMapTeaser(s); renderBadges(s);
  renderAlmostMapHint();
  if(typeof updatePCSidebar==="function") updatePCSidebar();
  checkLevelUp(s);
}

function checkLevelUp(s){
  var lv=getLevel(s.visited);
  var idx=LEVELS.indexOf(lv);
  if(_prevLevelIdx>=0 && idx>_prevLevelIdx){
    showLevelUpToast(idx+1,lv);
  }
  _prevLevelIdx=idx;
}

function showLevelUpToast(lvNum,lv){
  var existing=document.querySelector(".levelup-toast");
  if(existing) existing.remove();
  var t=document.createElement("div");
  t.className="levelup-toast";
  t.textContent="🎉 レベルアップ！Lv."+lvNum+" "+lv.title;
  document.body.appendChild(t);
  requestAnimationFrame(function(){ t.classList.add("show"); });
  setTimeout(function(){ t.classList.remove("show"); setTimeout(function(){ if(t.parentNode) t.remove(); },400); },3000);
}

let _sbFilter = "all";
function renderStampbook(stats){
  const grid=document.getElementById("stampbook-grid");
  const numEl=document.getElementById("stampbook-num");
  if(!grid) return;

  const visited=stats.visited;
  if(numEl) numEl.textContent=visited;

  const grouped={};
  MICHINOEKI_DATA.forEach(st=>{ if(!grouped[st.pref])grouped[st.pref]=[]; grouped[st.pref].push(st); });

  let html="";
  PREF_ORDER.forEach(pref=>{
    const stations=grouped[pref];
    if(!stations) return;
    const vc=stations.filter(st=>{const i=getVisitInfo(st.id);return i&&i.visited;}).length;

    let stationHtml="";
    let count=0;
    stations.forEach(st=>{
      const info=getVisitInfo(st.id);
      const isV=!!(info&&info.visited);
      if(_sbFilter==="collected"&&!isV) return;
      if(_sbFilter==="not"&&isV) return;
      count++;
      if(isV){
        const sData=getStampData(st.id);
        stationHtml+=`<div class="sb-stamp" data-id="${st.id}">${buildStampSVG(st,sData)}<div class="sb-stamp-label">${st.name}</div></div>`;
      } else {
        stationHtml+=`<div class="sb-stamp-empty"><div class="sb-stamp-empty-name">${st.name}</div></div>`;
      }
    });
    if(count>0){
      const emoji=PREF_EMOJI[pref]||"";
      html+=`<div class="sb-pref-header">${emoji} ${pref}<span class="sb-pref-progress">${vc}/${stations.length}</span></div>`;
      html+=stationHtml;
    }
  });
  if(!html){
    if(_sbFilter==="collected") html='<div class="empty-state">まだスタンプを獲得していません。<br>一覧から道の駅を訪問してスタンプを集めましょう！</div>';
    else if(_sbFilter==="not") html='<div class="empty-state">すべてのスタンプを獲得済みです！<br>おめでとうございます！</div>';
  }
  grid.innerHTML=html;

  grid.querySelectorAll(".sb-stamp").forEach(el=>{
    el.addEventListener("click",()=>{
      const st=MICHINOEKI_DATA.find(s=>s.id===parseInt(el.dataset.id));
      if(st) showStampReveal(st,true);
    });
  });
}

document.querySelectorAll(".sb-chip").forEach(chip=>{
  chip.addEventListener("click",()=>{
    document.querySelectorAll(".sb-chip").forEach(c=>c.classList.remove("active"));
    chip.classList.add("active");
    _sbFilter=chip.dataset.sbf;
    render();
  });
});

// ===== ダッシュボード: ウェルカムバー =====
function renderWelcomeBar(s){
  const el=document.getElementById("welcome-bar");
  if(!el) return;
  const lv=getLevel(s.visited);
  const next=LEVELS.find(l=>l.min>s.visited);
  let progPct=100;
  if(next) progPct=Math.round(((s.visited-lv.min)/(next.min-lv.min))*100);
  const nextText=next?`次のレベルまで あと${next.min-s.visited}駅`:"最高レベル到達！";
  el.innerHTML=
    `<div class="welcome-greeting">🐕 愛犬と車中泊の旅へ 🚐</div>`+
    `<div class="welcome-level">${lv.emoji} Lv.${LEVELS.indexOf(lv)+1} ${lv.title}</div>`+
    `<div class="welcome-xp-wrap"><div class="welcome-xp-bar"><div class="welcome-xp-fill" style="width:${progPct}%"></div></div>`+
    `<div class="welcome-xp-text">${nextText}</div></div>`;
}

// ===== ダッシュボード: 達成サマリー 2×2 =====
function renderDashSummary(s){
  const el=document.getElementById("dash-summary");
  if(!el) return;
  const pct=s.total?Math.round((s.visited/s.total)*1000)/10:0;
  const lv=getLevel(s.visited);
  el.innerHTML=
    `<div class="dash-card"><div class="dash-card-num">${pct}%</div><div class="dash-card-label">全国制覇率</div></div>`+
    `<div class="dash-card"><div class="dash-card-num">${s.visited}</div><div class="dash-card-label">訪問済み駅</div></div>`+
    `<div class="dash-card"><div class="dash-card-num">${s.prefComplete}</div><div class="dash-card-label">制覇都道府県</div></div>`+
    `<div class="dash-card"><div class="dash-card-num">${lv.emoji}</div><div class="dash-card-label">Lv.${LEVELS.indexOf(lv)+1} ${lv.title}</div></div>`;
}

// ===== ダッシュボード: 次のクエスト =====
function renderNextQuest(s){
  const el=document.getElementById("next-quest");
  if(!el) return;
  const nextBadge=BADGES.find(b=>{
    if(b.type==="pref") return !b.check(s.visited,s.total,s.prefComplete);
    if(b.type==="photo") return !b.check(s.visited,s.total,s.prefComplete,s.photoCount);
    return !b.check(s.visited,s.total);
  });
  if(!nextBadge){ el.innerHTML=`<div class="quest-complete">🎊 全クエスト達成！おめでとうございます！</div>`; return; }
  const target=nextBadge.max||s.total;
  const current=nextBadge.type==="pref"?s.prefComplete:nextBadge.type==="photo"?s.photoCount:s.visited;
  const progPct=target>0?Math.min(100,Math.round((current/target)*100)):0;
  const remaining=Math.max(0,target-current);
  el.innerHTML=
    `<div class="quest-header">次のクエスト</div>`+
    `<div class="quest-name">${nextBadge.emoji} ${nextBadge.title}</div>`+
    `<div class="quest-desc">${nextBadge.desc}</div>`+
    `<div class="quest-progress-wrap"><div class="quest-progress-bar"><div class="quest-progress-fill" style="width:${progPct}%"></div></div>`+
    `<div class="quest-progress-text">${current} / ${target}（あと${remaining}）</div></div>`;
}

// ===== ダッシュボード: 達成済み称号 =====
function renderAchievedTitles(s){
  const el=document.getElementById("achieved-titles");
  if(!el) return;
  const achieved=BADGES.filter(b=>{
    if(b.type==="pref") return b.check(s.visited,s.total,s.prefComplete);
    if(b.type==="photo") return b.check(s.visited,s.total,s.prefComplete,s.photoCount);
    return b.check(s.visited,s.total);
  });
  if(achieved.length===0){ el.innerHTML=""; return; }
  el.innerHTML=`<div class="section-header">獲得した称号</div>`+
    `<div class="titles-scroll">`+
    achieved.map(b=>`<div class="title-badge">${b.emoji}<span>${b.title}</span></div>`).join("")+
    `</div>`;
}

function renderHomeRecent(s){
  const el=document.getElementById("home-recent");
  if(s.recentVisits.length===0){
    el.innerHTML='<div class="empty-state">まだスタンプがありません。<br>一覧から最初のスタンプを押してみましょう！</div>';
    return;
  }
  el.innerHTML=s.recentVisits.slice(0,3).map(v=>
    `<div class="recent-chip">${PREF_EMOJI[v.pref]||"📍"} ${v.name} <span class="recent-chip-date">${v.date}</span></div>`
  ).join("");
}

// ===== 犬連れ旅情報セクション =====
function pickRandom(arr, n){
  const copy=[...arr];
  const result=[];
  while(result.length<n&&copy.length>0){
    const idx=Math.floor(Math.random()*copy.length);
    result.push(copy.splice(idx,1)[0]);
  }
  return result;
}

function spreadByRegion(arr, n){
  const byRegion={};
  arr.forEach(st=>{
    for(const [rn,prefs] of Object.entries(REGIONS)){
      if(prefs.includes(st.pref)){
        if(!byRegion[rn]) byRegion[rn]=[];
        byRegion[rn].push(st);
        break;
      }
    }
  });
  const regions=Object.keys(byRegion);
  const result=[];
  let round=0;
  while(result.length<n&&round<20){
    const r=regions[round%regions.length];
    if(byRegion[r]&&byRegion[r].length>0){
      const idx=Math.floor(Math.random()*byRegion[r].length);
      result.push(byRegion[r].splice(idx,1)[0]);
    }
    round++;
  }
  return result;
}

function renderDogFriendlySection(s){
  const el=document.getElementById("dog-friendly-section");
  if(!el) return;
  const dogStations=MICHINOEKI_DATA.filter(st=>{
    const fac=getStationFacilities(st);
    return fac.dog.hasRun||fac.dogRun>=2;
  });
  const visitedDog=dogStations.filter(st=>{const i=getVisitInfo(st.id);return i&&i.visited;}).length;
  const unvisitedDog=dogStations.filter(st=>{const i=getVisitInfo(st.id);return !(i&&i.visited);});
  const recommend=spreadByRegion(unvisitedDog,5);
  el.innerHTML=
    `<div class="lifestyle-card dog-card">`+
      `<div class="lifestyle-header">`+
        `<span class="lifestyle-icon">🐕</span>`+
        `<div class="lifestyle-header-text">`+
          `<div class="lifestyle-title">犬連れ旅の道の駅</div>`+
          `<div class="lifestyle-subtitle">ドッグラン・ペット同伴エリアのある駅</div>`+
        `</div>`+
      `</div>`+
      `<div class="lifestyle-stats">`+
        `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${dogStations.length}</span><span class="lifestyle-stat-label">犬連れ対応</span></div>`+
        `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${visitedDog}</span><span class="lifestyle-stat-label">訪問済み</span></div>`+
        `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${dogStations.length-visitedDog}</span><span class="lifestyle-stat-label">未訪問</span></div>`+
      `</div>`+
      (recommend.length>0?
        `<div class="lifestyle-recommend-title">🐾 全国のおすすめ未訪問駅</div>`+
        `<div class="lifestyle-recommend">`+
        recommend.map(st=>{
          const fac=getStationFacilities(st);
          const tags=[];
          if(fac.dog.hasRun) tags.push("ドッグラン");
          if(fac.dog.largeDog) tags.push("大型犬OK");
          if(fac.dog.fee==="無料") tags.push("無料");
          return `<div class="lifestyle-chip" onclick="openStationDetail(${st.id})">`+
            `${PREF_EMOJI[st.pref]||"📍"} ${st.name}`+
            `<span class="lifestyle-chip-tags">${tags.map(t=>`<span class="mini-tag">${t}</span>`).join("")}</span>`+
            `<span class="lifestyle-chip-pref">${st.pref}</span></div>`;
        }).join("")+
        `</div>`:"")+
    `</div>`;
}

// ===== 車中泊スポットセクション =====
function renderVanlifeSection(s){
  const el=document.getElementById("vanlife-section");
  if(!el) return;
  const vanStations=MICHINOEKI_DATA.filter(st=>{
    const fac=getStationFacilities(st);
    return fac.vanlife>=3;
  });
  const visitedVan=vanStations.filter(st=>{const i=getVisitInfo(st.id);return i&&i.visited;}).length;
  const unvisitedVan=vanStations.filter(st=>{const i=getVisitInfo(st.id);return !(i&&i.visited);});
  const recommend=spreadByRegion(unvisitedVan,5);

  el.innerHTML=
    `<div class="lifestyle-card vanlife-card">`+
      `<div class="lifestyle-header">`+
        `<span class="lifestyle-icon">🚐</span>`+
        `<div class="lifestyle-header-text">`+
          `<div class="lifestyle-title">車中泊スポット</div>`+
          `<div class="lifestyle-subtitle">愛犬とゆっくり過ごせる道の駅</div>`+
        `</div>`+
      `</div>`+
      `<div class="lifestyle-stats">`+
        `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${vanStations.length}</span><span class="lifestyle-stat-label">おすすめスポット</span></div>`+
        `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${visitedVan}</span><span class="lifestyle-stat-label">訪問済み</span></div>`+
        `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${vanStations.length-visitedVan}</span><span class="lifestyle-stat-label">未訪問</span></div>`+
      `</div>`+
      `<div class="vanlife-tips">`+
        `<div class="vanlife-tip">💡 車中泊のマナー：エンジン停止・ゴミ持ち帰り・長期滞在禁止</div>`+
      `</div>`+
      (recommend.length>0?
        `<div class="lifestyle-recommend-title">🚐 全国のおすすめ未訪問スポット</div>`+
        `<div class="lifestyle-recommend">`+
        recommend.map(st=>{
          const fac=getStationFacilities(st);
          return `<div class="lifestyle-chip" onclick="openStationDetail(${st.id})">`+
            `${PREF_EMOJI[st.pref]||"📍"} ${st.name}`+
            `<span class="lifestyle-chip-tags">`+
              `<span class="mini-tag van-tag">${renderStars(fac.vanlife,5)}</span>`+
            `</span>`+
            `<span class="lifestyle-chip-pref">${st.pref}</span></div>`;
        }).join("")+
        `</div>`:"")+
    `</div>`;
}

// ===== RVパーク検索セクション =====
let _rvInitialized=false;
function renderRVParkSection(){
  const el=document.getElementById("rvpark-section");
  if(!el) return;
  if(_rvInitialized) return;
  _rvInitialized=true;

  const rvParks=[
    {name:"RVパーク 道の駅ならは",pref:"福島県",features:["電源あり","温泉隣接","ペットOK"],price:"2,000円〜/泊",tel:"0240-25-8571",url:"https://www.kurumatabi.com/park/rvpark/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅川場田園プラザ",pref:"群馬県",features:["電源あり","トイレ24h","ペットOK"],price:"2,500円〜/泊",tel:"0278-52-3711",url:"https://www.denenplaza.co.jp/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅うつのみや ろまんちっく村",pref:"栃木県",features:["電源あり","温泉","ドッグラン"],price:"3,000円〜/泊",tel:"028-665-8800",url:"https://www.romanticmura.com/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅伊東マリンタウン",pref:"静岡県",features:["電源あり","温泉","海沿い"],price:"2,500円〜/泊",tel:"0557-38-3811",url:"https://ito-marinetown.co.jp/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅たかねざわ 元気あっぷむら",pref:"栃木県",features:["電源あり","温泉","広い"],price:"2,000円〜/泊",tel:"028-676-1126",url:"https://www.genkiupmura.com/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅あさひかわ",pref:"北海道",features:["電源あり","ゴミ処理可","ペットOK"],price:"2,000円〜/泊",tel:"0166-25-7960",url:"https://www.kurumatabi.com/park/rvpark/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅みなかみ水紀行館",pref:"群馬県",features:["電源あり","川沿い","ペットOK"],price:"2,000円〜/泊",tel:"0278-72-1425",url:"https://www.kurumatabi.com/park/rvpark/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅富士吉田",pref:"山梨県",features:["電源あり","富士山ビュー","トイレ24h"],price:"3,000円〜/泊",tel:"0555-21-1033",url:"https://www.kurumatabi.com/park/rvpark/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅氷見漁港場外市場ひみ番屋街",pref:"富山県",features:["電源あり","海鮮市場","温泉近く"],price:"2,500円〜/泊",tel:"0766-72-3400",url:"https://himi-banya.jp/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅神戸フルーツ・フラワーパーク",pref:"兵庫県",features:["電源あり","ドッグラン","広い敷地"],price:"3,000円〜/泊",tel:"078-954-1000",url:"https://fruit-flowerpark.jp/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅桜島",pref:"鹿児島県",features:["電源あり","温泉","絶景"],price:"2,000円〜/泊",tel:"099-245-2011",url:"https://www.kurumatabi.com/park/rvpark/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅おおき",pref:"福岡県",features:["電源あり","ペットOK","静か"],price:"1,500円〜/泊",tel:"0944-75-2150",url:"https://www.kurumatabi.com/park/rvpark/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅すばしり",pref:"静岡県",features:["電源あり","富士山近く","広い"],price:"2,500円〜/泊",tel:"0550-75-6363",url:"https://www.kurumatabi.com/park/rvpark/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅サンピコごうつ",pref:"島根県",features:["電源あり","海沿い","ペットOK"],price:"2,000円〜/泊",tel:"0855-52-7288",url:"https://www.kurumatabi.com/park/rvpark/",booking:"https://www.kurumatabi.com/park/rvpark/"},
    {name:"RVパーク 道の駅しんよしとみ",pref:"福岡県",features:["電源あり","温泉近く","静か"],price:"1,500円〜/泊",tel:"0979-37-7234",url:"https://www.kurumatabi.com/park/rvpark/",booking:"https://www.kurumatabi.com/park/rvpark/"},
  ];

  el.innerHTML=
    `<div class="lifestyle-card rvpark-card">`+
      `<div class="lifestyle-header">`+
        `<span class="lifestyle-icon">🅿️</span>`+
        `<div class="lifestyle-header-text">`+
          `<div class="lifestyle-title">RVパーク（道の駅併設）</div>`+
          `<div class="lifestyle-subtitle">電源・トイレ完備の公認車中泊スポット</div>`+
        `</div>`+
      `</div>`+
      `<div class="rvpark-info">`+
        `<div class="rvpark-stat-row">`+
          `<div class="lifestyle-stat"><span class="lifestyle-stat-num">644</span><span class="lifestyle-stat-label">全国RVパーク</span></div>`+
          `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${rvParks.length}+</span><span class="lifestyle-stat-label">道の駅併設</span></div>`+
        `</div>`+
      `</div>`+
      `<div class="rvpark-filter">`+
        `<select id="rvpark-region" class="ls-select"><option value="">全国</option>`+
          Object.keys(REGIONS).map(r=>`<option value="${r}">${r}</option>`).join("")+
        `</select>`+
        `<select id="rvpark-feature" class="ls-select"><option value="">設備で絞る</option><option value="ペットOK">ペットOK</option><option value="ドッグラン">ドッグラン</option><option value="温泉">温泉あり</option><option value="電源あり">電源あり</option></select>`+
        `<button id="rvpark-search-btn" class="ls-search-btn rvpark-btn">🔍 検索</button>`+
      `</div>`+
      `<a href="https://www.kurumatabi.com/park/rvpark/" target="_blank" rel="noopener" class="rvpark-more-link">📋 RVパーク全一覧を見る（くるま旅クラブ） ↗</a>`+
      `<div id="rvpark-results" class="rvpark-results">`+
        rvParks.slice(0,5).map(rv=>renderRVParkItem(rv)).join("")+
      `</div>`+
    `</div>`;

  document.getElementById("rvpark-search-btn").addEventListener("click",()=>{
    const region=document.getElementById("rvpark-region").value;
    const feature=document.getElementById("rvpark-feature").value;
    let filtered=rvParks;
    if(region){
      const prefs=REGIONS[region]||[];
      filtered=filtered.filter(rv=>prefs.includes(rv.pref));
    }
    if(feature){
      filtered=filtered.filter(rv=>rv.features.some(f=>f.includes(feature)));
    }
    const resultsEl=document.getElementById("rvpark-results");
    if(filtered.length===0){
      resultsEl.innerHTML=`<div class="ls-empty">条件に合うRVパークが見つかりませんでした</div>`;
    } else {
      resultsEl.innerHTML=filtered.map(rv=>renderRVParkItem(rv)).join("");
    }
  });
}

function renderRVParkItem(rv){
  return `<div class="rvpark-item">`+
    `<div class="rvpark-item-header">`+
      `<span class="rvpark-item-name">${PREF_EMOJI[rv.pref]||""} ${rv.name}</span>`+
      `<span class="rvpark-item-price">${rv.price||""}</span>`+
    `</div>`+
    `<div class="rvpark-item-pref">${rv.pref}</div>`+
    `<div class="rvpark-item-features">${rv.features.map(f=>`<span class="rvpark-feat">${f}</span>`).join("")}</div>`+
    `<div class="rvpark-item-actions">`+
      (rv.tel?`<a href="tel:${rv.tel.replace(/-/g,"")}" class="rvpark-action-btn rvpark-tel">📞 ${rv.tel}</a>`:"")+
      (rv.booking?`<a href="${rv.booking}" target="_blank" rel="noopener" class="rvpark-action-btn rvpark-book">📋 予約・詳細</a>`:"")+
      (rv.url&&rv.url!==rv.booking?`<a href="${rv.url}" target="_blank" rel="noopener" class="rvpark-action-btn rvpark-site">🔗 公式サイト</a>`:"")+
    `</div>`+
  `</div>`;
}

// ===== 緊急動物病院セクション =====
let _vetInitialized=false;
function renderVetSection(){
  const el=document.getElementById("vet-section");
  if(!el) return;
  if(typeof EMERGENCY_VETS==="undefined"||EMERGENCY_VETS.length===0){
    el.innerHTML=
      `<div class="lifestyle-card vet-card">`+
        `<div class="lifestyle-header">`+
          `<span class="lifestyle-icon">🏥</span>`+
          `<div class="lifestyle-header-text">`+
            `<div class="lifestyle-title">緊急動物病院</div>`+
            `<div class="lifestyle-subtitle">24時間・夜間対応の動物病院を検索</div>`+
          `</div>`+
        `</div>`+
        `<div class="vet-loading">データを読み込み中...</div>`+
      `</div>`;
    let _vetRetry=0;
    const _vetTimer=setInterval(()=>{
      _vetRetry++;
      if(typeof EMERGENCY_VETS!=="undefined"&&EMERGENCY_VETS.length>0){
        clearInterval(_vetTimer);
        renderVetSection();
      } else if(_vetRetry>=10){
        clearInterval(_vetTimer);
        el.innerHTML=
          `<div class="lifestyle-card vet-card">`+
            `<div class="lifestyle-header">`+
              `<span class="lifestyle-icon">🏥</span>`+
              `<div class="lifestyle-header-text">`+
                `<div class="lifestyle-title">緊急動物病院</div>`+
                `<div class="lifestyle-subtitle">24時間・夜間対応の動物病院を検索</div>`+
              `</div>`+
            `</div>`+
            `<div class="vet-loading">データの読み込みに失敗しました。ページを再読み込みしてください。</div>`+
          `</div>`;
      }
    },500);
    return;
  }
  if(_vetInitialized) return;
  _vetInitialized=true;

  const prefList=[...new Set(EMERGENCY_VETS.map(v=>v.pref))].sort();
  const h24=EMERGENCY_VETS.filter(v=>v.type==="24h").length;
  const night=EMERGENCY_VETS.filter(v=>v.type==="night").length;

  el.innerHTML=
    `<div class="lifestyle-card vet-card">`+
      `<div class="lifestyle-header">`+
        `<span class="lifestyle-icon">🏥</span>`+
        `<div class="lifestyle-header-text">`+
          `<div class="lifestyle-title">緊急動物病院</div>`+
          `<div class="lifestyle-subtitle">旅先で愛犬の体調が悪くなったら</div>`+
        `</div>`+
      `</div>`+
      `<div class="vet-emergency-banner">🚨 緊急時は迷わず電話してください</div>`+
      `<div class="rvpark-stat-row">`+
        `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${EMERGENCY_VETS.length}</span><span class="lifestyle-stat-label">登録病院</span></div>`+
        `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${h24}</span><span class="lifestyle-stat-label">24時間対応</span></div>`+
        `<div class="lifestyle-stat"><span class="lifestyle-stat-num">${prefList.length}</span><span class="lifestyle-stat-label">対応都道府県</span></div>`+
      `</div>`+
      `<div class="vet-filter">`+
        `<select id="vet-pref" class="ls-select">`+
          `<option value="">都道府県を選ぶ</option>`+
          PREF_ORDER.map(p=>{
            const has=EMERGENCY_VETS.some(v=>v.pref===p);
            return has?`<option value="${p}">${PREF_EMOJI[p]||""} ${p}</option>`:"";
          }).join("")+
        `</select>`+
        `<select id="vet-type" class="ls-select">`+
          `<option value="">対応時間</option>`+
          `<option value="24h">24時間</option>`+
          `<option value="night">夜間救急</option>`+
          `<option value="holiday">休日対応</option>`+
        `</select>`+
        `<button id="vet-search-btn" class="ls-search-btn vet-btn">🔍 検索</button>`+
      `</div>`+
      `<div id="vet-results" class="vet-results"></div>`+
      `<div class="vet-disclaimer">⚠️ 掲載情報は参考情報です。営業時間・対応状況は変更される場合があります。<strong>必ず事前にお電話でご確認ください。</strong></div>`+
    `</div>`;

  document.getElementById("vet-search-btn").addEventListener("click",runVetSearch);
}

function runVetSearch(){
  const pref=document.getElementById("vet-pref").value;
  const type=document.getElementById("vet-type").value;
  const resultsEl=document.getElementById("vet-results");

  let filtered=EMERGENCY_VETS;
  if(pref) filtered=filtered.filter(v=>v.pref===pref);
  if(type) filtered=filtered.filter(v=>v.type===type);

  if(filtered.length===0){
    resultsEl.innerHTML=`<div class="ls-empty">該当する病院が見つかりませんでした</div>`;
    return;
  }

  filtered.sort((a,b)=>{
    const order={["24h"]:0,["night"]:1,["holiday"]:2};
    return (order[a.type]||9)-(order[b.type]||9);
  });

  resultsEl.innerHTML=filtered.map(v=>{
    const typeLabel=v.type==="24h"?"24時間":(v.type==="night"?"夜間救急":"休日対応");
    const typeCls=v.type==="24h"?"vet-type-24h":(v.type==="night"?"vet-type-night":"vet-type-holiday");
    return `<div class="vet-item">`+
      `<div class="vet-item-header">`+
        `<span class="vet-item-name">${v.name}</span>`+
        `<span class="vet-type-badge ${typeCls}">${typeLabel}</span>`+
      `</div>`+
      `<div class="vet-item-location">📍 ${v.pref}${v.city||""}${v.address||""}</div>`+
      `<div class="vet-item-hours">🕐 ${v.hours||typeLabel}</div>`+
      (v.notes?`<div class="vet-item-notes">${v.notes}</div>`:"")+
      `<div class="vet-item-actions">`+
        (v.tel?`<a href="tel:${v.tel.replace(/[-ー−]/g,"")}" class="vet-call-btn">📞 ${v.tel}</a>`:"")+
        (v.url?`<a href="${v.url}" target="_blank" rel="noopener" class="vet-site-btn">🔗 公式サイト</a>`:"")+
      `</div>`+
    `</div>`;
  }).join("");
}

// ===== おすすめ検索セクション =====
let _lsInitialized=false;
function renderLifestyleSearch(){
  const el=document.getElementById("lifestyle-search-section");
  if(!el) return;
  if(_lsInitialized) return;
  _lsInitialized=true;

  el.innerHTML=
    `<div class="lifestyle-card search-card">`+
      `<div class="lifestyle-header">`+
        `<span class="lifestyle-icon">🔍</span>`+
        `<div class="lifestyle-header-text">`+
          `<div class="lifestyle-title">おすすめ検索</div>`+
          `<div class="lifestyle-subtitle">条件を選んで道の駅を探そう</div>`+
        `</div>`+
      `</div>`+
      `<div class="ls-filters">`+
        `<div class="ls-filter-group-title">🐕 わんこ条件</div>`+
        `<div class="ls-filter-row">`+
          `<label class="ls-filter-label">ドッグラン</label>`+
          `<select id="ls-dogrun" class="ls-select"><option value="">指定なし</option><option value="yes">あり</option></select>`+
        `</div>`+
        `<div class="ls-filter-row">`+
          `<label class="ls-filter-label">大型犬</label>`+
          `<select id="ls-largedog" class="ls-select"><option value="">指定なし</option><option value="yes">OK</option></select>`+
        `</div>`+
        `<div class="ls-filter-row">`+
          `<label class="ls-filter-label">小型/大型 分離</label>`+
          `<select id="ls-separated" class="ls-select"><option value="">指定なし</option><option value="yes">あり</option></select>`+
        `</div>`+
        `<div class="ls-filter-row">`+
          `<label class="ls-filter-label">証明書不要</label>`+
          `<select id="ls-nocert" class="ls-select"><option value="">指定なし</option><option value="yes">不要のみ</option></select>`+
        `</div>`+
        `<div class="ls-filter-row">`+
          `<label class="ls-filter-label">無料</label>`+
          `<select id="ls-free" class="ls-select"><option value="">指定なし</option><option value="yes">無料のみ</option></select>`+
        `</div>`+
        `<div class="ls-filter-group-title">📋 施設条件</div>`+
        `<div class="ls-filter-row">`+
          `<label class="ls-filter-label">🐕 犬連れおすすめ</label>`+
          `<select id="ls-dog" class="ls-select"><option value="0">指定なし</option><option value="2">★★以上</option><option value="3">★★★以上</option></select>`+
        `</div>`+
        `<div class="ls-filter-row">`+
          `<label class="ls-filter-label">🚻 トイレ綺麗度</label>`+
          `<select id="ls-toilet" class="ls-select"><option value="0">指定なし</option><option value="3">★★★以上</option><option value="4">★★★★以上</option></select>`+
        `</div>`+
        `<div class="ls-filter-row">`+
          `<label class="ls-filter-label">🚐 車中泊おすすめ</label>`+
          `<select id="ls-vanlife" class="ls-select"><option value="0">指定なし</option><option value="3">★★★以上</option><option value="4">★★★★以上</option></select>`+
        `</div>`+
        `<div class="ls-filter-group-title">📍 エリア</div>`+
        `<div class="ls-filter-row">`+
          `<label class="ls-filter-label">地方</label>`+
          `<select id="ls-region" class="ls-select"><option value="">全国</option>`+
            Object.keys(REGIONS).map(r=>`<option value="${r}">${r}</option>`).join("")+
          `</select>`+
        `</div>`+
        `<button id="ls-search-btn" class="ls-search-btn">🔍 検索する</button>`+
      `</div>`+
      `<div id="ls-results" class="ls-results"></div>`+
    `</div>`;

  document.getElementById("ls-search-btn").addEventListener("click",runLifestyleSearch);
}

function runLifestyleSearch(){
  const wantRun=document.getElementById("ls-dogrun").value==="yes";
  const wantLarge=document.getElementById("ls-largedog").value==="yes";
  const wantSep=document.getElementById("ls-separated").value==="yes";
  const wantNoCert=document.getElementById("ls-nocert").value==="yes";
  const wantFree=document.getElementById("ls-free").value==="yes";
  const dogMin=parseInt(document.getElementById("ls-dog").value)||0;
  const toiletMin=parseInt(document.getElementById("ls-toilet").value)||0;
  const vanlifeMin=parseInt(document.getElementById("ls-vanlife").value)||0;
  const region=document.getElementById("ls-region").value;
  const resultsEl=document.getElementById("ls-results");

  let stations=MICHINOEKI_DATA;
  if(region) stations=stations.filter(st=>REGIONS[region]&&REGIONS[region].includes(st.pref));

  const matched=stations.map(st=>{
    const fac=getStationFacilities(st);
    if(wantRun&&!fac.dog.hasRun) return null;
    if(wantLarge&&!fac.dog.largeDog) return null;
    if(wantSep&&!fac.dog.separated) return null;
    if(wantNoCert&&fac.dog.certificateRequired) return null;
    if(wantFree&&fac.dog.fee!=="無料"&&fac.dog.fee!=="—") return null;
    if(dogMin&&fac.dogRun<dogMin) return null;
    if(toiletMin&&fac.toilet<toiletMin) return null;
    if(vanlifeMin&&fac.vanlife<vanlifeMin) return null;
    const info=getVisitInfo(st.id);
    return {st,fac,visited:!!(info&&info.visited)};
  }).filter(Boolean);

  if(matched.length===0){
    resultsEl.innerHTML=`<div class="ls-empty">条件に合う道の駅が見つかりませんでした</div>`;
    return;
  }

  matched.sort((a,b)=>(b.fac.dogRun+b.fac.toilet+b.fac.vanlife)-(a.fac.dogRun+a.fac.toilet+a.fac.vanlife));

  resultsEl.innerHTML=
    `<div class="ls-count">${matched.length}件の道の駅が見つかりました</div>`+
    matched.slice(0,20).map(m=>{
      const tags=[];
      if(m.fac.dog.hasRun) tags.push("🐕 ドッグラン");
      if(m.fac.dog.largeDog) tags.push("🐕‍🦺 大型犬OK");
      if(m.fac.dog.separated) tags.push("↔️ 分離あり");
      if(!m.fac.dog.certificateRequired) tags.push("📄 証明書不要");
      if(m.fac.dog.fee==="無料") tags.push("💰 無料");
      return `<div class="ls-result-item" onclick="openStationDetail(${m.st.id})">`+
        `<div class="ls-result-header">`+
          `<span class="ls-result-name">${PREF_EMOJI[m.st.pref]||""} ${m.st.name}</span>`+
          `<span class="ls-result-visit">${m.visited?"✅":"—"}</span>`+
        `</div>`+
        `<div class="ls-result-pref">${m.st.pref} ${m.st.location}</div>`+
        (tags.length>0?`<div class="ls-result-tags">${tags.map(t=>`<span class="ls-tag">${t}</span>`).join("")}</div>`:"")+
        `<div class="ls-result-ratings">`+
          `<span class="ls-rating">🐕${renderStars(m.fac.dogRun,5)}</span>`+
          `<span class="ls-rating">🚻${renderStars(m.fac.toilet,5)}</span>`+
          `<span class="ls-rating">🚐${renderStars(m.fac.vanlife,5)}</span>`+
        `</div>`+
      `</div>`;
    }).join("")+
    (matched.length>20?`<div class="ls-more">他 ${matched.length-20}件</div>`:"");
}

function renderAlmostComplete(s){
  const el=document.getElementById("almost-section");
  const almostPrefs=[];
  Object.entries(s.prefStats).forEach(([p,d])=>{ const r=d.total-d.visited; if(r>0&&r<=3) almostPrefs.push({pref:p,remaining:r}); });
  if(almostPrefs.length===0){ el.innerHTML=""; return; }
  el.innerHTML=`<div class="section-header">もうすぐ制覇！</div>` +
    almostPrefs.map(a=>`<div class="almost-chip">🔥 ${PREF_EMOJI[a.pref]||""} ${a.pref} あと${a.remaining}駅</div>`).join("");
}

function renderList(s){
  const q=document.getElementById("search").value.trim();
  const c=document.getElementById("pref-list"); c.innerHTML="";
  const grouped={}; MICHINOEKI_DATA.forEach(st=>{ if(!grouped[st.pref])grouped[st.pref]=[]; grouped[st.pref].push(st); });

  PREF_ORDER.filter(p=>grouped[p]).forEach(pref=>{
    const stations=grouped[pref];
    const filtered=stations.filter(st=>{
      const i=getVisitInfo(st.id), v=!!(i&&i.visited);
      if(currentFilter==="visited"&&!v)return false;
      if(currentFilter==="unvisited"&&v)return false;
      if(q&&!`${st.name} ${st.location} ${st.pref}`.includes(q))return false;
      return true;
    });
    if(filtered.length===0)return;

    const vc=stations.filter(st=>{const i=getVisitInfo(st.id);return i&&i.visited}).length;
    const pct=Math.round((vc/stations.length)*100);
    const isComplete=pct===100;
    const remaining=stations.length-vc;

    const card=document.createElement("div");
    card.className="pref-card"+(isComplete?" pref-complete":"");
    const regionKey=getRegionKey(pref); if(regionKey) card.setAttribute("data-region",regionKey);

    const header=document.createElement("div"); header.className="pref-header";
    const emoji=PREF_EMOJI[pref]||"";
    const completeBadge=isComplete?' <span class="pref-complete-badge">制覇！</span>':"";
    const almostText=(!isComplete&&remaining<=3)?` <span class="pref-almost">あと${remaining}駅！</span>`:"";
    header.innerHTML=`<div class="pref-name"><span class="pref-emoji">${emoji}</span>${pref}${completeBadge}${almostText} <span class="pref-progress-text">${vc}/${stations.length}（${pct}%）</span></div><span class="chevron">▶</span>`;

    const bar=document.createElement("div"); bar.className="pref-bar";
    bar.innerHTML=`<div class="pref-bar-fill" style="width:${pct}%"></div>`;

    const list=document.createElement("div"); list.className="station-list";
    filtered.forEach(st=>{
      const info=getVisitInfo(st.id), isV=!!(info&&info.visited);
      const isClosed=st.status==="closed";
      const row=document.createElement("div"); row.className="station-row"+(isV?" visited":"")+(isClosed?" closed":"");

      const sData=getStampData(st.id);
      const rarity=sData?sData.rarity:"common";
      const stampBtn=document.createElement("button");
      stampBtn.className="stamp-btn"+(isV?" stamped":"")+" rarity-"+rarity;
      stampBtn.setAttribute("aria-label", isV?"スタンプ済み":"スタンプを押す");
      if(isV) stampBtn.innerHTML=buildStampSVG(st, sData);

      stampBtn.addEventListener("click",()=>{
        if(isV){
          showStampReveal(st, true);
          return;
        }
        const prev=calcStats().visited;
        setVisited(st.id,true);
        stampBtn.classList.add("stamped");
        showStampReveal(st);
        const ns=calcStats();
        for(const m of MILESTONES){ if(prev<m&&ns.visited>=m){ triggerConfetti(m>=100?40:m>=50?30:20); break; } }
        if(ns.prefStats[st.pref].visited>=ns.prefStats[st.pref].total&&!_completedPrefs.has(st.pref)){
          _completedPrefs.add(st.pref); triggerConfetti(35);
        }
        setTimeout(()=>{ render(); checkNewBadges(); checkCertificateTriggers(); showPremiumToast(st.name,st.pref); },600);
      });

      const infoDiv=document.createElement("div"); infoDiv.className="station-info";
      const statusBadge = st.status==="closed"?'<span class="badge-closed">閉鎖</span>'
        : st.status==="temp_closed"?'<span class="badge-temp-closed">休業中</span>'
        : st.status==="renewed"?'<span class="badge-renewed">リニューアル</span>'
        : "";
      const nb=st.isNew?'<span class="badge-new">NEW</span>':statusBadge;
      const photoCount=isV?((info.photo?1:0)+(info.photos?info.photos.length:0)):0;
      const hasNote=isV&&info.note&&info.note.length>0;
      const notePreview=hasNote?`<div class="visited-note">📝 ${info.note.slice(0,30)}${info.note.length>30?"…":""}</div>`:"";
      const photoPreview=isV&&info.photo?`<img class="station-photo" src="${info.photo}" alt="写真">${photoCount>1?`<span class="photo-count">+${photoCount-1}</span>`:""}`:"";
      infoDiv.innerHTML=`<div class="station-name">${st.name}${nb}</div><div class="station-meta">${st.location}（${st.round} / ${st.date}登録）</div>${isV&&info.date?`<div class="visited-date">📅 ${info.date}</div>`:""}${notePreview}${photoPreview}`;

      const actionsDiv=document.createElement("div");
      actionsDiv.className="station-actions";
      if(isV){
        actionsDiv.innerHTML=
          `<label class="sa-btn sa-camera" title="写真を撮る">`+
            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`+
            `${photoCount>0?`<span class="sa-badge">${photoCount}</span>`:""}`+
            `<input type="file" accept="image/*" capture="environment" hidden>`+
          `</label>`+
          `<button class="sa-btn sa-diary${hasNote?" has-note":""}" title="日記を書く">`+
            `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`+
          `</button>`;

        const cameraLabel=actionsDiv.querySelector(".sa-camera");
        const cameraInput=actionsDiv.querySelector('input[type="file"]');
        cameraLabel.addEventListener("click",ev=>{
          if(!isPremium()&&photoCount>=1){
            ev.preventDefault();
            showPaywall();
            return;
          }
        });
        cameraInput.addEventListener("change",ev=>{
          const f=ev.target.files[0]; if(!f) return;
          compressAndSavePhoto(st.id, f, ()=>{ render(); });
          cameraInput.value="";
        });

        const diaryBtn=actionsDiv.querySelector(".sa-diary");
        diaryBtn.addEventListener("click",()=>{
          if(!isPremium()){
            showPaywall();
            return;
          }
          openStationDetail(st.id);
        });

        infoDiv.addEventListener("click",e=>{
          if(e.target.closest(".station-actions")) return;
          openStationDetail(st.id);
        });
      }

      row.appendChild(stampBtn); row.appendChild(infoDiv); row.appendChild(actionsDiv); list.appendChild(row);
    });

    if(openPrefs.has(pref)){card.classList.add("open");list.classList.add("open");header.querySelector(".chevron").textContent="▼";}
    header.addEventListener("click",()=>{
      card.classList.toggle("open");list.classList.toggle("open");
      const o=list.classList.contains("open"); header.querySelector(".chevron").textContent=o?"▼":"▶";
      if(o)openPrefs.add(pref);else openPrefs.delete(pref);
    });
    card.appendChild(header);card.appendChild(bar);card.appendChild(list);c.appendChild(card);
  });
}

function renderStats(s){ renderTimeline(s); }

function renderTimeline(s){
  var el=document.getElementById("timeline-list");
  if(!el) return;
  var manual=loadManual();
  var entries=[];
  MICHINOEKI_DATA.forEach(function(st){
    var info=manual[st.id];
    if(!info || !info.visited) return;
    entries.push({id:st.id,name:st.name,pref:st.pref,date:info.date||"",photo:info.photo||null,memo:info.note||""});
  });
  entries.sort(function(a,b){ return (b.date||"").localeCompare(a.date||""); });
  if(entries.length===0){
    el.innerHTML='<div class="no-data">まだ訪問記録がありません。最初の道の駅をチェックしてみましょう！</div>';
    return;
  }
  var prefCounts={},visitCount=0,milestones=[];
  var sorted=entries.slice().sort(function(a,b){return (a.date||"").localeCompare(b.date||"");});
  sorted.forEach(function(e){
    visitCount++;
    if(!prefCounts[e.pref])prefCounts[e.pref]=0;
    prefCounts[e.pref]++;
    var prefTotal=MICHINOEKI_DATA.filter(function(st){return st.pref===e.pref;}).length;
    if(prefCounts[e.pref]===prefTotal) milestones.push({date:e.date,text:e.pref+" 制覇達成！"});
    [10,50,100,300,500,1000,1231].forEach(function(n){
      if(visitCount===n) milestones.push({date:e.date,text:n+"駅 達成！"});
    });
  });
  var msMap={};
  milestones.forEach(function(m){if(!msMap[m.date])msMap[m.date]=[];msMap[m.date].push(m);});
  var html="",lastMonth="";
  entries.forEach(function(e){
    var month=e.date?e.date.substring(0,7):"不明";
    if(month!==lastMonth){
      var label=e.date?(e.date.substring(0,4)+"年"+parseInt(e.date.substring(5,7))+"月"):"日付不明";
      html+='<div class="tl-month">'+label+'</div>';
      lastMonth=month;
    }
    if(msMap[e.date]){
      msMap[e.date].forEach(function(m){html+='<div class="tl-milestone">🏆 '+e.date+" "+m.text+'</div>';});
      delete msMap[e.date];
    }
    var photoHtml=e.photo?'<img class="tl-photo" src="'+e.photo+'" alt="">':'';
    var memoHtml=e.memo?'<div class="tl-memo">'+e.memo.substring(0,50)+(e.memo.length>50?"…":"")+'</div>':"";
    html+='<div class="tl-entry" data-id="'+e.id+'">'+
      '<div class="tl-dot"></div>'+
      '<div class="tl-content">'+
        '<div class="tl-header"><span class="tl-name">'+(PREF_EMOJI[e.pref]||"📍")+" "+e.name+'</span><span class="tl-date">'+(e.date||"")+'</span></div>'+
        '<div class="tl-pref">'+e.pref+'</div>'+
        photoHtml+memoHtml+
      '</div></div>';
  });
  el.innerHTML=html;
  el.querySelectorAll(".tl-entry").forEach(function(item){
    item.addEventListener("click",function(){
      var st=MICHINOEKI_DATA.find(function(ss){return ss.id===parseInt(item.dataset.id);});
      if(st)showStampReveal(st,true);
    });
  });
}

function getQuestStatus(q, s) {
  if (q.type === "visit") {
    return { cur: s.visited, max: q.target, done: s.visited >= q.target };
  } else if (q.type === "region") {
    var prefs = REGIONS[q.region] || [];
    var rTotal = 0, rVisited = 0;
    prefs.forEach(function(p) { var ps = s.prefStats[p]; if (ps) { rTotal += ps.total; rVisited += ps.visited; } });
    return { cur: rVisited, max: rTotal, done: rTotal > 0 && rVisited >= rTotal };
  } else if (q.type === "allpref") {
    var prefsWith1 = 0;
    Object.values(s.prefStats).forEach(function(p) { if (p.visited > 0) prefsWith1++; });
    return { cur: prefsWith1, max: q.target, done: prefsWith1 >= q.target };
  }
  return { cur: 0, max: 1, done: false };
}

function renderBadges(s){
  var c = document.getElementById("badge-list"); if (!c) return;
  c.innerHTML = "";
  QUESTS.forEach(function(q) {
    var st = getQuestStatus(q, s);
    var prog = st.max > 0 ? Math.min(st.cur / st.max, 1) : 0;
    var statusClass = st.done ? "quest-done" : (st.cur > 0 ? "quest-active" : "quest-locked");
    var icon = st.done ? "✅" : (st.cur > 0 ? "🔥" : "🔒");
    var card = document.createElement("div");
    card.className = "badge-card " + statusClass;
    var certBtn = "";
    if (st.done && typeof showCertificate === "function") {
      var certTitle = q.type === "region" ? q.region + " 制覇" : q.name + " 達成";
      certBtn = '<button class="cert-trigger-btn" data-cert-title="' + certTitle + '" data-cert-sub="' + q.reward + '" data-cert-count="' + st.cur + '">📜 証明書</button>';
    }
    card.innerHTML = '<div class="badge-emoji">' + icon + '</div>' +
      '<div class="badge-title">' + q.name + '</div>' +
      '<div class="badge-desc">' + q.desc + '</div>' +
      '<div class="quest-reward">' + (st.done ? '🏅 ' + q.reward : q.reward) + '</div>' +
      '<div class="badge-progress"><div class="badge-progress-fill" style="width:' + (prog * 100) + '%"></div></div>' +
      '<div class="badge-progress-text">' + Math.min(st.cur, st.max) + ' / ' + st.max + '</div>' +
      certBtn;
    c.appendChild(card);
  });
  c.querySelectorAll(".cert-trigger-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      showCertificate(btn.dataset.certTitle, btn.dataset.certSub, parseInt(btn.dataset.certCount));
    });
  });
}

// ===== プレミアム =====
function isPremium(){ return localStorage.getItem("michinoeki_premium")==="true"; }
function setPremium(v){ try { localStorage.setItem("michinoeki_premium", v?"true":"false"); } catch(e) {} }

// --- ホーム画面訴求: ツァイガルニク効果 + 保有効果 ---
function renderPremiumNudge(stats){
  const el=document.getElementById("home-premium-nudge");
  if(!el) return;
  if(isPremium()){ el.innerHTML=""; return; }

  const pct=stats.total?Math.round((stats.visited/stats.total)*10)/10:0;
  const filledCount=Object.values(stats.prefStats).filter(d=>d.visited>0).length;

  let personalMsg;
  if(stats.visited===0) personalMsg="旅の記録を地図に刻もう";
  else if(filledCount<=5) personalMsg=`${filledCount}県に足跡が。地図に色がつき始めます`;
  else if(stats.prefComplete>0) personalMsg=`${stats.prefComplete}県制覇！地図がゴールドに輝いています`;
  else personalMsg=`${filledCount}県を巡った軌跡を、地図で一望`;

  el.innerHTML=
    `<div class="premium-nudge" id="premium-nudge-card">` +
      `<div class="premium-nudge-top">` +
        `<div class="premium-nudge-map">🗾</div>` +
        `<div class="premium-nudge-text">` +
          `<div class="premium-nudge-title"><span class="crown">👑</span> 全国制覇マップ</div>` +
          `<div class="premium-nudge-sub">${personalMsg}</div>` +
        `</div>` +
      `</div>` +
      `<div class="premium-nudge-features">` +
        `<span class="premium-nudge-feat">🗾 都道府県の塗り分け</span>` +
        `<span class="premium-nudge-feat">📊 タップで詳細表示</span>` +
        `<span class="premium-nudge-feat">✨ 制覇県が輝く演出</span>` +
      `</div>` +
      `<button class="premium-nudge-cta">マップを解放する</button>` +
      `<div class="premium-nudge-social">旅好きユーザーに人気 No.1 の機能</div>` +
    `</div>`;
  document.getElementById("premium-nudge-card").addEventListener("click", showPaywall);
}

// --- もうすぐ制覇に地図ナッジ ---
function renderAlmostMapHint(){
  if(isPremium()) return;
  const el=document.getElementById("almost-section");
  if(!el || !el.innerHTML) return;
  if(el.querySelector(".almost-map-hint")) return;
  const hint=document.createElement("div");
  hint.className="almost-map-hint";
  hint.innerHTML="🗾 マップで残りの駅を確認 →";
  hint.addEventListener("click", showPaywall);
  el.appendChild(hint);
}

// --- 統計タブ訴求: 好奇心ギャップ ---
function renderStatsMapTeaser(stats){
  const el=document.getElementById("stats-premium-nudge");
  if(!el) return;
  if(isPremium()){ el.innerHTML=""; return; }

  const filledCount=Object.values(stats.prefStats).filter(d=>d.visited>0).length;

  el.innerHTML=
    `<div class="stats-map-teaser" id="stats-map-teaser-card">` +
      `<div class="stats-map-teaser-header">` +
        `<div class="stats-map-teaser-title">🗾 地方別マップ分析</div>` +
        `<span class="stats-map-teaser-badge">PRO</span>` +
      `</div>` +
      `<div class="stats-map-preview">` +
        `<div class="stats-map-blur">` +
          `<div class="stats-map-lock">🔒 プレミアムで解放</div>` +
        `</div>` +
      `</div>` +
      `<div class="stats-map-benefits">` +
        `<div class="stats-map-benefit"><span class="stats-map-benefit-icon">🎨</span> ${filledCount}県の訪問状況を色分け表示</div>` +
        `<div class="stats-map-benefit"><span class="stats-map-benefit-icon">🏆</span> 制覇した県がゴールドに輝く</div>` +
        `<div class="stats-map-benefit"><span class="stats-map-benefit-icon">📍</span> 県タップで未訪問の駅を一覧</div>` +
      `</div>` +
    `</div>`;
  document.getElementById("stats-map-teaser-card").addEventListener("click", showPaywall);
}

// --- チェックイン後トースト: ピークエンドの法則 ---
let _toastTimer=null;
function showPremiumToast(stationName, prefName){
  if(isPremium()) return;
  const el=document.getElementById("premium-toast");
  if(!el) return;

  const msgs=[
    `🗾 ${prefName}の地図が更新！ <span class="toast-gold">マップで確認 →</span>`,
    `✨ ${prefName}に新しい足跡！ <span class="toast-gold">地図を見る →</span>`,
    `🎯 ${prefName}の達成率UP！ <span class="toast-gold">マップで確認 →</span>`,
  ];
  el.innerHTML=msgs[Math.floor(Math.random()*msgs.length)];
  el.hidden=false;
  el.onclick=()=>{ el.hidden=true; showPaywall(); };

  if(_toastTimer) clearTimeout(_toastTimer);
  _toastTimer=setTimeout(()=>{ el.hidden=true; },5000);
}

function updatePremiumUI(){
  const gate=document.getElementById("map-premium-gate");
  const unlocked=document.getElementById("map-unlocked");
  const dot=document.getElementById("map-premium-dot");
  const navBadge=document.getElementById("nav-premium-badge");
  const banner=document.getElementById("premium-status-banner");
  const premium=isPremium();

  if(gate) gate.style.display=premium?"none":"";
  if(unlocked) unlocked.style.display=premium?"":"none";
  if(dot) dot.style.display=premium?"none":"";
  if(navBadge) navBadge.hidden=!premium;

  if(banner){
    if(premium){
      const s=calcStats();
      const filledCount=Object.values(s.prefStats).filter(d=>d.visited>0).length;
      banner.innerHTML=
        `<div class="premium-banner">` +
          `<div class="premium-banner-icon">👑</div>` +
          `<div class="premium-banner-text">` +
            `<div class="premium-banner-title">みちのわんマスター</div>` +
            `<div class="premium-banner-sub">全機能が解放されています</div>` +
          `</div>` +
          `<div class="premium-banner-stats">` +
            `<div class="premium-banner-stat">${filledCount}<span>県</span></div>` +
          `</div>` +
        `</div>`;
    } else {
      banner.innerHTML="";
    }
  }
}

function showPaywall(){ document.getElementById("paywall-modal").hidden=false; }

document.getElementById("premium-gate-cta").addEventListener("click", showPaywall);
document.getElementById("premium-gate-restore").addEventListener("click", showPaywall);

document.querySelectorAll(".price-option").forEach(o=>{
  o.addEventListener("click",()=>{
    document.querySelectorAll(".price-option").forEach(x=>x.classList.remove("selected"));
    o.classList.add("selected");
  });
});
document.getElementById("paywall-cta").addEventListener("click",()=>{
  document.getElementById("paywall-modal").hidden=true;
  handleStripeCheckout();
});

function handleStripeCheckout(){
  if(REVENUE_CONFIG.stripePaymentLink){
    window.location.href=REVENUE_CONFIG.stripePaymentLink;
  } else {
    alert("決済機能は現在準備中です。もうしばらくお待ちください。");
  }
}

function activatePremium(){
  setPremium(true);
  updatePremiumUI(); render();
  showPremiumCelebration();
}

// 決済後リダイレクト判定
(function checkPaymentReturn(){
  const params=new URLSearchParams(window.location.search);
  if(params.get("premium")==="activated"){
    setPremium(true);
    window.history.replaceState({}, "", window.location.pathname);
    setTimeout(()=>{ updatePremiumUI(); render(); showPremiumCelebration(); }, 500);
  }
})();

function showPremiumCelebration(){
  triggerConfetti(50);
  const overlay=document.createElement("div");
  overlay.className="premium-celebrate-overlay";
  overlay.innerHTML=
    `<div class="premium-celebrate">` +
      `<div class="premium-celebrate-crown">👑</div>` +
      `<div class="premium-celebrate-title">みちのわんマスター<br>へようこそ！</div>` +
      `<div class="premium-celebrate-features">` +
        `<div class="premium-celebrate-feat"><span>🗾</span> 全国制覇マップが解放されました</div>` +
        `<div class="premium-celebrate-feat"><span>📷</span> スタンプ写真が無制限に</div>` +
        `<div class="premium-celebrate-feat"><span>📝</span> 旅の日記 + 複数写真記録</div>` +
      `</div>` +
      `<button class="premium-celebrate-btn">マップを見に行く</button>` +
    `</div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(()=>overlay.classList.add("show"));

  const close=()=>{
    overlay.classList.remove("show");
    setTimeout(()=>{ if(overlay.parentNode) overlay.remove(); },400);
    switchTab("map");
  };
  overlay.querySelector(".premium-celebrate-btn").addEventListener("click",close);
  overlay.addEventListener("click",e=>{ if(e.target===overlay) close(); });
}
document.getElementById("paywall-skip").addEventListener("click",()=>{
  document.getElementById("paywall-modal").hidden=true;
});

// ===== タブ =====
function switchTab(tabName) {
  document.querySelectorAll(".btab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".pc-nav-item").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(x=>x.classList.remove("active"));
  var btab = document.querySelector('.btab[data-tab="'+tabName+'"]');
  var pcNav = document.querySelector('.pc-nav-item[data-tab="'+tabName+'"]');
  if(btab) btab.classList.add("active");
  if(pcNav) pcNav.classList.add("active");
  var tabEl = document.getElementById("tab-"+tabName);
  if(tabEl) tabEl.classList.add("active");
}
document.querySelectorAll(".btab").forEach(t=>{
  t.addEventListener("click",()=>{ switchTab(t.dataset.tab); });
});
document.querySelectorAll(".pc-nav-item").forEach(t=>{
  t.addEventListener("click",()=>{ switchTab(t.dataset.tab); });
});

// ===== PC サイドバー フッター更新 =====
function updatePCSidebar() {
  var levelEl = document.getElementById("pc-sidebar-level");
  var progEl = document.getElementById("pc-sidebar-progress");
  if(!levelEl || !progEl) return;
  var s = calcStats();
  var lv = getLevel(s.visited);
  var pct = s.total ? Math.round(s.visited/s.total*100) : 0;
  levelEl.textContent = lv.emoji + " " + lv.title;
  progEl.textContent = s.visited + "/" + s.total + "駅 (" + pct + "%) " + s.prefComplete + "県制覇";
}

// ===== 駅詳細 =====
let _detailStationId=null;
const detailModal=document.getElementById("station-detail-modal");
const detailHeader=document.getElementById("station-detail-header");
const detailBody=document.getElementById("station-detail-body");

function getStationFacilities(st){
  const cat=typeof STAMP_CATALOG!=="undefined"&&STAMP_CATALOG[st.id];
  const name=st.name+st.location;
  const hasDog=cat&&cat.dog_friendly_icon==="paw_large";
  const hasDogMaybe=cat&&cat.dog_friendly_icon==="paw";
  const hasOnsen=/温泉|湯|spa/i.test(name);
  const hasPark=/公園|パーク|広場|緑|花|森|自然|高原/.test(name);
  const hasRV=/RV|キャンプ|オート|車中泊/.test(name);
  const hasQuiet=/里|高原|湖|峠|山|森|海|浜/.test(name);
  const hasDogKW=/犬|ドッグ|ペット|わんこ/.test(name);

  let dogRun=hasDog?3:hasDogMaybe?2:hasDogKW?2:1;
  let toilet=hasPark||hasOnsen?4:hasDog?3:2+((st.id%3===0)?1:0);
  if(toilet>5)toilet=5;
  let vanlife=hasRV?5:hasQuiet&&hasPark?4:hasQuiet?3:hasPark?3:2;

  const dog={
    hasRun: hasDog||hasDogKW||(hasPark&&hasDogMaybe),
    runType: hasDog?"専用ドッグラン":(hasDogKW?"ペットエリア":(hasDogMaybe&&hasPark?"広場利用可":"なし/不明")),
    largeDog: hasDog||hasPark,
    separated: hasDog,
    size: hasDog?"広い":(hasPark?"普通":"狭い/不明"),
    certificate: hasDog?"狂犬病・混合ワクチン証明書":(hasDogMaybe?"狂犬病証明書推奨":"不要/不明"),
    certificateRequired: hasDog,
    fee: hasDog?(st.id%5===0?"有料（300〜500円程度）":"無料"):"—",
    leash: !hasDog,
    water: hasDog||hasDogMaybe||hasOnsen,
    shade: hasPark||hasQuiet,
    petFriendlyShop: hasOnsen||(st.id%4===0),
    notes: hasDog?"ドッグラン併設の道の駅":(hasDogMaybe?"ペット同伴散歩可能エリアあり":(hasPark?"敷地が広くお散歩しやすい":"リード着用でペット同伴可")),
    source: "estimated"
  };

  if(typeof DOGRUN_REAL!=="undefined"){
    const real=DOGRUN_REAL.find(r=>r.name===st.name&&r.pref===st.pref);
    if(real){
      dog.hasRun=real.hasRun; dog.runType=real.runType; dog.largeDog=real.largeDog;
      dog.separated=real.separated; dog.size=real.size; dog.certificate=real.certificate;
      dog.certificateRequired=real.certificateRequired; dog.fee=real.fee;
      dog.leash=!real.leashFree; dog.water=real.water; dog.shade=real.shade;
      if(real.notes) dog.notes=real.notes;
      dog.source="real";
      dogRun=real.hasRun?4:2;
    }
  }

  const userContrib=loadUserContrib(st.id);
  if(userContrib){
    Object.assign(dog,userContrib);
    dog.source="user";
    if(userContrib.dogRun) dogRun=userContrib.dogRun;
    if(userContrib.toilet) toilet=userContrib.toilet;
    if(userContrib.vanlife) vanlife=userContrib.vanlife;
  }

  return {dogRun,toilet:Math.min(toilet,5),vanlife:Math.min(vanlife,5),dog};
}

const USER_CONTRIB_KEY="michinoeki_user_contrib";
function loadUserContrib(stationId){
  try{ const d=JSON.parse(localStorage.getItem(USER_CONTRIB_KEY)||"{}"); return d[stationId]||null; }catch{ return null; }
}
function saveUserContrib(stationId, data){
  try{ const d=JSON.parse(localStorage.getItem(USER_CONTRIB_KEY)||"{}"); d[stationId]=data; localStorage.setItem(USER_CONTRIB_KEY,JSON.stringify(d)); }catch{}
}

function renderStars(n,max){
  let h="";
  for(let i=1;i<=max;i++) h+=i<=n?`<span class="star filled">★</span>`:`<span class="star empty">☆</span>`;
  return h;
}

function openStationDetail(stationId){
  const st=MICHINOEKI_DATA.find(s=>s.id===stationId);
  if(!st) return;
  const info=getVisitInfo(stationId);
  const visited=info&&info.visited;
  _detailStationId=stationId;

  const emoji=PREF_EMOJI[st.pref]||"📍";
  const visitBadge=visited?`<span class="sd-visit-badge visited">✅ 訪問済み</span>`:`<span class="sd-visit-badge unvisited">未訪問</span>`;
  detailHeader.innerHTML=
    `<div class="sd-emoji">${emoji}</div>`+
    `<div class="sd-info">`+
      `<div class="sd-name">${st.name}</div>`+
      `<div class="sd-meta">${st.pref} ${st.location}</div>`+
    `</div>`+
    `<div class="sd-date">${visited?"📅 "+(info.date||"—"):visitBadge}</div>`;

  const fac=getStationFacilities(st);

  let html="";

  const d=fac.dog;
  html+=`<div class="sd-section sd-facility-section">`;
  html+=`<div class="sd-section-title">🐕 わんこ情報</div>`;
  html+=`<div class="sd-dog-grid">`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">${d.hasRun?"✅":"❌"}</span><span class="sd-dog-key">ドッグラン</span><span class="sd-dog-val">${d.runType}</span></div>`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">${d.largeDog?"✅":"⚠️"}</span><span class="sd-dog-key">大型犬</span><span class="sd-dog-val">${d.largeDog?"OK":"要確認"}</span></div>`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">${d.separated?"✅":"—"}</span><span class="sd-dog-key">小型/大型 分離</span><span class="sd-dog-val">${d.separated?"分離あり":"分離なし/不明"}</span></div>`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">📐</span><span class="sd-dog-key">広さ</span><span class="sd-dog-val">${d.size}</span></div>`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">📄</span><span class="sd-dog-key">証明書</span><span class="sd-dog-val">${d.certificate}</span></div>`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">💰</span><span class="sd-dog-key">料金</span><span class="sd-dog-val">${d.fee}</span></div>`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">${d.leash?"🔗":"🐕‍🦺"}</span><span class="sd-dog-key">リード</span><span class="sd-dog-val">${d.leash?"リード必須":"ドッグラン内は自由"}</span></div>`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">${d.water?"💧":"—"}</span><span class="sd-dog-key">水飲み場</span><span class="sd-dog-val">${d.water?"あり":"不明"}</span></div>`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">${d.shade?"🌳":"—"}</span><span class="sd-dog-key">日陰・屋根</span><span class="sd-dog-val">${d.shade?"あり":"不明"}</span></div>`;
  html+=`<div class="sd-dog-row"><span class="sd-dog-icon">${d.petFriendlyShop?"🛒":"—"}</span><span class="sd-dog-key">ペット同伴ショップ</span><span class="sd-dog-val">${d.petFriendlyShop?"一部店舗OK":"不可/不明"}</span></div>`;
  html+=`</div>`;
  if(d.notes) html+=`<div class="sd-dog-notes">📝 ${d.notes}</div>`;
  const isReal=d.source==="real";
  if(!isReal){
    html+=`<div class="sd-estimated-banner">⚠️ この情報はAI推定です。実際と異なる場合があります</div>`;
  } else {
    html+=`<div class="sd-verified-banner">✅ 実地調査に基づく情報です</div>`;
  }
  html+=`<button class="sd-contribute-btn" id="sd-contribute-btn">📝 この駅の情報を投稿する</button>`;
  html+=`</div>`;

  html+=`<div class="sd-section sd-facility-section">`;
  html+=`<div class="sd-section-title">📋 施設評価</div>`;
  html+=`<div class="sd-facility-grid">`;
  html+=`<div class="sd-facility-item"><div class="sd-facility-label">🐕 犬連れおすすめ度</div><div class="sd-facility-stars">${renderStars(fac.dogRun,5)}</div></div>`;
  html+=`<div class="sd-facility-item"><div class="sd-facility-label">🚻 トイレ綺麗度</div><div class="sd-facility-stars">${renderStars(fac.toilet,5)}</div></div>`;
  html+=`<div class="sd-facility-item"><div class="sd-facility-label">🚐 車中泊おすすめ度</div><div class="sd-facility-stars">${renderStars(fac.vanlife,5)}</div></div>`;
  html+=`</div>`;
  html+=`</div>`;

  if(typeof EMERGENCY_VETS!=="undefined"&&EMERGENCY_VETS.length>0){
    const nearVets=EMERGENCY_VETS.filter(v=>v.pref===st.pref);
    if(nearVets.length>0){
      html+=`<div class="sd-section sd-vet-section">`;
      html+=`<div class="sd-section-title">🏥 ${st.pref}の緊急動物病院</div>`;
      nearVets.forEach(v=>{
        const typeLabel=v.type==="24h"?"24時間":(v.type==="night"?"夜間救急":"休日対応");
        const typeCls=v.type==="24h"?"vet-type-24h":(v.type==="night"?"vet-type-night":"vet-type-holiday");
        html+=`<div class="sd-vet-item">`;
        html+=`<div class="sd-vet-header"><span class="sd-vet-name">${v.name}</span><span class="vet-type-badge ${typeCls}">${typeLabel}</span></div>`;
        if(v.city) html+=`<div class="sd-vet-addr">📍 ${v.pref}${v.city}${v.address||""}</div>`;
        html+=`<div class="sd-vet-hours">🕐 ${v.hours||typeLabel}</div>`;
        if(v.notes) html+=`<div class="sd-vet-notes">${v.notes}</div>`;
        html+=`<div class="sd-vet-actions">`;
        if(v.tel) html+=`<a href="tel:${v.tel.replace(/[-ー−]/g,"")}" class="vet-call-btn">📞 ${v.tel}</a>`;
        if(v.url) html+=`<a href="${v.url}" target="_blank" rel="noopener" class="vet-site-btn">🔗 詳細</a>`;
        html+=`</div></div>`;
      });
      html+=`</div>`;
    }
  }

  if(st.url){
    html+=`<div class="sd-section">`;
    html+=`<div class="sd-section-title">🔗 公式サイト</div>`;
    html+=`<a href="${st.url}" target="_blank" rel="noopener" class="sd-url-link">${st.url.replace(/^https?:\/\//,"").slice(0,40)}… <span class="sd-url-arrow">↗</span></a>`;
    html+=`</div>`;
  }

  if(visited){
    const photos=(info.photos||[]);
    const allPhotos=info.photo?[info.photo,...photos]:[...photos];
    const premium=isPremium();
    const maxFree=1;

    html+=`<div class="sd-section">`;
    html+=`<div class="sd-section-title">📷 写真</div>`;
    html+=`<div class="sd-photos" id="sd-photos">`;
    allPhotos.forEach((p,i)=>{
      html+=`<img class="sd-photo-thumb" src="${p}" data-idx="${i}" alt="写真${i+1}">`;
    });
    if(premium || allPhotos.length < maxFree){
      html+=`<label class="sd-photo-add" id="sd-photo-add-btn"><span>+</span><span class="sd-photo-add-label">追加</span><input type="file" accept="image/*" capture="environment" id="sd-photo-input" hidden></label>`;
    } else {
      html+=`<div class="sd-photo-add locked" id="sd-photo-add-locked"><span>👑</span><span class="sd-photo-add-label">PRO</span></div>`;
    }
    html+=`</div></div>`;

    html+=buildAffiliateSection(st);

    html+=`<div class="sd-section">`;
    html+=`<div class="sd-section-title">📝 旅の日記</div>`;
    if(premium){
      html+=`<textarea class="sd-diary" id="sd-diary" placeholder="この道の駅の思い出を書いてみましょう…">${info.note||""}</textarea>`;
    } else {
      html+=`<div class="sd-diary-lock" id="sd-diary-lock">`;
      html+=`<div class="sd-diary-lock-icon">📝</div>`;
      html+=`<div class="sd-diary-lock-text">`;
      html+=`<div class="sd-diary-lock-title">旅の日記を記録</div>`;
      html+=`<div class="sd-diary-lock-sub">プレミアムで解放 →</div>`;
      html+=`</div></div>`;
    }
    html+=`</div>`;
  } else {
    html+=`<div class="sd-section sd-checkin-section">`;
    html+=`<button class="sd-checkin-btn" id="sd-quick-checkin">📷 この駅をチェックインする</button>`;
    html+=`</div>`;
  }

  detailBody.innerHTML=html;

  document.querySelectorAll(".sd-photo-thumb").forEach(img=>{
    img.addEventListener("click",()=>{
      const ov=document.createElement("div");
      ov.className="sd-photo-full-overlay";
      ov.innerHTML=`<img src="${img.src}">`;
      ov.addEventListener("click",()=>ov.remove());
      document.body.appendChild(ov);
    });
  });

  const photoInput=document.getElementById("sd-photo-input");
  if(photoInput){
    photoInput.addEventListener("change",e=>{
      const f=e.target.files[0]; if(!f) return;
      compressAndSavePhoto(_detailStationId, f, ()=>{
        openStationDetail(_detailStationId);
      });
    });
  }

  const lockedAdd=document.getElementById("sd-photo-add-locked");
  if(lockedAdd) lockedAdd.addEventListener("click", showPaywall);

  const diaryLock=document.getElementById("sd-diary-lock");
  if(diaryLock) diaryLock.addEventListener("click", showPaywall);

  const quickCheckin=document.getElementById("sd-quick-checkin");
  if(quickCheckin){
    quickCheckin.addEventListener("click",()=>{
      setVisited(stationId,true);
      render(); checkNewBadges(); checkCertificateTriggers();
      openStationDetail(stationId);
    });
  }

  const contribBtn=document.getElementById("sd-contribute-btn");
  if(contribBtn){
    contribBtn.addEventListener("click",()=>{
      openContribModal(stationId);
    });
  }

  detailModal.hidden=false;
}

function openContribModal(stationId){
  const st=MICHINOEKI_DATA.find(s=>s.id===stationId);
  if(!st) return;
  document.getElementById("contrib-station-name").textContent=`${PREF_EMOJI[st.pref]||""} ${st.pref} — ${st.name}`;
  const existing=loadUserContrib(stationId);
  if(existing){
    if(existing.runType) document.getElementById("contrib-dogrun").value=existing.runType;
    if(existing.largeDog!==undefined) document.getElementById("contrib-largedog").value=String(existing.largeDog);
    if(existing.separated!==undefined) document.getElementById("contrib-separated").value=String(existing.separated);
    if(existing.size) document.getElementById("contrib-size").value=existing.size;
    if(existing.certificate) document.getElementById("contrib-cert").value=existing.certificateRequired?"必要":"推奨";
    if(existing.fee) document.getElementById("contrib-fee").value=existing.fee==="無料"?"無料":"有料";
    if(existing.water!==undefined) document.getElementById("contrib-water").value=String(existing.water);
    if(existing.toilet) document.getElementById("contrib-toilet").value=String(existing.toilet);
    if(existing.vanlife) document.getElementById("contrib-vanlife").value=String(existing.vanlife);
    if(existing.userComment) document.getElementById("contrib-comment").value=existing.userComment;
  }
  document.getElementById("contrib-modal").hidden=false;
  document.getElementById("contrib-modal")._stationId=stationId;
}

document.getElementById("contrib-cancel").addEventListener("click",()=>{
  document.getElementById("contrib-modal").hidden=true;
});
document.getElementById("contrib-submit").addEventListener("click",()=>{
  const modal=document.getElementById("contrib-modal");
  const sid=modal._stationId;
  const data={};
  const run=document.getElementById("contrib-dogrun").value;
  if(run){ data.hasRun=run!=="なし"; data.runType=run; }
  const large=document.getElementById("contrib-largedog").value;
  if(large) data.largeDog=large==="true";
  const sep=document.getElementById("contrib-separated").value;
  if(sep) data.separated=sep==="true";
  const size=document.getElementById("contrib-size").value;
  if(size) data.size=size;
  const cert=document.getElementById("contrib-cert").value;
  if(cert){ data.certificateRequired=cert==="必要"; data.certificate=cert==="必要"?"狂犬病・混合ワクチン証明書":(cert==="推奨"?"狂犬病証明書推奨":"不要"); }
  const fee=document.getElementById("contrib-fee").value;
  if(fee) data.fee=fee;
  const water=document.getElementById("contrib-water").value;
  if(water) data.water=water==="true";
  const toilet=parseInt(document.getElementById("contrib-toilet").value);
  if(toilet) data.toilet=toilet;
  const vanlife=parseInt(document.getElementById("contrib-vanlife").value);
  if(vanlife) data.vanlife=vanlife;
  const comment=document.getElementById("contrib-comment").value.trim();
  if(comment) data.userComment=comment;
  data.updatedAt=new Date().toISOString().slice(0,10);
  saveUserContrib(sid, data);
  modal.hidden=true;
  openStationDetail(sid);
  alert("情報を投稿しました！ありがとうございます 🐾");
});

function addPhotoToStation(stationId, dataUrl){
  const m=loadManual();
  const entry=m[stationId];
  if(!entry) return;
  if(!entry.photo){
    entry.photo=dataUrl;
  } else {
    if(!entry.photos) entry.photos=[];
    entry.photos.push(dataUrl);
  }
  m[stationId]=entry;
  saveManual(m);
}

function saveStationDetail(){
  if(!_detailStationId) return;
  const m=loadManual();
  const entry=m[_detailStationId];
  if(!entry) return;
  const diaryEl=document.getElementById("sd-diary");
  if(diaryEl) entry.note=diaryEl.value;
  m[_detailStationId]=entry;
  saveManual(m);
  render();
}

document.getElementById("station-detail-save").addEventListener("click",()=>{
  saveStationDetail();
  detailModal.hidden=true;
});
document.getElementById("station-detail-close").addEventListener("click",()=>{
  saveStationDetail();
  detailModal.hidden=true;
});
detailModal.addEventListener("click",e=>{
  if(e.target===detailModal){ saveStationDetail(); detailModal.hidden=true; }
});

// ===== 検索・フィルター =====
let _searchTimer=null;
document.getElementById("search").addEventListener("input",function(){
  if(_searchTimer) clearTimeout(_searchTimer);
  _searchTimer=setTimeout(function(){ renderList(calcStats()); },200);
});
document.querySelectorAll(".filter-chip").forEach(chip=>{
  chip.addEventListener("click",()=>{
    document.querySelectorAll(".filter-chip").forEach(c=>c.classList.remove("active"));
    chip.classList.add("active");
    currentFilter=chip.dataset.filter;
    render();
  });
});

// ===== スタンプモーダル =====
const stampModal=document.getElementById("stamp-modal"),stampPhotoInput=document.getElementById("stamp-photo"),stampPreview=document.getElementById("stamp-preview"),stampSearch=document.getElementById("stamp-search"),stampResults=document.getElementById("stamp-results"),stampSelected=document.getElementById("stamp-selected"),stampConfirm=document.getElementById("stamp-confirm");
let stampPhotoData=null,stampSelectedId=null;
document.getElementById("open-stamp-btn").addEventListener("click",()=>{resetStampModal();stampModal.hidden=false;});
document.getElementById("stamp-cancel").addEventListener("click",()=>{stampModal.hidden=true;});
function resetStampModal(){stampPhotoData=null;stampSelectedId=null;stampPhotoInput.value="";stampPreview.hidden=true;stampSearch.value="";stampResults.innerHTML="";stampSelected.textContent="";stampConfirm.disabled=true;}
stampPhotoInput.addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const img=new Image(),r=new FileReader();r.onload=ev=>{img.onload=()=>{const mx=400,sc=Math.min(1,mx/img.width),cv=document.createElement("canvas");cv.width=img.width*sc;cv.height=img.height*sc;cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);stampPhotoData=cv.toDataURL("image/jpeg",0.7);stampPreview.src=stampPhotoData;stampPreview.hidden=false;};img.src=ev.target.result;};r.readAsDataURL(f);});
stampSearch.addEventListener("input",()=>{const t=stampSearch.value.trim();stampResults.innerHTML="";if(!t)return;MICHINOEKI_DATA.filter(s=>`${s.name} ${s.pref} ${s.location}`.includes(t)).slice(0,20).forEach(s=>{const d=document.createElement("div");d.textContent=`${PREF_EMOJI[s.pref]||""} ${s.pref} - ${s.name}（${s.location}）`;d.addEventListener("click",()=>{stampSelectedId=s.id;stampSelected.textContent=`選択中: ${s.pref} ${s.name}`;stampResults.innerHTML="";stampSearch.value=`${s.pref} ${s.name}`;stampConfirm.disabled=false;});stampResults.appendChild(d);});});
stampConfirm.addEventListener("click",()=>{if(stampSelectedId===null)return;const st=MICHINOEKI_DATA.find(s=>s.id===stampSelectedId);setVisited(stampSelectedId,true,stampPhotoData);stampModal.hidden=true;render();checkNewBadges();checkCertificateTriggers();if(st)showPremiumToast(st.name,st.pref);});

// ===== バックアップ =====
document.getElementById("export-btn").addEventListener("click",()=>{const d={manual:loadManual(),dismissed:loadDismissed(),settings:loadSettings(),exportedAt:new Date().toISOString()};const b=new Blob([JSON.stringify(d)],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`michinoeki_backup_${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(u);});
const importFile=document.getElementById("import-file");
document.getElementById("import-btn").addEventListener("click",()=>importFile.click());
importFile.addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(!d||typeof d!=="object"){alert("無効なバックアップファイルです。");return;}if(d.manual&&typeof d.manual!=="object"){alert("バックアップデータの形式が不正です。");return;}if(d.manual)saveManual(d.manual);if(d.dismissed)saveDismissed(d.dismissed);if(d.settings)saveSettings(d.settings);render();alert("バックアップを読み込みました！");}catch{alert("読み込みに失敗しました。ファイルの形式を確認してください。");}};r.readAsText(f);importFile.value="";});

// ===== 音声 =====
const voiceModal=document.getElementById("voice-modal"),voiceStatus=document.getElementById("voice-status"),voiceRecognized=document.getElementById("voice-recognized"),voiceMatches=document.getElementById("voice-matches"),voiceDoneMsg=document.getElementById("voice-done-msg"),voiceMicBtn=document.getElementById("voice-mic");
let recognition=null,isListening=false;
function initSR(){const S=window.SpeechRecognition||window.webkitSpeechRecognition;if(!S)return null;const r=new S();r.lang="ja-JP";r.continuous=false;r.interimResults=true;r.maxAlternatives=3;return r;}
function norm(s){return s.replace(/[\s　]+/g,"").replace(/[ぁ-ん]/g,c=>String.fromCharCode(c.charCodeAt(0)+0x60)).toLowerCase();}
function score(a,b){const x=norm(a),y=norm(b);if(x===y)return 100;if(y.includes(x)||x.includes(y))return 80;const sh=x.length<y.length?x:y,lo=x.length<y.length?y:x;let m=0,p=0;for(const c of sh){const i=lo.indexOf(c,p);if(i!==-1){m++;p=i+1;}}return Math.round((m/lo.length)*70);}
function findM(t){if(!t.trim())return[];return MICHINOEKI_DATA.map(s=>({station:s,score:Math.max(score(t,s.name),score(t,s.pref+s.name))})).sort((a,b)=>b.score-a.score).filter(r=>r.score>=30).slice(0,8);}
function showM(ms){voiceMatches.innerHTML="";ms.forEach(m=>{const i=getVisitInfo(m.station.id),d=!!(i&&i.visited),it=document.createElement("div");it.className="voice-match-item"+(d?" checked":"");it.innerHTML=`<span class="voice-match-name">${m.station.name}</span><span class="voice-match-pref">${m.station.pref}</span><span class="voice-match-score">${d?"✅ 済":"タップでチェック"}</span>`;if(!d){it.addEventListener("click",()=>{setVisited(m.station.id,true);it.classList.add("checked");it.querySelector(".voice-match-score").textContent="✅ 済";voiceDoneMsg.textContent=`✅ ${m.station.pref} ${m.station.name} をチェック！`;voiceDoneMsg.hidden=false;setTimeout(()=>voiceDoneMsg.hidden=true,3000);render();checkNewBadges();checkCertificateTriggers();showPremiumToast(m.station.name,m.station.pref);});}voiceMatches.appendChild(it);});}
function startL(){if(!recognition){recognition=initSR();if(!recognition){voiceStatus.textContent="音声認識に対応していません（Chrome推奨）";return;}}recognition.onresult=e=>{let im="",fi="";for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)fi+=t;else im+=t;}const d=fi||im;voiceRecognized.textContent=`「${d}」`;showM(findM(d));};recognition.onend=()=>{isListening=false;voiceMicBtn.textContent="🎤 聴き取り開始";voiceMicBtn.classList.remove("recording");voiceStatus.textContent="もう一度マイクボタンを押してください";voiceStatus.classList.remove("listening");};recognition.onerror=e=>{isListening=false;voiceMicBtn.textContent="🎤 聴き取り開始";voiceMicBtn.classList.remove("recording");voiceStatus.classList.remove("listening");voiceStatus.textContent=e.error==="not-allowed"?"マイクが許可されていません":e.error==="no-speech"?"音声が検出されませんでした":"エラーが発生しました";};recognition.start();isListening=true;voiceMicBtn.textContent="⏹ 聴き取り中...";voiceMicBtn.classList.add("recording");voiceStatus.textContent="🔴 聴いています...道の駅名を読み上げてください";voiceStatus.classList.add("listening");voiceDoneMsg.hidden=true;}
document.getElementById("voice-btn").addEventListener("click",()=>{voiceRecognized.textContent="";voiceMatches.innerHTML="";voiceDoneMsg.hidden=true;voiceStatus.textContent="マイクボタンを押してください";voiceStatus.classList.remove("listening");voiceMicBtn.textContent="🎤 聴き取り開始";voiceMicBtn.classList.remove("recording");voiceModal.hidden=false;});
voiceMicBtn.addEventListener("click",()=>{if(isListening){recognition.stop();isListening=false;}else startL();});
document.getElementById("voice-close").addEventListener("click",()=>{if(recognition)recognition.stop();isListening=false;voiceModal.hidden=true;});

// ===== シェア =====
document.getElementById("share-btn").addEventListener("click",()=>{const s=calcStats(),pct=s.total?Math.round((s.visited/s.total)*10)/10:0,lv=getLevel(s.visited);document.getElementById("share-card").innerHTML=`<h3>${lv.emoji} ${lv.title}</h3><div class="share-number">${s.visited} / ${s.total}</div><div class="share-detail">訪問達成率 ${pct}% ｜ ${s.prefComplete}県制覇</div><div class="share-app">みちのわん</div>`;document.getElementById("share-modal").hidden=false;});
document.getElementById("share-copy").addEventListener("click",()=>{const s=calcStats(),pct=s.total?Math.round((s.visited/s.total)*10)/10:0,lv=getLevel(s.visited);navigator.clipboard.writeText(`${lv.emoji} ${lv.title}\n🚗 みちのわん\n${s.visited}/${s.total}駅（${pct}%）\n${s.prefComplete}県制覇！\n#みちのわん #犬と車中泊 #道の駅巡り #愛犬旅`).then(()=>alert("コピーしました！SNSに貼り付けてシェア！")).catch(()=>alert("コピーに失敗しました"));});
document.getElementById("share-close").addEventListener("click",()=>{document.getElementById("share-modal").hidden=true;});

// ===== マップポップアップ =====
document.getElementById("map-popup-close").addEventListener("click",()=>{document.getElementById("map-popup").hidden=true;});
document.getElementById("map-popup").addEventListener("click",e=>{if(e.target.id==="map-popup")document.getElementById("map-popup").hidden=true;});

// ===== PWA =====
// Service Workerの登録はindex.htmlのheadで実施済み


// ===== 制覇証明書 =====
const CERT_MILESTONES = [10,50,100,300,500,1000,1231];

function generateCertificate(title, subtitle, count, dateStr) {
  var cv = document.getElementById("cert-canvas");
  if (!cv) return null;
  var ctx = cv.getContext("2d");
  var w = cv.width, h = cv.height;

  // Background
  ctx.fillStyle = "#0F3D28";
  ctx.fillRect(0, 0, w, h);

  // Gold double border
  ctx.strokeStyle = "#E8B84B";
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  // Corner ornaments
  var cs = 18;
  [[36, 36], [w - 36, 36], [36, h - 36], [w - 36, h - 36]].forEach(function(p) {
    ctx.beginPath();
    ctx.arc(p[0], p[1], cs / 2, 0, Math.PI * 2);
    ctx.strokeStyle = "#E8B84B";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // "制覇証明書" header
  ctx.fillStyle = "#E8B84B";
  ctx.font = "bold 22px 'Noto Sans JP','Yu Gothic',sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("制 覇 証 明 書", w / 2, 80);

  // Decorative line under header
  ctx.beginPath();
  ctx.moveTo(w / 2 - 100, 92);
  ctx.lineTo(w / 2 + 100, 92);
  ctx.strokeStyle = "#E8B84B";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Main title
  ctx.fillStyle = "#FFFFFF";
  var fs = title.length <= 8 ? 52 : title.length <= 12 ? 42 : 34;
  ctx.font = "bold " + fs + "px 'Noto Sans JP','Yu Mincho','Yu Gothic',serif";
  ctx.fillText(title, w / 2, h / 2 - 10);

  // Subtitle line
  ctx.fillStyle = "#E8B84B";
  ctx.font = "400 18px 'Noto Sans JP','Yu Gothic',sans-serif";
  ctx.fillText(subtitle, w / 2, h / 2 + 30);

  // Stats line
  var lv = getLevel(calcStats().visited);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "400 15px 'Noto Sans JP','Yu Gothic',sans-serif";
  ctx.fillText("達成日: " + dateStr + " ｜ 訪問: " + count + "駅 ｜ " + lv.emoji + " " + lv.title, w / 2, h / 2 + 65);

  // Logo bottom-right
  ctx.fillStyle = "rgba(232,184,75,0.6)";
  ctx.font = "bold 14px 'Noto Sans JP','Yu Gothic',sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("みちのわん", w - 40, h - 40);

  ctx.textAlign = "left";
  return cv.toDataURL("image/png");
}

function showCertificate(title, subtitle, count) {
  var dateStr = new Date().toLocaleDateString("ja-JP");
  var dataUrl = generateCertificate(title, subtitle, count, dateStr);
  if (!dataUrl) return;
  document.getElementById("cert-modal").hidden = false;
}

document.getElementById("cert-close").addEventListener("click", function() {
  document.getElementById("cert-modal").hidden = true;
});

document.getElementById("cert-share").addEventListener("click", function() {
  var cv = document.getElementById("cert-canvas");
  cv.toBlob(function(blob) {
    if (navigator.share && navigator.canShare) {
      var file = new File([blob], "michinowan_certificate.png", { type: "image/png" });
      var shareData = { files: [file], title: "みちのわん 制覇証明書", text: "#みちのわん #犬と車中泊 #道の駅 #全国制覇" };
      if (navigator.canShare(shareData)) {
        navigator.share(shareData).catch(function() {});
        return;
      }
    }
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "michinowan_certificate.png";
    a.click();
    URL.revokeObjectURL(a.href);
  }, "image/png");
});

function checkCertificateTriggers() {
  var s = calcStats();
  var earned = JSON.parse(localStorage.getItem("tabique_certs") || "[]");
  var newCerts = [];

  // Milestone certificates
  CERT_MILESTONES.forEach(function(m) {
    var key = "milestone_" + m;
    if (s.visited >= m && earned.indexOf(key) === -1) {
      var title = m === 1231 ? "全国制覇" : "全国" + m + "駅 達成";
      var sub = m === 1231 ? "全1231駅すべての道の駅を制覇！" : "道の駅" + m + "駅の訪問を達成しました";
      newCerts.push({ key: key, title: title, sub: sub, count: s.visited });
    }
  });

  // Prefecture certificates
  Object.entries(s.prefStats).forEach(function(entry) {
    var pref = entry[0], d = entry[1];
    var key = "pref_" + pref;
    if (d.visited >= d.total && d.total > 0 && earned.indexOf(key) === -1) {
      newCerts.push({ key: key, title: pref + " 制覇", sub: pref + "の全" + d.total + "駅を訪問達成！", count: d.visited });
    }
  });

  // Region certificates
  Object.entries(REGIONS).forEach(function(entry) {
    var region = entry[0], prefs = entry[1];
    var key = "region_" + region;
    if (earned.indexOf(key) !== -1) return;
    var allDone = prefs.every(function(p) {
      var pd = s.prefStats[p];
      return pd && pd.visited >= pd.total && pd.total > 0;
    });
    if (allDone) {
      var totalStations = 0;
      prefs.forEach(function(p) { totalStations += s.prefStats[p].total; });
      newCerts.push({ key: key, title: region + " 制覇", sub: region + "地方の全" + totalStations + "駅を制覇！", count: totalStations });
    }
  });

  if (newCerts.length > 0) {
    var c = newCerts[0];
    earned.push(c.key);
    try { localStorage.setItem("tabique_certs", JSON.stringify(earned)); } catch(e) {}
    setTimeout(function() { showCertificate(c.title, c.sub, c.count); }, 1200);
  }
}

// ===== 初期化 =====
_prevCount=calcStats().visited;
_prevLevelIdx=LEVELS.indexOf(getLevel(_prevCount));
initBadges();
initCompletedPrefs();
updatePremiumUI();
render();
