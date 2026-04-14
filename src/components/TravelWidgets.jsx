import { useState, useEffect } from 'react';

// ─── Static Data ───────────────────────────────────────────────────────────────

const PHRASE_DB = {
  japan:    { name: 'Japanisch', flag: '🇯🇵', phrases: [['Danke','ありがとう','Arigatō'],['Bitte','お願いします','Onegaishimasu'],['Entschuldigung','すみません','Sumimasen'],['Wo ist...?','どこですか？','Doko desu ka?'],['Wie viel?','いくらですか？','Ikura desu ka?'],['Hilfe!','助けて！','Tasukete!'],['Rechnung','お会計','O-kaikei'],['Kein Fleisch','肉なし','Niku nashi']] },
  thai:     { name: 'Thai', flag: '🇹🇭', phrases: [['Danke','ขอบคุณครับ','Khob khun khrap'],['Bitte','ขอ...หน่อย','Kho...noi'],['Entschuldigung','ขอโทษ','Kho thot'],['Wo ist...?','...อยู่ที่ไหน？','...yuu thii nai?'],['Wie viel?','เท่าไหร่？','Thao rai?'],['Hilfe!','ช่วยด้วย！','Chuay duay!'],['Rechnung','เช็คบิล','Check bin'],['Scharf?','เผ็ด？','Phet?']] },
  indonesisch: { name: 'Indonesisch', flag: '🇮🇩', phrases: [['Danke','Terima kasih','Te-ri-ma ka-sih'],['Bitte','Tolong','To-long'],['Entschuldigung','Maaf','Ma-af'],['Wo ist...?','Di mana...?','Di ma-na?'],['Wie viel?','Berapa?','Be-ra-pa?'],['Hilfe!','Tolong！','To-long!'],['Rechnung','Minta bon','Min-ta bon'],['Nicht scharf','Tidak pedas','Ti-dak pe-das']] },
  arabisch:  { name: 'Arabisch', flag: '🇲🇦', phrases: [['Danke','شكراً','Shukran'],['Bitte','من فضلك','Min fadlak'],['Entschuldigung','عفواً','Afwan'],['Wo ist...?','أين...؟','Ayna...?'],['Wie viel?','بكم؟','Bikam?'],['Hilfe!','ساعدني！','Saaidni!'],['Rechnung','الحساب','Al-hisab'],['Sehr gut','ممتاز','Mumtaz']] },
  franzoesisch: { name: 'Französisch', flag: '🇫🇷', phrases: [['Danke','Merci','Merr-si'],['Bitte','S\'il vous plaît','Sil-vu-plä'],['Entschuldigung','Excusez-moi','Eks-kü-se-mwa'],['Wo ist...?','Où est...?','Uu-ä?'],['Wie viel?','Combien?','Kom-biän?'],['Hilfe!','Au secours!','O-skuur!'],['Rechnung','L\'addition','La-di-siõ'],['Karte?','La carte?','La-kart?']] },
  spanisch:  { name: 'Spanisch', flag: '🇪🇸', phrases: [['Danke','Gracias','Gra-ssias'],['Bitte','Por favor','Por-fa-bor'],['Entschuldigung','Perdón','Per-don'],['Wo ist...?','¿Dónde está...?','Don-de-es-ta?'],['Wie viel?','¿Cuánto cuesta?','Kuan-to-kues-ta?'],['Hilfe!','¡Ayuda!','A-yu-da!'],['Rechnung','La cuenta','La-kuen-ta'],['Sehr lecker','Muy rico','Mui-ri-ko']] },
  italienisch: { name: 'Italienisch', flag: '🇮🇹', phrases: [['Danke','Grazie','Gra-tsie'],['Bitte','Per favore','Per-fa-vo-re'],['Entschuldigung','Scusi','Sku-si'],['Wo ist...?','Dov\'è...?','Do-veh?'],['Wie viel?','Quanto costa?','Kuan-to-kos-ta?'],['Hilfe!','Aiuto!','A-iu-to!'],['Rechnung','Il conto','Il-kon-to'],['Sehr gut','Molto bene','Mol-to-be-ne']] },
  griechisch: { name: 'Griechisch', flag: '🇬🇷', phrases: [['Danke','Ευχαριστώ','Ef-cha-ri-sto'],['Bitte','Παρακαλώ','Pa-ra-ka-lo'],['Entschuldigung','Συγγνώμη','Sig-no-mi'],['Wo ist...?','Πού είναι...?','Pu-ine?'],['Wie viel?','Πόσο κοστίζει;','Po-so-kos-ti-zi?'],['Hilfe!','Βοήθεια!','Vo-i-thia!'],['Rechnung','Τον λογαριασμό','Ton-lo-ga-rias-mo'],['Cheers','Στην υγειά σας','Stin-i-gia-sas']] },
  tuerkisch:  { name: 'Türkisch', flag: '🇹🇷', phrases: [['Danke','Teşekkürler','Te-shek-kür-ler'],['Bitte','Lütfen','Lüt-fen'],['Entschuldigung','Özür dilerim','Ö-zür-di-le-rim'],['Wo ist...?','...nerede?','...ne-re-de?'],['Wie viel?','Ne kadar?','Ne-ka-dar?'],['Hilfe!','İmdat!','Im-dat!'],['Rechnung','Hesap','He-sap'],['Sehr schön','Çok güzel','Chok-gü-zel']] },
  vietnamesisch: { name: 'Vietnamesisch', flag: '🇻🇳', phrases: [['Danke','Cảm ơn','Cam-on'],['Bitte','Làm ơn','Lam-on'],['Entschuldigung','Xin lỗi','Sin-loi'],['Wo ist...?','...ở đâu?','...o dau?'],['Wie viel?','Bao nhiêu?','Bao-nhieu?'],['Hilfe!','Cứu tôi!','Kuu-toi!'],['Rechnung','Tính tiền','Tinh-tien'],['Lecker!','Ngon!','Ngon']] },
  koreanisch: { name: 'Koreanisch', flag: '🇰🇷', phrases: [['Danke','감사합니다','Gam-sa-ham-ni-da'],['Bitte','주세요','Ju-se-yo'],['Entschuldigung','죄송합니다','Joe-song-ham-ni-da'],['Wo ist...?','...어디예요?','...eo-di-ye-yo?'],['Wie viel?','얼마예요?','Eol-ma-ye-yo?'],['Hilfe!','도와주세요!','Do-wa-ju-se-yo!'],['Rechnung','계산해주세요','Kye-san-he-ju-se-yo'],['Lecker!','맛있어요!','Ma-shi-sseo-yo!']] },
  portugiesisch: { name: 'Portugiesisch', flag: '🇵🇹', phrases: [['Danke','Obrigado/a','O-bri-ga-du'],['Bitte','Por favor','Por-fa-vor'],['Entschuldigung','Desculpe','Desh-kul-pe'],['Wo ist...?','Onde fica...?','On-de-fi-ka?'],['Wie viel?','Quanto custa?','Kuan-to-kush-ta?'],['Hilfe!','Socorro!','So-ko-ru!'],['Rechnung','A conta','A-kon-ta'],['Sehr lecker','Muito bom','Mui-tu-bom']] },
};

