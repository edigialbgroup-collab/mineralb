"use client";

export default function WhatsAppWidget() {
  return (
    <aside aria-label="Supporto WhatsApp" className="fixed bottom-6 right-6 z-50">
      <a
        href="https://wa.me/390000000000?text=Salve,%20ho%20una%20domanda%20urgente%20sui%20materiali%20MinerAlb"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3.5 bg-white border border-[#EAE7E1] hover:border-[#25D366] text-[#141516] px-5 py-3 rounded-full shadow-2xl hover:shadow-[0_10px_25px_-5px_rgba(37,211,102,0.3)] transition-all duration-300 group hover:-translate-y-0.5"
      >
        <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.174.449.741.963 1.2 1.05.938 1.488 1.042 1.705 1.144.217.101.347.086.477-.058.13-.145.564-.65.716-.881.152-.231.304-.188.52-.101.217.086 1.373.65 1.611.769.239.119.398.177.456.275.058.098.058.57-.086.975z" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-mono text-[#8C7A6B] uppercase tracking-wider font-semibold leading-none">
            Hai una domanda urgente?
          </span>
          <span className="text-xs font-semibold text-[#141516] group-hover:text-[#25D366] transition-colors mt-1 leading-none flex items-center gap-1">
            Scrivici subito su WhatsApp <span>&#8599;</span>
          </span>
        </div>
      </a>
    </aside>
  );
}
