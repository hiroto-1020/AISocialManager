import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-3xl">
                <Link href="/" className="mb-8 inline-block text-cyan-400 hover:underline">
                    ← ホームに戻る
                </Link>
                <h1 className="mb-8 text-3xl font-bold">利用規約</h1>
                <div className="space-y-6 text-gray-300">
                    <p>この利用規約（以下，「本規約」といいます。）は，AISocialManager（以下，「当サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。</p>

                    <h2 className="text-xl font-bold text-white">第1条（適用）</h2>
                    <p>本規約は，ユーザーと当サービスとの間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>

                    <h2 className="text-xl font-bold text-white">第2条（利用登録）</h2>
                    <p>登録希望者が当サービスの定める方法によって利用登録を申請し，当サービスがこれを承認することによって，利用登録が完了するものとします。</p>

                    <h2 className="text-xl font-bold text-white">第3条（禁止事項）</h2>
                    <p>ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。</p>
                    <ul className="list-disc pl-6">
                        <li>法令または公序良俗に違反する行為</li>
                        <li>犯罪行為に関連する行為</li>
                        <li>当サービスのサーバーまたはネットワークの機能を破壊したり，妨害したりする行為</li>
                        <li>当サービスのサービスの運営を妨害するおそれのある行為</li>
                        <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white">第4条（本サービスの提供の停止等）</h2>
                    <p>当サービスは，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
                    <ul className="list-disc pl-6">
                        <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                        <li>地震，落雷，火災，停電または天災などの不可抗力により，本サービスの提供が困難となった場合</li>
                    </ul>

                    <h2 className="text-xl font-bold text-white">第5条（利用制限および登録抹消）</h2>
                    <p>当サービスは，ユーザーが本規約のいずれかの条項に違反した場合，事前の通知なく，ユーザーに対して本サービスの全部もしくは一部の利用を制限し，またはユーザーとしての登録を抹消することができるものとします。</p>

                    <h2 className="text-xl font-bold text-white">第6条（免責事項）</h2>
                    <p>当サービスの債務不履行責任は，当サービスの故意または重過失によらない場合には免責されるものとします。</p>

                    <p className="mt-8 text-sm text-gray-500">以上</p>
                </div>
            </div>
        </div>
    );
}