const DEST_LANG = {
  tokio:'japan', kyoto:'japan', osaka:'japan', japan:'japan',
  bangkok:'thai', thailand:'thai', 'chiang mai':'thai', phuket:'thai',
  bali:'indonesisch', jakarta:'indonesisch', lombok:'indonesisch',
  marrakesch:'arabisch', marokko:'arabisch', dubai:'arabisch', abu:'arabisch',
  paris:'franzoesisch', nizza:'franzoesisch', lyon:'franzoesisch', bordeaux:'franzoesisch',
  barcelona:'spanisch', madrid:'spanisch', sevilla:'spanisch', ibiza:'spanisch', mallorca:'spanisch', teneriffa:'spanisch', 'gran canaria':'spanisch', mexiko:'spanisch', havanna:'spanisch', 'buenos aires':'spanisch',
  rom:'italienisch', mailand:'italienisch', florenz:'italienisch', venedig:'italienisch', sizilien:'italienisch',
  santorini:'griechisch', athen:'griechisch', mykonos:'griechisch', kreta:'griechisch',
  istanbul:'tuerkisch', antalya:'tuerkisch', kappadokien:'tuerkisch',
  hanoi:'vietnamesisch', 'ho-chi-minh':'vietnamesisch', vietnam:'vietnamesisch', hoi:'vietnamesisch',
  seoul:'koreanisch', busan:'koreanisch', korea:'koreanisch',
  lissabon:'portugiesisch', porto:'portugiesisch', algarve:'portugiesisch',
};

