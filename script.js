const form = document.querySelector("#generate-form");
const promptInput = document.querySelector("#prompt");
const templateSelect = document.querySelector("#template");
const languageSelect = document.querySelector("#language");
const useAi = document.querySelector("#use-ai");
const generateButton = document.querySelector("#generate");
const result = document.querySelector("#result");
const fileList = document.querySelector("#file-list");
const fileContent = document.querySelector("#file-content");
const currentFile = document.querySelector("#current-file");
const copyButton = document.querySelector("#copy");
let generatedFiles = {};

document.querySelectorAll("[data-template]").forEach(button => {
  button.addEventListener("click", () => {
    templateSelect.value = button.dataset.template;
    document.querySelectorAll("[data-template]").forEach(item => item.classList.toggle("active", item === button));
    if (!promptInput.value.trim()) {
      const label = button.querySelector("b")?.textContent || "project";
      promptInput.value = `Create a complete ${label} with clear comments and a responsive user interface.`;
    }
    promptInput.focus();
  });
});

async function checkStatus() {
  const label = document.querySelector("#api-status");
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    label.textContent = data.ai_enabled ? "AI API configured" : "Template mode available";
  } catch {
    label.textContent = "Server status unavailable";
  }
}
checkStatus();

form.addEventListener("submit", async event => {
  event.preventDefault();
  const prompt = promptInput.value.trim();
  if (!prompt) return;
  generateButton.disabled = true;
  generateButton.innerHTML = "Generating… <span class='arrow'>⌛</span>";
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        prompt,
        template: templateSelect.value,
        language: languageSelect.value,
        use_ai: useAi.checked
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Project generation failed.");
    generatedFiles = {};
    data.files.forEach(file => generatedFiles[file.path] = file.content);
    document.querySelector("#project-name").textContent = data.project_name;
    document.querySelector("#result-note").textContent = data.mode === "ai"
      ? "Generated with AI. Review and test all files before use."
      : (data.note || "Generated from a built-in starter template. Add an API key for AI-generated custom code.");
    document.querySelector("#download").href = data.download_url;
    renderFiles();
    result.hidden = false;
    result.scrollIntoView({behavior:"smooth", block:"start"});
  } catch (error) {
    alert(error.message || "Could not reach the server. Check that Flask is running.");
  } finally {
    generateButton.disabled = false;
    generateButton.innerHTML = "<span>✦</span> Generate project <span class='arrow'>→</span>";
  }
});

function renderFiles() {
  fileList.replaceChildren();
  const names = Object.keys(generatedFiles);
  names.forEach((name, index) => {
    const button = document.createElement("button");
    button.className = "file-item" + (index === 0 ? " active" : "");
    button.textContent = "▤ " + name;
    button.type = "button";
    button.addEventListener("click", () => {
      fileList.querySelectorAll(".file-item").forEach(el => el.classList.toggle("active", el === button));
      showFile(name);
    });
    fileList.append(button);
  });
  if (names.length) showFile(names[0]);
}
function showFile(name) {
  currentFile.textContent = name;
  fileContent.textContent = generatedFiles[name] || "";
}
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(fileContent.textContent);
    copyButton.textContent = "Copied!";
    setTimeout(() => copyButton.textContent = "Copy code", 1200);
  } catch {
    alert("Clipboard access is unavailable. Select the code and copy it manually.");
  }
});


