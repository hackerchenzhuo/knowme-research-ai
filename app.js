'use strict';

// Locale copy
const english = document.documentElement.lang === 'en';
const dictionary={
  '保存译法':'Save term','已保存':'Saved',
  '按领域与语境，沿用个人译法。':'Keep your terminology consistent with the domain and context.',
  'Agent 推理':'Agent reasoning','文档结构':'Document','表格与链接':'Tables & links','代码与译法':'Code & terms',
  '多维加权 · 按你的研究偏好排序':'Multiple dimensions · Weighted to your research',
  '保留结构 · 沿用你的译法':'Original structure · Your preferred terms',
  '多论文 Markdown 阅读笔记 · 预置中英示例，不调用模型。':'Multi-paper Markdown reading brief · Preset English and Chinese examples. No model calls.',
};
const t = value => english ? (dictionary[value] ?? value) : value;

// Public screenshots and a prewritten Markdown reading note. No extension engine runs here.
Object.assign(dictionary, {
  '论文选读 · RRSI':'Reading list · RRSI',
  '论文选读 · When Agents Slow Down':'Reading list · When Agents Slow Down',
  '论文选读 · WearableQA':'Reading list · WearableQA',
  '论文选读 · Conversation Compiler':'Reading list · Conversation Compiler',
  '研究图谱 · 公开书目':'Research map · Public bibliography',
  '从标题、作者与机构，快速找到值得继续读的论文。':'Find your next read through titles, authors and affiliations.',
  '研究方向、作者线索与个人评分，同屏呈现。':'Research topics, author signals and personal scores, together.',
  '研究线索、机构来源与个人评分，同屏呈现。':'Research topics, affiliations and personal scores, together.',
  '从摘要到代码入口，沿着论文继续探索。':'Follow the paper from its abstract to the original code.',
  '从论文到作者网络，探索研究之间的联系。':'Follow the connections between papers and their authors.',
  '可穿戴问答':'Wearable QA','对话轨迹':'Agent traces','研究图谱':'Research map',
  '论文雷达工作台：RRSI 的独立论文卡片与个人评分。':'Paper Radar workbench: RRSI with its personal scores.',
  '论文雷达工作台：When Agents Slow Down 的独立论文卡片。':'Paper Radar workbench: a dedicated view of When Agents Slow Down.',
  '论文雷达工作台：WearableQA 的论文、作者与机构标签。':'Paper Radar workbench: WearableQA, authors and affiliations.',
  '论文雷达工作台：Conversation Compiler 的论文卡片与代码入口。':'Paper Radar workbench: Conversation Compiler and its code link.',
  '研究图谱：公开书目中的作者与合作关系。':'Research map: authors and coauthorship from public bibliography.',
  '原始界面 · 左右滑动浏览。论文与图谱均为公开资料演示。':'Localized interface preview · Swipe to explore. Papers and scores use public metadata.',
});
const captures = [
  {file:'radar-rrsi.webp', original:'radar-rrsi.png', title:'论文选读 · RRSI', description:'研究方向、作者线索与个人评分，同屏呈现。', alt:'论文雷达工作台：RRSI 的独立论文卡片与个人评分。'},
  {file:'radar-agents.webp', original:'radar-agents.png', title:'论文选读 · When Agents Slow Down', description:'从标题、作者与机构，快速找到值得继续读的论文。', alt:'论文雷达工作台：When Agents Slow Down 的独立论文卡片。'},
  {file:'radar-wearableqa.webp', original:'radar-wearableqa.png', title:'论文选读 · WearableQA', description:'研究线索、机构来源与个人评分，同屏呈现。', alt:'论文雷达工作台：WearableQA 的论文、作者与机构标签。'},
  {file:'radar-conversation.webp', original:'radar-conversation.png', title:'论文选读 · Conversation Compiler', description:'从摘要到代码入口，沿着论文继续探索。', alt:'论文雷达工作台：Conversation Compiler 的论文卡片与代码入口。'},
  {file:'radar-research-map.webp', original:'radar-research-map.png', title:'研究图谱 · 公开书目', description:'从论文到作者网络，探索研究之间的联系。', alt:'研究图谱：公开书目中的作者与合作关系。'},
];
if (english) for (const capture of captures) { capture.file=capture.file.replace('.webp','-en.webp'); capture.original=capture.original.replace('.png','-en.png'); }
const labels = {radar:['RRSI','Agent 推理','可穿戴问答','对话轨迹','研究图谱'], translate:['文档结构','表格与链接','代码与译法']};
const root = document.querySelector('#experience');
const tabs = [...document.querySelectorAll('.product-tab')];
const stageButtons = [...document.querySelectorAll('.stage-controls button')];
const capture = document.querySelector('.radar-capture');
const captureSlides = [...document.querySelectorAll('.capture-slide')];
const captureLink = document.querySelector('#capture-original');
const sourceScroll = document.querySelector('.source-scroll');
const translationScroll = document.querySelector('.translation-scroll');
const sourceRendered = document.querySelector('.source-rendered');
const sourceMarkdown = document.querySelector('.markdown-source');
const sourceFormat = document.querySelector('#source-format');
const termChoice = document.querySelector('#term-choice');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const state = {mode:'radar', stage:0, markdown:false, term:'执行轨迹', remembered:false};
let scrollDriver = null, galleryTarget = null, galleryDrag = null;
const assetPrefix = new URL('assets/', document.querySelector('script[src*="app.js"]').src).href;