const EMERGENCY_DB = {
  japan:        { police:'110', ambulance:'119', fire:'119', embassy:'+81 3-5791-7753', tip:'Englische Hilfe: 03-3501-0110' },
  thai:         { police:'191', ambulance:'1669', fire:'199', embassy:'+66 2 287-1936', tip:'Tourist Police: 1155' },
  indonesisch:  { police:'110', ambulance:'118', fire:'113', embassy:'+62 21 2555-7555', tip:'Bali Krankenhaus: BIMC +62 361-761-263' },
  arabisch:     { police:'19', ambulance:'150', fire:'15', embassy:'+212 537-65-93-23', tip:'Tourist Police: 0524-384601 (Marrakesch)' },
  dubai_special:{ police:'999', ambulance:'998', fire:'997', embassy:'+971 4-349-2000', tip:'24h-Notruf: 800-POLICE' },
  franzoesisch: { police:'17', ambulance:'15', fire:'18', embassy:'+33 1 45 74 00 00', tip:'Euronotruf: 112' },
  spanisch:     { police:'091', ambulance:'061', fire:'080', embassy:'+34 91 557-9000', tip:'Euronotruf: 112' },
  italienisch:  { police:'113', ambulance:'118', fire:'115', embassy:'+39 06 4920-0160', tip:'Euronotruf: 112' },
  griechisch:   { police:'100', ambulance:'166', fire:'199', embassy:'+30 210 728-5111', tip:'Euronotruf: 112' },
  tuerkisch:    { police:'155', ambulance:'112', fire:'110', embassy:'+90 312 459-1500', tip:'Tourist Police: +90 212 527-4503' },
  vietnamesisch:{ police:'113', ambulance:'115', fire:'114', embassy:'+84 24 3845-0836', tip:'Hotline Touristen: 1800 599 920' },
  koreanisch:   { police:'112', ambulance:'119', fire:'119', embassy:'+82 2 748-4080', tip:'Foreigner Line: 1345' },
  portugiesisch:{ police:'112', ambulance:'112', fire:'112', embassy:'+351 213 810-440', tip:'Euronotruf: 112' },
  usa:          { police:'911', ambulance:'911', fire:'911', embassy:'+1 202 238-0000', tip:'Notruf überall: 911' },
  uk:           { police:'999', ambulance:'999', fire:'999', embassy:'+44 20 7824-1300', tip:'Euronotruf: 112 auch in UK' },
};

const DEST_EMERGENCY = {
  tokio:'japan', kyoto:'japan', japan:'japan',
  bangkok:'thai', thailand:'thai', 'chiang mai':'thai',
  bali:'indonesisch', jakarta:'indonesisch',
  marrakesch:'arabisch', marokko:'arabisch',
  dubai:'dubai_special', 'abu dhabi':'dubai_special',
  paris:'franzoesisch', nizza:'franzoesisch',
  barcelona:'spanisch', madrid:'spanisch', ibiza:'spanisch', mallorca:'spanisch', teneriffa:'spanisch', mexiko:'spanisch',
  rom:'italienisch', florenz:'italienisch', venedig:'italienisch',
  santorini:'griechisch', athen:'griechisch',
  istanbul:'tuerkisch', antalya:'tuerkisch',
  hanoi:'vietnamesisch', vietnam:'vietnamesisch',
  seoul:'koreanisch', korea:'koreanisch',
  lissabon:'portugiesisch', porto:'portugiesisch',
  'new york':'usa', miami:'usa', 'los angeles':'usa', usa:'usa',
  london:'uk', edinburgh:'uk',
};

