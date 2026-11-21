"use client";
import { usePathname } from "next/navigation";
import { whatsappUrl } from "@/lib/site";

const publicMessage = "Olá, Dra. Claudia! Conheci os procedimentos pelo site e gostaria de agendar uma avaliação.";
const patientMessage = "Olá, Dra. Claudia! Preciso de ajuda com minha conta ou com uma etapa da Área do Paciente.";

export function FloatingWhatsapp() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  const patient = pathname.startsWith("/paciente") || pathname.startsWith("/questionario") || pathname.startsWith("/privacidade/solicitacao") || pathname.startsWith("/acesso") || pathname.startsWith("/auth") || pathname.startsWith("/recuperar-senha");
  const label = patient ? "Pedir ajuda com a conta pelo WhatsApp" : "Agendar uma avaliação pelo WhatsApp";
  return <a className="floating-whatsapp" href={whatsappUrl(patient ? patientMessage : publicMessage)} target="_blank" rel="noopener noreferrer" data-track="whatsapp" aria-label={label}>
    <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3A12.92 12.92 0 0 0 5.12 22.84L3 30l7.36-2.04A12.98 12.98 0 1 0 16.04 3Zm0 23.58c-1.9 0-3.76-.5-5.39-1.45l-.39-.23-4.37 1.21 1.17-4.26-.25-.4a10.63 10.63 0 1 1 9.23 5.13Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58a9.65 9.65 0 0 1-1.78-2.21c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.36-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.14-.29-.22-.61-.38Z"/></svg>
    <span>{patient ? "Ajuda com a conta" : "Agendar avaliação"}</span>
  </a>;
}
