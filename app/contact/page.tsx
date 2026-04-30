export default function ContactPage() {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-12 md:py-18">
        <div className="text-center mb-16">
          <h1 className="text-xl md:text-2xl font-medium tracking-[0.3em] uppercase mb-4">Contact</h1>
        </div>
  
        <form 
          action="https://api.web3forms.com/submit" 
          method="POST" 
          className="flex flex-col gap-10 max-w-[600px] mx-auto"
        >
          {/* ★ここにメールに届いたアクセスキーを入れます！ */}
          <input type="hidden" name="access_key" value="495e7778-735d-4741-b19c-7cff0f816d23" />
          
          {/* スパム対策用の見えない項目 */}
          <input type="checkbox" name="botcheck" className="hidden" />
  
          <div className="flex flex-col gap-3">
            <label htmlFor="name" className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">
              Name
            </label>
            <input 
              type="text" 
              name="name" 
              id="name" 
              required 
              className="border-b border-gray-200 py-3 text-sm tracking-wider focus:outline-none focus:border-black transition-colors bg-transparent"
            />
          </div>
  
          <div className="flex flex-col gap-3">
            <label htmlFor="email" className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">
              Email
            </label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              required 
              className="border-b border-gray-200 py-3 text-sm tracking-wider focus:outline-none focus:border-black transition-colors bg-transparent"
            />
          </div>
  
          <div className="flex flex-col gap-3">
            <label htmlFor="message" className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">
              Message
            </label>
            <textarea 
              name="message" 
              id="message" 
              rows={5} 
              required 
              className="border border-gray-200 p-4 text-sm tracking-wider focus:outline-none focus:border-black transition-colors bg-transparent resize-y min-h-[150px]"
            ></textarea>
          </div>
  
          {/* 完了後に飛ばすページ（今回は今のページに戻るように設定） */}
          <input type="hidden" name="redirect" value="http://assemble-store.com/contact/success" />
  
          <button 
            type="submit" 
            className="mt-4 bg-black text-white text-xs tracking-[0.2em] uppercase py-3 px-20 hover:bg-gray-800 transition-colors w-full md:w-auto md:self-center"
          >
            Send Message
          </button>
        </form>
      </div>
    );
  }