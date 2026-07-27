/* ════════════════════════════════════════════════════════════════
   VidSpark AI — Widget de chat IA public (bulle flottante)
   Aide les visiteurs du site (pas connectés) à comprendre le produit,
   répond aux questions sur les fonctionnalités/tarifs. Backend :
   POST /api/public/ai/chat (voir routes/public.js), rate-limité par IP.
   Auto-suffisant : s'appuie sur js/i18n.js s'il est déjà chargé sur la
   page (registerI18n/t/vsGetLang), sinon replie sur du français en dur.
   Aucune dépendance CSS externe requise (tokens.css utilisé si présent,
   sinon valeurs de repli intégrées ci-dessous).
   ════════════════════════════════════════════════════════════════ */
(function(){
  if (window.__vsSupportChatMounted) return;
  window.__vsSupportChatMounted = true;

  const API_BASE = 'https://vidspark-ai-production-9ac7.up.railway.app';
  const hasI18n = typeof window.registerI18n === 'function' && typeof window.t === 'function';

  if (hasI18n) {
    registerI18n({
      vsc_title:{fr:'Assistant VidSpark AI',en:'VidSpark AI Assistant',es:'Asistente VidSpark AI',ar:'مساعد VidSpark AI',pt:'Assistente VidSpark AI',de:'VidSpark-AI-Assistent',it:'Assistente VidSpark AI',ru:'Ассистент VidSpark AI',ja:'VidSpark AI アシスタント',ko:'VidSpark AI 어시스턴트',hi:'VidSpark AI असिस्टेंट',zh:'VidSpark AI 助手',tr:'VidSpark AI Asistanı',nl:'VidSpark AI-assistent'},
      vsc_greeting:{fr:'👋 Salut ! Une question sur VidSpark AI (fonctionnalités, tarifs, comment ça marche) ? Je suis là pour t’aider.',en:'👋 Hi! Got a question about VidSpark AI (features, pricing, how it works)? I’m here to help.',es:'👋 ¡Hola! ¿Tienes alguna pregunta sobre VidSpark AI (funciones, precios, cómo funciona)? Estoy aquí para ayudarte.',ar:'👋 مرحبًا! هل لديك سؤال عن VidSpark AI (الميزات، الأسعار، كيفية العمل)؟ أنا هنا للمساعدة.',pt:'👋 Oi! Tem alguma dúvida sobre o VidSpark AI (recursos, preços, como funciona)? Estou aqui para ajudar.',de:'👋 Hallo! Hast du eine Frage zu VidSpark AI (Funktionen, Preise, Funktionsweise)? Ich helfe gerne.',it:'👋 Ciao! Hai una domanda su VidSpark AI (funzioni, prezzi, come funziona)? Sono qui per aiutarti.',ru:'👋 Привет! Есть вопрос о VidSpark AI (функции, цены, как это работает)? Я помогу.',ja:'👋 こんにちは！VidSpark AIについて（機能、料金、使い方など）質問はありますか？お手伝いします。',ko:'👋 안녕하세요! VidSpark AI에 대해 궁금한 점(기능, 요금제, 사용법)이 있으신가요? 도와드릴게요.',hi:'👋 नमस्ते! VidSpark AI (सुविधाएँ, कीमत, कैसे काम करता है) के बारे में कोई सवाल? मैं मदद के लिए यहाँ हूँ।',zh:'👋 你好！对 VidSpark AI 有疑问吗（功能、价格、使用方法）？我可以帮你。',tr:'👋 Merhaba! VidSpark AI hakkında (özellikler, fiyatlar, nasıl çalışır) bir sorun mu var? Yardımcı olmak için buradayım.',nl:'👋 Hoi! Een vraag over VidSpark AI (functies, prijzen, hoe het werkt)? Ik help je graag.'},
      vsc_placeholder:{fr:'Écris ta question…',en:'Type your question…',es:'Escribe tu pregunta…',ar:'اكتب سؤالك…',pt:'Escreva sua pergunta…',de:'Schreib deine Frage…',it:'Scrivi la tua domanda…',ru:'Введите вопрос…',ja:'質問を入力…',ko:'질문을 입력하세요…',hi:'अपना सवाल लिखें…',zh:'输入你的问题…',tr:'Sorunu yaz…',nl:'Typ je vraag…'},
      vsc_send:{fr:'Envoyer',en:'Send',es:'Enviar',ar:'إرسال',pt:'Enviar',de:'Senden',it:'Invia',ru:'Отправить',ja:'送信',ko:'보내기',hi:'भेजें',zh:'发送',tr:'Gönder',nl:'Versturen'},
      vsc_thinking:{fr:'L’assistant réfléchit…',en:'Assistant is thinking…',es:'El asistente está pensando…',ar:'المساعد يفكر…',pt:'O assistente está pensando…',de:'Der Assistent überlegt…',it:'L’assistente sta pensando…',ru:'Ассистент думает…',ja:'アシスタントが考え中…',ko:'어시스턴트가 생각 중…',hi:'सहायक सोच रहा है…',zh:'助手正在思考…',tr:'Asistan düşünüyor…',nl:'Assistent denkt na…'},
      vsc_error:{fr:'Oups, une erreur est survenue. Réessaie dans un instant, ou passe par la page Contact.',en:'Oops, something went wrong. Try again in a moment, or use the Contact page.',es:'Vaya, algo salió mal. Inténtalo de nuevo en un momento, o usa la página de Contacto.',ar:'عذرًا، حدث خطأ ما. أعد المحاولة بعد لحظة، أو استخدم صفحة التواصل.',pt:'Ops, algo deu errado. Tente novamente em instantes, ou use a página de Contato.',de:'Hoppla, etwas ist schiefgelaufen. Versuch es gleich noch einmal oder nutze die Kontaktseite.',it:'Ops, si è verificato un errore. Riprova tra un istante, oppure usa la pagina Contatti.',ru:'Упс, что-то пошло не так. Повторите через момент или воспользуйтесь страницей контактов.',ja:'エラーが発生しました。少ししてからもう一度お試しいただくか、お問い合わせページをご利用ください。',ko:'앗, 오류가 발생했습니다. 잠시 후 다시 시도하거나 문의 페이지를 이용해 주세요.',hi:'ओह, कुछ गड़बड़ हो गई। कुछ देर बाद फिर कोशिश करें, या संपर्क पेज का उपयोग करें।',zh:'哎呀，出错了。请稍后重试，或使用联系页面。',tr:'Bir hata oluştu. Biraz sonra tekrar dene ya da İletişim sayfasını kullan.',nl:'Oeps, er ging iets mis. Probeer het zo nog eens, of gebruik de Contactpagina.'},
      vsc_ratelimit:{fr:'Tu as atteint la limite de messages pour l’instant. Réessaie dans un moment.',en:'You’ve reached the message limit for now. Try again in a bit.',es:'Has alcanzado el límite de mensajes por ahora. Inténtalo de nuevo en un momento.',ar:'لقد وصلت إلى الحد الأقصى للرسائل حاليًا. أعد المحاولة بعد قليل.',pt:'Você atingiu o limite de mensagens por enquanto. Tente novamente em breve.',de:'Du hast das Nachrichtenlimit vorerst erreicht. Versuch es gleich noch einmal.',it:'Hai raggiunto il limite di messaggi per ora. Riprova tra poco.',ru:'Вы достигли лимита сообщений. Повторите попытку немного позже.',ja:'現在メッセージの上限に達しました。しばらくしてからもう一度お試しください。',ko:'현재 메시지 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.',hi:'आप अभी संदेश सीमा तक पहुँच गए हैं। थोड़ी देर बाद फिर कोशिश करें।',zh:'你已达到当前的消息上限，请稍后再试。',tr:'Şimdilik mesaj sınırına ulaştın. Biraz sonra tekrar dene.',nl:'Je hebt de berichtenlimiet voorlopig bereikt. Probeer het straks nog eens.'}
    });
  }
  const T = hasI18n ? window.t : function(k){
    const fallback = {
      vsc_title:'Assistant VidSpark AI',
      vsc_greeting:'👋 Salut ! Une question sur VidSpark AI (fonctionnalités, tarifs, comment ça marche) ? Je suis là pour t’aider.',
      vsc_placeholder:'Écris ta question…', vsc_send:'Envoyer', vsc_thinking:'L’assistant réfléchit…',
      vsc_error:'Oups, une erreur est survenue. Réessaie dans un instant, ou passe par la page Contact.',
      vsc_ratelimit:'Tu as atteint la limite de messages pour l’instant. Réessaie dans un moment.'
    };
    return fallback[k] || k;
  };
  // Repli si js/i18n.js n'est pas chargé sur la page hôte : même clé localStorage
  // que vsGetLang(), pour rester cohérent avec le choix de langue déjà fait
  // ailleurs sur le site sans dépendre de i18n.js.
  const lang = (typeof window.vsGetLang === 'function')
    ? window.vsGetLang()
    : (localStorage.getItem('vs_site_lang') || (navigator.language || 'fr').slice(0, 2));

  const style = document.createElement('style');
  style.textContent = `
    #vscFab{ position:fixed; right:20px; bottom:20px; z-index:9998; width:56px; height:56px; border-radius:50%;
      background:linear-gradient(135deg,var(--vs-accent,#F2900F),var(--vs-accent-2,#E8830A)); color:#1a1200; border:none;
      box-shadow:var(--vs-shadow,0 16px 40px -18px rgba(33,29,22,.16)); cursor:pointer; font-size:24px;
      display:flex; align-items:center; justify-content:center; transition:transform .18s var(--vs-ease,cubic-bezier(.4,0,.2,1)); }
    #vscFab:hover{ transform:scale(1.07); }
    #vscPanel{ position:fixed; right:20px; bottom:88px; z-index:9998; width:min(360px,calc(100vw - 32px)); height:min(520px,calc(100vh - 140px));
      background:var(--vs-surface,#FFFFFF); border:1px solid var(--vs-border-1,#E7E0D3); border-radius:var(--vs-radius,16px);
      box-shadow:var(--vs-shadow,0 16px 40px -18px rgba(33,29,22,.16)); display:none; flex-direction:column; overflow:hidden;
      font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif; }
    #vscPanel.open{ display:flex; }
    #vscHead{ padding:14px 16px; background:linear-gradient(135deg,var(--vs-accent,#F2900F),var(--vs-accent-2,#E8830A)); color:#1a1200;
      display:flex; align-items:center; justify-content:space-between; font-weight:800; font-size:14px; flex-shrink:0; }
    #vscClose{ background:rgba(0,0,0,.12); border:none; color:#1a1200; width:26px; height:26px; border-radius:50%; cursor:pointer; font-size:13px; }
    #vscBody{ flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; background:var(--vs-bg,#FBF8F3); }
    .vsc-msg{ max-width:85%; padding:9px 12px; border-radius:12px; font-size:13.5px; line-height:1.5; white-space:pre-wrap; }
    .vsc-msg.bot{ align-self:flex-start; background:var(--vs-surface,#FFFFFF); border:1px solid var(--vs-border-1,#E7E0D3); color:var(--vs-text,#211D16); }
    .vsc-msg.user{ align-self:flex-end; background:var(--vs-accent-soft,#FDECD1); color:var(--vs-text,#211D16); }
    .vsc-msg.err{ align-self:flex-start; color:var(--vs-red,#C23B22); background:rgba(194,59,34,.08); border:1px solid rgba(194,59,34,.25); }
    .vsc-typing{ align-self:flex-start; font-size:12px; color:var(--vs-muted,#756D5E); font-style:italic; }
    #vscForm{ display:flex; gap:8px; padding:12px; border-top:1px solid var(--vs-border-1,#E7E0D3); flex-shrink:0; background:var(--vs-surface,#FFFFFF); }
    #vscInput{ flex:1; border:1px solid var(--vs-border-2,#DCD3C2); border-radius:10px; padding:9px 11px; font-size:13.5px;
      font-family:inherit; color:var(--vs-text,#211D16); background:var(--vs-surface,#FFFFFF); resize:none; }
    #vscInput:focus{ outline:none; border-color:var(--vs-accent-line,#F3C888); }
    #vscSend{ background:var(--vs-accent,#F2900F); color:#1a1200; border:none; border-radius:10px; padding:0 14px; font-weight:700;
      font-size:13px; cursor:pointer; flex-shrink:0; }
    #vscSend:disabled{ opacity:.5; cursor:not-allowed; }
    @media(max-width:480px){ #vscPanel{ right:10px; bottom:80px; } #vscFab{ right:14px; bottom:14px; } }
  `;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.id = 'vscFab';
  fab.title = T('vsc_title');
  fab.innerHTML = '💬';

  const panel = document.createElement('div');
  panel.id = 'vscPanel';
  panel.innerHTML = `
    <div id="vscHead"><span>💬 ${T('vsc_title')}</span><button id="vscClose">✕</button></div>
    <div id="vscBody"></div>
    <form id="vscForm">
      <textarea id="vscInput" rows="1" maxlength="800" placeholder="${T('vsc_placeholder')}"></textarea>
      <button id="vscSend" type="submit">${T('vsc_send')}</button>
    </form>`;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const body = panel.querySelector('#vscBody');
  const form = panel.querySelector('#vscForm');
  const input = panel.querySelector('#vscInput');
  const sendBtn = panel.querySelector('#vscSend');

  let history = [];
  let opened = false;

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function addMsg(role, text){
    const div = document.createElement('div');
    div.className = 'vsc-msg ' + (role === 'user' ? 'user' : role === 'err' ? 'err' : 'bot');
    div.innerHTML = esc(text);
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  fab.addEventListener('click', function(){
    opened = !opened;
    panel.classList.toggle('open', opened);
    if (opened && !body.children.length) addMsg('bot', T('vsc_greeting'));
    if (opened) input.focus();
  });
  panel.querySelector('#vscClose').addEventListener('click', function(){
    opened = false;
    panel.classList.remove('open');
  });

  input.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const msg = input.value.trim();
    if (!msg) return;
    addMsg('user', msg);
    history.push({ role: 'user', content: msg });
    input.value = '';
    sendBtn.disabled = true;

    const typing = document.createElement('div');
    typing.className = 'vsc-typing';
    typing.textContent = T('vsc_thinking');
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;

    try {
      const res = await fetch(API_BASE + '/api/public/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: history.slice(-6), language: lang })
      });
      typing.remove();
      if (res.status === 429) { addMsg('err', T('vsc_ratelimit')); return; }
      if (!res.ok) { addMsg('err', T('vsc_error')); return; }
      const data = await res.json();
      const reply = data.reply || T('vsc_error');
      addMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      typing.remove();
      addMsg('err', T('vsc_error'));
    } finally {
      sendBtn.disabled = false;
    }
  });
})();