function maxScroll(el) { return Math.max(0, el.scrollHeight-el.clientHeight); }
function sectionOffset(scroller, key) {
  const scope = scroller === sourceScroll ? (state.markdown ? sourceMarkdown : sourceRendered) : scroller;
  const section = scope.querySelector('[data-section="'+key+'"]');
  if (!section) return 0;
  return Math.max(0, Math.min(maxScroll(scroller), section.getBoundingClientRect().top-scroller.getBoundingClientRect().top+scroller.scrollTop-8));
}
function scrollReading(key) {
  for (const scroller of [sourceScroll, translationScroll]) scroller.scrollTop=sectionOffset(scroller,key);
}
function renderCapture(align=true) {
  const item = captures[state.stage];
  captureSlides.forEach((slide,index)=>{
    slide.setAttribute('aria-hidden',String(index!==state.stage));
    slide.querySelector('img').alt=t(captures[index].alt);
  });
  if (align && capture.clientWidth) {
    const left=state.stage*capture.clientWidth;
    galleryTarget=Math.abs(capture.scrollLeft-left)>1?left:null;
    if(motion.matches)capture.scrollLeft=left;
    else capture.scrollTo({left,behavior:'smooth'});
  }
  captureLink.href = assetPrefix+item.original+'?v=20261024-gallery';
  document.querySelector('#capture-title').textContent = t(item.title);
  document.querySelector('#capture-description').textContent = t(item.description);
  document.querySelector('#capture-position').textContent=String(state.stage+1).padStart(2,'0')+' / '+String(captures.length).padStart(2,'0');
}
function renderTerm() {
  document.querySelectorAll('[data-term]').forEach(el => el.textContent = state.term);
  termChoice.value = state.term;
  root.dataset.remembered = String(state.remembered);
  document.querySelector('#remember-term').firstChild.textContent = t(state.remembered ? '已保存' : '保存译法')+' ';
  document.querySelector('#memory-status').textContent = state.remembered
    ? (english ? 'Saved in this example: trace → '+state.term+'.' : '本页已保存：trace → '+state.term+'。')
    : t('按领域与语境，沿用个人译法。');
}
function render(alignCapture=true) {
  root.dataset.mode = state.mode;
  root.dataset.stage = String(state.stage);
  document.querySelector('#radar-demo').hidden = state.mode !== 'radar';
  document.querySelector('#translate-demo').hidden = state.mode !== 'translate';
  tabs.forEach(tab => {
    const selected = tab.dataset.mode === state.mode;
    tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
  });
  stageButtons.forEach((button, index) => {
    button.hidden=index>=labels[state.mode].length;
    button.setAttribute('aria-pressed', String(index === state.stage));
    button.querySelector('.stage-name').textContent = t(labels[state.mode][index]||'');
  });
  document.querySelector('#demo-disclaimer').textContent = t(state.mode === 'radar'
    ? '原始界面 · 左右滑动浏览。论文与图谱均为公开资料演示。'
    : '多论文 Markdown 阅读笔记 · 预置中英示例，不调用模型。');
  if (state.mode === 'radar') renderCapture(alignCapture);
  document.querySelector('#tour-caption').textContent=t(state.mode==='radar'?'多维加权 · 按你的研究偏好排序':'保留结构 · 沿用你的译法');
  renderTerm();
}
function startStage(stage, alignCapture=true) {
  state.stage=stage;scrollDriver=null;
  render(alignCapture);
  if(state.mode==='translate'){
    if(stage===0){sourceScroll.scrollTop=0;translationScroll.scrollTop=0;}
    else scrollReading(stage===1?'table':'code');
  }
}
function chooseMode(mode) { if(['radar','translate'].includes(mode)){state.mode=mode;startStage(0);} }

