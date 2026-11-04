// Match complete siglum components, case-insensitively (FR1 includes Fr1, not FR10).
const treeSvg=document.querySelector('#phylogeny'),treeScroll=document.querySelector('#tree-scroll');
const leafEls=[...treeSvg.querySelectorAll('.tree-leaf')];let treeScale=1,pinnedGroup=null,activeTreeGroup=undefined;
const bands=document.createElementNS(ns,'g');bands.setAttribute('id','highlight-bands');treeSvg.insertBefore(bands,treeSvg.querySelector('g'));
const sourceTips=[...treeSvg.querySelectorAll('line')];
function highlightTree(group){
 if(group===activeTreeGroup)return;
 activeTreeGroup=group;const matches=group?treeRecords.filter(r=>r.group===group.toUpperCase()):[],ids=new Set(matches.map(r=>r.id));
 bands.replaceChildren();leafEls.forEach(t=>{t.classList.toggle('leaf-match',ids.has(t.id));t.classList.toggle('leaf-muted',!!group&&!ids.has(t.id));t.classList.remove('located')});
 sourceTips.forEach(l=>l.classList.remove('tip-match'));
 matches.forEach(r=>{el('rect',{x:10,y:r.y-5.5,width:1220,height:7,class:'leaf-band'},bands);const line=sourceTips.find(l=>Math.abs(Number(l.getAttribute('y1'))-(r.y-4))<.3&&l.getAttribute('x2')==='818');if(line)line.classList.add('tip-match')});
 document.querySelector('#tree-status').textContent=group?`${group} · ${matches.length} matching manuscript${matches.length===1?'':'s'} of ${leafEls.length}`:'Hover over a group to highlight its manuscripts';
 document.querySelector('#match-title').textContent=group?`${group} — ${matches.length} matching sigla`:'Matching sigla';
 const results=document.querySelector('#tree-matches');results.replaceChildren();
 if(!group||!matches.length){let p=document.createElement('span');p.className='detail';p.textContent=group?'No manuscript sigla contain this group ID in the supplied tree.':'Hover over the tradition map, or select a group to keep its manuscripts highlighted.';results.append(p)}
 matches.forEach(r=>{let b=document.createElement('button');b.className='siglum';b.textContent=r.label;b.onclick=()=>locateLeaf(r);results.append(b)});
}
function resizeTree(){treeSvg.style.width=treeScale*100+'%'}function locateLeaf(r){treeScale=Math.max(treeScale,2.4);resizeTree();requestAnimationFrame(()=>{let target=document.getElementById(r.id);target.classList.add('located');let rect=target.getBoundingClientRect(),viewport=treeScroll.getBoundingClientRect();treeScroll.scrollTo({left:treeScroll.scrollLeft+rect.x-viewport.x-viewport.width*.5,top:treeScroll.scrollTop+rect.y-viewport.y-viewport.height*.5,behavior:'smooth'})})}
nodes.forEach(n=>{n.el.addEventListener('mouseenter',()=>highlightTree(n.id));n.el.addEventListener('mouseleave',()=>highlightTree(pinnedGroup));n.el.addEventListener('focus',()=>highlightTree(n.id));n.el.addEventListener('blur',()=>highlightTree(pinnedGroup));n.el.addEventListener('click',()=>{pinnedGroup=n.id;highlightTree(n.id)});n.el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){pinnedGroup=n.id;highlightTree(n.id)}})});
document.querySelector('#details').addEventListener('click',e=>{let b=e.target.closest('[data-id]');if(b){pinnedGroup=b.dataset.id;highlightTree(pinnedGroup)}});
document.querySelector('#clear-tree').onclick=()=>{pinnedGroup=null;highlightTree(null)};
document.querySelector('#tree-plus').onclick=()=>{treeScale=Math.min(5,treeScale*1.4);resizeTree()};document.querySelector('#tree-minus').onclick=()=>{treeScale=Math.max(1,treeScale/1.4);resizeTree()};document.querySelector('#tree-fit').onclick=()=>{treeScale=1;resizeTree();treeScroll.scrollTo(0,0)};
highlightTree(null);
