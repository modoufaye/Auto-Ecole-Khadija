export default function Pagination({ page, setPage, total, pageSize = 10 }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, total)

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
      <span className="text-xs text-slate-400">
        {from}–{to} sur {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-all text-sm"
          style={{ background: page === 1 ? '#f8fafc' : '#f1f5f9', color: page === 1 ? '#cbd5e1' : '#475569' }}
        >
          <i className="bi bi-chevron-left" style={{ fontSize: '.75rem' }} />
        </button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-300 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="w-8 h-8 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-all text-xs font-semibold"
              style={p === page
                ? { background: 'linear-gradient(135deg,#1e3a5f,#2a4f7c)', color: '#fff' }
                : { background: '#f1f5f9', color: '#475569' }}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-all text-sm"
          style={{ background: page === totalPages ? '#f8fafc' : '#f1f5f9', color: page === totalPages ? '#cbd5e1' : '#475569' }}
        >
          <i className="bi bi-chevron-right" style={{ fontSize: '.75rem' }} />
        </button>
      </div>
    </div>
  )
}