tabs.forEach(tab => {
  tab.addEventListener('click',()=>chooseMode(tab.dataset.mode));
  tab.addEventListener('keydown',event=>{
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const index=tabs.indexOf(tab), next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    chooseMode(tabs[next].dataset.mode); tabs[next].focus();
  });
});
stageButtons.forEach(button=>button.addEventListener('click',()=>startStage(Number(button.dataset.stage))));
document.querySelectorAll('[data-capture-direction]').forEach(button=>button.addEventListener('click',()=>{
  startStage((state.stage+Number(button.dataset.captureDirection)+captures.length)%captures.length);
}));
capture.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?captures.length-1:(state.stage+(event.key==='ArrowRight'?1:-1)+captures.length)%captures.length;
  startStage(next);
});
capture.addEventListener('scroll',()=>{
  if(state.mode!=='radar'||!capture.clientWidth||galleryDrag)return;
  if(galleryTarget!==null){if(Math.abs(capture.scrollLeft-galleryTarget)<2)galleryTarget=null;return;}
  const next=Math.max(0,Math.min(captures.length-1,Math.round(capture.scrollLeft/capture.clientWidth)));
  if(next!==state.stage)startStage(next,false);
},{passive:true});
capture.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;
  galleryTarget=null;
  if(event.pointerType!=='mouse')return;
  galleryDrag={x:event.clientX,left:capture.scrollLeft,id:event.pointerId};
  capture.classList.add('is-dragging');capture.setPointerCapture(event.pointerId);
});
capture.addEventListener('pointermove',event=>{
  if(!galleryDrag)return;
  capture.scrollLeft=galleryDrag.left+galleryDrag.x-event.clientX;
});
function finishGalleryDrag(){
  if(!galleryDrag)return;
  galleryDrag=null;capture.classList.remove('is-dragging');
  startStage(Math.max(0,Math.min(captures.length-1,Math.round(capture.scrollLeft/capture.clientWidth))));
}
capture.addEventListener('pointerup',finishGalleryDrag);
capture.addEventListener('pointercancel',finishGalleryDrag);
capture.addEventListener('lostpointercapture',finishGalleryDrag);
if('ResizeObserver' in window)new ResizeObserver(()=>{
  if(state.mode!=='radar'||!capture.clientWidth)return;
  galleryTarget=state.stage*capture.clientWidth;
  capture.scrollLeft=galleryTarget;
  galleryTarget=null;
}).observe(capture);
sourceFormat.addEventListener('click',()=>{
  scrollDriver=null;
  const fraction=maxScroll(sourceScroll)?sourceScroll.scrollTop/maxScroll(sourceScroll):0;
  state.markdown=!state.markdown;
  sourceRendered.hidden=state.markdown; sourceMarkdown.hidden=!state.markdown;
  sourceFormat.setAttribute('aria-pressed',String(state.markdown));
  sourceScroll.scrollTop=fraction*maxScroll(sourceScroll);
});
termChoice.addEventListener('change',()=>{state.term=termChoice.value;state.remembered=false;renderTerm();});
document.querySelector('#remember-term').addEventListener('click',()=>{state.remembered=true;renderTerm();});
for (const scroller of [capture,sourceScroll,translationScroll]) {
  const takeControl=()=>{scrollDriver=scroller;if(scroller===capture)galleryTarget=null;};
  scroller.addEventListener('wheel',takeControl,{passive:true});
  scroller.addEventListener('touchstart',takeControl,{passive:true});
  scroller.addEventListener('keydown',event=>{if (!event.defaultPrevented && ['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','PageDown','PageUp','Home','End',' '].includes(event.key)) takeControl();});
  if (scroller!==capture) scroller.addEventListener('scroll',()=>{
    if (scrollDriver!==scroller) return;
    const other=scroller===sourceScroll?translationScroll:sourceScroll;
    const fraction=maxScroll(scroller)?scroller.scrollTop/maxScroll(scroller):0;
    other.scrollTop=fraction*maxScroll(other);
  },{passive:true});
}
document.querySelectorAll('[data-open-demo]').forEach(button=>button.addEventListener('click',()=>{
  chooseMode(button.dataset.openDemo);
  root.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});
}));
document.querySelector('#watch-demo').addEventListener('click',()=>startStage(0));
const privacy=document.querySelector('#privacy-dialog');
document.querySelector('#open-privacy').addEventListener('click',()=>privacy.showModal());
document.querySelector('#close-privacy').addEventListener('click',()=>privacy.close());
privacy.addEventListener('click',event=>{
  if (event.target!==privacy) return;
  const b=privacy.getBoundingClientRect();
  if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom) privacy.close();
});
privacy.addEventListener('close',()=>document.querySelector('#open-privacy').focus());
motion.addEventListener('change',()=>{if(motion.matches&&state.mode==='radar')renderCapture();});
const initialProduct = document.body.dataset.product || new URLSearchParams(location.search).get('tool');
if (['radar','translate'].includes(initialProduct)) state.mode = initialProduct;
render();

