class AutoCompleteElement extends HTMLElement{
constructor(){
  super();
  this.options=this.submit=this._input=this._list=null;
  this.attachShadow({mode:'open'}).innerHTML=`<style>
*{box-sizing:border-box}
:host{position:relative;width:100%}
div{display:inline-block;width:100%}
div:focus-within datalist{display:block}
div:focus-within datalist:empty{display:none}
div:focus-within datalist.escaped{display:none}
input{width:100%;font-size:1em;padding:.25em}
datalist{
position:absolute;font:.725em sans-serif;padding:.5em 0;min-width:100%;
background:white;color:#000;border:1px solid #888;border-radius:4px;box-shadow:-1px 2px 2px rgba(0,0,0,.15);
}
option{cursor:default;display:block;line-height:1.75;padding:.75em 2em .75em 1em;color:#333}
option[value]{color:#666}
option[value]:before{content:attr(value);font-weight:bold;font-size:1.05em;display:block;color:#222}
option:hover,option:focus{outline:none;background:#eee}
</style><div><input type="text" autocomplete="false"></input><datalist tabindex="0"></datalist></div>`;
}
connectedCallback(){
  this._input=this.shadowRoot.querySelector("input");
  this._list=this.shadowRoot.querySelector("datalist");
  let counter=0;
  let trimmed=null;
  const delay=(ms)=>new Promise(r=>{const t=setTimeout(()=>r(t),ms);});
  const onChange=()=>{
    const current=(this._input.value||'').trim();
    if(current===trimmed) return;
    this._list.classList.remove('escaped');
    trimmed=current;
    if (typeof this.options === 'function'){
      const options=this.options(this._input.value);
      if(options instanceof Promise){
        const c=counter=(counter+1)%100000;
        (async()=>{
          await delay(500);
          if(counter===c) this._updateOptions(await options);
        })();
      }else this._updateOptions(options);
    }else if(Array.isArray(this.options)) this._updateOptions(this.options);
  };
  this._input.addEventListener('keydown',e=>{
    if(e.key==='Tab'){
      this._list.classList.remove('escaped');
    }
    if(e.key==='ArrowDown'){
      this._list.classList.remove('escaped');
      const first=this._list.querySelector('option');
      if(first){first.focus();e.preventDefault();}
    }else if(e.key==='Enter'){
      this._input.blur();
      if(this.submit){this.submit(trimmed);e.preventDefault();}
    }else if(e.key==='Escape'){
      const first=this._list.querySelector('option');
      if(first){this._list.classList.add('escaped');e.preventDefault();}
    }
  },false);
  this._input.addEventListener('keyup',onChange,false);
  this._input.addEventListener('cut',()=>requestAnimationFrame(onChange),false);
  this._input.addEventListener('paste',()=>requestAnimationFrame(onChange),false);
  this._input.addEventListener('click',()=>this._list.classList.remove('escaped'),false);
  this._list.addEventListener('focus',_=>{
    const first=this._list.querySelector('option');
    if(first) first.focus();
  },false);
}
_createOption(it){
  const option=document.createElement("option");
  if(it instanceof Object){
    if(it.text&&it.value){option.setAttribute('value',it.value);option.innerHTML=it.text;}
    else{option.innerHTML=it.text||it.value||`${it}`;}
  }else option.innerHTML=`${it}`;
  option.tabIndex=-1;
  option.addEventListener('keydown',e=>{
    if(e.key==='ArrowUp'){
      const prev=option.previousElementSibling;
      if(prev){prev.focus();e.preventDefault();}
    }else if(e.key==='ArrowDown'){
      const next=option.nextElementSibling;
      if(next){next.focus();e.preventDefault();}
    }else if(e.key==='Escape'){
      this._list.classList.add('escaped');
      this._input.focus();e.preventDefault();
    }else if(e.key==='Enter'){
      e.preventDefault();
      option.click();
    }
  },false);
  option.addEventListener('mousedown',_=>option.focus(),false);
  option.addEventListener('click',_=>{
    const value=option.getAttribute('value')||option.innerText;
    this._input.value=value;
    option.blur();
    if(this.submit) this.submit(value);
  });
  return option;
}
_updateOptions(options){
  this._list.innerHTML='';
  if(options&&options.length>0){
    const f=document.createDocumentFragment();
    options.forEach(it=>f.appendChild(this._createOption(it)));
    this._list.appendChild(f);
  }
}
}
customElements.define('auto-complete',AutoCompleteElement);

export { AutoCompleteElement as default };