const TIPPING_DB = {
  japan:        { icon:'🚫', color:'#dc2626', text:'Kein Trinkgeld — gilt als unhöflich in Japan', sub:'Einfach "keinen Wechsel zurück" sagen kränkt Japaner' },
  koreanisch:   { icon:'🚫', color:'#dc2626', text:'Kein Trinkgeld erwartet', sub:'Zunehmend in Touristenrestaurants akzeptiert' },
  china:        { icon:'🚫', color:'#dc2626', text:'Trinkgeld nicht üblich', sub:'In Luxushotels inzwischen akzeptiert' },
  usa:          { icon:'💵', color:'#16a34a', text:'15–20% im Restaurant — immer erwartet', sub:'Unter 15% gilt als Beleidigung des Servicepersonals' },
  kanada:       { icon:'💵', color:'#16a34a', text:'15–18% im Restaurant üblich', sub:'Ähnlich wie USA — wird erwartet' },
  thai:         { icon:'💰', color:'#f59e0b', text:'20–50 Baht (~1–2€) im Restaurant', sub:'Taxi: Aufrunden auf ganze Zahl' },
  indonesisch:  { icon:'💰', color:'#f59e0b', text:'10–15%, oft schon inklusive (service charge)', sub:'Prüfe die Rechnung — "service" bedeutet Trinkgeld bereits drin' },
  arabisch:     { icon:'💰', color:'#f59e0b', text:'10–15% üblich, v.a. bei Touristenrestaurants', sub:'Guides und Fahrer: 20–50 Dirham (~2–5€)' },
  dubai_special:{ icon:'💰', color:'#f59e0b', text:'10–15%, oft auf Rechnung', sub:'Taxifahrer: Aufrunden; Hotel-Träger: 5–10 AED' },
  franzoesisch: { icon:'👍', color:'#2563eb', text:'5–10% wenn zufrieden, Service oft inklusive', sub:'"Service compris" auf Rechnung = bereits drin' },
  spanisch:     { icon:'👍', color:'#2563eb', text:'Aufrunden oder 1–2€, nicht obligatorisch', sub:'In Touristengegenden 5–10% zunehmend erwartet' },
  italienisch:  { icon:'👍', color:'#2563eb', text:'"Coperto" (Tischgeld) meist inklusive, 1–2€ extra nett', sub:'Coperto ≠ Trinkgeld — extra Trinkgeld immer freiwillig' },
  griechisch:   { icon:'👍', color:'#2563eb', text:'5–10% reicht, nicht verpflichtend', sub:'Inseln: etwas mehr als Festland' },
  tuerkisch:    { icon:'💰', color:'#f59e0b', text:'10–15% in Restaurants üblich', sub:'Touristenorte: höhere Erwartungen' },
  vietnamesisch:{ icon:'👍', color:'#2563eb', text:'10–15% in Touristenrestaurants', sub:'Straßenessen: kein Trinkgeld nötig' },
  portugiesisch:{ icon:'👍', color:'#2563eb', text:'5–10% wenn zufrieden', sub:'Aufrunden gilt als nett aber nicht erwartet' },
  uk:           { icon:'👍', color:'#2563eb', text:'10–15% üblich, wenn kein "service charge"', sub:'Prüfe die Rechnung auf "service charge"' },
};