// Precomputed public results only. The scoring engine stays in the extension.
(function mountPersonalPreview() {
 const root=document.getElementById('personal-ranking-preview'),source=document.getElementById('personal-preview-data');
 if(!root||!source)return;
 let data;
 try{data=JSON.parse(source.textContent)}catch{return;}
 const papers=Array.isArray(data.papers)?data.papers:[];
 if(!papers.length)return;
 const en=document.documentElement.lang==='en',current=data.schema==='knowme-personal-preview-v2';
 const configured=data.configuration?.currentExplicitPresets||[];
 const names={berkeley:'UC Berkeley',washington:'University of Washington',princeton:'Princeton University',stanford:'Stanford University',meta:'Meta'};
 const topicNames={'agent-harness':en?'Agents / harness':'Agent / Harness',reasoning:en?'Reasoning':'推理','multimodal-fusion':en?'Multimodal':'多模态'};
 const keywordNames={'Agent 与 Harness':'Agents / harness','推理方法与后训练':'Reasoning / post-training','多模态大模型':'Multimodal models'};
 const numeric=value=>typeof value==='number'&&Number.isFinite(value);
 const number=(value,digits=1)=>numeric(value)?value.toFixed(digits):'—';
 const signed=value=>numeric(value)?(value>0?'+':'')+value.toFixed(1):'—';
 const list=value=>Array.isArray(value)?value:[];
 const evidenceState=value=>value==='insufficient-evidence'?(en?'Insufficient evidence':'证据不足'):value==='missing'?(en?'Missing source record':'缺少来源记录'):value==='unavailable'?(en?'Not available':'暂无来源项'):String(value).replace(/[-_]/g,' ');
 const title=item=>en?(names[item.id]||item.nameEn||item.name||item.id||'—'):(item.name||item.nameEn||item.id||'—');
 let selectedPaper=papers[0].id,selectedProfile='agents';
 function set(selector,text){const node=root.querySelector(selector);if(node)node.textContent=text;}
 function status(){
  let node=root.querySelector('[data-personal-eligibility]');
  if(!node){node=document.createElement('p');node.className='personal-weight-note';node.setAttribute('data-personal-eligibility','');node.setAttribute('role','status');root.querySelector('.personal-preview-heading')?.after(node);}
  return node;
 }
 function row(label,value,state){
  const tr=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');
  th.scope='row';th.textContent=label;td.textContent=value;
  if(state&&state!=='ready'){
   const note=document.createElement('small');note.textContent=(en?'Evidence: ':'证据状态：')+evidenceState(state);td.append(document.createElement('br'),note);
  }
  tr.append(th,td);return tr;
 }
 function paragraph(container,text){const p=document.createElement('p');p.textContent=text;container.append(p);}
 function examples(container,items){
  for(const item of list(items).slice(0,1)){
   if(typeof item.url!=='string'||!/^https?:\/\//.test(item.url))continue;
   const a=document.createElement('a');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=(item.title||item.url)+' ↗';container.append(a);
  }
 }
 const paperSwitch=root.querySelector('.personal-paper-switch');
 if(paperSwitch){
  paperSwitch.replaceChildren();
  for(const paper of papers){const button=document.createElement('button');button.type='button';button.dataset.personalPaper=paper.id;button.textContent=paper.short||paper.title||paper.id;button.addEventListener('click',()=>{selectedPaper=paper.id;show()});paperSwitch.append(button);}
 }
 root.querySelectorAll('[data-personal-profile]').forEach(button=>{
  const preset=configured.find(p=>p.id===button.dataset.personalProfile);
  if(current&&preset)button.textContent=en?(preset.nameEn||preset.name):preset.name;
  if(!current){const historical=list(papers[0].cases).find(p=>p.id===button.dataset.personalProfile);if(historical)button.textContent=en?(historical.nameEn||historical.name):historical.name;}
  button.addEventListener('click',()=>{selectedProfile=button.dataset.personalProfile;show()});
 });
 function show(){
  const paper=papers.find(p=>p.id===selectedPaper)||papers[0];
  const sample=list(paper.cases).find(c=>c.id===selectedProfile);
  const available=Boolean(sample)&&sample.state!=='missing-paper';
  const preset=configured.find(p=>p.id===selectedProfile);
  root.querySelectorAll('[data-personal-profile]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.personalProfile===selectedProfile)));
  root.querySelectorAll('[data-personal-paper]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.personalPaper===paper.id)));
  set('[data-personal-title]',(paper.short||paper.title||paper.id)+' · '+paper.id);
  const link=root.querySelector('[data-personal-source]');if(link&&paper.url)link.href=paper.url;
  for(const [field,key] of [['base','base'],['author-adjustment','authorAdjustment'],['institution-adjustment','institutionAdjustment'],['total','total']])set('[data-personal-'+field+']',number(available?sample[key]:null));
  const rows=root.querySelector('[data-personal-rows]');if(rows)rows.replaceChildren();
  const details=root.querySelector('[data-personal-evidence]');if(details)details.replaceChildren();
  const flag=status();
  if(current){
   const definitions=list(preset?.topics).map(t=>(topicNames[t.id]||t.name||t.id)+(en?' priority ':'，优先级 ')+t.priority).join(en?'; ':'；');
   set('[data-personal-preset-label]',(en?'Current example preset · ':'当前示例预设 · ')+definitions);
   const headings=root.querySelectorAll('thead th');if(headings[0])headings[0].textContent=en?'Evidence source':'来源项';if(headings[1])headings[1].textContent=en?'Fit / weight · G':'匹配 / 权重 · G';
   const caption=root.querySelector('table caption');if(caption)caption.textContent=en?'Author fit and weight, and separate institutional G scores':'作者匹配与权重，以及独立的机构 G 分数';
   if(!available){flag.textContent=en?'Paper missing from this source snapshot':'当前来源快照中缺少该论文';flag.dataset.state='missing';}
   else if(sample.eligibleForPreset===false){flag.textContent=en?'Outside this preset':'不纳入该方向清单';flag.dataset.state='outside';}
   else if(sample.eligibleForPreset===true){flag.textContent=en?'Eligible for this preset':'符合该方向筛选';flag.dataset.state='eligible';}
   else{flag.textContent=en?'Preset eligibility unavailable':'当前预设资格未提供';flag.dataset.state='unknown';}
   if(available&&rows){
    for(const author of list(sample.authors))rows.append(row(title(author)+(en?' · Author':' · 作者'),(numeric(author.fit)?number(author.fit)+'%':'—')+' · ×'+number(author.weight,3),author.state));
    for(const institution of list(sample.institutions))rows.append(row(title(institution)+(en?' · Institution':' · 机构'),'G '+number(institution.graphScore,3),institution.state));
    if(!list(sample.authors).length)rows.append(row(en?'Author evidence':'作者证据',evidenceState(sample.missing?.personalAuthorState||'unavailable')));
    if(!list(sample.institutions).length)rows.append(row(en?'Institution evidence':'机构证据',evidenceState(sample.missing?.personalInstitutionState||'unavailable')));
   }
   set('[data-personal-weight-note]',en?'Author fit and weight are shown separately from institutional G; paper adjustments use the actual aggregate.':'作者匹配与权重、机构 G 分别展示，论文加分读取实际汇总。');
   const labels=root.querySelectorAll('.personal-equation small');
   [en?'Base score':'基础分',en?'Author adjustment':'作者调整',en?'Institution adjustment':'机构加分',sample?.eligibleForPreset===false?(en?'Not selected · score details':'未入选 · 分数供查看'):(en?'Personal score':'个人分')].forEach((text,i)=>{if(labels[i])labels[i].textContent=text;});
   const cached=data.configuration?.sourceSnapshot?.latestRecordCachedAt;
   const cachedDate=typeof cached==='string'?cached.slice(0,10):'—';
   const note=root.querySelector('[data-personal-preview-note]')||root.querySelector('.personal-preview-note');
   if(note)note.textContent=en?'Current example presets. Public bibliography cached '+cachedDate+'; scores computed '+(data.asOf||'—')+'. Base is evaluated separately for each preset.':'当前示例预设。公开书目缓存日期：'+cachedDate+'；示例计算日期：'+(data.asOf||'—')+'。基础分按所选预设分别计算。';
   const method=root.querySelector('.personal-method > p');if(method)method.textContent=en?'Author fit is a percentage; × is the author weight. Adjustments and totals come directly from the product result. Institution G values are not added together and do not determine whether the paper matches this preset. Base is evaluated per preset.':'作者匹配是百分比，× 表示作者权重。调整项与总分直接读取产品结果；机构各行 G 不相加，也不决定论文是否匹配所选方向。基础分按预设分别计算。';
   if(details){
    paragraph(details,(en?'Product rules: ':'计算使用产品规则：')+(data.runtime?.productVersion||'—'));
    if(preset)paragraph(details,(en?'Preset: ':'预设：')+definitions);
    if(!available)paragraph(details,en?'No computed score is available for this paper in the source snapshot.':'该论文在来源快照中没有可用的计算分数。');
    if(available){
     for(const author of list(sample.authors)){
      paragraph(details,title(author)+' · '+(en?'Fit ':'匹配 ')+(numeric(author.fit)?number(author.fit)+'%':'—')+' · ×'+number(author.weight,3)+' · '+(en?'Adjustment ':'调整 ')+signed(author.adjustment)+(author.state&&author.state!=='ready'?' · '+author.state:''));
      examples(details,author.examples);
     }
     for(const institution of list(sample.institutions)){
      const count=numeric(institution.papers)?institution.papers.toLocaleString(en?'en-US':'zh-CN'):'—';
      const keywords=list(institution.keywords).map(k=>en?(keywordNames[k]||k):k).join(' / ');
      paragraph(details,title(institution)+' · G '+number(institution.graphScore,3)+' · '+count+(en?' source papers':' 篇来源论文')+(keywords?' · '+keywords:'')+(institution.state&&institution.state!=='ready'?' · '+institution.state:''));
      examples(details,institution.examples);
     }
     for(const [key,label] of [['personalAuthorState',en?'Author evidence':'作者证据'],['personalInstitutionState',en?'Institution evidence':'机构证据']]){const value=sample.missing?.[key];if(value&&value!=='ready')paragraph(details,label+': '+evidenceState(value));}
    }
   }
  }else{
   // The new script can reach an older page during directory-by-directory publication.
   // Historical institution multipliers remain historical; they never become G.
   set('[data-personal-preset-label]',en?'Historical example · Full original settings were not saved':'历史示例 · 原始完整配置未保存');
   flag.textContent=en?'Historical example; preset eligibility was not recorded':'历史示例，未记录方向清单资格';flag.dataset.state='historical';
   const headings=root.querySelectorAll('thead th');if(headings[0])headings[0].textContent=en?'Historical source':'历史来源项';if(headings[1])headings[1].textContent=en?'Historical weight':'历史权重';
   const caption=root.querySelector('table caption');if(caption)caption.textContent=en?'Historical author and institution multipliers; not current G scores':'历史作者与机构乘数，非当前 G 分数';
   if(available&&rows){
    for(const author of list(sample.authors))rows.append(row(title(author)+(en?' · Author':' · 作者'),'×'+number(author.weight,3),author.state));
    for(const institution of list(sample.institutions))rows.append(row(title(institution)+(en?' · Historical institution':' · 旧版机构'),'×'+number(institution.weight,3)+(en?' (not G)':'（非 G）'),institution.state));
   }
   set('[data-personal-weight-note]',en?'Historical multipliers from the original example. Institution weights are not the current G scores.':'原历史示例中的乘数；旧版机构权重不是当前 G 分数。');
   const labels=root.querySelectorAll('.personal-equation small');
   [en?'Historical base':'历史基础分',en?'Author adjustment':'作者调整',en?'Old institution term':'旧版机构调整',en?'Historical total':'历史个人分'].forEach((text,i)=>{if(labels[i])labels[i].textContent=text;});
   const note=root.querySelector('[data-personal-preview-note]')||root.querySelector('.personal-preview-note');
   if(note)note.textContent=(en?'Historical public example: ':'历史公开示例：')+(data.asOf||'—')+(en?'. Its full original preset was not saved. These values do not represent the current explicit presets.':'。原始完整预设未保存，这些数值不代表当前明确指定的预设。');
   const method=root.querySelector('.personal-method > p');if(method)method.textContent=en?'This is the earlier weighting display, retained only as a historical example. No institution G is inferred from its weights.':'此处仅保留早期权重展示作为历史示例，不从旧权重推导机构 G。';
   if(details&&available)for(const institution of list(sample.institutions)){
    paragraph(details,title(institution)+' · '+(numeric(institution.papers)?institution.papers.toLocaleString():'—')+(en?' historical source papers':' 篇历史来源论文'));examples(details,institution.examples);
   }
  }
  root.dataset.personalSchema=current?'current':'historical';root.dataset.personalCurrent=selectedProfile;root.dataset.paperCurrent=paper.id;
 }
 show();
})();
