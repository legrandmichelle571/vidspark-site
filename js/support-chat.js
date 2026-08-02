/* ════════════════════════════════════════════════════════════════
   VidSpark AI — Assistant IA du site (bulle flottante)

   Une seule bulle, deux cerveaux selon qui regarde :
     • visiteur non connecté → POST /api/public/ai/chat
       (produit, tarifs, fonctionnement ; rate-limité par IP)
     • utilisateur connecté  → POST /api/user/coach-chat
       (le vrai coach, qui connaît sa chaîne — le même que le dashboard)

   Équivalent site du dock de l'extension : celle-ci transmet les faits
   mesurés de la vidéo regardée ; ici on transmet la page ouverte et le
   résultat affiché à l'écran. Sans ça l'assistant répond dans le vide
   alors que l'utilisateur a son audit sous les yeux.

   Auto-suffisant : s'appuie sur js/i18n.js s'il est chargé
   (registerI18n/t/vsGetLang), sinon replie sur du français en dur — 18 des
   39 pages du site ne chargent pas i18n.js.
   Aucune dépendance CSS : tokens.css est utilisé si présent, sinon valeurs
   de repli intégrées.
   ════════════════════════════════════════════════════════════════ */
(function(){
  if (window.__vsSupportChatMounted) return;
  window.__vsSupportChatMounted = true;

  /* Le dashboard a son propre panneau coach (#aiPop) : deux chats sur la même
     page se disputeraient l'attention et l'historique. On laisse la place. */
  if (document.getElementById('aiPop')) return;

  const API_BASE = 'https://vidspark-ai-production-9ac7.up.railway.app';
  const hasI18n = typeof window.registerI18n === 'function' && typeof window.t === 'function';

  /* Dictionnaire defini au niveau du module, pas a l'interieur du if(hasI18n) :
     story-generator.html et les 18 pages /outils/ ne chargent pas js/i18n.js,
     le panneau tombait donc sur un repli code en dur en francais — un site en
     anglais affichait un coach en francais. Il sert desormais aussi de repli
     traduit quand le moteur i18n est absent. */
  const DICT = {
      /* Meme nom que ai_coach et db_aiassist dans dashboard.html : l'assistant
         portait trois libelles differents selon la page, ce qui donnait
         l'impression de trois outils distincts. */
      vsc_title:{fr:'Coach IA',en:'AI Coach',es:'Coach IA',ar:'مدرب الذكاء الاصطناعي',pt:'Coach IA',de:'KI-Coach',it:'Coach IA',ru:'ИИ-коуч',ja:'AIコーチ',ko:'AI 코치',hi:'AI कोच',zh:'AI 教练',tr:'YZ Koçu',nl:'AI-coach'},
      vsc_greeting:{fr:'👋 Salut ! Une question sur VidSpark AI (fonctionnalités, tarifs, comment ça marche) ? Je suis là pour t’aider.',en:'👋 Hi! Got a question about VidSpark AI (features, pricing, how it works)? I’m here to help.',es:'👋 ¡Hola! ¿Tienes alguna pregunta sobre VidSpark AI (funciones, precios, cómo funciona)? Estoy aquí para ayudarte.',ar:'👋 مرحبًا! هل لديك سؤال عن VidSpark AI (الميزات، الأسعار، كيفية العمل)؟ أنا هنا للمساعدة.',pt:'👋 Oi! Tem alguma dúvida sobre o VidSpark AI (recursos, preços, como funciona)? Estou aqui para ajudar.',de:'👋 Hallo! Hast du eine Frage zu VidSpark AI (Funktionen, Preise, Funktionsweise)? Ich helfe gerne.',it:'👋 Ciao! Hai una domanda su VidSpark AI (funzioni, prezzi, come funziona)? Sono qui per aiutarti.',ru:'👋 Привет! Есть вопрос о VidSpark AI (функции, цены, как это работает)? Я помогу.',ja:'👋 こんにちは！VidSpark AIについて（機能、料金、使い方など）質問はありますか？お手伝いします。',ko:'👋 안녕하세요! VidSpark AI에 대해 궁금한 점(기능, 요금제, 사용법)이 있으신가요? 도와드릴게요.',hi:'👋 नमस्ते! VidSpark AI (सुविधाएँ, कीमत, कैसे काम करता है) के बारे में कोई सवाल? मैं मदद के लिए यहाँ हूँ।',zh:'👋 你好！对 VidSpark AI 有疑问吗（功能、价格、使用方法）？我可以帮你。',tr:'👋 Merhaba! VidSpark AI hakkında (özellikler, fiyatlar, nasıl çalışır) bir sorun mu var? Yardımcı olmak için buradayım.',nl:'👋 Hoi! Een vraag over VidSpark AI (functies, prijzen, hoe het werkt)? Ik help je graag.'},
      vsc_placeholder:{fr:'Écris ta question…',en:'Type your question…',es:'Escribe tu pregunta…',ar:'اكتب سؤالك…',pt:'Escreva sua pergunta…',de:'Schreib deine Frage…',it:'Scrivi la tua domanda…',ru:'Введите вопрос…',ja:'質問を入力…',ko:'질문을 입력하세요…',hi:'अपना सवाल लिखें…',zh:'输入你的问题…',tr:'Sorunu yaz…',nl:'Typ je vraag…'},
      vsc_send:{fr:'Envoyer',en:'Send',es:'Enviar',ar:'إرسال',pt:'Enviar',de:'Senden',it:'Invia',ru:'Отправить',ja:'送信',ko:'보내기',hi:'भेजें',zh:'发送',tr:'Gönder',nl:'Versturen'},
      vsc_thinking:{fr:'L’assistant réfléchit…',en:'Assistant is thinking…',es:'El asistente está pensando…',ar:'المساعد يفكر…',pt:'O assistente está pensando…',de:'Der Assistent überlegt…',it:'L’assistente sta pensando…',ru:'Ассистент думает…',ja:'アシスタントが考え中…',ko:'어시스턴트가 생각 중…',hi:'सहायक सोच रहा है…',zh:'助手正在思考…',tr:'Asistan düşünüyor…',nl:'Assistent denkt na…'},
      vsc_error:{fr:'Oups, une erreur est survenue. Réessaie dans un instant, ou passe par la page Contact.',en:'Oops, something went wrong. Try again in a moment, or use the Contact page.',es:'Vaya, algo salió mal. Inténtalo de nuevo en un momento, o usa la página de Contacto.',ar:'عذرًا، حدث خطأ ما. أعد المحاولة بعد لحظة، أو استخدم صفحة التواصل.',pt:'Ops, algo deu errado. Tente novamente em instantes, ou use a página de Contato.',de:'Hoppla, etwas ist schiefgelaufen. Versuch es gleich noch einmal oder nutze die Kontaktseite.',it:'Ops, si è verificato un errore. Riprova tra un istante, oppure usa la pagina Contatti.',ru:'Упс, что-то пошло не так. Повторите через момент или воспользуйтесь страницей контактов.',ja:'エラーが発生しました。少ししてからもう一度お試しいただくか、お問い合わせページをご利用ください。',ko:'앗, 오류가 발생했습니다. 잠시 후 다시 시도하거나 문의 페이지를 이용해 주세요.',hi:'ओह, कुछ गड़बड़ हो गई। कुछ देर बाद फिर कोशिश करें, या संपर्क पेज का उपयोग करें।',zh:'哎呀，出错了。请稍后重试，或使用联系页面。',tr:'Bir hata oluştu. Biraz sonra tekrar dene ya da İletişim sayfasını kullan.',nl:'Oeps, er ging iets mis. Probeer het zo nog eens, of gebruik de Contactpagina.'},
      vsc_ratelimit:{fr:'Tu as atteint la limite de messages pour l’instant. Réessaie dans un moment.',en:'You’ve reached the message limit for now. Try again in a bit.',es:'Has alcanzado el límite de mensajes por ahora. Inténtalo de nuevo en un momento.',ar:'لقد وصلت إلى الحد الأقصى للرسائل حاليًا. أعد المحاولة بعد قليل.',pt:'Você atingiu o limite de mensagens por enquanto. Tente novamente em breve.',de:'Du hast das Nachrichtenlimit vorerst erreicht. Versuch es gleich noch einmal.',it:'Hai raggiunto il limite di messaggi per ora. Riprova tra poco.',ru:'Вы достигли лимита сообщений. Повторите попытку немного позже.',ja:'現在メッセージの上限に達しました。しばらくしてからもう一度お試しください。',ko:'현재 메시지 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.',hi:'आप अभी संदेश सीमा तक पहुँच गए हैं। थोड़ी देर बाद फिर कोशिश करें।',zh:'你已达到当前的消息上限，请稍后再试。',tr:'Şimdilik mesaj sınırına ulaştın. Biraz sonra tekrar dene.',nl:'Je hebt de berichtenlimiet voorlopig bereikt. Probeer het straks nog eens.'},

      /* Identité : l'utilisateur doit voir tout de suite que c'est une IA. */
      /* Nom de marque : identique dans toutes les langues, il ne se traduit pas. */
      vsc_ai_badge:{fr:'ChatGPT AI',en:'ChatGPT AI',es:'ChatGPT AI',ar:'ChatGPT AI',pt:'ChatGPT AI',de:'ChatGPT AI',it:'ChatGPT AI',ru:'ChatGPT AI',ja:'ChatGPT AI',ko:'ChatGPT AI',hi:'ChatGPT AI',zh:'ChatGPT AI',tr:'ChatGPT AI',nl:'ChatGPT AI'},
      vsc_inv_t:{fr:"Parle à l'assistant AI",en:'Talk to the AI assistant',es:'Habla con el asistente AI',ar:'تحدّث إلى مساعد AI',pt:'Fale com o assistente AI',de:'Sprich mit dem AI-Assistenten',it:"Parla con l'assistente AI",ru:'Поговорите с AI-ассистентом',ja:'AIアシスタントに話しかける',ko:'AI 어시스턴트와 대화하기',hi:'AI असिस्टेंट से बात करें',zh:'与 AI 助手对话',tr:'AI asistanıyla konuş',nl:'Praat met de AI-assistent'},
      vsc_inv_s:{fr:"Pose ta question, l'AI te répond",en:'Ask your question, the AI answers',es:'Haz tu pregunta, la AI responde',ar:'اطرح سؤالك، وسيجيبك AI',pt:'Faça sua pergunta, a AI responde',de:'Stell deine Frage, die AI antwortet',it:"Fai la tua domanda, l'AI risponde",ru:'Задайте вопрос — AI ответит',ja:'質問すれば、AIが答えます',ko:'질문하면 AI가 답합니다',hi:'अपना सवाल पूछें, AI जवाब देगा',zh:'提出问题，AI 会回答',tr:'Sorunu sor, AI cevaplasın',nl:'Stel je vraag, de AI antwoordt'},
      vsc_hint:{fr:'Une IA pour t’aider — clique pour discuter',en:'An AI here to help — click to chat',es:'Una IA para ayudarte — haz clic para chatear',ar:'ذكاء اصطناعي لمساعدتك — انقر للدردشة',pt:'Uma IA para ajudar — clique para conversar',de:'Eine KI, die hilft — zum Chatten klicken',it:'Un’IA per aiutarti — clicca per chattare',ru:'ИИ готов помочь — нажмите, чтобы начать',ja:'AIがお手伝いします — クリックしてチャット',ko:'AI가 도와드립니다 — 클릭해서 대화하기',hi:'मदद के लिए एक AI — चैट करने के लिए क्लिक करें',zh:'AI 助手随时待命 — 点击开始聊天',tr:'Yardım için bir YZ — sohbet için tıkla',nl:'Een AI die helpt — klik om te chatten'},
      vsc_greeting_user:{fr:'👋 Salut ! Je vois ce que tu as à l’écran. Pose-moi une question sur ta chaîne ou sur ce résultat.',en:'👋 Hi! I can see what’s on your screen. Ask me about your channel or about this result.',es:'👋 ¡Hola! Veo lo que tienes en pantalla. Pregúntame sobre tu canal o sobre este resultado.',ar:'👋 مرحبًا! أرى ما هو معروض على شاشتك. اسألني عن قناتك أو عن هذه النتيجة.',pt:'👋 Oi! Estou vendo o que está na sua tela. Pergunte sobre seu canal ou sobre este resultado.',de:'👋 Hallo! Ich sehe, was auf deinem Bildschirm ist. Frag mich zu deinem Kanal oder zu diesem Ergebnis.',it:'👋 Ciao! Vedo cosa hai sullo schermo. Chiedimi del tuo canale o di questo risultato.',ru:'👋 Привет! Я вижу, что у вас на экране. Спросите о канале или об этом результате.',ja:'👋 こんにちは！画面の内容が見えています。チャンネルやこの結果について質問してください。',ko:'👋 안녕하세요! 화면에 있는 내용을 보고 있어요. 채널이나 이 결과에 대해 물어보세요.',hi:'👋 नमस्ते! मैं देख सकता हूँ कि स्क्रीन पर क्या है। अपने चैनल या इस परिणाम के बारे में पूछें।',zh:'👋 你好！我能看到你屏幕上的内容。可以问我关于你的频道或这个结果的问题。',tr:'👋 Merhaba! Ekranındakini görüyorum. Kanalın ya da bu sonuç hakkında sor.',nl:'👋 Hoi! Ik zie wat er op je scherm staat. Vraag me iets over je kanaal of dit resultaat.'},
      vsc_ctx_seen:{fr:'Je regarde ce qui est affiché sur cette page',en:'I can see what’s shown on this page',es:'Veo lo que se muestra en esta página',ar:'أرى ما هو معروض في هذه الصفحة',pt:'Vejo o que está exibido nesta página',de:'Ich sehe, was auf dieser Seite angezeigt wird',it:'Vedo ciò che è mostrato in questa pagina',ru:'Я вижу, что показано на этой странице',ja:'このページに表示されている内容が見えます',ko:'이 페이지에 표시된 내용을 보고 있습니다',hi:'मैं देख सकता हूँ कि इस पेज पर क्या दिख रहा है',zh:'我能看到此页面显示的内容',tr:'Bu sayfada gösterileni görüyorum',nl:'Ik zie wat op deze pagina staat'}
  };

  if (hasI18n) registerI18n(DICT);

  /* Repli si i18n.js n'est pas chargé : anglais par défaut, comme vsGetLang(). */
  const lang = () => (typeof window.vsGetLang === 'function')
    ? window.vsGetLang()
    : (localStorage.getItem('vs_site_lang') || 'en');

  /* Sans moteur i18n, on lit DICT directement dans la langue courante au lieu
     de servir du francais. Repli sur l'anglais si la langue manque. */
  const T = hasI18n ? window.t : function(k){
    const e = DICT[k];
    if (!e) return k;
    return e[lang()] || e.en || k;
  };

  const style = document.createElement('style');
  style.textContent = `
    #vscFab{ position:fixed; right:20px; bottom:20px; z-index:9998; width:56px; height:56px; border-radius:50%;
      background:linear-gradient(135deg,var(--vs-accent,#F2900F),var(--vs-accent-2,#E8830A)); color:#1a1200; border:none;
      box-shadow:var(--vs-shadow,0 16px 40px -18px rgba(33,29,22,.16)); cursor:pointer; font-size:24px;
      display:flex; align-items:center; justify-content:center; transition:transform .18s var(--vs-ease,cubic-bezier(.4,0,.2,1)); }
    #vscFab:hover{ transform:scale(1.07); }
    /* Pastille « IA » : le pictogramme seul ne dit pas a quoi on parle. */
    #vscFab .vsc-ai{ position:absolute; top:-6px; right:-10px; background:#211D16; color:#FFF; font-size:9px; font-weight:800;
      letter-spacing:.2px; padding:2px 7px; border-radius:9px; line-height:1.35; font-family:"Inter",-apple-system,sans-serif;
      max-width:104px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    /* Invite au-dessus du champ : rien n'indiquait qu'on peut écrire librement. */
    #vscInvite{ flex-shrink:0; padding:9px 12px 0; border-top:1px solid var(--vs-border-1,#E7E0D3); background:var(--vs-surface,#FFFFFF);
      font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    #vscInvite .vsc-inv-t{ font-size:12.5px; font-weight:800; color:var(--vs-text,#211D16); }
    #vscInvite .vsc-inv-s{ font-size:11px; color:var(--vs-muted,#756D5E); margin-top:2px; }
    #vscInvite + #vscForm{ border-top:none; padding-top:8px; }
    #vscHint{ position:fixed; right:86px; bottom:30px; z-index:9998; max-width:220px; background:#211D16; color:#FFF;
      font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; font-size:12.5px; line-height:1.45;
      padding:9px 12px; border-radius:12px; box-shadow:0 10px 26px -12px rgba(0,0,0,.5); cursor:pointer;
      opacity:0; transform:translateY(4px); transition:opacity .3s ease, transform .3s ease; pointer-events:none; }
    #vscHint.show{ opacity:1; transform:none; pointer-events:auto; }
    #vscPanel{ position:fixed; right:20px; bottom:88px; z-index:9998; width:min(360px,calc(100vw - 32px)); height:min(520px,calc(100vh - 140px));
      background:var(--vs-surface,#FFFFFF); border:1px solid var(--vs-border-1,#E7E0D3); border-radius:var(--vs-radius,16px);
      box-shadow:var(--vs-shadow,0 16px 40px -18px rgba(33,29,22,.16)); display:none; flex-direction:column; overflow:hidden;
      font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif; }
    #vscPanel.open{ display:flex; }
    #vscHead{ padding:14px 16px; background:linear-gradient(135deg,var(--vs-accent,#F2900F),var(--vs-accent-2,#E8830A)); color:#1a1200;
      display:flex; align-items:center; justify-content:space-between; gap:8px; font-weight:800; font-size:14px; flex-shrink:0; }
    #vscHead .vsc-pill{ background:rgba(0,0,0,.16); font-size:10px; font-weight:800; padding:2px 7px; border-radius:20px; letter-spacing:.4px; }
    #vscClose{ background:rgba(0,0,0,.12); border:none; color:#1a1200; width:26px; height:26px; border-radius:50%; cursor:pointer; font-size:13px; flex-shrink:0; }
    #vscBody{ flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; background:var(--vs-bg,#FBF8F3); }
    .vsc-msg{ max-width:85%; padding:9px 12px; border-radius:12px; font-size:13.5px; line-height:1.5; white-space:pre-wrap; }
    .vsc-msg.bot{ align-self:flex-start; background:var(--vs-surface,#FFFFFF); border:1px solid var(--vs-border-1,#E7E0D3); color:var(--vs-text,#211D16); }
    .vsc-msg.user{ align-self:flex-end; background:var(--vs-accent-soft,#FDECD1); color:var(--vs-text,#211D16); }
    .vsc-msg.err{ align-self:flex-start; color:var(--vs-red,#C23B22); background:rgba(194,59,34,.08); border:1px solid rgba(194,59,34,.25); }
    .vsc-ctx{ align-self:flex-start; font-size:11px; color:var(--vs-muted,#756D5E); background:rgba(0,0,0,.04);
      border-radius:8px; padding:4px 9px; display:inline-flex; align-items:center; gap:5px; }
    .vsc-typing{ align-self:flex-start; font-size:12px; color:var(--vs-muted,#756D5E); font-style:italic; }
    #vscForm{ display:flex; gap:8px; padding:12px; border-top:1px solid var(--vs-border-1,#E7E0D3); flex-shrink:0; background:var(--vs-surface,#FFFFFF); }
    #vscInput{ flex:1; border:1px solid var(--vs-border-2,#DCD3C2); border-radius:10px; padding:9px 11px; font-size:13.5px;
      font-family:inherit; color:var(--vs-text,#211D16); background:var(--vs-surface,#FFFFFF); resize:none; }
    #vscInput:focus{ outline:none; border-color:var(--vs-accent-line,#F3C888); }
    #vscSend{ background:var(--vs-accent,#F2900F); color:#1a1200; border:none; border-radius:10px; padding:0 14px; font-weight:700;
      font-size:13px; cursor:pointer; flex-shrink:0; }
    #vscSend:disabled{ opacity:.5; cursor:not-allowed; }

    /* Arabe : le site bascule <html dir="rtl">, la bulle doit suivre le coin de lecture. */
    [dir="rtl"] #vscFab{ right:auto; left:20px; }
    [dir="rtl"] #vscFab .vsc-ai{ right:auto; left:-4px; }
    [dir="rtl"] #vscPanel{ right:auto; left:20px; }
    [dir="rtl"] #vscHint{ right:auto; left:86px; }
    [dir="rtl"] .vsc-msg.user{ align-self:flex-start; }
    [dir="rtl"] .vsc-msg.bot, [dir="rtl"] .vsc-msg.err, [dir="rtl"] .vsc-ctx, [dir="rtl"] .vsc-typing{ align-self:flex-end; }

    /* #vsDashLink (dashboard-link.js) occupe deja right:20/bottom:20 : sans ce
       decalage il recouvre purement et simplement la bulle pour un visiteur
       connecte, sur index/pricing/contact/outils. */
    #vsDashLink{ bottom:88px !important; }
    [dir="rtl"] #vsDashLink{ right:auto !important; left:20px !important; }

    @media(max-width:480px){
      #vscPanel{ right:10px; bottom:80px; } #vscFab{ right:14px; bottom:14px; }
      [dir="rtl"] #vscPanel{ right:auto; left:10px; } [dir="rtl"] #vscFab{ right:auto; left:14px; }
      #vscHint{ display:none; }
    }
    @media(prefers-reduced-motion:reduce){ #vscFab, #vscHint{ transition:none; } }
  `;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.id = 'vscFab';
  fab.type = 'button';
  fab.setAttribute('aria-expanded', 'false');
  fab.setAttribute('aria-controls', 'vscPanel');

  const panel = document.createElement('div');
  panel.id = 'vscPanel';
  panel.setAttribute('role', 'dialog');

  const hint = document.createElement('div');
  hint.id = 'vscHint';

  /* Le libellé dépend de la langue : i18n.js recharge la page au changement,
     mais on écoute quand même l'événement pour les pages qui ne rechargent pas. */
  function paintLabels(){
    const title = T('vsc_title'), badge = T('vsc_ai_badge');
    fab.innerHTML = '✦<span class="vsc-ai"></span>';
    fab.querySelector('.vsc-ai').textContent = badge;
    fab.title = title;
    fab.setAttribute('aria-label', title + ' — ' + T('vsc_hint'));
    hint.textContent = T('vsc_hint');
    panel.setAttribute('aria-label', title);
    const head = panel.querySelector('#vscHead span');
    if (head) head.textContent = '✦ ' + title;
    const pill = panel.querySelector('.vsc-pill');
    if (pill) pill.textContent = badge;
    const inp = panel.querySelector('#vscInput');
    if (inp) inp.placeholder = T('vsc_placeholder');
    const snd = panel.querySelector('#vscSend');
    if (snd) snd.textContent = T('vsc_send');
    const it = panel.querySelector('.vsc-inv-t');
    if (it) it.textContent = T('vsc_inv_t');
    const is = panel.querySelector('.vsc-inv-s');
    if (is) is.textContent = T('vsc_inv_s');
  }

  panel.innerHTML =
    '<div id="vscHead"><span></span><span style="display:flex;align-items:center;gap:8px">'
    + '<span class="vsc-pill"></span><button id="vscClose" type="button" aria-label="✕">✕</button></span></div>'
    + '<div id="vscBody" aria-live="polite"></div>'
    + '<div id="vscInvite"><div class="vsc-inv-t"></div><div class="vsc-inv-s"></div></div>'
    + '<form id="vscForm"><textarea id="vscInput" rows="1" maxlength="800"></textarea>'
    + '<button id="vscSend" type="submit"></button></form>';

  document.body.appendChild(fab);
  document.body.appendChild(panel);
  document.body.appendChild(hint);
  paintLabels();
  document.addEventListener('vslangchange', paintLabels);

  const body = panel.querySelector('#vscBody');
  const form = panel.querySelector('#vscForm');
  const input = panel.querySelector('#vscInput');
  const sendBtn = panel.querySelector('#vscSend');

  const chatHistory = [];       // pas « history » : masquer window.history prête à confusion
  let opened = false;
  let token = null;             // jeton Supabase si connecté → mode coach

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function addMsg(role, text){
    const div = document.createElement('div');
    div.className = 'vsc-msg ' + (role === 'user' ? 'user' : role === 'err' ? 'err' : 'bot');
    div.textContent = String(text == null ? '' : text);
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  /* ── Contexte de la page ──────────────────────────────────────────
     L'extension transmet les faits mesurés de la vidéo regardée. Ici,
     l'équivalent est : quel outil est ouvert, et qu'affiche-t-il.
     Les 18 pages /outils/ utilisent toutes <div class="result" id="res"> ;
     diamant.html numérote ses conteneurs en *Result. On prend le premier
     visible et non vide. Uniquement du texte déjà à l'écran : rien n'est
     lu ailleurs dans la page, et rien n'est envoyé si l'écran est vide. */
  function pageContext(){
    const bits = [];
    const h1 = document.querySelector('h1');
    const titre = (h1 && h1.textContent.trim()) || document.title || '';
    if (titre) bits.push('page="' + titre.replace(/\s+/g, ' ').slice(0, 90) + '"');
    bits.push('url=' + location.pathname);

    let res = '';
    const cands = document.querySelectorAll('#res, .result, [id$="Result"]');
    for (const el of cands) {
      if (!el.offsetParent && el.style.display === 'none') continue;   // conteneur masqué
      const txt = (el.innerText || '').replace(/\s+/g, ' ').trim();
      if (txt.length > res.length) res = txt;
    }
    if (res) bits.push('resultat_affiche="' + res.slice(0, 1200) + '"');
    return { text: '[Contexte de la page consultée] ' + bits.join(' ; '), hasResult: Boolean(res) };
  }

  /* ── Ouverture ─────────────────────────────────────────────────── */
  function setOpen(v){
    opened = v;
    panel.classList.toggle('open', v);
    fab.setAttribute('aria-expanded', String(v));
    if (v) {
      hint.classList.remove('show');
      try { sessionStorage.setItem('vsc_hint_seen', '1'); } catch(e){}
      if (!body.children.length) {
        addMsg('bot', token ? T('vsc_greeting_user') : T('vsc_greeting'));
        if (token && pageContext().hasResult) {
          const c = document.createElement('div');
          c.className = 'vsc-ctx';
          c.textContent = '👁 ' + T('vsc_ctx_seen');
          body.appendChild(c);
        }
      }
      input.focus();
    }
  }
  fab.addEventListener('click', () => setOpen(!opened));
  hint.addEventListener('click', () => setOpen(true));
  panel.querySelector('#vscClose').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && opened) setOpen(false); });

  input.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    addMsg('user', msg);
    chatHistory.push({ role: 'user', content: msg });
    input.value = '';
    sendBtn.disabled = true;

    const typing = document.createElement('div');
    typing.className = 'vsc-typing';
    typing.textContent = T('vsc_thinking');
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    try {
      /* Connecté → le coach, qui connaît la chaîne ; sinon → l'assistant
         public. Le contexte de page est recalculé à CHAQUE envoi : sur une
         page outil, le résultat n'existe pas encore à l'ouverture du chat. */
      const ctx = pageContext();
      const hist = [{ role: 'user', content: ctx.text }].concat(chatHistory).slice(-8);
      const url = token ? '/api/user/coach-chat' : '/api/public/ai/chat';
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;

      const res = await fetch(API_BASE + url, {
        method: 'POST', headers,
        body: JSON.stringify({ message: msg, history: hist, language: lang() })
      });
      typing.remove();
      if (res.status === 429) { addMsg('err', T('vsc_ratelimit')); return; }
      if (!res.ok) { addMsg('err', T('vsc_error')); return; }
      const data = await res.json();
      const reply = data.reply || T('vsc_error');
      addMsg('bot', reply);
      chatHistory.push({ role: 'assistant', content: reply });
    } catch (err) {
      typing.remove();
      addMsg('err', T('vsc_error'));
    } finally {
      sendBtn.disabled = false;
    }
  });

  /* Session : si l'utilisateur est connecté on bascule sur le coach. Silencieux
     et non bloquant — la bulle reste utilisable en mode public en attendant, et
     sur les pages sans js/auth.js elle y reste tout court. */
  if (window.Auth && window.Auth.waitForSession) {
    Auth.waitForSession().then(s => { if (s && s.access_token) token = s.access_token; }).catch(() => {});
  }

  /* Bulle d'amorce, une seule fois par session : sans elle, un rond orange
     avec un pictogramme ne dit pas qu'il y a une IA derrière. */
  try {
    if (!sessionStorage.getItem('vsc_hint_seen')) {
      setTimeout(() => { if (!opened) hint.classList.add('show'); }, 2500);
      setTimeout(() => hint.classList.remove('show'), 11000);
    }
  } catch(e){}
})();