// Optional image generation. The API key remains on the Flask server.
const imageButton = document.querySelector("#make-image");
const imagePrompt = document.querySelector("#image-prompt");
const imageStatus = document.querySelector("#image-status");
const generatedImage = document.querySelector("#generated-image");
imageButton.addEventListener("click", async () => {
  const prompt = imagePrompt.value.trim();
  if (!prompt) {
    imageStatus.textContent = "Describe the picture first.";
    return;
  }
  imageButton.disabled = true;
  imageStatus.textContent = "Creating image…";
  generatedImage.hidden = true;
  try {
    const response = await fetch("/api/image", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({prompt})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Image generation failed.");
    generatedImage.src = data.image_data || data.image_url;
    generatedImage.hidden = false;
    imageStatus.textContent = "Image created. Right-click or long-press the image to save it.";
  } catch (error) {
    imageStatus.textContent = error.message || "Could not create the image.";
  } finally {
    imageButton.disabled = false;
  }
});

// Code solver UI; never executes submitted or generated code.
const solveButton=document.querySelector("#solve-code");
if(solveButton){
 const status=document.querySelector("#solver-status"), box=document.querySelector("#solver-result"), fixed=document.querySelector("#fixed-code");
 const fill=(id,items,fmt)=>{const el=document.querySelector(id);el.replaceChildren();(Array.isArray(items)?items:[]).forEach(x=>{const li=document.createElement("li");li.textContent=fmt(x);el.append(li);});};
 solveButton.addEventListener("click",async()=>{
  const code=document.querySelector("#solver-code").value;if(!code.trim()){status.textContent="Paste your code first.";return;}
  solveButton.disabled=true;status.textContent="Analyzing code…";box.hidden=true;
  try{const res=await fetch("/api/solve-code",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code,language:document.querySelector("#solver-language").value,task:document.querySelector("#solver-task").value,description:document.querySelector("#solver-description").value})});
   const d=await res.json();if(!res.ok)throw new Error(d.error||"Code analysis failed.");
   document.querySelector("#solver-summary").textContent=d.summary||"";
   fill("#solver-issues",d.issues,x=>typeof x==="string"?x:`${x.title||"Issue"}: ${x.explanation||""}`);
   fixed.textContent=d.fixed_code||"";document.querySelector("#solver-code-label").textContent=d.language||"Suggested code";
   fill("#solver-steps",d.steps,String);fill("#solver-tests",d.tests,x=>typeof x==="string"?x:`Input: ${x.input??"(none)"} | Expected: ${x.expected_output??"(not specified)"}`);
   document.querySelector("#solver-note").textContent=d.note||"Review before running.";box.hidden=false;status.textContent="Analysis complete.";box.scrollIntoView({behavior:"smooth",block:"start"});
  }catch(e){status.textContent=e.message||"Could not reach server.";}finally{solveButton.disabled=false;}
 });
 document.querySelector("#copy-fixed-code").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(fixed.textContent);status.textContent="Code copied.";}catch{status.textContent="Clipboard unavailable; select and copy manually.";}})
}

// Account UI and account-scoped chat history.
(async function accountAndChat(){
 const statusRes=await fetch('/api/auth/status');
 if(!statusRes.ok)return;
 const auth=await statusRes.json();
 if(!auth.authenticated){location.href='/login';return;}
 const email=document.querySelector('#account-email');if(email)email.textContent=auth.email||'Signed in';
 document.querySelector('#logout')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/login';});
 const history=document.querySelector('#chat-history'),form=document.querySelector('#chat-form'),input=document.querySelector('#chat-message'),send=document.querySelector('#chat-send'),status=document.querySelector('#chat-status');
 const filesInput=document.querySelector('#chat-files'),fileList=document.querySelector('#chat-file-list'),recordButton=document.querySelector('#record-voice'),voiceStatus=document.querySelector('#voice-status');
 let recordedAudio=null,mediaRecorder=null,recordChunks=[];
 function addMessage(role,content){const item=document.createElement('article');item.className='chat-message '+role;const title=document.createElement('strong');title.textContent=role==='user'?'You':'smartEGO AI';const body=document.createElement('p');body.textContent=content;item.append(title,body);history.append(item);history.scrollTop=history.scrollHeight;}
 function renderSelectedFiles(){fileList.replaceChildren();[...(filesInput?.files||[])].forEach(file=>{const item=document.createElement('span');item.className='chat-file-chip';item.textContent=`${file.name} (${Math.ceil(file.size/1024)} KB)`;fileList.append(item)});if(recordedAudio){const item=document.createElement('span');item.className='chat-file-chip';item.textContent=`Recorded voice (${Math.ceil(recordedAudio.size/1024)} KB)`;fileList.append(item)}}
 filesInput?.addEventListener('change',()=>{recordedAudio=null;renderSelectedFiles()});
 recordButton?.addEventListener('click',async()=>{if(mediaRecorder?.state==='recording'){mediaRecorder.stop();recordButton.textContent='🎙 Record voice (browser support required)';voiceStatus.textContent='Finishing recording…';return}if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){voiceStatus.textContent='Voice recording is not supported by this browser. Upload an audio file instead.';return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});recordChunks=[];mediaRecorder=new MediaRecorder(stream);mediaRecorder.ondataavailable=e=>{if(e.data.size)recordChunks.push(e.data)};mediaRecorder.onstop=()=>{recordedAudio=new File(recordChunks,`voice-${Date.now()}.webm`,{type:mediaRecorder.mimeType||'audio/webm'});stream.getTracks().forEach(track=>track.stop());voiceStatus.textContent='Voice ready to send.';renderSelectedFiles();recordButton.textContent='🎙 Record voice (browser support required)'};mediaRecorder.start();recordButton.textContent='■ Stop recording';voiceStatus.textContent='Recording… speak now.'}catch(e){voiceStatus.textContent='Microphone permission denied or unavailable.'}});
 try{const r=await fetch('/api/chat/history');if(r.ok){const d=await r.json();(d.messages||[]).forEach(m=>addMessage(m.role,m.content));}}catch{}
 form?.addEventListener('submit',async e=>{e.preventDefault();const message=input.value.trim(),selected=[...(filesInput?.files||[])];if(recordedAudio)selected.push(recordedAudio);if(!message&&!selected.length){status.textContent='Enter a message or attach a file first.';return}if(selected.length>5){status.textContent='Upload up to 5 files per message.';return}const data=new FormData();data.append('message',message);selected.forEach(file=>data.append('attachments',file,file.name));const shown=message+(selected.length?'\n[Attachments: '+selected.map(f=>f.name).join(', ')+']':'');addMessage('user',shown);input.value='';send.disabled=true;status.textContent='Reading attachments and asking AI…';try{const r=await fetch('/api/chat',{method:'POST',body:data});const d=await r.json();if(!r.ok)throw new Error(d.error||'Chat failed');addMessage('assistant',d.reply);status.textContent='Saved to your chat history.';if(filesInput)filesInput.value='';recordedAudio=null;renderSelectedFiles();voiceStatus.textContent=''}catch(err){status.textContent=err.message||'Could not send message.';}finally{send.disabled=false;}});
})();