const BEST_TIME_DB = {
  bali:         { best:'Apr–Okt', why:'Trockenzeit, 28°C, wenig Regen', avoid:'Nov–März (Monsun, tägl. Gewitter)', icon:'☀️' },
  tokio:        { best:'Mär–Mai & Sep–Nov', why:'Kirschblüte / Herbstlaub, 15–25°C', avoid:'Jun–Aug (heiß & schwül bis 38°C)', icon:'🌸' },
  japan:        { best:'Mär–Mai & Sep–Nov', why:'Kirschblüte oder Herbstfarben, angenehme Temps', avoid:'Jul–Aug (Hitze & Tsuyu-Regenzeit)', icon:'🌸' },
  marrakesch:   { best:'Mär–Mai & Sep–Nov', why:'20–28°C, kein Extremhitze', avoid:'Jul–Aug (45°C+, kaum auszuhalten)', icon:'🌿' },
  marokko:      { best:'Mär–Mai & Sep–Nov', why:'Angenehmes Klima, 20–28°C', avoid:'Jul–Aug (extrem heiß)', icon:'🌿' },
  bangkok:      { best:'Nov–Feb', why:'Trockenzeit, 25–30°C, wenig Regen', avoid:'Mai–Okt (Monsun)', icon:'🌴' },
  thailand:     { best:'Nov–Feb', why:'Trockenzeit, klarer Himmel, 28°C', avoid:'Apr–Sep (Monsunzeit im Süden)', icon:'🌴' },
  dubai:        { best:'Nov–Mär', why:'20–28°C, perfektes Wetter', avoid:'Jun–Sep (46°C+ draußen kaum möglich)', icon:'❄️' },
  'new york':   { best:'Mai–Jun & Sep–Okt', why:'18–24°C, Stadtleben auf Hochtouren', avoid:'Jul–Aug (Schwüle & Massen)', icon:'🗽' },
  miami:        { best:'Nov–Apr', why:'25–28°C, Trockenzeit', avoid:'Jun–Okt (Hurrikansaison & extreme Hitze)', icon:'🌊' },
  santorini:    { best:'Mai–Jun & Sep', why:'24–27°C, ruhiger als Hochsaison', avoid:'Jul–Aug (40°C+, überfüllt, teuer)', icon:'💙' },
  athen:        { best:'Apr–Jun & Sep–Okt', why:'22–28°C, alle Sehenswürdigkeiten zugänglich', avoid:'Jul–Aug (40°C+, Massen)', icon:'🏛️' },
  barcelona:    { best:'Mai–Jun & Sep–Okt', why:'22–27°C, kein Massentourismus', avoid:'Jul–Aug (überfüllt, 38°C+)', icon:'🌊' },
  lissabon:     { best:'Mai–Okt', why:'20–28°C, viel Sonne, perfektes Klima', avoid:'Nov–Feb (kühl & regnerisch)', icon:'🌞' },
  porto:        { best:'Jun–Sep', why:'25°C, trocken, ideale Bedingungen', avoid:'Nov–Feb (viel Regen)', icon:'🍷' },
  rom:          { best:'Apr–Jun & Sep–Okt', why:'22–28°C, Touristenansturm hält sich', avoid:'Jul–Aug (40°C+, volle Museen)', icon:'🏛️' },
  florenz:      { best:'Apr–Jun & Sep–Okt', why:'Angenehme 22–28°C', avoid:'Jul–Aug (extrem voll & heiß)', icon:'🎨' },
  venedig:      { best:'Apr–Jun & Sep–Okt', why:'Keine Massen, 20–26°C', avoid:'Jul–Aug (Massen, Gestank)', icon:'🛶' },
  istanbul:     { best:'Apr–Jun & Sep–Nov', why:'18–26°C, kein Extremhitze', avoid:'Jul–Aug (35°C+, Hochsaison)', icon:'🕌' },
  kapstadt:     { best:'Nov–Feb', why:'Südsommer, 26–30°C, Strandwetter', avoid:'Mai–Aug (Regen & 15°C)', icon:'🌊' },
  'buenos aires':{ best:'Mär–Mai & Sep–Nov', why:'Südfrühling/-herbst, 18–25°C', avoid:'Jan–Feb (schwüle 35°C+)', icon:'🌮' },
  'chiang mai': { best:'Nov–Feb', why:'Kühler & trocken, 25–30°C', avoid:'Mär–Mai (smoky season, Waldbrände)', icon:'🏔️' },
  hanoi:        { best:'Okt–Dez & Mär–Apr', why:'25°C, wenig Regen', avoid:'Jun–Aug (schwül & Regen)', icon:'🌿' },
  reykjavik:    { best:'Jun–Aug', why:'Mitternachtssonne, 12–16°C, alle Straßen offen', avoid:'Nov–Feb (4h Tageslicht, Stürme)', icon:'🌅' },
  kopenhagen:   { best:'Jun–Aug', why:'20–23°C, lange Tage, Festivals', avoid:'Nov–Feb (kalt, dunkel, 2°C)', icon:'🚲' },
  amsterdam:    { best:'Mai–Sep', why:'18–22°C, alles geöffnet, beste Biergärten', avoid:'Nov–Jan (kalt, grau, Touristenflaute)', icon:'🌷' },
  prag:         { best:'Mai–Sep', why:'20–25°C, Außengastronomie, schöne Altstadt', avoid:'Dez–Feb (kalt, aber Weihnachtsmarkt ✓)', icon:'🍺' },
  budapest:     { best:'Mai–Sep', why:'22–27°C, Thermalbäder & Donau', avoid:'Nov–Feb (kalt & grau)', icon:'🛁' },
};

function getDestKey(destination, db) {
  const d = destination.toLowerCase();
  return Object.keys(db).find(k => d.includes(k)) || null;
}

// ─── Countdown Widget ──────────────────────────────────────────────────────────

