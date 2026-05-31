"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export function UploadWizard(){ const [progress,setProgress]=useState(0); const [state,setState]=useState<'idle'|'uploading'|'analyzing'|'done'>('idle');
 const onDrop=useCallback((files:File[])=>{const file=files[0]; if(!file) return; if(file.size>150*1024*1024) return toast.error('Arquivo acima de 150MB'); const fd=new FormData(); fd.append('file',file); setState('uploading'); const xhr=new XMLHttpRequest(); xhr.upload.onprogress=e=>{if(e.lengthComputable)setProgress(Math.round((e.loaded/e.total)*100))}; xhr.onload=()=>{ if(xhr.status<300){setState('analyzing'); setTimeout(()=>setState('done'),900); toast.success('Bot enviado para análise e deploy');} else toast.error(xhr.responseText)}; xhr.open('POST','/api/bots/upload'); xhr.send(fd);},[]);
 const dz=useDropzone({onDrop,accept:{'application/zip':['.zip']},maxFiles:1});
 return <Card className="mt-8 p-8"><div {...dz.getRootProps()} className="grid cursor-pointer place-items-center rounded-3xl border border-dashed border-white/20 bg-white/[.03] p-12 text-center transition hover:border-primary"><input {...dz.getInputProps()}/><span className="css-emoji emoji-upload text-5xl"/><h2 className="mt-6 text-xl font-bold">Arraste seu bot aqui</h2><p className="mt-2 text-sm text-white/60">ZIP com package.json, requirements.txt, Dockerfile ou Procfile.</p><Button className="mt-6" type="button">Selecionar arquivo</Button></div>{state!=='idle'&&<div className="mt-6"><div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-primary to-violet transition-all" style={{width:`${progress}%`}}/></div><p className="mt-3 text-sm text-white/60">{state==='uploading'?'Enviando...':state==='analyzing'?'Analisando seu bot...':'Pronto! O deploy foi enfileirado.'}</p></div>}</Card> }