// smartEGO AI Assistant Manager integration

(function assistantManagerUI(){
 const list=document.querySelector('#manager-task-list');
 if(!list)return;
 const taskStatus=document.querySelector('#manager-task-status');
 const answerStatus=document.querySelector('#manager-answer-status');
 const answer=document.querySelector('#manager-answer');
 async function api(url,options={}){
  const response=await fetch(url,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});
  const data=await response.json().catch(()=>({error:'Unexpected server response'}));
  if(!response.ok)throw new Error(data.error||'Request failed');
  return data;
 }
 function render(tasks){
  list.replaceChildren();
  if(!tasks.length){const p=document.createElement('p');p.textContent='No tasks yet. Add your first task above.';list.append(p);return;}
  tasks.forEach(task=>{
   const card=document.createElement('article');card.className='manager-task';
   const title=document.createElement('strong');title.textContent=task.title;
   const details=document.createElement('p');details.textContent=task.details||'';
   const controls=document.createElement('div');controls.className='manager-task-controls';
   const status=document.createElement('select');status.setAttribute('aria-label','Task status');
   [['pending','Pending'],['in_progress','In progress'],['done','Done']].forEach(([v,label])=>{const o=document.createElement('option');o.value=v;o.textContent=label;status.append(o)});
   status.value=task.status;
   status.addEventListener('change',async()=>{try{await api(`/api/assistant-manager/tasks/${task.id}`,{method:'PATCH',body:JSON.stringify({status:status.value})});await loadTasks()}catch(e){taskStatus.textContent=e.message}});
   const del=document.createElement('button');del.type='button';del.textContent='Delete';del.addEventListener('click',async()=>{try{await api(`/api/assistant-manager/tasks/${task.id}`,{method:'DELETE'});await loadTasks()}catch(e){taskStatus.textContent=e.message}});
   controls.append(status,del);card.append(title,details,controls);list.append(card);
  });
 }
 async function loadTasks(){try{const d=await api('/api/assistant-manager/tasks');render(d.tasks||[])}catch(e){taskStatus.textContent=e.message}}
 document.querySelector('#manager-task-form').addEventListener('submit',async e=>{
  e.preventDefault();const title=document.querySelector('#manager-task-title'),details=document.querySelector('#manager-task-details');
  try{await api('/api/assistant-manager/tasks',{method:'POST',body:JSON.stringify({title:title.value,details:details.value})});title.value='';details.value='';taskStatus.textContent='Task saved privately to your account.';await loadTasks()}catch(err){taskStatus.textContent=err.message}
 });
 document.querySelector('#manager-ask').addEventListener('click',async()=>{
  const input=document.querySelector('#manager-message'),message=input.value.trim();if(!message){answerStatus.textContent='Enter a question first.';return}
  const button=document.querySelector('#manager-ask');button.disabled=true;answerStatus.textContent='Thinking…';answer.hidden=true;
  try{const d=await api('/api/assistant-manager/ask',{method:'POST',body:JSON.stringify({message})});answer.textContent=d.reply;answer.hidden=false;answerStatus.textContent='Response ready.'}
  catch(e){answerStatus.textContent=e.message}finally{button.disabled=false}
 });
 loadTasks();
})();
