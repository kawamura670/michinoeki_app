# Google Playポリシー + データ出典 - 管理部レポート

**調査日**: 2026年6月25日
**対象**: みちのわん（PWA/TWAアプリ）
**調査方法**: Google Play公式ポリシー、国土交通省公式サイト、関連法令のWeb調査

---

## A. Google Play課金ポリシー

### 調査結果

#### 1. TWAアプリでのStripe直接決済は許可されるか？

**原則: デジタルコンテンツの販売にはGoogle Play Billing APIが必要。**

Google Playの公式ポリシー（[Understanding Google Play's Payments policy](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en)）によると、以下のデジタルコンテンツにはGoogle Play Billingの使用が義務付けられている:

- デジタルアイテム（仮想通貨、追加コンテンツ等）
- サブスクリプション（フィットネス、ゲーム等）
- **アプリ機能のアンロック（広告除去、プレミアム機能）** ← みちのわんはこれに該当

さらに、PWA/TWAに特化した公式ドキュメント（[Implement Play Billing in your PWA](https://developers.google.com/chromeos/app-development/publish/pwa-play-billing)）には明確に:

> 「PWAがGoogle Playに掲載され、アプリ内商品やサブスクリプションを販売して収益化する場合、Digital Goods APIとPayment Request APIを通じてPlay Billingを実装することがPlayポリシー上必要」

と記載されている。

#### 2. 2025-2026年のTWA課金ポリシーの最新動向

**重要な変化が3つ発生している:**

**(a) Epic Games対Google裁判の判決と和解（2025年10月〜2026年3月）**
- 2025年10月29日: Google Playが米国でサードパーティ決済を許可する判決に準拠開始
- 2026年3月4日: Epic Gamesとの和解により、より柔軟な課金オプションが導入
- ただし: **代替決済に対してGoogleは9〜20%のサービス料を課す方針**

**(b) 日本のスマートフォン競争促進法（スマホ新法）**
- 2025年12月18日に施行
- Apple/Googleに対し、サードパーティ決済の許可を義務化
- **Google Playの「Billing Choice Program」は2026年12月31日に日本で展開予定**
- 現時点では日本向けには「External Payments Program」が利用可能

**(c) Billing Library要件**
- 2026年8月31日までにBilling Library v8以降の使用が必須（延長申請で11月1日まで）

#### 3. PWA/TWAアプリでのデジタルコンテンツ販売のベストプラクティス

Google公式が推奨する方式:
1. **Digital Goods API** + **Payment Request API** を使用してPlay Billingを実装
2. サンプルコード: [chromeos/pwa-play-billing (GitHub)](https://github.com/chromeos/pwa-play-billing)
3. TWAでラップしたPWA内でこれらのAPIを呼び出すことで、Google Playの課金基盤を利用可能

#### 4. 現在のみちのわんの実装状況

`app.js`を確認したところ:
- **Stripe Payment Linkによる外部遷移方式**を採用（L3-5, L1459-1465）
- `window.location.href` でStripeの決済ページに飛ばす実装
- 決済完了後に `?premium=activated` パラメータで戻ってきてプレミアムをアクティベート（L1474-1478）
- **これはGoogle Play上ではポリシー違反のリスクがある**

### 結論と推奨

| 項目 | 判断 |
|------|------|
| Stripe直接決済でOKか？ | **現時点ではNG（高リスク）** |
| Google Play Billing APIが必要か？ | **はい、デジタルコンテンツ（プレミアム機能解放）の場合は必要** |

**推奨対応:**

1. **短期（リリース前）**: Google Play申請時にStripe決済のままだとリジェクトされる可能性が高い。以下のいずれかを選択:
   - **(A) Play Billing APIを実装**: Digital Goods API + Payment Request APIでPlay Billingに対応。Googleに15%（初年度）の手数料を支払う
   - **(B) ウェブ版とアプリ版で課金を分離**: TWAアプリ版ではプレミアム機能を無料解放するか、Play Billing経由のみで販売。ウェブ版（ブラウザ直接アクセス）ではStripe決済を維持
   - **(C) 日本のBilling Choice Program（2026年12月31日〜）を待つ**: ただしサービス料（推定11〜26%）は発生する

2. **中期**: 日本のスマホ新法により代替決済が正式に許可される2026年12月以降に、Stripe決済への切り替えを検討。ただしGoogleへのサービス料支払いは依然必要。

3. **物理商品・サービスの例外**: Google Playポリシーでは物理商品やフィジカルサービスの決済はPlay Billing**不要**。みちのわんのプレミアム機能（地図表示、日記機能等）はデジタルコンテンツに該当するため、この例外は適用されない。

> **弁護士確認推奨**: TWA＋Stripe決済の組み合わせが具体的にどの程度のリジェクトリスクになるかは、Google Playの審査基準の解釈に依存する。リリース前に専門家への相談を推奨。

---

## B. 国土交通省データ利用条件

### 調査結果

#### 1. 国土数値情報「道の駅データ」（P35）の利用条件

**[国土数値情報 道の駅データページ](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P35.html)を直接確認した結果:**

- **利用許諾条件: 「非商用」**
- 最新版: 2018年度（平成30年度）版、基準日2019年1月1日時点
- 提供形式: GML形式、シェープファイル形式

**非商用データの制約（[FAQ](https://nlftp.mlit.go.jp/ksj/other/faq.html)より）:**
- 販売される書籍・ソフトウェアに同梱して販売することは**不可**
- 不特定の相手への販売を予定した製品への使用は**商用利用に該当し、不可**
- 学術目的、行政目的、企業内部検討での利用は可能

#### 2. 国土交通省ウェブサイトのコンテンツ利用規約

**[国土交通省 リンク・著作権・免責事項](https://www.mlit.go.jp/link.html):**

- **公共データ利用規約（PDL1.0）**に準拠
- 出典を記載すれば利用可能（商用利用の明示的禁止はなし）
- 「道の駅一覧」ページ（https://www.mlit.go.jp/road/Michi-no-Eki/list.html）の情報は、国土数値情報ダウンロードサイトとは**別管理**

#### 3. 出典表示の要件

公式の出典記載例（[利用規約ページ](https://nlftp.mlit.go.jp/ksj/other/agreement.html)より）:

- 基本: `出典：国土交通省国土数値情報ダウンロードサイト（当該ページのURL）`
- 加工時: `「国土数値情報（道の駅データ）」（国土交通省）（URL）をもとに○○作成`
- **禁止**: 加工した情報を、あたかも国が作成したかのような態様で公表・利用すること

### 必要な対応

**みちのわんの道の駅データの出典を明確にする必要がある。2つのシナリオ:**

**シナリオ1: 国土数値情報（P35）を直接利用している場合**
- **問題あり**: P35は「非商用」指定。アプリ内課金（プレミアム機能）がある以上、商用利用と見なされる可能性が高い
- **対策**: 
  - 国土交通省に商用利用の個別許可を申請する
  - または、国土交通省道路局の「道の駅一覧」ウェブページ（PDL1.0準拠）から情報を取得し直す

**シナリオ2: 国土交通省の公式ウェブサイト「道の駅一覧」から情報を取得している場合**
- **PDL1.0準拠で商用利用可能**
- 出典表示を正確に行えば問題なし

**いずれの場合も、現在のindex.htmlの出典表示（L517）を以下のように修正推奨:**

現在:
```
道の駅データ: 国土交通省「道の駅一覧」に基づき作成
```

修正案:
```
道の駅データ: 「道の駅案内」（国土交通省道路局）（https://www.mlit.go.jp/road/Michi-no-Eki/list.html）の情報をもとに作成
```

---

## C. 緊急動物病院データのリスク

### 調査結果

#### 1. 第三者の営業情報をアプリに掲載する法的リスク

**著作権法の観点:**
- 動物病院の名称、住所、電話番号、営業時間は**事実情報**であり、著作物には該当しない
- したがって、これらの情報を掲載すること自体は著作権侵害にならない
- ただし、他サイトのデータベースをそのままコピーした場合は、**データベースの著作権**（編集著作物）の侵害となる可能性がある

**獣医療広告規制の観点:**
- [農林水産省の獣医療広告ガイドライン](https://www.maff.go.jp/j/syouan/tikusui/zyui/koukoku.html)によると、動物病院の名称・住所・電話番号・診療時間・休診日等の基本情報は**広告掲載可能な事項**
- ただし、「広告」に該当するかは「誘引性」「特定性」「認知性」の3要件で判断される
- みちのわんの緊急検索機能は情報提供目的であり、特定の病院への誘引を目的としていないため、広告規制上のリスクは低い

**正確性の責任:**
- 営業時間・対応状況が変更された場合、古い情報に基づいてユーザーが行動し不利益を被るリスクがある
- **免責表示が最も重要な防御策**

#### 2. 掲載許可の要否

- **法的には個別許可は不要**（事実情報の掲示は著作権侵害に該当しない）
- ただし、**ベストプラクティスとしては主要な病院に掲載通知を送る**ことを推奨
- 特に24時間対応施設は患者殺到のリスクがあるため、事前連絡が望ましい

#### 3. 現在の免責表示の評価

`app.js` L882の現在の免責文言:
```
掲載情報は参考情報です。営業時間・対応状況は変更される場合があります。必ず事前にお電話でご確認ください。
```

`index.html` L522の免責文言:
```
掲載情報は定期的に更新していますが、最新の情報と異なる場合があります。特に緊急動物病院の営業時間・対応状況は必ず事前にお電話で確認してください。
```

**評価: 基本的な免責は入っているが、以下を追加推奨:**

### 必要な対応

1. **免責表示の強化** - 以下の文言を追加推奨:
```
本アプリは情報提供を目的としており、掲載する動物病院との提携・推薦関係はありません。
掲載情報の正確性について保証するものではなく、情報に基づく行動により生じた損害について
当アプリは一切の責任を負いません。緊急時は必ず直接お電話でご確認ください。
```

2. **データの定期更新体制の構築** - emergency_vets.jsonのデータ（42件）を少なくとも半年に1回は確認・更新する体制を作る

3. **掲載通知の検討** - 法的義務ではないが、信頼性向上のため主要施設への通知を推奨

---

## D. ドッグラン情報の出典

### 調査結果

#### 1. dogrun_stations.json（34駅）のデータ分析

ファイルを確認した結果:
- **34駅**のドッグラン併設情報（JSONファイルでは34件、index.htmlでは41駅と記載 -- 差異あり）
- 含まれる情報: 道の駅名、都道府県、ドッグランの種類、大型犬可否、分離の有無、広さ、料金、リードフリー可否、水場・日陰の有無、備考
- **備考の記載が非常に具体的**（例:「約2400平方メートル」「オホーツク海沿いの絶景ロケーション」等）

#### 2. データの由来の推定

以下の特徴から、**各道の駅の公式サイト・口コミサイト・ブログ記事等を人手（またはAI）で調査して作成したデータ**と推定:

- 公式統計データベースには存在しないフィールド（「size」「shade」「water」等）が含まれる
- 具体的な面積や利用条件が記載されており、一次情報源は各施設の公式情報と推測
- `certificate`フィールドがほぼ全件「不明」 → 網羅的な公式データソースではなく、個別調査の結果
- `app.js`のL1576では `source: "estimated"` というフラグがあり、AI推定データと実データの区別がコード上で行われている

#### 3. index.htmlの出典表示との整合性

index.html L518:
```
ドッグラン併設情報: 各道の駅の公式情報に基づき作成（41駅）
```
- 実際のJSONファイルは34件 → **件数の不一致を修正する必要あり**

### 必要な対応

1. **件数の修正**: index.htmlの「41駅」を実際の件数に合わせる（34駅 or dogrun_stations.jsの件数を再確認）
2. **出典表示の明確化**: 「各道の駅の公式サイト・公式情報に基づき独自に調査・作成」と明記
3. **AI推定データの明示**: app.jsでは既に `source: "estimated"` / `source: "real"` の区別があり、UIにも「この情報はAI推定です」バナーが表示される実装がある（L1657）。これは適切な対応
4. **定期的なデータ更新**: 各施設の情報は変更される可能性があるため、更新日を明示する

---

## リスクマトリクス

| リスク | 影響度 | 発生可能性 | 対策 | 状態 |
|--------|--------|------------|------|------|
| Google PlayでStripe決済によるリジェクト | **高** | **高** | Play Billing API実装、またはウェブ版と課金分離 | 未対応（要対応） |
| 国土数値情報P35の非商用制限違反 | **中** | **中** | 道路局公式サイトからのデータ取得に切替え＋出典修正 | 出典表示あり（修正必要） |
| 緊急動物病院の情報不正確による苦情 | **中** | **中** | 免責表示強化＋定期更新体制 | 基本的免責あり（強化推奨） |
| ドッグランデータの件数不一致 | **低** | **高** | index.htmlの件数修正 | 要修正 |
| 動物病院掲載に関する施設からの抗議 | **低** | **低** | 掲載通知＋削除対応フロー整備 | 未対応（推奨） |
| 日本スマホ新法への未対応 | **低** | **低** | 2026年12月以降の代替決済対応を計画 | 経過観察 |

---

## 総合的な推奨アクションリスト

### 優先度: 高（リリース前に必須）
1. Google Play課金方式の決定（Play Billing実装 or ウェブ版課金分離）
2. 道の駅データの出典を正確に記載（PDL1.0準拠の表記に修正）

### 優先度: 中（リリース前に推奨）
3. 緊急動物病院の免責表示を強化
4. ドッグラン情報の件数不一致を修正
5. 利用規約・プライバシーポリシーにデータ出典セクションを追加

### 優先度: 低（リリース後に対応可）
6. 主要動物病院への掲載通知
7. データ更新体制の構築（半年ごとの確認）
8. 日本の代替決済制度（2026年12月〜）への対応計画策定

---

## Sources

- [Understanding Google Play's Payments policy](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en)
- [Implement Play Billing in your PWA (Google for Developers)](https://developers.google.com/chromeos/app-development/publish/pwa-play-billing)
- [Google Play Policy Update 2026: Epic Settlement](https://www.coda.co/blog/epic-v-google-policy-update-2026/)
- [An update regarding Google Play's policies for US developers](https://support.google.com/googleplay/android-developer/answer/15582165?hl=en)
- [Can You Use Stripe for In-App Purchases in 2026? (Adapty)](https://adapty.io/blog/can-you-use-stripe-for-in-app-purchases/)
- [Japan Opens App Store and Google Play to Alternative Payments](https://respawn.outlookindia.com/pop-culture/pop-culture-news/japan-opens-app-store-and-google-play-to-alternative-payments)
- [Japan's Smartphone Act (Lexology)](https://www.lexology.com/library/detail.aspx?g=7817d634-4f13-4548-a82d-094796e57ca3)
- [国土数値情報 利用規約](https://nlftp.mlit.go.jp/ksj/other/agreement.html)
- [国土数値情報 道の駅データ](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-P35.html)
- [国土数値情報 FAQ](https://nlftp.mlit.go.jp/ksj/other/faq.html)
- [国土交通省 リンク・著作権・免責事項](https://www.mlit.go.jp/link.html)
- [Changes to Google Play Store Rules (Stripe)](https://support.stripe.com/questions/changes-to-google-play-store-rules)
- [獣医療広告制限見直し（農林水産省）](https://www.maff.go.jp/j/syouan/tikusui/zyui/koukoku.html)
- [PWA Play Billing Sample (GitHub)](https://github.com/chromeos/pwa-play-billing)
- [Google Play Service Fee 2026 (PricePush)](https://pricepush.app/blog/google-play-subscription-fees-2026-real-math)

---

> **免責事項**: 本レポートはAIによるWeb調査に基づく分析であり、法的助言ではありません。Google Playポリシーの解釈やデータ利用条件の最終判断には、IT法務に詳しい弁護士への確認を推奨します。特にGoogle Play課金ポリシーに関しては、審査基準が変更される可能性があるため、申請前に最新情報を確認してください。

**調査実施**: AIエージェント部署 管理部
**レポート作成日**: 2026年6月25日
