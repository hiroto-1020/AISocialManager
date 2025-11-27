import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-3xl">
                <Link href="/" className="mb-8 inline-block text-cyan-400 hover:underline">
                    ← ホームに戻る
                </Link>
                <h1 className="mb-8 text-3xl font-bold">プライバシーポリシー</h1>
                <div className="space-y-6 text-gray-300">
                    <p>AISocialManager（以下，「当サービス」といいます。）は，本ウェブサイト上で提供するサービス（以下，「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。</p>

                    <h2 className="text-xl font-bold text-white">第1条（個人情報）</h2>
                    <p>「個人情報」とは，個人情報保護法にいう「個人情報」を指すものとし，生存する個人に関する情報であって，当該情報に含まれる氏名，生年月日，住所，電話番号，連絡先その他の記述等により特定の個人を識別できる情報を指します。</p>

                    <h2 className="text-xl font-bold text-white">第2条（個人情報の収集方法）</h2>
                    <p>当サービスは，ユーザーが利用登録をする際に氏名，メールアドレスなどの個人情報をお尋ねすることがあります。</p>

                    <h2 className="text-xl font-bold text-white">第3条（個人情報を収集・利用する目的）</h2>
                    <p>当サービスが個人情報を収集・利用する目的は，以下のとおりです。</p>
                    <ul className="list-disc pl-6">
                        <li>当サービスの提供・運営のため</li>
                        <li>ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）</li>
                        <li>ユーザーが利用中のサービスの新機能，更新情報，キャンペーン等及び当サービスが提供する他のサービスの案内のメールを送付するため</li>
                        <li>メンテナンス，重要なお知らせなど必要に応じたご連絡のため</li>
                        <li>利用規約に違反したユーザーや，不正・不当な目的でサービスを利用しようとするユーザーの特定をし，ご利用をお断りするため</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white">第4条（利用目的の変更）</h2>
                    <p>当サービスは，利用目的が変更前と関連性を有すると合理的に認められる場合に限り，個人情報の利用目的を変更するものとします。</p>

                    <h2 className="text-xl font-bold text-white">第5条（個人情報の第三者提供）</h2>
                    <p>当サービスは，次に掲げる場合を除いて，あらかじめユーザーの同意を得ることなく，第三者に個人情報を提供することはありません。ただし，個人情報保護法その他の法令で認められる場合を除きます。</p>

                    <h2 className="text-xl font-bold text-white">第6条（お問い合わせ窓口）</h2>
                    <p>本ポリシーに関するお問い合わせは，下記の窓口までお願いいたします。</p>
                    <p>運営者：AISocialManager運営事務局</p>

                    <p className="mt-8 text-sm text-gray-500">以上</p>
                </div>
            </div>
        </div>
    );
}
