import { UploadWizard } from "@/components/bots/upload-wizard";
export default function NewBotPage(){ return <div><h1 className="text-3xl font-bold">Criar bot</h1><p className="mt-2 text-white/60">Envie um ZIP até 150MB. A HostBot detecta linguagem, entrypoint e comandos.</p><UploadWizard/></div> }