export function CountdownWidget({ destination, travelDate, emoji }) {
  const [days, setDays] = useState(null);

  useEffect(() => {
    if (!travelDate) return;
    const calc = () => {
      const diff = Math.ceil((new Date(travelDate + 'T00:00:00') - new Date()) / 86400000);
      setDays(diff);
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [travelDate]);

  if (!travelDate || days === null || days < 0) return null;

  return (
    <div style={{ background: days <= 7 ? 'linear-gradient(135deg,#fef3c7,#fde68a)' : 'linear-gradient(135deg,#eff6ff,#dbeafe)', borderRadius: 20, padding: 20, marginBottom: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 4 }}>{days === 0 ? '🛫' : days <= 3 ? '⏳' : emoji || '✈️'}</div>
        {days === 0 ? (
          <div style={{ fontSize: 18, fontWeight: 900, color: '#dc2626' }}>Heute geht es los! 🎉</div>
        ) : (
          <>
            <div style={{ fontSize: 36, fontWeight: 900, color: days <= 7 ? '#92400e' : '#1e40af', letterSpacing: '-1px' }}>{days}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: days <= 7 ? '#78350f' : '#1d4ed8', marginBottom: 2 }}>
              {days === 1 ? 'Tag' : 'Tage'} bis {destination}
            </div>
          </>
        )}
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
          {new Date(travelDate + 'T12:00:00').toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
    </div>
  );
}

// ─── Phrases Widget ────────────────────────────────────────────────────────────

export function PhrasesWidget({ destination }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const key = getDestKey(destination, DEST_LANG);
  const data = key ? PHRASE_DB[DEST_LANG[key]] : null;
  if (!data) return null;

  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div style={{ background: '#fff', borderRadius: 20, marginTop: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', background: 'none', border: 'none', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{data.flag} Nützliche Phrasen auf {data.name}</span>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Antippen zum Kopieren</div>
        </div>
        <span style={{ fontSize: 20, color: '#94a3b8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px' }}>
          {data.phrases.map(([de, local, phonetic], i) => (
            <div key={i} onClick={() => copy(local)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 12, marginBottom: 6, background: copied === local ? '#f0fdf4' : '#f8fafc', cursor: 'pointer', border: `1px solid ${copied === local ? '#86efac' : '#f1f5f9'}`, transition: 'all 0.15s' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{de}</div>
                <div style={{ fontSize: 15, color: '#2563eb', fontWeight: 600, marginTop: 1 }}>{local}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>/{phonetic}/</div>
              </div>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{copied === local ? '✓' : '📋'}</span>
            </div>
          ))}
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Auf Phrase tippen → in Zwischenablage kopieren</div>
        </div>
      )}
    </div>
  );
}

// ─── Emergency Numbers ─────────────────────────────────────────────────────────

export function EmergencyWidget({ destination }) {
  const [open, setOpen] = useState(false);
  const key = getDestKey(destination, DEST_EMERGENCY);
  const data = key ? EMERGENCY_DB[DEST_EMERGENCY[key]] : { police:'112', ambulance:'112', fire:'112', embassy:'Auswärtiges Amt: +49 30 5000-0', tip:'EU-Notruf 112 gilt in fast allen Ländern' };

  return (
    <div style={{ background: '#fff', borderRadius: 20, marginTop: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', background: 'none', border: 'none', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>🆘 Notfallnummern für {destination}</span>
        <span style={{ fontSize: 20, color: '#94a3b8', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[['🚓 Polizei', data.police],['🚑 Krankenwagen', data.ambulance],['🚒 Feuerwehr', data.fire],['🏛️ Deutsche Botschaft', data.embassy]].map(([label, num]) => (
            <a key={label} href={`tel:${num?.replace(/\s/g,'')}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: label.includes('Botschaft') ? '#fff7ed' : '#f8fafc', borderRadius: 12, padding: '11px 14px', textDecoration: 'none', border: `1px solid ${label.includes('Botschaft') ? '#fed7aa' : '#f1f5f9'}` }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: label.includes('Botschaft') ? '#c2410c' : '#dc2626' }}>{num}</span>
            </a>
          ))}
          {data.tip && <div style={{ fontSize: 12, color: '#64748b', background: '#f0fdf4', borderRadius: 10, padding: '8px 12px', marginTop: 4 }}>💡 {data.tip}</div>}
          <div style={{ fontSize: 11, color: '#94a3b8' }}>Auf Nummer tippen → direkt anrufen</div>
        </div>
      )}
    </div>
  );
}

// ─── Tipping Widget ────────────────────────────────────────────────────────────

export function TippingWidget({ destination }) {
  const key = getDestKey(destination, DEST_LANG);
  const langKey = key ? DEST_LANG[key] : null;
  // Special cases
  const destLower = destination.toLowerCase();
  const data = (() => {
    if (destLower.includes('dubai') || destLower.includes('abu dhabi')) return TIPPING_DB.dubai_special;
    if (destLower.includes('new york') || destLower.includes('miami') || destLower.includes('usa')) return TIPPING_DB.usa;
    if (destLower.includes('london') || destLower.includes('edinburgh')) return TIPPING_DB.uk;
    if (langKey && TIPPING_DB[langKey]) return TIPPING_DB[langKey];
    return null;
  })();
  if (!data) return null;

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '16px 20px', marginTop: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>🪙 Trinkgeld-Info</div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#f8fafc', borderRadius: 14, padding: '12px 14px' }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>{data.icon}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: data.color }}>{data.text}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{data.sub}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Best Time Widget ──────────────────────────────────────────────────────────

export function BestTimeWidget({ destination }) {
  const key = getDestKey(destination, BEST_TIME_DB);
  const data = key ? BEST_TIME_DB[key] : null;
  if (!data) return null;

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '16px 20px', marginTop: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>📅 Beste Reisezeit</div>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, background: '#f0fdf4', borderRadius: 12, padding: '10px 12px', border: '1px solid #86efac' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 3 }}>✅ BESTE ZEIT</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{data.icon} {data.best}</div>
          <div style={{ fontSize: 11, color: '#166534', marginTop: 3 }}>{data.why}</div>
        </div>
        <div style={{ flex: 1, background: '#fff7ed', borderRadius: 12, padding: '10px 12px', border: '1px solid #fed7aa' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#c2410c', marginBottom: 3 }}>⚠️ MEIDEN</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{data.avoid}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Dos & Don'ts Widget ───────────────────────────────────────────────────────

const DOS_DONTS_DB = {
  japan:        { dos: ['Schuhe ausziehen beim Betreten von Häusern','Leise in U-Bahnen & öffentlichen Orten','Mit beiden Händen Visitenkarten reichen','Schlange stehen & Ordnung einhalten'], donts: ['Nie trinkend auf der Straße laufen','Kein Trinkgeld geben — gilt als unhöflich!','Nicht laut telefonieren in der Bahn','Nie Essstäbchen senkrecht in Reis stecken'] },
  thai:         { dos: ['Beim Betreten von Tempeln Schuhe ausziehen','Knöchel & Schultern in Tempeln bedecken','Mit einem Lächeln grüßen (Wai-Geste)','Mit etwas Respekt über die Monarchie sprechen'], donts: ['Nie mit dem Fuß auf etwas zeigen','Den Kopf einer Person nicht anfassen','Keine Kritik an der Königsfamilie','In Tempeln nicht Küssen oder Umarmen'] },
  indonesisch:  { dos: ['Mit rechter Hand essen & nehmen','In Tempeln Sarong tragen','Respektvoller Umgang mit der Natur','Erlaubnis vor dem Fotografieren fragen'], donts: ['Linke Hand beim Essen vermeiden','Nicht oben ohne an heiligen Stätten','Keine laute Kritik an der Regierung','Nicht ins Meer urinieren — heiliges Wasser'] },
  arabisch:     { dos: ['Ramadan respektieren (nicht öffentlich essen)','Konservativ kleiden (Frauen Kopfbedeckung)','Mit der rechten Hand essen & grüßen','Erlaubnis vor dem Fotografieren von Personen'], donts: ['Kein Alkohol auf der Straße (Dubai: verboten)','Keine Zuneigung in der Öffentlichkeit','Frauen nicht ohne Erlaubnis anfassen','Keine Kritik am Islam oder Königshaus'] },
  franzoesisch: { dos: ['Mit "Bonjour" in Läden grüßen','Beim Betreten von Restaurants höflich fragen','Wein & Essen in Ruhe genießen','Kleidung im Restaurant: gepflegt'], donts: ['Nicht sofort Englisch sprechen — erst Français versuchen','Kein Smalltalk mit Fremden im Metro','Nicht am Tisch über Geld reden','Keine laute Unterhaltung in Museen'] },
  spanisch:     { dos: ['Spät essen — Dinner ab 21:00 Uhr!','Siesta respektieren (13–17 Uhr)','Freundlich & offen kommunizieren','Wangenkuss zur Begrüßung bei Bekannten'], donts: ['Restaurants vor 21 Uhr nicht erwarten voll','Nie hetzen — „mañana" ist eine Lebensweise','Keine lauten Touristen-Klischees','Nie Katalanen als Spanier bezeichnen'] },
  italienisch:  { dos: ['Espresso nur im Stehen — billiger & authentischer','Schick kleiden für Abendessen','Mittagspause von 13–15 Uhr beachten','Pasta & Wein kombinieren wie Einheimische'], donts: ['Nie Cappuccino nach dem Mittag','Keine Touristenfallen (Piazza Navona!)','Nicht mit knapper Kleidung in Kirchen','Nie Parmesan auf Meeresfrüchte-Pasta'] },
  griechisch:   { dos: ['Nachmittagspause (14–17 Uhr) respektieren','Ouzo oder Raki zur Meze annehmen','In Kirchen Schultern & Knie bedecken','Herzlich & offen auf Einladungen reagieren'], donts: ['Nicht mit flacher Hand winken (Moutza-Beleidigung!)','Keine Schuhe in orthodoxen Kirchen','Nicht über Zypern-Konflikt diskutieren','Kein lautes Verhalten in ruhigen Dörfern'] },
  tuerkisch:    { dos: ['Schuhe in Moscheen ausziehen & bedecken','Çay (Tee) annehmen — Ablehnung gilt als unhöflich','Feilschen auf Basaren ist erwünscht!','Gastfreundschaft mit Danke erwidern'], donts: ['Nicht mit der Sohle auf Teppiche treten','Keine politischen Debatten mit Fremden','Keine Küsse in der Öffentlichkeit','Nie die Türkei-Griechenland-Rivalität ansprechen'] },
  vietnamesisch:{ dos: ['Ältere Menschen zuerst grüßen','Mit beiden Händen geben & nehmen','Schuhe vor Tempeln ausziehen','Leise in Tempeln & heiligen Stätten'], donts: ['Nicht auf Geister-Altäre zeigen','Keine politischen Debatten','Nicht laut lachen über Missgeschicke','Nie Stäbchen senkrecht in Reisschüssel stecken'] },
  koreanisch:   { dos: ['Älteren Menschen zuerst trinken lassen','Beide Hände beim Geben & Nehmen','Schuhe ausziehen in vielen Restaurants','Einladungen zum Essen gerne annehmen'], donts: ['Nie selbst sein eigenes Glas einschenken','Keine Diskussionen über Nord/Südkorea','Nicht Essen ablehnen ohne Erklärung','Nie mit Rotstift Namen schreiben (Unglück)'] },
  portugiesisch:{ dos: ['Saudade — Gefühle & Nostalgie teilen','Fado-Shows respektvoll zuhören','Pastéis de Nata immer frisch essen','Auf „Obrigado/a" bestehen — Danke sagen'], donts: ['Nie Brasilianer als gleiche Portugiesen behandeln','Keine Überheblichkeit gegenüber Spaniern','Nicht auf Spanisch antworten wenn Portugiesisch gesprochen wird','Fado-Shows nie unterbrechen'] },
  usa:          { dos: ['Trinkgeld 18–25% in Restaurants','Freundlich & direkt kommunizieren','Schlange stehen & Ordnung halten','Small Talk mit Fremden ist normal & erwünscht'], donts: ['Nie unter 15% Trinkgeld geben','Nicht über Politisches mit Fremden diskutieren','Keine Witze über Sicherheit im Flughafen','Nie in der Öffentlichkeit Alkohol trinken'] },
};

const DEST_DODOSNTS = {
  tokio:'japan', kyoto:'japan', osaka:'japan',
  bangkok:'thai', phuket:'thai', 'chiang mai':'thai',
  bali:'indonesisch', lombok:'indonesisch',
  marrakesch:'arabisch', dubai:'arabisch', 'abu dhabi':'arabisch',
  paris:'franzoesisch', nizza:'franzoesisch',
  barcelona:'spanisch', madrid:'spanisch', mallorca:'spanisch', teneriffa:'spanisch',
  rom:'italienisch', florenz:'italienisch', venedig:'italienisch',
  santorini:'griechisch', athen:'griechisch', mykonos:'griechisch',
  istanbul:'tuerkisch', antalya:'tuerkisch',
  hanoi:'vietnamesisch', 'ho-chi-minh':'vietnamesisch',
  seoul:'koreanisch', busan:'koreanisch',
  lissabon:'portugiesisch', porto:'portugiesisch',
  'new york':'usa', miami:'usa',
};

export function DosDontsWidget({ destination }) {
  const [open, setOpen] = useState(false);
  const destLower = destination?.toLowerCase() || '';
  const key = (() => {
    if (DEST_DODOSNTS[destLower]) return DEST_DODOSNTS[destLower];
    const match = Object.entries(DEST_DODOSNTS).find(([k]) => destLower.includes(k) || k.includes(destLower));
    return match ? match[1] : null;
  })();
  const data = key ? DOS_DONTS_DB[key] : null;
  if (!data) return null;

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '16px 20px', marginTop: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
      <button type="button" onClick={() => setOpen(v => !v)} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>🙏 Kulturelle Dos &amp; Don'ts</div>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '12px 14px', border: '1px solid #86efac' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 8, letterSpacing: '0.3px' }}>✅ TUN</div>
            {data.dos.map((item, i) => (
              <div key={i} style={{ fontSize: 12, color: '#166534', marginBottom: 6, lineHeight: 1.4, display: 'flex', gap: 6 }}>
                <span style={{ flexShrink: 0, color: '#22c55e' }}>•</span>{item}
              </div>
            ))}
          </div>
          <div style={{ background: '#fff1f2', borderRadius: 14, padding: '12px 14px', border: '1px solid #fecaca' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginBottom: 8, letterSpacing: '0.3px' }}>❌ LASSEN</div>
            {data.donts.map((item, i) => (
              <div key={i} style={{ fontSize: 12, color: '#991b1b', marginBottom: 6, lineHeight: 1.4, display: 'flex', gap: 6 }}>
                <span style={{ flexShrink: 0 }}>•</span>{item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
